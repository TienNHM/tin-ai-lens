# TinAiLens — Problem Brief

| | |
| --- | --- |
| **Doc type** | Problem brief (decision input) |
| **Status** | Active |
| **Version** | 0.3.0 |
| **Depends on** | `00-VISION.md` |
| **Informs** | `02-PRD.md`, `03-MVP.md`, `15-BUSINESS_MODEL.md` |
| **Writing bar** | Stripe memo · Linear issue clarity · Notion scannability · full analytical depth |

> If a proposed feature does not reduce a pain or serve a JTBD in this brief, it is probably distraction.  
> This document keeps **startup structure** and **full problem analysis** — do not thin it into slogans.

---

# TL;DR

Generative AI made confident-looking content cheap. Human judgment did not get cheaper.

Users still decide what to believe, cite, share, and act on — mostly inside the browser — with broken heuristics and fragmented tools that arrive late, judge loudly, or explain poorly.

**Verification is a workflow problem, not a labeling problem.**

TinAiLens exists to provide an in-flow Trust Assistant: explain signals, show uncertainty, suggest next steps — without declaring absolute truth.

---

# 1. Problem statement

**People must make high-frequency trust decisions online under time pressure, but the cost of producing fluent, professional-looking content has collapsed while the tools for practical verification remain fragmented, judgmental, opaque, or outside the reading flow.**

Consequence: more casual errors, more cynical numbness, more tribal shortcuts, and more regret after sharing or citing.

---

# 2. Why now

| Force | Effect |
| --- | --- |
| Generative AI | Infinite fluent text/images/audio/video at near-zero marginal cost |
| Distribution | Claims spread in chats and feeds before checks catch up |
| Heuristic decay | “Looks researched” / “sounds confident” / “nice site” no longer reliable |
| Tool mismatch | Detectors, fact-checks, search, and chatbots are siloed and often post-hoc |
| Trust collapse | Users reject black-box “truth” authorities while still needing help |

**Timing thesis:** Browser assistants are finally capable enough to help *if* we refuse oracle theater and fear marketing.

---

# 3. AI Era — detailed analysis

## 3.1 What changed

Generative AI made high-quality content cheap, fast, and endless:

- articles and listicles
- social posts and comment floods
- synthetic images and thumbnails
- voice clones and video faces
- translated, paraphrased, remixable claims
- SEO pages optimized to look authoritative

The bottleneck moved from **creation** to **judgment**.

## 3.2 Abundance without comprehension

Typical session behavior:

1. Open a link from chat, search, or social  
2. Skim headline + first screen  
3. Form a provisional belief  
4. Share, save, or move on  
5. Rarely verify unless stakes feel unusually high  

AI accelerates steps 1–4.  
It does almost nothing for step 5 unless a product intervenes at the right moment.

## 3.3 The confidence problem

AI outputs often sound fluent, structured, and sourced — even when:

- citations are invented  
- sources are weak or mismatched  
- statistics are outdated  
- quotes are fabricated  
- images are synthetic  
- context is missing  
- opposing evidence is omitted  

Fluency is no longer a trust signal.  
Professional formatting is no longer a trust signal.  
“Looks researched” is no longer a trust signal.

## 3.4 Dual-use reality

AI is not only a misinformation engine. It is also:

- a writing assistant for real journalists  
- a summarizer for real research  
- a translator for real primary sources  
- a productivity tool for honest creators  

Therefore:

- **“AI-generated” ≠ untrustworthy**  
- **“Human-written” ≠ trustworthy**  

Authorship theater is insufficient. Provenance, evidence, and corroboration matter more.

## 3.5 Structural consequence

In the AI era, the scarce resource is not content.

The scarce resource is **reliable attention** — the ability to decide what deserves belief under time pressure.

TinAiLens is a product for that scarcity.

---

# 4. Information Crisis — detailed analysis

## 4.1 Definition

An information crisis occurs when people can no longer reliably distinguish:

- evidence-backed claims from confident speculation  
- primary sources from derivative summaries  
- authentic media from manipulated media  
- independent corroboration from coordinated amplification  
- uncertainty from manufactured certainty  

This is not only a “fake news” problem.  
It is a **decision quality** problem across everyday life.

## 4.2 Where it shows up

| Domain | Examples |
| --- | --- |
| Personal | Health claims, financial tips, product reviews, safety warnings, lifestyle advice |
| Professional | Research citations, market narratives, hiring signals, vendor claims, policy briefs |
| Civic | Election narratives, crisis reporting, protest footage, statistical claims about society |
| Educational | Student essays/sources, teaching materials, viral explainers entering classrooms |

