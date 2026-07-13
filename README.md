# Cobble Gobble — website

The marketing / press / support / privacy site. Plain static HTML + one CSS file +
one tiny JS file. No build step, no framework, no backend.

It also **is the nomination's hosted material**: three of the five Featuring-Nomination
Supplemental URLs live here (see the mapping below), plus the two pages App Store
submission *requires* (privacy + support).

## The one invariant: zero third-party requests on page load

The whole brand is **Data Not Collected**. The site has to prove it. On load, every
byte is same-origin: self-hosted fonts (`assets/fonts/`, OFL), inline SVG, local
images, one first-party CSS and one first-party JS. **No** Google Fonts, analytics,
tag managers, embedded video, or CDN scripts. The privacy/accessibility press that
lands here (Heise/Mac&i, AppleVis, Steven Aquino) will view-source — keep it clean.

The **only** outbound call is the newsletter form, and only when a visitor submits it
(see below). Before adding anything to this site, ask: does it phone a third party on
load? If yes, don't.

## Local preview

```sh
cd site && python3 -m http.server 8000   # then open http://localhost:8000
```

There is a `.claude/launch.json` entry (`cobblegobble-site`) so `preview_start` serves
it too.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Landing / pitch — the painted-map hero, how it plays, the two wedges, the five cities, newsletter |
| `accessibility.html` | The accessibility story (from `Store/accessibility-story.md`) |
| `privacy.html` | Privacy policy, EN + DE (from `Store/web-privacy.md`) — **mandatory** to submit |
| `support.html` | Help & support, EN + DE (from `Store/web-support.md`) — **mandatory** to submit |
| `press.html` | Press kit: fact sheet, boilerplate, taglines, brand-asset downloads |

All copy is the **code-backed** copy from `Store/*.md` (internal audit 2026-07-12). If a
claim changes in the app, change it in `Store/*.md` **and** here.

## Localization — English + German

Every page above exists in both languages. English lives at the site root; German mirrors
it under **`/de/`** with the same filenames (`/de/`, `/de/accessibility.html`,
`/de/press.html`, `/de/privacy.html`, `/de/support.html`, `/de/impressum.html`). Assets are
shared at `/assets/`; every page references them **root-absolute** (`/assets/…`), so the
`/de/` pages reuse the same CSS/JS/images.

- **Switching:** a persistent `EN · DE` pill in the header links each page to its own
  counterpart. It's a plain `<a href>`, so it works with JavaScript off.
