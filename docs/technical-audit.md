# Turn It Up! — Technical Quality Audit (Phase 1)

- **Branch audited:** `redesign-26_27` at `d926312`, with a clean working tree
- **Date:** 2026-11-17
- **Scope:** Homepage `/`, the only route. This is a read-only audit: no application code was changed.

**Confidence labels used throughout:**
- **Verified:** reproduced with a measurement, the rendered HTML, or the browser.
- **Suspected:** inferred from code or configuration, and needs a deployed or manual check.

---

## A. Executive summary

**Overall health.** The foundations are good:
- The page is server-rendered, so headings and copy are in the initial HTML.
- CLS is effectively 0.
- Total Blocking Time is close to 0.
- The calendar Netlify Function is well built: tested, private by default, CDN-cached, with safe error output.
- All 32 unit tests and the production build pass.

The problems are concentrated in a handful of areas, most of them cheap to fix.

**Most important findings**

1. **Critical — an Instagram API token is exposed (verified).**
   - `nuxt.config.ts` puts `INSTAGRAM_KEY` into `runtimeConfig.public`.
   - Any build with that variable set serializes the token into every page's HTML. The local build does this.
   - No code uses it.
   - A token with the same `IGQ…` prefix also appears in the history of this **public** GitHub repository (commit `7cf1ef1`).
2. **High — booking inquiries can be lost silently or cluttered with test inquiries (suspected).**
   - The form shows "Thank you!" after any HTTP response, including errors, because it never checks `response.ok`.
   - Deploy-preview submissions go to the same Netlify form as production.
3. **High — mobile LCP misses the target.**
   - LCP is about 3.6 s on simulated slow 4G, against a 2.5 s target.
   - The hero preload has no `fetchpriority`, so it is requested at Low priority.
   - Meanwhile the browser downloads about 1.7 MB of full-resolution Events photos at the same time.
4. **High — the booking form isn't accessible.**
   - There are no visible or programmatic labels; only placeholders.
   - Errors are not linked to their fields, and nothing announces them.
   - Required fields are marked only by an asterisk in the placeholder.
5. **High — the mobile menu isn't keyboard or screen-reader operable.**
   - It has no `aria-expanded` and no dialog semantics.
   - Escape doesn't close it.
   - Focus isn't moved into the menu or trapped there; 31 focusable elements stay reachable behind it.
6. **Medium — dead JavaScript ships to every visitor.**
   - GSAP, ScrollTrigger and `gsap/all` (including Flip and Observer) are bundled into the entry chunk but nothing uses them.
   - Lighthouse estimates about 137 KiB of unused JS.
7. **Medium — the SEO basics beyond title and description are missing.**
   - There is no canonical URL, Open Graph or Twitter metadata, `robots.txt`, sitemap or structured data.
   - Upcoming shows are fetched only on the client, so search engines never see them.

**Biggest opportunities (impact ÷ effort)**
- Fix the hero preload priority and add `sizes` to the Events images. Expected: mobile LCP well under 3 s, and about 1.5 MB less page weight.
- Remove the global GSAP plugin and the `gsap/all` re-export. Expected: about 40–50 KiB gzip off the entry chunk; this is an estimate, so measure it.
- Deduplicate the hero EQ burst. Three copies are rendered and two are hidden with CSS. Expected: about 100 KB less raw HTML and about 400 fewer DOM nodes.
- Add labels and error wiring to the form, and focus handling to the mobile menu.
- Add `MusicGroup`, `VideoObject` and `Event` JSON-LD, plus OG and canonical tags.

---

## B. Baseline scorecard

### Test conditions
- **Build:** production build (`nuxt build`, node-server preset), served on `localhost:3100`.
- **Lighthouse:** 13.6.0, headless Chrome, default throttling.
  - Mobile: Moto G Power emulation on simulated slow 4G.
  - Desktop: desktop preset.
- **Runs:** 3 per configuration. The median run is reported.
- **Compression:** the Nitro node server does not compress HTML or JS, but Netlify's CDN does. Mobile was therefore also measured behind a small local gzip proxy (`localhost:3200`). That row is the representative one.
- **Shows data:** the Netlify Function isn't served by `node .output/server`, so the shows request returned 404 and the list rendered its error state. That error is the only console error Lighthouse recorded.

**This is lab data only.** No field (CrUX or RUM) data was available. INP can't be measured in a lab run; TBT is the lab proxy for it.

### Lighthouse scores

| Configuration | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Mobile, uncompressed (runs 2–3; run 1 was a 36 cold-cache outlier) | 71 | 96 | 96 | 100 |
| **Mobile + gzip (representative)** | **90** | **96** | **96** | **100** |
| Desktop, uncompressed | 96 | 100 | 96 | 100 |

**Why the pages miss 100 on Best Practices and Accessibility:**
- **Best Practices 96:** the console 404 for the shows endpoint, which is a local-only artifact. Expect 100 when deployed; verify on a preview.
- **Accessibility 96 on mobile:**
  - `color-contrast`: the outlined FAQ numbers measure 2.43 : 1.
  - `label-content-name-mismatch`: the reel poster button.

**A perfect automated score would still not mean the page is accessible.** Section G lists manual failures that axe doesn't catch.

### Core Web Vitals (lab)

| Metric | Mobile + gzip | Mobile, uncompressed | Desktop | Target |
|---|---|---|---|---|
| FCP | 1.36 s | 2.85 s | 0.57 s | — |
| LCP | **3.58 s** | 6.65 s | 1.38 s | ≤ 2.5 s |
| CLS | 0.002 | 0.002 | 0.003 | ≤ 0.1 |
| TBT (INP proxy) | 10 ms | 8–12 ms | 0 ms | — |
| Speed Index | 2.06 s | 3.9 s | 0.86 s | — |
| Total transfer | 2,157 KiB | 2,757 KiB | 2,811 KiB | — |
| DOM elements | 1,431 | 1,431 | 1,431 | < ~800 is healthy |

