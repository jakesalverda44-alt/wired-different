# Wired Different

Marketing site for **Wired Different** — custom websites, custom CRMs, and AI assistants
for operators who don't want to run their business off a generic template.

Pure static site. No build step, no framework, no npm dependencies. Every page is
hand-written HTML sharing the same header/footer markup, one shared stylesheet, and one
small vanilla JS file.

## File layout

```
wired-different/
  index.html            Home
  services.html         Services (Websites / Custom CRMs / AI Assistants)
  work.html             Selected work / case studies
  process.html          Discover → Design → Build → Launch
  consultation.html     Consultation request form
  404.html              Not-found page
  css/style.css         Single shared stylesheet (neon/glass/HUD visual system)
  js/main.js            Nav toggle, active-link highlighting, form chips, form submit
  assets/               Logo + favicon (SVG, no build step needed)
  design/               Copy of the original handoff (DESIGN.md + mockups) for reference
  render.yaml           Render Blueprint for one-click static site deploy
```

## Preview locally

From the repo root:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/` in a browser. Every internal link uses `.html`
extensions so it works identically locally and once deployed.

## Deploy to Render

**Option A — Blueprint (recommended, uses `render.yaml`):**

1. Push this repo to GitHub.
2. In the Render dashboard: **New → Blueprint**, pick this repo.
3. Render reads `render.yaml` and creates a Static Site named `wired-different` with no
   build command and the whole repo as the publish directory. Clean URLs like `/services`
   also work thanks to the rewrite rules.

**Option B — Reuse an existing unused Static Site service:**

1. Open the existing service in Render → **Settings**.
2. Change **Repository** to this repo.
3. Set **Build Command** to empty (no build needed).
4. Set **Publish Directory** to `.` (repo root).
5. Rename the service to `wired-different`.
6. Save and trigger a manual deploy.

## Custom domain (`wireddifferent.io`) — later

1. In Render, open the service → **Settings → Custom Domains → Add Custom Domain**.
2. Enter `wireddifferent.io` (and `www.wireddifferent.io` if you want both).
3. At your domain registrar, add the CNAME/ALIAS (or A record, per Render's instructions)
   Render gives you for the apex domain, plus a CNAME for `www` if used.
4. Wait for DNS propagation and certificate issuance (Render handles TLS automatically).

## Wiring up the consultation form

The form on `consultation.html` posts to Formspree:

```html
<form id="consultation-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

**To go live:**

1. Create a form at [formspree.io](https://formspree.io) and copy its form ID.
2. Replace `YOUR_FORM_ID` in `consultation.html` with that ID.
3. Once the placeholder is gone, `js/main.js` submits the form via `fetch()` and shows the
   inline "Thanks — we'll be in touch." message on success, or a fallback message asking
   the visitor to email `hello@wireddifferent.io` directly if the request fails.

**Until then (mailto fallback):** as long as the action still contains `YOUR_FORM_ID`,
`js/main.js` intercepts the submit, builds a `mailto:hello@wireddifferent.io` link with
the form fields in the body, opens the visitor's email client, and shows the same inline
confirmation message. No backend required for this fallback to work.

## Accessibility & quality notes

- Semantic landmarks (`header`, `nav`, `main`, `footer`), one `<h1>` per page.
- All form inputs have associated `<label>` elements.
- Focus-visible outlines are cyan and always visible for keyboard users.
- Body copy uses `#9AA6B8` on near-black, which meets WCAG AA contrast for normal text.
- Reveal-on-scroll animations respect `prefers-reduced-motion`.
- Mobile nav is a real disclosure button with `aria-expanded`.
