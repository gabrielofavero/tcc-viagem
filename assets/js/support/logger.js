// ======= Logger JS =======

const INFO = 'INFO';
const WARN = 'WARN';
const ERROR = 'ERROR';

// ======= LOGGERS =======
function _logger(type = "", message = "Hello World!") {
    switch (type) {
        case ERROR:
            let e = new Error();
            e = e.stack.split("\n")[2].split(":");
            e.pop();
            let line = ":" + e.pop();
            let caller;
            if (message.includes("@at:")) {
                caller = message.split("@at:")[1];
                message = message.split("@at:")[0];
            } else {
                caller = _getCallerFile() + line;
            }
            console.log(ERROR + " | " + caller + " | " + message);
            break;
        case WARN:
            console.log(WARN + " | " + message);
            break;
        default:
            console.log(INFO + " | " + message);
    }
}

function _logSheetsApiError(err, file) {
    let errorMsg = "";
    let enableLogObject = false;
    try {
        errorMsg = ": " + err.result.error.message;
    } catch (e) {
        try {
            errorMsg = ": " + err.status;
            enableLogObject = true;
        } catch (e2) {
            enableLogObject = true;
        }
    }
    _logger(ERROR, "Error trying to collect '" + file + "' From Google Sheets API: " + errorMsg);
    if (enableLogObject) {
        console.log(err)
    }
}

// ======= GETTERS =======
function _getCallerFile() {
    var originalFunc = Error.prepareStackTrace;

    var callerfile;
    try {
        var err = new Error();
        var currentfile;

        Error.prepareStackTrace = function (err, stack) {
            return stack;
        };

        currentfile = err.stack.shift().getFileName();

        while (err.stack.length) {
            callerfile = err.stack.shift().getFileName();

            if (currentfile !== callerfile) break;
        }
    } catch (e) { }

    Error.prepareStackTrace = originalFunc;

    return callerfile;
}