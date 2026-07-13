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
})();
