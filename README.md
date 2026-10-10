# rmlgrowth-site

Marketing website for **RML Growth Partners LLC** (rmlgrowth.com). Version 2.

Plain static HTML, one CSS file, and a small vanilla JS file. No build step and no dependencies: GitHub Pages serves the repo as it is from the `main` branch root.

* Preview (GitHub Pages): https://ryanlein43-max.github.io/rmlgrowth-site/
* Production (planned): https://rmlgrowth.com, not connected yet (see the DNS plan below)

## Structure

```
index.html            Home: hero, how we work, services, who we serve, closing call to action
book/index.html       /book: book a call form (phone required, preferred call times)
contact/index.html    /contact: inquiry form (phone optional)
404.html              Not found page (sets <base> so it works at any URL depth)
styles.css            All styles, including the self hosted @font-face rules
main.js               Header blur on scroll, mobile menu, scroll reveal, loop videos, form handling
assets/favicon.svg    RML monogram (also used as the header and footer logo mark)
assets/fonts/         Inter and Source Serif 4, latin subset, variable woff2 (SIL Open Font License)
assets/img/           WebP images, 800w and 1400w versions for srcset
assets/video/         Loop videos: 720p (default) and 1080p (wide screens), plus WebP posters
```

Home page anchors: `#how-we-work`, `#services`, `#multi-channel`, `#seo`, `#meta-ads`, `#lead-gen`, `#who-we-serve`.

## Editing

1. Copy comes from `copy-v2.md` (Marketing). Change wording there first, then mirror it in the HTML. Visible copy must not contain em dashes, en dashes, or hyphens used as dashes.
2. **Keep every link and asset path relative** (`./book/`, `../styles.css`, and so on). The preview runs under the `/rmlgrowth-site/` subpath, and relative paths let the same files work there and at the domain root later. Do not use root absolute paths like `/styles.css`.
3. The header and footer are repeated in `index.html`, `book/index.html`, `contact/index.html`, and `404.html`. Update all four when nav items change.
4. Preview locally: run `python3 -m http.server 8000` in the repo, then open http://localhost:8000/.
5. Commit and push to `main`. GitHub Pages redeploys automatically, usually within a minute.

Palette (see `:root` in `styles.css`): deep green `#0B3D2E`, mid green `#145C43`, gold `#C4A35A` (small accents only), text `#1A1F1C`, background `#F7F6F2`, neutral `#E8E6E1`, white cards. Type: Source Serif 4 for large headings, Inter for everything else.

Content rules: no About, Impact, or team pages; no invented metrics, testimonials, client logos, stock team photos, or response time promises.

## Media notes

Source files and masters live outside this repo (`rml-site-v2/assets`). Placement follows `shot-list.md`.

* **Images** are WebP, resized to 800px and 1400px wide versions for `srcset`. All have `width`/`height`, `decoding="async"`, and `loading="lazy"` (nothing above the fold is an `<img>`; the hero is a video poster that gets preloaded).
* **Example work label:** every mockup of an ad, site, form, or search result carries a visible "Example work" corner tag. These are sample creative, never client results. Keep the tag on any new mockup.
* **Videos** (hero, services band, roofing and HVAC card) are decorative, muted, `playsinline`, `preload="none"`, with WebP posters. The HTML default source is the 720p file. `main.js` switches to the 1080p file on wide screens (viewport 1024px or more and at least 1600 device pixels wide, unless Data Saver is on).
* Playback starts only when a video scrolls into view (IntersectionObserver) and pauses when it leaves or the tab is hidden.
* **Loop crossfade:** the clips are 5 seconds and not seamless, so `main.js` stacks two `<video>` elements and crossfades between them over 0.4s at each loop point.
* **Reduced motion:** with `prefers-reduced-motion: reduce`, videos never load or play (the poster still shows), and scroll animations are off.
* Each video has a small pause and play button.
* To re-encode a 1080p loop: `ffmpeg -i master.mp4 -an -c:v libx264 -preset slow -crf 23 -maxrate 6000k -bufsize 12000k -pix_fmt yuv420p -movflags +faststart name-1080p.mp4`

## Form backend: FormSubmit

Both forms post with `fetch` to `https://formsubmit.co/ajax/ryanlein@rmlgrowth.com` (free, no account). That address forwards to Ryan's Gmail.

* Hidden fields: `_subject` ("New call request from rmlgrowth.com" or "New inquiry from rmlgrowth.com"), `_template=table`, `_captcha=false`, a `Form source` value, and a `_honey` honeypot for spam.
* The visitor's `email` field becomes the reply to address.
* **Activation required:** the first submission to a new address makes FormSubmit send an activation email to **ryanlein@rmlgrowth.com**. Nothing is delivered until Ryan clicks the confirmation link in that email. After launch, do one test submission from the live site, confirm the activation email, then submit again to check delivery. (Any earlier activation for a different address does not carry over.)
* After activation, FormSubmit may offer a random alias for the address. You can swap it into the form `action` to keep the address out of the page source.
* Success replaces the form with the page's thank you message. If sending fails, a message offers the email address instead.

## DNS plan: rmlgrowth.com on Porkbun (not done yet)

Nothing below has been applied. When DNS is approved:

1. **GitHub:** Repo, Settings, Pages, Custom domain: `rmlgrowth.com` (this creates a `CNAME` file in the repo). Optionally verify the domain in your GitHub account Pages settings to prevent takeover.
2. **Porkbun DNS** (Domain Management, DNS): remove the default parking records, then add:
   * `A` records for the apex (`rmlgrowth.com`, host blank): `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   * Optional `AAAA` records for the apex: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   * `CNAME` record: host `www` pointing to `ryanlein43-max.github.io`
3. Wait for DNS to propagate (minutes to a few hours), then turn on **Enforce HTTPS** in Pages settings once the certificate is issued.
4. All paths are relative, so no code changes are needed when moving from the subpath preview to the domain root. The 404 page detects its base automatically.
5. Keep the existing MX and email forwarding records for rmlgrowth.com so ryanlein@rmlgrowth.com keeps working.
