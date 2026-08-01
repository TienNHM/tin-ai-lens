# TinAiLens

**Think Before You Trust.**

AI-powered Trust Assistant for the browser. Explainable trust signals — not a detector, not an oracle.

## Monorepo

```
apps/
  api          NestJS backend (optional — founder/dev)
  extension    Plasmo Chrome extension (BYOK community path)
  web          Next.js landing + privacy
packages/
  types        Zod Trust Report + analyze I/O
  ai           Provider-agnostic LLM analysis (+ browser BYOK path)
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

1. [`docs/README.md`](docs/README.md) — index + shipping snapshot  
2. `docs/00-VISION.md`  
3. `docs/03-MVP.md` (v0.2 — what ships)  
4. `docs/09-AI.md`  
5. Chrome Store pack: `apps/extension/store/LISTING.md`

## Run locally

### Extension (community / BYOK — recommended)

Users paste their own **Gemini** (recommended, free tier) or **OpenAI** API key in extension Settings. Analyze runs in the extension against the provider — no TinAiLens server, no founder API bill.

```bash
pnpm --filter @tin-ai-lens/types build
pnpm --filter @tin-ai-lens/ai build
pnpm --filter @tin-ai-lens/extension dev
# Chrome → Load unpacked → apps/extension/build/chrome-mv3-dev
# Open popup → Settings → paste key from https://aistudio.google.com/apikey
```

Keys stay in `chrome.storage.local` on the user's machine.

### Publish to Chrome Web Store

See [`apps/extension/store/LISTING.md`](apps/extension/store/LISTING.md) for listing copy, permission justifications, privacy URL, and asset checklist.

```bash
pnpm --filter @tin-ai-lens/extension package   # production zip
# Deploy apps/web so https://<domain>/privacy is public
```

### API (optional — founder/dev only)

```bash
cp apps/api/.env.example apps/api/.env   # set AI_PROVIDER + key
pnpm --filter @tin-ai-lens/api dev
```

### Landing

```bash
pnpm --filter @tin-ai-lens/web dev
# http://localhost:3000
```

