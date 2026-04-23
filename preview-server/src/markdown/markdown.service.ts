import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { marked, Renderer } from 'marked';
import hljs from 'highlight.js';

export interface FileNode {
  type: 'file';
  name: string;
  path: string;
}

export interface FolderNode {
  type: 'folder';
  name: string;
  path: string;
  children: FileNode[];
}

export type TreeNode = FileNode | FolderNode;

const FOLDER_LABELS: Record<string, string> = {
  nodejs: 'Node.js',
  python: 'Python',
  php: 'PHP',
};

const CONTENT_FOLDERS = ['nodejs', 'python', 'php'];

@Injectable()
export class MarkdownService {
  private readonly repoRoot: string;

  constructor() {
    // __dirname is dist/markdown/ in prod or src/markdown/ in dev — need ../../../
    this.repoRoot = path.resolve(__dirname, '../../../');
  }

  // ─── File tree ────────────────────────────────────────────────────────────

  getFileTree(): TreeNode[] {
    const tree: TreeNode[] = [
      { type: 'file', name: 'Home', path: 'README.md' },
    ];

    for (const folder of CONTENT_FOLDERS) {
      const folderPath = path.join(this.repoRoot, folder);
      if (!fs.existsSync(folderPath)) continue;

      const files = fs
        .readdirSync(folderPath)
        .filter((f) => f.endsWith('.md'))
        .sort(this.sortMarkdownFiles);

      tree.push({
        type: 'folder',
        name: FOLDER_LABELS[folder] ?? folder,
        path: folder,
        children: files.map((f) => ({
          type: 'file',
          name: this.formatFileName(f),
          path: `${folder}/${f}`,
        })),
      });
    }

    return tree;
  }

  // ─── Markdown rendering ───────────────────────────────────────────────────

  renderFile(relativePath: string): string {
    this.assertSafePath(relativePath);

    const absolutePath = path.join(this.repoRoot, relativePath);
    if (!fs.existsSync(absolutePath)) {
      throw new NotFoundException(`File not found: ${relativePath}`);
    }

    const raw = fs.readFileSync(absolutePath, 'utf-8');

    // Build a per-request renderer so it knows the current file's directory
    // and can correctly resolve all relative links (../README.md, ../img/…, etc.)
    const renderer = this.buildRenderer(relativePath);
    const html = marked.parse(raw, { renderer }) as string;

    // Post-process: rewrite raw HTML links/images that marked passes through unchanged
    return this.rewriteRawHtmlLinks(html, relativePath);
  }

  // ─── Per-request renderer ─────────────────────────────────────────────────

