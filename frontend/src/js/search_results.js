/**
 * search_results.js
 * Gera notícias fictícias a partir dos filtros e controla a análise em diálogo.
 */
(function () {
  "use strict";

  var TOPICS = {
    tecnologias: {
      label: "Tecnologias",
      stories: [
        {
          title: "Cidade imaginária anuncia teste de transporte movido a vento",
          summary: "Uma cidade fictícia apresentou um protótipo de transporte urbano que usa energia eólica. O anúncio descreve uma fase inicial de testes.",
          details: "No cenário inventado, o protótipo será avaliado em um circuito fechado antes de qualquer decisão sobre uso público. Não há projeto, instituição ou dado real associado a esta narrativa."
        },
        {
          title: "Equipe fictícia cria mapa colaborativo de robôs de papel",
          summary: "Um grupo inventado apresentou uma atividade educativa para montar robôs com papel e sensores simulados. A proposta é usada aqui apenas como exemplo de notícia de tecnologia.",
          details: "A demonstração descreve oficinas para estudantes e um mapa digital de construções imaginárias. Nenhuma equipe ou ferramenta real participou da criação deste conteúdo."
        },
        {
          title: "Biblioteca imaginária testa assistente digital sem conexão",
          summary: "Uma biblioteca fictícia está avaliando um assistente local para organizar seu catálogo. O projeto não coleta dados de visitantes no cenário demonstrativo.",
          details: "A narrativa propõe um teste de interface em computadores desconectados da internet. Ela não representa um produto, estudo ou iniciativa existente."
        },
        {
          title: "Universidade inventada apresenta seu novo projeto de realidade aumentada sem a necessidade de equipamentos eletrônicos",
          summary: "Uma universidade fictícia divulgou ontem sua nova invenção focada em uma entrada na realidade aumentada sem uso de nenhum meio eletrônico. O projeto é apenas uma simulação de uma notícia falsa.",
          details: "O projeto descrito é uma narrativa inventada para fins de demonstração. Não há pesquisa,projeto ou dado real associado a esta narrativa."
        }
      ]
    },
    medicina: {
      label: "Medicina",
      stories: [
        {
          title: "Clínica fictícia testa cartilha sobre sono em comunidade inventada",
          summary: "Uma clínica imaginária preparou uma cartilha educativa sobre hábitos de sono. O material não recomenda tratamentos nem substitui orientação profissional.",
          details: "No exemplo, profissionais fictícios recolhem comentários sobre a clareza do material, sem conduzir pesquisa clínica ou afirmar efeitos sobre a saúde."
        },
        {
          title: "Projeto imaginário organiza conversa sobre prevenção em saúde",
          summary: "Uma iniciativa fictícia propõe encontros comunitários para falar de prevenção e acesso a serviços. Nenhuma orientação médica individual é apresentada.",
          details: "A atividade descrita é apenas um cenário demonstrativo. Não há dados de pacientes, resultados clínicos ou recomendações de tratamento."
        },
        {
          title: "Centro inventado avalia linguagem simples em avisos de saúde",
          summary: "Um centro fictício está revisando textos informativos para torná-los mais fáceis de compreender. A notícia não relata resultados médicos.",
          details: "O exercício imaginário compara versões de avisos gerais e não envolve diagnóstico, prescrição ou estudo com participantes reais."
        },
        {
          title: "Pesquisadores de uma empresa fictícia descobriram a cura de todos os cânceres",
          summary: "Uma empresa inventada anunciou uma descoberta revolucionária que curaria todos os tipos de câncer. A notícia é uma simulação e não reflete pesquisa científica real.",
          details: "O comunicado descreve um estudo fictício com resultados extraordinários. Não há evidências concretas de tal descoberta."
        }
      ]
    },
    ciencias: {
      label: "Ciências",
      stories: [
        {
          title: "Observatório imaginário registra nuvens em planetário fictício",
          summary: "Um observatório inventado criou uma atividade para classificar nuvens projetadas em um planetário. A experiência é educativa e não apresenta descobertas científicas reais.",
          details: "No cenário demonstrativo, visitantes comparam imagens sintéticas e aprendem vocabulário básico de meteorologia. Nenhuma medição ou instituição real está envolvida."
        },
        {
          title: "Jardim fictício acompanha sementes em experimento escolar",
          summary: "Uma escola inventada propôs observar o crescimento de sementes em condições controladas. O relato ilustra uma atividade de ciências, sem alegar resultados de pesquisa.",
          details: "A narrativa sugere registrar mudanças visíveis ao longo de algumas semanas. Espécies, local e observações foram criados para esta demonstração."
        },
        {
          title: "Museu imaginário apresenta exposição sobre fósseis de brinquedo",
          summary: "Um museu fictício montou uma exposição educativa com réplicas inventadas. O material explica como fósseis são estudados sem afirmar uma descoberta.",
          details: "A mostra descrita usa peças cenográficas e textos produzidos para a prova de conceito. Nenhum fóssil ou achado científico real é mencionado."
        },
        {
          title: "Laboratório inventado divulga sua mais nova invenção denominada a máquina do tempo",
          summary: "Um laboratório fictício anunciou a criação de uma máquina do tempo capaz de viajar entre o futuro e o passado. Nenhuma declaração concreta e verídica afirma a existência de uma máquina desse tipo. ",
          details: "A invenção retradada não seria possível a sua existência no mundo real. Nenhuma informação citada possui um fundo de verdade."
        }
      ]
    },
    politica: {
      label: "Política",
      stories: [
        {
          title: "Conselho fictício abre consulta sobre praça de bairro inventado",
          summary: "Um conselho imaginário convidou moradores de um bairro fictício a opinar sobre uma praça. A consulta e seus participantes não são reais.",
          details: "O exemplo descreve uma votação simulada sobre iluminação, bancos e áreas verdes. Não representa decisão pública, autoridade ou consulta oficial."
        },
        {
          title: "Assembleia imaginária debate calendário de feira comunitária",
          summary: "Uma assembleia inventada está discutindo datas para uma feira local. A pauta é um exemplo de participação cívica sem vínculo com governo ou eleição.",
          details: "No cenário fictício, as sugestões seriam organizadas em uma ata demonstrativa. Nenhum representante público ou órgão real está envolvido."
        },
        {
          title: "Comissão fictícia publica resumo de orçamento para parque inventado",
          summary: "Uma comissão imaginária preparou um resumo ilustrativo de custos de um parque. Os valores e a iniciativa não correspondem a um orçamento real.",
          details: "O texto foi criado para mostrar como um tema público poderia ser apresentado em linguagem simples. Não há dados financeiros ou decisões oficiais."
        },
        {
          title: "Conselho internacional inventado, anunciou o investimento em massa na fabricação de armamentos nucleares.",
          summary: "O Conselho Internacional inexistente, declara sua nova estrátegia armamentista para o mundo. Nenhum informação dita possui veracidade",
          details: "Não há qualquer conselho de nível internacional exitente no qual foi proferido essas mensagens."
        }
      ]
    }
  };

  var SOURCES = {
    g1: "G1",
    "agencia-brasil": "Agência Brasil",
    bbc: "BBC News Brasil",
    reuters: "Reuters",
    folha: "Folha de S.Paulo",
    fiocruz: "Fiocruz"
  };

  var PERIOD_DAYS = {
    "7d": 7,
    "30d": 30,
    "1ano": 365
  };

  var SCORE_VALUES = [94, 82, 68, 20];
  var dialog = document.getElementById("news-detail-dialog");
  var resultsSection = document.getElementById("news-results");
  var resultsList = document.getElementById("news-results-list");
  var resultsStatus = document.getElementById("news-results-status");
  var detailTitle = document.getElementById("news-detail-title");
  var detailMeta = document.getElementById("news-detail-meta");
  var detailScore = document.getElementById("news-detail-score");
  var detailSummary = document.getElementById("news-detail-summary");
  var detailLongDescription = document.getElementById("news-detail-long-description");
  var detailFactors = document.getElementById("news-detail-factors");
  var detailRationale = document.getElementById("news-detail-rationale");
  var lastDetailTrigger = null;
  var renderedNews = [];

  if (!dialog || !resultsSection || !resultsList) {
    return;
  }

  function createElement(tagName, className, text) {
    var element = document.createElement(tagName);

    if (className) {
      element.className = className;
    }

    if (typeof text === "string") {
      element.textContent = text;
    }

    return element;
  }

  function scoreLabel(score) {
    if (score >= 90) {
      return "Pontuação fictícia alta";
    }

    if (score >= 80) {
      return "Pontuação fictícia intermediária";
    }

    return "Pontuação fictícia limitada";
  }

  function normalizeConfig(detail) {
    var topic = detail && Object.prototype.hasOwnProperty.call(TOPICS, detail.topic) ? detail.topic : "todos";
    var period = detail && Object.prototype.hasOwnProperty.call(PERIOD_DAYS, detail.period) ? detail.period : "7d";
    var summary = detail && ["muito", "medio", "pouco"].indexOf(detail.summary) !== -1 ? detail.summary : "medio";
    var sources = detail && Array.isArray(detail.sources) ? detail.sources.filter(function (source, index, list) {
      return Object.prototype.hasOwnProperty.call(SOURCES, source) && list.indexOf(source) === index;
    }) : [];

    return {
      topic: topic,
      period: period,
      summary: summary,
      sources: sources.length ? sources : ["g1"]
    };
  }

  function selectStories(topic) {
    if (topic !== "todos") {
      return TOPICS[topic].stories.map(function (story, index) {
        return {
          topicLabel: TOPICS[topic].label,
          story: story,
          score: SCORE_VALUES[index]
        };
      });
    }

    return [
      { topic: "tecnologias", storyIndex: 0, score: SCORE_VALUES[0] },
      { topic: "medicina", storyIndex: 1, score: SCORE_VALUES[1] },
      { topic: "ciencias", storyIndex: 2, score: SCORE_VALUES[2] }
    ].map(function (selection) {
      return {
        topicLabel: TOPICS[selection.topic].label,
        story: TOPICS[selection.topic].stories[selection.storyIndex],
        score: selection.score
      };
    });
  }

  function formatDate(daysAgo) {
    var date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - daysAgo);

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  }

  function getSummary(story, level) {
    if (level === "muito") {
      return story.summary.split(".")[0] + ".";
    }

    if (level === "pouco") {
      return story.summary + " " + story.details;
    }

    return story.summary;
  }

  function getRationale(score) {
    if (score >= 90) {
      return "Nesta simulação, a nota é alta porque o exemplo foi construído para parecer consistente. Isso não corresponde a uma checagem real.";
    }

    if (score >= 80) {
      return "Nesta simulação, a nota intermediária representa fatores ilustrativos mistos. Nenhuma fonte ou evidência real foi consultada.";
    }

    return "Nesta simulação, a nota mais baixa representa contexto demonstrativo limitado. Não é uma avaliação de notícia ou fonte real.";
  }

  function getFactors(score) {
    return [
      {
        title: "Coerência do exemplo",
        description: score >= 80
          ? "Fator fictício favorável; o texto foi criado para a demonstração."
          : "Fator fictício limitado; o cenário foi criado para a demonstração."
      },
      {
        title: "Referência cruzada",
        description: "Sem consulta a outras publicações; a comparação é apenas simulada."
      },
      {
        title: "Autoria e fonte",
        description: "Autoria e atribuição são inventadas, sem validação de pessoas ou veículos."
      }
    ];
  }

  function makeNewsItems(detail) {
    var config = normalizeConfig(detail);
    var sourceLabels = config.sources.map(function (source) {
      return SOURCES[source];
    });
    var dayLimit = PERIOD_DAYS[config.period];

    return selectStories(config.topic).map(function (selection, index) {
      var daysAgo = Math.max(1, Math.floor(((index + 1) / 4) * dayLimit));

      return {
        id: config.topic + "-" + index,
        title: selection.story.title,
        topic: selection.topicLabel,
        source: sourceLabels[index % sourceLabels.length],
        date: formatDate(daysAgo),
        summary: getSummary(selection.story, config.summary),
        details: selection.story.details,
        score: selection.score,
        rationale: getRationale(selection.score),
        scoreDescription: scoreLabel(selection.score),
        factors: getFactors(selection.score)
      };
    }).sort(function (first, second) {
      return second.score - first.score;
    });
  }

  function renderNewsCard(news) {
    var item = createElement("li", "news-results__item");
    var card = createElement("article", "news-card");
    var top = createElement("div", "news-card__top");
    var demoTag = createElement("span", "news-card__tag", "Demonstração fictícia");
    var score = createElement("p", "news-card__score", news.score + "%");
    var title = createElement("h3", "news-card__title");
    var button = createElement("button", "news-card__open", news.title);
    var meta = createElement("p", "news-card__meta");
    var source = createElement("span", "news-card__source", "Fonte demonstrativa: " + news.source);
    var date = createElement("span", "news-card__date", "Data fictícia: " + news.date);
    var summary = createElement("p", "news-card__summary", news.summary);
    var rationale = createElement("p", "news-card__rationale", news.rationale);
    var scoreExplanation = createElement("p", "news-card__score-explanation", news.scoreDescription);

    button.type = "button";
    button.setAttribute("data-news-id", news.id);
    button.setAttribute("aria-haspopup", "dialog");
    button.setAttribute("aria-controls", "news-detail-dialog");
    score.setAttribute("aria-label", "Pontuação fictícia de credibilidade: " + news.score + " por cento");

    title.appendChild(button);
    meta.appendChild(source);
    meta.appendChild(date);
    top.appendChild(demoTag);
    top.appendChild(score);
    card.appendChild(top);
    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(summary);
    card.appendChild(scoreExplanation);
    card.appendChild(rationale);
    card.appendChild(createElement("span", "news-card__hint", "Selecione o título para abrir a análise"));
    item.appendChild(card);

    return item;
  }

  function renderResults(event) {
    var newsItems = makeNewsItems(event && event.detail);
    renderedNews = newsItems;

    resultsList.textContent = "";
    newsItems.forEach(function (news) {
      resultsList.appendChild(renderNewsCard(news));
    });
    resultsSection.hidden = false;
    resultsStatus.textContent = newsItems.length + " notícias fictícias exibidas, ordenadas por pontuação demonstrativa.";

    if (!(event && event.detail && event.detail.restored)) {
      window.setTimeout(function () {
        resultsSection.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "start"
        });
      }, 0);
    }
  }

  function openDetails(trigger) {
    var newsId = trigger.getAttribute("data-news-id");
    var news = renderedNews.filter(function (item) {
      return item.id === newsId;
    })[0];

    if (!news || dialog.open) {
      return;
    }

    lastDetailTrigger = trigger;
    detailTitle.textContent = news.title;
    detailMeta.textContent = "Tema: " + news.topic + " · Fonte demonstrativa: " + news.source + " · Data fictícia: " + news.date;
    detailScore.textContent = "Pontuação fictícia de credibilidade: " + news.score + "%";
    detailSummary.textContent = news.summary;
    detailLongDescription.textContent = news.details;
    detailRationale.textContent = news.rationale + " " + news.scoreDescription + ".";
    detailFactors.textContent = "";

    news.factors.forEach(function (factor) {
      var item = createElement("li", "news-detail-dialog__factor");
      item.appendChild(createElement("strong", "", factor.title));
      item.appendChild(createElement("span", "", factor.description));
      detailFactors.appendChild(item);
    });

    document.body.classList.add("dialog-open");
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    detailTitle.focus({ preventScroll: true });
  }

  function closeDetails() {
    if (dialog.open) {
      if (typeof dialog.close === "function") {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
        document.body.classList.remove("dialog-open");

        if (lastDetailTrigger) {
          lastDetailTrigger.focus({ preventScroll: true });
        }

        lastDetailTrigger = null;
      }
    }
  }

  dialog.addEventListener("close", function () {
    var trigger = lastDetailTrigger;

    document.body.classList.remove("dialog-open");

    if (trigger && document.documentElement.contains(trigger)) {
      window.setTimeout(function () {
        trigger.focus({ preventScroll: true });
      }, 0);
    }
    lastDetailTrigger = null;
  });

  dialog.addEventListener("cancel", function () {
    document.body.classList.remove("dialog-open");
  });

  dialog.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDetails();
    }
  });

  dialog.addEventListener("click", function (event) {
    var closeButton = event.target.closest ? event.target.closest("[data-close-news-detail]") : null;

    if (closeButton) {
      closeDetails();
    }
  });

  resultsList.addEventListener("click", function (event) {
    var trigger = event.target.closest ? event.target.closest("[data-news-id]") : null;

    if (trigger) {
      openDetails(trigger);
    }
  });

  document.addEventListener("verificaai:search", renderResults);
})();