- **LCP element:** the hero photo, `section#home .hero-photo`, on both mobile and desktop.
- **Mobile LCP discovery:**
  - The request is discoverable in the HTML and is not lazy-loaded.
  - It is **not** priority-hinted: the `<link rel="preload">` has no `fetchpriority`, so Chrome requests it at **Low**.
  - It competes with three Events images (about 1.7 MB) that Chrome's lazy-load threshold starts fetching right away.

### Bundle sizes (client)

| Chunk | Raw | Gzip | Contents |
|---|---|---|---|
| `C9iReR9b.js` (entry) | 303.9 kB | 117.4 kB | Vue, Nuxt runtime, router, Pinia, Iconify, **GSAP + ScrollTrigger + `gsap/all` (Flip, Observer…)**. 46% unused on load according to Lighthouse. |
| `DfCIXOCs.js` (page) | 95.6 kB | 36.6 kB | Homepage components, Vuelidate, **3 × EqBurst path data (35 kB source)** |
| `BlnUfnlm.js` | 8.2 kB | 3.3 kB | Lazy chunk |
| `index.css` + `entry.css` | 5.6 kB | 1.7 kB | Tailwind output. Both render-blocking; about 150–300 ms on mobile. |
| **HTML document** | **388 kB** | **77.7 kB** | 154 kB of hero EQ `<path>` markup (3 copies), 68 kB of radial EQ spans, 101 kB of inline `<style>` |
| Fonts | 10 × woff2 | ~110 kB loaded | 3 families: Big Shoulders 700/800/900, DM Serif 400 + italic, Manrope 400–700. All self-hosted at build time with `display: swap`. |

### Largest resources (mobile + gzip run)

| Bytes | Resource | Problem |
|---|---|---|
| 840 KB | `/_ipx/f_webp/images/group-1.jpg` | Events card. No `sizes` or `width`, so the full 3000 px original is converted to WebP. |
| 756 KB | `/_ipx/f_webp/images/kelcey-balloons.jpg` | Same |
| 149 KB | `/_ipx/f_webp/images/bob-kel--mic.jpg` | Same |
| 118 KB | Entry JS (gzip) | Includes unused GSAP |
| 78 KB | HTML (gzip) | EQ markup duplication |
| 57 KB raw, 23 KB gzip | `/favicon.svg` | Embeds the full logo artwork. A favicon should be under 2 KB. |
| 55 KB | `reel-live.jpg`, `w_1136` | Fine |
| 23 KB | Hero `w_768` WebP | Fine. This is the LCP resource. |

**Source images in `public/images/`** add up to about 30 MB.
- `bob`, `james`, `group-1`, `kelcey-balloons` and `tom-balloons` are each 4–5 MB at 2318–3000 px.
- `band-hero.jpg` is 2.6 MB at 3000 px.
- These only reach users where `sizes` is missing, but they slow builds and generation.
- `reel-live 2.jpg` (with a space in the name) and `hero-crowd.jpg` are unused.

---

## C. Prioritized issue inventory

**Legend:**
- **Severity:** C = Critical, H = High, M = Medium, L = Low.
- **Status:** **V** = verified, **S** = suspected.

### Security

| # | Sev | Status | Where | Evidence → problem | Recommended fix | Benefit | Verify |
|---|---|---|---|---|---|---|---|
| S1 | **C** | V | `nuxt.config.ts` `runtimeConfig.public.igKey` | The local SSR HTML contains `igKey:"IGQ…"`, a live-format Instagram Graph token. Anything under `public` is serialized to every visitor. Nothing reads `igKey`. The `IGQ…` prefix also appears 6 times in the history of the **public** repo (commit `7cf1ef1`, `InstagramFeed.vue`). | **Revoke or rotate the token in Meta now.** Delete `igKey` from `runtimeConfig`. Remove `INSTAGRAM_KEY` from `.env` and from Netlify if nothing needs it. Treat history as compromised; rotating is the fix, and rewriting history is optional. | Closes an account-takeover and abuse vector | `curl` the deployed HTML and grep for `igKey`; confirm the old token returns 401 |
| S2 | M | V | `npm audit --omit=dev` | 18 advisories (1 critical, 13 high), almost all in `tar` → `giget` → `c12`, which are **build-time** Nuxt dependencies, not shipped to browsers. | Upgrade Nuxt within 3.x (3.12.4 → 3.21.x) and run `npm audit fix`. Don't jump to Nuxt 4 or Tailwind 4 as part of this. | Supply-chain hygiene for the build | `npm audit` is clean, and the build and tests pass |
| S3 | M | S | Netlify headers | There's no `[[headers]]` block, so no CSP, `Referrer-Policy`, `X-Content-Type-Options`, `Permissions-Policy` or `frame-ancestors`. | Add a headers block in `netlify.toml`. Start CSP as `Content-Security-Policy-Report-Only`. Allow `youtube-nocookie.com` for frames and Iconify only if icons load remotely. Note that Nuxt inlines its payload script, so CSP needs hashes or `'unsafe-inline'` for scripts at first. | Defense in depth, and the Best Practices audit | securityheaders.com against the preview |
| S4 | L | V | `ShowsList.vue` | `console.log` / `console.table` of every calendar response in production. | Guard with `import.meta.dev` or remove. | Cleaner console; nothing sensitive is logged, because the payload is already public | DevTools console on the preview |
| S5 | L | V | `SocialList.vue` | `target="_blank"` without `rel`. Modern browsers imply `noopener`, so the risk is minimal. | Add `rel="noopener"` and a visually hidden "(opens in new tab)". | Consistency and accessibility | Read the markup |