## 4.3 Why the crisis feels worse now

1. **Volume** — more claims per hour than humans can inspect  
2. **Velocity** — narratives spread before verification catches up  
3. **Fidelity** — synthetic media can look “good enough”  
4. **Fragmentation** — each platform has different norms and tools  
5. **Incentives** — engagement rewards certainty and emotion  
6. **Tool mismatch** — verification tools live outside the reading flow  

## 4.4 The hidden cost

Most users do not become conspiracy theorists.

They become:

- casually wrong more often  
- more cynical about everything  
- more dependent on tribal heuristics  
- less willing to update beliefs  
- exhausted by the burden of checking  

Cynicism is not critical thinking.  
Exhaustion is not media literacy.

A useful product must reduce cognitive load while increasing verification quality.

## 4.5 Crisis framing TinAiLens rejects

Not:

- “Everything is fake”  
- “AI destroyed truth”  
- “Only our model knows reality”  

Yes:

- information quality varies  
- evidence can be surfaced  
- uncertainty can be made visible  
- humans can decide better with better lenses  

---

# 5. Fake News — detailed analysis

## 5.1 What people mean by “fake news”

In practice, users collapse many different failures into one phrase:

1. Fabricated stories  
2. Misleading headlines  
3. Out-of-context truths  
4. Partisan spin  
5. Satire mistaken as news  
6. Old events recirculated as new  
7. Unverified rumors stated as fact  
8. Coordinated influence campaigns  
9. Low-quality SEO content farms  
10. Honest errors that spread faster than corrections  

Treating all of these as one binary “fake/true” label is product malpractice.

## 5.2 Why binary fake/true fails

A claim can be:

- directionally right, poorly sourced  
- narrowly true, broadly misleading  
- false in detail, true in theme  
- true yesterday, false today  
- true in one jurisdiction, false in another  
- true as quote, false as implication  

Binary verdicts hide the actual failure mode.  
Users need to know **what kind of problem** they are looking at.

## 5.3 Fake news lifecycle

1. Seed claim appears (post, blog, anonymous tip, AI draft)  
2. Emotional packaging increases shareability  
3. Amplification through social / messaging  
4. Secondary reporting without primary checks  
5. Belief solidifies through repetition  
6. Fact-check arrives late, if at all  
7. Correction underperforms original reach  

The highest-leverage intervention is early — while the user is still reading — not days later on a separate fact-check site.

## 5.4 User behavior around fake news

Common shortcuts under time pressure:

- “It was shared by someone I trust, so probably fine”  
- “Many people are talking about it, so there must be something to it”  
- “The article looks professional”  
- “I don’t have time to check”  
- “Fact-checkers are biased anyway”  
- “I’ll share with a question mark so it’s okay”  

These are rational shortcuts under load.  
The product must work with human shortcuts, not lecture against them.

## 5.5 TinAiLens stance on fake news

TinAiLens does **not** brand itself as a Fake News Detector.

Because:

- “fake” is often contested and context-dependent  
- detector framing invites political capture narratives  
- users need explanation more than condemnation  

Instead, TinAiLens surfaces:

- claim quality  
- source quality  
- corroboration  
- missing context  
- confidence / uncertainty  
- next verification steps  

Help users see the failure mode — not just a scarlet letter.

---

# 6. Deepfake — detailed analysis

## 6.1 Scope

“Deepfake” is popular shorthand for synthetic or manipulated media, including:

- face-swap video  
- voice cloning  
- AI-generated images presented as photos  
- lightly edited real footage with misleading captions  
- hybrid media (real base + synthetic overlays)  
- cheapfakes (simple edits that still mislead)  

Not all harmful media is Hollywood-grade.  
Many high-impact lies are caption attacks on real images.

## 6.2 Why deepfakes matter

Visual and audio evidence used to feel decisive. That heuristic is breaking.

Consequences:

- authentic evidence can be dismissed as “probably AI”  
- synthetic evidence can be accepted as “looks real”  
- public discourse enters a **liar’s dividend** dynamic: deny everything, demand impossible proof  

The crisis is not only fake media existing.  
The crisis is **evidence itself becoming contested by default**.

## 6.3 Detection limits

Media forensics tools are useful but incomplete:

