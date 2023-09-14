// ======= Lightbox JS =======

var savedScrollPosition = 0;

function openLightbox(link) {
  _startLoadingScreen();
  savedScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  var lightboxIframe = document.getElementById('lightbox-iframe');
  lightboxIframe.src = 'about:blank';
  lightboxIframe.onload = function () {
    document.getElementById('lightbox').style.display = 'block';
    document.getElementById('night-mode').style.display = 'none';
    document.getElementById('menu').style.display = 'none';
    document.getElementById('navbar').style.display = 'none';
    _stopLoadingScreen();
    disableScroll();
  };
  lightboxIframe.src = link;
}

function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
  document.getElementById('night-mode').style.display = 'block';
  document.getElementById('menu').style.display = 'block';
  document.getElementById('navbar').style.display = 'block';
  enableScroll();
  window.scrollTo({
    top: savedScrollPosition,
    behavior: 'instant'
  });
}