### Booking form and conversion (`components/ContactForm.vue`)

| # | Sev | Status | Evidence → problem | Recommended fix (needs your approval: booking behaviour) | Verify |
|---|---|---|---|---|---|
| F1 | **H** | V (code), S (prod) | `fetch('/').then(() => isSubmitted = true)` never checks `res.ok`. Locally, `POST /` returns **200** with the homepage HTML, so a failed or undetected Netlify form still shows "Thank you!" and the lead is lost. Network errors only `console.error`, with no message to the user. | Check `res.ok`. On failure, show an inline error with the email address as a fallback, and keep the user's input. | Submit on a preview with the form disabled; you should see an error, not a success message |
| F2 | **H** | S | The Netlify form is shared across production, deploy previews and branch deploys. Redesign-preview submissions land in the real inbox and trigger notifications. | Option A: on non-production contexts, post to a different form name such as `contact-form-preview`, chosen at build time from `CONTEXT`. Option B: scope notifications to the production context in Netlify UI. Decide before redesign previews are shared. | Submit once from the preview and confirm it doesn't notify the band |
| F3 | **H** | V | No `<label>` on any field. The placeholder is the only name: axe accepts it, but WCAG 1.3.1 and 3.3.2 don't in practice, because it disappears on input and `placeholder-stone` is only 4.77 : 1. | Add visible labels: small uppercase labels above the pills fit the editorial style, or use floating labels. Keep the placeholders as hints. | Screen reader reads the label; still readable with text zoomed to 200% |
| F4 | **H** | V | Errors are not associated with fields: no `aria-invalid`, no `aria-describedby`, no live region, and focus isn't moved to the first error. After a failed submit, focus stayed on the submit button and nothing was announced. | Set `aria-invalid` and link each error with `aria-describedby`. Focus the first invalid field. Add `role="status"` to the success message and focus its heading. | VoiceOver: submit an empty form and hear the errors |
| F5 | M | V | Required fields have no `required` / `aria-required`. No `autocomplete` (`name`, `email`, `tel`). Pink error text sits on a pink-adjacent theme and isn't paired with an icon. | Add `required`, `autocomplete`, `inputmode`. Keep `novalidate` with custom errors if you prefer the styling. | Inspect the attributes |
| F6 | M | V | The date field swaps `type` from text to date on focus (`onfocus="this.type='date'"`). That loses the value format, confuses screen readers, and on iOS opens the picker unexpectedly. | Use `type="date"` with a visible label, or a text field with a format hint. | Test on iOS Safari and with VoiceOver |
| F7 | M | V | Event-type chips use `role="radio"` on `<button>`s without arrow-key handling or roving `tabindex`. That's half of the ARIA radio pattern. | Use native `<fieldset><legend>` with visually styled `<input type="radio">`. That also posts the value natively, so the hidden `eventType` input becomes unnecessary. | Keyboard: Tab into the group, then use the arrows |
| F8 | L | S | Spam: honeypot only. | Fine for now. Add Netlify's built-in reCAPTCHA only if spam actually appears. | Watch the form's spam folder |
| F9 | L | V | No server-side validation; Netlify Forms accepts anything. | Acceptable for a contact form. Optionally add a submission-created function to reject empty email. | — |

### Performance

