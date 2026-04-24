# Repository Guidelines

## Project Structure & Module Organization

The repository is primarily a Markdown content library for interview preparation. Root files such as `README.md`, `LICENSE`, and `CLAUDE.md` describe the project and contributor workflow. Content lives in language folders: `nodejs/`, `python/`, and `php/`. Each section uses a `README.md` plus topic files like `basics.md` and numbered sets such as `1-10.md` or `31-40.md`. Images used by the docs live in `img/`.

The only runnable code is in `preview-server/`, a small NestJS app that serves the Markdown content locally. Source files are in `preview-server/src/`, static assets in `preview-server/public/`, and the export helper in `preview-server/scripts/export.mjs`.

## Build, Test, and Development Commands

Run commands from `preview-server/` when working on the local preview app:

- `npm install`: install preview-server dependencies.
- `npm run start`: start the local preview server on port `3000`.
- `npm run start:dev`: run the preview server with `nodemon` for reloads.
- `npm run build`: compile TypeScript into `preview-server/dist/`.
- `npm run export`: generate the static export used for publishing.

For content-only edits, no build step is required.

## Coding Style & Naming Conventions

Use clear, concise Markdown with consistent headings and fenced code blocks with language tags. Continue question numbering across files instead of renumbering older content. Add new question batches as new files, for example `41-50.md`, and update that section’s `README.md` table of contents.

In `preview-server/`, follow the existing TypeScript style: single quotes, semicolons, and straightforward NestJS module/service/controller naming such as `markdown.service.ts`.

## Testing Guidelines

There is no formal automated test suite yet. For content changes, verify links, numbering, and Markdown rendering. For preview-server changes, run `npm run build` and manually check the app in a browser with `npm run start`.

## Commit & Pull Request Guidelines

Recent history uses short conventional-style subjects such as `feat: ...`, `fix: ...`, and `Refactor ...`. Prefer imperative, scoped commit messages that describe the user-visible change.

Pull requests should include a short summary, affected areas (for example `nodejs/` or `preview-server/`), and screenshots when UI or rendered output changes. If you add or move content files, mention any numbering or table-of-contents updates explicitly.
