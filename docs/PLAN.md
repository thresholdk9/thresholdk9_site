# Threshold K9: Backend & Launch Plan

**For:** the Claude Code session working in `thresholdk9/thresholdk9_site`
**From:** the planning session with Claudia (site build lead), Nov 2026
**Owner of the business:** Stevie Rossi, Threshold K9 LLC (mobile dog training, Longmont, CO)

Save this file in the repo (suggested: `docs/PLAN.md`) and reference it from `CLAUDE.md`, so future sessions start out knowing these decisions.

**Who does what:** **[C]** = Claudia (accounts, Square dashboard, anything needing a login). **[S]** = Stevie. **[CC]** = Claude Code.

---

## 0. Locked decisions (do not re-open)

| Topic | Decision |
|---|---|
| Hosting | Owned static site on Cloudflare (free). Repo lives in Stevie's GitHub (`thresholdk9`). |
| Booking, payments, client texting | **Square free plan**, in Stevie's own Square account (not Claudia's Krazy Island account). |
| PocketSuite | **Not used.** Never went live; its phone number is abandoned. |
| Squarespace | Being retired. Domain `thresholdk9training.com` is currently registered there. |
| Payment processor | Square only (no Stripe) unless Square's recurring invoices can't handle Ascension autopay. |
| Intake form + waiver | Live **on the website**, not in Square, because Square Free can't *require* a signature or hold custom fields. |
| Logins | All accounts use the business email `thresholdk9llc@gmail.com`. Two-factor codes on Claudia's phone; backup codes in the shared Apple Passwords group. |
| Design constraint | Avoid scroll-triggered image animations (they caused visual discomfort on the Squarespace build). Any motion stays subtle and respects the visitor's "reduce motion" device setting. Dark, premium, purple/silver; Playfair Display + Montserrat. |

### Prices & services (confirmed)

| Service | Price | Format |
|---|---|---|
| Threshold Evaluation | $275 | 90 min, in-home. The starting point for all new clients. |
| Threshold Foundations | $1,500 / 6 sessions · $2,850 / 12 sessions | 60-min sessions |
| Crossing the Threshold | $1,500 / 6 sessions · $2,850 / 12 sessions | 60-min sessions |
| The Ascension Track | $750/month | **3** sessions/month, 12-month initial commitment, by invitation after an Evaluation |

- New clients may buy the Evaluation alone **or** Evaluation + a 6/12 bundle in one purchase.
- Returning clients may buy 6/12 packs directly, without a new Evaluation.

### Business rules (from the waiver draft and the June strategy call)

- **Cancellation:** 48-hour notice; later cancellations and no-shows forfeit the session.
- **Late arrival:** 15-minute grace period; the session still ends at the scheduled time.
- **Package expiration:** 12 months after purchase.
- **Rabies certificate:** required before the first session.
- **Working hours:**
  - Tue/Fri/Sat/Sun 11:30am–5:00pm (last 1-hr booking at 4:00pm)
  - Mon/Wed/Thu 1:00pm–2:30pm
- **Travel buffer:** 1 hour between all appointments.
- **Booking window:** up to 6 weeks ahead.
- **Support hours:** 10:00am–6:00pm (text/video).
- **Service area:** about 30-minute drive around Longmont (Longmont, Loveland, Boulder).

---

## 1. What Square Free can and can't do

Confirmed by Claudia from Square's own Free-plan feature list.

| Can (Free) | Can't (Free) | Our workaround |
|---|---|---|
| Online booking site + embed widget | Require contract signature | Waiver signed on the website before booking |
| Prepayments, deposits | Custom contract fields | Intake form on the website captures vet, emergency contact, etc. |
| Two-way SMS/email messaging, "Text Us" button, Do Not Disturb auto-reply | Dedicated business phone number | Stevie's own business number (Google Voice or a $10 Verizon line) |
| Contracts + e-signature (optional) | Google Calendar sync | Stevie blocks her other job shifts in Square by hand each week |
| Invoices + **recurring invoices** | Packages feature (session credits) | Payment links + Google Sheet tracker (§5) |
| Coupons | | |
| Advanced widgets that ignore the "bookable online" setting | | Unlisted client booking page (§3) |

---

## 2. Square setup [C], done in Stevie's Square account

### 2a. Services (Appointments → Service library)

1. **Threshold Evaluation:** 90 min, $275, **prepayment required**, block 1 hr after, bookable online **ON**.
2. **Prepaid Evaluation:** 90 min, $0 / "Prepaid" description, no prepayment, block 1 hr after, bookable online **OFF**. Used by Eval + bundle buyers.
3. **Package Session:** 60 min, $0 with "Replace price with description" = "Prepaid Training Session", no prepayment, block 1 hr after, bookable online **OFF**.
   - Service description: "For clients with a prepaid 6- or 12-session package. Bookings without an active package will be cancelled."

### 2b. Online booking settings

- Accept bookings automatically: **ON** (approval applies to every service, so leave it off for all).
- Let customers choose a time zone: **OFF**.
- Book multiple services in one appointment: **OFF**.
- How far ahead: **6 weeks** (or the closest option).
- Minimum notice: 12–24 hrs. [S] to choose.
- Text Us button: **ON**.
- Availability: Stevie's working hours (above). Block her other job shifts weekly.
- Cancellation policy text: 48 hours.

