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

## Hosting (GitHub Pages, same pattern as the CDN)

Links are **relative**, so the site drops into either host with no code change. Pick one:

- **Option A — `cobblegobble.app` (root).** Cleanest branding; matches the CDN, which
  already lives at `cdn.cobblegobble.app`. You need the `.app` domain for the CDN
  regardless, so this reuses it. Canonical/OG URLs in the HTML already assume this.
- **Option B — `newworkbydesign.com/cobblegobble/` (subpath).** Matches the URLs the
  committed `fastlane/metadata/*` currently point at. If you choose this, update the
  `<link rel="canonical">` and `og:url`/`og:image` absolute URLs in each page's `<head>`
  (they're the only absolute internal URLs; everything else is relative).

Steps (mirrors `CDN/README.md`): put these files at the repo root of a **public** Pages
repo, keep the `.nojekyll`, add a `CNAME` with your chosen host, set the custom domain
in Settings ▸ Pages, enable **Enforce HTTPS**. `.app` is HSTS-preloaded — HTTPS is
forced automatically, which suits the privacy story.

### Point the store metadata at the live pages (before submitting)

`fastlane/metadata/{en-US,de-DE}/` currently hold `newworkbydesign.com` placeholders.
After the site is live, set:

- `privacy_url.txt` → `…/privacy.html` (a live privacy page is **required** to submit)
- `support_url.txt` → `…/support.html` (a reachable support URL is **required**)
- `marketing_url.txt` → `…/` (the landing page)

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
Swap the `<form action="…">` for your own privacy-respecting list:

- **Buttondown** (GDPR-friendly, no ad trackers) — replace the action with your embed URL.
- **Self-hosted Listmonk** — point the action at your instance.

Keep email capture on the **web only**, never in the app binary — collecting it in-app
would break the "Data Not Collected" label (GTM §8).

## Maintenance notes

- **“Last updated” date** on `privacy.html` (EN + DE) — set it on publish and whenever the policy changes.
- **Assets are regenerable** from the repo: city glyphs are extracted from
  `Previews/<city>.preview.html`; the gallery screenshots are downscaled from
  `Store/screenshots/raw/`; `og.png` is composed from the mascot + the site fonts. The
  mascot (`cobble.svg`) mirrors `App/Sources/MascotView.swift`.
- **Fonts** are Fraunces + Hanken Grotesk (both OFL, licenses in `assets/fonts/`).