- detectors lag new generators  
- compressed social uploads destroy forensic traces  
- screenshots remove metadata  
- partial crops defeat some classifiers  
- model confidence can be wrongly interpreted as verdicts  
- users cannot interpret raw detector scores well  

A “73% deepfake” badge without explanation is almost useless — and sometimes harmful.

## 6.4 Real user scenarios

1. Viral political clip with no clear provenance  
2. Celebrity scandal image with no original photographer  
3. War / disaster footage recirculated from older events  
4. Product demo video that may be synthetic marketing  
5. Voice note purporting to be from a boss / relative (fraud)  
6. Classroom media literacy moments where students ask “is this real?”  

## 6.5 TinAiLens stance on deepfakes

TinAiLens should **not** say as an absolute product verdict:

- “This is a deepfake.”

TinAiLens should say things like:

- “Visual provenance is weak.”  
- “No reliable original source found.”  
- “Metadata is missing; reverse-image matches are inconsistent.”  
- “Audio characteristics suggest possible synthesis; confidence moderate.”  
- “Caption claims a 2026 event, but earliest matches are from 2019.”  

Media integrity is one trust signal among many — not a standalone oracle.

---

# 7. Trust Signals — detailed analysis

## 7.1 Definition

A **trust signal** is an observable clue that increases or decreases confidence in believing, citing, or sharing a piece of information.

Trust signals are not verdicts.  
They are inputs to human judgment.

## 7.2 Signal categories

### Source signals
- domain reputation / track record  
- author identity and expertise  
- ownership / funding transparency  
- corrections policy  
- primary vs secondary publishing role  

### Claim signals
- specificity vs vagueness  
- testability  
- presence of citations  
- citation relevance and freshness  
- absolute language (“always”, “proven”, “everyone knows”)  
- missing counter-evidence  

### Corroboration signals
- independent outlets reporting same core facts  
- disagreement among credible sources  
- single-source dependency  
- circular citation loops  
- social amplification without journalistic confirmation  

### Media integrity signals
- metadata availability  
- reverse image / video matches  
- temporal consistency (date claims vs earliest appearance)  
- compression / edit artifacts (as weak hints, not proof)  
- caption-media alignment  

### Context signals
- satire / opinion / analysis / reporting framing  
- omitted key context  
- old event framed as new  
- local news framed as global  
- cherry-picked statistics  

### Incentive signals
- sensational framing  
- engagement bait patterns  
- undisclosed sponsorship  
- political or commercial motivation indicators  
- urgency / fear packaging  

### Uncertainty signals
- conflicting evidence  
- insufficient evidence  
- model/analysis confidence ranges  
- known detector/tool limitations  
- “unknown” as an explicit state  

## 7.3 Good vs bad signal design

**A useful signal is:**

- understandable to a non-expert  
- tied to evidence the user can inspect  
- graded by confidence  
- resistant to single-point failure  
- hard to game casually  

**A bad signal is:**

- opaque  
- absolute  
- gamified  
- politically coded  
- easy to misread as a final moral judgment  

## 7.4 Composition principle

No single signal defines truth.

TinAiLens should compose multiple signals into an explainable trust view.

Examples:

- strong domain + weak citations → investigate claims carefully  
- weak provenance + high emotional framing → pause before sharing  
- multiple independent sources + clear primary docs → higher confidence  
- AI-assisted writing + excellent sourcing → not automatically low trust  

## 7.5 Trust Score implication

If TinAiLens shows a score, every material movement of that score must map to visible signals and reasons.

Otherwise the score becomes astrology.

---

# 8. Existing Solutions — landscape analysis

## 8.1 Category map

### A. AI text detectors
**Strengths:** fast; simple mental model.  
**Weaknesses:** brittle on short/edited/translated text; adversarial paraphrasing; confuses “AI-assisted” with “untrustworthy”; teaches the wrong question.

### B. Deepfake / media forensics tools
**Strengths:** specialized technical analysis; useful for investigators.  
**Weaknesses:** not browser-native for everyday users; hard to interpret; lag generators; weak on caption/context attacks.

### C. Fact-checking organizations and sites
**Strengths:** human expertise; public evidence trails; important civic function.  
**Weaknesses:** limited coverage; latency after virality; users must leave the page; perceived bias reduces adoption; not a daily reading companion.

### D. Browser safety / phishing / malware tools
**Strengths:** strong at technical security threats.  
**Weaknesses:** “safe site” ≠ “trustworthy claims.”

