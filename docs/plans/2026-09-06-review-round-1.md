# Wired Different site — Review round 1 (2026-09-06)

**Executor:** Sonnet subagent. **Reviewer:** Fable (spot-checks + screenshots), then merge to `main` → Render auto-deploys.
**Repo:** `~/Websites/Wired-different/site` (pure static HTML/CSS/JS, no build step). Work on branch `review-round-1` cut from `main`. One commit per task, message = task title.

## Why this round

Fable reviewed the live site (https://wired-different.onrender.com) on 2026-09-06. Verdict: looks good, engineering is clean, but it never says who is behind it, the Work gallery is unreadable, the copy repeats itself, and there's no way to actually book the call. Everything below fixes that without touching the visual system.

## Ground truth you must respect

- **Brand voice** (from `../../design/docs/DESIGN.md`): sharp, confident, plain English. Not trade-specific in positioning. Keep the hero hook verbatim: "YOUR BUSINESS ISN'T A TEMPLATE. / STOP RUNNING IT LIKE ONE."
- **The real product**: the CRM screenshots in `assets/proof/*.webp` are hard-scrubbed screens of a real commercial-electrical bidding CRM Jake built and runs daily (pipeline board, jobs, division overview, intake queue, intake detail, bids workspace, estimating). Names and client identifiers in the screenshots are fictional placeholders on purpose. Never name the employer. Never remove the "Screenshots are anonymized" note.
- **Jake Salverda** runs Wired Different alone. He works on the operations side (bids, estimating, pipeline) of a commercial electrical contractor in Central Florida. He builds the systems himself. He works remotely with clients anywhere. Do not invent anything else about him: no years-in-business, no client counts, no testimonials, no photo.
- **Website / AI mockups** under `assets/proof/websites` and `assets/proof/ai` are fictional concept mockups. Keep them labeled as such. A real nonprofit site build is in progress but not live yet.
- **No fabricated proof.** No testimonials, no logos, no numbers we can't back.
- **Design system stays.** Use existing classes (`glass-card`, `card--cyan|copper|violet`, `eyebrow`, `section-head`, `btn-primary`, `btn-ghost`, `pill`, `bullets`, `reveal`) and tokens in `css/style.css` `:root`. New CSS goes at the end of `style.css` under a `/* === Round 1 (2026-09-06) === */` banner. No new fonts, no libraries, no build tools.
- All pages share the same header/footer markup. When you change shared chrome, change it in **all nine** pages: `index, services, websites, crm, ai, work, process, consultation, privacy` (and `404.html` where applicable).
- Internal links stay clean URLs (`/work`, not `/work.html`). Asset paths stay root-absolute.
- Preview locally with `python3 -m http.server 8766` from the site folder (port 8766; 3000/3210/8765 are taken). Clean URLs won't resolve locally; use `.html` in the browser only.

## Tasks (do in order, commit after each)

### T1. One CTA name everywhere
"Start a build" and "Book a consultation" are the same action. Standardize on **Book a consultation**.
- Header button + mobile-menu last link on all 9 pages → "Book a consultation".
- `work.html` and `process.html` bottom bands: "Start a build" → "Book a consultation".
- `consultation.html` eyebrow "Start a build" → "Consultation".
- `grep -rn "Start a build" *.html` must return nothing when done.

### T2. Put a person on the site
**Homepage:** add a new section directly after the "Real build" section and before "A peek at what we build". Structure: `section.section > .wrap > article.glass-card.card--cyan.about-block.reveal` with two columns on desktop (avatar column ~200px, copy column), stacked on mobile.
- Avatar: a hex-ring monogram "JS" drawn with CSS/inline SVG in the logo's cyan style (mirror the shape of `assets/logo.svg`). Wrap it so that if `assets/jake.webp` exists later it can replace the monogram by swapping one `<img>` (leave an HTML comment saying so).
- Eyebrow: `WHO'S BEHIND IT`. H2: `Built by an operator, not an agency.`
- Body copy, verbatim:
  > Wired Different is run by Jake Salverda. My day job is the operations side of a commercial electrical contractor in Central Florida: bids, estimating, pipeline, follow-up. The CRM in the Work section started as the system I built for that job, because nothing off the shelf matched how the work actually moved. That's the standard for every build here. The system fits the business, not the other way around.
- Three fact pills under the copy (reuse `.pill-row`/`.pill`): `Central Florida · remote anywhere` · `You talk to the person who builds it` · `Runs his own builds every day`.
- CTA link: `Book a consultation →` to `/consultation` (class `card-cta`).
**Consultation page:** under the existing bullets in the left column add one line in the `.tagline` style: `You'll be talking to Jake, the person who scopes it and builds it.` Keep the existing "Built for operators, not slide decks." line.
**JSON-LD** in `index.html`: add `"founder": {"@type": "Person", "name": "Jake Salverda"}` and `"areaServed": "US"` to the Organization object. Validate it's still valid JSON.

### T3. Make the Work gallery readable
Replace the six-thumbnail `.proof-gallery` grid in `work.html` with full-width **screen rows**. Keep the existing 01 feature card (home brief) as the intro.
- Each row: `article.screen-row.reveal` containing a `figure` with a `button.screen-row__open` wrapping the `<img>` (so it's keyboard-openable), and a copy block with `h3` + one or two sentences. Alternate image left/right on desktop; stack on mobile with image first. Image column ~62% width on desktop.
- Rows, in this order, using these files. **Open each image with the Read tool and confirm the caption matches what's on screen; adjust wording if it doesn't.** Draft captions:
  1. `02-generators-pipeline.webp` — **Pipeline** — Every bid is a card in the stage it's actually in. Drag to move it, click to open it. The stages are the shop's real process, not a vendor's default.
  2. `05-electrical-intake.webp` — **Intake** — New requests land in a queue with the details captured up front, so nothing gets lost in an inbox.
  3. `06-electrical-intake-detail.webp` — **Intake detail** — One request opened up: documents, dates, contacts, and the next step, all on one screen.
  4. `07-electrical-bids.webp` — **Bids** — The bid workspace: line items, status, attached documents, and sending to the client from the same place.
  5. `08-estimating.webp` — **Estimating** — Pricing happens where the job already lives. Takeoff, unit costs, overhead and profit, no spreadsheet round-trip.
  6. `03-generators-jobs.webp` — **Jobs** — Won work in one list with status, filters, and the paperwork attached.
  7. `04-electrical-overview.webp` — **Overview** — The division at a glance: what's out, what's won, what's due this week.
- **Lightbox:** a single native `<dialog id="lightbox">` at the end of `<main>` holding an `<img>` and a close button. Clicking any `.screen-row__open` (and the 01 feature image) opens it with that image's `src`/`alt`. Close on the button, Esc, or backdrop click. Restore focus to the opener on close. Vanilla JS in `js/main.js`, guarded so pages without the dialog don't error. Style: near-black backdrop, image `max-width: min(96vw, 1600px)`, `max-height: 90vh`, cyan hairline border.
- Keep `loading="lazy"` on all but the first row. Keep width/height attributes (they're 1440×900 for these).
- Delete the now-unused `.proof-gallery` / `.proof-shot` CSS **only if** nothing else uses those classes (`grep` first; the concept mockups use `.proof-pair` + `.proof-shot`, so likely keep `.proof-shot`).

### T4. Real product on the homepage, not wireframes
- In `index.html`, inside `.hero-product`, replace the whole `.hero-product__stack` (wireframe website + wireframe CRM) with a single `<img src="/assets/proof/02-generators-pipeline.webp" alt="Pipeline board from a real custom CRM, anonymized" width="2266" height="1357" loading="eager" fetchpriority="high">` inside a `div.hero-product__shot`. Keep `.hero-product__glow` and the bottom bar. Change the bar label to `Custom CRM · real build · anonymized`.
- CSS: `.hero-product__shot img { display:block; width:100%; height:auto; }` and make sure the panel keeps its 16px radius and copper rim. Remove now-dead `.hero-product__stack/__web/__crm` rules and the `mock-crm--hero` variants **only if** unused elsewhere (`crm.html` uses `mock-crm--hero`, so keep that one).
- The "Real build" section below the hero currently shows the same pipeline image. Switch it to `/assets/proof/01-home.webp` (width 1440 height 900) with alt `Home brief screen from a real custom CRM, anonymized`, and change its paragraph to: `This is the home brief from a real custom CRM: what needs attention today, before you go hunting for it. Pipelines, intake, bids, and estimating live behind it. Screenshots are anonymized.`
- Leave the three peek-card mini mocks alone.

### T5. Cut the repetition
Rules (apply across all pages, then verify with grep):
- "No templates" / "No packages" / "no packages" may appear **at most once per page**. On the homepage that one is the hero; delete `.hero-trust-micro` ("Custom websites · CRMs · AI — no packages.") entirely and its CSS.
- The phrases "how you actually run", "how you actually operate", "how you actually take work", "how your business actually runs" may appear **at most once per page**. Rewrite the others in plain words (e.g. "built around your workflow", "matches your process", or just cut the clause).
- `.also-strip` ("Also available in a build…") appears on services + websites + crm + ai. Keep it on `services.html` only; remove it from the three product pages (and its `.reveal` wrapper).
- `crm.html` h1 `Operating system matching reality.` → `Your pipeline. Your stages. Your rules.` Sub: `A CRM built around the way your work actually moves, instead of a generic one you force-fit.`
- `crm.html` "What's included" list → replace with exactly:
  - Pipeline board with your stages and rules
  - Intake queue with follow-up reminders
  - Estimates, proposals, and e-sign
  - Job tracking after the win
  - Dashboards for what's due this week
  - Roles and permissions for your team
  - Your hosting, your data, no per-seat licensing
- `websites.html` list: remove `Digital menus & service lists`. Keep the rest.
- `ai.html` list: remove `Less falling through the cracks` (it's a benefit, not a deliverable). Keep the rest.
- Product pages' `consult-band` p: `30 minutes. No pitch deck. Clear build map.` → keep on services, change on the three product pages to `30 minutes. You'll leave with a build map.`
- After edits: `grep -ci "no packages\|no templates" *.html` and `grep -ci "actually run\|actually operate\|actually take\|actually moves" *.html` — each page ≤ 1.

### T6. Consultation page: FAQ + scheduler slot
- Under the form grid (still inside the `.frame` section, after `.consult-grid`), add `div.faq.reveal` with eyebrow `GOOD TO KNOW` and four `details` items (native `<details>/<summary>`, styled to match the glass cards, cyan summary text, chevron rotates on open):
  1. **What does a build cost?** Every build is scoped after the call. You get a fixed-scope proposal with a price and a timeline before any deposit. No hourly surprises.
  2. **How long does it take?** The timeline comes with the proposal. Sites move fastest. A custom CRM is scoped in phases, so you're using working software early instead of waiting for a big reveal.
  3. **Who does the work?** Jake does. You scope it with him, you build it with him, and you can reach him during the build.
  4. **Do I own it?** Yes. Code, hosting, domain, and data are set up in your name from the start.
- Scheduler slot: in `js/main.js` add `var SCHEDULE_URL = "";` near the top with a comment `// Paste a Calendly / Cal.com link here to show the "pick a time" button on /consultation.` In `consultation.html`, above the form's submit button? No: put it **under the left-column tagline** as `<a id="schedule-link" class="btn-ghost" hidden href="#" target="_blank" rel="noopener">Prefer to pick a time? Open the calendar <span class="arrow">→</span></a>`. JS: if `SCHEDULE_URL` is non-empty, set `href` and remove `hidden`.
- README: document `SCHEDULE_URL` and the `assets/jake.webp` photo swap.

### T7. Reframe the concept mockups honestly
`work.html`, the `.work-more__note` paragraph → `Concept mockups showing the direction for sites and assistants. A live site build for a nonprofit is in progress and will replace these when it launches. The CRM above is a real, anonymized product.` Leave the per-card "fictional" notes in place. Section eyebrow `Also in the shop` → `Websites & AI`.

### T8. Ship checks + cache bust
- Bump every `?v=20260906i` (css and js links, all pages) to `?v=20260906j`.
- `sitemap.xml`: set `<lastmod>` to `2026-09-06` where present.
- Link/asset check from the site root:
  ```
  grep -oh 'href="/[^"#?]*' *.html | sort -u        # every internal path must map to a file (clean URL → file.html)
  grep -oh 'src="/assets/[^"]*' *.html | sort -u | while read s; do f=${s#src=\"/}; [ -f "$f" ] || echo MISSING $f; done
  ```
- Serve locally and open `index.html`, `work.html`, `consultation.html`, `crm.html` at 1440 and at 390 wide (use headless Chrome: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --force-prefers-reduced-motion --timeout=12000 --window-size=1440,3600 --screenshot=/tmp/x.png http://127.0.0.1:8766/index.html` run in the background and killed after ~20s if it hangs; headless Chrome won't lay out narrower than 485px, so for mobile wrap the page in a 390px iframe). Look at every screenshot with the Read tool. Fix anything broken before finishing.
- Final commit. Do **not** merge to `main`, do **not** push. Report back: list of commits, any caption you changed after viewing images, any rule you couldn't satisfy and why.

## Not in this round (Jake's inputs, tracked separately)
Testimonial quote · headshot (`assets/jake.webp`) · real pricing floor · Calendly URL · Packin In The Pawz case study once live · attach wireddifferent.io on Render + DNS at the registrar · hello@wireddifferent.io mailbox · Formspree thank-you autoresponse.
