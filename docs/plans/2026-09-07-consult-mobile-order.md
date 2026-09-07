# /consultation: compact intro above a trimmed form (2026-09-07)

Goal: on phones, a visitor from a Meta ad should see a short reason to trust before the form, and the form
should ask for less up front. Desktop keeps the two-column layout (copy left, form right).

Site is static HTML/CSS/JS in this folder. No build step. Do not commit; the reviewer commits.

## Target order

Mobile (< 960px), top to bottom:
1. Intro block: eyebrow, h1, orange sub-line, three trust bullets.
2. Form card: heading, Name, Email, "What you need" chips, a collapsed "Add details" section
   (Phone, Business, Message), submit button, the two note lines, status line.
3. After-form copy: the lead paragraph and the tagline.
4. Scheduler block (hidden until `SCHEDULE_URL` is set), full width.
5. FAQ (unchanged).

Desktop (>= 960px): two columns. Left column = intro on top, after-form copy below it. Right column = form
card spanning both rows. Scheduler block full width under the grid, above the FAQ.

## consultation.html edits

Inside `<div class="consult-grid">`, replace the current `.consult-copy` div and keep the form card, so the grid
has exactly these three direct children in this DOM order:

```html
<div class="consult-intro reveal">
  <span class="eyebrow">Free 30-minute consult · no obligation</span>
  <h1>Your business isn't a template.</h1>
  <p class="sub-lg">Stop running it like one.</p>
  <ul class="bullets">
    <li>Talk to Jake — the person who builds it</li>
    <li>Fixed-scope proposal before any deposit</li>
    <li>You own the code, hosting, and data</li>
  </ul>
</div>

<div class="glass-card card--copper consult-form-card reveal">
  ... form card, edited as described below ...
</div>

<div class="consult-after reveal">
  <p class="consult-lead">Book a free call. We'll map a custom website, CRM, or AI around how you actually operate — not a package.</p>
  <p class="tagline">Built for operators, not slide decks.</p>
</div>
```

Then, AFTER the closing `</div>` of `.consult-grid` and BEFORE `<div class="faq reveal">`, place the scheduler
block (moved out of the old copy column, ids unchanged because js/main.js looks them up by id):

```html
<div id="schedule-block" class="schedule-block reveal" hidden>
  <span class="eyebrow">Pick a time</span>
  <p class="schedule-block__note">Grab a 30-minute slot now. Or use the form and we'll reply within one business day.</p>
  <div id="schedule-embed" class="schedule-embed"></div>
  <a id="schedule-link" class="btn-ghost" href="#" target="_blank" rel="noopener">Open the calendar in a new tab <span class="arrow">→</span></a>
</div>
```

Form card edits (keep the `<form>` attributes, ids, names, and the hidden `needs` input exactly as they are):
- Keep `<h2>Book your free consult</h2>`. Delete the `<p class="form-trust">` line (the intro bullets now cover it).
- Field order inside the form: Name, Email, What you need (chip group + hidden input), then the collapsed
  details block, then the submit button, then the two note lines and the status paragraph.
- The collapsed block wraps the three optional fields, markup unchanged inside:

```html
<details class="form-more">
  <summary>Add details <span class="field-optional">(optional)</span></summary>
  <div class="form-more__body">
    ... Phone field, Business / company field, Message textarea field, exactly as they exist today ...
  </div>
</details>
```

Nothing else on the page changes. Keep the `reveal` class usage as shown so the scroll-reveal script still
animates these blocks.

## css/style.css edits

Near the existing `.consult-grid` rules (around line 1238):

- `.consult-grid`: keep `display: grid; grid-template-columns: 1fr; align-items: start;` but change `gap` to `1.75rem`.
- Delete the mobile/desktop `order` rules for `.consult-copy` and `.consult-form-card` (the block with the
  comment "Form first on mobile"). Keep the border/box-shadow declarations on `.consult-form-card`.
- Rename every selector that starts with `.consult-copy` to `.consult-intro` (h1, .sub-lg, .bullets, .bullets li,
  .bullets li::before) EXCEPT `.consult-copy .tagline`, which becomes `.consult-after .tagline` with
  `margin-top: 1rem` instead of 2rem.
- `.consult-lead`: change `margin-top` to `0`.
- Replace the `@media (min-width: 960px)` block that sets `grid-template-columns: 1fr 1fr` with:

```css
@media (min-width: 960px) {
  .consult-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "intro form"
      "after form";
    gap: 3rem;
  }
  .consult-intro { grid-area: intro; }
  .consult-form-card { grid-area: form; }
  .consult-after { grid-area: after; }
}
```

- Mobile only, add:

```css
@media (max-width: 959px) {
  .consult-intro h1 { font-size: clamp(2rem, 8vw, 2.6rem); }
  .consult-intro .bullets { margin-top: 1rem; }
  .consult-intro .bullets li { font-size: 1rem; }
}
```

- Delete the now-dead rule `.form-trust { ... }` and the rule `.schedule-block:not([hidden]) + .tagline { ... }`.
- `.schedule-block`: set `margin-top: 2.5rem`. Add `.schedule-block .eyebrow { display: block; margin-bottom: 0.4rem; }`
  only if the eyebrow does not already render as its own line there (check `.eyebrow` in the stylesheet first).

- New rules for the collapsed details, placed right after the `.consult-form-card .field textarea` rule:

```css
.form-more {
  margin: 0 0 1.1rem;
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-sm);
  background: rgba(255,255,255,0.02);
}
.form-more summary {
  cursor: pointer;
  list-style: none;
  padding: 0.7rem 0.9rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--cyan);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.form-more summary::-webkit-details-marker { display: none; }
.form-more summary::after {
  content: "";
  width: 0.5rem;
  height: 0.5rem;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(45deg);
  transition: transform 0.15s ease;
}
.form-more[open] summary::after { transform: rotate(-135deg); }
.form-more__body { padding: 0.2rem 0.9rem 0.1rem; }
.form-more__body .field:last-child { margin-bottom: 0.9rem; }
```

## Cache version

Every `*.html` file links css and js with `?v=20260907a`. Change all of them to `?v=20260907b`
(both the stylesheet link and the script tag, in all eleven html files).

## Checks before reporting back

1. `grep -c "20260907b" *.html` shows 2 for every page.
2. `grep -n "consult-copy\|form-trust" consultation.html css/style.css` returns nothing.
3. Open the page: `python3 -m http.server 8770` from this folder, then load
   `http://localhost:8770/consultation.html` with headless Chrome
   (`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --window-size=1280,1600 --screenshot=/private/tmp/claude-501/-Users-jakesalverda/4087fe20-421b-4e74-bf88-df3db3e8af22/scratchpad/sonnet-desktop.png http://localhost:8770/consultation.html`)
   and confirm the desktop layout is two columns with the form on the right. Stop the server afterwards.
4. Do not commit. Report the files changed and anything you deviated from.
