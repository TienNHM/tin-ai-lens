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
- `@tin-ai-lens/types` — Trust Report + analyze I/O Zod schemas
- `@tin-ai-lens/ai` — provider-agnostic `analyzeContent` (OpenAI / Anthropic / Gemini / OpenRouter), policy filter, grounding, versioned prompts
- `@tin-ai-lens/api` — NestJS `POST /analyze` + `GET /health` + Swagger `/docs` (ephemeral, rate-limited)
- Extension / web / ui remain next

### Run API

```bash
cp apps/api/.env.example apps/api/.env
# set AI_PROVIDER + API key
pnpm --filter @tin-ai-lens/api dev
```

- Health: `GET http://localhost:3001/health`
- Analyze: `POST http://localhost:3001/analyze`
- Swagger: `http://localhost:3001/docs`

Keys stay server-only — never put them in the extension.
