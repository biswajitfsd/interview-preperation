import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'warn', 'error'],
  });

  // Serve the frontend SPA from public/
  app.useStaticAssets(path.join(__dirname, '..', 'public'));

  // Serve banner/icon images from the repo's img/ directory at /img/*
  const repoRoot = path.resolve(__dirname, '../../');
  app.useStaticAssets(path.join(repoRoot, 'img'), { prefix: '/img' });

  const port = parseInt(process.env.PORT ?? '3000', 10);
  await app.listen(port);

  console.log(`\n  📚 Interview Prep Preview Server`);
  console.log(`  ─────────────────────────────────`);
  console.log(`  Local:   http://localhost:${port}`);
  console.log(`  Content: ${repoRoot}\n`);
}

bootstrap();