### E. News aggregators and credibility meters
**Strengths:** domain-level heuristics; some media literacy value.  
**Weaknesses:** coarse ratings; poor claim-level explanation; can feel political; weak on social posts/images/private pages.

### F. Search engines
**Strengths:** discovery and corroboration potential; familiar habit.  
**Weaknesses:** user must know what to query; ranking ≠ verification; SEO farms pollute results; no structured trust workflow at read-time.

### G. Chatbots / general AI assistants
**Strengths:** flexible Q&A; can summarize and compare.  
**Weaknesses:** hallucination risk; inconsistent citations; not embedded in page context by default; can sound authoritative while wrong; weak privacy defaults if users paste sensitive content casually.

### H. Platform-native labels
**Strengths:** reach at distribution points; can reduce some viral harm.  
**Weaknesses:** opaque moderation logic; inconsistent across platforms; trust depends on platform reputation; often judgment not explanation; fails outside walled gardens.

## 8.2 Shared failure of existing solutions

They are usually:

1. **Fragmented** — one threat type per tool  
2. **Late** — after belief formation  
3. **External** — away from reading flow  
4. **Judgmental** — labels over reasons  
5. **Opaque** — low explainability  
6. **Non-composed** — no unified trust picture  
7. **Engagement-adjacent** — optimized for platform goals, not user judgment  

## 8.3 What users actually do today

Improvised workflow:

1. skim  
2. maybe Google a phrase  
3. check comments  
4. ask a friend/chatbot  
5. decide under uncertainty  
6. move on  

This is not a product. It is coping.

---

# 9. Market Gap

## 9.1 Missing product category

There is no dominant **Trust Assistant** category that is:

- browser-native  
- multi-signal  
- explainable  
- privacy-aware  
- calm (non-fear marketing)  
- useful for everyday reading, not only crisis events  
- designed to improve human judgment instead of replacing it  

## 9.2 Gap statement

> People encounter information in the browser, but verification tools live elsewhere, solve only one slice of the problem, and usually return labels instead of actionable evidence.

## 9.3 Specific underserved moments

1. Reading an article and wondering “can I cite this?”  
2. Seeing a viral image and wondering “is the caption honest?”  
3. Reviewing a student source and wondering “is this credible enough?”  
4. Checking a health/finance claim before acting  
5. Evaluating a vendor / startup claim in research  
6. Deciding whether to share a post in a group chat  

These moments need a **10–60 second assist** — not a research project.

## 9.4 Why the gap persists

**Technical reasons**
- multi-signal analysis is harder than single detectors  
- explainability is expensive to design well  
- media + text + source graph composition is complex  

**Product reasons**
- “fake news detector” is an easier story to sell than “trust assistant”  
- fear marketing converts short-term  
- platforms prefer distribution control over user-owned tools  

**Trust reasons**
- users distrust black-box authority products  
- polarized audiences reject perceived referees  
- privacy concerns block browsing-analysis tools that over-collect  

## 9.5 Opportunity

A product that:

- stays in-flow  
- explains instead of judges  
- composes multiple signals  
- respects privacy defaults  
- helps users take the next verification step  

can own the Trust Assistant category before it is standardized.

## 9.6 Non-gap (already crowded)

- generic chatbots  
- pure AI detectors for classrooms  
- pure antivirus / safe-browsing  
- pure social networks  
- pure news apps  

TinAiLens should not fight those wars head-on.

---

# 10. Competitor Weakness — durable patterns

> Critiques **categories and common product patterns**, not a permanent named hit-list. Logos change; failure modes persist.

## W1 — Verdict addiction
Many tools optimize for decisive badges (Fake/AI/Safe). Errors destroy trust; edge cases create backlash; explainability is deprioritized.  
**Counter:** explanation-first; score only with reasons.

## W2 — Single-signal myopia
A great AI-text detector still fails on missing primaries, outdated stats, caption mismatch, or coordinated amplification of true-but-misleading clips.  
**Counter:** compose source, claim, media, context, corroboration, uncertainty.

## W3 — Workflow friction
Copy/paste into another site, manual uploads, long expert-only reports → everyday users skip.  
**Counter:** browser-native, fast first signal, progressive depth.

## W4 — Fear / hype positioning
“AI is flooding the world with lies — install us” acquires users quickly and brand-damages permanently.  
**Counter:** calm integrity; no panic growth loops.

## W5 — Privacy overreach
Tools that silently archive browsing content create a second trust crisis.  
**Counter:** ephemeral analysis by default; save only intentionally.

