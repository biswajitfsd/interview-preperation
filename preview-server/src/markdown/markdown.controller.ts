import { Controller, Get, Query, HttpCode, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import { MarkdownService, TreeNode } from './markdown.service';

@Controller()
export class MarkdownController {
  constructor(private readonly markdownService: MarkdownService) {}

  // ── API ────────────────────────────────────────────────────────────────────

  @Get('api/files')
  @HttpCode(200)
  getFileTree(): TreeNode[] {
    return this.markdownService.getFileTree();
  }

  @Get('api/render')
  @HttpCode(200)
  renderFile(@Query('path') filePath: string): { html: string; path: string } {
    const html = this.markdownService.renderFile(filePath ?? 'README.md');
    return { html, path: filePath ?? 'README.md' };
  }

  // ── SPA shell — language routes ────────────────────────────────────────────
  // These routes serve the SPA index.html. The frontend JS reads
  // window.location.pathname and navigates to the correct file.
  //
  //   /nodejs          → SPA, frontend loads nodejs/README.md
  //   /nodejs/1-10     → SPA, frontend loads nodejs/1-10.md
  //   /python          → SPA, frontend loads python/README.md
  //   /php             → SPA, frontend loads php/README.md

  @Get(':lang')
  serveLangRoot(@Param('lang') lang: string, @Res() res: Response) {
    if (!this.isLangFolder(lang)) {
      return res.status(404).send('Not found');
    }
    return res.sendFile(path.join(__dirname, '../../public/index.html'));
  }

  @Get(':lang/:file')
  serveLangFile(
    @Param('lang') lang: string,
    @Param('file') file: string,
    @Res() res: Response,
  ) {
    if (!this.isLangFolder(lang)) {
      return res.status(404).send('Not found');
    }
    return res.sendFile(path.join(__dirname, '../../public/index.html'));
  }

  private isLangFolder(lang: string): boolean {
    return ['nodejs', 'python', 'php'].includes(lang);
  }
}
