/**
 * search_modal.js
 * Controla o wizard de configuração da pesquisa.
 *
 * Fluxo:
 * 1. Qualquer botão com [data-open-search] abre o <dialog>.
 * 2. O formulário é preenchido com a última configuração salva ou com padrões.
 * 3. As quatro etapas são exibidas sequencialmente no mesmo dialog.
 * 4. Ao concluir, a configuração é salva em sessionStorage, o resumo é
 *    renderizado na página e o evento "verificaai:search" é disparado.
 *
 * A Etapa 3 poderá ouvir esse evento ou ler a chave salva para gerar os
 * resultados fictícios correspondentes aos filtros escolhidos.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "verificaai-search-config";

  var DEFAULTS = {
    topic: "todos",
    period: "7d",
    summary: "medio",
    sources: ["g1"]
  };

  var VALID = {
    topic: ["todos", "tecnologias", "medicina", "ciencias", "politica"],
    period: ["7d", "30d", "1ano"],
    summary: ["muito", "medio", "pouco"],
    sources: ["g1", "agencia-brasil", "bbc", "reuters", "folha", "fiocruz"]
  };

  var dialog = document.getElementById("search-dialog");
  var form = document.getElementById("search-form");

  if (!dialog || !form) {
    return;
  }

  var steps = Array.prototype.slice.call(dialog.querySelectorAll("[data-wizard-step]"));
  var progressFill = document.getElementById("wizard-progress-fill");
  var progressLabel = document.getElementById("wizard-progress-label");
  var nextButton = document.getElementById("wizard-next");
  var nextLabel = document.getElementById("wizard-next-label");
  var backButton = dialog.querySelector("[data-wizard-back]");
  var closeButton = dialog.querySelector("[data-close-search]");
  var sourcesError = document.getElementById("sources-error");
  var summarySection = document.getElementById("resumo-pesquisa");
  var summaryChips = document.getElementById("search-summary-chips");
  var summaryTitle = document.getElementById("search-summary-title");
  var status = document.getElementById("a11y-status");
  var dialogBody = dialog.querySelector(".search-dialog__body");

  var labels = {};
  var currentStep = 0;
  var lastTrigger = null;
  var focusSummaryAfterClose = false;
  var announceTimer;

  /* Monta um mapa valor -> texto legível para montar o resumo da pesquisa. */
  Array.prototype.forEach.call(form.querySelectorAll("input[data-label]"), function (input) {
    if (!labels[input.name]) {
      labels[input.name] = {};
    }

    labels[input.name][input.value] = input.getAttribute("data-label");
  });

  function getLabel(name, value) {
    return labels[name] && labels[name][value] ? labels[name][value] : value;
  }

  /* Normaliza dados vindos do sessionStorage, descartando valores inválidos. */
  function sanitizeConfig(data) {
    if (!data || typeof data !== "object") {
      return null;
    }

    var safe = {
      topic: DEFAULTS.topic,
      period: DEFAULTS.period,
      summary: DEFAULTS.summary,
      sources: DEFAULTS.sources.slice()
    };

    if (VALID.topic.indexOf(data.topic) !== -1) {
      safe.topic = data.topic;
    }

    if (VALID.period.indexOf(data.period) !== -1) {
      safe.period = data.period;
    }

    if (VALID.summary.indexOf(data.summary) !== -1) {
      safe.summary = data.summary;
    }

    if (Array.isArray(data.sources)) {
      var validSources = data.sources.filter(function (source, index, list) {
        return VALID.sources.indexOf(source) !== -1 && list.indexOf(source) === index;
      });

      if (validSources.length) {
        safe.sources = validSources;
      }
    }

    return safe;
  }

  function readStoredConfig() {
    try {
      var raw = window.sessionStorage.getItem(STORAGE_KEY);

      if (!raw) {
        return null;
      }

      return sanitizeConfig(JSON.parse(raw));
    } catch (error) {
      return null;
    }
  }

  function writeStoredConfig(config) {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      return;
    }
  }

  /* Preenche os campos do formulário a partir de uma configuração segura. */
  function fillForm(config) {
    ["topic", "period", "summary"].forEach(function (name) {
      Array.prototype.forEach.call(form.querySelectorAll('input[name="' + name + '"]'), function (input) {
        input.checked = input.value === config[name];
      });
    });

    Array.prototype.forEach.call(form.querySelectorAll('input[name="sources"]'), function (input) {
      input.checked = config.sources.indexOf(input.value) !== -1;
    });
  }

  function getSelectedConfig() {
    var topic = form.querySelector('input[name="topic"]:checked');
    var period = form.querySelector('input[name="period"]:checked');
    var summary = form.querySelector('input[name="summary"]:checked');

    var sources = Array.prototype.map.call(
      form.querySelectorAll('input[name="sources"]:checked'),
      function (input) {
        return input.value;
      }
    );

    return {
      topic: topic ? topic.value : DEFAULTS.topic,
      period: period ? period.value : DEFAULTS.period,
      summary: summary ? summary.value : DEFAULTS.summary,
      sources: sources
    };
  }

  function createSearchDetail(config, restored) {
    return {
      topic: config.topic,
      period: config.period,
      summary: config.summary,
      sources: config.sources.slice(),
      restored: Boolean(restored),
      labels: {
        topic: getLabel("topic", config.topic),
        period: getLabel("period", config.period),
        summary: getLabel("summary", config.summary),
        sources: config.sources.map(function (source) {
          return getLabel("sources", source);
        })
      }
    };
  }

  /* Cria um chip do resumo sem usar innerHTML, evitando injeção de conteúdo. */
  function addSummaryChip(label, value) {
    var item = document.createElement("li");
    var labelElement = document.createElement("span");
    var valueElement = document.createElement("span");

    item.className = "search-summary__chip";
    labelElement.className = "search-summary__chip-label";
    valueElement.className = "search-summary__chip-value";
    labelElement.textContent = label;
    valueElement.textContent = value;

    item.appendChild(labelElement);
    item.appendChild(valueElement);
    summaryChips.appendChild(item);
  }

  function renderSummary(config) {
    var sourceLabels = config.sources.map(function (source) {
      return getLabel("sources", source);
    });

    summaryChips.textContent = "";
    addSummaryChip("Tema", getLabel("topic", config.topic));
    addSummaryChip("Período", getLabel("period", config.period));
    addSummaryChip("Resumo", getLabel("summary", config.summary));
    addSummaryChip("Fontes", sourceLabels.join(", "));
    summarySection.hidden = false;
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

  /* Fontes são o único campo obrigatório: a última etapa exige ao menos uma. */
  function updateSourceRequirement() {
    var isLastStep = currentStep === steps.length - 1;
    var checkedSources = form.querySelectorAll('input[name="sources"]:checked').length;
    var shouldShowError = isLastStep && checkedSources === 0;

    sourcesError.hidden = !shouldShowError;
    nextButton.disabled = shouldShowError;
  }

  /*
   * Troca a etapa visível, atualiza progresso/rótulos e move o foco para o
   * título da nova etapa. O foco no título faz leitores de tela anunciarem
   * a pergunta atual sem depender de clique do usuário.
   */
  function showStep(index) {
    if (index < 0 || index >= steps.length) {
      return;
    }

    currentStep = index;

    steps.forEach(function (step, stepIndex) {
      step.hidden = stepIndex !== index;
    });

    progressFill.style.width = (((index + 1) / steps.length) * 100) + "%";
    progressLabel.textContent = "Etapa " + (index + 1) + " de " + steps.length;
    backButton.hidden = index === 0;
    nextLabel.textContent = index === steps.length - 1 ? "Pesquisar" : "Continuar";

    if (dialogBody) {
      dialogBody.scrollTop = 0;
    }

    updateSourceRequirement();

    var title = steps[index].querySelector(".wizard-step__title");

    if (title) {
      title.focus({ preventScroll: true });
    }
  }

  /* Abre o wizard com a última configuração salva ou com os padrões. */
  function openDialog(trigger) {
    if (dialog.open) {
      return;
    }

    lastTrigger = trigger || document.activeElement;
    fillForm(readStoredConfig() || DEFAULTS);

    document.body.classList.add("dialog-open");

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }

    showStep(0);
  }

  function closeDialog() {
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
      document.body.classList.remove("dialog-open");
    }
  }

  /* Depois de concluir, o foco vai para o resumo, que é o novo conteúdo. */
  function focusSummary() {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var resultsSection = document.getElementById("news-results");
    var resultsTitle = document.getElementById("news-results-title");
    var focusResults = resultsSection && !resultsSection.hidden && resultsTitle;
    var focusTarget = focusResults ? resultsTitle : summaryTitle;
    var scrollTarget = focusResults ? resultsSection : summarySection;

    focusTarget.focus({ preventScroll: true });
    scrollTarget.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center"
    });
  }

  dialog.addEventListener("close", function () {
    document.body.classList.remove("dialog-open");

    if (focusSummaryAfterClose) {
      focusSummaryAfterClose = false;
      window.setTimeout(focusSummary, 0);
      announce("Pesquisa demonstrativa concluída. Confira os resultados e os filtros.");
      return;
    }

    if (lastTrigger && typeof lastTrigger.focus === "function") {
      window.setTimeout(function () {
        lastTrigger.focus({ preventScroll: true });
      }, 0);
    }
  });

  dialog.addEventListener("cancel", function () {
    document.body.classList.remove("dialog-open");
  });

  if (closeButton) {
    closeButton.addEventListener("click", closeDialog);
  }

  if (backButton) {
    backButton.addEventListener("click", function () {
      showStep(currentStep - 1);
    });
  }

  form.addEventListener("change", function (event) {
    if (event.target && event.target.name === "sources") {
      updateSourceRequirement();
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (currentStep < steps.length - 1) {
      showStep(currentStep + 1);
      return;
    }

    var config = getSelectedConfig();

    if (!config.sources.length) {
      updateSourceRequirement();
      return;
    }

    writeStoredConfig(config);
    renderSummary(config);
    focusSummaryAfterClose = true;

    document.dispatchEvent(new CustomEvent("verificaai:search", { detail: createSearchDetail(config) }));
    closeDialog();
  });

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest ? event.target.closest("[data-open-search]") : null;

    if (!trigger) {
      return;
    }

    event.preventDefault();
    openDialog(trigger);
  });

  /* Restaura o resumo ao recarregar a página dentro da mesma sessão. */
  var storedConfig = readStoredConfig();

  if (storedConfig) {
    renderSummary(storedConfig);
    document.dispatchEvent(new CustomEvent("verificaai:search", { detail: createSearchDetail(storedConfig, true) }));
  }
})();