| # | Sev | Status | Where | Evidence → problem | Recommended fix | Expected benefit | Verify |
|---|---|---|---|---|---|---|---|
| P1 | **H** | V | `HeroMain.vue` NuxtImg `preload` | The preload `<link>` has no `fetchpriority`, so the hero is requested at Low priority. Lighthouse `lcp-discovery`: "fetchpriority=high should be applied". | `:preload="{ fetchPriority: 'high' }"`, supported in @nuxt/image ≥ 1.8; the installed version is 1.7.0, so upgrade to 1.11, or add the head link manually. | LCP on mobile likely −0.5 to −1 s (estimate) | Lighthouse mobile + gzip × 3 |
| P2 | **H** | V | `Events.vue` NuxtImg | No `sizes` or `width`, so 3000 px originals are served as WebP: 840 KB + 756 KB + 149 KB. On mobile they start loading during the hero's LCP window. | `sizes="100vw md:33vw"` (cards are about 360 px wide on desktop) plus `width`/`height`. | About −1.5 MB, plus less LCP bandwidth contention | Network panel; total bytes |
| P3 | M | V | `HeroMain.vue` `sizes` | `"100vw sm:100vw …"` produces junk `1w` and `2w` srcset entries and a `w_2560` `src`/preload `href`. | `sizes="100vw"` with explicit `densities="x1 x2"`, or a `widths` list. Cap at 1920 because the image is dimmed and grained. | Cleaner srcset; avoids over-download on 4K | Inspect the srcset |
| P4 | M | V | `plugins/gsap.client.js`, `utils/index.js` | GSAP + ScrollTrigger are registered globally, and `utils/` re-exports `gsap/all`, so Flip, Observer and others end up in the entry chunk. **No component uses GSAP.** | Delete both files and remove the dependency. If you want the scroll-motion work back, import only `gsap` + `ScrollTrigger` inside that composable, so it lands in the page chunk. | About 40–50 KB gzip off the entry chunk (estimate; measure) | Build output chunk sizes; Lighthouse `unused-javascript` |
| P5 | M | V | `HeroMain.vue`, `EqBurst.vue` | 3 EqBurst instances (240/320/440 px), each with the full path set, two of them `display:none`. That's 154 kB of HTML and most of the 1,431 DOM nodes. Path data is also bundled into JS for hydration. | Render one SVG and size it responsively with CSS (`width: clamp(...)`); `viewBox` already scales. | About −100 kB raw HTML, about −400 DOM nodes, faster hydration | HTML size; DOM count |
| P6 | M | V | `Contact.vue`, `EqBurstRadial.vue` | About 350 absolutely positioned spans, each running an infinite CSS animation. It's `hidden md:block`, so the cost is on desktop, and it keeps running off screen. | Render it as one SVG, or pause it off screen with an IntersectionObserver (`animation-play-state`). | Lower desktop compositor and paint cost while scrolling | Performance panel: frame timing while the section is off screen |
| P7 | M | V | `public/favicon.svg` | 57 KB; the full logo artwork is used as a favicon. | Simplified 16–32 px mark, under 2 KB. | −55 KB per first visit | File size |
| P8 | M | S | Netlify caching | No `[[headers]]`. Netlify's default for everything is `max-age=0, must-revalidate`, including hashed `/_nuxt/*`. | `/_nuxt/*` and `/_ipx/*`: `Cache-Control: public, max-age=31536000, immutable`. | Repeat-visit speed | `curl -I` on the preview |
| P9 | M | S | `nuxt.config` `image.provider: 'ipx'` | Under static `nuxt generate`, IPX pre-renders only the URLs it crawls. Under SSR on Netlify it runs inside a function (cold starts). | Under SSR, consider the `netlify` provider (Netlify Image CDN, which also adds AVIF). Under static generate, keep IPX but add `format="avif,webp"` via `<NuxtPicture>` for photos. | AVIF is about 20–30% smaller than WebP | Confirm the deploy mode first (§F) |
| P10 | L | V | `ShowsList.vue` | A 1-second `setInterval` updates `now`, which recomputes `upcoming` and re-renders the list (calling `parse()` 3× per row) every second for the life of the page. | Tick every 60 s. "Tonight" doesn't need second precision. Memoize the per-show `parse` into a computed list. | Less idle main-thread work, especially on low-end phones | Performance panel, 10 s idle |
| P11 | L | V | `Header.vue` | The non-passive `scroll` listener runs on every scroll event. | `{ passive: true }`, or an IntersectionObserver sentinel at 150 px. | Smoother scroll on low-end devices | Performance panel |
| P12 | L | V | Fonts | 3 families, 9 weights/styles, 10 woff2 files. | Audit actual usage: Big Shoulders is likely only used at 900 (Wordmark, numbers). Drop unused weights. | About 30–60 KB fewer font bytes | Network panel |
| P13 | L | V | Render-blocking CSS | 2 small stylesheets, about 150–300 ms on mobile per Lighthouse. | Leave it; Nuxt's inline styles already cover most of the CSS. Low priority. | — | — |
| P14 | L | V | `package.json` | Unused: `vue-lite-youtube-embed`. Also `htmlparser2` and `google-auth-library` are used only by the Netlify Function (fine, but note them). Unused files: `HeroConcept.vue`, `ScrollingMarquee.vue`, `TailwindBreakPoints.vue`, `data/shows.mjs` (kept "as history" per the docs), `public/images/reel-live 2.jpg`, `hero-crowd.jpg`. | Remove them. | Dependency hygiene | `npm ls`, build |

### Accessibility (WCAG 2.2 AA)

