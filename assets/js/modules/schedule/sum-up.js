// ======= SumUp JS =======

const EMOJI_INDEX = _getJSON("assets/json/modules/schedule/emoji-index.json");
const TEXT_INDEX = _getJSON("assets/json/modules/schedule/text-index.json");

// ======= LOADERS =======
function _loadFirstSumUp() {
    let now = new Date();
    let maxFIM = new Date(END_DATE);
    maxFIM.setHours(23, 59, 59, 999);

    let dateString = _getDateString(now);

    if (now.getTime() >= START_DATE.getTime() && now.getTime() <= maxFIM.getTime()) {
        _logger(INFO, dateString + ": Dia de Viagem")
        let val = new Date(now.getMonth() + 1 + "/" + now.getDate() + "/" + now.getFullYear()).getTime().toString();
        document.getElementById("subject").value = val;
        _loadSumUp(true);
    } else {
        if (now.getTime() < START_DATE.getTime()) {
            _logger(INFO, dateString + ": Pré Viagem")
        } else {
            _logger(INFO, dateString + ": Pós Viagem")
        }
        _loadSumUp();
    }
}

function _loadSumUp(firstLoad = false) {
    _clearSumUp();
    let day = new Date(parseInt(document.getElementById("subject").value));
    let data = _getArraybyDate(_dateToExcel(day));

    for (let i = 0; i < data.length; i++) {
        if (_isExcelTime(data[i][PROG_INDEX["startTime"]])) {
            _addToSumUp(data[i]);
        }
    }
    let currentData = _getDataFromTime()

    if (firstLoad && currentData.found) {
        _getSwiper(currentData.position);
    } else {
        _getSwiper();
    }
}

function _loadSumUpSelectBox() {
    let agora = new Date();

    let select = document.getElementById("subject");
    let option = document.createElement("option");
    let indexDate = new Date(START_DATE);
    let index = 1;
    while (indexDate <= END_DATE) {
        option = document.createElement("option");
        option.text = _dateToExcel(indexDate);
        option.value = indexDate.getTime();
        select.add(option);
        indexDate = _getNewDay(index);
        index++;
    }
    indexDate = new Date(START_DATE);
    index = 1;
    while (indexDate <= END_DATE) {
        if (indexDate.getTime() == agora.getTime()) {
            select.selectedIndex = index - 1;
            break;
        }
        indexDate = _getNewDay(index);
        index++;
    }
    document.getElementById("subject").onchange = function () {
        _loadSumUp();
    };
}

// ======= GETTERS =======
function _getSwiper(position = 0) {
    let swiper = new Swiper('.testimonials-slider', {
        speed: 600,
        loop: true,
        autoplay: false,
        slidesPerView: 'auto',
        initialSlide: position,
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
        }
    });
    return swiper;
}

function _getEmoji(categoria = "-", programacao = "", descricao = "", horarioInicio = "") {
    let cat = categoria.toLowerCase();

    if (programacao != "" || descricao != "" || cat == "saídas") {
        let search = horarioInicio.toLowerCase() + " " + programacao.toLowerCase() + " " + descricao.toLowerCase();
        let catObject = TEXT_INDEX[cat];
        if (catObject == undefined) {
            catObject = TEXT_INDEX[_formatTxt(cat)]
        }

        if (catObject != undefined) {
            let catArray = Object.entries(catObject);
            for (let i = 0; i < catArray.length; i++) {
                for (j = 0; j < catArray[i][1].length; j++) {
                    if (search.includes(catArray[i][1][j])) {
                        cat = catArray[i][0];
                        break;
                    }
                }
            }
        }
    }
    let result = EMOJI_INDEX[cat];

    if (result == undefined) return EMOJI_INDEX.default;
    else return result;
}

function _getDataFromTime() {
    let now = new Date();

    let result = {};
    result.date = _dateToExcel(now),
        result.found = false,
        result.position = 0,
        result.data = []

    let timeString = now.getHours() + ":" + now.getMinutes();
    let timeObject = _timeStringtoObject(timeString);
    let currentArray = _getArraybyDate(_dateToExcel(now, true));

    for (let i = 1; i < currentArray.length; i++) {
        if (currentArray[i][0] != "" && currentArray[i][0] != undefined) {
            let startTime = _timeStringtoObject(currentArray[i][0]);
            let endTime = _timeStringtoObject(currentArray[i][2]);
            if (timeObject.hours > startTime.hours || (timeObject.hours == startTime.hours && timeObject.minutes >= startTime.minutes)) {
                if (timeObject.hours < endTime.hours || (timeObject.hours == endTime.hours && timeObject.minutes < endTime.minutes)) {
                    result.found = true;
                    result.position = i - 1;
                    result.data = currentArray[i];
                    break;
                }
            }
        }
    }
    return result;
}

// ======= SETTERS =======
function _clearSumUp() {
    let div1 = document.getElementById("resumo");
    div1.innerHTML = `
    <div class="swiper-wrapper" id="miniProg"></div>
    <div class="swiper-pagination" id="miniProgPag"></div>`;
}

function _addToSumUp(data) {
    let div = document.getElementById("miniProg");
    let adaptedTitle = _adaptTitle(data);
    div.innerHTML = div.innerHTML + `
    <div class="swiper-slide">
    <div class="testimonial-item">
      <h5>${_adaptTime(data[PROG_INDEX["startTime"]])} - ${_adaptTime(data[2])}</h5>
      <div class="container">
        <img src="assets/img/item.png" class="testimonial-img" alt="">
        <div class="centered" id="emoji">${_getEmoji(data[PROG_INDEX["type"]], adaptedTitle, data[PROG_INDEX["description"]], data[PROG_INDEX["startTime"]])}</div>
      </div>
      <h3>${adaptedTitle}</h3>
      <h4>${data[PROG_INDEX["description"]]}</h4>
      <h3 style="color:#009242">${data[PROG_INDEX["price"]] == undefined ? ` ${CURRENCY}  -   ` : data[PROG_INDEX["price"]]}</h3>
    </div>
  </div>`;
}

// ======= CONVERTERS =======
function _adaptTitle(data) {
    let title = data[PROG_INDEX["schedule"]];
    let adaptedTitle = _adaptScheduleData(data, "sumup");

    if (adaptedTitle) {
        title = adaptedTitle;
    }
    return title
}