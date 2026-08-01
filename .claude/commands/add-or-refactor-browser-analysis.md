---
name: add-or-refactor-browser-analysis
description: Workflow command scaffold for add-or-refactor-browser-analysis in tin-ai-lens.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /add-or-refactor-browser-analysis

Use this workflow when working on **add-or-refactor-browser-analysis** in `tin-ai-lens`.

## Goal

Implements or refactors browser-based AI analysis functionality, often to support BYOK (Bring Your Own Key) or optimize bundle size and compatibility.

## Common Files

- `apps/extension/lib/analyze-local.ts`
- `apps/extension/lib/byok.ts`
- `packages/ai/src/browser-analyze.ts`
- `packages/ai/package.json`
- `packages/types/src/analyze.ts`
- `packages/types/src/trust-report.ts`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Create or update analysis logic in extension/lib (e.g., analyze-local.ts, byok.ts)
- Implement or refactor browser-specific analysis entry points in packages/ai/src (e.g., browser-analyze.ts)
- Update or add type definitions in packages/types/src (e.g., analyze.ts, trust-report.ts)
- Update package.json to reflect new entry points or scripts
- Update configuration or documentation as needed

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.