// ======= Loading JS =======

const ERROR_JSON = _getJSON("assets/json/support/error.json");
var ERROR_MODE = false;

// ======= LOADING SCREEN =======
function _startLoadingScreen() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.display = 'block';
    disableScroll();
  }
}

function _stopLoadingScreen() {
  if (!ERROR_MODE) {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.display = 'none';
      enableScroll();
    }
  } else {
    _logger(WARN, 'Cannot stop loading in error mode');
  }
}

// ======= ERROR MESSAGE =======
function _displayErrorMessage(errorMessage = "") {
  const preloader = document.getElementById('preloader');

  if (preloader) {
    ERROR_MODE = true;
    disableScroll();
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-container';
    const errorText = document.createElement('div');
    errorText.className = 'error-text';
    const errorTitle = document.createElement('h2');
    errorTitle.innerText = ERROR_JSON.title;
    errorText.appendChild(errorTitle);
    const errorDescription = document.createElement('p');
    errorDescription.innerHTML = ERROR_JSON.description;
    errorText.appendChild(errorDescription);

    const stackTrace = (new Error()).stack;
    let errorLocation = stackTrace.split('\n')[2];
    errorLocation = errorLocation.split("/")[errorLocation.split("/").length - 1]

    const errorMessageWithLocation = errorMessage + " " + errorLocation;
    const errorMessageElement = document.createElement('p');
    errorMessageElement.innerText = errorMessageWithLocation;
    errorMessageElement.className = 'error-message';
    errorText.appendChild(errorMessageElement);

    errorContainer.appendChild(errorText);
    preloader.innerHTML = '';
    preloader.style.background = 'rgba(0, 0, 0, 0.6)';
    preloader.appendChild(errorContainer);

    if (preloader.style.display != 'block') {
      preloader.style.display = 'block';
    }
  } else {
    _logger(WARN, 'No preloader element found');
  }
}


function _overrideError() {
  if (ERROR_MODE) {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.innerHTML = '';
      preloader.style.background = '';
    }
    ERROR_MODE = false;
    _stopLoadingScreen();
  } else {
    _logger(WARN, 'No error to override');
  }
}