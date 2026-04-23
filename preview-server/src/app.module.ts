import { Module } from '@nestjs/common';
import { MarkdownModule } from './markdown/markdown.module';

@Module({
  imports: [MarkdownModule],
})
export class AppModule {}
