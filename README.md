# Wired Different — site

Static site deployed on Render from this repo (`main`).

## Assets
- `assets/logo.svg` — header mark (Blend B: WD + hex)
- `assets/favicon.svg` — tab icon
- `assets/logo/` — SVG copies for reference
- `assets/proof/` — public scrubbed CRM screenshots (+ crops)

## Local
Open `index.html` or serve the folder statically. Push to `main` to deploy.

## Pending inputs (wire up when available)
- **Scheduler link** — `js/main.js` has a `SCHEDULE_URL` constant near the top (currently `""`). Paste a Calendly / Cal.com booking link there and the "Prefer to pick a time? Open the calendar" button on `/consultation` will un-hide automatically.
- **Jake's photo** — the homepage "Who's behind it" section shows a CSS/SVG hex-ring "J" monogram. Once `assets/jake.webp` exists, swap it in: in `index.html` replace the `<svg class="about-block__mono">...</svg>` with `<img src="/assets/jake.webp" alt="Jake" width="200" height="200">` (see the HTML comment right above it).
