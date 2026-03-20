/* Music Player - Debug version with visible diagnostics */
(function () {
  var SUNO_URL = 'https://suno.com/embed/e413a5b0-bd59-4dd4-8bd1-03adac146ff6';
  var LS_KEY = 'music-player-open';
  var injected = false;
  var iframeLoaded = false;
  var wrapper, btn, popup, iframe;
  var logs = [];

  /* -------- Debug Panel -------- */
  function log(msg) {
    var ts = new Date().toISOString().slice(11, 23);
    logs.push('[' + ts + '] ' + msg);
    updatePanel();
  }

  var panel = document.createElement('div');
  panel.id = 'music-debug-panel';
  panel.style.cssText =
    'position:fixed;bottom:0;left:0;right:0;z-index:99999;max-height:40vh;' +
    'overflow-y:auto;background:#1a1a2e;color:#0f0;font:12px/1.5 monospace;' +
    'padding:12px 16px;border-top:2px solid #c846ab;white-space:pre-wrap;';

  var copyBtn = document.createElement('button');
  copyBtn.textContent = 'Copy Logs';
  copyBtn.style.cssText =
    'position:sticky;top:0;float:right;background:#c846ab;color:#fff;border:none;' +
    'padding:4px 12px;border-radius:4px;cursor:pointer;font:12px monospace;';
  copyBtn.addEventListener('click', function () {
    navigator.clipboard.writeText(logs.join('\n')).then(function () {
      copyBtn.textContent = 'Copied!';
      setTimeout(function () { copyBtn.textContent = 'Copy Logs'; }, 1500);
    });
  });

  var logContainer = document.createElement('pre');
  logContainer.style.cssText = 'margin:0;padding-top:8px;';
  panel.appendChild(copyBtn);
  panel.appendChild(logContainer);

  function updatePanel() {
    logContainer.textContent = logs.join('\n');
    panel.scrollTop = panel.scrollHeight;
  }

  function attachPanel() {
    if (!document.body) return;
    if (!document.body.contains(panel)) {
      document.body.appendChild(panel);
    }
  }

  /* -------- Player creation -------- */
  function createPlayer() {
    wrapper = document.createElement('div');
    wrapper.className = 'music-player-wrapper';

    btn = document.createElement('button');
    btn.className = 'music-player-btn';
    btn.setAttribute('aria-label', 'Toggle music player');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/>' +
      '</svg>';

    popup = document.createElement('div');
    popup.className = 'music-player-popup';

    iframe = document.createElement('iframe');
    iframe.setAttribute('allow', 'autoplay; encrypted-media');
    iframe.setAttribute('loading', 'lazy');
    iframe.title = 'Music Player';

    popup.appendChild(iframe);
    wrapper.appendChild(btn);
    wrapper.appendChild(popup);

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var willOpen = !popup.classList.contains('open');
      log('Button clicked, will ' + (willOpen ? 'open' : 'close'));
      if (willOpen) { openPopup(); } else { closePopup(); }
    });

    document.addEventListener('click', function (e) {
      if (popup.classList.contains('open') && !wrapper.contains(e.target)) {
        closePopup();
      }
    });

    log('Player elements created');
  }

  function openPopup() {
    if (!iframeLoaded) {
      iframe.src = SUNO_URL;
      iframeLoaded = true;
      log('Iframe src set to: ' + SUNO_URL);
    }
    popup.classList.add('open');
    btn.classList.add('active');
    try { localStorage.setItem(LS_KEY, '1'); } catch (_) {}
  }

  function closePopup() {
    popup.classList.remove('open');
    try { localStorage.setItem(LS_KEY, '0'); } catch (_) {}
  }

  /* -------- Injection -------- */
  function inject() {
    if (injected && document.contains(wrapper)) {
      log('Already injected, skipping');
      return;
    }

    /* Probe the DOM */
    var navbar = document.getElementById('navbar');
    log('document.getElementById("navbar") => ' + (navbar ? 'FOUND (' + navbar.tagName + ', classes="' + navbar.className + '")' : 'null'));

    if (!navbar) {
      /* Try alternative selectors */
      var candidates = [
        { sel: 'nav', desc: 'nav' },
        { sel: 'header', desc: 'header' },
        { sel: '[class*="navbar"]', desc: '[class*="navbar"]' },
        { sel: '[class*="Navbar"]', desc: '[class*="Navbar"]' },
        { sel: '[class*="nav-bar"]', desc: '[class*="nav-bar"]' },
        { sel: '[class*="topbar"]', desc: '[class*="topbar"]' },
        { sel: '[class*="TopBar"]', desc: '[class*="TopBar"]' },
        { sel: '[class*="header"]', desc: '[class*="header"]' },
        { sel: '[class*="Header"]', desc: '[class*="Header"]' },
        { sel: '[role="navigation"]', desc: '[role="navigation"]' }
      ];
      candidates.forEach(function (c) {
        var els = document.querySelectorAll(c.sel);
        if (els.length > 0) {
          var info = [];
          els.forEach(function (el, i) {
            if (i < 3) {
              info.push(el.tagName + '#' + el.id + '.' + (el.className || '').toString().replace(/\s+/g, '.').slice(0, 120));
            }
          });
          log('  ' + c.desc + ' => ' + els.length + ' match(es): ' + info.join(' | '));
        }
      });

      log('Could not find #navbar. Dumping top-level body children:');
      if (document.body) {
        Array.prototype.slice.call(document.body.children, 0, 15).forEach(function (el, i) {
          log('  body>' + i + ': <' + el.tagName.toLowerCase() + ' id="' + (el.id || '') + '" class="' + (el.className || '').toString().slice(0, 100) + '">');
        });
      }
      return;
    }

    /* Found navbar — inspect children */
    log('Navbar children (' + navbar.children.length + '):');
    Array.prototype.slice.call(navbar.children).forEach(function (el, i) {
      log('  [' + i + '] <' + el.tagName.toLowerCase() + ' class="' + (el.className || '').toString().slice(0, 120) + '">');
    });

    var rightSection = navbar.querySelector('.items-center:last-child') ||
                       navbar.querySelector('[class*="right"]') ||
                       navbar.lastElementChild;

    log('rightSection => ' + (rightSection ? rightSection.tagName + '.' + (rightSection.className || '').toString().slice(0, 80) : 'null'));

    if (rightSection) {
      rightSection.insertBefore(wrapper, rightSection.firstChild);
      log('Injected into rightSection as firstChild');
    } else {
      navbar.appendChild(wrapper);
      log('Appended to navbar directly');
    }

    injected = true;

    /* Check if wrapper is visible */
    var rect = wrapper.getBoundingClientRect();
    log('Wrapper rect: top=' + rect.top + ' left=' + rect.left + ' w=' + rect.width + ' h=' + rect.height);

    var styles = window.getComputedStyle(wrapper);
    log('Wrapper computed: display=' + styles.display + ' visibility=' + styles.visibility + ' opacity=' + styles.opacity);

    try {
      if (localStorage.getItem(LS_KEY) === '1') {
        openPopup();
      }
    } catch (_) {}
  }

  /* -------- Boot -------- */
  log('music-player.js loaded. readyState=' + document.readyState);
  createPlayer();

  function boot() {
    attachPanel();
    log('boot() called');
    inject();

    /* If inject failed, retry a few times */
    if (!injected) {
      var retries = 0;
      var retryTimer = setInterval(function () {
        retries++;
        log('Retry inject #' + retries);
        inject();
        if (injected || retries >= 10) {
          clearInterval(retryTimer);
          if (!injected) log('Gave up after 10 retries');
        }
      }, 1000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* Re-inject on SPA navigation */
  var observer = new MutationObserver(function () {
    attachPanel();
    if (injected && !document.contains(wrapper)) {
      log('Wrapper removed from DOM, re-injecting...');
      injected = false;
      inject();
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
