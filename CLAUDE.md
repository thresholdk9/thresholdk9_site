# Threshold K9 website

Static marketing site for Threshold K9 LLC (Stevie Rossi, dog training, Longmont CO), deployed on Cloudflare Workers static assets.

**Read `docs/PLAN.md` first.** It holds the locked decisions (Square free plan, intake + waiver on the site, prices, business rules) and the build order. Don't re-open locked decisions.

## How the site works

- `src/pages/*.html`: one file per page. The first line is a JSON comment with `path`, `title`, `description`.
- `src/layout.html`: shared header, nav and footer.
- `site.json`: single source of truth for prices, email, phone, service area, and `indexable`. Pages use `{{key}}` placeholders.
- `node build.js` builds everything into `dist/`. `npm run preview` builds and serves it locally.
- Deploys happen automatically: Cloudflare Workers Builds deploys every push to `main`. Test URL: https://thresholdk9-site.thresholdk9llc.workers.dev
- The site stays `noindex` until launch (`"indexable": false` in `site.json`).

## Working rules

- Show changes with screenshots (desktop and phone) before moving them to `main`.
- Photos: Claudia supplies full-size images through Google Drive folders shared by link. Convert them to `.webp` at about 1400px wide.
- Never show the EIN anywhere on the site.
