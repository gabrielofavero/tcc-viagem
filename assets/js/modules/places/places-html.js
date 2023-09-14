// ======= Places HTML JS =======

// ======= LOADERS =======
function _loadP() {
  _loadExitButton();
  _loadVisibilityPasseio();

  _logger(INFO, "Passeio HTML Page Loaded");
  const NOME = "nome";
  const REGIAO = "regiao";
  const DESCRICAO = "descricao";
  const DUO = "duo";
  const VEG = "veg";
  const VALOR = "valor";
  const VISITADO = "visitado";
  const NOTA = "nota";
  const HYPERLINK = "hyperlink";
  const HEAD = "head";
  const HORARIO = "horario";
  const PALCO = "palco";
  const WEED = "weed";
  const EMOJI = "emoji";
  const PLAN = "plan.";
  const NOVO = "novo";
  const VIDEO = "video";

  var P_RESULT = JSON.parse(window.localStorage.getItem('P_RESULT'));
  const CURRENCY_JSON = _getJSON("assets/json/modules/places/currency.json");
  const PLACES_JSON = _getJSON("assets/json/modules/places/places.json");
  const PLACES_SETTINGS_JSON = _getJSON("assets/json/modules/places/settings.json");
  var HTML_PARAMS = _getParamsHTML();
  var CITY = HTML_PARAMS["city"];
  var TYPE = HTML_PARAMS["type"];
  var TYPE_TITLE = PLACES_JSON[TYPE].title;
  var DISPLAY_TITLE = PLACES_JSON[TYPE].displayTitle;
  var TYPE_SUBTITLE = PLACES_JSON[TYPE].subtitle;
  var PLACE = _getPlace(CITY, TYPE_TITLE, P_RESULT);
  var CURRENCY = window.localStorage.getItem('CURRENCY');

  if (PLACE) {
    let result = [];

    document.title = DISPLAY_TITLE || TYPE_TITLE;
    document.getElementById("titleP").innerHTML = "<h2>" + document.title + "</h2>";
    if (TYPE_SUBTITLE) {
      document.getElementById("subTitleP").innerHTML = "<h5>" + TYPE_SUBTITLE + "</h5>";
    }

    var MOEDA_OBJ = CURRENCY_JSON[CURRENCY] || CURRENCY_JSON["R$"];
    var NOTAS_OBJ = PLACES_SETTINGS_JSON["scores"];
    var SINGLE_SCORES_OBJ = _getSingleScoresObj(PLACE, NOTAS_OBJ);

    let P_NOME = PLACE[NOME];
    let P_NOTA = PLACE[NOTA];
    let P_VALOR = PLACE[VALOR];
    let P_VISITADO = PLACE[VISITADO];
    let P_HYPERLINK = PLACE[HYPERLINK];
    let P_DESCRICAO = PLACE[DESCRICAO];
    let P_REGIAO = PLACE[REGIAO];
    let P_DUO = PLACE[DUO];
    let P_VEG = PLACE[VEG];
    let P_HEAD = PLACE[HEAD];
    let P_HORARIO = PLACE[HORARIO];
    let P_PALCO = PLACE[PALCO];
    let P_WEED = PLACE[WEED];
    let P_EMOJI = PLACE[EMOJI];
    let P_PLAN = PLACE[PLAN];
    let P_NOVO = PLACE[NOVO];
    let P_VIDEO = PLACE[VIDEO];

    let novoExists = _newExists(P_NOVO);

    for (let i = 0; i < PLACE[NOME].length; i++) {

      // Required
      let nome = P_NOME[i];
      let nota = _getScore(P_NOTA[i], PLACES_SETTINGS_JSON, SINGLE_SCORES_OBJ, i);
      let notaNumerica = _getNumericScore(nota);
      let cor = _getScoreColor(nota);

      // Optional
      let valor = P_VALOR ? _getCost(P_VALOR[i], MOEDA_OBJ) : "";
      let nameHyperlink = _getHyperlinkItem(P_HYPERLINK, i, "name");
      let mediaHyperlink = _getHyperlinkItem(P_HYPERLINK, i, "video");
      let videoText = P_VIDEO ? _AdaptNulls(P_VIDEO[i]) : "";
      let descricao = P_DESCRICAO ? _AdaptNulls(P_DESCRICAO[i]) : "";
      let visitado = _replace(P_VISITADO, i, "✓");
      let duo = _replace(P_DUO, i, "Aceita Duo Gourmet");
      let regiao = P_REGIAO ? _AdaptNulls(P_REGIAO[i]) : "";
      let horario = P_HORARIO ? _AdaptNulls(P_HORARIO[i]) : "";
      let palco = P_PALCO ? _AdaptNulls(P_PALCO[i]) : "";
      let veg = _replace(P_VEG, i, "🌱");
      let head = _replace(P_HEAD, i, "⭐");
      let weed = _replace(P_WEED, i, "🌿");
      let emoji = P_EMOJI ? _AdaptNulls(P_EMOJI[i]) : "";
      let plan = _replace(P_PLAN, i, "Planejado");

      let nameEmojis = emoji + visitado + veg + weed + head;
      let detalhes = _getDetails([regiao, horario, palco, duo, plan]);

      if (novoExists) {
        let novo = _replace(P_NOVO, i, "Novo!");
        nota = novo ? novo : "";
      }

      if (videoText) {
        mediaHyperlink = _getVideoEmbed(videoText, mediaHyperlink, name);
      }

      if (nameHyperlink) {
        if (nameHyperlink.includes("open.spotify.com")) {
          if (!mediaHyperlink) {
            mediaHyperlink = _getSpotifyEmbed(nameHyperlink);
            nameHyperlink = "";
          } else {
            _logger(WARN, `Spotify link found for place '${nome}', but video link already exists. Ignoring Spotify link.`)
          }
        };
      }

      innerResult = {
        "nome": nome,
        "nameEmojis": nameEmojis,
        "nota": nota,
        "notaNumerica": notaNumerica,
        "cor": cor,
        "valor": valor,
        "nameHyperlink": nameHyperlink,
        "mediaHyperlink": mediaHyperlink,
        "descricao": descricao,
        "detalhes": detalhes,
      }
      result.push(innerResult);
    }

    if (CONFIG.places.autoSortByScore) { // Ordena por Nota (Desc) e Nome (Asc)
      result.sort(function (a, b) {
        return b.notaNumerica - a.notaNumerica || a.nome.localeCompare(b.nome);
      });
    };
    _setInnerHTML(result);
  } else {
    _logger(ERROR, "O Código não foi localizado na base de dados");
  }
}

