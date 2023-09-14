// ======= Visibility JS =======

const INDEX = "index";
const PASSEIO = "places";
var DARK_MODE;

const COLORS = _getJSON("assets/json/support/colors.json");

const THEME_COLOR_DARK = "#8a7171";
const THEME_COLOR_LIGHT = "#AF8F8E";

// ======= LOADERS =======
function _loadVisibility() {
     const AUTO_VISIBILITY = CONFIG.visibility.autoVisibility;
     if (CONFIG.visibility.startOnDarkMode) {
          if (AUTO_VISIBILITY) {
               _logger(WARN, "Auto Visibility ignored. System is configured to start on dark mode.");
          }
          _loadDarkMode();
     } else if (AUTO_VISIBILITY) {
          _autoVisibility();
     } else {
          _lightModeLite();
     }
     document.getElementById("night-mode").onclick = function () {
          _switchVisibility();
     };
     window.addEventListener("resize", function () {
          _adjustButtonsPosition();
     });
}

function _loadVisibilityPasseio() {
     if (localStorage.getItem("darkModePasseio") === "true") {
          _loadDarkMode();
     } else {
          _loadLightMode();
     }
     _adjustButtonsPosition();
     document.getElementById("night-mode").style.display = "block";
     document.getElementById("night-mode").onclick = function () {
          _switchVisibility();
     };
}

function _loadNightModeToggleHTML() {
     let icon = _getNightModeIcon();
     var iClass = icon + " custom-nav-toggle";
     let id = document.getElementById("night-mode");
     id.innerHTML = `<i id="night-mode" class="${iClass}></i>`;
}

function _loadDarkMode() {
     var link = document.createElement("link");
     link.href = `assets/css/${_getCSSname()}-dark.css`;
     link.type = "text/css";
     link.rel = "stylesheet";
     document.getElementsByTagName("head")[0].appendChild(link);
     localStorage.setItem("darkModePasseio", true);
     _loadNightModeToggleHTML();
     _changeThemeColor("#303030");
     if (_isIndexHTML()) {
          DARK_MODE = true;
          _changeHeaderImg();
     }
}

function _loadLightMode() {
     var link = document.createElement("link");
     link.href = `assets/css/${_getCSSname()}.css`;
     link.type = "text/css";
     link.rel = "stylesheet";
     document.getElementsByTagName("head")[0].appendChild(link);
     DARK_MODE = false;
     localStorage.setItem("darkModePasseio", false);
     _loadNightModeToggleHTML();
     _changeThemeColor("#fff");
     if (_isIndexHTML()) {
          DARK_MODE = false;
          _changeHeaderImg();
     }
}

// ======= GETTERS =======
function _getDarkModeInfo() {
     switch (_getHTMLpage()) {
          case INDEX:
               return DARK_MODE;
          case PASSEIO:
               return localStorage.getItem("darkModePasseio") === "true";
     }
}

function _getCSSname() {
     switch (_getHTMLpage()) {
          case INDEX:
               return "style";
          case PASSEIO:
               return "places";
     }
}

function _getNightModeIcon() {
     let checker;
     switch (_getHTMLpage()) {
          case INDEX:
               checker = DARK_MODE;
          case PASSEIO:
               checker = localStorage.getItem("darkModePasseio") === "true";
     }
     return checker ? "bx bx-sun" : "bx bx-moon";
}

// ======= SETTERS =======
function _switchVisibility() {
     if (_getDarkModeInfo()) {
          _loadLightMode();
     } else {
          _loadDarkMode();
     }
     _adjustButtonsPosition();
}

function _autoVisibility() {
     let now = _getCurrentHour();
     if (now >= CONFIG.visibility.darkModeStartHour || now < CONFIG.visibility.darkModeEndHour) {
          _loadDarkMode();
     } else {
          _lightModeLite();
     }
}

function _lightModeLite() {
     if (_isIndexHTML()) {
          DARK_MODE = false;
     };
     _loadNightModeToggleHTML();
     localStorage.setItem("darkModePasseio", false);
}

function _changeThemeColor(color) {
     // Useful for iOS devices     
     let metaThemeColor = document.querySelector("meta[name=theme-color]");
     metaThemeColor.setAttribute("content", color);
}

function _changeHeaderImg() {
     try {
          if (HEADER_IMG_ACTIVE) {
               document.getElementById("header2").src = DARK_MODE ? CONFIG.header.image.dark : CONFIG.header.image.light;
          }
     } catch (e) { }
}

function _adjustButtonsPosition() {
     const nightMode = document.getElementById("night-mode");
     const first = "10px";
     const second = "50px";
     const third = "90px";
     const fourth = "130px";

     // Padrão: Desktop

     switch (_getHTMLpage()) {
          case INDEX:
               const config = document.getElementById("config");
               const share = document.getElementById("share");
               if (_isOnMobileMode()) {
                    config.style.right = second;
                    share.style.right = third;
                    nightMode.style.right = fourth;
               } else {
                    config.style.right = first;
                    share.style.right = second;
                    nightMode.style.right = third;
               }
               break;
          case PASSEIO:
               nightMode.style.right = second;
     }
}

function disableScroll() {
     document.body.style.overflow = "hidden";
}

function enableScroll() {
     document.body.style.overflow = "auto";
}
