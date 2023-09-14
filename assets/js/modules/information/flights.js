// ======= Flights JS =======

const AIRPORTS_JSON = _getJSON("assets/json/modules/information/airports.json");

// ======= LOADERS =======
function _loadFlightsModule() {
  let sobres = [];
  let reservas = [];
  for (let i = 1; i < SHEET_FLIGHTS.length; i++) {
    // if is not undefined
    if (SHEET_FLIGHTS[i] != undefined) {
      let result = {
        "title": SHEET_FLIGHTS[i][1],
        "text": ""
      }
      sobres.push(result);
      if (SHEET_FLIGHTS[i].length != 0) {
        let r_data = ""
        let r_info = "";
        let r_aeroporto = "";

        if (_hasValue(SHEET_FLIGHTS[i][0]) && _hasValue(SHEET_FLIGHTS[i][3]) && _hasValue(SHEET_FLIGHTS[i][4])) {
          r_data = `${SHEET_FLIGHTS[i][0]}, de ${SHEET_FLIGHTS[i][3]} até ${SHEET_FLIGHTS[i][4]}. `;
        } else if (_hasValue(SHEET_FLIGHTS[i][0])) {
          r_data = SHEET_FLIGHTS[i][0] + ". "
        }

        if (_hasValue(SHEET_FLIGHTS[i][5]) && _hasValue(SHEET_FLIGHTS[i][6])) {
          r_info = `${SHEET_FLIGHTS[i][5]}, #. `;
          reservas.push(SHEET_FLIGHTS[i][6]);
        } else if (_hasValue(SHEET_FLIGHTS[i][5])) {
          r_info = `${SHEET_FLIGHTS[i][5]}. `;
          reservas.push("");
        } else if (_hasValue(SHEET_FLIGHTS[i][6])) {
          r_info = `#. `;
          reservas.push(SHEET_FLIGHTS[i][6]);
        }

        if (_hasValue(SHEET_FLIGHTS[i][2])) {
          r_aeroporto = `${_getAirportString(SHEET_FLIGHTS[i][2])}.`;
        }

        sobres[i - 1].text = r_data + r_info + "<br>" + r_aeroporto;
      }
    }
  }
  _formatSubtitleAndReservation(reservas, sobres);
  document.getElementById("sobre").innerHTML = "<p>" + CONFIG.about.introText + "</p>";
  document.getElementById("flight-info1").innerHTML = "<strong>" + sobres[0].title + ":</strong><span>" + sobres[0].text + "</span>";
  document.getElementById("flight-info2").innerHTML = "<strong>" + sobres[1].title + ":</strong><span>" + sobres[1].text + "</span>";
  document.getElementById("flight-info3").innerHTML = "<strong>" + sobres[2].title + ":</strong><span>" + sobres[2].text + "</span>";
  document.getElementById("flight-info4").innerHTML = "<strong>" + sobres[3].title + ":</strong><span>" + sobres[3].text + "</span>";
  document.getElementById("flight-info5").innerHTML = "<strong>" + sobres[4].title + ":</strong><span>" + sobres[4].text + "</span>";
  document.getElementById("flight-info6").innerHTML = "<strong>" + sobres[5].title + ":</strong><span>" + sobres[5].text + "</span>";
}

// ======= GETTERS =======
function _getAirportString(codeString) {
  let codes = codeString.split(" → ");
  return "Saída em " + _getAirport(codes[0]) + " e chegada em " + _getAirport(codes[1]);
}

function _getAirport(code) {
  let keys = Object.keys(AIRPORTS_JSON);
  let result = code;
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] == code) {
      result = AIRPORTS_JSON[keys[i]];
    }
  }
  return result;
}

// ======= FORMATTERS =======
function _formatSubtitleAndReservation(reservas, sobres) {
  let isEqual = reservas.every((val, i, arr) => val === arr[0]);
  if (isEqual) {
    _ClearReservation(sobres);
    let voosSub = document.getElementById("voosSub");
    voosSub.innerHTML = "Reserva " + reservas[0];
  } else {
    _addReservation(reservas, sobres);
  }
}

function _ClearReservation(sobres) {
  for (let i = 0; i < sobres.length; i++) {
    if (sobres[i].text.includes(", #")) {
      sobres[i].text = sobres[i].text.replace(", #", "");
    } else if (sobres[i].text.includes("#")) {
      sobres[i].text = sobres[i].text.replace("#", "");
    }
  }
}

function _addReservation(reservas, sobres) {
  for (let i = 0; i < sobres.length; i++) {
    if (sobres[i].text.includes("#")) {
      sobres[i].text = sobres[i].text.replace("#", reservas[i]);
    }
  }
}