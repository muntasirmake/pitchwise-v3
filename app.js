/* ============================================================
   PitchWise — interactions
   Subtle, premium motion only. No heavy animation.
   ============================================================ */
(function () {
  "use strict";

  /* ---- Sticky nav hairline on scroll ---- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 8) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Scroll reveal ---- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- FAQ accordion ---- */
  var items = document.querySelectorAll(".faq-item");
  items.forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      items.forEach(function (other) {
        other.classList.remove("open");
        other.querySelector(".faq-a").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---- Audit score count-up (fires when in view) ---- */
  var scoreEl = document.getElementById("scoreNum");
  if (scoreEl) {
    var target = 41; // illustrative "before" score — a deck needing work
    var played = false;
    function countUp() {
      if (played) return;
      played = true;
      var start = null;
      var dur = 1100;
      function frame(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = Math.round(eased * target);
        scoreEl.innerHTML = val + '<span class="d">/100</span>';
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
    if ("IntersectionObserver" in window) {
      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { countUp(); sio.disconnect(); } });
      }, { threshold: 0.5 });
      sio.observe(scoreEl);
    } else {
      countUp();
    }
  }
  /* ---- Hero carousel ---- */
  (function () {
    var carousel = document.querySelector(".hero-carousel");
    if (!carousel) return;
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".cslide"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll(".cdot"));
    if (slides.length < 2) return;

    var index = 0;
    var timer = null;
    var INTERVAL = 4500;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle("is-active", i === index); });
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === index); });
    }
    function advance() { show(index + 1); }
    function start() {
      stop();
      timer = setInterval(advance, INTERVAL);
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    dots.forEach(function (d, i) {
      d.addEventListener("click", function () { show(i); start(); });
    });

    /* Pause on hover/focus, and when the tab is hidden */
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("focusin", stop);
    carousel.addEventListener("focusout", start);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });

    start();
  })();
})();
