/* Music Player - Fixed-position Suno embed, works on all pages.
   All styles are inlined so CSS re-loading during SPA navigation
   cannot cause flicker. Guarded to run only once. */
if (!window.__musicPlayerInit) {
  window.__musicPlayerInit = true;

  (function () {
    var SUNO_URL = 'https://suno.com/embed/e413a5b0-bd59-4dd4-8bd1-03adac146ff6';
    var LS_KEY = 'music-player-open';
    var iframeLoaded = false;

    /* Inject styles once into <head> */
    var style = document.createElement('style');
    style.textContent =
      '.music-player-btn{position:fixed;bottom:24px;right:24px;z-index:99999;width:44px;height:44px;border-radius:50%;border:none;background:#c846ab;color:#fff;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0;transition:background .2s,box-shadow .2s;box-shadow:0 2px 12px rgba(0,0,0,.25)}' +
      '.music-player-btn:hover{background:#9b2e83}' +
      '.music-player-btn svg{width:20px;height:20px;fill:currentColor}' +
      '.music-player-btn.active{animation:music-pulse 1.8s ease-in-out infinite}' +
      '@keyframes music-pulse{0%,100%{box-shadow:0 0 4px 0 rgba(200,70,171,.5)}50%{box-shadow:0 0 14px 5px rgba(200,70,171,.45)}}' +
      '.music-player-popup{position:fixed;bottom:80px;right:24px;z-index:99999;background:#1a1a2e;border:1px solid #c846ab;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.4);padding:12px;width:min(760px,calc(100vw - 24px));opacity:0;transform:translateY(8px);pointer-events:none;transition:opacity .25s ease,transform .25s ease}' +
      '.music-player-popup.open{opacity:1;transform:translateY(0);pointer-events:auto}' +
      '.music-player-popup iframe{width:100%;height:200px;border:none;border-radius:8px}' +
      '@media(max-width:768px){.music-player-btn{bottom:20px;right:16px;width:40px;height:40px}.music-player-btn svg{width:18px;height:18px}.music-player-popup{bottom:72px;right:8px;width:calc(100vw - 16px)}}';
    (document.head || document.documentElement).appendChild(style);

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

    /* Mount on <html> so SPA body swaps don't touch these */
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
}
