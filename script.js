const navLinks = document.getElementById("navLinks");
const hamburger = document.getElementById("hamburger");

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });

    if (navLinks) navLinks.classList.remove("open");
    if (hamburger) hamburger.setAttribute("aria-expanded", "false");
  });
});

// Mobile nav toggle
if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", String(open));
  });
}

// Subtle top-area cursor glow (invisible until movement)
(function () {
  const glow = document.getElementById("cursorGlow");
  if (!glow) return;

  let tx = window.innerWidth * 0.75;
  let ty = 120;
  let x = tx;
  let y = ty;
  let active = false;
  let lastMoveAt = 0;

  const TOP_TRACK_HEIGHT = 320; // only tracks near top portion of site
  const EASE = 0.14;
  const IDLE_FADE_MS = 900;

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  window.addEventListener("mousemove", (e) => {
    if (e.clientY <= TOP_TRACK_HEIGHT) {
      tx = e.clientX;
      ty = e.clientY;
      active = true;
      lastMoveAt = performance.now();
      glow.style.opacity = "1";
    }
  });

  function animate(now) {
    x += (tx - x) * EASE;
    y += (ty - y) * EASE;

    // keep effect away from most text-heavy center by biasing to upper-right
    const biasX = window.innerWidth * 0.12;
    const clampedX = clamp(x + biasX, 0, window.innerWidth);
    const clampedY = clamp(y, 0, TOP_TRACK_HEIGHT + 40);

    glow.style.left = `${clampedX}px`;
    glow.style.top = `${clampedY}px`;

    if (active && now - lastMoveAt > IDLE_FADE_MS) {
      active = false;
      glow.style.opacity = "0";
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();