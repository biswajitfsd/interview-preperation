#!/usr/bin/env node
// Pre-renders all markdown pages into a self-contained static site at dist-static/.
// Detects the GitHub Pages base path from GITHUB_REPOSITORY, or accepts --base=/path.

import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const serverDir  = join(__dirname, '..');        // preview-server/
const repoRoot   = join(serverDir, '..');         // repo root
const outDir     = join(serverDir, 'dist-static');
const PORT       = 3099;

const basePath = (() => {
  const ghRepo = process.env.GITHUB_REPOSITORY;
  if (ghRepo) return '/' + ghRepo.split('/')[1];
  const arg = process.argv.find(a => a.startsWith('--base='));
  return arg ? arg.slice(7) : '';
})();

async function waitForServer(retries = 40) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`http://localhost:${PORT}/api/files`);
      if (res.ok) return;
    } catch {}
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error('Server did not start within 20 seconds');
}

async function main() {
  if (existsSync(outDir)) rmSync(outDir, { recursive: true });
  mkdirSync(outDir, { recursive: true });

  const server = spawn('node', ['dist/main.js'], {
    cwd: serverDir,
    env: { ...process.env, PORT: String(PORT) },
    stdio: ['ignore', 'ignore', 'inherit'],
  });

  server.on('error', err => { throw err; });

  try {
    process.stdout.write('Waiting for server');
    await waitForServer();
    console.log(' ready');

    // Fetch file tree
    const treeRes = await fetch(`http://localhost:${PORT}/api/files`);
    const tree = await treeRes.json();

    // Collect all file paths referenced in the tree
    const paths = new Set(['README.md']);
    for (const node of tree) {
      if (node.type === 'file') {
        paths.add(node.path);
      } else if (node.type === 'folder') {
        for (const child of node.children) paths.add(child.path);
        paths.add(`${node.path}/README.md`);
      }
    }

    // Render each page; rewrite absolute image/link paths to include basePath
    const files = {};
    for (const p of paths) {
      const res = await fetch(`http://localhost:${PORT}/api/render?path=${encodeURIComponent(p)}`);
      if (res.ok) {
        let { html } = await res.json();
        if (basePath) {
          // src="/img/..." → src="${basePath}/img/..."
          html = html.replace(/src="\/img\//g, `src="${basePath}/img/`);
          // href="/img/..." → href="${basePath}/img/..." (unlikely but safe)
          html = html.replace(/href="\/img\//g, `href="${basePath}/img/`);
        }
        files[p] = html;
        console.log(`  rendered ${p}`);
      } else {
        console.warn(`  skipped  ${p} (${res.status})`);
      }
    }

    // Write content.js — base path + pre-rendered tree and pages
    const contentJs =
      `window.__BASE__=${JSON.stringify(basePath)};` +
      `window.__CONTENT__=${JSON.stringify({ tree, files })};`;
    writeFileSync(join(outDir, 'content.js'), contentJs);

    // Copy index.html; inject content.js just before </head>
    let indexHtml = readFileSync(join(serverDir, 'public', 'index.html'), 'utf-8');
    indexHtml = indexHtml.replace('</head>', '  <script src="content.js"></script>\n</head>');
    writeFileSync(join(outDir, 'index.html'), indexHtml);

    // 404.html — stores the deep-link path and redirects to the SPA root.
    // index.html reads sessionStorage.__redirect on load and restores navigation.
    const spaRoot = basePath ? basePath + '/' : '/';
    writeFileSync(join(outDir, '404.html'), `<!DOCTYPE html>
<html>
<head>
<script>
sessionStorage.setItem('__redirect', location.pathname + location.search + location.hash);
</script>
<meta http-equiv="refresh" content="0; url=${spaRoot}">
</head>
<body>Redirecting&hellip;</body>
</html>
`);

    // Copy img/ directory (Git LFS banner images)
    const imgSrc = join(repoRoot, 'img');
    if (existsSync(imgSrc)) {
      cpSync(imgSrc, join(outDir, 'img'), { recursive: true });
      console.log('  copied   img/');
    }

    console.log(`\nExported ${Object.keys(files).length} pages → ${outDir}`);
    if (basePath) console.log(`Base path: ${basePath}`);
  } finally {
    server.kill();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
