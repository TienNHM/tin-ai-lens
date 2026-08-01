# TinAiLens — MVP Spec

| | |
| --- | --- |
| **Doc type** | MVP build contract |
| **Status** | Active |
| **Version** | 0.2.0 |
| **Depends on** | `00-VISION.md` (wins on conflict), `01-PROBLEM.md`, `02-PRD.md` |
| **Informs** | Architecture · Extension · AI · Types · Web · Chrome Store |
| **Conflict rule** | Vision Tenets/Golden Rules → this MVP cut → PRD detail. When PRD expands beyond this cut, **defer** — do not silently re-expand MVP. |

---

## Spec contract

This document defines what ships as the first usable product.

- Agents and engineers implement **only** features listed in §3.
- Anything in PRD marked P0 but deferred here (account, cloud save, paid plans) is **out of MVP**.
- Launch quality still requires Vision Golden Rules and the acceptance bars in §6 — not “feature complete” alone.
- AI I/O and Trust Report schema live in `09-AI.md`; this doc owns product scope and UX bars.

### v0.2 shipping delta (community)

Relative to v0.1 paper MVP:

| Change | Rule |
| --- | --- |
| Analyze path | **BYOK serverless** is the community default: extension → user’s Gemini/OpenAI key → provider. NestJS `POST /analyze` is **optional** (founder/dev). |
| Persistence | **Local Trust Report history** allowed (`chrome.storage.local`). **Never** store full page markdown in history. |
| Settings | Local Settings for provider + API key + locale (VI/EN). No account. |
| Secrets | User keys stay on-device. Founder provider keys stay server-only if using the optional API. |
| Web | Landing + public Privacy Policy (`/privacy`) for Chrome Web Store. |

---

# 1. One-liner

**Analyze the page you’re reading → get an explainable Trust Report → decide what to verify next.**

TinAiLens MVP is a browser Trust Assistant wedge: one gesture, one panel, explainable signals — never a detector, oracle, or censorship tool.

---

# 2. Goals for this cut

| ID | Goal |
| --- | --- |
| M1 | User can analyze a text-heavy article page from the extension |
| M2 | User sees Trust Score **only with** reasons + confidence |
| M3 | User sees AI / clickbait / missing-source / missing-author signals with explanations |
| M4 | User gets key claims, a calm summary, and concrete suggestions |
| M5 | No login; no cloud store of page bodies; analysis uses the user’s provider key (BYOK) |
| M6 | Copy and UI never use banned verdict language |
| M7 | User can reopen recent Trust Reports from local history |
| M8 | UI works in Vietnamese (default) and English |

**North Star (proxy):** Verified Pause Rate — user completes analysis and engages a next step (open suggestion, re-read reasons, or reconsider share/cite intent).

---

# 3. In scope (exact)

| ID | Feature | Surface | Notes |
| --- | --- | --- | --- |
| MVP-01 | Analyze Current Page | Extension | User gesture only |
| MVP-02 | Trust Score | Extension | 0–100 or withheld; always + reasons + confidence |
| MVP-03 | AI Signals | Extension | Explainable stylistic/provenance *signals* — not “AI-generated” verdicts |
| MVP-04 | Clickbait Signals | Extension | Rhetoric / headline–body mismatch style signals |
| MVP-05 | Missing Source Signals | Extension | Weak or absent sourcing |
| MVP-06 | Missing Author Signals | Extension | Weak or absent authorship attribution |
| MVP-07 | Claim Extraction | Extension | Default 3–7 load-bearing claims |
| MVP-08 | Summary | Extension | Short trust-oriented summary of what matters |
| MVP-09 | Suggestions | Extension | Actionable next verification steps |
| MVP-10 | Local history | Extension | Cap ~20 Trust Reports; delete one / clear all; no page markdown |
| MVP-11 | BYOK Settings | Extension | Gemini (recommended) or OpenAI; key in `chrome.storage.local` |
| MVP-12 | Locale VI/EN | Extension | Default `vi`; persisted locally |

Supporting platform work required to ship the above (not separate product features):

