# Fixing Element Flicker During Mintlify SPA Navigation

> **Type:** Post-mortem / Lessons Learned
> **Date:** 2026-03-21
> **Component:** Custom music player (fixed-position UI injected via `music-player.js`)
> **Mintlify config:** `docs.json` (not `mint.json` — newer Mintlify convention)

## Background

We added a persistent background music player to the documentation site. The player is a fixed-position button in the bottom-right corner that opens a Suno iframe embed. It must survive across all page navigations without interrupting playback.

Mintlify automatically includes any `.js` and `.css` files in the content root directory on **every page**. This is the injection mechanism — no config changes needed.

## The Problem

After the initial implementation, the music player button would **flicker** (disappear and reappear) every time the user navigated between pages using pagination links ("Next" / "Previous") or internal links. The music continued playing, but the visual flash was jarring.

## Root Cause Analysis

Mintlify is a **Single Page Application (SPA)**. When users click internal links, it does **not** perform a full page reload. Instead, it:

1. **Re-renders the `<body>` content** — swaps out the page content within `<body>`
2. **Re-executes custom `.js` files** — runs every custom script again after navigation
3. **Re-loads custom `.css` files** — removes and re-injects `<link>` tags for custom CSS

This three-part behavior creates three distinct flicker vectors, each of which required a separate fix.

## Fix Timeline — Four Iterations

### Attempt 1: Inject into `#navbar` with MutationObserver

```js
// ❌ Mounted elements inside #navbar
var navbar = document.getElementById('navbar');
rightSection.insertBefore(wrapper, rightSection.firstChild);

// MutationObserver to re-inject if navbar re-renders
new MutationObserver(function () {
  if (!document.contains(wrapper)) {
    inject();
  }
}).observe(document.documentElement, { childList: true, subtree: true });
```

**Result:** Did not appear on the homepage (`mode: custom` pages have a different navbar structure). On doc pages, the popup overflowed the viewport.

**Lesson:** Don't rely on framework-internal DOM structure (`#navbar`, `.items-center`). These are implementation details that vary across page modes and can change without notice.

### Attempt 2: Fixed-position on `document.body`

```js
// ❌ Mounted on body
function attach() {
  if (!document.body.contains(btn)) document.body.appendChild(btn);
  if (!document.body.contains(popup)) document.body.appendChild(popup);
}

// MutationObserver to re-attach
new MutationObserver(function () {
  attach();
}).observe(document.documentElement, { childList: true, subtree: true });
```

**Result:** Worked on all pages, but flickered during SPA navigation because Mintlify replaces `<body>` children, removing our elements. The MutationObserver re-attached them, but the remove-then-add cycle was visible.

**Lesson:** In an SPA, anything mounted inside `<body>` is at the mercy of the framework's DOM reconciliation.

### Attempt 3: Mount on `<html>` + global guard

```js
// ⚠️ Better — mounted on <html>, guarded against re-execution
if (!window.__musicPlayerInit) {
  window.__musicPlayerInit = true;
  // ... create and append elements to document.documentElement
}
```

**Result:** Reduced flicker, but still flickered. The `window.__musicPlayerInit` guard prevented re-creating elements, and `<html>` mounting survived body swaps. However, the **external `.css` file** was still being removed and re-loaded by Mintlify during navigation, causing a brief moment with no styles applied (elements lost `position: fixed` and flashed in normal flow).

**Lesson:** A global JS guard is necessary but not sufficient. External CSS files are also re-processed during SPA navigation.

### Attempt 4: Inline all styles in JS (final fix) ✅

```js
if (!window.__musicPlayerInit) {
  window.__musicPlayerInit = true;

  (function () {
    // Inject <style> tag into <head> — only runs once
    var style = document.createElement('style');
    style.textContent = '...all CSS rules...';
    (document.head || document.documentElement).appendChild(style);

    // Create and mount elements on <html>
    var root = document.documentElement;
    root.appendChild(btn);
    root.appendChild(popup);
  })();
}
```

**Result:** No flicker. All three vectors eliminated.

## The Three Vectors and Their Fixes

| # | Flicker Vector | Mechanism | Fix |
|---|---|---|---|
| 1 | **JS re-execution** creates duplicate elements | Mintlify re-runs `.js` files on SPA navigation | `window.__musicPlayerInit` global flag — script becomes a no-op on re-execution |
| 2 | **Body swap** removes elements mounted in `<body>` | SPA replaces `<body>` children during navigation | Mount on `document.documentElement` (`<html>`) — SPA frameworks don't touch `<html>`'s direct children |
| 3 | **CSS re-loading** causes brief style loss | Mintlify removes and re-injects `<link>` for custom `.css` files | Delete the `.css` file entirely; inject a `<style>` tag from JS under the same global guard |

## Key Takeaways for Future Development

### 1. Treat Mintlify as an SPA, not a static site

Even though Mintlify docs look like static pages, navigation is client-side. Custom scripts are **re-executed** on every page transition. Always guard with a global flag:

```js
if (!window.__myFeatureInit) {
  window.__myFeatureInit = true;
  // ... initialization code
}
```

### 2. Mount persistent UI on `<html>`, not `<body>`

Any element that must survive across navigations should be appended to `document.documentElement`. SPA frameworks control `<body>` — treat it as volatile.

### 3. Don't use external CSS for persistent elements

External `.css` files in Mintlify's content directory are re-loaded on navigation. For elements that must never flash, inline all styles via a `<style>` tag created in JS, protected by the same initialization guard.

### 4. Don't depend on Mintlify's internal DOM structure

Selectors like `#navbar`, `.items-center`, or any framework-generated class names are unstable. Use `position: fixed` with viewport-relative coordinates for overlay UI instead of injecting into the framework's component tree.

### 5. One file is better than two

By consolidating CSS into JS, we reduced the number of files Mintlify processes and eliminated a whole category of timing issues. For small, self-contained features, a single `.js` file with inlined styles is more robust than a `.js` + `.css` pair.

## File Reference

- `music-player.js` — The complete, self-contained music player (JS + inlined CSS)
- `music-player.css` — **Deleted** (was the source of flicker vector #3)
