/* Music Player - Fixed-position Suno embed, works on all pages */
(function () {
  var SUNO_URL = 'https://suno.com/embed/e413a5b0-bd59-4dd4-8bd1-03adac146ff6';
  var LS_KEY = 'music-player-open';
  var iframeLoaded = false;

  /* Create button */
  var btn = document.createElement('button');
  btn.className = 'music-player-btn';
  btn.setAttribute('aria-label', 'Toggle music player');
  btn.innerHTML =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/>' +
    '</svg>';

  /* Create popup */
  var popup = document.createElement('div');
  popup.className = 'music-player-popup';

  var iframe = document.createElement('iframe');
  iframe.setAttribute('allow', 'autoplay; encrypted-media');
  iframe.setAttribute('loading', 'lazy');
  iframe.title = 'Music Player';
  popup.appendChild(iframe);

  /* Inject into <html> — SPA frameworks only replace <body> children,
     so mounting here prevents flicker during navigation */
  var root = document.documentElement;
  function attach() {
    if (!root.contains(btn)) root.appendChild(btn);
    if (!root.contains(popup)) root.appendChild(popup);
  }

  /* Toggle */
  function openPopup() {
    if (!iframeLoaded) {
      iframe.src = SUNO_URL;
      iframeLoaded = true;
    }
    popup.classList.add('open');
    btn.classList.add('active');
    try { localStorage.setItem(LS_KEY, '1'); } catch (_) {}
  }

  function closePopup() {
    popup.classList.remove('open');
    try { localStorage.setItem(LS_KEY, '0'); } catch (_) {}
  }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (popup.classList.contains('open')) {
      closePopup();
    } else {
      openPopup();
    }
  });

  document.addEventListener('click', function (e) {
    if (popup.classList.contains('open') && e.target !== btn && !popup.contains(e.target)) {
      closePopup();
    }
  });

  /* Boot */
  function boot() {
    attach();
    /* Restore state */
    try {
      if (localStorage.getItem(LS_KEY) === '1') {
        openPopup();
      }
    } catch (_) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
