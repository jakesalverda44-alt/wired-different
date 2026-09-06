# Wired Different — website design brief

Build a **static marketing site** (HTML/CSS/JS is fine) for **Wired Different**, deployable on **Render** as a Static Site (`*.onrender.com` is fine for now). Domain planned later: `wireddifferent.io`.

Use the PNGs in `/mockups` as visual source of truth. Match the vibe closely: dark, intense, futuristic neon — but keep copy readable and professional.

---

## Brand

- **Name:** Wired Different
- **What we do:** Custom websites, custom CRMs, and AI assistants
- **Positioning:** Custom systems, not templates. Operator-first. **Not trade-specific** (no “trades-first”, electrical, HVAC targeting copy)
- **Tone:** Sharp, confident, plain English
- **Planned domain / email:** wireddifferent.io · hello@wireddifferent.io

### Hero hook (homepage — must keep)

**YOUR BUSINESS ISN'T A TEMPLATE.**  
**STOP RUNNING IT LIKE ONE.**

Subhead: Custom websites, CRMs, and AI — engineered around how your business actually runs.

---

## Visual system

- Background: near-black (`#05070C` range)
- Accents: cyan/teal (`#2EE6FF`), copper/amber (`#FF6B1A`), violet for AI (`#A855F7`)
- Typography: clean geometric sans (Inter or similar), huge headline contrast
- UI: glass cards, neon glowing borders, subtle perspective grid / HUD corner brackets
- No stock photos of people; product UI mock panels OK
- Mobile responsive

### Shared chrome

- Logo wordmark: **Wired Different** + simple geometric mark
- Nav: Services · Work · Process
- Primary header CTA: **Start a build** → consultation page
- Footer: `wireddifferent.io` (and/or hello@wireddifferent.io)

---

## Pages

### 1. Home (`index.html`) — mockup `01-homepage.png`
- Eyebrow / overline OK (e.g. SYSTEMS FOR BUSINESSES THAT BUILD or similar non-trades)
- Hook headlines as above
- CTAs: **See what custom looks like** → Work; **Book a consultation** → Consultation
- Trust strip: Field-built · Custom only · Built for operators
- Peek of three services (Websites / Custom CRMs / AI Assistants)

### 2. Services (`services.html`) — mockup `02-services.png`
- Eyebrow: WHAT WE BUILD
- Headline: **Three systems. Fully custom.**
- Sub: No packages. No templates. We engineer around how you actually run — workflows, customers, teams.
- Three cards:
  1. **Websites** (cyan) — Sites that look sharp and get leads to convert. Bullets: Fast + mobile · Built for your niche · Booking / contact that converts
  2. **Custom CRMs** (copper) — **Fully custom. Works how you work — not how everyone else does.** Bullets: Built around your pipeline · Your fields, your stages, your rules · No forcing a generic CRM
  3. **AI Assistants** (violet) — Trained on your business — follow-ups, FAQs, first-pass drafts. Bullets: After-hours replies · Draft helpers · Less falling through the cracks
- Bottom: Not sure which you need? **Book a consultation** · See the work

### 3. Work (`work.html`) — mockup `03-work.png`
- Eyebrow: SELECTED BUILDS (or WORK)
- Headline: **Custom work. Real systems.**
- Four example cards (varied — not all bid builder / not trades-only):
  1. OpsHub CRM — Custom CRM · Operations — Pipelines, customers, and teams in one system
  2. Northstar Marketing site — Website · Services — Fast site that converts visitors into leads
  3. NightDesk AI — AI Assistant · Support — Assistant that handles follow-ups after hours
  4. ClearTrack — Custom App · Operations — Track projects and approvals without spreadsheet chaos
- CTA: Have a system in mind? Start a build / Book a consultation

### 4. Process (`process.html`) — mockup `04-process.png`
- Eyebrow: HOW A BUILD WORKS
- Headline: **From your workflow to a live system.**
- Sub: No mystery agency process. Clear steps. Built around how you actually operate.
- Steps: **Discover → Design → Build → Launch** (short copy each; see mockup)
- Line: Custom for any vertical. Operator-first.
- CTA: Ready to start? **Book a consultation**

### 5. Consultation (`consultation.html`) — mockup `05-consultation.png`
- Headline: **Book a consultation.**
- Sub: Tell us what you’re running. We’ll map what to build.
- Bullets: 30-minute consultation · Custom for how your business actually runs · No package pitch — just fit
- Tagline: Built for operators, not slide decks.
- Form **Request a consultation**:
  - Name
  - Email
  - Phone
  - Business / company
  - What you need chips: Website · Custom CRM · AI Assistant · Not sure yet
  - Message: What’s broken or missing today?
  - Button: **Book a consultation**
  - Directly under button, **large:** **No obligation.**
  - Smaller: We’ll reply within one business day.
- Form can be front-end only for v1 (Formspree placeholder or mailto); document how to wire later.

---

## Render

- Static Site service
- Build command: empty or `true` (no build) if pure HTML
- Publish directory: site root
- Jake may reuse an unused Render service: point it at this repo and rename

---

## Done when

- All 5 pages match the mockup direction and shared brand
- No trades-specific positioning
- CRM line and consultation “No obligation.” are present
- Looks good on mobile
- README with Render deploy steps
