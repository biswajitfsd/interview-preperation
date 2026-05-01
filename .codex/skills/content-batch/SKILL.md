---
name: content-batch
description: Use this skill when adding or updating interview question batches in this repository while preserving numbering, Markdown consistency, and section README table of contents updates.
metadata:
  short-description: Maintain interview content batches
---

# Content Batch Skill

Use this skill when adding or updating interview question batches in this repository.

## Goals

- keep numbering continuous
- keep Markdown structure consistent
- keep topic coverage aligned with the section

## Workflow

1. Identify the target section such as `nodejs/`, `python/`, or `php/`.
2. Read that section `README.md` and nearby numbered files.
3. Continue numbering instead of renumbering older content.
4. Add or update the relevant batch file.
5. Update the section `README.md` table of contents if needed.
6. Verify headings, code fences, and links.

## Repository notes

- Root guidance lives in `AGENTS.md`.
- Content is Markdown-first; no build step is required for content-only edits.
- If the task touches `preview-server/`, validate separately with the app build flow.
