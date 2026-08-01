# TinAiLens

**Think Before You Trust.**

AI-powered Trust Assistant for the browser. Explainable trust signals — not a detector, not an oracle.

## Monorepo

```
apps/
  api          NestJS backend
  extension    Plasmo Chrome extension
  web          Next.js (landing / later product surfaces)
packages/
  types        Zod Trust Report + analyze I/O
  ai           Provider-agnostic LLM analysis
  ui           Shared UI
  utils        Shared utilities
  config       TS / ESLint / Prettier bases
docs/          Vision, PRD, MVP, AI contracts
```

## Prerequisites

- Node.js ≥ 20
- pnpm 9+

## Setup

```bash
pnpm install
pnpm build
pnpm test
```

## Docs (read first)

1. `docs/00-VISION.md`
2. `docs/03-MVP.md`
3. `docs/09-AI.md`

## Current slice

- Turborepo + pnpm workspace scaffolded
- `@tin-ai-lens/types` implements Trust Report schemas from `09-AI.md`
- `ai` / `ui` / `utils` / apps are placeholders for the next slices
