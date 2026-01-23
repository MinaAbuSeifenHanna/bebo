// js/theme.js - Global Theme Management (Light/Dark Mode)

(function () {
  const THEME_KEY = 'women_world_theme';
  const body = document.body;

  // 1. Initial Apply (Run immediately to prevent flash)
  function applySavedTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);

    // Respect system preference if no user preference
    if (!savedTheme) {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.classList.add('dark-mode');
      }
      return;
    }

    if (savedTheme === 'dark') {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }

    updateToggleIcons();
  }

  // 2. Toggle Function
  window.toggleTheme = function () {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    updateToggleIcons();
  };

  // 3. UI Synchronization
  function updateToggleIcons() {
    const icons = document.querySelectorAll('.theme-toggle-icon');
    const isDark = body.classList.contains('dark-mode');

    icons.forEach(icon => {
      if (isDark) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
    });
  }

  // Run on load
  document.addEventListener('DOMContentLoaded', applySavedTheme);

  // Also run immediately if script is placed after opening <body>
  applySavedTheme();

})();