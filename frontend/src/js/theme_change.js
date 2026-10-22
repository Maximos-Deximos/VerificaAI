(function () {
  "use strict";

  var THEME_KEY = "verificaai-theme";
  var CONTRAST_KEY = "verificaai-contrast";
  var root = document.documentElement;
  var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  var themeSwitch = document.getElementById("theme-switch");
  var contrastToggle = document.getElementById("contrast-toggle");
  var status = document.getElementById("a11y-status");
  var themeColor = document.getElementById("theme-color");
  var announceTimer;

  function readPreference(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function writePreference(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      return;
    }
  }

  function systemTheme() {
    return darkQuery.matches ? "dark" : "light";
  }

  function hasThemeChoice() {
    var theme = readPreference(THEME_KEY);
    return theme === "light" || theme === "dark";
  }

  function currentTheme() {
    return root.dataset.theme === "dark" ? "dark" : "light";
  }

  function currentContrast() {
    return root.dataset.contrast === "high";
  }

  function announce(message) {
    if (!status) {
      return;
    }

    window.clearTimeout(announceTimer);
    status.textContent = "";

    announceTimer = window.setTimeout(function () {
      status.textContent = message;
    }, 60);
  }

  function syncThemeColor() {
    if (!themeColor) {
      return;
    }

    if (currentContrast()) {
      themeColor.setAttribute("content", "#000000");
      return;
    }

    themeColor.setAttribute("content", currentTheme() === "dark" ? "#2e2e2e" : "#00008b");
  }

  function syncThemeControl() {
    if (!themeSwitch) {
      return;
    }

    var isDark = currentTheme() === "dark";
    themeSwitch.setAttribute("aria-checked", String(isDark));
    themeSwitch.setAttribute(
      "aria-label",
      isDark ? "Tema escuro ativado. Alternar para tema claro." : "Tema claro ativado. Alternar para tema escuro."
    );
  }

  function syncContrastControl() {
    if (!contrastToggle) {
      return;
    }

    var isHigh = currentContrast();
    contrastToggle.setAttribute("aria-pressed", String(isHigh));
    contrastToggle.setAttribute("aria-label", isHigh ? "Desativar alto contraste" : "Ativar alto contraste");
  }

  function applyTheme(theme, persist) {
    root.dataset.theme = theme;

    if (persist) {
      writePreference(THEME_KEY, theme);
    }

    syncThemeControl();
    syncThemeColor();
  }

  function applyContrast(isHigh, persist) {
    root.dataset.contrast = isHigh ? "high" : "normal";

    if (persist) {
      writePreference(CONTRAST_KEY, isHigh ? "high" : "normal");
    }

    syncContrastControl();
    syncThemeColor();
  }

  function onSystemThemeChange(event) {
    if (hasThemeChoice()) {
      return;
    }

    applyTheme(event.matches ? "dark" : "light", false);
  }

  var storedTheme = readPreference(THEME_KEY);
  applyTheme(storedTheme === "light" || storedTheme === "dark" ? storedTheme : systemTheme(), false);
  applyContrast(readPreference(CONTRAST_KEY) === "high", false);

  if (themeSwitch) {
    themeSwitch.addEventListener("click", function () {
      var nextTheme = currentTheme() === "dark" ? "light" : "dark";
      applyTheme(nextTheme, true);
      announce(nextTheme === "dark" ? "Tema escuro ativado." : "Tema claro ativado.");
    });
  }

  if (contrastToggle) {
    contrastToggle.addEventListener("click", function () {
      var enableHighContrast = !currentContrast();
      applyContrast(enableHighContrast, true);
      announce(enableHighContrast ? "Alto contraste ativado." : "Alto contraste desativado.");
    });
  }

  if (typeof darkQuery.addEventListener === "function") {
    darkQuery.addEventListener("change", onSystemThemeChange);
  } else if (typeof darkQuery.addListener === "function") {
    darkQuery.addListener(onSystemThemeChange);
  }
})();
