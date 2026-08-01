---
name: extension-feature-or-release-preparation
description: Workflow command scaffold for extension-feature-or-release-preparation in tin-ai-lens.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /extension-feature-or-release-preparation

Use this workflow when working on **extension-feature-or-release-preparation** in `tin-ai-lens`.

## Goal

Prepares the browser extension for release or adds major features, including updating documentation, packaging scripts, and publishing assets.

## Common Files

- `README.md`
- `apps/extension/package.json`
- `apps/extension/scripts/gen-icon.py`
- `apps/extension/assets/icon.png`
- `apps/extension/store/LISTING.md`
- `apps/extension/store/screenshots/.gitkeep`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Update README.md with new features or publishing instructions
- Modify or add packaging scripts in package.json or scripts/ directory
- Add or update assets (e.g., icons, screenshots) in the assets/ or store/ directories
- Create or update documentation files (e.g., LISTING.md, privacy policy)
- Update extension configuration files as needed

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.