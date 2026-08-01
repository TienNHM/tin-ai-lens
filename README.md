# TinAiLens

**Think Before You Trust.**

AI-powered Trust Assistant for the browser. Explainable trust signals — not a detector, not an oracle.

## Monorepo

```
apps/
  api          NestJS backend
  extension    Plasmo Chrome extension
  web          Next.js landing
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

## Run locally

```bash
# API
cp apps/api/.env.example apps/api/.env   # set AI_PROVIDER + key
pnpm --filter @tin-ai-lens/api dev

# Extension
cp apps/extension/.env.example apps/extension/.env
pnpm --filter @tin-ai-lens/extension dev
# Chrome → Load unpacked → apps/extension/build/chrome-mv3-dev

# Landing
pnpm --filter @tin-ai-lens/web dev
# http://localhost:3000
```

Keys stay server-only — never put provider secrets in the extension or web client.
