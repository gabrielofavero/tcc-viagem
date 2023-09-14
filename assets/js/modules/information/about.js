const TRANSPORTATION_JSON = _getJSON('assets/json/modules/information/transportation.json');

function _loadAboutModule(){
    document.getElementById("googleMaps").innerHTML = `<iframe id="googleMapsIframe" src="${CONFIG.about.googleMaps}" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`;
    document.getElementById("sobre").innerHTML = "<p>" + CONFIG.about.introText + "</p>";
    document.getElementById("sobre1").innerHTML = "<strong>Ida:</strong><span></span>";
    document.getElementById("sobre3").innerHTML = "<strong>Volta:</strong><span></span>";
    document.getElementById("sobre5").innerHTML = "<strong>Hospedagem:</strong><span> </span>";
    
    if (CONFIG.about.about6 != ""){
        document.getElementById("sobre6").innerHTML = CONFIG.about.about6;
    } else {
        document.getElementById("sobre6").style.display = "none";
        document.getElementById("sobre6Container").style.display = "none";
    }
}

function _loadAbout() {
    let datas = [];
    let dados = [];
    let currentDate = "";
    for (let i = 0; i < SHEET_DATA.length; i++) {
        if (_isExcelDate(SHEET_DATA[i][0])) {
            currentDate = _excelToExcelNoYear(_dateToExcel(_ExceltoDate(SHEET_DATA[i][0])));
        }
        if (SHEET_DATA[i][5] == "Ida/Volta") {
            datas.push(currentDate + ", " + SHEET_DATA[i][0]);
            dados.push(SHEET_DATA[i][4]);
        }
    }

    let adaptedText = {
        ida: TRANSPORTATION_JSON["defaultTransportation"]["ida"]["text"],
        volta: TRANSPORTATION_JSON["defaultTransportation"]["volta"]["text"]
    }

    if (MULTIPLE_FLIGHTS) {
        dados = _getMultiFlightToAbout(dados);
        adaptedText.ida = adaptedText.ida + "s ";
        adaptedText.volta = adaptedText.volta + "s ";
    } else {
        adaptedText.ida = adaptedText.ida + " ";
        adaptedText.volta = adaptedText.volta + " ";
    }

    document.getElementById("sobre1").innerHTML = "<strong>Ida:</strong><span>" + datas[0] + "</span>";
    document.getElementById("sobre2").innerHTML = "<strong>" + adaptedText.ida + " Ida:</strong><span>" + dados[0] + "</span>";
    document.getElementById("sobre3").innerHTML = "<strong>Volta:</strong><span>" + datas[datas.length - 1] + "</span>";
    document.getElementById("sobre4").innerHTML = "<strong>" + adaptedText.volta + " Volta:</strong><span>" + dados[dados.length - 1] + "</span>";
    document.getElementById("sobre5").innerHTML = "<strong>Hospedagem:</strong><span>" + STAY_TEXT + "</span>";
}

function _loadTransportationModule() {
    document.getElementById("sobre2").innerHTML = "<strong>" + TRANSPORTATION_JSON["defaultTransportation"]["ida"]["text"] + " Ida:</strong><span></span>";
    document.getElementById("sobre4").innerHTML = "<strong>" + TRANSPORTATION_JSON["defaultTransportation"]["volta"]["text"] + " Volta:</strong><span></span>";
}

