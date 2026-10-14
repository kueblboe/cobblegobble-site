/* Cobble Gobble site — tiny progressive enhancement.
   No analytics, no third-party calls, no cookies. Everything here is optional:
   the site is fully usable, readable, and navigable with JavaScript disabled. */
(function () {
  var root = document.documentElement;
  root.classList.add("js");

  /* Theme toggle — remembers the choice in localStorage (first-party, not tracking).
     The initial theme is applied by a tiny inline script in <head> to avoid a flash. */
  var btn = document.querySelector(".theme-btn");
  function label() {
    var dark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (btn) {
      btn.textContent = dark ? "☀︎" : "☽︎"; /* sun / moon */
      btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    }
  }
  if (btn) {
    label();
    btn.addEventListener("click", function () {
      var dark = root.dataset.theme
        ? root.dataset.theme === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
      var next = dark ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("cg-theme", next); } catch (e) {}
      label();
    });
  }

  /* Scroll reveal — skipped entirely when the user asks for reduced motion. */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var items = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* Language toggle — remember the explicit choice (first-party, not tracking).
     The link still navigates on its own (no preventDefault), so switching works
     with JS disabled; this only records the pick so the auto-detect redirect on
     English pages won't override it on a later visit. */
  document.querySelectorAll(".lang-toggle a[hreflang]").forEach(function (a) {
    a.addEventListener("click", function () {
      try { localStorage.setItem("cg-lang", a.getAttribute("hreflang")); } catch (e) {}
    });
  });

  /* Campaign attribution — turn ?ct=<campaign> into an App Store campaign link.

     A printed partner card's QR points at /go/<city>-<placement>.html, which forwards
     here carrying the placement's campaign token. Rewriting the App Store links is what
     makes the scan countable in App Store Connect, and it is the ONLY thing that does:
     Apple counts a campaign from the pt/ct pair on the outgoing link, nothing else.

     Still no analytics and no third party: nothing is sent anywhere, nothing is stored,
     and the only change is the query string on a link the visitor may or may not tap.
     The token is matched against a strict pattern before it is used, so a crafted URL
     cannot inject anything into the href.

     Some campaigns land on a custom product page instead of the default one: the page
     whose screenshots match what sent them (Store/product-pages.md section 3). The page
     ids are App Store Connect's, approved 2026-10-14. A campaign not listed here keeps the
     default page, which is where the PPO test runs. */
  var PRODUCT_PAGES = {
    cozy: "18d61e34-f3fe-484c-b69c-0b1a4c9f673b",
    travel: "6868e612-3b34-4508-80d9-0f7e3632e033",
    accessibility: "5d06a057-676e-40eb-b080-571c1e9935f8"
  };
  var PAGE_FOR_CAMPAIGN = {
    "social-instagram": "cozy", "social-pinterest": "cozy", "social-youtube": "cozy",
    "partner-touristinfo": "travel", "partner-airbnb": "travel",
    "partner-hotel": "travel", "partner-venue": "travel", "creators": "travel",
    "press-accessibility": "accessibility"
  };
  try {
    var ct = new URLSearchParams(location.search).get("ct");
    if (ct && /^[a-z0-9-]{1,30}$/.test(ct)) {
      var ppid = PRODUCT_PAGES[PAGE_FOR_CAMPAIGN[ct]];
      var campaignURL = "https://apps.apple.com/app/apple-store/id6788793161?" +
        (ppid ? "ppid=" + ppid + "&" : "") + "pt=129141164&ct=" + ct + "&mt=8";
      document.querySelectorAll('a[href*="id6788793161"]').forEach(function (a) {
        a.href = campaignURL;
      });
    }
  } catch (e) {}
})();
