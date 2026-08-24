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
| `city/<id>.html` | **Generated.** One page per authored city: landmarks, name origin, why here, why then, who ruled, the emblem, three facts, street words, the level's own measurements |

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

## No email capture (removed 2026-08-24)

The site had a CleverReach signup form in `index.html#updates` for the pre-launch launch
mail. The app is out, so the form, its section, its stylesheet rules and the privacy
page's newsletter clause are gone; `#updates` is now `#get`, an App Store panel. The site
collects **nothing** — no forms, no third-party endpoints, not even on submit.

App Store link: `https://apps.apple.com/app/id6788793161` (storefront-neutral, used on the
EN pages), `https://apps.apple.com/de/app/cobble-gobble/id6788793161` on the DE pages.
Both resolve to the same app id — change them together.

If a list is ever wanted again, keep email capture on the **web only**, never in the app
binary: collecting it in-app would break the "Data Not Collected" label (GTM §8).

## Maintenance notes

- **“Last updated” date** on `privacy.html` **and** `de/privacy.html` — set both on publish and whenever the policy changes.
- **The city grid is GENERATED — never hand-edit it.** `make site-cities`
  re-derives the grid on `index.html` and every `assets/img/glyph-<city>.svg`
  from `App/Content/catalog.json` — the same file the app reads, through the same
  function (`CatalogListing.isListed`), so the page can never advertise a city the
  store does not sell. Edit inside the `<!-- cg:cities-grid -->` region and
  `make test` goes red (`SiteCitiesTests`), naming the file and the line.

- **No counts, and no "Coming soon" (both removed 2026-08-01).** A total is stale
  the week after it is written, and a grid of cities nobody can buy grows with
  every seeded config. The page says new cities arrive every week, shows the ones
  that exist, and lets the request card carry the rest. Don't reintroduce either:
  a test refuses any page containing "coming soon" / "demnächst".

  This exists because all six spots drifted at once: on 2026-08-01 the site still
  said "ten Old Towns … thirty more" while the app shipped 27, Heidelberg had
  never been listed, and `glyph-florence.svg` was still the CC BY-SA trace the app
  had already replaced with a redrawn giglio for licence reasons. The site keeping
  its own copy of the artwork was the bug.

  A NEW city needs one hand edit **when it publishes**: its region line and its
  place in the tour, in `SiteCities.roster`
  (`Packages/CobbleCore/Sources/forge/SiteCities.swift`). Forget it and the
  generator refuses by name rather than quietly dropping the city. Cities that are
  seeded, packed-but-unpublished, or `testflight` are never listed, and their
  glyphs are deleted from `assets/img/` rather than left as unreferenced images.
- **The per-city pages are GENERATED WHOLE — there is nothing in them to hand-edit.**
  `make site-cities` writes `site/city/<id>.html` and `site/de/city/<id>.html` from the
  city's `cityPage` block in `App/Content/configs/<city>.city.json` plus data the repo
  already holds (pack stats, fruit tiers, the emblem, the roster). Unlike the city grid
  these carry no `cg:` markers, because every byte is derived; `SiteCitiesTests` compares
  the committed files against a fresh render and names the first line that moved.

  **Fully authored or nothing.** A city with no complete `cityPage` simply has no page and
  is not linked, which is the normal state for every published city until its block is
  written. A page whose city loses its block, or stops being listed, is DELETED by
  `make site-cities` rather than left as a live URL, the same way an unclaimed glyph is.

  `sitemap.xml` carries them inside `<!-- cg:city-pages -->`, derived from the pages just
  written, so it can never advertise one that does not exist.

  Cobble narrates these pages (`Plan/VOICE_Cobble.md` §4) — they are the one part of the
  site that is not Manuel's voice. Privacy, accessibility, support and the Impressum stay
  his, and a city page only ever links to them.

- **Other assets are regenerable** from the repo: the gallery screenshots are
  downscaled from `Store/screenshots/raw/` (`Store/derive_assets.py`); `og.png` is
  composed from the mascot + the site fonts. The mascot (`cobble.svg`) mirrors
  `App/Sources/MascotView.swift`.
- **Fonts** are Fraunces + Hanken Grotesk (both OFL, licenses in `assets/fonts/`).