- **Auto-detect:** English pages carry a tiny inline `<head>` script (same `localStorage`
  pattern as the theme toggle). On a first visit with no saved choice, a German-preferring
  browser is redirected once to the `/de/` counterpart. German pages carry **no** redirect
  (they're the destination — no loop). Clicking the toggle records the choice in
  `localStorage['cg-lang']`, which then suppresses auto-detect. With JS off, everyone lands
  on English and uses the visible toggle.
- **SEO:** each page sets `<html lang>`, a self-`canonical`, and `hreflang` alternates
  (`en`, `de`, `x-default`=EN). `sitemap.xml` lists all EN + DE URLs with `xhtml:link`
  hreflang pairs.
- **The Impressum** is German by law; both `/impressum.html` and `/de/impressum.html` keep
  the German legal body — only the surrounding chrome/heading differs.
- **Keep the two languages in sync:** a claim that changes on an English page changes on its
  `/de/` mirror too (and in `Store/*.md`). German voice is anchored to
  `fastlane/metadata/de-DE/*`.
- **Deploy:** `make publish-site` needs no change — `rsync -a` mirrors the `/de/` subtree.

## Hosting — live

Deployed 2026-07-13 at **https://cobblegobble.app** via GitHub Pages, from the
public repo **github.com/kueblboe/cobblegobble-site** (root = these files, mirrored
from `site/`). DNS is A/AAAA on the apex to GitHub's Pages IPs, `www` CNAMEs to
`kueblboe.github.io` and 301s to the apex, HTTPS is enforced (cert auto-issued by
GitHub). Canonical/OG URLs in the HTML already assumed this host, so nothing there
needed changing.

**To redeploy after editing:** `make publish-site` (mirrors the CDN's
`publish-cdn` pattern). It rsyncs `site/` into a local clone of the
`cobblegobble-site` Pages repo and pushes if anything changed:

```sh
git clone git@github.com:kueblboe/cobblegobble-site.git ../cobblegobble-site   # one-time
make publish-site                                                              # every redeploy
```

`SITE_REPO` defaults to `../cobblegobble-site` (sibling of this project's root,
same convention as `CDN_REPO`); override it if your clone lives elsewhere:
`make publish-site SITE_REPO=/path/to/clone`. `site/CNAME` is the source of
truth for the custom domain and round-trips with everything else — don't edit
it only on GitHub (the Pages UI can rewrite it while you're configuring the
domain; `publish-site` will just push it back to whatever's in `site/CNAME`
next time you run it, so keep the two in sync if you ever change domains).

`fastlane/metadata/{en-US,de-DE}/{privacy_url,support_url,marketing_url}.txt` all
point at the live pages (`.../privacy.html`, `.../support.html`, `.../`).

## Featuring Nomination — Supplemental Materials mapping

`Store/featuring-nomination.md` field 8 wants up to five URLs. This site provides three:

| Slot | URL |
|---|---|
| Accessibility story | `…/accessibility.html` |
| Press / landing page | `…/` (or `…/press.html`) |
| Privacy page | `…/privacy.html` |

The other two — the **public TestFlight link** and the **heads-up demo clip** (unlisted
video, shot during the Passau field test per `Store/preview-clip-shotlist.md`) — are
yours to add; they can't live in a static repo.

## Wiring the newsletter (do before launch)

The form in `index.html` (`#updates`) posts to a **placeholder** provider endpoint. It
loads no third-party script — the provider is contacted only when a visitor submits.
Swap the `<form action="…">` for your own privacy-respecting list.

**Provider: CleverReach "Lite"** (chosen 2026-07-13) — German data residency (DE/EU
servers, ISO 27001), GDPR-native, double opt-in on by default, free forever to 250
recipients / 1,000 emails per month. Steps:

1. Create the CleverReach account and a signup form for the list.
2. **Turn tracking off.** Not a form setting — enable the account-wide privacy /
   anonymised-tracking mode (Account ▸ Datenschutz), so CleverReach never records who
   opened or clicked. Belt-and-suspenders: each newsletter's Editor ▸ Campaign Settings ▸
   Advanced also has open/click checkboxes — leave them off. The site copy promises "no
   tracking"; a tracking pixel would contradict the privacy page.
3. Keep **double opt-in** (the GDPR-correct default; it's the Opt-in-E-Mail step in the flow).
4. Copy the form's embed HTML; point the `<form action="…">` and hidden field names at it.
   (Done — wired to list a2c5e5fd, keeping the site's own styling, not CleverReach's markup.)

Graduation path if the list ever outgrows Lite or you want full ownership:
**self-hosted Keila** or **Keila Cloud** (German open-source, EU-resident).

Keep email capture on the **web only**, never in the app binary — collecting it in-app
would break the "Data Not Collected" label (GTM §8).

## Maintenance notes

- **“Last updated” date** on `privacy.html` **and** `de/privacy.html` — set both on publish and whenever the policy changes.
- **Assets are regenerable** from the repo: city glyphs are extracted from
  `Previews/<city>.preview.html`; the gallery screenshots are downscaled from
  `Store/screenshots/raw/`; `og.png` is composed from the mascot + the site fonts. The
  mascot (`cobble.svg`) mirrors `App/Sources/MascotView.swift`.
- **Fonts** are Fraunces + Hanken Grotesk (both OFL, licenses in `assets/fonts/`).