## W6 — Late-stage intervention
Fact-checks after narratives harden help the record more than the decision moment.  
**Counter:** intervene at read-time.

## W7 — Opaque authority
“Our model says so” fails in a low-trust culture.  
**Counter:** user-visible evidence, confidence ranges, explicit unknowns.

## W8 — Classroom-only / compliance-only framing
Detecting AI writing for compliance trains the wrong instincts for a Trust Assistant.  
**Counter:** human-first verification; literacy over policing.

## W9 — Platform dependence
Labels inside one network leave users unprotected elsewhere.  
**Counter:** browser companion across the open web.

## W10 — Optimizing engagement instead of judgment
Doomscrolling “fake content found” feeds corrupt the category.  
**Counter:** North Star = Verified Pause Rate, not outrage time-on-tool.

---

# 11. User Pain — detailed

## 11.1 Primary emotional pains

1. **Uncertainty fatigue** — “I don’t know what to believe anymore.”  
2. **Fear of being wrong publicly** — sharing something corrected later  
3. **Time poverty** — verification feels like homework  
4. **Skill insecurity** — “I don’t know how to check this properly”  
5. **Distrust of institutions and tools** — “Who fact-checks the fact-checkers?”  
6. **Privacy anxiety** — “I don’t want my reading analyzed and stored”  
7. **Cynical numbness** — giving up on discernment altogether  

## 11.2 Practical pains by persona

### Students
- cannot tell if a source is citable  
- overloaded with AI-written material  
- need faster quality checks for assignments  
- fear academic mistakes more than abstract “truth”  

### Journalists / researchers
- need rapid claim triage  
- must document evidence trails  
- cannot rely on vibes  
- need tools that do not invent sources  

### Knowledge workers
- make decisions from blogs, reports, vendor pages, Slack links  
- have little time for full OSINT  
- need “good enough confidence” with reasons  

### Teachers
- must teach media literacy without becoming content police  
- need classroom-friendly explanations  
- need calm tools students can understand  

### Everyday sharers
- want to avoid embarrassing reposts  
- respond to social pressure to react quickly  
- need a lightweight pause button with guidance  

## 11.3 Pain of current tool-switching

Users hate this sequence:

1. notice doubt  
2. leave page  
3. open three tabs  
4. compare conflicting answers  
5. still feel unsure  
6. give up and go with intuition  

The pain is not lack of information.  
The pain is lack of a coherent, in-place verification assist.

## 11.4 Pain of bad trust UX

Users also hate:

- scary red banners with no reasons  
- fake precision  
- moralizing language  
- being treated as gullible  
- tools that only work on English mainstream news domains  
- long reports that bury the lede  

TinAiLens must reduce pain without creating new dignity harms.

## 11.5 Critical insight

Users do not wake up wanting “an AI trust platform.”

They wake up wanting:

- not to be misled  
- not to mislead others  
- not to waste time  
- not to look careless  
- not to surrender judgment to a black box  

The product must sell relief for those pains.

---

# 12. Customer segmentation (for product focus)

## Primary

| Persona | Job pressure | Failure cost |
| --- | --- | --- |
| Student | Cite usable sources fast | Academic embarrassment |
| Journalist | Triage claims under deadline | Amplifying junk |
| Knowledge worker | Forward/decide from links | Costly wrong calls |
| Teacher | Teach verification calmly | Polarized classroom tools |

## Secondary

Everyday sharers · researchers/analysts · privacy-conscious power users · small editorial teams.

## Anti-customer (do not optimize)

Users seeking a political oracle · institutions seeking covert surveillance · growth seekers wanting addictive “gotcha” feeds.

---

# 13. JTBD (Jobs To Be Done) — full

## 13.1 Format

When I [situation], I want to [motivation], so I can [outcome].

## 13.2 Core job

**When I encounter online information that might influence my belief or action, I want to quickly understand what deserves verification and why, so I can decide with more confidence and less regret.**

## 13.3 Primary jobs

### J1 — Rapid trust triage
When I open an article, post, or media item,  
I want a fast explainable trust read,  
so I can decide whether to believe, ignore, or investigate further.

### J2 — Pre-share pause
When I am about to share something,  
I want to know what might be weak, misleading, or unverified,  
so I do not spread low-quality information.

### J3 — Citation confidence
When I need to use a source for study, work, or publishing,  
I want evidence about source and claim quality,  
so I can cite responsibly.

