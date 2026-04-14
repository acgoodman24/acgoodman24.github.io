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

// Top-portion cursor FX with lag/trailing motion
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const core = document.getElementById("fxCore");
  const ring = document.getElementById("fxRing");
  const spark = document.getElementById("fxSpark");
  const t1 = document.getElementById("trail1");
  const t2 = document.getElementById("trail2");
  const t3 = document.getElementById("trail3");

  if (!core || !ring || !spark || !t1 || !t2 || !t3) return;

  let tx = window.innerWidth * 0.5;
  let ty = 120;

  let coreX = tx, coreY = ty;
  let ringX = tx, ringY = ty;
  let sparkX = tx, sparkY = ty;
  let t1X = tx, t1Y = ty;
  let t2X = tx, t2Y = ty;
  let t3X = tx, t3Y = ty;

  let prevTx = tx;
  let prevTy = ty;
  let velocity = 0;

  const TOP_TRACK_HEIGHT = 340;
  const ACTIVE_FADE_DELAY = 850;
  let lastMoveTime = 0;
  let active = false;

  // Different easing = drag/lag feel
  const EASE_CORE = 0.28;
  const EASE_RING = 0.16;
  const EASE_SPARK = 0.22;
  const EASE_T1 = 0.14;
  const EASE_T2 = 0.09;
  const EASE_T3 = 0.06;

  function setOpacity(v){
    const o = String(v);
    core.style.opacity = o;
    ring.style.opacity = String(v * 0.88);
    spark.style.opacity = String(v * 0.95);
    t1.style.opacity = String(v * 0.55);
    t2.style.opacity = String(v * 0.35);
    t3.style.opacity = String(v * 0.22);
  }

  setOpacity(0);

  window.addEventListener("mousemove", (e) => {
    if (e.clientY <= TOP_TRACK_HEIGHT) {
      tx = e.clientX;
      ty = e.clientY;

      const dx = tx - prevTx;
      const dy = ty - prevTy;
      velocity = Math.min(40, Math.hypot(dx, dy));

      prevTx = tx;
      prevTy = ty;

      active = true;
      lastMoveTime = performance.now();
      setOpacity(1);
    }
  });

  function move(el, x, y){
    el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
  }

  function animate(now){
    // fade out when idle
    if (active && now - lastMoveTime > ACTIVE_FADE_DELAY){
      active = false;
      setOpacity(0);
    }

    // spring follow with different lag layers
    coreX += (tx - coreX) * EASE_CORE;
    coreY += (ty - coreY) * EASE_CORE;

    ringX += (tx - ringX) * EASE_RING;
    ringY += (ty - ringY) * EASE_RING;

    sparkX += (tx - sparkX) * EASE_SPARK;
    sparkY += (ty - sparkY) * EASE_SPARK;

    t1X += (tx - t1X) * EASE_T1;
    t1Y += (ty - t1Y) * EASE_T1;

    t2X += (tx - t2X) * EASE_T2;
    t2Y += (ty - t2Y) * EASE_T2;

    t3X += (tx - t3X) * EASE_T3;
    t3Y += (ty - t3Y) * EASE_T3;

    // ring grows slightly with speed for "exciting but subtle" response
    const ringScale = 1 + Math.min(0.35, velocity / 120);
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale})`;

    // spark leads just a touch in movement direction
    const leadX = (tx - coreX) * 0.18;
    const leadY = (ty - coreY) * 0.18;
    move(spark, sparkX + leadX, sparkY + leadY);

    move(core, coreX, coreY);
    move(t1, t1X, t1Y);
    move(t2, t2X, t2Y);
    move(t3, t3X, t3Y);

    // damp velocity over time
    velocity *= 0.92;

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();