function _loadExitButton() {
  let close = document.getElementById("closeButtonIOS");
  close.style.display = "block";
  close.onclick = function () {
    window.parent.closeLightbox();
  };
}

// ======= GETTERS =======
function _getUrlParameter(item) {
  let parameters = window.location.href.split("?")[1].split("&");
  for (let i = 0; i < parameters.length; i++) {
    if (parameters[i].split("=")[0] == item) {
      return parameters[i].split("=")[1];
    }
  }
}

function _getCityData(P_RESULTS, PARAM_CITY, PARAM_TYPE) {
  let result = {
    "city": "",
    "type": "",
    "data": {},
  };
  let keys = Object.keys(P_RESULTS);

  for (let i = 0; i < keys.length; i++) {
    if (P_RESULTS[keys[i]]["Código"] == PARAM_CITY) {
      result.city = keys[i];
      let cityKeys = Object.keys(P_RESULTS[keys[i]]);
      for (let j = 0; j < cityKeys.length; j++) {
        if (_codifyTitle(cityKeys[j]) == PARAM_TYPE) {
          result.type = cityKeys[j];
          result.data = P_RESULTS[keys[i]][cityKeys[j]];
        }
      }
    }
  }
  return result;
}

function _getCost(valor, MOEDA_OBJ) {
  let result;
  let defaultResult;
  if (valor && MOEDA_OBJ) {
    result = MOEDA_OBJ[valor];
    defaultResult = MOEDA_OBJ["default"];
  }
  return result || defaultResult || "Valor Desconhecido";
}

function _getScoreColor(score) {
  if (score == "?") {
    return "#ead1dc";
  } else {
    let numb = parseInt(score);
    if (numb == 100) {
      return "#CFE2F3";
    } else if (numb >= 75) {
      return "#D9EAD3";
    } else if (numb >= 50) {
      return "#FFF2CC";
    } else if (numb >= 25) {
      return "#FCE5CD";
    } else return "#F4CCCC";
  }
}

