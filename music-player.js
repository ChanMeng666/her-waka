/* Music Player - Persistent Suno embed in navigation bar */
(function () {
  var SUNO_URL = 'https://suno.com/embed/e413a5b0-bd59-4dd4-8bd1-03adac146ff6';
  var LS_KEY = 'music-player-open';
  var injected = false;
  var iframeLoaded = false;
  var wrapper, btn, popup, iframe;

  function createPlayer() {
    // Wrapper
    wrapper = document.createElement('div');
    wrapper.className = 'music-player-wrapper';

    // Button
    btn = document.createElement('button');
    btn.className = 'music-player-btn';
    btn.setAttribute('aria-label', 'Toggle music player');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/>' +
      '</svg>';

    // Popup
    popup = document.createElement('div');
    popup.className = 'music-player-popup';

    // Iframe (src not set until first open)
    iframe = document.createElement('iframe');
    iframe.setAttribute('allow', 'autoplay; encrypted-media');
    iframe.setAttribute('loading', 'lazy');
    iframe.title = 'Music Player';

    popup.appendChild(iframe);
    wrapper.appendChild(btn);
    wrapper.appendChild(popup);

    // Toggle on click
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var willOpen = !popup.classList.contains('open');
      if (willOpen) {
        openPopup();
      } else {
        closePopup();
      }
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (popup.classList.contains('open') && !wrapper.contains(e.target)) {
        closePopup();
      }
    });
  }

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
    // Keep btn active glow if iframe has been loaded (music may still play)
    try { localStorage.setItem(LS_KEY, '0'); } catch (_) {}
  }

  function inject() {
    if (injected && document.contains(wrapper)) return;

    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    // Find the right-side container (usually the last flex child with buttons/links)
    var rightSection = navbar.querySelector('.items-center:last-child') ||
                       navbar.querySelector('[class*="right"]') ||
                       navbar.lastElementChild;

    if (rightSection) {
      rightSection.insertBefore(wrapper, rightSection.firstChild);
    } else {
      navbar.appendChild(wrapper);
    }

    injected = true;

    // Restore state from localStorage
    try {
      if (localStorage.getItem(LS_KEY) === '1') {
        openPopup();
      }
    } catch (_) {}
  }

  // Initialize
  createPlayer();

  // Inject once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { inject(); });
  } else {
    inject();
  }

  // Re-inject if Mintlify re-renders the navbar (SPA navigation)
  var observer = new MutationObserver(function () {
    if (!document.contains(wrapper)) {
      injected = false;
      inject();
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
