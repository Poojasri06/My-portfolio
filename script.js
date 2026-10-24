/* Shared behaviour: mobile nav, scroll reveal, parallax, wanted-poster Easter egg.
   Every block is null-safe so each page loads only what it contains. */
/* ---------- mobile navigation ---------- */
(function () {
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("primaryNav");
  if (!toggle || !nav) return;

  function setOpen(open) {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  toggle.addEventListener("click", function () {
    setOpen(!nav.classList.contains("open"));
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () { setOpen(false); });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      setOpen(false);
      toggle.focus();
    }
  });
})();

/* ---------- scroll reveal ---------- */
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
(function () {
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { observer.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add("in"); });
  }
})();

/* ---------- hero illustration: gentle mouse parallax ---------- */
(function () {
  if (reduceMotion) return;
  var core = document.querySelector(".core-node");
  if (!core) return;
  document.addEventListener("mousemove", function (e) {
    var x = (e.clientX / window.innerWidth - 0.5) * 10;
    var y = (e.clientY / window.innerHeight - 0.5) * 10;
    core.style.transform = "translate(" + x + "px," + y + "px)";
  });
})();

/* ---------- wanted poster easter egg ---------- */
(function () {
  var trigger = document.getElementById("posterTrigger");
  var overlay = document.getElementById("posterOverlay");
  var closeBtn = document.getElementById("posterClose");
  if (!trigger || !overlay || !closeBtn) return;

  function openPoster() {
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closePoster() {
    if (overlay.hidden) return;
    overlay.hidden = true;
    document.body.style.overflow = "";
    trigger.focus();
  }

  trigger.addEventListener("click", function (e) {
    e.preventDefault();
    openPoster();
  });

  closeBtn.addEventListener("click", closePoster);

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closePoster();
  });

  document.addEventListener("keydown", function (e) {
    if (overlay.hidden) return;
    if (e.key === "Escape") closePoster();
    /* keep keyboard focus inside the dialog */
    if (e.key === "Tab") {
      e.preventDefault();
      closeBtn.focus();
    }
  });
})();
