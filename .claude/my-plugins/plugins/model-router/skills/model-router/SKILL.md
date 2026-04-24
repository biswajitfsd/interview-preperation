---
name: model-router
description: Use when spawning Agent subagents to select the right model based on task type
version: 1.0.0
---

When spawning subagents via the Agent tool, always set the model explicitly:

| Task type | Model |
|-----------|-------|
| Bash scripts, file ops, grep/find, simple edits, formatting | `haiku` |
| Codebase exploration, quick lookups, read-only research | `haiku` |
| Planning, architecture, multi-file changes, debugging | `sonnet` |
| Difficult implementation, complex refactors | `sonnet` |
| Major architectural decisions (use sparingly) | `opus` |

**Default rule**: use `haiku` first — upgrade to `sonnet` only when the task needs reasoning, judgment, or multi-step implementation.