| # | Sev | Status | Where | Evidence → problem | Fix | Verify |
|---|---|---|---|---|---|---|
| A1 | **H** | V | `Hamburger.vue`, `MobileMenu.vue` | Tested at 320 px: no `aria-expanded` or `aria-controls`; the label is a static "Menu". The panel has no role or name. Escape doesn't close it. Focus stays on the toggle, and **31 focusable elements behind the overlay remain tabbable**. Body scroll isn't locked. | Toggle: `aria-expanded`, `aria-controls`. Panel: `role="dialog" aria-modal="true" aria-label="Menu"`, move focus to the first link, trap Tab, close on Escape and return focus to the toggle, set `inert` on `<main>` while open. | Keyboard plus VoiceOver walkthrough |
| A2 | **H** | V | Form | See F3, F4 and F7. | — | — |
| A3 | M | V | `NavList.vue`, `Header.vue`, `Events.vue` | In-page navigation uses `<button @click=scrollIntoView>` instead of `<a href="#shows">`. That means: no URL fragment, no middle-click or share, no crawlable internal links (only 4 `<a href>` on the page), and screen readers announce "button". The Events cards are `<button>`s that **contain `<h3>`, `<p>` and `<div>`**, which is invalid HTML because buttons allow only phrasing content. | Use real anchors: `<a href="#shows">` with `scroll-behavior: smooth` in CSS (gated by reduced motion). For Events, use an `<article>` with a heading and an `<a href="#contact">` CTA; stretch the link across the card with a pseudo-element if the whole card must be clickable. | W3C validator; keyboard |
| A4 | M | V | `useScrollIntoView.js` | `behavior: 'smooth'` is hard-coded and ignores `prefers-reduced-motion`. | `behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'`, or move it to CSS as in A3. | Emulate reduced motion |
| A5 | M | V | `NavList.vue` | The focus indicator is a text colour change only (`focus-visible:outline-none focus-visible:text-pink`), which is weak against WCAG 2.4.7 and 2.4.13. Several other buttons rely on the default outline, which is barely visible on the dark UI. | Add a global `:focus-visible { outline: 2px solid #FF2E8A; outline-offset: 3px }` and remove the `outline-none` overrides. | Tab through the whole page |
| A6 | M | V | `Faq.vue`, `About.vue` `.num` | Outlined numbers measure 2.43 : 1 (axe failure). | They're decorative: `aria-hidden="true"`. In FAQ they're inside the button name too ("01 Will you learn…"), so hiding them also cleans up the accessible name. | Lighthouse a11y |
| A7 | M | V | `Videos.vue` | The poster button has `aria-label="Play the Turn It Up! live reel"` but its visible text is "Watch it live" (2.5.3 Label in Name). | Remove the `aria-label` and use visible text plus a visually hidden suffix, for example "Watch it live <span class=sr-only>: play the Turn It Up! reel</span>". | Lighthouse `label-content-name-mismatch` |
| A8 | M | V | Contrast | `ShowsList` "Private" pill: `text-ivory/40` = 3.43 : 1 at 13 px, which fails. Song-search placeholder: 3.08 : 1, fails. Search input border (1.5 : 1) and unselected event chips (2.51 : 1) fall below 3 : 1 for component boundaries. | Use `ivory/60` (≥ 4.5) for the pill and placeholder; use `ivory/40` or higher for input borders. | Contrast checker |
| A9 | M | V | Page structure | No skip link. Sections have no accessible names, so they aren't landmarks; only one `<nav>`. The Reviews section has no `id`. The header renders a second `<header>` element; inside a section that's fine, but note it. | Add a "Skip to main content" link and `id="main"`. Give the key sections `aria-labelledby` pointing at their `h2`. | Rotor or landmarks list |
| A10 | M | S | Reel video | YouTube captions unknown. The facade is good: nothing autoplays without a click. | Confirm the YouTube video has accurate captions (not auto-generated only). Add a short text description under the poster. | Play with captions on |
| A11 | L | V | `SocialList.vue` | Targets are 24 × 19 px. That passes 2.5.8 only through the spacing exception. | Pad to 44 × 44 (`p-2.5`). | Measure |
| A12 | L | V | `ShowsList` "Try again →", "More dates →" | 20 px tall; the arrow glyph is read aloud. | `min-h-[44px]`, arrow `aria-hidden`. | — |
| A13 | L | S | Hero headline | Each word is wrapped in inline-block masks; VoiceOver may read the words one by one. | Put the plain text in `aria-label` on the `h1`, with the visual spans `aria-hidden`. Test before changing. | VoiceOver on iOS |
| A14 | L | V | `Reviews.vue` | **Placeholder testimonials** ("Sample couple", "TODO: replace with real reviews") ship on the page. This is a trust problem rather than WCAG, but it must not go live. Same for `Faq.vue` ("TODO: confirm answers"). | Replace with real, attributable reviews, or hide the section until you have them. Never mark these up as `Review` schema. | Content review |

**Reduced motion.** The CSS animations in the hero, header, EQ, FAQ and reel are gated by `prefers-reduced-motion`; this was verified in code. There are no scroll-driven animations on this branch, because the GSAP scroll-motion work isn't present. Nothing depends on an animation finishing: SSR content stays visible in the final state.

### SEO and structured data

| # | Sev | Status | Evidence → problem | Fix | Verify |
|---|---|---|---|---|---|
| SEO1 | M | V | SSR HTML has a title and description, but **no canonical, no `og:*`, no `twitter:*`, no `theme-color`**. Shared links get no image or card. | `useSeoMeta` in `pages/index.vue`: `ogTitle`, `ogDescription`, `ogImage` (a 1200 × 630 band photo with the logo), `ogUrl`, `twitterCard: 'summary_large_image'`. Add `<link rel="canonical">` to the production origin, read from `runtimeConfig` so previews don't claim production. | View source; the Facebook and LinkedIn sharing debuggers |
| SEO2 | M | V | `/robots.txt` and `/sitemap.xml` return 404. | Add a static `public/robots.txt` with a `Sitemap:` line, and a one-URL `public/sitemap.xml`. No module needed for one route. Previews: Netlify adds `X-Robots-Tag: noindex` on deploy previews by default; confirm it. | `curl` both on the preview |
| SEO3 | M | V | No structured data. | JSON-LD via `useHead`, using only data that exists on the page: a **`MusicGroup`** (name, url, genre "Cover band", areaServed New England, `sameAs` Instagram, Facebook and YouTube, image, and members as `Person` with roleName) and a **`VideoObject`** for the reel. `VideoObject` needs `name`, `thumbnailUrl`, `uploadDate` and `embedUrl`; take `uploadDate` from YouTube and don't guess it. **Do not** add `Review` or `AggregateRating` (A14). | Rich Results Test, validator.schema.org |
| SEO4 | M | V | Shows are fetched only on the client (by design, per `docs/google-calendar.md`), so they're absent from the HTML crawlers see, and no `Event` schema can be produced from them. | Option A (keeps the current architecture): after the client fetch, inject `MusicEvent` JSON-LD with `useHead`. Google can render JS, but this is less reliable. Option B: an edge function or on-demand builder that renders the shows into the HTML at the CDN, cached for 5 minutes like the function. Either way, use exactly the same objects as the visible list: name = venue, `startDate` with an offset, `location.address` = the displayed City, ST, `eventStatus`, `url` = venue link. **Rich-result eligibility for Events requires a full address**, and the function intentionally exposes only City, ST, so Event rich results probably **won't** be eligible. Schema is still valid and useful. | Rich Results Test on the preview with real calendar data |
| SEO5 | L | V | `app.vue` sets a fallback description, "Turn It Up! \| Boston, MA \| Coverband". The page overrides it; that's fine, but set a `titleTemplate` and keep descriptions in one place. | — | — |
| SEO6 | L | V | H1 → H2 → H3 hierarchy is correct: one H1. FAQ h3s include the decorative "01" (see A6). The `Faq` could add `FAQPage` schema, but Google limits FAQ rich results to government and health sites, so the value is low. | — | — |
| SEO7 | L | S | `turnitupband.com` currently serves a parked-domain redirect (`/lander`), not this site. | Confirm the production domain and set the canonical, OG URL and sitemap to it. | — |

