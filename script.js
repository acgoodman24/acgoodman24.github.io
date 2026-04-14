// Smooth scroll (keeps your original behavior)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", e => {
    const href = anchor.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });

    // Optional: clean URL hash without jumping
    history.pushState(null, "", href);
  });
});

// Optional: keep the footer "Last updated" correct without editing HTML
(function () {
  const el = document.getElementById("lastUpdated");
  if (!el) return;
  // Use the file's date if you want manual control; otherwise comment this out.
  // el.textContent = new Date().toISOString().slice(0, 10);
})();