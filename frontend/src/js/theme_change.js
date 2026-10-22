/**
 * theme_change.js
 * Controla o tema claro/escuro e o modo de alto contraste em todas as páginas.
 *
 * Fluxo principal:
 * 1. Lê as preferências salvas no localStorage.
 * 2. Sem preferência salva, usa o tema do sistema operacional.
 * 3. Aplica o estado nos atributos data-theme e data-contrast do <html>,
 *    que são usados pelos tokens de cor definidos em global.css.
 * 4. Mantém os controles do header sincronizados com o estado atual.
 * 5. Salva no localStorage apenas quando o usuário faz uma escolha manual.
 */
(function () {
  "use strict";

  /* Chaves usadas para persistir as escolhas do usuário entre visitas. */
  var THEME_KEY = "verificaai-theme";
  var CONTRAST_KEY = "verificaai-contrast";

  /* Elementos globais e controles acessíveis presentes no header. */
  var root = document.documentElement;
  var root = document.documentElement;
  var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  var themeSwitch = document.getElementById("theme-switch");
  var contrastToggle = document.getElementById("contrast-toggle");
  var status = document.getElementById("a11y-status");
  var themeColor = document.getElementById("theme-color");
  var announceTimer;

  /*
   * O acesso ao localStorage pode falhar em navegadores restritivos ou em
   * arquivos abertos diretamente via file://. Nesses casos, o tema continua
   * funcionando na sessão, apenas sem persistência.
   */
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

  /* Detecta a preferência do sistema quando o usuário ainda não escolheu. */
  function systemTheme() {
    return darkQuery.matches ? "dark" : "light";
  }

  /* Indica se existe uma escolha manual de tema salva. */
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

  /*
   * Anuncia mudanças de tema e contraste em uma região aria-live.
   * O pequeno atraso garante que leitores de tela percebam a alteração
   * mesmo quando o texto anterior era igual.
   */
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

  /* Atualiza a cor da barra do navegador conforme o tema e o contraste. */
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

  /*
   * Sincroniza o slider de tema com o estado real.
   * aria-checked informa a posição do switch; aria-label explica a próxima ação.
   */
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

  /* Mantém o botão de alto contraste com o estado acessível correto. */
  function syncContrastControl() {
    if (!contrastToggle) {
      return;
    }

    var isHigh = currentContrast();
    contrastToggle.setAttribute("aria-pressed", String(isHigh));
    contrastToggle.setAttribute("aria-label", isHigh ? "Desativar alto contraste" : "Ativar alto contraste");
  }

  /*
   * Aplica o tema no <html>. O CSS reage a data-theme para trocar todos os
   * tokens de cor. persist=true salva a escolha manual do usuário.
   */
  function applyTheme(theme, persist) {
    root.dataset.theme = theme;

    if (persist) {
      writePreference(THEME_KEY, theme);
    }

    syncThemeControl();
    syncThemeColor();
  }

  /*
   * Aplica o alto contraste. O CSS usa data-contrast="high" para reforçar
   * bordas, foco, textos e remover sombras.
   */
  function applyContrast(isHigh, persist) {
    root.dataset.contrast = isHigh ? "high" : "normal";

    if (persist) {
      writePreference(CONTRAST_KEY, isHigh ? "high" : "normal");
    }

    syncContrastControl();
    syncThemeColor();
  }

  /*
   * Se o usuário nunca escolheu manualmente, acompanha mudanças feitas no
   * tema do sistema operacional enquanto a página está aberta.
   */
  function onSystemThemeChange(event) {
    if (hasThemeChoice()) {
      return;
    }

    applyTheme(event.matches ? "dark" : "light", false);
  }

  /* Inicialização: preferência salva tem prioridade; senão, usa o sistema. */
  var storedTheme = readPreference(THEME_KEY);
  applyTheme(storedTheme === "light" || storedTheme === "dark" ? storedTheme : systemTheme(), false);
  applyContrast(readPreference(CONTRAST_KEY) === "high", false);

  /* Alterna entre claro e escuro e salva a nova preferência. */
  if (themeSwitch) {
    themeSwitch.addEventListener("click", function () {
      var nextTheme = currentTheme() === "dark" ? "light" : "dark";
      applyTheme(nextTheme, true);
      announce(nextTheme === "dark" ? "Tema escuro ativado." : "Tema claro ativado.");
    });
  }

  /* Liga e desliga o modo de alto contraste, também com persistência. */
  if (contrastToggle) {
    contrastToggle.addEventListener("click", function () {
      var enableHighContrast = !currentContrast();
      applyContrast(enableHighContrast, true);
      announce(enableHighContrast ? "Alto contraste ativado." : "Alto contraste desativado.");
    });
  }

  /* Compatibilidade com navegadores antigos que usam addListener. */
  if (typeof darkQuery.addEventListener === "function") {
    darkQuery.addEventListener("change", onSystemThemeChange);
  } else if (typeof darkQuery.addListener === "function") {
    darkQuery.addListener(onSystemThemeChange);
  }
})();