### Google Calendar integration

The audit found it strong:
- The service account is read-only.
- Credentials are server-only, with a `.env.example` that warns against `NUXT_PUBLIC_`.
- The response is minimal and allowlisted.
- Errors are generic and uncached, with a request ID.
- The CDN caches for 300 s (`Netlify-CDN-Cache-Control: s-maxage=300`).
- Requests have a 10 s timeout and no retry storms.
- Boston-time date boundaries are tested; 32 tests pass.
- The client aborts in-flight requests on refresh and has skeleton, error and empty states with `role="status"`.

| # | Sev | Status | Issue | Fix |
|---|---|---|---|---|
| CAL1 | L | V | `maxResults: 2500` over a 2-year window, every 5 minutes per CDN node. That's fine at this scale. | Optionally reduce to 250. |
| CAL2 | L | V | The client refetches every 5 minutes and on every window `focus`, so tab-switching fires bursts. The CDN absorbs them. | Throttle focus refreshes to one per 60 s. |
| CAL3 | L | V | The skeleton has 5 rows; with fewer shows, the content below shifts up when data arrives. CLS stayed under 0.01 because the list sits below the fold on load. | Acceptable. Set `min-height` on the list if Shows ever moves above the fold. |
| CAL4 | L | V | The "Tonight" and "Next" labels are colour-only pills. Their text conveys the meaning, so this passes. | — |

### Maintainability

| # | Sev | Issue | Fix |
|---|---|---|---|
| M1 | M | No lint, typecheck or format scripts. Tests cover only the calendar. No CI on the branch. | Add `nuxi typecheck` and ESLint (`@nuxt/eslint`) as dev scripts, plus a GitHub Action running build + test. |
| M2 | L | Pinia is used for a single boolean (mobile menu open). | Replace with `useState('menu-open')`. Remove `@pinia/nuxt` and `pinia` (about 5 KB gzip). |
| M3 | L | `nuxt-icon` 0.6 is deprecated in favour of `@nuxt/icon`. Three icons are used. | Inline the 3 SVGs and drop the module. |
| M4 | L | The colours `#D9D3C9` and `#CFC8BD` are hard-coded in several components outside the Tailwind tokens. | Add them as tokens. |
| M5 | L | README is still the Nuxt starter. | A short project README: dev, mock, deploy context, form notes. |

---

## D. Implementation roadmap

Each batch is small and measured independently. Nothing below starts without your approval. Batches touching booking behaviour (F1, F2, F6, F7) need explicit sign-off.

**P0 — critical, do first**
1. **S1:** rotate the Instagram token (your action, in Meta) and remove `igKey` from `runtimeConfig`.
2. **F1 + F2:** make submit failures visible, and stop preview submissions reaching the real inbox. Requires approval because it changes booking behaviour.

**P1 — high impact**
3. **P1 + P2 + P3:** hero preload priority, Events `sizes`, hero srcset cleanup. Upgrade `@nuxt/image` to 1.11.
4. **A1:** mobile menu dialog semantics, focus management, Escape, `inert`.
5. **F3–F5:** form labels, error association, autocomplete and required.
6. **P4:** remove the unused GSAP plugin, the `gsap/all` re-export and `vue-lite-youtube-embed`.
7. **SEO1–SEO3:** OG, Twitter, canonical, robots, sitemap, MusicGroup and VideoObject JSON-LD.

**P2 — quality refinements**
8. **A3–A9:** anchors instead of scroll buttons, valid Events card markup, global focus ring, contrast fixes, skip link, label-in-name.
9. **P5–P8:** single EQ burst SVG, pause the radial EQ off screen, small favicon, Netlify cache headers.
10. **S2 + S3:** Nuxt 3.x minor upgrade and audit fix; security headers in report-only mode.
11. **SEO4:** Event JSON-LD from the calendar data, option A.
12. **A14:** real reviews and confirmed FAQ answers (content, owner: band).

**P3 — optional enhancements**
13. AVIF via NuxtPicture or Netlify Image CDN (P9).
14. Font weight pruning (P12). Replace Pinia and nuxt-icon (M2, M3).
15. Lint, typecheck and CI (M1). Re-encode source images in `public/images` to ≤ 2560 px.
16. Edge-rendered shows for crawlable events (SEO4, option B).

---

## E. Verification checklist (repeatable)

```bash
npm test                        # 32 calendar tests
npx nuxt build                  # must succeed; record chunk sizes from the output
PORT=3100 node .output/server/index.mjs
# Put a gzip layer in front for realistic mobile numbers
# (the proxy script used is described in the Methodology note below), then:
npx lighthouse@13.6.0 http://localhost:3200/ --output=json --output-path=mobile-N.json         # ×3
npx lighthouse@13.6.0 http://localhost:3200/ --preset=desktop --output=json --output-path=desktop-N.json  # ×3
```

Record the median of each configuration and compare against Section B.

**Per-batch checks**
- **Performance:**
  - Entry chunk gzip size.
  - HTML gzip size.
  - DOM element count.
  - Total bytes.
  - LCP request priority, which should show as High in the network table.
  - LCP, FCP, TBT and CLS medians.
