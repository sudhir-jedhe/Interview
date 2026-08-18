When an above-the-fold LCP (Largest Contentful Paint) image is discovered late by the browser, the issue almost always comes down to **bypassing or delaying the browser’s HTML Preload Scanner**.

The browser’s preload scanner reads raw HTML bytes as they stream in to fetch critical subresources before the full DOM and CSSOM are built. If the image reference is hidden from this scanner, resource discovery is blocked.

Here are the primary root causes:

---

### 1. Loaded via CSS `background-image` (The CSSOM Blocker)

If the hero image is declared in CSS rather than an HTML `<img>` tag:

```css
.hero-banner {
  background-image: url('/images/hero.webp');
}

```

* **Why it delays discovery:** The preload scanner parses HTML, not external stylesheets.
* **The Waterfall Delay:** The browser must fetch the HTML $\rightarrow$ discover and download external CSS $\rightarrow$ parse CSS and build the CSSOM $\rightarrow$ match selectors to DOM nodes $\rightarrow$ confirm the node is visible $\rightarrow$ **finally trigger the image request**.

---

### 2. Injected Dynamically by JavaScript (Client-Side Rendering)

In Single-Page Applications (React, Vue, Angular) without SSR:

* The initial server HTML payload contains only an empty `<div id="root"></div>`.
* The `<img>` tag does not exist until the main JavaScript bundle is fetched, parsed, executed, and any prerequisite API calls resolve.

---

### 3. Accidental `loading="lazy"` on the Hero Image

Setting `loading="lazy"` on an above-the-fold image actively instructs the browser to defer the request:

```html
<!-- ❌ Anti-pattern on above-the-fold images -->
<img src="/hero.webp" loading="lazy" alt="Hero" />

```

* **Why it delays discovery:** The browser halts the fetch until the layout engine runs and calculates the element's exact pixel position relative to the viewport.

---

### 4. Missing `fetchpriority="high"` (Resource Contention)

By default, the browser discovers images with **Low** priority until layout completes and verifies they are in the viewport.

* If early HTML contains multiple scripts, stylesheets, or web fonts, the browser queues the LCP image behind those assets unless priority is explicitly promoted.

---

### 5. Hidden Inside Web Components or Shadow DOM

* HTML preload scanners cannot evaluate custom elements, `<template>` contents, or Shadow DOM roots until the associated JavaScript registers and attaches them to the active document tree.

---

### 6. Embedded in Client-Side Carousel / Slider Libraries

Many carousel libraries use data attributes (`data-src` or `data-lazy`) to prevent loading off-screen slides:

```html
<img data-src="/hero.webp" class="swiper-lazy" />

```

* The preload scanner ignores `data-src`, delaying the download until the carousel script executes and swaps `data-src` to `src`.

---

### Diagnostic Comparison

| Implementation Pattern                             | Discovery Phase                    | Discovery Delay                    |
| -------------------------------------------------- | ---------------------------------- | ---------------------------------- |
| **Standard HTML `<img>` + `fetchpriority="high"**` | HTML Preload Scanner (Streaming)   | **$\sim 0\text{ ms}$ (Immediate)** |
| **`<img>` with `loading="lazy"**`                  | Post-Layout Phase                  | $+100\text{–}300\text{ ms}$        |
| **CSS `background-image**`                         | CSSOM Match & Tree Construction    | $+200\text{–}600\text{ ms}$        |
| **Client-Side JS (`<img />` in React/Vue)**        | Post-JS Execution & API Resolution | $+500\text{–}1500+\text{ ms}$      |

---

### How to Fix Late LCP Image Discovery

#### 1. Use a Native HTML `<img>` or `<picture>` Tag with `fetchpriority="high"`

```html
<img
  src="/images/hero-1200.webp"
  srcset="/images/hero-600.webp 600w, /images/hero-1200.webp 1200w"
  sizes="(max-width: 768px) 100vw, 1200px"
  alt="Main product showcase"
  fetchpriority="high"
  decoding="async"
  width="1200"
  height="600"
/>

```

#### 2. Preload the Image in HTML `<head>` (If Rendered via CSS or CSR)

If the image must reside in CSS or depends on client-side rendering, add an explicit preload link at the top of `<head>`:

```html
<link
  rel="preload"
  as="image"
  href="/images/hero.webp"
  fetchpriority="high"
/>

```

For responsive images:

```html
<link
  rel="preload"
  as="image"
  href="/images/hero-1200.webp"
  imagesrcset="/images/hero-600.webp 600w, /images/hero-1200.webp 1200w"
  imagesizes="100vw"
  fetchpriority="high"
/>

```

#### 3. Send 103 Early Hints from the Edge/Server

Configure your CDN or server to emit `103 Early Hints` with the `Link` preload header while the main document HTML is still being generated.
