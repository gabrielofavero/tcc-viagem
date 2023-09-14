// ======= Costs JS =======

const COSTS = _getJSON("assets/json/modules/information/costs.json");

// ======= LOADERS =======
function _loadCostModule() {
    let dado1 = _removeComma(SHEET_TOTAL);
    let dado2 = _removeComma(_getFromArray("valor", "passagem", SHEET_COSTS));
    let dado3 = _removeComma(_getFromArray("valor", "hospedagem", SHEET_COSTS));
    let dado4 = _removeComma(_getFromArray("valor", "dia-a-dia", SHEET_PREDICTIONS));

    // Total
    document.getElementById("gDado1").innerHTML = `
        <i class="${COSTS[0].icone}"></i>
        <span>${COSTS[0].texto || dado1}</span>
        <p>${COSTS[0].titulo}</p>`;

    // Passagem
    document.getElementById("gDado2").innerHTML = `
        <i class="${COSTS[1].icone}"></i>
        <span>${COSTS[1].texto || dado2}</span>
        <p>${COSTS[1].titulo}</p>`;

    // Hospedagem
    document.getElementById("gDado3").innerHTML = `
        <i class="${COSTS[2].icone}"></i>
        <span>${COSTS[2].texto || dado3}</span>
        <p>${COSTS[2].titulo}</p>`;

    // Dia-A-Dia
    document.getElementById("gDado4").innerHTML = `
        <i class="${COSTS[3].icone}"></i>
        <span>${COSTS[3].texto || dado4}</span>
        <p>${COSTS[3].titulo}</p>`
}