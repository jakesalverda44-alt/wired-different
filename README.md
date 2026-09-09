# Wired Different — site

Static site deployed on Render from this repo (`main`). No build step, no framework.

## Layout

```
index.html            Homepage — hero, outcomes, proof, founder, service peek
websites|crm|ai.html  The three service pages (Service schema on each)
services.html         Service hub, linked from the footer and homepage
work.html             The CRM case study: readable detail crops + full screens
process.html          Four-step build process (HowTo schema)
consultation.html     Lead form, "How pricing works", FAQ (FAQPage schema)
css/style.css         Whole visual system
js/main.js            All behaviour — CONFIG block lives at the top
assets/proof/         Anonymized CRM screenshots
assets/proof/detail/  Tight, readable crops generated from those screenshots
tools/set-domain.sh   Repoint the site at a real domain in one command
```

## Pending inputs

Everything below is wired up and hidden until the value exists, so nothing
ships half-finished. All five live in the `CONFIG` object at the top of
`js/main.js`.

| Input | Effect once set |
| --- | --- |
| `SCHEDULE_URL` | Un-hides the "Pick a time" block on `/consultation`, embeds the Calendly widget, fires the Meta `Schedule` event, and adds a "pick a time now" link to the form success message. **Currently empty — the old event `calendly.com/wir3ddifferent/30min` was deleted, so there is no self-serve booking path at all.** |
| `PHONE_DISPLAY` / `PHONE_HREF` | Adds click-to-call to the desktop header, the mobile menu, and the footer on every page, and tracks a `Contact` / `click_to_call` event. |
| `PRICE_SITE_FROM`, `PRICE_CRM_FROM`, `PRICE_AI_FROM` | Un-hides the price-floor row inside "How pricing works" on `/consultation`. Any subset works — only the ones with values render. |

Two more pending inputs live outside that file:

- **Founder photo** — drop a square image at `assets/jake.webp`. `js/main.js`
  probes for it and swaps it in over the "JS" monogram automatically. No HTML
  edit needed.
- **Real domain** — run `./tools/set-domain.sh yourdomain.com [contact@email]`.
  It rewrites canonicals, Open Graph and Twitter URLs, JSON-LD ids, the
  sitemap and robots.txt in one pass. Review with `git diff` before committing,
  then update the domain in Render, Google Search Console, GA4, and Meta
  domain verification.

## Regenerating the readable proof crops

`assets/proof/detail/*.webp` are tight crops cut from the full screenshots in
`assets/proof/`, because the full screens are unreadable at display size. If
the source screenshots are replaced, re-cut the crops with Pillow — the boxes
used are recorded here:

| Crop | Source | Box (left, top, right, bottom) |
| --- | --- | --- |
| `detail-kpis` | `04-electrical-overview` | 330, 150, 2250, 585 |
| `detail-stage-totals` | `02-generators-pipeline` | 335, 148, 2240, 296 |
| `detail-followup` | `02-generators-pipeline` | 722, 212, 1100, 1015 |
| `detail-estimating` | `08-estimating` | 330, 252, 2250, 378 |
| `detail-needs-action` | `01-home` | 300, 480, 2250, 715 |

Each is resized to 1600px wide (720px for the portrait `detail-followup`) and
saved as WebP at quality 88–90. Keep the `width`/`height` attributes in
`work.html` and `index.html` in sync with the actual pixel dimensions.

## Analytics and conversion events

GA4 `G-M8B3QYP04T` and Meta pixel `1639305264385092` are on every page.
Events fired from `js/main.js`:

| Trigger | Meta | GA4 |
| --- | --- | --- |
| Consult form submitted successfully | `Lead` | `generate_lead` |
| Calendly booking completed | `Schedule` | `schedule` |
| Click-to-call tapped | `Contact` | `click_to_call` |

The form posts to Formspree `mnpqbpgo` via `fetch`. Formspree does not send the
lead a confirmation email on its own — that has to be switched on in the
Formspree dashboard, otherwise the only acknowledgement anyone gets is the
inline success message.

## Progressive enhancement

Reveal-on-scroll is opt-in rather than opt-out. An inline script in each
`<head>` adds `.js-reveal` to `<html>`, and `.reveal` is only hidden inside
that class. If JavaScript is disabled, blocked, or `main.js` fails to load, a
2.5s timer removes the class and every section stays visible. `main.js` sets
`window.__wdReady` to cancel that fallback.

## Local

```
python3 -m http.server 8899     # then open http://localhost:8899/index.html
```

Pretty URLs (`/crm` rather than `/crm.html`) are Render rewrites from
`render.yaml`, so locally you need the `.html` suffix. Push to `main` to deploy.
