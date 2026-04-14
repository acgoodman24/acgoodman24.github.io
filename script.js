/* ─────────────────────────────────────────────
   ASHER GOODMAN — PORTFOLIO SCRIPTS
   ───────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  // ── Detect which page ──
  const isSlideshow = document.body.classList.contains('slideshow-page');

  if (!isSlideshow) {
    initMainPage();
  } else {
    initSlideshow();
  }

});

/* ─────────────────────────────────────────────
   MAIN PAGE (index.html)
   ───────────────────────────────────────────── */
function initMainPage() {

  // ── Navbar scroll shadow ──
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  // ── Hamburger menu ──
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      // Animate spans
      const spans = hamburger.querySelectorAll('span');
      if (open) {
        spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  // ── Scroll fade-in ──
  // Add .fade-up to elements you want to animate
  const targets = document.querySelectorAll(
    '.timeline-item, .project-card, .about-grid, .contact-grid, .hero-grid > *'
  );
  targets.forEach((el, i) => {
    el.classList.add('fade-up');
    el.style.transitionDelay = `${i * 0.06}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  targets.forEach(el => observer.observe(el));

  // ── Active nav link highlight ──
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--text)' : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObserver.observe(s));
}

/* ─────────────────────────────────────────────
   SLIDESHOW (slideshow.html)
   ───────────────────────────────────────────── */
function initSlideshow() {

  const slides       = Array.from(document.querySelectorAll('.slide'));
  const dots         = Array.from(document.querySelectorAll('.dot'));
  const counter      = document.getElementById('slide-counter');
  const progressFill = document.getElementById('progress-fill');
  const prevBtn      = document.getElementById('prev-btn');
  const nextBtn      = document.getElementById('next-btn');

  let current = 0;
  const total = slides.length;

  // Check for hash target on load
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const target = document.getElementById(hash);
    if (target) {
      const slide = target.closest('.slide');
      if (slide) {
        const idx = slides.indexOf(slide);
        if (idx !== -1) current = idx;
      }
    }
  }

  function goTo(index) {
    if (index < 0 || index >= total) return;

    // Mark leaving
    slides[current].classList.add('leaving');
    slides[current].classList.remove('active');

    setTimeout(() => {
      slides[current < index ? current : index + (current - index)].classList.remove('leaving');
    }, 520);

    current = index;
    slides[current].classList.remove('leaving');
    slides[current].classList.add('active');

    // Update counter
    const pad = n => String(n).padStart(2, '0');
    if (counter) counter.textContent = `${pad(current + 1)} / ${pad(total)}`;

    // Update progress bar
    if (progressFill) {
      progressFill.style.width = `${((current + 1) / total) * 100}%`;
    }

    // Update dots
    dots.forEach((d, i) => d.classList.toggle('active', i === current));

    // Update buttons
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === total - 1;
  }

  // Init
  goTo(current);

  // Button listeners
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));

  // Dot listeners
  dots.forEach(dot => {
    dot.addEventListener('click', () => goTo(parseInt(dot.dataset.slide)));
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  goTo(current + 1);
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')    goTo(current - 1);
  });

  // Touch / swipe support
  let touchStartX = 0;
  let touchStartY = 0;
  document.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? goTo(current + 1) : goTo(current - 1);
    }
  }, { passive: true });
}