// ======= Countdown JS =======

var COUNTDOWN;

// ======= Loaders =======
COUNTDOWN = setInterval(function () {
  var now = new Date().getTime();

  var distance = _dateStringToDate(CONFIG.start) - now;

  var years = Math.floor(distance / (1000 * 60 * 60 * 24 * 365));
  distance -= years * (1000 * 60 * 60 * 24 * 365);

  var months = Math.floor(distance / (1000 * 60 * 60 * 24 * 30));
  distance -= months * (1000 * 60 * 60 * 24 * 30);

  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  distance -= days * (1000 * 60 * 60 * 24);

  var hours = Math.floor(distance / (1000 * 60 * 60));
  distance -= hours * (1000 * 60 * 60);

  var minutes = Math.floor(distance / (1000 * 60));
  distance -= minutes * (1000 * 60);

  var seconds = Math.floor(distance / 1000);

  var countdownText = "";

  if (years > 0) {
    countdownText += years + "a ";
  }

  if (months > 0) {
    countdownText += months + "m ";
  }

  if (days > 0) {
    countdownText += days + "d ";
  }

  if (hours > 0) {
    countdownText += hours + "h ";
  }

  if (minutes > 0) {
    countdownText += minutes + "m ";
  }

  countdownText += seconds + "s ";

  document.getElementById("countdown").innerHTML = countdownText;

  if (distance < 0) {
    clearInterval(COUNTDOWN);
    document.getElementById("countdown").innerHTML = "";
    _hideCountdown();
  } else if (!_isCountdownVisible()) {
    _showCountdown();
  };
}, 1000);

// ======= SETTERS =======
function _hideCountdown() {
  document.getElementById("countdown").style.display = "none";
}

function _showCountdown() {
  document.getElementById("countdown").style.display = "block";
}

// ======= CHECKERS =======
function _isCountdownVisible() {
  return document.getElementById("countdown").style.display == "block";
}