Here is a step-by-step breakdown of the **Critical Rendering Path (CRP)**—the sequence of steps the browser goes through to convert HTML, CSS, and JavaScript into actual pixels on the screen—along with code examples for each phase.

---

## 1. DOM Construction (Document Object Model)

The browser parses the raw HTML bytes, converts them into characters, identifies tokens, turns tokens into nodes, and links those nodes into a **DOM tree**.

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>Critical Rendering Path</title>
  </head>
  <body>
    <main class="container">
      <h1>Hello World</h1>
      <p>Understanding CRP</p>
    </main>
  </body>
</html>
```

- **Tree Structure:** `html` $\rightarrow$ (`head`, `body`) $\rightarrow$ `main` $\rightarrow$ (`h1`, `p`).
- **Key Concept:** HTML parsing is incremental. The browser can start building the DOM as soon as bytes arrive over the network.

---

## 2. CSSOM Construction (CSS Object Model)

While building the DOM, the browser encounters `<link rel="stylesheet">` tags and fetches CSS files. It converts the CSS rules into a **CSSOM tree**, which maps styles to individual nodes.

```css
/* style.css */
body {
  font-family: sans-serif;
}

.container {
  padding: 16px;
}

h1 {
  color: #2563eb;
  font-size: 24px;
}

p {
  color: #4b5563;
}
```

- **Key Concept:** CSS is **render-blocking**. The browser will not render any content until the full CSSOM is constructed, because styles cascade and can override each other.

---

## 3. JavaScript Execution & Blocking

By default, JavaScript is **parser-blocking**. When the HTML parser hits a `<script>` tag, it pauses DOM construction, fetches the script, and executes it immediately because JavaScript can mutate both the DOM and CSSOM (`document.write()`, `element.style`, etc.).

```javascript
// script.js
console.log("Parsing paused until this executes...");

// Modifying DOM/CSSOM directly
const heading = document.querySelector("h1");
if (heading) {
  heading.style.color = "#dc2626";
}
```

### Unblocking the CRP with `async` and `defer`:

To prevent JavaScript from delaying initial render, use script attributes:

```html
<!-- Loads in background, executes immediately when fetched (may block parser) -->
<script src="analytics.js" async></script>

<!-- Loads in background, executes ONLY after HTML parsing finishes (Non-blocking) -->
<script src="app.js" defer></script>
```

---

## 4. Render Tree Construction

The browser combines the **DOM** and **CSSOM** into the **Render Tree**. The Render Tree only contains nodes that are actually **visible** on the screen.

```html
<!-- HTML -->
<div class="card">
  <h2>Visible Title</h2>
  <span style="display: none;">Hidden content</span>
</div>
```

- Nodes styled with `display: none;` (and tags like `<head>`, `<script>`, `<meta>`) are **excluded** from the Render Tree.
- Nodes styled with `visibility: hidden;` **are included** in the Render Tree because they take up physical space on the layout even if invisible.

---

## 5. Layout (Reflow)

The browser calculates the exact **geometry, position, and dimensions** of every visible node in the Render Tree based on the device's viewport size.

```css
/* Layout calculations depend on viewport dimensions */
.container {
  width: 100%; /* Calculated relative to viewport width */
  max-width: 800px;
}

.box {
  width: 50%; /* Calculated as 50% of container width */
  height: 200px;
}
```

- **Triggering Reflow:** Modifying properties that affect physical dimensions (like `width`, `height`, `margin`, `padding`, `fontSize`, or DOM node insertions) forces the browser to recalculate layout positions for affected elements.

---

## 6. Paint & Composite

Once positions are calculated, the browser draws the visual elements onto screen layers and merges them together.

### Paint

The browser fills in visual details—pixels for text, colors, borders, shadows, and images—across individual layers.

```css
/* Painting operations */
.card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Expensive paint operation */
}
```

### Composite

The browser arranges painted layers in the correct order (z-index, stacking contexts) and sends them to the GPU for final rendering on the display.

```css
/* GPU-Accelerated Compositing (Triggers neither Layout nor Paint!) */
.animated-card {
  will-change: transform, opacity;
  transform: translateY(-10px); /* Hardware accelerated */
  opacity: 0.9;
}
```

---

## Summary of the Full Sequence

$$\text{HTML} \xrightarrow{} \text{DOM} \ \ \ + \ \ \ \text{CSS} \xrightarrow{} \text{CSSOM} \ \ \ \xrightarrow{} \ \ \ \text{Render Tree} \ \ \ \xrightarrow{} \ \ \ \text{Layout} \ \ \ \xrightarrow{} \ \ \ \text{Paint} \ \ \ \xrightarrow{} \ \ \ \text{Composite}$$

| Step                   | Output             | Common Bottleneck / Optimization                                         |
| ---------------------- | ------------------ | ------------------------------------------------------------------------ |
| **1. DOM**             | DOM Tree           | Minify HTML payload, avoid deep DOM nesting                              |
| **2. CSSOM**           | CSSOM Tree         | Inline critical CSS, remove unused styles                                |
| **3. JS Execution**    | Modified DOM/CSSOM | Add `defer` or `async` to non-critical script tags                       |
| **4. Render Tree**     | Render Tree Nodes  | Hide off-screen UI elements using `display: none`                        |
| **5. Layout**          | Pixel Coordinates  | Avoid layout thrashing (reading and writing DOM layout props repeatedly) |
| **6. Paint/Composite** | Screen Pixels      | Use `transform` and `opacity` for smooth 60fps CSS animations            |
