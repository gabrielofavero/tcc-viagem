// ======= Places JS =======

var P_RESULT = {};
var PLACES_FILTERED_SIZE;
const CURRENCY = CONFIG.currency;
var CURRENT_PLACES_SIZE = 0;

const CITIES_INDEX = _getJSON("assets/json/modules/places/cities.json");
const CURRENCY_JSON = _getJSON("assets/json/modules/places/currency.json");
const PLACES_JSON = _getJSON("assets/json/modules/places/places.json");
const PLACES_SETTINGS_JSON = _getJSON("assets/json/modules/places/settings.json");
const PLACES_BOXES_JSON = _getJSON("assets/json/modules/places/boxes.json");

// ======= LOADERS =======
function _loadPlaces() {
  let keys = Object.keys(SHEET_PLACES);

  for (let key of keys) {
    let titleIndex = -1;
    let spk = SHEET_PLACES[key];
    for (let i = 0; i < spk.length; i++) {
      if (spk[i][0] != "" && spk[i][1] != undefined) {
        titleIndex++;

        if (!P_RESULT[key]) {
          P_RESULT[key] = [];
        }

        P_RESULT[key].push({
          titulo: spk[i][0],
        });
      }
      if (spk[i][1]) {
        P_RESULT[key][titleIndex][_translateHeader(spk[i][1])] = _getHeaderData(spk[i]);
      }
    }
  }

  if (_validatePlaces()) {
    _adaptPlaces();
    _getPResult();
  }
  window.addEventListener("resize", function () {
    _adjustPlacesHTML();
  });
}

function _loadPlacesSelect() {
  let select = document.getElementById("places-select");
  let firstOption = document.createElement("option");
  const cities = CONFIG.places.cities;

  firstOption.value = cities[0].code;
  firstOption.text = cities[0].name;
  select.add(firstOption);
  firstOption.selected = true;

  if (cities.length > 1) {
    for (let i = 1; i < cities.length; i++) {
      let newOption = document.createElement("option");
      newOption.value = cities[i].code;
      newOption.text = cities[i].name;
      select.add(newOption);
    };
  } else {
    select.style.display = "none";
  };

  select.addEventListener("change", function () {
    _loadPlacesHTML(select.value);
    _adjustPlacesHTML();
  });
}

function _loadPlacesHTML(city) {
  let div = document.getElementById("passeiosBox");
  let text = "";

  const headers = city.headers;
  CURRENT_PLACES_SIZE = headers.length;

  let linktype = _getLinkType();

  for (let i = 0; i < headers.length; i++) {
    const j = i + 1;
    const box = PLACES_BOXES_JSON[_getPlacesBoxesIndex(i)];
    const title = PLACES_JSON[headers[i]]["title"];
    const code = headers[i];
    const href = code === "map" ? city.myMaps : "#";
    const lt = code === "map" ? linktype : "";
    const onclick = code === "map" ? "" : `onclick="openLightbox('${_getPlacesHref(code)}')"`;
    const icon = PLACES_JSON[headers[i]]["icon"];
    const description = PLACES_JSON[headers[i]]["description"];
    text += `
    <div class="col-lg-4 col-md-6 d-flex align-items-stretch" data-aos="zoom-in" data-aos-delay="100" id="b${j}">
    <a href="${href}" ${lt} ${onclick} id="ba${j}">
        <div class="icon-box iconbox-${box.color}" id="ib${j}">
          <div class="icon">
            <svg width="100" height="100" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
              <path stroke="none" stroke-width="0" fill="#f5f5f5" d="${box.d}"></path>
            </svg>
            <i class="${icon}"></i>
          </div>
          <div id="b${j}t"><h4>${title}</h4></div>
          <div id="b${j}d"><p>${description}</p></div>
        </div>
      </a>
    </div>`;
  }

  div.innerHTML = text;
  _adjustPlacesHTML();
}

// ======= GETTERS =======
function _getPResult() {
  let keys = Object.keys(P_RESULT);
  for (let key of keys) {
    if (P_RESULT[key] && P_HYPERLINK[key]) {
      let p_lenght = P_RESULT[key].length;
      let n_lenght = P_HYPERLINK[key]["name"].length;
      let i_lenght = P_HYPERLINK[key]["insta"].length;
      let v_lenght = P_HYPERLINK[key]["video"].length;
      if (p_lenght == n_lenght && p_lenght == i_lenght && p_lenght == v_lenght) {
        for (let i = 0; i < P_RESULT[key].length; i++) {
          P_RESULT[key][i].hyperlink = {};
          P_RESULT[key][i].hyperlink.name = P_HYPERLINK[key]["name"][i];
          P_RESULT[key][i].hyperlink.insta = P_HYPERLINK[key]["insta"][i];
          P_RESULT[key][i].hyperlink.video = P_HYPERLINK[key]["video"][i];
        }
      } else {
        let lenghtObj = {
          "P_RESULT": p_lenght,
          "P_HYPERLINK": {
            "name": n_lenght,
            "insta": i_lenght,
            "video": v_lenght
          }
        }
        _logger(ERROR, "It is not possible to save the hyperlinks for '" + key + "'. The number of parameters of P_RESULT and P_HYPERLINK are not equal: ")
        console.log(lenghtObj);
      }
    }
  }
  _exportPlacesVariables();
}

