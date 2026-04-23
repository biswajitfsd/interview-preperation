# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a static markdown-based interview preparation resource covering Node.js, Python, and PHP. It contains curated interview questions and answers for technical interview preparation.

## No Build System

There are no build, lint, or test commands — this is a pure documentation repository. All content is markdown files; no code executes.

## Content Structure

Each language section follows this pattern:
- `<lang>/README.md` — overview and table of contents with links to question files
- `<lang>/basics.md` — foundational concepts for the language
- `<lang>/1-10.md`, `11-20.md`, etc. — interview questions grouped in sets of 10

**Current state**: Node.js content is actively developed (30+ questions + basics). Python and PHP sections have README templates only; content files are not yet created.

## Content Conventions

Questions are numbered continuously across files. Each question entry follows:
1. A numbered heading with the question
2. Explanation paragraphs
3. Code block examples (language-tagged fenced blocks)
4. Do's and Don'ts or pitfall callouts where applicable

When adding new questions:
- Continue the numbering from where the last file ends
- Create new numbered files (e.g., `31-40.md`) rather than extending existing ones
- Update the `README.md` table of contents in the same language folder to link the new file

## Git LFS

The repository uses Git LFS for images in `img/`. Banner images follow the naming pattern `<Language> Banner@2x.png`.

## Environment

This machine runs Windows 11 with Ubuntu WSL (Ubuntu on `/mnt/d/...`). Always use WSL for:
- Git operations: `wsl -e bash -c "cd /mnt/d/projects/interview-preperation && git ..."`
- Node.js / npm commands: `wsl -e bash -c "source ~/.nvm/nvm.sh && cd /mnt/d/projects/interview-preperation/preview-server && ..."`
- The `preview-server` must be started from WSL due to `--no-bin-links` npm install (no symlinks on NTFS).
- WSL path for the repo: `/mnt/d/projects/interview-preperation`
