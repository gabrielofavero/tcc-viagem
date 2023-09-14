
function _generateOfflineData() {
    _logger(INFO, "HYPERLINK:");
    console.log(HYPERLINK);
    _logger(INFO, "P_DATA:");
    console.log(P_DATA);
    _logger(INFO, "SHEET_DATA:");
    console.log(SHEET_DATA);
}

function _loadOfflineMode() {
    const SHEET_DATA_OFFLINE = _getJSON("assets/json/offline-data/SHEET_DATA.json");
    const P_DATA_BACKUP = _getJSON("assets/json/offline-data/P_DATA.json");
    const HYPERLINK_BACKUP = _getJSON("assets/json/offline-data/HYPERLINK.json");
    try {
        SHEET_DATA = SHEET_DATA_OFFLINE;
        if (CONFIG.places.active) {
            P_DATA = P_DATA_BACKUP;
            HYPERLINK = HYPERLINK_BACKUP;
            _getPResult();
        }
    } catch (error) {
        _displayErrorMessage(error);
        throw error;
    }
}