### 2c. Booking flows to embed (Online booking → Access your booking flow)

- **Public flow:** shows only the Threshold Evaluation. Get its **embed code**.
- **Advanced widget "Client Booking":** includes only Package Session + Prepaid Evaluation. Get its **embed code**.

### 2d. Payment links (one per product)

| Link | Price |
|---|---|
| Evaluation + 6 sessions | $1,775 (no bundle discount unless [S] decides otherwise) |
| Evaluation + 12 sessions | $3,125 |
| 6-session pack | $1,500 |
| 12-session pack | $2,850 |

- Decide whether Foundations and Crossing need **separate** links or one link with a note field asking which phase. The phase is set after the Evaluation anyway.
- If Square payment links support a **redirect after payment**, point them to `/client-booking/`. If not, the confirmation message should include that link.

### 2e. Ascension (only after the membership agreement exists, see §8)

- Recurring invoice, monthly, $750, billed on the 1st or 15th. **Verify that autopay from a card on file is available on Free.** If it isn't, fall back to a Stripe subscription.

### 2f. Coupons

- 10% returning-client code, plus seasonal promos as needed.

**Hand to [CC]:** the two embed codes, all payment link URLs, and Stevie's Square booking-site URL.

---

## 3. Website features [CC]

Build in this order. Each item lists what "done" means.

### 3.1 New vs. returning split

- Add a **"Start Here" / Book** page with two doors:
  - **New client →** intake + waiver (3.2) → Evaluation booking (3.3).
  - **Returning client →** buy sessions (Services page links) or book a session (3.4).
- Point every "Book / Initiate the Evaluation" button sitewide to the new-client door.
- **Done when** there's no path for a new client to reach Evaluation booking without passing the intake page. A link can always be shared, so "no path" is enough.

### 3.2 Intake form + waiver (new clients only, once per dog)

**Fields:**
- **Handler contact:** name, email, phone, service address (city/zip, for travel radius), emergency contact.
- **Sections I–VI** from the "Website Descriptions" Google Doc:
  - Raw Identity
  - Biological Reality (meds, sensitivities, vet, rabies)
  - Friction & Triggers (bite history, trigger and reaction checkboxes)
  - Environmental Matrix (tools, commands, household, yard, prior training)
  - Human Anchor (breaking point, top 3 goals, 6-month vision)
  - Handler's Covenant (daily minutes)
- **Rabies certificate upload:** image/PDF. Keep it small and email it as an attachment, or store it in R2. Pick the simpler option.

**Waiver:**
- Show the full text from the current consolidated waiver draft (Drive: Client Forms-Waivers-Contracts-Etc).
- Signature block: typed full legal name, "I agree" checkbox, date auto-filled.
- Record the submission timestamp.
- Word it so it **covers all future sessions and packages for this dog**. Returning clients don't re-sign.

**On submit:**
- Email Stevie a complete copy, and send the client a copy of what they signed.
- Append a row to the Client Intake Google Sheet in the business Google account. Recommended route: a Google Apps Script web app, so no API keys are needed.
- Then redirect to the Evaluation booking page.

**Implementation:**
- Cloudflare Pages Function for submission handling, Resend for email, Cloudflare Turnstile (free) for spam protection.
- No client data stored in the repo or in browser storage.

**Done when** a test submission arrives in Stevie's inbox, the client copy arrives, the Sheet gets the row, and the redirect works on a phone.

### 3.3 Evaluation booking page

- Embed Square's **public** booking flow (iframe embed code from §2c).
- Short reminder above it: rabies certificate required, 48-hour cancellation policy.

### 3.4 Client booking page (unlisted)

- `/client-booking/`: not in the nav, `noindex`, excluded from the sitemap.
- Embed the Square **advanced widget** (Package Session + Prepaid Evaluation).
- Copy: "For clients with a prepaid package or bundle. Bookings without an active package will be cancelled."

### 3.5 Services page purchase buttons

- Wire "Purchase Foundations", "Purchase Crossing", and the Evaluation + bundle options to the Square payment links (§2d).
- Keep all prices in `site.json`.

### 3.6 Contact form

- Replace the current `mailto:` stopgap with a Pages Function + Resend + Turnstile.
- Same fields as now: The Handler / The Frequency / The Dog / The Current Reality / "Send Transmission".

### 3.7 Policy pages (required before launch, because the forms collect personal data)

- **Privacy Policy:** what's collected, why, where it's stored (email, Google Sheet, Square), and that it isn't sold. Plain language.
- **Policies / Terms:** the cancellation, late, expiration and rabies rules above, plus the **bundle refund rule** (§8).
- Link both in the footer.

### 3.8 Launch SEO

- LocalBusiness / ProfessionalService JSON-LD: service-area business, **no street address**, `areaServed` = Longmont, Loveland, Boulder.
- Cloudflare Web Analytics (free, cookieless).
- At launch, flip `"indexable": true` in `site.json`.

