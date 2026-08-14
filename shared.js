/* ==========================================================
   SHARED.JS
   Loaded on every page (main portfolio + case studies).
   Defensive: every block checks the element exists first,
   so this file works on pages with a smaller DOM (like the
   case study pages, which don't have every section).
========================================================== */
(function () {
  "use strict";

  const CONFIG = {};
  window.SITE_CONFIG = CONFIG;

  /* ---------------- Loader ---------------- */
  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) setTimeout(() => loader.classList.add("hide"), 350);
  });

  /* ---------------- Year ---------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Theme toggle ---------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  let currentTheme = "light";
  try {
    const saved = localStorage.getItem("angela-theme");
    currentTheme = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  } catch (e) {}
  root.setAttribute("data-theme", currentTheme);
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      currentTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", currentTheme);
      try { localStorage.setItem("angela-theme", currentTheme); } catch (e) {}
    });
  }

  /* ---------------- Mobile nav ---------------- */
  const burger = document.getElementById("burger");
  const navLinks = document.getElementById("nav-links");
  if (burger && navLinks) {
    burger.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open);
    });
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        burger.classList.remove("open");
      })
    );
  }

  /* ---------------- Sticky header + scroll progress + FAB ---------------- */
  const header = document.getElementById("site-header");
  const progressBar = document.getElementById("scroll-progress");
  const fabTop = document.getElementById("fab-top");
  window.addEventListener(
    "scroll",
    () => {
      const scrolled = window.scrollY;
      if (header) header.classList.toggle("scrolled", scrolled > 10);
      if (fabTop) fabTop.classList.toggle("show", scrolled > 500);
      if (progressBar) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = docHeight > 0 ? (scrolled / docHeight) * 100 + "%" : "0%";
      }
    },
    { passive: true }
  );
  if (fabTop) fabTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------------- Active nav link on scroll (only meaningful on pages with matching section ids) ---------------- */
  const navA = document.querySelectorAll(".nav-links a");
  const idSections = document.querySelectorAll("section[id]");
  if (navA.length && idSections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navA.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    idSections.forEach((s) => navObserver.observe(s));
  }

  /* ---------------- Custom cursor ---------------- */
  const cursorDot = document.getElementById("cursor-dot");
  const cursorRing = document.getElementById("cursor-ring");
  if (cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + "px";
      cursorDot.style.top = mouseY + "px";
    });
    (function loopCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = ringX + "px";
      cursorRing.style.top = ringY + "px";
      requestAnimationFrame(loopCursor);
    })();
    document.querySelectorAll("a, button, .project-card, .fact-card, .gallery-item").forEach((el) => {
      el.addEventListener("mouseenter", () => cursorRing.classList.add("active"));
      el.addEventListener("mouseleave", () => cursorRing.classList.remove("active"));
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------------- Animated skill bars (main page) ---------------- */
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.level + "%";
          barObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  document.querySelectorAll(".bar-fill").forEach((el) => barObserver.observe(el));

  /* ---------------- Animated counters (main page) ---------------- */
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1400;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(eased * target);
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = target + "+";
        }
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll(".stat h3[data-count]").forEach((el) => counterObserver.observe(el));
})();
