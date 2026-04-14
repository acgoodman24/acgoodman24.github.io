// ── NAV SCROLL EFFECT ──
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    navbar.style.borderBottom = "1px solid rgba(255,255,255,0.08)";
  } else {
    navbar.style.borderBottom = "1px solid rgba(255,255,255,0.04)";
  }
});


// ── SCROLL REVEAL (ENGINEERING STYLE: SUBTLE) ──
const revealElements = document.querySelectorAll(
  ".section-inner, .project-card, .timeline-item"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.1 }
);

revealElements.forEach((el) => {
  el.style.opacity = 0;
  el.style.transform = "translateY(20px)";
  el.style.transition = "all 0.6s ease";
  observer.observe(el);
});


// ── HOVER MICRO-INTERACTION (PROJECT CARDS) ──
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.background = `
    radial-gradient(circle at ${x}px ${y}px, rgba(37,99,235,0.06), transparent 60%)
    `;
  });

  card.addEventListener("mouseleave", () => {
    card.style.background = "#ffffff";
  });
});