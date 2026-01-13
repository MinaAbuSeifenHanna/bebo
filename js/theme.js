// theme.js - Dark and Light mode toggle
let isDarkMode = localStorage.getItem('theme') === 'dark';

function toggleTheme() {
  isDarkMode = !isDarkMode;
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  applyTheme();
}

function applyTheme() {
  const body = document.body;
  if (isDarkMode) {
    body.classList.add('dark');
  } else {
    body.classList.remove('dark');
  }
}

// Apply on load
applyTheme();