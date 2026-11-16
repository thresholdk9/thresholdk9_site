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

## Progress against docs/PLAN.md

- [x] Deployed to the free Cloudflare address (`noindex`).
- [x] 3.6 Contact form: Worker + Resend, verified end to end (Nov 16, 2026). Turnstile is still on Cloudflare's test key; real key at domain time.
- [x] 3.7 Policy pages drafted (`/policies/`, `/privacy/`). Refunds: none, all sales final (decided Nov 16).
- [x] The 7 Keys page and new photos (Home, About, 7 Keys).
- [x] §2 Square API part (Nov 16, via Square connector): services = Threshold Evaluation ($275, 90 min, bookable), Prepaid Evaluation + Package Session (hidden), 60-min buffers; old items archived; 4 payment links in `site.json` → `payLinks`; hours set; 808 phone removed.
  - At domain launch: update the 4 payment links' `redirect_url` to the real domain (Square checkout `updatePaymentLink`).
- [ ] §2 dashboard-only part (Claudia). Status as of Nov 16, 2am Mountain:
  - DONE: (1) prepayment on Evaluation, (4) online booking settings, (5) cancellation policy text, (6) Text Us on.
  - SKIPPED on purpose: Do Not Disturb. In Square it's an on/off switch that disables Text Us and all new messages, not a schedule. Stevie silences notifications on her phone after hours instead.
  - STILL TO DO: (2) "Prepaid" price display on Prepaid Evaluation + Package Session (Claudia unsure whether done; check), (3) Stevie's bookable availability = Tue/Fri/Sat/Sun 11:30–5, Mon/Wed/Thu 1–2:30, (7) hide street address / appointments at customer location, (8) paste the two embed codes (public booking flow; advanced widget with Package Session + Prepaid Evaluation).
  - Check whether the Cloudflare connector (https://mcp.cloudflare.com/mcp, Stevie's login) loaded. It hadn't in the Nov 16 session; it may need a new session.
  - Then build 3.1, 3.3, 3.4, 3.5.
- [ ] 3.2 Intake + waiver. Sources in Drive "Client Forms-Waivers-Contracts-Etc": Intake Form (DA).pdf, waiver drafts; intake sections I–VI are in the "Website Descriptions" doc in "Website Plan".
- [ ] §4 Domain + email, then 3.8 launch SEO.

## Secrets and settings

- Deploys run in **Cloudflare Workers Builds** (Cloudflare pulls from GitHub). There is no GitHub Actions workflow, so GitHub repository secrets are never seen by this site.
- Runtime secrets live in Cloudflare: Workers & Pages → thresholdk9-site → Settings → **Variables and Secrets** (not the Build variables section, which only exists during the build).
  - `RESEND_API_KEY`: contact and intake form email.
  - `TURNSTILE_SECRET`: spam check. Swap it at the same time as `turnstileSiteKey` in `site.json`.
- Non-secret settings (`MAIL_TO`, `MAIL_FROM`) are in `wrangler.jsonc`.
- This is different from Claudia's `krazy-island-site`, which deploys through GitHub Actions with secrets stored in GitHub.

## Working rules

- Claudia is learning this stack. When something is done differently from her other sites (or from an earlier step), say so and explain why before asking her to do it.

- Show changes with screenshots (desktop and phone) before moving them to `main`.
- Photos: Claudia supplies full-size images through Google Drive folders shared by link. Convert them to `.webp` at about 1400px wide.
- Never show the EIN anywhere on the site.