- **Accessibility, manual:**
  - Keyboard-only pass of the full page: skip link, nav, menu open, Escape, FAQ, event chips, form submit with errors, video play.
  - VoiceOver (macOS Safari and iOS) pass of the menu and the form.
  - 200% and 400% zoom at 1280 px; reflow at 320 px (no horizontal scroll was verified at 320 px).
  - Reduced-motion emulation.
- **SEO:**
  - `curl -s URL | grep -E 'og:|canonical|ld\+json'`.
  - `/robots.txt` and `/sitemap.xml` return 200.
  - Rich Results Test and the Schema validator.
- **Form (on a deploy preview only):**
  - A valid submission reaches the preview form, not production notifications.
  - A forced failure shows an error.
  - Errors are announced.
- **Security:**
  - Grep the deployed HTML for `igKey` and any `IGQ`.
  - `npm audit`.
  - `curl -I` for headers.
- **Visual regression:** compare screenshots at 375, 768, 1280 and 1440 px before and after each batch.

---

## F. Remaining limitations / not verified

- **No field data:** CrUX and RUM aren't available, so all Core Web Vitals here are lab values. INP needs field data or manual interaction tracing.
- **Production deploy mode is unconfirmed.**
  - The docs say the site uses `npm run generate` (static) with `.output/public`. It was audited with `nuxt build` (SSR), which renders the same HTML.
  - Netlify Forms detection, the IPX behaviour (P9) and caching (P8) depend on this. Verify on a deploy preview.
- **Netlify-specific behaviour wasn't tested locally:** compression (simulated with a gzip proxy), cache headers, Forms, deploy-preview `noindex`, and the Calendar function with real credentials. The local function call 404'd.
- **The production domain is unknown.** `turnitupband.com` currently serves a parked redirect, so live-site checks (S1 exposure on production, canonical) couldn't run.
- **Screen readers:** no screen-reader session was run in this phase. Findings come from DOM inspection, axe (via Lighthouse) and keyboard simulation.
- **Real devices:** low-end Android and iOS weren't tested on hardware. Orientation changes weren't tested.
- **YouTube captions** weren't checked.
- **Bundle saving from removing GSAP** is an estimate until the change is built.
- **Motion work:** the GSAP scroll-motion system from the earlier session isn't on this branch. If it returns, re-run the animation audit: scrubbed triggers, ResizeObserver refresh, reduced motion.

### Methodology note

The gzip proxy is a 15-line Node `http` + `zlib` pass-through. It runs on `:3200` in front of the production server on `:3100`, and gzips text, JS, JSON, SVG and CSS responses so they resemble a CDN's. It was kept in the session scratchpad rather than in the repo. Raw Lighthouse JSON (12 runs) is also in the session scratchpad and isn't committed.

---

## G. Implementation log

### Batch P0 (2026-11-17): S1, F1, F2

**Changes**

- **`nuxt.config.ts`:**
  - Removed `runtimeConfig.public.igKey`.
  - Added `runtimeConfig.public.deployContext`, which takes Netlify's build-time `CONTEXT` and falls back to `'local'`.
- **`components/ContactForm.vue`:** the form now has an explicit status: `idle`, `sending`, `sent`, `error` or `preview`.
  - **F1 — failures are shown:**
    - A non-2xx response or a network error leaves the form and its values in place.
    - It shows a `role="alert"` message offering an Instagram fallback.
    - While a submission is sending, the button reads "Sending…" and is disabled, which prevents duplicate posts.
    - The success panel now has `role="status"`.
  - **F2 — previews can't send:**
    - Unless the build context is `production`, validation still runs but no POST is made.
    - A `role="status"` notice says that nothing was sent.
    - The form markup and name are unchanged, so Netlify still detects the form on production builds.

**Before → after (verified)**

| Check | Before | After |
|---|---|---|
| `igKey` / `IGQ…` in SSR HTML | present | **absent**; only `deployContext:"production"` is serialized |
| POST returns HTTP 500 | "Thank you!" shown, lead lost | alert shown, typed values kept, 1 POST |
| Network error | nothing shown (console only) | alert shown |
| POST returns HTTP 200 | "Thank you!" | "Thank you!" (unchanged) |
| Valid submit on a `deploy-preview` context | POST to the shared Netlify form | **0 POSTs**, preview notice shown |
| Empty submit | name and email errors | unchanged (2 errors) |
| Unit tests / production build | 32 pass / ok | 32 pass / ok; client chunks unchanged within 1 kB |

**How it was verified**
- **Production context:** `CONTEXT=production nuxt build`, then the HTML was grepped for the token.
- **Preview context:** the same build run with `NUXT_PUBLIC_DEPLOY_CONTEXT=deploy-preview`.
- **Form scenarios:** driven in the browser with `fetch` stubbed for the 500, network-error and 200 cases. Nothing was sent to Netlify.

**Still required (outside the code)**
- **Rotate or revoke the Instagram token in Meta.** It is still in the public repository's git history and in the local `.env`. Remove `INSTAGRAM_KEY` from Netlify environment variables if it is set there.
- **On the first deploy preview:**
  - Confirm the page payload shows `deployContext:"deploy-preview"` or `"branch-deploy"`.
  - Confirm that submitting shows the preview notice.
- **After production deploy:** submit one real test inquiry and confirm it arrives. This confirms `CONTEXT=production` reached the build.
- **Static generate:** if production uses `npm run generate`, the context is baked at generate time. That is correct on Netlify, but a local `npm run generate` produces a "local" (non-sending) build.

### Batch P1 (2026-11-17): P1–P4, A1, F3–F5, SEO1–SEO3

**Changes**

- **P4 — unused JavaScript removed:**
  - Deleted `plugins/gsap.client.js` and `utils/index.js` (the `gsap/all` re-export).
  - Uninstalled `gsap` and `vue-lite-youtube-embed`.