function _getScore(score, PLACES_SETTINGS_JSON, SINGLE_SCORES_OBJ, i) {
  let possibleValues = PLACES_SETTINGS_JSON["scores"]["possibleValues"]
  if (score && !possibleValues.includes(score)) {
    return score;
  } else if (score && possibleValues.includes(score)) {
    return _getIndividualScore(score);
  } else {
    let values = [];
    let keys = Object.keys(SINGLE_SCORES_OBJ);
    for (let j = 0; j < keys.length; j++) {
      let currentValues = SINGLE_SCORES_OBJ[keys[j]][i];
      if (currentValues) {
        values.push(currentValues);
      }
    }
    if (values.length > 0) {
      return _getMultipleScores(values);
    } else return "?";
  }

}

function _getIndividualScore(singleScore) {
  switch (singleScore) {
    case "!":
      return "100%";
    case "1":
      return "75%";
    case "2":
      return "50%";
    case "3":
      return "25%";
    case "4":
      return "0%";
    default:
      return "?";
  }
}

function _getMultipleScores(multipleScores) {
  let result = 0;
  let count = 0;
  for (let i = 0; i < multipleScores.length; i++) {
    let currentScore = _getIndividualScore(multipleScores[i]);
    if (currentScore != "?") {
      result += parseInt(currentScore);
      count++;
    }
  }
  if (count > 0) {
    return Math.round(result / count) + "%";
  } else {
    return "?";
  }
}

function _getSingleScoresObj(pass, NOTAS_OBJ) {
  let knownKeys = NOTAS_OBJ["knownKeys"];
  let possibleValues = NOTAS_OBJ["possibleValues"];
  let keys = Object.keys(pass);
  let result = {};
  for (let i = 0; i < keys.length; i++) {
    if (!knownKeys.includes(keys[i])) {
      let possibleVauluesArray = pass[keys[i]];
      let isSingleScore = true;
      for (let j = 0; j < possibleVauluesArray.length; j++) {
        if (!possibleValues.includes(possibleVauluesArray[j])) {
          isSingleScore = false;
          break;
        }
      }
      if (isSingleScore) {
        result[keys[i]] = possibleVauluesArray;
      }
    }
  }
  return result;
}

function _getNumericScore(score) {
  let filteredScore = score.replace("%", "");
  if (!isNaN(filteredScore)) {
    return parseInt(filteredScore);
  } else return -1;
}

function _getDetails(detailsArray) {
  let text = "";
  let real = -1;
  for (let i = 0; i < detailsArray.length; i++) {
    if (detailsArray[i]) {
      real++;
      let separator = real == 0 ? "" : "<br>";
      text += separator + detailsArray[i];
    }
  }
  return `<div id="details">${text}</div>`
}

function _getParamsHTML() {
  let result = {};
  let params = window.location.href.split('?')[1].split('&');
  for (let param of params) {
    let key = param.split('=')[0];
    let value = param.split('=')[1];
    result[key] = value;
  }
  return result;
}

function _getPlace(CITY, TYPE_TITLE, P_RESULT) {
  let result;
  let cities = P_RESULT[CITY];
  if (cities) {
    for (let i = 0; i < cities.length; i++) {
      if (cities[i]["titulo"] == TYPE_TITLE) {
        result = cities[i];
        break;
      }
    }
  }
  return result;
}

function _getHyperlinkItem(hyperlinkArray, index, item) {
  let result = "";
  if (hyperlinkArray && hyperlinkArray[item]) {
    let hyperlinkValue = hyperlinkArray[item][index];
    if (hyperlinkValue) {
      result = hyperlinkValue;
    }
  }
  return result;
}

function _getVideoEmbed(videoText, videoLink, name) {
  let result = "";
  if (videoText) {
    if (videoText.toLowerCase() == "youtube" || videoLink.includes("youtu.be/") || videoLink.includes("youtube.com")) {
      result = _getVideoEmbedYoutube(videoLink);
    } else if (videoText.toLowerCase() == "tiktok" || videoLink.includes("tiktok")) {
      result = _getVideoEmbedTikTok(videoLink, name);
    } else if (videoLink) {
      result = _getGenericLink(videoText, videoLink);
    }
  }
  return result;
}

