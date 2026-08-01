# TinAiLens docs

Conflict rule (unchanged): **Vision → MVP cut → PRD detail → AI contract**.

| Doc | Role |
| --- | --- |
| [`00-VISION.md`](00-VISION.md) | Product identity, tenets, Golden Rules |
| [`01-PROBLEM.md`](01-PROBLEM.md) | Problem framing |
| [`02-PRD.md`](02-PRD.md) | Full product requirements (includes deferred items) |
| [`03-MVP.md`](03-MVP.md) | **What ships now** — build contract |
| [`09-AI.md`](09-AI.md) | Trust Report schema, prompts, AI pipeline |

Related non-docs:

- Extension Chrome Store pack: [`apps/extension/store/LISTING.md`](../apps/extension/store/LISTING.md)
- Public privacy page: `apps/web` → `/privacy`

## Shipping snapshot (community)

- **Surface:** Chrome extension (Plasmo)
- **Analyze path:** BYOK serverless — user Gemini/OpenAI key → extension → provider (no TinAiLens analyze server required)
- **Optional:** NestJS `POST /analyze` for founder/dev only
- **Local:** locale VI/EN, Trust Report history (no page markdown), Settings for API key
- **Web:** landing + privacy policy
