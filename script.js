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

// FX restricted to hero section
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const hero = document.getElementById("hero");
  if (!hero) return;

  const core = document.getElementById("fxCore");
  const r1 = document.getElementById("ring1");
  const r2 = document.getElementById("ring2");
  const r3 = document.getElementById("ring3");
  const t1 = document.getElementById("trail1");
  const t2 = document.getElementById("trail2");
  const t3 = document.getElementById("trail3");

  if (!core || !r1 || !r2 || !r3 || !t1 || !t2 || !t3) return;

  let tx = hero.clientWidth * 0.5;
  let ty = hero.clientHeight * 0.35;

  let coreX = tx, coreY = ty;
  let r1x = tx, r1y = ty;
  let r2x = tx, r2y = ty;
  let r3x = tx, r3y = ty;
  let t1x = tx, t1y = ty;
  let t2x = tx, t2y = ty;
  let t3x = tx, t3y = ty;

  let prevTx = tx;
  let prevTy = ty;
  let velocity = 0;

  const IDLE_DELAY = 180;
  const FADE_SPEED = 0.08;
  let lastMoveTime = 0;

  let targetAlpha = 0;
  let alpha = 0;

  const E_CORE = 0.30;
  const E_R1 = 0.16;
  const E_R2 = 0.11;
  const E_R3 = 0.08;
  const E_T1 = 0.13;
  const E_T2 = 0.09;
  const E_T3 = 0.06;

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    tx = e.clientX - rect.left;
    ty = e.clientY - rect.top;

    const dx = tx - prevTx;
    const dy = ty - prevTy;
    velocity = Math.min(42, Math.hypot(dx, dy));
    prevTx = tx;
    prevTy = ty;

    targetAlpha = 1;
    lastMoveTime = performance.now();
  });

  hero.addEventListener("mouseleave", () => {
    targetAlpha = 0;
  });

  function move(el, x, y, scale = 1) {
    el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
  }

  function setOpacity() {
    core.style.opacity = (alpha * 0.95).toFixed(3);
    r1.style.opacity = (alpha * 0.8).toFixed(3);
    r2.style.opacity = (alpha * 0.55).toFixed(3);
    r3.style.opacity = (alpha * 0.35).toFixed(3);
    t1.style.opacity = (alpha * 0.5).toFixed(3);
    t2.style.opacity = (alpha * 0.3).toFixed(3);
    t3.style.opacity = (alpha * 0.18).toFixed(3);
  }

  function animate(now) {
    if (targetAlpha === 1 && now - lastMoveTime > IDLE_DELAY) {
      targetAlpha = 0;
    }

    alpha += (targetAlpha - alpha) * FADE_SPEED;
    setOpacity();

    coreX += (tx - coreX) * E_CORE;
    coreY += (ty - coreY) * E_CORE;

    r1x += (tx - r1x) * E_R1;
    r1y += (ty - r1y) * E_R1;

    r2x += (tx - r2x) * E_R2;
    r2y += (ty - r2y) * E_R2;

    r3x += (tx - r3x) * E_R3;
    r3y += (ty - r3y) * E_R3;

    t1x += (tx - t1x) * E_T1;
    t1y += (ty - t1y) * E_T1;

    t2x += (tx - t2x) * E_T2;
    t2y += (ty - t2y) * E_T2;

    t3x += (tx - t3x) * E_T3;
    t3y += (ty - t3y) * E_T3;

    const s1 = 1 + Math.min(0.24, velocity / 120);
    const s2 = 1 + Math.min(0.18, velocity / 150);
    const s3 = 1 + Math.min(0.12, velocity / 170);

    move(core, coreX, coreY, 1);
    move(r1, r1x, r1y, s1);
    move(r2, r2x, r2y, s2);
    move(r3, r3x, r3y, s3);

    move(t1, t1x, t1y, 1);
    move(t2, t2x, t2y, 1);
    move(t3, t3x, t3y, 1);

    velocity *= 0.92;
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();