function _getVideoEmbedYoutube(videoLink) {
  let videoID = "";
  if (videoLink && videoLink.includes("youtu.be/")) {
    videoID = videoLink.split("youtu.be/")[1].split("&")[0];
  } else if (videoLink && videoLink.includes("youtube.com")) {
    videoID = videoLink.split("v=")[1].split("&")[0];
  }
  if (videoID) {
    let url = `https://www.youtube.com/embed/${videoID}`;
    return _getIframe(url, "youtube");
  } else return "";
}

function _getVideoEmbedTikTok(videoLink, name) {
  let videoID = "";
  if (!videoLink.includes("vm.")) {
    try {
      videoID = videoLink.split("/video/")[1].split("?")[0];
    } catch (e) {
      _logger(ERROR, `Cannot get TikTok video ID from '${name}'`);
    }
  } else {
    _logger(ERROR, `Short TikTok videos are not supported. Please fix the link for '${name}'`);
  }
  if (videoID) {
    let url = `https://www.tiktok.com/embed/v3/${videoID}`;
    return _getIframe(url, "tiktok")
  } else return "";
}

function _getSpotifyEmbed(link) {
  let typeAndID = link.split("spotify.com/")[1].split("?")[0];
  return `<iframe class="spotify" style="border-radius:12px" src="https://open.spotify.com/embed/${typeAndID}?utm_source=generator" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
}

function _getIframe(url, iframeClass = "") {
  if (url) {
    let classItem = iframeClass ? `class="${iframeClass}"` : "";
    return `<br><iframe ${classItem} src="${url}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
  } else return "";
}

function _getGenericLink(videoText, videoLink) {
  return `<a href="${videoLink}">${videoText}</a>`;
}

function _getNameHyperlinkHTML(name, hyperlink) {
  if (hyperlink) {
    return `<a id="title" href="${name}" target="_blank">${name}</a>`
  } else return `<div id="title-no-link">${name}</div>`
}

// ======= SETTERS =======
function _openOrClosePlaceID(id) {
  $('#collapse' + id).collapse('toggle')
}

function _setInnerHTML(result) {
  let resultText = "";
  for (let i = 0; i < result.length; i++) {
    resultText += `
    <div id="accordion">
      <div class="card">
        <div id="headerP" onclick=_openOrClosePlaceID(${i})>
          <div class="card-header" id="heading${i}">
            <h5 class="mb-0">
                <button class="btn btn-link" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true"
                aria-controls="collapse${i}">
                ${result[i].nome + " " + result[i].nameEmojis}
                </button></h5>
            </div>
            <div style="background-color: ${result[i].cor};" class="score" id="score${i}">${result[i].nota}</div>
        </div>
        <div id="collapse${i}" class="collapse collapsed" aria-labelledby="heading${i}" data-parent="#accordion">
          <div class="card-body" id="pText${i}">
            ${_getNameHyperlinkHTML(result[i].nome, result[i].nameHyperlink)}
            <div class="subtitle">
              <div id="money">${result[i].valor}</div>
              ${result[i].detalhes}
              <br>
            </div>
            ${result[i].descricao}
            ${result[i].mediaHyperlink}
          </div>
        </div>
      </div>
    </div>`
  }
  document.getElementById("content").innerHTML = resultText;
  _adaptHeight();
}

// ======= FORMATTERS =======
function _codifyTitle(title) {
  return title.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s/g, "-").replace(/\//g, "-").toLowerCase();
}

function _AdaptNulls(text) {
  if (!text) {
    return "";
  } else {
    return text;
  }
}

function _adaptHeight() {
  let divsSize = document.getElementById("content").children.length;
  for (let i = 1; i <= divsSize; i++) {
    let score = document.getElementById("score" + i);
    let heading = document.getElementById("heading" + i);
    if ((score && heading) && (score.clientHeight != heading.clientHeight)) {
      score.style.height = heading.clientHeight + "px";
    }
  }
}

function _replace(text, index, what) {
  if (text && text[index]) {
    return what;
  } else return "";
}

// ======= CHECKER =======
function _isScore(allValues) {
  let scoreValues = ["!", "1", "2", "3", "4"];
  for (let i = 0; i < allValues.length; i++) {
    if (!scoreValues.includes(allValues[i])) {
      return false;
    }
  }
  return true;
}

function _newExists(P_NOVO) {
  let result = false;
  if (P_NOVO && P_NOVO.length > 0) {
    for (let line of P_NOVO) {
      if (line) {
        result = true;
        break;
      }
    }
  }
  return result;
}