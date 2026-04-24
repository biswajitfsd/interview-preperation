# Project Codex

This folder stores project-specific Codex assets for this repository.

## Structure

- `commands/`: reusable prompts and operating modes for common work in this repo
- `skills/`: local skills with focused instructions for recurring project tasks

## Suggested uses

- Add repository-specific authoring commands for interview content creation
- Add preview-server commands for NestJS maintenance and debugging
- Add skills for recurring workflows such as generating new question batches, reviewing Markdown structure, and maintaining the preview server

## Conventions

- Keep instructions concise and specific to this repository
- Prefer Markdown files for commands and one folder per skill
- Match the repository rules in `AGENTS.md`

## Current layout

- `commands/content-editor.md`
- `commands/preview-server.md`
- `commands/nestjs-senior.md`
- `commands/nextjs-senior.md`
- `commands/nodejs-architect.md`
- `commands/nodejs-interviewer.md`
- `skills/content-batch/SKILL.md`
- `plugins/marketplace.json`
- `settings.json`