- Content extraction (Mozilla Readability → clean HTML → Markdown)
- Shared Trust Report types (`packages/types`, defined in `09-AI.md`)
- Browser-safe analyze path (`packages/ai` BYOK / fetch) + optional NestJS `POST /analyze` for founder/dev
- Minimal policy filter for banned phrases
- Landing + Privacy Policy for store / install trust

---

# 4. Out of scope

Do **not** build in MVP:

| Category | Examples |
| --- | --- |
| Identity | Login, accounts, OAuth, browser sync of settings/history |
| Commerce | Payment, plans, trials, billing, hosted freemium quota |
| Persistence | Cloud save, local archive of **full page bodies**, cross-device history |
| Social | Community, feeds, sharing walls, “report fake” networks |
| Enterprise | SSO, admin consoles, team workspaces, classroom packs |
| Depth features | External corroboration / retrieval tools, media deepfake provenance, OCR, video/audio pipelines |
| PRD P1+ | Selection analyze, copy evidence pack, settings sync, optional account |
| Infra premature | Redis/BullMQ queues; mandatory hosted analyze backend for end users |
| Web product | Full web app for saves/settings — landing + privacy only |

---

# 5. Primary flow

```
User opens Settings (first run) → pastes Gemini or OpenAI API key (local)
User clicks Analyze
  → Extension extracts HTML (active tab, user gesture)
  → Mozilla Readability
  → Clean HTML → Markdown
  → Extension analyze (BYOK): truncate → prompt → provider HTTPS → soft/schema validate
  → Policy filter + grounding (snippets ⊆ markdown)
  → Extension renders one Trust Report panel
  → Optionally append Trust Report to local history (no markdown)
```

**Optional founder/dev path:** extension → `POST /analyze` NestJS → `packages/ai` with server env keys. Not required for community Chrome Store builds.

### Session states (MVP)

`idle → extracting → analyzing → ready | insufficient | error → dismissed`

- One in-flight analysis per tab; debounce rapid clicks.
- Cancel/dismiss is calm; no scare notifications.
- Offline / provider timeout → clear error; no pretend success.
- Missing API key → Settings gate (not a silent failure).

### Content targets

| Supported (best-effort) | Insufficient / guided |
| --- | --- |
| Article / text-heavy pages | Homepages, infinite feeds, mixed multi-item pages |
| Longform posts with readable main content | Image-only / video-only without usable text |
| | Paywalled / empty extraction → recovery copy + retry |

---

# 6. Feature acceptance criteria

## MVP-01 Analyze Current Page

- **AC01.1** Toolbar (or equivalent) entry triggers analysis only on user gesture; never on bare page load.
- **AC01.2** Supported article yields a first useful result within latency bars (§8).
- **AC01.3** Extraction failure → calm recovery (retry / unsupported), not a fake report.
- **AC01.4** Result panel follows UX hierarchy (§7).
- **AC01.5** No banned verdict phrases in UI chrome or report copy.

## MVP-02 Trust Score

- **AC02.1** Score never shown without ≥1 human-readable reason.
- **AC02.2** Confidence is visible alongside score (or alongside withheld-score state).
- **AC02.3** If reasons unavailable or confidence/coverage below threshold → `trustScore = null`; UI leads with uncertainty.
- **AC02.4** Low scores do not use “FAKE” labeling, red-alert theater, or equivalent verdict styling.
- **AC02.5** Score is a navigation aid: copy never equates low→false or high→true.

## MVP-03 AI Signals

- **AC03.1** Signals explain observable patterns (e.g. high fluency with thin sourcing, template-like structure, missing disclosure) — never “This is AI-generated.”
- **AC03.2** Each surfaced signal includes explanation; optional evidence snippet when grounded in page text.
- **AC03.3** Absent/unknown → explicit unknown, not invented detector certainty.
- **AC03.4** UI framing: “signals to notice,” not authorship verdict.

## MVP-04 Clickbait Signals

- **AC04.1** Detect and explain rhetoric risks (sensational headline, curiosity gap, mismatch with body) when evidence exists.
- **AC04.2** Explanation required; no badge-only “CLICKBAIT” stamp as a moral verdict.
- **AC04.3** When not applicable → not forced; do not invent.

