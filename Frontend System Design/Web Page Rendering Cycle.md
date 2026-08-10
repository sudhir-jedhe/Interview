Here is the English translation of the Web Page Rendering Cycle explanation:

---

# Web Page Rendering Cycle: How Browsers Render a Web Page From Start to Finish

The **Web Page Rendering Cycle** is the process through which a browser converts HTML, CSS, and JavaScript code into the actual pixels visible on your screen. This sequence is also commonly referred to as the **Critical Rendering Path (CRP)**.

The browser renders a web page from **Start to Finish** through **6 major steps**:

---

## 1. Constructing the DOM Tree

When you open a URL, the browser downloads the **HTML file** (as raw bytes) from the server.

1. **Bytes → Characters:** The browser converts bytes into characters based on the specified encoding.
2. **Characters → Tokens:** The HTML code is parsed into recognized tokens (e.g., `<html>`, `<body>`, `<h1>`).
3. **Tokens → Nodes:** Tokens are transformed into individual objects/nodes.
4. **Nodes → DOM Tree:** The parent-child relationships between these nodes are established to form the **DOM (Document Object Model)** tree.

---

## 2. Constructing the CSSOM Tree

While parsing the HTML, whenever the browser encounters a `<link rel="stylesheet">` or `<style>` tag, it downloads and parses the CSS file.

* The browser evaluates the CSS rules to construct a separate tree called the **CSSOM (CSS Object Model)**.
* **CSS is Render-Blocking:** The browser will not paint anything to the screen until the CSSOM tree is fully constructed.

---

## 3. Creating the Render Tree

Once both the DOM and CSSOM trees are built, the browser combines them to create the **Render Tree**.

* **What is included?** Only the elements that will actually be visible on the screen.
* **What is excluded?**
* Tags like `<head>`, `<script>`, and `<meta>`.
* Elements styled with `display: none` (Note: Elements with `visibility: hidden` ARE included in the render tree because they still occupy space in the layout).

---

## 4. Layout / Reflow

After the render tree is formed, the browser enters the **Layout Stage** (also known as Reflow).

* The browser calculates the size of the device's **Viewport**.
* It calculates the exact **width, height, and coordinates (positioning)** for every visible element on the screen.

---

## 5. Painting

Once layout calculations are complete, the browser starts **drawing** the elements onto the screen.

* Text, colors, borders, background images, and shadows are converted into actual screen pixels.
* To optimize performance, the browser often paints complex pages across multiple independent **Layers**.

---

## 6. Compositing

This is the final step of the rendering cycle.

* Once elements are painted on separate layers, the browser's GPU (Graphics Processing Unit) combines them in the correct stacking order (`z-index`) and draws the final image on the screen.
* CSS animations using **Transform** and **Opacity** properties run directly on the compositing stage, ensuring smooth 60 FPS animations without triggering layout or paint recalculations.

---

## Impact of JavaScript on the Rendering Cycle

JavaScript is considered a **Parser-Blocking Resource**.

* When the browser encounters a `<script>` tag during HTML parsing, it **pauses** DOM construction until the script is downloaded and executed.
* **Best Practices / Mitigation:**
* Load scripts using `<script src="..." async>` or `<script src="..." defer>`.
* The `defer` attribute defers script execution until after HTML parsing is complete, resulting in faster initial page loads.

---

## Quick Summary Flowchart

```text
HTML  ──>  DOM Tree   ──┐
                        ├──> Render Tree ──> Layout ──> Paint ──> Composite
CSS   ──>  CSSOM Tree ──┘

```
