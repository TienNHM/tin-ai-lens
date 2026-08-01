# Chrome Web Store — publish pack

Use this file when filling the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).

## Package

```bash
pnpm --filter @tin-ai-lens/types build
pnpm --filter @tin-ai-lens/ai build
pnpm --filter @tin-ai-lens/extension build
# Zip: apps/extension/build/chrome-mv3-prod.zip  (Plasmo may emit zip next to folder)
# Or zip the chrome-mv3-prod folder contents (not the parent folder).
```

Upload the **production** build (`chrome-mv3-prod`), not `chrome-mv3-dev`.

## Store listing (copy-paste)

### Name
TinAiLens

### Short description (≤132 characters)
Think Before You Trust. Explainable trust signals for the page you’re reading — not a detector or oracle.

### Detailed description

TinAiLens is a calm browser Trust Assistant for Chrome.

Open an article, click Analyze, and get an explainable Trust Report: Trust Score with reasons, AI-era / clickbait / missing-source / missing-author signals, key claims, and concrete verification suggestions. You decide what to trust next.

What TinAiLens is not
• Not a fake-news oracle
• Not an “AI detector” that labels authorship as fact
• Not a censorship tool

How it works (community / free)
1. Install the extension and open Settings.
2. Paste your own Google Gemini API key (recommended free tier) or OpenAI API key.
3. Analyze the current page — the extension calls your provider directly. No TinAiLens account required.

Privacy
• API keys stay in Chrome local storage on your device.
• History stores Trust Reports only (not full page bodies).
• See the Privacy Policy linked on this listing.

Tagline: Think Before You Trust. Explain. Never judge.

### Category
Productivity (or News & Magazines — pick one; Productivity is usual for assistants)

### Language
English (primary). UI also supports Vietnamese.

## Single purpose
Help people evaluate trustworthiness of web articles by explaining trust signals, uncertainty, and verification steps.

## Permission justifications (Dashboard prompts)

**activeTab / scripting / access to website content**  
Required to extract readable text from the tab the user chooses to analyze, only after they click Analyze.

**storage**  
Store locale, BYOK API key, and optional local Trust Report history on the user’s device.

**Host permission — Google Generative Language API**  
Send analyze requests to Gemini using the user’s own API key.

**Host permission — OpenAI API**  
Send analyze requests to OpenAI using the user’s own API key (optional provider).

## Privacy policy URL
Deploy `apps/web` and use:

`https://<your-domain>/privacy`

Example local: `http://localhost:3000/privacy` (Store requires a public HTTPS URL).

Update the contact email in that page if you use a different address than `privacy@tinailens.com`.

## Assets checklist

| Asset | Spec | Status |
| --- | --- | --- |
| Extension icon | 128×128 PNG (`assets/icon.png`) | In repo; Plasmo generates size variants |
| Store icon | 128×128 | Same as extension icon |
| Screenshots | ≥1, ideally 1280×800 or 640×400 | Capture from popup (Settings + Trust Report) — see below |
| Small promo (optional) | 440×280 | Optional for first submit |
| Marquee promo (optional) | 1400×560 | Optional |

### Screenshots to capture (manual)

1. Popup main — Analyze + VI/EN (article page open behind).
2. Settings — Gemini selected, privacy note visible.
3. Trust Report — score, reasons, signals filled.
4. History — list of past reports (optional).

Save under `apps/extension/store/screenshots/` (create folder; do not commit secrets).

## Review notes (paste for reviewer)

TinAiLens analyzes the active tab only on explicit user gesture. Users bring their own Gemini/OpenAI API key; page content goes to that provider, not to a TinAiLens backend. Local history stores Trust Reports without page markdown. We do not claim content is fake/true/AI-generated as a verdict.

## Before submit

- [ ] Privacy policy live on HTTPS
- [ ] Production zip built and smoke-tested (load unpacked prod build)
- [ ] Screenshots attached
- [ ] Payment profile / one-time developer fee paid (Google requirement)
- [ ] Rotate any API keys that were ever pasted into chat or screenshots
- [ ] Remove localhost-only testing notes from public listing copy

## Version

Bump `version` in `apps/extension/package.json` for each Store upload (e.g. `0.1.0` → `0.1.1`).
