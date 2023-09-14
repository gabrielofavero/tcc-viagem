// ======= Device JS =======

function _getHTMLpage() {
    let result = window.location.pathname.replace(".html", "").replace("/", "");
    let split = result.split("/");
    if (split.length > 1) {
        result = split[1];
    } else {
        result = split[0];
    }
    if (result === "") {
        result = "index";
    }
    return result;
}

// ======= CHECKERS =======
function _isIOSDevice() {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
        // iPad on iOS 13 detection
        ||
        (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

function _isOnMobileMode() {
    return window.innerWidth < 1200;
}

function _isIndexHTML() {
    return _getHTMLpage() === "index";
}

function _isPasseioHTML() {
    return _getHTMLpage() === "places";
}