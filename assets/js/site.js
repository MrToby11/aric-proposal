/* ==========================================================================
   ARIC proposal site — progressive enhancement only.
   Every page must remain fully readable with this file blocked or failing.
   ========================================================================== */

(function () {
  "use strict";

  // Swap the no-js flag as early as possible so .reveal can start hidden.
  document.documentElement.classList.remove("no-js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Sticky nav: hairline + shadow once the page has scrolled ---------- */
  function initNavState() {
    var nav = document.querySelector(".site-nav");
    if (!nav) return;

    var ticking = false;

    function update() {
      nav.dataset.scrolled = window.scrollY > 8 ? "true" : "false";
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    update();
  }

  /* --- The site's single motion primitive: fade-and-rise on entry -------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    // No IntersectionObserver, or motion is unwelcome: show everything now.
    if (reduceMotion || !("IntersectionObserver" in window)) {
      for (var i = 0; i < items.length; i++) items[i].classList.add("is-visible");
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.08
    });

    items.forEach(function (el) { observer.observe(el); });
  }

  function init() {
    initNavState();
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