## MVP-05 Missing Source Signals

- **AC05.1** Surface weak/absent citations, unnamed “experts,” or unlinked statistics when observable.
- **AC05.2** Missing data → unknown/missing explained; never invent outlet reputation or fake citations.
- **AC05.3** Tied to reasons and/or suggestions where useful.

## MVP-06 Missing Author Signals

- **AC06.1** Surface missing, anonymous, or unclear authorship when observable (DOM meta + content).
- **AC06.2** Do not invent author identity.
- **AC06.3** Explain why attribution matters for verification — calmly.

## MVP-07 Claim Extraction

- **AC07.1** Default 3–7 primary claims for a long article.
- **AC07.2** Claims are plain language; not raw paragraph dumps.
- **AC07.3** Claim types distinguish factual assertion, opinion, prediction, statistic, quote, other — opinion not framed as verified fact.
- **AC07.4** No clear claims → empty/insufficient honesty; do not invent claims.
- **AC07.5** Snippet/locator when possible; snippets must be grounded in extracted text.

## MVP-08 Summary

- **AC08.1** Short summary oriented to trust triage (what to notice), not a generic article TL;DR alone.
- **AC08.2** Summary does not issue true/false/AI verdicts.
- **AC08.3** Reflects uncertainty when coverage is limited.

## MVP-09 Suggestions

- **AC09.1** ≥1 concrete next step on `ready` / partial success.
- **AC09.2** Steps are specific (what to check, where conceptually) — not “be careful.”
- **AC09.3** No harassment, brigading, or “destroy the author” guidance.
- **AC09.4** High-stakes health/finance claims may add qualified-professional caution without fear spam.

## MVP-10 Local history

- **AC10.1** After a successful analyze (`ready`, or `insufficient` with a report body), store a Trust Report entry locally (cap ~20, newest first).
- **AC10.2** Stored fields may include url/title metadata + report; **must not** include page markdown.
- **AC10.3** User can reopen an entry, delete one entry, or clear all.
- **AC10.4** History is device-local only — no cloud sync in MVP.

## MVP-11 BYOK Settings

- **AC11.1** Settings lets the user choose Google Gemini or OpenAI and save an API key locally.
- **AC11.2** Analyze is blocked with a calm Settings CTA when no key is configured.
- **AC11.3** UI discloses that keys stay on-device and that calls go to the chosen provider (not a TinAiLens analyze backend).
- **AC11.4** User can remove the stored key.

## MVP-12 Locale VI/EN

- **AC12.1** Default locale is Vietnamese (`vi`); English available.
- **AC12.2** Locale preference persists locally.
- **AC12.3** User-facing report prose follows the requested locale (see `09-AI.md` / prompt contract).

---

# 7. UX hierarchy & copy

### One panel hierarchy

1. Trust Score + confidence (or withheld-score / insufficient state)
2. Summary
3. Top reasons / trust signals (including AI, clickbait, source, author groups)
4. Claims
5. Suggestions

Principles (from Vision / PRD):

- One action → one result.
- Calm, minimal, professional (Arc / Linear / Notion / Stripe / Apple-inspired — not flashy).
- Explain before scoring; uncertainty is information.
- Human makes the final decision.

### Banned conclusions (user-facing)

- “This is fake.” / “This is true.”
- “This is AI-generated.” / “This is AI.” (as a verdict)
- “Confirmed propaganda.” / “Believe this.” / “Ignore this.”

### Preferred framing

- “Confidence moderate because…”
- “Worth verifying before sharing.”
- “Insufficient evidence to score confidently.”
- “Signal: … Why it matters: …”

Full voice: Vision brand + Golden Rules.

---

# 8. Non-functional bars (MVP)

