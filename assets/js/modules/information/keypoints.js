// ======= Keypoints JS =======

const KEYPOINTS = _getJSON("assets/json/modules/information/keypoints.json");

function _loadKeypointsStandAlone() {
  let DADO4;
  switch (KEYPOINTS[3].titulo) {
    case "Valor Previsto":
      DADO4 = _removeComma(SHEET_TOTAL);
      break;
    case "Dia-A-Dia":
      DADO4 = _removeComma(SHEET_DAY_TO_DAY[6][2]);
  }

  // Dado 1
  document.getElementById("dado1").innerHTML = `
  <i class="${KEYPOINTS[0].icone}"></i>
  <span>${KEYPOINTS[0].texto}</span>
  <p>${KEYPOINTS[0].titulo}</p>`;

  // Dado 2
  document.getElementById("dado2").innerHTML = `
  <i class="${KEYPOINTS[1].icone}"></i>
  <span>${KEYPOINTS[1].texto}</span>
  <p>${KEYPOINTS[1].titulo}</p>`;

  // Dado 3
  document.getElementById("dado3").innerHTML = `
  <i class="${KEYPOINTS[2].icone}"></i>
  <span>${KEYPOINTS[2].texto}</span>
  <p>${KEYPOINTS[2].titulo}</p>`;

  // Dado 4
  document.getElementById("dado4").innerHTML = `
  <i class="${KEYPOINTS[3].icone}"></i>
  <span>${DADO4 || KEYPOINTS[3].texto}</span>
  <p>${KEYPOINTS[3].titulo}</p>`
}

function _loadKeypointsIntegrated() {

  for (let i = 0; i < KEYPOINTS_JSON.length; i++) {
      document.getElementById(`dado${i+1}`).innerHTML = _getKeypoint(KEYPOINTS_JSON[i]);
  }

  // Auto Generated
  _loadTransportationFromData();

  // Data Update
  KEYPOINTS_JSON[1].titulo = TRANSPORTATION_JSON["defaultTransportation"]["default"]["text"];
  KEYPOINTS_JSON[1].icone = TRANSPORTATION_JSON["defaultTransportation"]["default"]["icon"];
  document.getElementById("sobre2").innerHTML = "<strong>" + TRANSPORTATION_JSON["defaultTransportation"]["ida"]["text"] + " Ida:</strong><span></span>";
  document.getElementById("sobre4").innerHTML = "<strong>" + TRANSPORTATION_JSON["defaultTransportation"]["volta"]["text"] + " Volta:</strong><span></span>";
}

function _getKeypoint(dado) {
  let titulo = dado.titulo || "Não Definido";
  let icone = dado.icone || "bx question-mark";
  let texto = dado.texto || "-";

  switch (dado.titulo) {
      case "Gastos Durante a Viagem":
      case "Gastos na Viagem":
          // Ajustes
          let valor = COST_DURING_TRIP;
          if (ADJUSTMENTS["Total"] || ADJUSTMENTS["Ambos"]) {
              valor = ADJUSTED_COST_DURING_TRIP;
          }
          texto = (texto != "-") ? texto : `${CURRENCY} ` + _addDotSeparator(Math.round(valor));
          break;
      case "Ida e Volta":
          texto = (texto != "-") ? texto : `${CURRENCY} ` + _addDotSeparator(Math.round(TRANSPORTATION_COST));
          break;
      case "Hospedagem":
          texto = (texto != "-") ? texto : `${CURRENCY} ` + _addDotSeparator(Math.round(STAY_COST));
          break;
      case "Dia-a-Dia":
          texto = (texto != "-") ? texto : `${CURRENCY} ` + _addDotSeparator(Math.round(DAY_TO_DAY_COST) * NUMBER_OF_PEOPLE);
          break;
      case "Dia-a-Dia (Individual)":
          texto = (texto != "-") ? texto : `${CURRENCY} ` + _addDotSeparator(Math.round(DAY_TO_DAY_COST));
          break;
      case "Ingresso":
          texto = (texto != "-") ? texto : `${CURRENCY} ` + _addDotSeparator(Math.round(TICKET_COST));
          break;
      case "Ingressos":
          texto = (texto != "-") ? texto : `${CURRENCY} ` + _addDotSeparator(Math.round(TICKET_COST) * NUMBER_OF_PEOPLE);
          break;
      case "Gastos Prévios":
          texto = (texto != "-") ? texto : `${CURRENCY} ` + _addDotSeparator(Math.round(PREVIOUS_COST));
          break;
      case "Gasto Total":
      case "Total":
          texto = (texto != "-") ? texto : `${CURRENCY} ` + _addDotSeparator(Math.round(TOTAL_COST));
          break;
  }
  return `<i class="${icone}"></i>
  <span>${texto}</span>
  <p>${titulo}</p>`;
}