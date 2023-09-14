// ======= Date JS =======

// ======= GETTERS =======
function _getDaysBetweenDates(startDate, endDate) {
    let date1 = new Date(startDate);
    let date2 = new Date(endDate);
    let timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil((timeDiff / (1000 * 3600 * 24)) + 1);
}

function _getWeekDay(excelDate) {
    return excelDate.split(",")[0];
}

function _getArraybyDate(excelTime) {
    let found = false;
    let result = [];

    for (let i = 0; i < SHEET_DATA.length; i++) {
        if (!found) {
            if (SHEET_DATA[i][0] == excelTime.toLowerCase()) {
                found = true;
            }
        } else {
            if (!_isExcelDate(SHEET_DATA[i][0])) {
                result.push(SHEET_DATA[i]);
            } else {
                break;
            }
        }
    }
    return result;
}

function _getNewDay(daysFromInicio) {
    let newDate = _dateStringToDate(CONFIG.start.split(" ")[0])
    newDate.setDate(newDate.getDate() + daysFromInicio);
    return newDate;
}

function _dateStringToDate(dateString) {
    const dateTimeSplit = dateString.split(" ");
    let timeString = "";

    if (dateTimeSplit.length > 1) {
        timeString = " " + dateTimeSplit[1];
    }

    const day = dateTimeSplit[0].split("/")[0];
    const month = dateTimeSplit[0].split("/")[1];
    const year = dateTimeSplit[0].split("/")[2];

    const dateStringConverted = month + "/" + day + "/" + year;

    return new Date(dateStringConverted + timeString);
}

function _getCurrentHour() {
    let now = new Date();
    return now.getHours();
}

function _getDateString(date) {
    // DD/MM/YYYY
    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    let year = date.getFullYear().toString();

    if (day.length == 1) {
        day = "0" + day;
    }
    if (month.length == 1) {
        month = "0" + month;
    }

    return day + "/" + month + "/" + year;
}

function _getTimeString(date) {
    // HH:MM
    let hours = date.getHours();
    let minutes = date.getMinutes();
    return _adaptTime(hours) + ":" + _adaptTime(minutes);
}

// ======= CONVERTERS =======
function _dateToExcel(date, toLowerCase = false) {
    let now = new Date(date);
    let day = now.getDate();
    let month = now.getMonth() + 1;
    let year = now.getFullYear();
    let dayOfWeek = now.getDay();
    let result;

    switch (dayOfWeek) {
        case 0:
            dayOfWeek = "Domingo";
            break;
        case 1:
            dayOfWeek = "Segunda-Feira";
            break;
        case 2:
            dayOfWeek = "Terça-Feira";
            break;
        case 3:
            dayOfWeek = "Quarta-Feira";
            break;
        case 4:
            dayOfWeek = "Quinta-Feira";
            break;
        case 5:
            dayOfWeek = "Sexta-Feira";
            break;
        case 6:
            dayOfWeek = "Sábado";
    }
    switch (month) {
        case 1:
            month = "Janeiro";
            break;
        case 2:
            month = "Fevereiro";
            break;
        case 3:
            month = "Março";
            break;
        case 4:
            month = "Abril";
            break;
        case 5:
            month = "Maio";
            break;
        case 6:
            month = "Junho";
            break;
        case 7:
            month = "Julho";
            break;
        case 8:
            month = "Agosto";
            break;
        case 9:
            month = "Setembro";
            break;
        case 10:
            month = "Outubro";
            break;
        case 11:
            month = "Novembro";
            break;
        case 12:
            month = "Dezembro";
    }
    result = dayOfWeek + ", " + day + " de " + month + " de " + year;
    if (toLowerCase) {
        result = result.toLowerCase();
    }
    return result;
}

function _ExceltoDate(excelDate) {
    let date = excelDate.split(",")[1].split(" de ");
    let day = date[0];
    let month;
    let year = date[2];
    switch (date[1].toLowerCase()) {
        case "janeiro":
            month = "01";
            break;
        case "fevereiro":
            month = "02";
            break;
        case "março":
            month = "03";
            break;
        case "abril":
            month = "04";
            break;
        case "maio":
            month = "05";
            break;
        case "junho":
            month = "06";
            break;
        case "julho":
            month = "07";
            break;
        case "agosto":
            month = "08";
            break;
        case "setembro":
            month = "09";
            break;
        case "outubro":
            month = "10";
            break;
        case "novembro":
            month = "11";
            break;
        case "dezembro":
            month = "12";
    }
    return new Date(year, month - 1, day);
}

function _timeStringtoObject(timeString) {
    let time = timeString.split(":");
    return {
        hours: parseInt(time[0]),
        minutes: parseInt(time[1])
    }
}

function _excelToExcelNoYear(excelDate) {
    excelDate = excelDate.split(" de ");
    return excelDate[0] + " de " + excelDate[1];
}

function _adaptTime(time) {
    let result = time;
    if (time.length == 4) {
        result = "0" + time;
    }
    return result;
}

function _hourtoTime(hour) {
    let result = hour.toString();
    if (hour < 10) {
        result = "0" + result;
    }
    return result + ":00";
}

function _dateToDateString(date) {
    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    let year = date.getFullYear().toString();

    if (day.length == 1) {
        day = "0" + day;
    }
    if (month.length == 1) {
        month = "0" + month;
    }
    return day + "/" + month + "/" + year
}

function _dateToShortDateString(date) { // Recebe uma data 'Date' e retorna uma data 'String' sem o ano
    let fullDate = _dateToDateString(date);
    return fullDate.split("/")[0] + "/" + fullDate.split("/")[1];
}

// ======= CHECKERS =======
function _isExcelDate(excelString) {
    if (excelString == undefined) {
        return false;
    } else if (excelString.split(",").length == 2 && excelString.split(",")[1].split(" de ").length == 3) {
        return true;
    } else {
        return false;
    }
}

function _isExcelTime(timeString) {
    if (timeString == undefined) {
        return false;
    } else {
        let time = timeString.split(":");
        let hour = parseInt(time[0]);
        let minute = parseInt(time[1]);
        if (time.length == 2 && !isNaN(hour) && !isNaN(minute)) {
            return true;
        } else {
            return false;
        }
    }
}

function _isDateString(dateString) {
    // 'DD/MM/YYYY'
    let result = false;
    try {
        if (dateString != undefined) {
            let date = dateString.split("/");
            let day = parseInt(date[0]);
            let month = parseInt(date[1]);
            let year = parseInt(date[2]);
            if (date.length == 3 && !isNaN(day) && !isNaN(month) && !isNaN(year)) {
                result = true;
            }
        }
    } catch (error) {
        result = false;
    }
    return result;
}