| ID | Bar |
| --- | --- |
| LAT-1 | P50 time-to-first-useful-result ≤ 5s for typical article (target; provider-dependent on BYOK) |
| LAT-2 | P95 time-to-complete-analysis ≤ 15s for typical article (target; BYOK may need longer soft timeout, e.g. 120s hard abort) |
| LAT-3 | Hard analyze timeout; calm retry; never fabricate a complete report on timeout |
| PRIV-1 | **No** permanent storage of analyzed page bodies (history = Trust Report only) |
| PRIV-2 | Logs (optional API) minimize PII and raw body content |
| PRIV-3 | Telemetry excludes raw page body by default |
| PRIV-4 | BYOK keys only in `chrome.storage.local`; never uploaded to TinAiLens |
| SEC-1 | Treat page content as untrusted (prompt-injection resistant) |
| SEC-2 | TLS to providers; founder secrets never in the extension binary |
| SEC-3 | Least-privilege extension permissions (`activeTab` / scripting / storage + provider hosts) |
| SAFE-1 | Banned verdict phrases filtered on user-facing outputs |
| REL-1 | Idempotent analyze via `requestId` |
| REL-2 | Community BYOK: rely on provider rate limits; optional API may throttle by IP |
| A11Y-1 | Panel keyboard-navigable; do not encode meaning by color alone |

Redis/BullMQ: **not required**. Hosted NestJS analyze is **optional**; community path is BYOK in-extension.

---

# 9. Privacy & data

| Topic | MVP rule |
| --- | --- |
| Default | Analyze with user’s provider; page body not kept after analyze |
| History | Local Trust Reports only; user-deletable |
| Backend | Optional; if used, short request lifecycle; must not productize permanent page-body history |
| Auth | None |
| BYOK | User Gemini/OpenAI key on-device |
| Public policy | `/privacy` on the marketing site for Chrome Web Store |

This still satisfies Vision T5 / Golden Rule 4: we do not build a cloud archive of what people read. Local report history is an on-device convenience, not a surveillance store.

---

# 10. Explicit PRD deltas (deferred)

These appear as MVP/P0 in `02-PRD.md` but remain **deferred** (or narrowed) by this cut:

| PRD item | Deferral / narrowing |
| --- | --- |
| G6 Ephemeral + explicit save/delete | Local Trust Report history only; **no** save of page bodies; cloud save deferred |
| F07 Save Analysis | Narrowed to local report history (MVP-10), not cloud |
| F08 Delete / Manage Saved | Local delete/clear only |
| F09 Ephemeral Mode Default | Page bodies remain ephemeral; reports may be local |
| F14 Optional Account | Deferred |
| F15 Settings | **In scope** as BYOK + locale (MVP-11/12); no cloud sync |
| F16 Saved History | Narrowed to local-only Trust Reports |
| G9 Account + sync | Deferred |
| Hosted freemium / Stripe | Deferred |
| Queue / workers | Deferred until forced by scale |
| Selection analyze (F11), Copy pack (F10) | Deferred P1 |

Agents must not “helpfully” reintroduce login, billing, or cloud page archives to satisfy PRD numbering.

---

# 11. Success metrics (lightweight)

MVP does not need a full analytics platform. Prefer privacy-preserving event counts:

| Proxy | Meaning |
| --- | --- |
| Analyze completed (`ready` / `insufficient`) | Funnel health |
| Suggestion engagement (click / expand) | Pause → next step |
| Reason expand / claim expand | Explanation usefulness |
| History reopen | Report usefulness beyond one session |
| Policy filter hits | Safety drift |
| Error / timeout rate | Reliability (including provider timeouts) |

Do **not** optimize for fear engagement, doom dwell time, or “AI detected” badge impressions.

---

# 12. Build sequence after this doc

1. `09-AI.md` Trust Report + policy (companion contract)
2. Turborepo scaffold + `packages/types` Zod schemas
3. `packages/ai` provider-agnostic analyze (+ browser BYOK path)
4. `apps/extension` extract → BYOK analyze → Trust Report UI + history + settings + i18n
5. Optional `apps/api` `POST /analyze` for founder/dev
6. `apps/web` landing + `/privacy`
7. Chrome Web Store pack (`apps/extension/store/LISTING.md`)

---

# Closing

MVP success is a calm, explainable Trust Report in the browser — with user-owned AI keys and on-device privacy — not a larger feature list.

**Explain. Never judge.**  
**Think Before You Trust.**