  private buildRenderer(currentFilePath: string): Renderer {
    // posix dir of the file being rendered, e.g. "nodejs" for "nodejs/1-10.md"
    const fileDir = path.posix.dirname(currentFilePath);

    const resolve = (href: string): string => {
      if (!href || href.startsWith('http') || href.startsWith('#')) return href;
      // Resolve the href relative to the file's directory → repo-root-relative posix path
      return path.posix.normalize(path.posix.join(fileDir, href));
    };

    const renderer = new Renderer();

    // ── Headings with GitHub-compatible anchor IDs ────────────────────────
    // marked v12 still calls renderer.heading(text, level, raw) where:
    //   text = rendered inner HTML, level = 1-6, raw = plain inner text
    (renderer as any).heading = (text: string, level: number, raw: string) => {
      const id = raw
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')   // remove punctuation
        .trim()
        .replace(/\s+/g, '-')        // spaces → hyphens
        .replace(/-{2,}/g, '-');     // collapse double hyphens
      return `<h${level} id="${id}">${text}</h${level}>\n`;
    };

    // ── Code blocks with syntax highlighting ──────────────────────────────
    renderer.code = (token: any) => {
      const text: string = token.text ?? token;
      const lang: string = token.lang ?? '';
      const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
      const highlighted = hljs.highlight(text, { language }).value;
      return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
    };

    // ── Images — resolve relative hrefs, serve via /img/ static route ─────
    renderer.image = (token: any) => {
      const rawHref: string = token.href ?? token;
      const title: string = token.title ?? '';
      const text: string = token.text ?? '';

      // Resolve relative path → repo-root-relative, then prefix with /
      const resolved = resolve(rawHref);
      // Map "img/..." → "/img/..." for the static route
      const src = resolved.startsWith('http') ? resolved : `/${resolved}`;

      const titleAttr = title ? ` title="${title}"` : '';
      return `<img src="${src}" alt="${text}"${titleAttr} class="md-image">`;
    };

    // ── Links — SPA navigation for .md, external in new tab ───────────────
    renderer.link = (token: any) => {
      const rawHref: string = token.href ?? token;
      const title: string = token.title ?? '';
      const tokens: any[] = token.tokens ?? [];
      const text =
        tokens.map((t) => t.raw ?? t.text ?? '').join('') || token.text || rawHref;

      const titleAttr = title ? ` title="${title}"` : '';

      // Anchor-only links (#section) pass straight through
      if (rawHref?.startsWith('#')) {
        return `<a href="${rawHref}"${titleAttr}>${text}</a>`;
      }

      // Internal .md links → SPA navigation via data attribute
      if (rawHref?.endsWith('.md') && !rawHref.startsWith('http')) {
        const resolved = resolve(rawHref);
        return `<a href="#" data-md-link="${resolved}"${titleAttr} class="md-link">${text}</a>`;
      }

      // External links
      if (rawHref?.startsWith('http')) {
        return `<a href="${rawHref}" target="_blank" rel="noopener"${titleAttr}>${text}</a>`;
      }

      return `<a href="${rawHref}"${titleAttr}>${text}</a>`;
    };

    return renderer;
  }

  // ─── Post-process raw HTML that marked passes through unchanged ──────────

  private rewriteRawHtmlLinks(html: string, currentFilePath: string): string {
    const fileDir = path.posix.dirname(currentFilePath);

    const resolve = (href: string): string => {
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('/')) {
        return href;
      }
      return path.posix.normalize(path.posix.join(fileDir, href));
    };

    // Rewrite <a href="relative.md"> → <a href="#" data-md-link="resolved">
    let result = html.replace(
      /<a\s([^>]*?)href="([^"]*?\.md)"([^>]*?)>/gi,
      (match, before, href, after) => {
        if (href.startsWith('http')) return match;
        const resolved = resolve(href);
        return `<a ${before}href="#" data-md-link="${resolved}"${after} class="md-link">`;
      },
    );

    // Rewrite <img src="relative/path"> → <img src="/resolved/path">
    result = result.replace(
      /<img\s([^>]*?)src="([^"]*?)"([^>]*?)>/gi,
      (match, before, src, after) => {
        if (src.startsWith('http') || src.startsWith('/') || src.startsWith('data:')) {
          return match;
        }
        const resolved = resolve(src);
        return `<img ${before}src="/${resolved}"${after}>`;
      },
    );

    return result;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private assertSafePath(filePath: string): void {
    const resolved = path.resolve(this.repoRoot, filePath);
    if (!resolved.startsWith(this.repoRoot)) {
      throw new BadRequestException('Invalid file path');
    }
    if (!filePath.endsWith('.md')) {
      throw new BadRequestException('Only .md files are served');
    }
  }

  private formatFileName(fileName: string): string {
    const base = fileName.replace('.md', '');
    if (base === 'README') return 'Overview';
    if (base === 'basics') return 'Basics';
    const rangeMatch = base.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) return `Questions ${rangeMatch[1]}–${rangeMatch[2]}`;
    return base.charAt(0).toUpperCase() + base.slice(1);
  }

  private sortMarkdownFiles = (a: string, b: string): number => {
    const order = ['README.md', 'basics.md'];
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    const numA = parseInt(a.match(/^(\d+)/)?.[1] ?? '0', 10);
    const numB = parseInt(b.match(/^(\d+)/)?.[1] ?? '0', 10);
    return numA - numB || a.localeCompare(b);
  };
}
