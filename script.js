(function () {
  const root = document.documentElement;
  const btn = document.getElementById("themeToggle");
  const key = "theme";

  function setTheme(theme) {
    if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
    localStorage.setItem(key, theme);
  }

  // Initial theme: saved preference > system preference
  const saved = localStorage.getItem(key);
  if (saved) {
    setTheme(saved);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    setTheme("light");
  } else {
    setTheme("dark");
  }

  btn?.addEventListener("click", () => {
    const isLight = root.getAttribute("data-theme") === "light";
    setTheme(isLight ? "dark" : "light");
  });
})();