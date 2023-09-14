// ======= Schedule List JS =======

// ======= LOADERS =======
function _loadScheduleList() { // Carrega a programação completa
    let div = document.getElementById("programacao");
    let dateIndex = new Date(START_DATE);

    for (let i = 1; dateIndex.getTime() <= END_DATE.getTime(); i++) {
        let shortDate = _dateToShortDateString(dateIndex);
        let excelDate = _dateToExcel(dateIndex);
        let weekDay = _getWeekDay(excelDate);

        let programacaoByDate = _getScheduleListByDate(dateIndex);
        let programs = programacaoByDate.programs;
        let sum = programacaoByDate.sum.toFixed(2);;
        let innerText = "";

        for (let j = 0; j < programs.length; j++) {
            let title = programs[j].title;
            let timeSum = (programs[j].sum).toFixed(2);
            let text = programs[j].programs.join("");
            innerText += `
            <div class="resume-item">
                <h4>${title}</h4>
                <h5>Total: ${CURRENCY}${Math.round(timeSum)}</h5>
                ${text}
            </div>`;
        }

        // _logger(INFO, `Valor ${weekDay} (${shortDate}): ${CURRENCY} ${sum.toString().replace(".",",")}`);
        div.innerHTML = div.innerHTML + `
        <div class="col-lg-6" id="progDia">
        <h3 class="resume-title">${weekDay} (${shortDate})</h3>
        ${innerText}
        </div>`;
        dateIndex = _getNewDay(i);
    }
}

// ======= GETTERS =======
function _getScheduleListByDate(date) {
    let arrayByDate = _getArraybyDate(_dateToExcel(date));
    let result = {
        programs: [],
        sum: 0
    };
    let timeOfDay = TIME_OF_DAY;
    let dataIndex = 0;
    let nextProgram = [];

    for (let i = 0; i < timeOfDay.length; i++) {
        let timeObject = {
            title: timeOfDay[i].title,
            programs: [],
            sum: 0
        };
        let start = timeOfDay[i].start;
        let end = timeOfDay[i].end;
        let programs = [];
        let internalSum = 0;

        if (nextProgram.length > 0) {
            programs = programs.concat(nextProgram);
            nextProgram = [];
        }

        for (dataIndex; dataIndex < arrayByDate.length; dataIndex++) {
            let startTime;
            let endTime;
            let startSplit = [];
            let startHour;
            let endHour;

            if (arrayByDate && arrayByDate[dataIndex]) {
                startTime = arrayByDate[dataIndex][PROG_INDEX["startTime"]];
                endTime = arrayByDate[dataIndex][PROG_INDEX["endTime"]];
                if (startTime) {
                    startSplit = startTime.split(":");
                }
            }



            if (startSplit.length > 1) {
                startHour = parseInt(startSplit[PROG_INDEX["startTime"]]);
                endHour = parseInt(arrayByDate[dataIndex][PROG_INDEX["endTime"]].split(":")[PROG_INDEX["startTime"]]);
                if (endHour == 0) {
                    endHour = 24;
                }
                let description = _adaptProgramTitle(arrayByDate[dataIndex]);
                let text;

                if (startTime && endTime && startHour >= start && startHour < end) {
                    let valor = _moneyToFloat(arrayByDate[dataIndex][PROG_INDEX["price"]])

                    if (endHour > end) {
                        let nextStart;
                        let nextText;

                        if (timeOfDay[i + 1]) {
                            nextStart = _hourtoTime(timeOfDay[i + 1].start);
                        } else {
                            nextEnd = _adaptTime(arrayByDate[dataIndex][PROG_INDEX["startTime"]])
                        }
                        text = `<li>${description.start}<strong>${_adaptTime(arrayByDate[dataIndex][PROG_INDEX["startTime"]])} - ${_hourtoTime(end)}:</strong> ${description.text}${description.end}</li>`;
                        nextText = `<li>${description.start}<strong>${nextStart} - ${_adaptTime(arrayByDate[dataIndex][PROG_INDEX["endTime"]])}:</strong> ${description.text}${description.end}</li>`;
                        nextProgram.push(nextText);
                    } else {
                        text = `<li>${description.start}<strong>${arrayByDate[dataIndex][PROG_INDEX["startTime"]]} - ${_adaptTime(arrayByDate[dataIndex][PROG_INDEX["endTime"]])}:</strong> ${description.text}${description.end}</li>`;
                    }

                    programs.push(text);
                    result.sum += valor;
                    internalSum += valor;

                    _adaptCostsDuringTrip(arrayByDate[i][PROG_INDEX["type"]], valor);
                } else {
                    break;
                }
            }
        };
        if (programs.length > 0) {
            timeObject.programs = programs;
            timeObject.sum = internalSum;
            result.programs.push(timeObject);
            result.sum += internalSum;
        };

    };
    return result;
}

// ======= CONVERTERS =======

function _adaptScheduleData(data, internalCase = "") {
    let result = "";

    for (let substitution of PROG_TEXT_SUBSTITUTIONS) {
        let inputs = Object.keys(substitution["input"]);
        let output = substitution["output"];
        let externalCases = substitution["cases"];
        let match = true;

        if (!externalCases || externalCases.includes(internalCase)) {
            if (output.charAt(0) == "@") {
                let type = output.substring(1);
                output = data[PROG_INDEX[type]];
            }

            for (let input of inputs) {
                let dataInput = _formatTxt(data[PROG_INDEX[input]]);
                let substitutionInput = substitution["input"][input] ? _formatTxt(substitution["input"][input]) : "";
                let multiplesSubstitutionInputs = substitutionInput.split(" || ");

                if (input == "price") {
                    dataInput = _moneyToFloat(dataInput);
                }
                if (dataInput != substitutionInput && !multiplesSubstitutionInputs.includes(dataInput)) {
                    match = false;
                    break;
                }
            }
            if (match) {
                result = output;
                break;
            }
        };

    }
    return result;
}

function _adaptProgramTitle(data) {
    let adapt = _adaptScheduleData(data, "schedule");
    let description = {
        text: data[PROG_INDEX["schedule"]],
        start: "",
        end: ""
    };

    if (adapt) {
        description.text = adapt;
    }

    return description;
}

function _adaptCostsDuringTrip(type, valor) {
    COST_DURING_TRIP += valor;
    if (type && COST_DURING_TRIP_INDEX["transportationCost"].includes(type)) {
        TRANSPORTATION_COST += valor;
    } else if (type && COST_DURING_TRIP_INDEX["stay"].includes(type)) {
        STAY_COST += valor;
    } else {
        DAY_TO_DAY_COST = DAY_TO_DAY_COST + valor;
    }
}