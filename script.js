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

// Engineering HUD tracker
(function () {
  const hero = document.getElementById("hero");
  const hud = document.getElementById("heroHud");
  const ring = document.getElementById("hudRing");
  const cross = document.getElementById("hudCrosshair");
  const coords = document.getElementById("hudCoords");

  if (!hero || !hud || !ring || !cross || !coords) return;

  let tx = hud.clientWidth * 0.72;
  let ty = hud.clientHeight * 0.32;
  let x = tx, y = ty;

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  hero.addEventListener("mousemove", (e) => {
    const hudRect = hud.getBoundingClientRect();
    tx = clamp(e.clientX - hudRect.left, 18, hudRect.width - 18);
    ty = clamp(e.clientY - hudRect.top, 18, hudRect.height - 18);
  });

  hero.addEventListener("mouseleave", () => {
    tx = hud.clientWidth * 0.72;
    ty = hud.clientHeight * 0.32;
  });

  function render() {
    x += (tx - x) * 0.14;
    y += (ty - y) * 0.14;

    ring.style.transform = `translate(${x - 60}px, ${y - 60}px)`;
    cross.style.transform = `translate(${x - 41}px, ${y - 41}px)`;

    const nx = (x / hud.clientWidth).toFixed(3);
    const ny = (y / hud.clientHeight).toFixed(3);
    coords.textContent = `x: ${nx}   y: ${ny}`;

    requestAnimationFrame(render);
  }

  render();
})();