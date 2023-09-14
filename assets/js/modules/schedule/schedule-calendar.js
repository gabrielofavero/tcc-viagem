// ======= Schedule Calendar JS =======

var PROG_IS_HIDDEN = true;
var PROG_CURRENT_DAY = 0;
var PROG_CURRENT_MONTH = 0;
var SHEET_PLACES_BY_DATE;
var SHEET_SCHEDULE = [];

// ======= LOADERS =======
function _loadScheduleCalendar() {
    let result = [];
    let currentResult = "";
    let currentTime = "";

    for (let i = 0; i < SHEET_SCHEDULE.length; i++) {
        if (_isScheduleCalendarHeader(SHEET_SCHEDULE[i])) {

            if (currentResult != "") {
                result.push(currentResult);
            }

            currentResult = {
                "Title": SHEET_SCHEDULE[i][0],
                "Manhã": {
                    "Programação": [],
                    "TransportePublico": [],
                    "TransportePrivado": []
                },
                "Tarde": {
                    "Programação": [],
                    "TransportePublico": [],
                    "TransportePrivado": []
                },
                "Noite": {
                    "Programação": [],
                    "TransportePublico": [],
                    "TransportePrivado": []
                },
                "Total": []
            }

            currentTime = "";
        } else {
            let skip;
            switch (SHEET_SCHEDULE[i][0]) {
                case "":
                    skip = false;
                    break;
                case undefined:
                    skip = false;
                    break;
                case "Total":
                    skip = true;
                    currentResult["Total"] = [SHEET_SCHEDULE[i][2], SHEET_SCHEDULE[i][3]];
                    break;
                case "Horário":
                    skip = true;
                    break;
                default:
                    skip = false;
                    currentTime = SHEET_SCHEDULE[i][0];
            }
            if (!skip && SHEET_SCHEDULE[i][1] != "") {
                currentResult[currentTime]["Programação"].push(_returnIfNotUndefined(SHEET_SCHEDULE[i][1]));
                currentResult[currentTime]["TransportePublico"].push(_returnIfNotUndefined(SHEET_SCHEDULE[i][2]));
                currentResult[currentTime]["TransportePrivado"].push(_returnIfNotUndefined(SHEET_SCHEDULE[i][3]));
            }
        }
    }
    if (currentResult != "") {
        result.push(currentResult);
    }
    SHEET_PLACES_BY_DATE = result;
}

function _loadModalContentCalendar(prog) {
    let title = document.getElementById("progTitle");
    let manha = document.getElementById("pc1");
    let tarde = document.getElementById("pc2");
    let noite = document.getElementById("pc3");

    manha.innerHTML = "";
    tarde.innerHTML = "";
    noite.innerHTML = "";

    title.innerHTML = prog["Title"];

    _setModalCalendarInnerHTML(manha, prog["Manhã"]);
    _setModalCalendarInnerHTML(tarde, prog["Tarde"]);
    _setModalCalendarInnerHTML(noite, prog["Noite"]);

    _adaptModalCalendarInnerHTML(manha, tarde, noite);
}

// ======= MODAL =======
function _openModalCalendar(prog) {
    _loadModalContentCalendar(prog);
    $("#prog").show()
    setTimeout(() => {
        document.getElementById("prog").classList.toggle('show')
    }, 100);

}

function _closeModalCalendar() {
    PROG_IS_HIDDEN = true;
    document.getElementById("prog").classList.toggle('show')
    setTimeout(() => {
        $("#prog").hide()
    }, 300);

}

function _reloadModalCalendar(prog) {
    document.getElementById("progContent").classList.toggle('show');
    setTimeout(() => {
        _loadModalContentCalendar(prog);
        document.getElementById("progContent").classList.toggle('show');
    }, 300);
}


