// ======= Modules JS =======

// ======= MAIN FUNCTION =======
function _start() {
  // Visibility
  _loadVisibility();
  _loadNightModeToggleHTML();

  // Header
  _loadHeader();
  _loadheaderIcons();
  
  // Modules
  _loadModules();

  // Ranges
  _loadMainRanges();
  _loadPlacesRanges();
  _loadHyperlinkRanges();

  // Visibility - After Load
  _adjustButtonsPosition();
}

// ======= LOADERS =======
function _loadHeader() {
  document.title = CONFIG.title;
  document.getElementById("header1").innerHTML = "<h1>" + CONFIG.header.title + "</h1>";
  document.getElementById("header2").style.display = "none";
  document.getElementById("sheetLink").href = CONFIG.header.sheetLink;
  document.getElementById("pptLink").href = CONFIG.header.pptLink;
  document.getElementById("driveLink").href = CONFIG.header.driveLink;
  document.getElementById("vaccineLink").href = CONFIG.header.vaccineLink;
  document.getElementById("mapsLink").href = CONFIG.header.mapsLink;
  document.getElementById("attachmentsLink").href = CONFIG.header.documentsLink;
  document.getElementById("comprovantesV").href = CONFIG.header.documentsLink;
  document.getElementById("comprovantesH").href = CONFIG.header.documentsLink;
  

  if (CONFIG.header.image.active) {
    document.getElementById("header2").src = DARK_MODE ? CONFIG.header.image.dark : CONFIG.header.image.light;
    document.getElementById("header1").style.display = "none";
    document.getElementById("header2").style.display = "block";
}
}

function _loadModules() {
  // About
  if (CONFIG.modules.about) {
    document.getElementById("keypointsNav").innerHTML = "";
    _loadAboutModule();
    CALL_SYNC.push(_loadAbout);
    CALL_SYNC.push(_loadTransportationModule);
    CALL_SYNC.push(_loadKeypointsIntegrated);
  } else {
    document.getElementById("aboutNav").innerHTML = "";
    document.getElementById("about").innerHTML = "";
    document.getElementById("about").style.display = "none";
  }

  // Keypoints
  if (CONFIG.modules.keypoints) {
    CALL_SYNC.push(_loadKeypointsStandAlone);
  } else {
    document.getElementById("keypointsNav").innerHTML = "";
    document.getElementById("keypoints").innerHTML = "";
    document.getElementById("keypoints").style.display = "none";
  }

  // Cities
  if (!CONFIG.modules.keypoints || !CONFIG.modules.cities) {
    document.getElementById("cities").innerHTML = "";
    document.getElementById("cities").style.display = "none";
  }

  // Flights
  if (CONFIG.modules.flights) {
    CALL_SYNC.push(_loadFlightsModule);
  } else {
    document.getElementById("flightsNav").innerHTML = "";
    document.getElementById("flights").innerHTML = "";
    document.getElementById("flights").style.display = "none";
  }

  // Stay
  if (!CONFIG.modules.stay) {
    document.getElementById("stayNav").innerHTML = "";
    document.getElementById("stay").innerHTML = "";
    document.getElementById("stay").style.display = "none";
  }

  // Costs
  if (CONFIG.modules.costs) {
    CALL_SYNC.push(_loadCostModule);
  } else {
    document.getElementById("costsNav").innerHTML = "";
    document.getElementById("costs").innerHTML = "";
    document.getElementById("costs").style.display = "none";
  }

  // Sum-Up
  if (CONFIG.modules.sumUp) {
    CALL_SYNC.push();
  } else {
    document.getElementById("sumUpNav").innerHTML = "";
    document.getElementById("sumUp").innerHTML = "";
    document.getElementById("sumUp").style.display = "none";
  }

  // Schedule: List
  if (CONFIG.modules.scheduleList) {
    CALL_SYNC.push();
  } else {
    document.getElementById("scheduleListNav").innerHTML = "";
    document.getElementById("scheduleList").innerHTML = "";
    document.getElementById("scheduleList").style.display = "none";
  }

  // Schedule: Calendar
  if (CONFIG.modules.scheduleCalendar) {
    CALL_SYNC.push(_loadScheduleCalendar);
  } else {
    document.getElementById("scheduleCalendarNav").innerHTML = "";
    document.getElementById("scheduleCalendar").innerHTML = "";
    document.getElementById("scheduleCalendar").style.display = "none";
  }

  // Places
  if (CONFIG.modules.places) {
    document.getElementById("pDescription").innerHTML = "<p>" + CONFIG.places.description + "</p>";
    _loadPlacesHTML(CONFIG.places.cities[0]);
    _loadPlacesSelect();
    CALL_SYNC.push(_loadPlaces);
    CALL_SYNC.push(_loadPlacesData);
    CALL_SYNC.push(_loadHyperlinks);
  } else {
    document.getElementById("placesNav").innerHTML = "";
    document.getElementById("places").innerHTML = "";
  }

  // Gallery
  if (!CONFIG.modules.gallery) {
    document.getElementById("galleryNav").innerHTML = "";
    document.getElementById("gallery").innerHTML = "";
    document.getElementById("gallery").style.display = "none";
  }
}

function _loadheaderIcons() {
  if (CONFIG.header.attachmentsLink == "") {
    document.getElementById("attachmentsLink").style.display = "none";
  }
  if (CONFIG.header.sheetLink == "") {
    document.getElementById("sheetLink").style.display = "none";
  }
  if (CONFIG.header.pptLink == "") {
    document.getElementById("pptLink").style.display = "none";
  }
  if (CONFIG.header.driveLink == "") {
    document.getElementById("driveLink").style.display = "none";
  }
  if (CONFIG.header.vaccineLink == "") {
    document.getElementById("vaccineLink").style.display = "none";
  }
  if (CONFIG.header.pdfLink == "") {
    document.getElementById("pdfLink").style.display = "none";
  }
  if (CONFIG.header.mapsLink == "") {
    document.getElementById("mapsLink").style.display = "none";
  }
}