function _getHeaderData(data) {
  let result = [];
  for (let i = 2; i < data.length; i++) {
    result.push(data[i]);
  }
  return result;
}

function getPlacesSelectValue() {
  let select = document.getElementById("places-select");
  return select.value || CONFIG.places.cities[0].code;
}

function _getPlacesBoxesIndex(i) {
  if (i > PLACES_BOXES_JSON.length - 1) {
    return i % PLACES_BOXES_JSON.length;
  } else return i
}

function _getLinkType() {
  if (_isIOSDevice()) {
    return "";
  } else {
    return "target='_blank'";
  }
}

function _getPlacesHref(code) {
  if (code == "map") {
    return MY_MAPS;
  } else return `places.html?city=${getPlacesSelectValue()}&type=${code}`;
}


// ======= SETTERS =======
function _exportPlacesVariables() {
  window.localStorage.setItem('P_RESULT', JSON.stringify(P_RESULT));
  window.localStorage.setItem('CURRENCY', CURRENCY);
}

function _setPlacesURL(city) {
  let passeiosBox = document.getElementById("passeiosBox");
  for (let i = 0; i < passeiosBox.children.length; i++) {
    let linkDiv = document.getElementById(`ba${i + 1}`);
    let link = linkDiv.href;
    let linkSplit = link.split("?");
    let url = linkSplit[0];
    let params = linkSplit[1];
    let otherParams = params.split("&");
    let newParams = `city=${city}`;
    for (let j = 1; j < otherParams.length; j++) {
      newParams += `&${otherParams[j]}`;
    }
    link = url + "?" + newParams;
    linkDiv.href = link;
  }
}

function _adjustPlacesHTML() {
  let heights = [];
  let maxHeight = 0;

  for (let i = 1; i <= CURRENT_PLACES_SIZE; i++) {
    let height = document.getElementById(`b${i}d`).offsetHeight;
    if (height > maxHeight) {
      maxHeight = height;
    }
    heights.push(height);
  }

  for (let i = 1; i <= CURRENT_PLACES_SIZE; i++) {
    document.getElementById(`b${i}d`).style.height = `${maxHeight}px`;
  }
}

// ======= CONVERTERS =======
function _adaptPlaces() {
  for (let i = 0; i < P_RESULT.length; i++) {
    for (let j = 0; j < P_RESULT[i].nome.length; j++) {
      if (P_RESULT[i].nota[j] == "-100%") {
        P_RESULT[i].nota[j] = "";
      }
      if (P_RESULT[i].visitado && P_RESULT[i].visitado[j] == undefined) {
        P_RESULT[i].visitado[j] = "";
      }
    }
    if (P_RESULT[i].nota.length > P_RESULT[i].nome.length) {
      P_RESULT[i].nota.splice(P_RESULT[i].nome.length, P_RESULT[i].nota.length - P_RESULT[i].nome.length);
    }
  }
}

function _translateHeader(header) {
  // $ -> Value  
  let result = _formatTxt(header);

  for (let key in PLACES_SETTINGS_JSON["translations"]) {
    if (header == PLACES_SETTINGS_JSON["translations"][key]) {
      result = key;
      break;
    }
  }

  return result;
}

// ======= CHECKERS =======
function _validatePlaces() {
  let required = PLACES_SETTINGS_JSON["required"];
  for (let i = 0; i < P_RESULT.length; i++) {
    let titulo = P_RESULT[i].titulo;
    let keys = Object.keys(P_RESULT[i]);
    let exists = false;
    for (let j = 0; j < required.length; j++) {
      if (keys.includes(_formatTxt(required[j]))) {
        exists = true;
        break;
      }
    }
    if (!exists) {
      _logger(ERROR, `${titulo} does not contain the required parameters`);
      return false;
    }
  }
  return true;

}

function _areRequiredParamsPresent(text) {
  let required = PLACES_SETTINGS_JSON["required"];
  return required.indexOf(text) > -1;
}