- **P1–P3 — images:**
  - Upgraded `@nuxt/image` from 1.7.0 to 1.11.2, which adds a priority option for the preload.
  - Hero: `:preload="{ fetchPriority: 'high' }"`.
  - Events cards: `sizes="xs:100vw md:400px"`.
  - All `sizes` now use breakpoint prefixes only. In @nuxt/image v1, an unprefixed `100vw` emits junk `1w`/`2w` srcset entries; this affected the hero, Reel, About and portraits.
- **A1 — mobile menu (`MobileMenu.vue`, `Hamburger.vue`, `NavList.vue`):**
  - The toggle has `aria-expanded` and `aria-controls`; the panel is `role="dialog" aria-modal="true" aria-label="Menu"`.
  - On open, focus moves to the first link and Tab wraps between the panel and the toggle.
  - Escape closes the menu and returns focus to the toggle.
  - While the menu is open, `main` and `footer` are `inert` and page scrolling is locked.
  - The menu closes automatically at the desktop breakpoint.
  - Nav items close the menu *before* scrolling, because unlocking page scroll mid-scroll cancels a smooth scroll.
- **F3–F5 — form (`ContactForm.vue`):**
  - Visible labels above each field.
  - `autocomplete` on name, email and phone, plus `inputmode`.
  - `aria-required` on name and email, and "(optional)" on phone.
  - `aria-invalid` and `aria-describedby` linking each field to its error.
  - Focus moves to the first invalid field.
  - `novalidate` so the custom messages are the only ones shown.
  - Labels and errors have a dark text halo so they stay readable over the EQ burst on desktop.
- **SEO1–SEO3:**
  - `useSeoMeta` (OG and Twitter card, `theme-color`) and `<link rel="canonical">`.
  - A new 1200 × 630 `public/og-image.jpg`, cropped from `band-hero.jpg`.
  - `MusicGroup` and `VideoObject` JSON-LD, using only on-page facts. The video `uploadDate` is `2024-07-30T17:30:20-07:00`, read from YouTube.
  - `/robots.txt` and `/sitemap.xml` as Nitro routes, prerendered at build time. `robots.txt` allows crawling only when `CONTEXT=production`; otherwise it returns `Disallow: /`.
  - The site URL comes from Netlify's `URL` build variable through `runtimeConfig.public.siteUrl`.

**Before → after**

The "after" measurements come from a production build with `CONTEXT=production URL=https://site.example`, Lighthouse 13.6.0, 3 runs each, mobile served through the gzip proxy.

| Metric | Before | After |
|---|---|---|
| Entry JS chunk | 303.9 kB / **117.4 kB gzip** | 198.8 kB / **75.2 kB gzip** (−42 kB gzip) |
| Mobile total transfer | **2,157 KiB** | **593 KiB** (−73%) |
| Desktop total transfer | 2,811 KiB | 530 KiB |
| Events card image (each) | 149–840 KB, 3000 px source | 59–63 KB, `w_800` |
| Hero preload priority | Low, no `fetchpriority` | **High** (`fetchpriority="high"`) |
| Junk `w_1`/`w_2` srcset entries | 5 images | 0 |
| Desktop Lighthouse performance | 96 | **100** |
| Desktop LCP / FCP | 1.38 s / 0.57 s | **0.80 s / 0.33 s** |
| Mobile Lighthouse performance | 90 | 90–91 |
| Mobile LCP / FCP | 3.58 s / 1.36 s | 3.54–3.60 s / 1.36 s, **unchanged** |
| Mobile Speed Index | 2.06 s | 1.36–1.76 s |
| CLS / TBT | 0.002 / 10 ms | 0.002 / 11–20 ms |
| OG / Twitter / canonical / JSON-LD in SSR HTML | none | present (13 meta tags, canonical, 2 JSON-LD blocks) |
| `/robots.txt`, `/sitemap.xml` | 404 | 200, prerendered |
| Mobile menu: tabbable elements behind the open menu | 31 | 0 (`main` and `footer` inert) |
| Escape closes the menu | no | yes, focus returns to the toggle |
| Labelled form fields | 0 / 6 | 6 / 6 |
| Errors linked to fields | no | yes; focus goes to the first error |
| Unit tests / build | 32 pass / ok | 32 pass / ok |

**Why mobile LCP didn't move.** The hero is now High priority and tiny (23 KB at `w_768`), and observed LCP is about 260 ms. What still sits ahead of it on simulated slow 4G is about 79 KB of gzipped HTML, about 115 KB of JS and about 110 KB of fonts, all requested at High or VeryHigh priority. The next levers are:
- **P5:** a single EQ burst SVG, which removes most of the 154 kB of duplicated `<path>` markup.
- **P12:** font weight pruning.

Both are scheduled in P2/P3.

**Remaining automated failures (all scheduled)**
- `color-contrast`: FAQ outlined numbers (A6).
- `label-content-name-mismatch`: reel poster (A7).
- `errors-in-console`: the local-only 404 for the shows function.

**Process note.** `nuxt build` shares `.nuxt/` with a running `nuxt dev`. Building while `netlify dev` was up produced a broken server bundle and briefly restarted the dev server. Later builds ran from an isolated copy, and Lighthouse was re-run on that clean build; the numbers above come from it. Don't run `nuxt build` in the repo while `npm run dev` is running.

**Still to verify on a deploy preview**
- Payload shows `siteUrl` set to the real primary domain.
- `/robots.txt` returns `Disallow: /` on the preview.
- The Facebook Sharing Debugger and the Rich Results Test (MusicGroup, VideoObject) both pass.
- VoiceOver on iOS: menu open and close, and the form error flow.