function _loadTransportationFromData() {
    let mode = {
        current: "ida",
        ida: {
            mode: "ida",
            found: false,
            index: 0,
            max: MULTIPLE_FLIGHTS ? CONFIG.about.flights.toDestination.length : 1,
            result: {
                text: TRANSPORTATION_JSON["defaultTransportation"]["default"]["text"],
                icon: TRANSPORTATION_JSON["defaultTransportation"]["default"]["icon"]
            },
            multipleTexts: false
        },
        volta: {
            mode: "volta",
            found: false,
            index: 0,
            max: MULTIPLE_FLIGHTS ? CONFIG.about.flights.fromDestination.length : 1,
            result: {
                text: TRANSPORTATION_JSON["defaultTransportation"]["default"]["text"],
                icon: TRANSPORTATION_JSON["defaultTransportation"]["default"]["icon"]
            },
            multipleTexts: false
        }
    }

    for (let i = 0; i < SHEET_DATA.length; i++) { // Procura em cada linha do SHEET_DATA
        let currentMode = mode["current"];
        if (SHEET_DATA[i][5] == "Ida/Volta" && currentMode) {
            let search = _formatTxt(SHEET_DATA[i][3]) + " " + _formatTxt(SHEET_DATA[i][4]);
            for (let j = 0; j < TRANSPORTATION_JSON["texts"].length; j++) {
                let currentText = TRANSPORTATION_JSON["texts"][j];
                let currentIcon = TRANSPORTATION_JSON["icons"][j];

                let searchedtext = _formatTxt(TRANSPORTATION_JSON["texts"][j]);
                let altText = TRANSPORTATION_JSON["altTexts"][searchedtext];
                let foundInAltText = false;

                if (altText) {
                    for (let k = 0; k < altText.length; k++) {
                        if (search.includes(_formatTxt(altText[k]))) {
                            foundInAltText = true;
                            break;
                        }
                    }
                }
                if (search.includes(searchedtext) || foundInAltText) { // Se encontrado
                    if (mode[currentMode]["index"] > 0 && mode[currentMode]["text"] != currentText) { // Caso já tenha encontrado um texto diferente anteriormente
                        mode[currentMode]["multipleTexts"] = true;
                    } else {
                        mode[currentMode]["result"]["text"] = currentText;
                        mode[currentMode]["result"]["icon"] = currentIcon;
                    }
                }
                mode[currentMode]["index"]++;
                if (mode[currentMode]["index"] == mode[currentMode]["max"] || mode[currentMode]["multipleTexts"]) { // Se já encontrou todos os textos ou se encontrou textos diferentes 
                    mode[currentMode]["found"] = true;
                    mode["current"] = currentMode == "ida" ? "volta" : "";
                    break;
                }
            }
        }
    }

    if (!mode["ida"]["multipleTexts"] && mode["ida"]["found"]) {
        TRANSPORTATION_JSON["defaultTransportation"]["ida"]["text"] = mode["ida"]["result"]["text"];
        TRANSPORTATION_JSON["defaultTransportation"]["ida"]["icon"] = mode["ida"]["result"]["icon"];
    }
    if (!mode["volta"]["multipleTexts"] && mode["volta"]["found"]) {
        TRANSPORTATION_JSON["defaultTransportation"]["volta"]["text"] = mode["volta"]["result"]["text"];
        TRANSPORTATION_JSON["defaultTransportation"]["volta"]["icon"] = mode["volta"]["result"]["icon"];
    }
}

function _getMultiFlightToAbout(dados) {
    let newDados = [];
    let ida = "";
    let volta = "";

    for (let i = 0; i < CONFIG.about.flights.toDestination.length; i++) {
        let separator = i == 0 ? "" : " | ";
        let idaArray = ida.split(" | ");
        let skip = false;
        for (let j = 0; j < idaArray.length; j++) {
            if (idaArray[j] == dados[CONFIG.about.flights.toDestination[i]]) {
                skip = true;
                break;
            }
        }
        if (!skip) {
            ida += separator + dados[CONFIG.about.flights.toDestination[i]];
        }
    }

    for (let i = 0; i < CONFIG.about.flights.fromDestination.length; i++) {
        let separator = i == 0 ? "" : " | ";
        let voltaArray = volta.split(" | ");
        let skip = false;
        for (let j = 0; j < voltaArray.length; j++) {
            if (voltaArray[j] == dados[CONFIG.about.flights.fromDestination[i]]) {
                skip = true;
                break;
            }
        }
        if (!skip) {
            volta += separator + dados[CONFIG.about.flights.fromDestination[i]];
        }
    }
    newDados.push(ida);
    newDados.push(volta);

    return newDados;
}