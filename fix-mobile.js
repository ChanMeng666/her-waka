/* Fix: Mintlify sets data-banner-state="visible" on <html> even when
   no banner is configured in docs.json. This causes --banner-height
   to be set to 2.5rem, potentially offsetting navbar touch targets
   on mobile browsers. Force the state to "hidden" on page load. */
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('data-banner-state', 'hidden');
}
