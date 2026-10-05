# rmlgrowth-site

Marketing website for **RML Growth Partners LLC** (rmlgrowth.com).

Plain static HTML + one CSS file + a little vanilla JS. No build step, no dependencies — GitHub Pages serves the repo as-is from the `main` branch root.

- Preview (GitHub Pages): https://ryanlein43-max.github.io/rmlgrowth-site/
- Production (planned): https://rmlgrowth.com — not connected yet (see DNS plan below)

## Structure

```
index.html          Homepage: Hero → How we work → Services (4 pillars) → Who we serve → CTA
book/index.html     /book    — Book a call form (phone required, preferred call times)
contact/index.html  /contact — Inquiry form (phone optional)
404.html            Not-found page (sets <base> so it works at any URL depth)
styles.css          All styles (palette, type, layout)
main.js             Mobile nav, footer year, subtle scroll reveal, AJAX form handling
assets/favicon.svg  RML monogram favicon
```

Homepage anchors: `#how-we-work`, `#services`, `#mlm`, `#seo`, `#meta-ads`, `#lead-gen`, `#who-we-serve`.

## Editing

1. Edit the HTML/CSS directly (any text editor or the GitHub web editor).
2. **Keep all links and asset paths relative** (`./book/`, `../styles.css`, etc.). The preview runs under the `/rmlgrowth-site/` subpath; relative paths make the same files work there *and* at the domain root later. Don't use root-absolute paths like `/styles.css`.
3. The header and footer are duplicated in `index.html`, `book/index.html`, `contact/index.html`, and `404.html` — update all four if you change nav items.
4. Preview locally: `python3 -m http.server 8000` in the repo, then open http://localhost:8000/.
5. Commit and push to `main`; GitHub Pages redeploys automatically (usually under a minute).

Brand palette (see `:root` in `styles.css`): deep green `#0B3D2E`, mid green `#145C43`, gold `#C4A35A` (sparse accents only), text `#1A1F1C`, background `#F7F6F2`, neutral `#E8E6E1`, white cards. Font: Inter (Google Fonts) with a system-sans fallback.

Content rules from the creative brief: no About/Impact/team pages, no invented metrics, testimonials, client logos, stock team photos, or response-time promises.

## Form backend — FormSubmit

Both forms post via AJAX (`fetch`) to `https://formsubmit.co/ajax/ryan@rmlgrowth.com` (free, no account). That address forwards to Ryan's Gmail.

- Hidden fields: `_subject` ("New call request — rmlgrowth.com" / "New inquiry — rmlgrowth.com"), `_template=table`, `_captcha=false`, plus a `_honey` honeypot for spam.
- The visitor's `email` field is used by FormSubmit as the reply-to.
- **Activation required:** the very first submission to a new address makes FormSubmit send an activation email to ryan@rmlgrowth.com. Ryan must click the confirmation link in that email before any submissions are delivered. Do one test submission from the live site, confirm it, then submit again to verify delivery.
- After activation, FormSubmit may show a random alias string for the address in its emails; you can optionally swap the email in the form `action` for that alias to hide the address from the page source.
- Success state: "Thanks — we’ll follow up shortly." with a link home. Network/server errors show a friendly message with a mailto fallback.

## DNS plan — rmlgrowth.com on Porkbun (not done yet)

Nothing below has been applied. When DNS is approved:

1. **GitHub:** Repo → Settings → Pages → Custom domain → `rmlgrowth.com` (this creates a `CNAME` file in the repo). Optionally verify the domain under your GitHub account settings → Pages to prevent takeover.
2. **Porkbun DNS** (Domain Management → DNS): remove the default parking records, then add:
   - `A` records for the apex (`rmlgrowth.com`, host blank):
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Optional `AAAA` records for the apex:
     - `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - `CNAME` record: host `www` → `ryanlein43-max.github.io`
3. Wait for DNS to propagate (minutes to a few hours), then tick **Enforce HTTPS** in Pages settings once the certificate is issued.
4. Because all paths are relative, no code changes are needed when moving from the subpath preview to the domain root. The 404 page auto-detects its base.
5. Keep any existing MX/email records for rmlgrowth.com intact so ryan@rmlgrowth.com forwarding keeps working.