### J4 — Claim extraction
When a page is long or rhetorical,  
I want the key claims isolated,  
so I can verify the load-bearing statements instead of the vibes.

### J5 — Evidence navigation
When doubt appears,  
I want suggested next verification steps and sources,  
so I know what to do in the next 60 seconds.

### J6 — Media provenance check
When I see an image/video/audio claim,  
I want provenance and consistency signals,  
so I can judge whether the media supports the caption.

### J7 — Uncertainty clarity
When evidence conflicts or is incomplete,  
I want the uncertainty stated clearly,  
so I do not mistake silence or fluency for proof.

### J8 — Save for later verification
When I cannot finish checking now,  
I want to save claims/evidence intentionally,  
so I can return without losing context.

## 13.4 Secondary jobs

### J9 — Teach verification
When I teach students or onboard a team,  
I want a calm shared language for trust signals,  
so media literacy becomes practice, not lecture.

### J10 — Compare corroboration
When one outlet makes a strong claim,  
I want to see whether independent sources align,  
so I can avoid single-source overconfidence.

### J11 — Detect rhetorical manipulation (light)
When content uses fear, urgency, or absolute language,  
I want those patterns surfaced neutrally,  
so I can separate emotional packaging from evidence.

### J12 — Privacy-preserving analysis
When I analyze sensitive reading material,  
I want ephemeral processing by default,  
so I can verify without creating a surveillance trail.

## 13.5 Jobs TinAiLens should not take

- Decide political truth for the user  
- Replace professional investigation / legal discovery  
- Act as parental surveillance of all browsing  
- Become a general chatbot companion  
- Become a social feed for “fake content of the day”  
- Guarantee correctness of world events  

## 13.6 Job success criteria

A job is well-served when the user can answer:

1. What matters here?  
2. Why might this be weak or strong?  
3. How sure should I be?  
4. What is the next useful action?  

If the product only answers “trust score = 42”, the job is not done.

## 13.7 MVP job priority (problem-driven)

1. J1 Rapid trust triage  
2. J2 Pre-share pause  
3. J4 Claim extraction  
4. J5 Evidence navigation  
5. J7 Uncertainty clarity  

---

# 14. Opportunity thesis

If we own read-time, explainable, multi-signal trust assistance with privacy defaults, we can define the Trust Assistant category before it standardizes around detectors and platform labels.

**Wedge:** Chromium extension for articles/text-heavy pages → expand media, saves, teams/classroom, API.

**Moat candidates (earned, not claimed):**

- policy + UX discipline (explain/never judge) that competitors abandon under pressure  
- grounding/eval harness quality  
- workflow habit at decision moment  
- brand of calm integrity  

---

# 15. Problem → Product constraints

Any credible solution must:

1. Work in the browser at read-time  
2. Explain signals, not only label outcomes  
3. Handle text + claims (+ basic media provenance over time)  
4. Show uncertainty explicitly  
5. Default to privacy-preserving analysis  
6. Be fast enough for real sessions  
7. Avoid fear UX and verdict addiction  
8. Help users take a next verification action  

If a proposed feature does not reduce a pain or serve a JTBD above, it is probably distraction.

---

# 16. Cost of inaction

| If unsolved | Likely outcome |
| --- | --- |
| For users | More regret shares/cites; deeper cynicism |
| For institutions | Weaker research/education hygiene |
| For market | Detectors + platform labels define “trust UX” as judgment theater |
| For TinAiLens | Category defined by fear products we refuse to become |

---

# 17. Decision

We will build TinAiLens as a **Trust Assistant**, not a detector.

We will measure progress by **Verified Pause Rate** and explanation quality — not by how often we sound certain.

Full product contract: `02-PRD.md`.  
Constitution: `00-VISION.md`.

---

# Appendix — One-line reminders for agents

- AI era problem = judgment scarcity, not content scarcity  
- Fake news word is overloaded; design for failure modes  
- Deepfake problem includes caption attacks + liar’s dividend  
- Trust signals compose; they don’t crown a king  
- Alternatives fail on timing, scope, tone, privacy, explainability  
- Gap = in-flow explainable verification  
- JTBD > feature brainstorm  
- Do not delete analytical sections to “make docs shorter” without founder approval  

---

# Closing

The problem is not that people stopped caring about truth.

The problem is that caring no longer scales against machine-speed content.

TinAiLens exists to restore practical discernment at the point of reading — not by judging for users, but by giving them a clearer lens.
