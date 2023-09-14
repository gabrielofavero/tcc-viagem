// ======= Data JS =======

const CONFIG = _getJSON("assets/json/main/config.json");
var CALL_SYNC = [];

var SHEET_DATA;
var P_DATA;
var HYPERLINK;

// ======= GETTERS =======
function _getJSON(path) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', path, false);
  xhr.send();

  if (xhr.status === 200) {
    return JSON.parse(xhr.responseText);
  } else {
    _logger(ERROR, "Failed to load JSON file in path: '" + path, "'")
  }
}

function _getFromArray(what, of, array) {
  let result = "";
  let findIndex;
  for (let i = 0; i < array[0].length; i++) {
    if (_formatTxt(array[0][i]).includes(_formatTxt(what))) {
      findIndex = i;
      break;
    }
  }
  if (findIndex) {
    for (let i = 1; i < array.length; i++) {
      if (_formatTxt(array[i][0]) == _formatTxt(of)) {
        result = array[i][findIndex];
        break;
      }
    }
  }
  return result;
}

// ======= CONVERTERS =======
function _formatTxt(text) {
  // áBç -> abc
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

function _addDotSeparator(val) {
  // 1000 -> 1.000
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");;
}

function _removeComma(val) {
  return val.split(",")[0];
}

function _mergeArrays(arrayOfArrays) {
  let result = arrayOfArrays[0];
  for (let i = 1; i < arrayOfArrays.length; i++) {
    result = result.concat(arrayOfArrays[i]);
  }
  return result;
}

function _moneyToFloat(excelMoney) {
  try {
      let adaptedMoney = excelMoney.trim().replace(" ", "").replace(" ", "");
      if (adaptedMoney == `${CURRENCY}-`) return 0;
      moneyArray = adaptedMoney.split(CURRENCY);
      if (moneyArray[0].trim() == "-") {
          return -parseFloat(moneyArray[1].trim().replace(".", "").replace(",", "."));
      } else {
          return parseFloat(moneyArray[1].trim().replace(".", "").replace(",", "."));
      }
  } catch (e) {
      _logger(WARN, "Valor inválido encontrado: '" + excelMoney + "'. Retornando 0");
      return 0;
  }
}

// ======= CHECKERS =======
function _hasValue(val) {
  return (val != undefined && val != null && val != "");
}

function _sortFunctionArray(functionArray, orderArray) {
  functionArray.sort((a, b) => {
    const indexA = orderArray.indexOf(a.name);
    const indexB = orderArray.indexOf(b.name);
    return indexA - indexB;
  });
}

function _isMoney(excelMoney) {
  return excelMoney.split("$").length > 1
}