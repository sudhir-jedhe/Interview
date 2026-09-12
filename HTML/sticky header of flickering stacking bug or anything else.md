Flickering, jittering, or stacking bugs with sticky headers typically stem from competing browser paint layers, scroll-listener lag, or broken stacking contexts.

---

### Common Causes and Fixes

**1. The "Jitter/Flicker" from JavaScript Scroll Listeners**

* **Cause**: Toggling CSS classes (like adding `.is-sticky` via `window.addEventListener('scroll', ...)`) causes a race condition between asynchronous user scroll events and JavaScript layout updates.
* **Fix**: Replace manual scroll listeners with native CSS:

```css
.header {
  position: sticky;
  top: 0;
  z-index: 100;
}

```

If you must detect when the element sticks to alter styling (e.g., shrink size or add background shadow), use an **`IntersectionObserver`** watching a 1px sentinel element right above the header rather than a scroll event.

---

**2. Composite Layer Flickering (GPU Repaints)**

* **Cause**: During high-speed scrolling, the browser switches between CPU layout passes and GPU compositing layers, causing micro-flashes or visual tearing.
* **Fix**: Force the sticky header onto its own dedicated GPU compositing layer:

```css
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  will-change: transform;
  transform: translateZ(0); /* Hardware acceleration fallback */
  backface-visibility: hidden;
}

```

---

**3. Stacking Context Leaks (`z-index` Failures)**

* **Cause**: A sticky header with `z-index: 9999` still slips behind other page elements (like cards, sliders, or modals) scrolling underneath it.
* **Why it happens**: An ancestor of the header (or an ancestor of the other elements) creates a new **stacking context**. Properties that trigger this include:
* `transform` (e.g., `transform: none` or CSS animations)
* `opacity` less than 1
* `filter` (e.g., `backdrop-filter`, `blur`)
* `perspective`
* `container-type`

* **Fix**: Ensure the header is not trapped inside a nested container with `transform` or `filter`. Move the `<header>` element up so it is a direct child of `<body>` or `<main>`.

---

**4. Parent Container Overflow Traps (`position: sticky` Not Sticking)**

* **Cause**: The header sticks briefly, then immediately scrolls away, or fails to stick entirely.
* **Fix**:
* Check every parent ancestor of the sticky header. If any parent has `overflow: hidden`, `overflow: auto`, or `overflow: scroll`, the sticky element is constrained to that parent's box rather than the viewport.
* Ensure the parent container has a height greater than the sticky element itself. If the parent container is only as tall as the header, the header has nowhere to stick.

---

**5. Sub-pixel Rounding and Border Jitter**

* **Cause**: When elements underneath use fractional percentage widths or scaling transforms, sticky elements can flicker or show 1px lines slipping through on high-DPI (Retina) screens.
* **Fix**: Add `outline: 1px solid transparent;` or ensure the header has an explicit solid background without sub-pixel margins:

```css
.header {
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* Prefer shadow over thin borders */
}

```

---

Are you using native CSS `position: sticky` or a JavaScript-based sticky library, and on which browser or framework is the flickering occurring?
