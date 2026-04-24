# GEMINI.md - Project Context & Instructions

This repository is a comprehensive interview preparation resource for **Node.js**, **Python**, and **PHP**, combined with a **NestJS** preview server for local content rendering.

## 🚀 Project Overview

- **Purpose**: A centralized library of technical interview questions, answers, and best practices.
- **Content Structure**: Organized by language into `nodejs/`, `python/`, and `php/` directories.
- **Preview Tooling**: Includes a NestJS application (`preview-server/`) that renders the Markdown content into a readable local web interface.
- **Tech Stack**:
    - **Documentation**: Markdown (GFM).
    - **Preview Server**: TypeScript, NestJS, Express, Marked (for MD parsing), Highlight.js (for syntax highlighting).
    - **Automation**: GitHub Workflows for deployment.

## 📂 Key Directories

- `nodejs/`, `python/`, `php/`: Language-specific interview content.
- `preview-server/`: The source code for the local preview application.
- `img/`: Shared assets and banners used across the documentation.
- `.claude/`, `.codex/`: Configuration and specialized instructions for AI assistants.

## 🛠️ Building and Running

### Preview Server (NestJS)
All runnable commands should be executed within the `preview-server/` directory:

```bash
# Navigate to the server directory
cd preview-server

# Install dependencies
npm install

# Run in development mode (with hot-reload)
npm run start:dev

# Build for production
npm run build

# Generate a static export of the content
npm run export
```

The preview server typically runs on port `3000` once started.

## ✍️ Development Conventions

### Content Updates
- **File Naming**: Use `basics.md` for foundational topics and numbered ranges (e.g., `1-10.md`, `11-20.md`) for batches of questions.
- **Structure**: Each question should include a detailed explanation, code examples, common pitfalls, and best practices.
- **Linking**: Maintain cross-links between the root `README.md` and category-specific `README.md` files. Update tables of contents when adding new files.

### Code Style (Preview Server)
- **Language**: TypeScript.
- **Pattern**: Follow standard NestJS modular architecture (Modules, Controllers, Services).
- **Formatting**: Single quotes, semi-colons, and 2-space indentation (consistent with existing `.ts` files).

### Contributions
- Follow a branch-and-PR workflow.
- Use conventional-style commit messages (e.g., `feat:`, `fix:`, `docs:`).
- Verify Markdown rendering locally using the preview server before submitting changes.