### 3.9 Contact details

- Put the confirmed phone number in `site.json` once [C] confirms it. The 833 number may be Google Voice; Google Voice normally issues local numbers, so verify it.
- Never show the EIN anywhere on the site.

---

## 4. Domain & email [C] + [CC]

1. **[C]** Confirm whether the Squarespace domain is tied to the site plan **before cancelling anything** on Squarespace.
2. **[C/CC]** Add `thresholdk9training.com` to Stevie's Cloudflare account:
   - Change nameservers at Squarespace to Cloudflare (registration stays at Squarespace for now), **or** transfer the registration to Cloudflare later.
   - Recreate any DNS records first, especially email-related ones.
3. **[CC]** Attach the custom domain to the Cloudflare Pages project; check HTTPS and the `www` → apex redirect.
4. **Email receiving:**
   - Cloudflare Email Routing (free) forwards `stevie@thresholdk9training.com` (the address printed on the business card) and `hello@` to `thresholdk9llc@gmail.com`.
   - Sending/replying *as* the custom address is a separate decision. Don't build a workaround that depends on Gmail's POP/"Send mail as" route without checking its current status first.
5. **[CC]** Verify the domain in Resend (DNS records in Cloudflare) so form emails come from the domain and don't land in spam.
6. **[C]** Cancel the Squarespace **site** plan only after the new site is live on the domain.

---

## 5. Package tracking (manual first, automate second)

### 5a. Manual baseline: Google Sheet "Client Sessions" in the business Google account

- **Columns:** Client, Dog, Package (Foundations/Crossing/Ascension), Size (6/12), Purchase date, Expires (purchase + 12 months), Sessions used, Sessions left (formula), Notes.
- **Stevie's routine:** when Square notifies her of a Package Session booking, glance at "Sessions left". If it's 0, cancel the booking and message the client. After each session, +1 to "Sessions used".

### 5b. Automation (Zapier or Make, both available to Claudia)

- Square payment for a pack/bundle → add a row with the right session count.
- Optional: Package Session booked → if "Sessions left" = 0, alert Stevie. **Verify first that Zapier/Make can see Square appointment events**; don't promise this until tested.

---

## 6. Phone & messaging [C]/[S]

- **One** business number everywhere: site, Square profile, Google Business Profile, business cards.
- Square's automated texts come from Square's own number. Client replies land in the **Square app → Messages**, not Stevie's phone texting app. Stevie should keep the Square app installed and notifications on.
- ~~Turn on Square Do Not Disturb outside support hours.~~ Not used: in Square, Do Not Disturb is an on/off switch that disables the Text Us button and all new messages, not a schedule. Stevie silences Square notifications on her phone after hours instead.
- **Test:** book a fake appointment with Claudia's cell, reply to the confirmation, and confirm the reply reaches Stevie's Square Messages and that she can answer it.

---

## 7. Google Business Profile [S] with [C]

- **Service-area business**, home address hidden, about 30-minute radius around Longmont.
- Book button → the website's Start Here page (or Square booking). Square Free includes the Google "Book" integration.

---

## 8. Open decisions & blockers (not code)

| # | Item | Blocks | Owner |
|---|---|---|---|
| 1 | ~~**Bundle refund rule**~~ **Decided Nov 16, 2026: no refunds.** All Evaluations, packages and memberships are final sale (matches Square's return policy). | Waiver wording | S |
| 2 | **Ascension membership agreement** (12-month term, 1x 2-month pause with 2 weeks' notice, max 2 rollover sessions, 30-day cancel notice after term). It doesn't exist yet. | Selling Ascension | C/S |
| 3 | **Training methodology:** force-free vs. balanced. Waiver Section 10 stays method-neutral until answered. | Waiver wording, About copy | S |
| 4 | **Phone number:** which one is real and live | Site, Square, cards | C |
| 5 | **Waiver attorney review.** Deferred (no funds right now). Known risk, given bite-history clients. Revisit once revenue allows. | Ideally the first signature | S |
| 6 | Minimum booking notice (12 vs. 24 hrs) | Square setting | S |
| 7 | Out-of-radius travel fee (around $20 discussed) | Policies page, intake form | S |
| 8 | Board & Train ($1,400/wk mentioned once): offer it or not | Site copy, separate waiver | S |

---

## 9. Suggested order

1. **Go live, basic.** Deploy to the free Cloudflare address. Contact form working (3.6), policy pages (3.7). Still `noindex`.
2. **Square setup** (§2) by [C]. Hand embed codes and links to [CC].
3. **Booking pages + purchase buttons** (3.1, 3.3, 3.4, 3.5).
4. **Intake + waiver** (3.2). End-to-end test as a fake new client on a phone.
5. **Domain + email** (§4). Then indexable, JSON-LD, analytics (3.8). Then the Google Business Profile (§7).
6. **Package tracker** (§5a) at launch; automation (§5b) once there are real clients.
7. **Ascension sales** only after decision #2 is resolved.

**Monthly cost target:** $0–10 (Google Voice free, or a $10 Verizon line), plus card processing fees. This replaces PocketSuite ($49.99/mo) and the Squarespace site plan.