// ======= GETTERS =======
function _getScheduleCalendarByDate(stringDayMonth) {
    let day = parseInt(stringDayMonth.split("/")[0]);
    let month = parseInt(stringDayMonth.split("/")[1]);

    if (day == PROG_CURRENT_DAY && month == PROG_CURRENT_MONTH) {
        PROG_CURRENT_DAY = 0;
        PROG_CURRENT_MONTH = 0;
        if (day != 0) {
            _closeModalCalendar();
        }
    } else {
        PROG_CURRENT_DAY = day;
        PROG_CURRENT_MONTH = month;
        if (day != 0) {
            for (let i = 0; i < SHEET_PLACES_BY_DATE.length; i++) {
                let date = _titleToDateObject(SHEET_PLACES_BY_DATE[i]["Title"]);
                if (date["day"] == day && date["month"] == month) {
                    if (PROG_IS_HIDDEN) {
                        PROG_IS_HIDDEN = false;
                        _openModalCalendar(SHEET_PLACES_BY_DATE[i]);
                    } else {
                        _reloadModalCalendar(SHEET_PLACES_BY_DATE[i]);
                    }
                    break;
                }
            }
        }
    }
}

// ======= SETTERS =======
function _setModalCalendarInnerHTML(element, prog) {
    for (let i = 0; i < prog["Programação"].length; i++) {
        if (prog["Programação"][i] != "" && prog["Programação"][i] != "-") {
            let value = "";
            if ((prog["TransportePublico"][i] != "" && prog["TransportePublico"][i] != 0) && (prog["TransportePrivado"][i] != "" && prog["TransportePrivado"][i] != 0)) {
                value = ` <b>($${prog["TransportePublico"][i]} 🚌, $${prog["TransportePrivado"][i]} 🚗)</b>`;
            } else if (prog["TransportePublico"][i] != "" && prog["TransportePublico"][i] != 0) {
                value = ` <b>($${prog["TransportePublico"][i]} 🚌)</b>`;
            } else if (prog["TransportePrivado"][i] != "" && prog["TransportePrivado"][i] != 0) {
                value = ` <b>($${prog["TransportePrivado"][i]} 🚗)</b>`;
            }
            element.innerHTML += `<li>${prog["Programação"][i]}${value}</li>`;
        }
    }
}

// ======= CHECKERS =======
function _isScheduleCalendarHeader(array) {
    let result = false;
    if (array.length == 1) {
        let value = array[0];
        let div1 = value.split(":");
        let div2 = [];
        try {
            div2 = div1[1].split(",");
        } catch (error) { }
        if (div1.length == 2 && div2.length == 2) {
            result = true;
        }
    }
    return result;
}

// ======= CONVERTERS =======
function _returnIfNotUndefined(value) {
    if (value != undefined) {
        return value;
    } else return "";
}

function _titleToDateObject(title) {
    let month;
    let result = {
        "day": 0,
        "month": 0
    };
    let div1 = title.split(", ")[1].split(" de ");

    switch (div1[1]) {
        case "Janeiro":
            month = 1;
            break;
        case "Fevereiro":
            month = 2;
            break;
        case "Março":
            month = 3;
            break;
        case "Abril":
            month = 4;
            break;
        case "Maio":
            month = 5;
            break;
        case "Junho":
            month = 6;
            break;
        case "Julho":
            month = 7;
            break;
        case "Agosto":
            month = 8;
            break;
        case "Setembro":
            month = 9;
            break;
        case "Outubro":
            month = 10;
            break;
        case "Novembro":
            month = 11;
            break;
        case "Dezembro":
            month = 12;
    }

    result["day"] = div1[0];
    result["month"] = month;

    return result;
}

function _adaptModalCalendarInnerHTML(manha, tarde, noite) {
    let innerM = manha.innerHTML;
    let innerT = tarde.innerHTML;
    let innerN = noite.innerHTML;

    if (innerM && innerT && innerN) {
        document.getElementById("progHorarioM").style.display = "block";
        document.getElementById("progHorarioT").style.display = "block";
        document.getElementById("progHorarioN").style.display = "block";
        document.getElementById("progNoData").style.display = "none";
    } else {
        if (innerM) {
            document.getElementById("progHorarioM").style.display = "block";
            document.getElementById("progNoData").style.display = "none";
        } else {
            document.getElementById("progHorarioM").style.display = "none";
        }
        if (innerT) {
            document.getElementById("progHorarioT").style.display = "block";
            document.getElementById("progNoData").style.display = "none";
        } else {
            document.getElementById("progHorarioT").style.display = "none";
        }
        if (innerN) {
            document.getElementById("progHorarioN").style.display = "block";
            document.getElementById("progNoData").style.display = "none";
        } else {
            document.getElementById("progHorarioN").style.display = "none";
        }
        if (!innerM && !innerT && !innerN) {
            document.getElementById("progNoData").style.display = "block";
        }
    }
}