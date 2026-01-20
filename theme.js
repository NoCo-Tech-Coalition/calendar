/**
 * Theme switcher that respects system preferences and user choice
 */

(function() {
  'use strict';

  const THEME_KEY = 'theme-preference';
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const html = document.documentElement;

  /**
   * Get the current theme preference
   * Priority: 1. localStorage, 2. system preference, 3. default (light)
   */
  function getThemePreference() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) {
      return stored;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  /**
   * Apply the theme to the document
   */
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);

    // Update icon
    if (theme === 'dark') {
      themeIcon.textContent = '🌙';
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      themeIcon.textContent = '☀️';
      themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  /**
   * Toggle between light and dark themes
   */
  function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    applyTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
  }

  /**
   * Initialize theme on page load
   */
  function initTheme() {
    const theme = getThemePreference();
    applyTheme(theme);
  }

  /**
   * Listen for system theme changes
   */
  function watchSystemTheme() {
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

      // Use the modern addEventListener if available
      if (darkModeQuery.addEventListener) {
        darkModeQuery.addEventListener('change', (e) => {
          // Only update if user hasn't set a preference
          if (!localStorage.getItem(THEME_KEY)) {
            applyTheme(e.matches ? 'dark' : 'light');
          }
        });
      }
    }
  }

  // Initialize theme immediately to prevent flash
  initTheme();

  // Set up event listeners when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      themeToggle.addEventListener('click', toggleTheme);
      watchSystemTheme();
    });
  } else {
    themeToggle.addEventListener('click', toggleTheme);
    watchSystemTheme();
  }
})();
