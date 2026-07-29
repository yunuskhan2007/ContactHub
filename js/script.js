/* =========================================================
   ContactHub — Vanilla JS
   Sticky navbar state, mobile menu, scroll reveal,
   animated counters, and button ripple effect.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScrollState();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initRipple();
  initFooterYear();
});

/**
 * Adds a background/shadow to the navbar once the page has scrolled
 * past a small threshold, so it reads as "glass" only when needed.
 */
function initNavbarScrollState() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const SCROLL_THRESHOLD = 12;

  const updateState = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  };

  updateState();
  window.addEventListener('scroll', updateState, { passive: true });
}

/**
 * Toggles the mobile hamburger menu open/closed, and closes it
 * automatically whenever a nav link is chosen.
 */
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  const closeMenu = () => {
    toggle.classList.remove('is-open');
    links.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

/**
 * Fades and slides elements marked with `.reveal` into place
 * once they enter the viewport, using IntersectionObserver.
 */
function initScrollReveal() {
  const revealItems = document.querySelectorAll('.reveal');
  if (!revealItems.length) return;

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealItems.forEach((item) => observer.observe(item));
}

/**
 * Animates the statistic counters from 0 up to their data-target
 * value once the statistics section scrolls into view. Counters
 * with a data-static value (e.g. "24/7") are left untouched.
 */
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const COUNT_DURATION_MS = 1400;

  const animateCounter = (el) => {
    if (el.dataset.static) {
      el.textContent = el.dataset.static;
      return;
    }

    const target = parseInt(el.dataset.target, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / COUNT_DURATION_MS, 1);
      // Ease-out for a natural deceleration near the end
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = `${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  if (!('IntersectionObserver' in window)) {
    statNumbers.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  statNumbers.forEach((el) => observer.observe(el));
}

/**
 * Creates a short-lived ripple circle at the click position for
 * any element carrying the `.ripple` class.
 */
function initRipple() {
  const rippleButtons = document.querySelectorAll('.ripple');

  rippleButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      const circle = document.createElement('span');
      circle.className = 'ripple-circle';
      circle.style.width = circle.style.height = `${size}px`;
      circle.style.left = `${event.clientX - rect.left - size / 2}px`;
      circle.style.top = `${event.clientY - rect.top - size / 2}px`;

      button.appendChild(circle);

      circle.addEventListener('animationend', () => circle.remove());
    });
  });
}

/** Fills in the current year in the footer copyright line. */
function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
