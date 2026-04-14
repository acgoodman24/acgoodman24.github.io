// Smooth scroll for internal links
const navLinks = document.getElementById("navLinks");
const hamburger = document.getElementById("hamburger");

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

// mobile nav toggle
if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", String(open));
  });
}

// top-right hero mouse tracker orb
(function () {
  const hero = document.getElementById("hero");
  const orb = document.getElementById("heroOrb");
  if (!hero || !orb) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  const easing = 0.12;

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();

    // only track in top-right region for subtlety
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    if (relX > 0.55 && relY < 0.65) {
      targetX = (e.clientX - rect.left);
      targetY = (e.clientY - rect.top);
      orb.style.opacity = "0.92";
    } else {
      orb.style.opacity = "0.55";
    }
  });

  hero.addEventListener("mouseleave", () => {
    // settle to default top-right resting spot
    targetX = hero.clientWidth * 0.78;
    targetY = hero.clientHeight * 0.22;
    orb.style.opacity = "0.6";
  });

  // initial position
  targetX = hero.clientWidth * 0.78;
  targetY = hero.clientHeight * 0.22;
  currentX = targetX;
  currentY = targetY;

  function animate() {
    currentX += (targetX - currentX) * easing;
    currentY += (targetY - currentY) * easing;
    orb.style.transform = `translate(${currentX - 90}px, ${currentY - 90}px)`;
    requestAnimationFrame(animate);
  }

  animate();
})();