Here is an end-to-end, interview-grade Front-End System Design reference covering the **DOM API, DOM Querying, Performance Optimization Strategies, and a Production-Grade Templating Engine Implementation.**

---

## 1. DOM Architecture & Critical API Foundations

The Document Object Model (DOM) is an object-oriented representation of an HTML document as a tree of nodes. Every HTML tag, text string, and attribute is represented as a node in this tree.

```text
                     EventTarget
                          │
                        Node
         ┌────────────────┼────────────────┐
      Element          Document       DocumentFragment
         │                │
    HTMLElement     HTMLDocument

```

### Key Interfaces & Hierarchy

1. **`EventTarget`**: Base interface implemented by all nodes to support event processing (`addEventListener`, `removeEventListener`, `dispatchEvent`).
2. **`Node`**: Base class for DOM nodes (`childNodes`, `parentNode`, `firstChild`, `nextSibling`, `appendChild`, `removeChild`, `cloneNode`).
3. **`Element`**: Extends `Node` to represent HTML elements (`children`, `firstElementChild`, `querySelector`, `getAttribute`, `classList`).
4. **`DocumentFragment`**: A lightweight, off-screen container that acts as a minimal `Document` object. Appending children to a fragment or appending a fragment to the DOM does **not** trigger a reflow/repaint until the fragment itself is injected into the active tree.

---

## 2. DOM Querying Performance & Benchmarks

Different DOM query methods use different browser engine internals. Understanding their algorithmic performance and behavior is essential for high-frequency DOM operations.

### Query Methods Comparison

| Method                          | Return Type      | Live vs. Static | Performance Profile     | Algorithm / Internal Behavior                                                             |
| ------------------------------- | ---------------- | --------------- | ----------------------- | ----------------------------------------------------------------------------------------- |
| `getElementById('id')`          | `Element         | null`           | N/A                     | **Fastest** ($O(1)$)                                                                      | Uses an internal hash map lookup maintained by the browser engine.                           |
| `getElementsByClassName('cls')` | `HTMLCollection` | **Live**        | Very Fast ($O(1)$ init) | Uses a dynamic pointer collection that updates automatically when the DOM mutates.        |
| `getElementsByTagName('tag')`   | `HTMLCollection` | **Live**        | Very Fast ($O(1)$ init) | Live collection indexed by element tag name.                                              |
| `querySelector('.cls')`         | `Element         | null`           | N/A                     | Moderate                                                                                  | Parses CSS selectors via the browser's CSS Selector Matching Engine ($O(N)$ tree traversal). |
| `querySelectorAll('.cls')`      | `NodeList`       | **Static**      | Slowest ($O(N)$)        | Traverses the entire DOM subtree, matches selectors, and returns a static snapshot array. |

> **Crucial Pitfall with Live Collections:** Iterating through a live `HTMLCollection` (e.g., `getElementsByClassName`) while modifying DOM nodes can lead to infinite loops or missed iterations because the length updates dynamically on every mutation!

---

## 3. DOM Performance Best Practices (System Design Level)

### A. Layout Thrashing (Forced Synchronous Layout)

Layout Thrashing occurs when JavaScript repeatedly writes to the DOM and then reads a geometric property in a single loop. Reading geometric properties forces the browser to synchronously recalculate layout on the spot, causing frame drops below 60 FPS.

```javascript
// ❌ BAD: Layout Thrashing (Read-Write Interleaving)
function updateWidthsBad(elements) {
  for (let i = 0; i < elements.length; i++) {
    const width = elements[i].offsetWidth; // 🔴 READ (forces synchronous layout flush)
    elements[i].style.width = `${width + 10}px`; // 🟢 WRITE (invalidates layout)
  }
}

// ✅ GOOD: Batch Reads First, Then Batch Writes
function updateWidthsGood(elements) {
  // Phase 1: Read all values
  const widths = elements.map(el => el.offsetWidth);

  // Phase 2: Write all styles in a single batch
  elements.forEach((el, index) => {
    el.style.width = `${widths[index] + 10}px`;
  });
}

```

### B. Event Delegation & Memory Management

Instead of attaching individual event listeners to hundreds of child elements (which consumes excessive memory and causes memory leaks upon node removal), attach a single listener to a common ancestor.

```javascript
// ✅ Event Delegation Pattern
document.getElementById('data-table').addEventListener('click', (event) => {
  const targetBtn = event.target.closest('.delete-btn');
  if (targetBtn && event.currentTarget.contains(targetBtn)) {
    const rowId = targetBtn.dataset.id;
    deleteRow(rowId);
  }
});

```

---

## 4. Practical Exercise: Lightweight Client-Side Template Engine

Here is a production-grade implementation of a client-side templating engine. It uses HTML `<template>` tags, parses dynamic interpolations (`{{ property }}`), handles list rendering (`data-for`), conditional rendering (`data-if`), event binding (`data-on-click`), and uses `DocumentFragment` for batch DOM updates.

### A. Template Definition (HTML)

```html
<template id="user-card-template">
  <div class="user-card" data-if="isActive">
    <h3 class="user-name">{{ name }}</h3>
    <p class="user-role">Role: {{ role }}</p>
    
    <ul class="skills-list">
      <li data-for="skill in skills" class="skill-item">{{ skill }}</li>
    </ul>

    <button data-on-click="onSelect" class="select-btn">Select User</button>
  </div>
</template>

<div id="app-container"></div>

```

### B. Template Engine Implementation (TypeScript / ES6)

```javascript
class DOMTemplateEngine {
  /**
   * Evaluates nested path in context (e.g., "user.name" -> context.user.name)
   */
  static getValue(path, context) {
    return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), context);
  }

  /**
   * Interpolates mustache variables like {{ name }} inside text nodes
   */
  static interpolateText(text, context) {
    return text.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, path) => {
      const val = this.getValue(path, context);
      return val !== undefined ? val : '';
    });
  }

  /**
   * Recursively compiles DOM node tree
   */
  static compileNode(node, context) {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent = this.interpolateText(node.textContent, context);
      return node;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return node;
    }

    const element = node;

    // 1. Process Conditionals (data-if)
    if (element.hasAttribute('data-if')) {
      const conditionPath = element.getAttribute('data-if');
      element.removeAttribute('data-if');
      const shouldRender = Boolean(this.getValue(conditionPath, context));
      if (!shouldRender) {
        element.remove();
        return null;
      }
    }

    // 2. Process Loops (data-for="item in items")
    if (element.hasAttribute('data-for')) {
      const loopExpr = element.getAttribute('data-for');
      element.removeAttribute('data-for');

      const [itemVar, listPath] = loopExpr.split(/\s+in\s+/).map(s => s.trim());
      const list = this.getValue(listPath, context) || [];

      const parent = element.parentElement;
      const fragment = document.createDocumentFragment();

      list.forEach(item => {
        const itemContext = { ...context, [itemVar]: item };
        const clonedItem = element.cloneNode(true);
        const compiledItem = this.compileNode(clonedItem, itemContext);
        if (compiledItem) {
          fragment.appendChild(compiledItem);
        }
      });

      element.remove(); // Remove template element placeholder
      parent.appendChild(fragment); // Batch injection via Fragment
      return null;
    }

    // 3. Process Event Bindings (data-on-[event]="handlerName")
    Array.from(element.attributes).forEach(attr => {
      if (attr.name.startsWith('data-on-')) {
        const eventName = attr.name.replace('data-on-', '');
        const handlerName = attr.value;
        const handler = this.getValue(handlerName, context);

        if (typeof handler === 'function') {
          element.addEventListener(eventName, (e) => handler(e, context));
        }
        element.removeAttribute(attr.name);
      }
    });

    // 4. Recursively Compile Children
    Array.from(element.childNodes).forEach(child => {
      this.compileNode(child, context);
    });

    return element;
  }

  /**
   * Renders a template into a target container
   */
  static render(templateId, targetContainer, context) {
    const template = document.getElementById(templateId);
    if (!template) throw new Error(`Template #${templateId} not found`);

    // Clone template contents into a DocumentFragment off-screen
    const fragment = template.content.cloneNode(true);

    // Compile fragment off-screen
    Array.from(fragment.childNodes).forEach(child => {
      this.compileNode(child, context);
    });

    // Single Reflow/Repaint operation upon DOM append
    targetContainer.innerHTML = '';
    targetContainer.appendChild(fragment);
  }
}

```

### C. Execution & Usage

```javascript
// Application State & Methods
const userData = {
  isActive: true,
  name: "Sudhir Jedhe",
  role: "UI Lead Architect",
  skills: ["React", "DOM Performance", "System Design", "TypeScript"],
  onSelect: (event, context) => {
    console.log(`Selected user: ${context.name}`);
    alert(`User ${context.name} selected successfully!`);
  }
};

// Render Template
const container = document.getElementById('app-container');
DOMTemplateEngine.render('user-card-template', container, userData);

```

---

## 5. Architectural Takeaways for Interviews

1. **Minimize DOM Nodes:** Every active DOM node costs memory (~1–2 KB per element instance) and increases query/recalculation times during reflows.
2. **Batch Operations with `DocumentFragment` or `requestAnimationFrame`:** Perform structural DOM updates off-screen or batch style changes inside `requestAnimationFrame()` callbacks.
3. **Prefer Virtualization for Massive Lists:** For rendering lists over 1,000 items, DOM templates alone are insufficient. Use **DOM Virtualization** (rendering only visible elements in the viewport) to keep node counts under control.

Show me how to build a Virtual Scroll / DOM Virtualization component in vanilla JavaScript for rendering huge lists efficiently.

Here is a production-ready, zero-dependency **Virtual Scroller / DOM Virtualization** engine in Vanilla JavaScript. It can render 100,000+ items smoothly at 60 FPS while keeping the DOM node count fixed to only what is visible in the viewport.

---

## 1. Architectural Concept

Instead of creating 100,000 actual DOM elements, Virtual Scrolling creates a **phantom scrollbar container** matching the full theoretical height, while keeping a **fixed pool of DOM nodes** inside the visible window plus a small buffer.

```text
┌────────────────────────────────────────┐ 0px
│ [Spacer Top: e.g., 2000px]              │ 
├────────────────────────────────────────┤ 2000px  ◄── Scroll Window Start
│ █ Item 40 (Rendered)                   │
│ █ Item 41 (Rendered)                   │ ◄── Viewport (Visible in Browser)
│ █ Item 42 (Rendered)                   │
│ █ Item 43 (Rendered)                   │
├────────────────────────────────────────┤ 2400px  ◄── Scroll Window End
│ [Spacer Bottom: e.g., 97,600px]        │
└────────────────────────────────────────┘ 100,000px Total Theoretical Height

```

---

## 2. HTML & Base CSS Setup

Create a scroll container with an inner wrapper to hold the dynamic transform offsets.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Vanilla JS Virtual Scroller</title>
  <style>
    /* Scrollport container with fixed height and overflow scroll */
    .virtual-scroll-viewport {
      height: 500px;
      width: 400px;
      border: 1px solid #ccc;
      overflow-y: auto;
      position: relative;
      background-color: #fafafa;
    }

    /* Phantom inner container establishing total height */
    .virtual-scroll-phantom {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }

    /* Container for visible nodes shifted via hardware GPU transform */
    .virtual-scroll-content {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      will-change: transform;
    }

    /* Fixed height list item styling */
    .list-item {
      height: 50px;
      box-sizing: border-box;
      padding: 0 16px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e0e0e0;
      background: #ffffff;
      font-family: sans-serif;
    }
  </style>
</head>
<body>

  <div id="virtual-scroller" class="virtual-scroll-viewport">
    <div class="virtual-scroll-phantom"></div>
    <div class="virtual-scroll-content"></div>
  </div>

  <script src="virtualScroller.js"></script>
</body>
</html>

```

---

## 3. Virtual Scroller Implementation (`virtualScroller.js`)

This class uses **`requestAnimationFrame`** throttling to eliminate scroll jitter and **`DocumentFragment`** to batch DOM mutations.

```javascript
class VirtualScroller {
  /**
   * @param {Object} options Configuration parameters
   * @param {HTMLElement} options.viewportScrollElement The scroll container element
   * @param {Array<any>} options.items The raw data array (e.g., 100,000 items)
   * @param {number} options.itemHeight Fixed pixel height of every item
   * @param {number} [options.buffer=5] Extra off-screen items to render above/below viewport
   * @param {Function} options.renderItem Function returning an HTMLElement for a data item
   */
  constructor({ viewportScrollElement, items, itemHeight, buffer = 5, renderItem }) {
    this.viewport = viewportScrollElement;
    this.phantom = this.viewport.querySelector('.virtual-scroll-phantom');
    this.content = this.viewport.querySelector('.virtual-scroll-content');
    
    this.items = items;
    this.itemHeight = itemHeight;
    this.buffer = buffer;
    this.renderItem = renderItem;

    this.rafPending = false;
    this.startIndex = -1;
    this.endIndex = -1;

    this.init();
  }

  init() {
    // 1. Calculate and set total phantom height to enable native scrollbar scale
    const totalHeight = this.items.length * this.itemHeight;
    this.phantom.style.height = `${totalHeight}px`;

    // 2. Attach scroll listener using passive scroll for frame rendering performance
    this.viewport.addEventListener('scroll', this.onScroll, { passive: true });

    // 3. Initial render
    this.update();
  }

  onScroll = () => {
    // Throttle renders to match screen refresh rate using requestAnimationFrame
    if (!this.rafPending) {
      this.rafPending = true;
      requestAnimationFrame(() => {
        this.update();
        this.rafPending = false;
      });
    }
  };

  update() {
    const scrollTop = this.viewport.scrollTop;
    const viewportHeight = this.viewport.clientHeight;

    // Calculate visible range based on scroll position
    let startIndex = Math.floor(scrollTop / this.itemHeight) - this.buffer;
    let endIndex = Math.ceil((scrollTop + viewportHeight) / this.itemHeight) + this.buffer;

    // Clamp indices within bounds
    startIndex = Math.max(0, startIndex);
    endIndex = Math.min(this.items.length, endIndex);

    // Skip DOM updates if visible range index has not changed
    if (startIndex === this.startIndex && endIndex === this.endIndex) {
      return;
    }

    this.startIndex = startIndex;
    this.endIndex = endIndex;

    this.renderRange(startIndex, endIndex);
  }

  renderRange(startIndex, endIndex) {
    const fragment = document.createDocumentFragment();

    // Render only the slice of items currently inside active buffer window
    for (let i = startIndex; i < endIndex; i++) {
      const itemData = this.items[i];
      const element = this.renderItem(itemData, i);

      // Enforce item height and key identifying dataset
      element.style.height = `${this.itemHeight}px`;
      element.dataset.index = i;

      fragment.appendChild(element);
    }

    // Shift rendered DOM nodes into view using fast GPU hardware transform
    const offsetY = startIndex * this.itemHeight;
    this.content.style.transform = `translate3d(0, ${offsetY}px, 0)`;

    // Batch replace children inside content container
    this.content.replaceChildren(fragment);
  }

  /**
   * Allows updating underlying dataset dynamically
   */
  setItems(newItems) {
    this.items = newItems;
    this.phantom.style.height = `${this.items.length * this.itemHeight}px`;
    this.startIndex = -1;
    this.endIndex = -1;
    this.update();
  }
}

// ==========================================
// Usage Example with 100,000 Items
// ==========================================

// 1. Generate massive dataset
const LARGE_DATASET = Array.from({ length: 100000 }, (_, i) => ({
  id: i + 1,
  title: `Item #${i + 1} - System Design Virtualization Data`,
}));

// 2. Instantiate Virtual Scroller
const viewportEl = document.getElementById('virtual-scroller');

const scroller = new VirtualScroller({
  viewportScrollElement: viewportEl,
  items: LARGE_DATASET,
  itemHeight: 50, // 50px item height
  buffer: 3,      // 3 extra items buffered above & below
  renderItem: (data, index) => {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `<strong>ID: ${data.id}</strong> &nbsp; - ${data.title}`;
    return div;
  }
});

```

---

## 4. Key Performance Optimizations Applied

1. **GPU-Accelerated Offsets (`translate3d`):**
Shifting the viewport content container via `transform: translate3d(0, offset, 0)` triggers **Compositing only**—bypassing the CPU Reflow and Repaint pipeline entirely during continuous scroll movements.
2. **Scroll Throttling via `requestAnimationFrame`:**
Instead of updating on every native scroll event (which can fire dozens of times per frame), updates are locked to `requestAnimationFrame()` to sync strictly with screen redraw cycles.
3. **DOM Node Count Management:**
For 100,000 items with a 500px viewport (10 visible items) plus buffer, the browser **renders only ~16 DOM nodes at any time**, keeping memory consumption flat ($O(1)$ RAM utilization regardless of list size).
4. **`replaceChildren()` & `DocumentFragment`:**
Node replacement is performed off-screen inside a `DocumentFragment` and swapped atomically via `replaceChildren()`, preventing partial DOM repaints.

Show me how to adapt a vanilla JavaScript Virtual Scroller to handle dynamic, variable item heights using binary search and position caching.

Handling variable/dynamic item heights in a virtual scroller requires shifting from fixed mathematical multiplication (`index * itemHeight`) to an **index-to-position mapping strategy**.

Since item heights are unpredictable, we maintain a **Position Cache** storing the `offset`, `height`, and `bottom` coordinates for every item, and use **Binary Search** ($O(\log N)$) to instantly find which item resides at any scroll offset (`scrollTop`).

---

## 1. Architectural Strategy

```text
Item Index:       [0]        [1]             [2]                 [3]
Height:          (40px)     (80px)          (120px)             (60px)
Offset Range:   0px - 40px | 40px - 120px | 120px - 240px     | 240px - 300px
Position Cache: [ { bottom: 40 }, { bottom: 120 }, { bottom: 240 }, { bottom: 300 } ]
                                      ▲
                           Binary Search for scrollTop = 150px
                           Returns Index 2

```

1. **Estimated Height Initialization:** Initialize all items with an estimated height (e.g., `50px`) to calculate the initial phantom scrollbar size.
2. **Dynamic Height Measurement (`ResizeObserver`):** As items enter the viewport, render them, measure their actual rendered height in the DOM, and update the position cache.
3. **Cache Invalidation:** Updating an item’s measured height shifts the offsets of all subsequent items downstream. Recalculate those offsets in $O(N)$.
4. **Binary Search for Viewport Range:** Use binary search on the cached `bottom` boundaries to locate the starting item index in $O(\log N)$ time during scrolling.

---

## 2. Dynamic Virtual Scroller Engine (`DynamicVirtualScroller.js`)

```javascript
class DynamicVirtualScroller {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.viewportScrollElement The scroll container
   * @param {Array<any>} options.items Raw dataset
   * @param {number} [options.estimatedItemHeight=50] Fallback height estimate in px
   * @param {number} [options.buffer=3] Extra items to render above/below viewport
   * @param {Function} options.renderItem Function returning an HTMLElement for an item
   */
  constructor({
    viewportScrollElement,
    items,
    estimatedItemHeight = 50,
    buffer = 3,
    renderItem
  }) {
    this.viewport = viewportScrollElement;
    this.phantom = this.viewport.querySelector('.virtual-scroll-phantom');
    this.content = this.viewport.querySelector('.virtual-scroll-content');

    this.items = items;
    this.estimatedItemHeight = estimatedItemHeight;
    this.buffer = buffer;
    this.renderItem = renderItem;

    // Cache storing offset and size metadata for every item
    // Shape: Array<{ index: number, height: number, top: number, bottom: number }>
    this.positions = [];

    this.rafPending = false;
    this.startIndex = -1;
    this.endIndex = -1;

    // ResizeObserver to automatically detect dynamic height changes of rendered nodes
    this.resizeObserver = new ResizeObserver((entries) => {
      let needsUpdate = false;

      for (const entry of entries) {
        const index = Number(entry.target.dataset.index);
        // Use borderBoxSize if available, fallback to getBoundingClientRect
        const actualHeight = entry.borderBoxSize?.[0]?.blockSize 
          || entry.target.getBoundingClientRect().height;

        if (index >= 0 && this.positions[index]) {
          const oldHeight = this.positions[index].height;
          const dHeight = actualHeight - oldHeight;

          // Update position cache if height differs from estimate/previous measurement
          if (Math.abs(dHeight) > 0.5) {
            this.positions[index].height = actualHeight;
            this.positions[index].bottom = this.positions[index].top + actualHeight;
            
            // Recalculate positions for all subsequent downstream items
            this.updatePositionsFrom(index + 1);
            needsUpdate = true;
          }
        }
      }

      if (needsUpdate) {
        this.updatePhantomHeight();
        this.update();
      }
    });

    this.init();
  }

  init() {
    this.initPositions();
    this.updatePhantomHeight();

    this.viewport.addEventListener('scroll', this.onScroll, { passive: true });
    this.update();
  }

  /**
   * Initializes position cache using estimated heights
   */
  initPositions() {
    this.positions = this.items.map((_, index) => ({
      index,
      height: this.estimatedItemHeight,
      top: index * this.estimatedItemHeight,
      bottom: (index + 1) * this.estimatedItemHeight
    }));
  }

  /**
   * Recalculates top and bottom offsets starting from a specific index after a resize
   */
  updatePositionsFrom(startIndex) {
    for (let i = startIndex; i < this.positions.length; i++) {
      const prev = this.positions[i - 1];
      this.positions[i].top = prev ? prev.bottom : 0;
      this.positions[i].bottom = this.positions[i].top + this.positions[i].height;
    }
  }

  updatePhantomHeight() {
    const totalHeight = this.positions.length 
      ? this.positions[this.positions.length - 1].bottom 
      : 0;
    this.phantom.style.height = `${totalHeight}px`;
  }

  /**
   * Binary Search O(log N) to find the first item whose bottom boundary is >= target value
   */
  binarySearchFindIndex(targetValue) {
    let low = 0;
    let high = this.positions.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midBottom = this.positions[mid].bottom;

      if (midBottom === targetValue) {
        return mid;
      } else if (midBottom < targetValue) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return low < this.positions.length ? low : this.positions.length - 1;
  }

  onScroll = () => {
    if (!this.rafPending) {
      this.rafPending = true;
      requestAnimationFrame(() => {
        this.update();
        this.rafPending = false;
      });
    }
  };

  update() {
    const scrollTop = this.viewport.scrollTop;
    const viewportHeight = this.viewport.clientHeight;

    // 1. Binary search to find start index matching scrollTop
    let startIndex = this.binarySearchFindIndex(scrollTop);
    
    // 2. Linear scan from startIndex to find end index matching (scrollTop + viewportHeight)
    let endIndex = startIndex;
    const targetBottom = scrollTop + viewportHeight;

    while (endIndex < this.positions.length && this.positions[endIndex].top < targetBottom) {
      endIndex++;
    }

    // 3. Apply buffers
    startIndex = Math.max(0, startIndex - this.buffer);
    endIndex = Math.min(this.positions.length, endIndex + this.buffer);

    // Skip DOM updates if visible window range did not change
    if (startIndex === this.startIndex && endIndex === this.endIndex) {
      return;
    }

    this.startIndex = startIndex;
    this.endIndex = endIndex;

    this.renderRange(startIndex, endIndex);
  }

  renderRange(startIndex, endIndex) {
    // Unobserve previous elements before clearing DOM
    this.resizeObserver.disconnect();

    const fragment = document.createDocumentFragment();

    for (let i = startIndex; i < endIndex; i++) {
      const itemData = this.items[i];
      const element = this.renderItem(itemData, i);

      element.dataset.index = i;
      fragment.appendChild(element);
    }

    // Offset container by top position of the first rendered node
    const offsetY = this.positions[startIndex] ? this.positions[startIndex].top : 0;
    this.content.style.transform = `translate3d(0, ${offsetY}px, 0)`;

    // Batch replace children inside content container
    this.content.replaceChildren(fragment);

    // Attach ResizeObserver to newly rendered DOM elements
    Array.from(this.content.children).forEach((child) => {
      this.resizeObserver.observe(child);
    });
  }

  /**
   * Scroll directly to any arbitrary item index smoothly
   */
  scrollToIndex(index) {
    if (index >= 0 && index < this.positions.length) {
      const targetTop = this.positions[index].top;
      this.viewport.scrollTop = targetTop;
    }
  }
}

```

---

## 3. Usage Example with Dynamic Content Heights

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dynamic Virtual Scroller</title>
  <style>
    .virtual-scroll-viewport {
      height: 500px;
      width: 450px;
      border: 1px solid #ccc;
      overflow-y: auto;
      position: relative;
      background-color: #f9f9f9;
    }

    .virtual-scroll-phantom {
      position: absolute;
      top: 0; left: 0; right: 0;
    }

    .virtual-scroll-content {
      position: absolute;
      top: 0; left: 0; right: 0;
      will-change: transform;
    }

    /* Variable height item layout */
    .dynamic-item {
      box-sizing: border-box;
      padding: 12px 16px;
      border-bottom: 1px solid #e0e0e0;
      background: #ffffff;
      font-family: system-ui, -apple-system, sans-serif;
    }

    .dynamic-item h4 {
      margin: 0 0 6px 0;
      color: #333;
    }

    .dynamic-item p {
      margin: 0;
      color: #666;
      font-size: 14px;
      line-height: 1.4;
    }
  </style>
</head>
<body>

  <div id="dynamic-scroller" class="virtual-scroll-viewport">
    <div class="virtual-scroll-phantom"></div>
    <div class="virtual-scroll-content"></div>
  </div>

  <script src="DynamicVirtualScroller.js"></script>
  <script>
    // Generate dataset with random multi-line text (unpredictable heights)
    const SAMPLE_TEXTS = [
      "Short single-line description.",
      "Medium length description spanning across multiple lines of text to test dynamic height rendering in virtual scroller.",
      "Very long text paragraph. " + "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(4),
      "Another short item."
    ];

    const DYNAMIC_DATASET = Array.from({ length: 50000 }, (_, i) => ({
      id: i + 1,
      title: `Card Item #${i + 1}`,
      body: SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)]
    }));

    const viewportEl = document.getElementById('dynamic-scroller');

    const scroller = new DynamicVirtualScroller({
      viewportScrollElement: viewportEl,
      items: DYNAMIC_DATASET,
      estimatedItemHeight: 60, // Rough initial estimate
      buffer: 4,
      renderItem: (data, index) => {
        const div = document.createElement('div');
        div.className = 'dynamic-item';
        div.innerHTML = `
          <h4>${data.title}</h4>
          <p>${data.body}</p>
        `;
        return div;
      }
    });
  </script>
</body>
</html>

```

---

## 4. Key Performance Differences: Fixed vs. Variable

| Feature                     | Fixed Height Scroller        | Variable Height Scroller                         |
| --------------------------- | ---------------------------- | ------------------------------------------------ |
| **Index-to-Offset Formula** | $O(1)$: `index * itemHeight` | $O(\log N)$ Binary search over position cache    |
| **Height Source**           | Hardcoded constant           | Measured dynamically via `ResizeObserver`        |
| **Scrollbar Accuracy**      | Exact from start             | Refines progressively as items are measured      |
| **Dom Mutations**           | `replaceChildren()`          | `replaceChildren()` + `ResizeObserver.observe()` |

Show me how to extend this Vanilla JS Virtual Scroller to support sticky section headers and grouped items.

To support sticky section headers and grouped items in a dynamic virtual scroller, we extend the dataset model into a **flat visual tree** where headers and items both exist as scrollable entries in our position cache.

When a header scrolls past the top of the viewport, we lock a single persistent **floating DOM element** at `top: 0` inside the viewport container and update its text content to match the currently active section.

---

## 1. Architectural Concept

Instead of nesting elements inside nested arrays, we flatten groups into a unified sequence containing both **Headers** and **Items**.

```text
[Header A] ──> Height: 40px (Sticky)
[Item A1]  ──> Height: 60px
[Item A2]  ──> Height: 80px
[Header B] ──> Height: 40px (Sticky)
[Item B1]  ──> Height: 50px

```

* **Virtual List Representation:** The list treats headers as regular items in the scrolling pipeline with their own height, position cache, and index.
* **Sticky Layering:** A single `<div class="sticky-header-overlay">` sits absolutely positioned over the scroll viewport. When scrolling through Section A, the overlay displays Header A. As Header B touches the top edge, CSS transforms push Header A upward until Header B snaps into place.

---

## 2. Updated HTML & CSS Setup

Add an overlay element (`.sticky-header-overlay`) inside the viewport to render the pinned section header.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Grouped Virtual Scroller with Sticky Headers</title>
  <style>
    .virtual-scroll-viewport {
      height: 500px;
      width: 450px;
      border: 1px solid #ccc;
      overflow-y: auto;
      position: relative;
      background-color: #f9f9f9;
      font-family: system-ui, -apple-system, sans-serif;
    }

    .virtual-scroll-phantom {
      position: absolute;
      top: 0; left: 0; right: 0;
    }

    .virtual-scroll-content {
      position: absolute;
      top: 0; left: 0; right: 0;
      will-change: transform;
    }

    /* Fixed overlay element sitting at top of viewport for sticky section header */
    .sticky-header-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10;
      display: none;
      pointer-events: none; /* Allows scrolling underneath */
    }

    /* Section Header Styling */
    .list-header {
      height: 40px;
      box-sizing: border-box;
      padding: 0 16px;
      background-color: #007acc;
      color: #ffffff;
      font-weight: bold;
      display: flex;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    /* List Item Styling */
    .list-item {
      box-sizing: border-box;
      padding: 12px 16px;
      border-bottom: 1px solid #e0e0e0;
      background: #ffffff;
    }
  </style>
</head>
<body>

  <div id="grouped-scroller" class="virtual-scroll-viewport">
    <div class="virtual-scroll-phantom"></div>
    <div class="virtual-scroll-content"></div>
    <div class="sticky-header-overlay"></div>
  </div>

  <script src="GroupedVirtualScroller.js"></script>
</body>
</html>

```

---

## 3. Grouped Scroller Engine (`GroupedVirtualScroller.js`)

This class builds upon dynamic binary search position caching, detects active header boundaries, and calculates smooth push-up animations when a new section header approaches the top.

```javascript
class GroupedVirtualScroller {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.viewportScrollElement
   * @param {Array<Object>} options.groups Raw grouped data: [{ header: "Group 1", items: [...] }]
   * @param {number} [options.estimatedItemHeight=50]
   * @param {number} [options.estimatedHeaderHeight=40]
   * @param {Function} options.renderItem
   * @param {Function} options.renderHeader
   */
  constructor({
    viewportScrollElement,
    groups,
    estimatedItemHeight = 50,
    estimatedHeaderHeight = 40,
    renderItem,
    renderHeader
  }) {
    this.viewport = viewportScrollElement;
    this.phantom = this.viewport.querySelector('.virtual-scroll-phantom');
    this.content = this.viewport.querySelector('.virtual-scroll-content');
    this.stickyOverlay = this.viewport.querySelector('.sticky-header-overlay');

    this.estimatedItemHeight = estimatedItemHeight;
    this.estimatedHeaderHeight = estimatedHeaderHeight;
    this.renderItem = renderItem;
    this.renderHeader = renderHeader;

    // Flatten groups into a unified sequential array
    this.flatData = this.flattenGroups(groups);
    this.positions = [];

    this.rafPending = false;
    this.startIndex = -1;
    this.endIndex = -1;
    this.activeHeaderIndex = -1;

    // ResizeObserver for dynamic height updates
    this.resizeObserver = new ResizeObserver((entries) => {
      let needsUpdate = false;

      for (const entry of entries) {
        const index = Number(entry.target.dataset.index);
        const actualHeight = entry.borderBoxSize?.[0]?.blockSize 
          || entry.target.getBoundingClientRect().height;

        if (index >= 0 && this.positions[index]) {
          const oldHeight = this.positions[index].height;
          if (Math.abs(actualHeight - oldHeight) > 0.5) {
            this.positions[index].height = actualHeight;
            this.positions[index].bottom = this.positions[index].top + actualHeight;
            this.updatePositionsFrom(index + 1);
            needsUpdate = true;
          }
        }
      }

      if (needsUpdate) {
        this.updatePhantomHeight();
        this.update();
      }
    });

    this.init();
  }

  /**
   * Flattens [{ header, items }] into flat entries marked with type
   */
  flattenGroups(groups) {
    const flat = [];
    groups.forEach((group, groupIndex) => {
      // 1. Push Header Node
      flat.push({
        type: 'HEADER',
        data: group.header,
        groupIndex
      });

      // 2. Push Child Items
      group.items.forEach((item) => {
        flat.push({
          type: 'ITEM',
          data: item,
          groupIndex
        });
      });
    });
    return flat;
  }

  init() {
    this.initPositions();
    this.updatePhantomHeight();
    this.viewport.addEventListener('scroll', this.onScroll, { passive: true });
    this.update();
  }

  initPositions() {
    let currentTop = 0;
    this.positions = this.flatData.map((entry, index) => {
      const height = entry.type === 'HEADER' ? this.estimatedHeaderHeight : this.estimatedItemHeight;
      const pos = {
        index,
        type: entry.type,
        height,
        top: currentTop,
        bottom: currentTop + height
      };
      currentTop += height;
      return pos;
    });
  }

  updatePositionsFrom(startIndex) {
    for (let i = startIndex; i < this.positions.length; i++) {
      const prev = this.positions[i - 1];
      this.positions[i].top = prev ? prev.bottom : 0;
      this.positions[i].bottom = this.positions[i].top + this.positions[i].height;
    }
  }

  updatePhantomHeight() {
    const totalHeight = this.positions.length 
      ? this.positions[this.positions.length - 1].bottom 
      : 0;
    this.phantom.style.height = `${totalHeight}px`;
  }

  binarySearchFindIndex(targetValue) {
    let low = 0;
    let high = this.positions.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midBottom = this.positions[mid].bottom;

      if (midBottom === targetValue) return mid;
      if (midBottom < targetValue) low = mid + 1;
      else high = mid - 1;
    }

    return low < this.positions.length ? low : this.positions.length - 1;
  }

  onScroll = () => {
    if (!this.rafPending) {
      this.rafPending = true;
      requestAnimationFrame(() => {
        this.update();
        this.rafPending = false;
      });
    }
  };

  update() {
    const scrollTop = this.viewport.scrollTop;
    const viewportHeight = this.viewport.clientHeight;

    // 1. Determine rendered item window range
    let startIndex = this.binarySearchFindIndex(scrollTop);
    let endIndex = startIndex;
    const targetBottom = scrollTop + viewportHeight;

    while (endIndex < this.positions.length && this.positions[endIndex].top < targetBottom) {
      endIndex++;
    }

    startIndex = Math.max(0, startIndex - 2);
    endIndex = Math.min(this.positions.length, endIndex + 2);

    // Render viewport items if range changed
    if (startIndex !== this.startIndex || endIndex !== this.endIndex) {
      this.startIndex = startIndex;
      this.endIndex = endIndex;
      this.renderRange(startIndex, endIndex);
    }

    // 2. Calculate Sticky Header position
    this.updateStickyHeader(scrollTop);
  }

  renderRange(startIndex, endIndex) {
    this.resizeObserver.disconnect();
    const fragment = document.createDocumentFragment();

    for (let i = startIndex; i < endIndex; i++) {
      const entry = this.flatData[i];
      let element;

      if (entry.type === 'HEADER') {
        element = this.renderHeader(entry.data, i);
      } else {
        element = this.renderItem(entry.data, i);
      }

      element.dataset.index = i;
      fragment.appendChild(element);
    }

    const offsetY = this.positions[startIndex] ? this.positions[startIndex].top : 0;
    this.content.style.transform = `translate3d(0, ${offsetY}px, 0)`;
    this.content.replaceChildren(fragment);

    Array.from(this.content.children).forEach((child) => {
      this.resizeObserver.observe(child);
    });
  }

  /**
   * Updates the fixed sticky header overlay and calculates push-up offset
   */
  updateStickyHeader(scrollTop) {
    // Search backward from current scrollTop to find active section header index
    let currentHeaderIndex = -1;
    const scrollIndex = this.binarySearchFindIndex(scrollTop);

    for (let i = scrollIndex; i >= 0; i--) {
      if (this.flatData[i].type === 'HEADER') {
        currentHeaderIndex = i;
        break;
      }
    }

    // If scroll position is above first header, hide sticky header
    if (currentHeaderIndex === -1) {
      this.stickyOverlay.style.display = 'none';
      this.activeHeaderIndex = -1;
      return;
    }

    // Render sticky header overlay if active section header changes
    if (this.activeHeaderIndex !== currentHeaderIndex) {
      this.activeHeaderIndex = currentHeaderIndex;
      const headerData = this.flatData[currentHeaderIndex].data;
      const headerNode = this.renderHeader(headerData, currentHeaderIndex);
      
      this.stickyOverlay.replaceChildren(headerNode);
      this.stickyOverlay.style.display = 'block';
    }

    // Find next header in list to calculate push-up transform
    let nextHeaderIndex = -1;
    for (let i = currentHeaderIndex + 1; i < this.flatData.length; i++) {
      if (this.flatData[i].type === 'HEADER') {
        nextHeaderIndex = i;
        break;
      }
    }

    let translateY = 0;
    if (nextHeaderIndex !== -1) {
      const nextHeaderTop = this.positions[nextHeaderIndex].top;
      const stickyHeight = this.positions[currentHeaderIndex].height;
      const distance = nextHeaderTop - scrollTop;

      // If next header collides with active sticky header, push active header up
      if (distance < stickyHeight) {
        translateY = distance - stickyHeight;
      }
    }

    this.stickyOverlay.style.transform = `translate3d(0, ${translateY}px, 0)`;
  }
}

```

---

## 4. Usage Example

```javascript
// 1. Generate Grouped Dataset
const GROUPED_DATA = Array.from({ length: 50 }, (_, g) => ({
  header: `Section ${String.fromCharCode(65 + (g % 26))} - Group #${g + 1}`,
  items: Array.from({ length: 15 }, (_, i) => ({
    id: `g${g}-i${i}`,
    title: `Item #${i + 1} inside Group ${g + 1}`,
    description: `Sample text content describing item ${i + 1}.`
  }))
}));

// 2. Instantiate Grouped Virtual Scroller
const viewportEl = document.getElementById('grouped-scroller');

const scroller = new GroupedVirtualScroller({
  viewportScrollElement: viewportEl,
  groups: GROUPED_DATA,
  estimatedItemHeight: 55,
  estimatedHeaderHeight: 40,
  renderHeader: (headerTitle) => {
    const div = document.createElement('div');
    div.className = 'list-header';
    div.textContent = headerTitle;
    return div;
  },
  renderItem: (itemData) => {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `
      <strong>${itemData.title}</strong>
      <p style="margin: 4px 0 0 0; color: #666; font-size: 13px;">${itemData.description}</p>
    `;
    return div;
  }
});

```

---

## 5. Architectural Key Takeaways

1. **Flat Indexing Strategy:** Flattening hierarchical groups into a single `flatData` list allows the virtual scroller to use a unified $O(\log N)$ binary search engine for all scrolling calculations without nested looping.
2. **GPU Push-Up Animation:** The sticky header collision effect (where the incoming section header smoothly pushes the active header out of view) is achieved entirely via `translate3d(0, translateY, 0)` on the overlay, avoiding layout reflows.
3. **Decoupled DOM Rendering:** The pinned header overlay is decoupled from the scrolling content tree, preventing DOM element duplication while ensuring full pointer-event pass-through (`pointer-events: none`).

Show me how to add collapsible/expandable section header functionality to this Grouped Virtual Scroller.

To add collapsible and expandable section headers, we manage a `collapsedGroupIndices` state set.

When a section header is toggled, we **re-flatten the dataset**, filtering out items belonging to collapsed groups, and **rebuild our position cache**. The binary search and rendering pipeline automatically adapt because the phantom height and item offsets update dynamically.

---

## 1. Architectural Strategy

```text
[State: Group 1 Collapsed, Group 2 Expanded]

Raw Dataset:
  Group 0 (Expanded)  --> [Header 0] [Item 0.1] [Item 0.2]
  Group 1 (Collapsed) --> [Header 1] -- (Items 1.1, 1.2 Hidden) --
  Group 2 (Expanded)  --> [Header 2] [Item 2.1]

Flattened Array (`flatData`):
  [Index 0]: Header 0  (Group 0)
  [Index 1]: Item 0.1  (Group 0)
  [Index 2]: Item 0.2  (Group 0)
  [Index 3]: Header 1  (Group 1)  <-- Clicking toggles collapse state
  [Index 4]: Header 2  (Group 2)  <-- Next entry immediately follows!
  [Index 5]: Item 2.1  (Group 2)

```

1. **State Tracking (`collapsedGroups` Set):** We store collapsed group indices in a JavaScript `Set`.
2. **Dynamic Re-flattening (`flattenGroups`):** When building `flatData`, if a group index exists inside `collapsedGroups`, we omit its items from `flatData`.
3. **Event Delegation on Headers:** We attach click event listeners to section headers (both scrolling DOM headers and the sticky overlay header) to trigger toggle calls.
4. **Cache Invalidation & Animation:** Toggling invalidates the position cache, resets the scroll calculation range, recalculates the phantom height, and immediately re-renders the viewport.

---

## 2. Updated CSS Styling

Add arrow indicators and cursor pointers to signal expand/collapse interactivity.

```css
/* Interactive Section Header Styling */
.list-header {
  height: 40px;
  box-sizing: border-box;
  padding: 0 16px;
  background-color: #007acc;
  color: #ffffff;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s ease;
}

.list-header:hover {
  background-color: #005999;
}

.list-header .chevron {
  display: inline-block;
  transition: transform 0.2s ease;
  font-size: 12px;
}

.list-header.collapsed .chevron {
  transform: rotate(-90deg);
}

.sticky-header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: none;
  /* Enable pointer events so sticky header overlay can be clicked */
  pointer-events: auto;
}

```

---

## 3. Collapsible Grouped Scroller Engine (`CollapsibleVirtualScroller.js`)

```javascript
class CollapsibleVirtualScroller {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.viewportScrollElement
   * @param {Array<Object>} options.groups Raw grouped data: [{ header: "Group 1", items: [...] }]
   * @param {number} [options.estimatedItemHeight=55]
   * @param {number} [options.estimatedHeaderHeight=40]
   * @param {Function} options.renderItem
   * @param {Function} options.renderHeader
   */
  constructor({
    viewportScrollElement,
    groups,
    estimatedItemHeight = 55,
    estimatedHeaderHeight = 40,
    renderItem,
    renderHeader
  }) {
    this.viewport = viewportScrollElement;
    this.phantom = this.viewport.querySelector('.virtual-scroll-phantom');
    this.content = this.viewport.querySelector('.virtual-scroll-content');
    this.stickyOverlay = this.viewport.querySelector('.sticky-header-overlay');

    this.rawGroups = groups;
    this.estimatedItemHeight = estimatedItemHeight;
    this.estimatedHeaderHeight = estimatedHeaderHeight;
    this.renderItem = renderItem;
    this.renderHeader = renderHeader;

    // Track collapsed group indices using a Set for O(1) lookup
    this.collapsedGroups = new Set();

    this.flatData = [];
    this.positions = [];

    this.rafPending = false;
    this.startIndex = -1;
    this.endIndex = -1;
    this.activeHeaderIndex = -1;

    // ResizeObserver for dynamic height updates
    this.resizeObserver = new ResizeObserver((entries) => {
      let needsUpdate = false;

      for (const entry of entries) {
        const index = Number(entry.target.dataset.index);
        const actualHeight = entry.borderBoxSize?.[0]?.blockSize 
          || entry.target.getBoundingClientRect().height;

        if (index >= 0 && this.positions[index]) {
          const oldHeight = this.positions[index].height;
          if (Math.abs(actualHeight - oldHeight) > 0.5) {
            this.positions[index].height = actualHeight;
            this.positions[index].bottom = this.positions[index].top + actualHeight;
            this.updatePositionsFrom(index + 1);
            needsUpdate = true;
          }
        }
      }

      if (needsUpdate) {
        this.updatePhantomHeight();
        this.update();
      }
    });

    this.init();
  }

  init() {
    this.rebuildFlatTree();

    // Event delegation on scroll viewport for header clicks
    this.viewport.addEventListener('click', this.handleHeaderClick);
    this.viewport.addEventListener('scroll', this.onScroll, { passive: true });

    this.update();
  }

  /**
   * Re-flattens group dataset based on current collapsed state
   */
  flattenGroups(groups) {
    const flat = [];
    groups.forEach((group, groupIndex) => {
      const isCollapsed = this.collapsedGroups.has(groupIndex);

      // 1. Always push Header
      flat.push({
        type: 'HEADER',
        data: group.header,
        groupIndex,
        isCollapsed,
        itemCount: group.items.length
      });

      // 2. Push items ONLY if section is expanded
      if (!isCollapsed) {
        group.items.forEach((item) => {
          flat.push({
            type: 'ITEM',
            data: item,
            groupIndex
          });
        });
      }
    });
    return flat;
  }

  /**
   * Rebuilds flat tree, position cache, and resets DOM range
   */
  rebuildFlatTree() {
    this.flatData = this.flattenGroups(this.rawGroups);
    this.initPositions();
    this.updatePhantomHeight();
    
    // Force DOM range re-render
    this.startIndex = -1;
    this.endIndex = -1;
    this.activeHeaderIndex = -1;
  }

  initPositions() {
    let currentTop = 0;
    this.positions = this.flatData.map((entry, index) => {
      const height = entry.type === 'HEADER' ? this.estimatedHeaderHeight : this.estimatedItemHeight;
      const pos = {
        index,
        type: entry.type,
        height,
        top: currentTop,
        bottom: currentTop + height
      };
      currentTop += height;
      return pos;
    });
  }

  updatePositionsFrom(startIndex) {
    for (let i = startIndex; i < this.positions.length; i++) {
      const prev = this.positions[i - 1];
      this.positions[i].top = prev ? prev.bottom : 0;
      this.positions[i].bottom = this.positions[i].top + this.positions[i].height;
    }
  }

  updatePhantomHeight() {
    const totalHeight = this.positions.length 
      ? this.positions[this.positions.length - 1].bottom 
      : 0;
    this.phantom.style.height = `${totalHeight}px`;
  }

  /**
   * Toggle expand/collapse state for a specific group index
   */
  toggleGroup(groupIndex) {
    if (this.collapsedGroups.has(groupIndex)) {
      this.collapsedGroups.delete(groupIndex);
    } else {
      this.collapsedGroups.add(groupIndex);
    }

    this.rebuildFlatTree();
    this.update();
  }

  /**
   * Click handler using event delegation
   */
  handleHeaderClick = (event) => {
    const headerEl = event.target.closest('[data-group-index]');
    if (headerEl) {
      const groupIndex = Number(headerEl.dataset.groupIndex);
      if (!isNaN(groupIndex)) {
        this.toggleGroup(groupIndex);
      }
    }
  };

  binarySearchFindIndex(targetValue) {
    let low = 0;
    let high = this.positions.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midBottom = this.positions[mid].bottom;

      if (midBottom === targetValue) return mid;
      if (midBottom < targetValue) low = mid + 1;
      else high = mid - 1;
    }

    return low < this.positions.length ? low : this.positions.length - 1;
  }

  onScroll = () => {
    if (!this.rafPending) {
      this.rafPending = true;
      requestAnimationFrame(() => {
        this.update();
        this.rafPending = false;
      });
    }
  };

  update() {
    const scrollTop = this.viewport.scrollTop;
    const viewportHeight = this.viewport.clientHeight;

    if (this.positions.length === 0) {
      this.content.replaceChildren();
      this.stickyOverlay.style.display = 'none';
      return;
    }

    // 1. Determine visible range
    let startIndex = this.binarySearchFindIndex(scrollTop);
    let endIndex = startIndex;
    const targetBottom = scrollTop + viewportHeight;

    while (endIndex < this.positions.length && this.positions[endIndex].top < targetBottom) {
      endIndex++;
    }

    startIndex = Math.max(0, startIndex - 2);
    endIndex = Math.min(this.positions.length, endIndex + 2);

    if (startIndex !== this.startIndex || endIndex !== this.endIndex) {
      this.startIndex = startIndex;
      this.endIndex = endIndex;
      this.renderRange(startIndex, endIndex);
    }

    // 2. Update Sticky Header Position
    this.updateStickyHeader(scrollTop);
  }

  renderRange(startIndex, endIndex) {
    this.resizeObserver.disconnect();
    const fragment = document.createDocumentFragment();

    for (let i = startIndex; i < endIndex; i++) {
      const entry = this.flatData[i];
      let element;

      if (entry.type === 'HEADER') {
        element = this.renderHeader(entry, i);
        element.dataset.groupIndex = entry.groupIndex;
      } else {
        element = this.renderItem(entry.data, i);
      }

      element.dataset.index = i;
      fragment.appendChild(element);
    }

    const offsetY = this.positions[startIndex] ? this.positions[startIndex].top : 0;
    this.content.style.transform = `translate3d(0, ${offsetY}px, 0)`;
    this.content.replaceChildren(fragment);

    Array.from(this.content.children).forEach((child) => {
      this.resizeObserver.observe(child);
    });
  }

  updateStickyHeader(scrollTop) {
    let currentHeaderIndex = -1;
    const scrollIndex = this.binarySearchFindIndex(scrollTop);

    for (let i = scrollIndex; i >= 0; i--) {
      if (this.flatData[i] && this.flatData[i].type === 'HEADER') {
        currentHeaderIndex = i;
        break;
      }
    }

    if (currentHeaderIndex === -1) {
      this.stickyOverlay.style.display = 'none';
      this.activeHeaderIndex = -1;
      return;
    }

    // Update sticky overlay node when section changes
    if (this.activeHeaderIndex !== currentHeaderIndex) {
      this.activeHeaderIndex = currentHeaderIndex;
      const headerEntry = this.flatData[currentHeaderIndex];
      const headerNode = this.renderHeader(headerEntry, currentHeaderIndex);
      
      headerNode.dataset.groupIndex = headerEntry.groupIndex;
      this.stickyOverlay.replaceChildren(headerNode);
      this.stickyOverlay.style.display = 'block';
    }

    // Calculate push-up transform for approaching next section header
    let nextHeaderIndex = -1;
    for (let i = currentHeaderIndex + 1; i < this.flatData.length; i++) {
      if (this.flatData[i].type === 'HEADER') {
        nextHeaderIndex = i;
        break;
      }
    }

    let translateY = 0;
    if (nextHeaderIndex !== -1) {
      const nextHeaderTop = this.positions[nextHeaderIndex].top;
      const stickyHeight = this.positions[currentHeaderIndex].height;
      const distance = nextHeaderTop - scrollTop;

      if (distance < stickyHeight) {
        translateY = distance - stickyHeight;
      }
    }

    this.stickyOverlay.style.transform = `translate3d(0, ${translateY}px, 0)`;
  }
}

```

---

## 4. Usage Example

```javascript
// 1. Generate Grouped Dataset
const COLLAPSIBLE_DATA = Array.from({ length: 40 }, (_, g) => ({
  header: `Group ${g + 1}: ${['Frontend', 'Backend', 'DevOps', 'Security'][g % 4]} Architecture`,
  items: Array.from({ length: 12 }, (_, i) => ({
    id: `g${g}-i${i}`,
    title: `Task #${i + 1} for Group ${g + 1}`,
    meta: `Priority: ${['Low', 'Medium', 'High'][i % 3]} | Status: Active`
  }))
}));

const viewportEl = document.getElementById('grouped-scroller');

const scroller = new CollapsibleVirtualScroller({
  viewportScrollElement: viewportEl,
  groups: COLLAPSIBLE_DATA,
  estimatedItemHeight: 55,
  estimatedHeaderHeight: 40,
  renderHeader: (headerEntry) => {
    const div = document.createElement('div');
    div.className = `list-header ${headerEntry.isCollapsed ? 'collapsed' : ''}`;
    div.innerHTML = `
      <span>${headerEntry.data} (${headerEntry.itemCount} items)</span>
      <span class="chevron">▼</span>
    `;
    return div;
  },
  renderItem: (itemData) => {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `
      <strong>${itemData.title}</strong>
      <p style="margin: 4px 0 0 0; color: #666; font-size: 13px;">${itemData.meta}</p>
    `;
    return div;
  }
});

```

---

## 5. Architectural Advantages

1. **Memory & CPU Efficiency:** Unused DOM nodes for collapsed sections are completely removed from `flatData` and the position cache, rather than hidden via CSS (`display: none`). This reduces $N$ in binary searches and minimizes memory consumption.
2. **Unified Interactivity:** Setting `pointer-events: auto` on the `.sticky-header-overlay` allows users to click section headers directly from the sticky overlay or within the normal scrolling flow.
3. **Seamless Virtual Height Calculation:** Collapse/expand changes trigger an instant recalculation of total scrollbar height (`phantom.style.height`), maintaining accurate scroll ratios.

Show me how to add real-time search filtering to this Collapsible Grouped Virtual Scroller.

To add real-time search filtering to our **Collapsible Grouped Virtual Scroller**, we introduce a filtering layer that processes our raw dataset before building the flat tree.

When a user types a search query:

1. We filter items matching the term across all groups.
2. Groups with no matching items are hidden.
3. Groups with matches are automatically expanded to highlight results.
4. We rebuild the position cache and update phantom height in $O(N)$.

---

## 1. Architectural Flow

```text
[Raw Dataset] ──> [Filter Engine] ──> [Collapse Manager] ──> [Flat Data Tree] ──> [Virtual Pipeline]
                        │                    │                     │
                Matches items &       Auto-expands groups     Feeds binary
                preserves headers     with active matches     search & renders

```

---

## 2. Updated HTML with Search Bar

Add an input control above the scroll viewport.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Real-Time Search Virtual Scroller</title>
  <style>
    .scroller-container {
      width: 450px;
      font-family: system-ui, -apple-system, sans-serif;
    }

    /* Search Input Styling */
    .search-input {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 14px;
      font-size: 14px;
      border: 1px solid #ccc;
      border-radius: 6px 6px 0 0;
      outline: none;
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
    }

    .search-input:focus {
      border-color: #007acc;
    }

    .virtual-scroll-viewport {
      height: 500px;
      width: 100%;
      border: 1px solid #ccc;
      border-top: none;
      border-radius: 0 0 6px 6px;
      overflow-y: auto;
      position: relative;
      background-color: #f9f9f9;
    }

    .virtual-scroll-phantom {
      position: absolute;
      top: 0; left: 0; right: 0;
    }

    .virtual-scroll-content {
      position: absolute;
      top: 0; left: 0; right: 0;
      will-change: transform;
    }

    .sticky-header-overlay {
      position: absolute;
      top: 0; left: 0; right: 0;
      z-index: 10;
      display: none;
      pointer-events: auto;
    }

    .list-header {
      height: 40px;
      box-sizing: border-box;
      padding: 0 16px;
      background-color: #007acc;
      color: #ffffff;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      user-select: none;
    }

    .list-header.collapsed .chevron {
      transform: rotate(-90deg);
    }

    .list-item {
      box-sizing: border-box;
      padding: 12px 16px;
      border-bottom: 1px solid #e0e0e0;
      background: #ffffff;
    }

    /* Highlighted text during search */
    mark {
      background-color: #ffeb3b;
      padding: 0 2px;
      border-radius: 2px;
    }
  </style>
</head>
<body>

  <div class="scroller-container">
    <input type="text" id="search-bar" class="search-input" placeholder="Search tasks or section headers..." />
    <div id="searchable-scroller" class="virtual-scroll-viewport">
      <div class="virtual-scroll-phantom"></div>
      <div class="virtual-scroll-content"></div>
      <div class="sticky-header-overlay"></div>
    </div>
  </div>

  <script src="SearchableVirtualScroller.js"></script>
</body>
</html>

```

---

## 3. Searchable Scroller Engine (`SearchableVirtualScroller.js`)

This class adds debounced search filtering, auto-expansion of matched sections, and highlight helpers.

```javascript
class SearchableVirtualScroller {
  constructor({
    viewportScrollElement,
    groups,
    estimatedItemHeight = 55,
    estimatedHeaderHeight = 40,
    renderItem,
    renderHeader
  }) {
    this.viewport = viewportScrollElement;
    this.phantom = this.viewport.querySelector('.virtual-scroll-phantom');
    this.content = this.viewport.querySelector('.virtual-scroll-content');
    this.stickyOverlay = this.viewport.querySelector('.sticky-header-overlay');

    this.rawGroups = groups;
    this.estimatedItemHeight = estimatedItemHeight;
    this.estimatedHeaderHeight = estimatedHeaderHeight;
    this.renderItem = renderItem;
    this.renderHeader = renderHeader;

    this.collapsedGroups = new Set();
    this.searchQuery = '';
    
    this.flatData = [];
    this.positions = [];

    this.rafPending = false;
    this.startIndex = -1;
    this.endIndex = -1;
    this.activeHeaderIndex = -1;

    this.resizeObserver = new ResizeObserver((entries) => {
      let needsUpdate = false;
      for (const entry of entries) {
        const index = Number(entry.target.dataset.index);
        const actualHeight = entry.borderBoxSize?.[0]?.blockSize 
          || entry.target.getBoundingClientRect().height;

        if (index >= 0 && this.positions[index]) {
          const oldHeight = this.positions[index].height;
          if (Math.abs(actualHeight - oldHeight) > 0.5) {
            this.positions[index].height = actualHeight;
            this.positions[index].bottom = this.positions[index].top + actualHeight;
            this.updatePositionsFrom(index + 1);
            needsUpdate = true;
          }
        }
      }

      if (needsUpdate) {
        this.updatePhantomHeight();
        this.update();
      }
    });

    this.init();
  }

  init() {
    this.rebuildFlatTree();
    this.viewport.addEventListener('click', this.handleHeaderClick);
    this.viewport.addEventListener('scroll', this.onScroll, { passive: true });
    this.update();
  }

  /**
   * Filter groups based on search query
   */
  getFilteredGroups() {
    if (!this.searchQuery) return this.rawGroups;

    const query = this.searchQuery.toLowerCase();

    return this.rawGroups
      .map((group) => {
        const headerMatches = group.header.toLowerCase().includes(query);
        
        // Filter items that match the search query
        const matchingItems = group.items.filter((item) => {
          return (
            item.title.toLowerCase().includes(query) ||
            (item.meta && item.meta.toLowerCase().includes(query))
          );
        });

        // Keep section if header matches OR if any item inside matches
        if (headerMatches) {
          return group; // Keep all items if header matches
        } else if (matchingItems.length > 0) {
          return { ...group, items: matchingItems };
        }

        return null;
      })
      .filter(Boolean);
  }

  /**
   * Flatten filtered dataset and manage auto-expansion during search
   */
  flattenGroups(groups) {
    const flat = [];
    const isSearching = Boolean(this.searchQuery);

    groups.forEach((group, groupIndex) => {
      // Auto-expand all matching sections during search query
      const isCollapsed = isSearching ? false : this.collapsedGroups.has(groupIndex);

      flat.push({
        type: 'HEADER',
        data: group.header,
        groupIndex,
        isCollapsed,
        itemCount: group.items.length
      });

      if (!isCollapsed) {
        group.items.forEach((item) => {
          flat.push({
            type: 'ITEM',
            data: item,
            groupIndex
          });
        });
      }
    });
    return flat;
  }

  rebuildFlatTree() {
    const filteredGroups = this.getFilteredGroups();
    this.flatData = this.flattenGroups(filteredGroups);
    this.initPositions();
    this.updatePhantomHeight();

    // Reset viewport and scroll position back to top when query changes
    this.viewport.scrollTop = 0;
    this.startIndex = -1;
    this.endIndex = -1;
    this.activeHeaderIndex = -1;
  }

  initPositions() {
    let currentTop = 0;
    this.positions = this.flatData.map((entry, index) => {
      const height = entry.type === 'HEADER' ? this.estimatedHeaderHeight : this.estimatedItemHeight;
      const pos = {
        index,
        type: entry.type,
        height,
        top: currentTop,
        bottom: currentTop + height
      };
      currentTop += height;
      return pos;
    });
  }

  updatePositionsFrom(startIndex) {
    for (let i = startIndex; i < this.positions.length; i++) {
      const prev = this.positions[i - 1];
      this.positions[i].top = prev ? prev.bottom : 0;
      this.positions[i].bottom = this.positions[i].top + this.positions[i].height;
    }
  }

  updatePhantomHeight() {
    const totalHeight = this.positions.length 
      ? this.positions[this.positions.length - 1].bottom 
      : 0;
    this.phantom.style.height = `${totalHeight}px`;
  }

  /**
   * Real-time search handler with debouncing option
   */
  setSearchQuery(query) {
    this.searchQuery = query.trim();
    this.rebuildFlatTree();
    this.update();
  }

  toggleGroup(groupIndex) {
    // Disable manual toggling during active search
    if (this.searchQuery) return;

    if (this.collapsedGroups.has(groupIndex)) {
      this.collapsedGroups.delete(groupIndex);
    } else {
      this.collapsedGroups.add(groupIndex);
    }

    this.rebuildFlatTree();
    this.update();
  }

  handleHeaderClick = (event) => {
    const headerEl = event.target.closest('[data-group-index]');
    if (headerEl) {
      const groupIndex = Number(headerEl.dataset.groupIndex);
      if (!isNaN(groupIndex)) {
        this.toggleGroup(groupIndex);
      }
    }
  };

  binarySearchFindIndex(targetValue) {
    let low = 0;
    let high = this.positions.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midBottom = this.positions[mid].bottom;

      if (midBottom === targetValue) return mid;
      if (midBottom < targetValue) low = mid + 1;
      else high = mid - 1;
    }

    return low < this.positions.length ? low : this.positions.length - 1;
  }

  onScroll = () => {
    if (!this.rafPending) {
      this.rafPending = true;
      requestAnimationFrame(() => {
        this.update();
        this.rafPending = false;
      });
    }
  };

  update() {
    const scrollTop = this.viewport.scrollTop;
    const viewportHeight = this.viewport.clientHeight;

    if (this.positions.length === 0) {
      this.content.replaceChildren();
      this.stickyOverlay.style.display = 'none';
      return;
    }

    let startIndex = this.binarySearchFindIndex(scrollTop);
    let endIndex = startIndex;
    const targetBottom = scrollTop + viewportHeight;

    while (endIndex < this.positions.length && this.positions[endIndex].top < targetBottom) {
      endIndex++;
    }

    startIndex = Math.max(0, startIndex - 2);
    endIndex = Math.min(this.positions.length, endIndex + 2);

    if (startIndex !== this.startIndex || endIndex !== this.endIndex) {
      this.startIndex = startIndex;
      this.endIndex = endIndex;
      this.renderRange(startIndex, endIndex);
    }

    this.updateStickyHeader(scrollTop);
  }

  renderRange(startIndex, endIndex) {
    this.resizeObserver.disconnect();
    const fragment = document.createDocumentFragment();

    for (let i = startIndex; i < endIndex; i++) {
      const entry = this.flatData[i];
      let element;

      if (entry.type === 'HEADER') {
        element = this.renderHeader(entry, this.searchQuery);
        element.dataset.groupIndex = entry.groupIndex;
      } else {
        element = this.renderItem(entry.data, this.searchQuery);
      }

      element.dataset.index = i;
      fragment.appendChild(element);
    }

    const offsetY = this.positions[startIndex] ? this.positions[startIndex].top : 0;
    this.content.style.transform = `translate3d(0, ${offsetY}px, 0)`;
    this.content.replaceChildren(fragment);

    Array.from(this.content.children).forEach((child) => {
      this.resizeObserver.observe(child);
    });
  }

  updateStickyHeader(scrollTop) {
    let currentHeaderIndex = -1;
    const scrollIndex = this.binarySearchFindIndex(scrollTop);

    for (let i = scrollIndex; i >= 0; i--) {
      if (this.flatData[i] && this.flatData[i].type === 'HEADER') {
        currentHeaderIndex = i;
        break;
      }
    }

    if (currentHeaderIndex === -1) {
      this.stickyOverlay.style.display = 'none';
      this.activeHeaderIndex = -1;
      return;
    }

    if (this.activeHeaderIndex !== currentHeaderIndex) {
      this.activeHeaderIndex = currentHeaderIndex;
      const headerEntry = this.flatData[currentHeaderIndex];
      const headerNode = this.renderHeader(headerEntry, this.searchQuery);
      
      headerNode.dataset.groupIndex = headerEntry.groupIndex;
      this.stickyOverlay.replaceChildren(headerNode);
      this.stickyOverlay.style.display = 'block';
    }

    let nextHeaderIndex = -1;
    for (let i = currentHeaderIndex + 1; i < this.flatData.length; i++) {
      if (this.flatData[i].type === 'HEADER') {
        nextHeaderIndex = i;
        break;
      }
    }

    let translateY = 0;
    if (nextHeaderIndex !== -1) {
      const nextHeaderTop = this.positions[nextHeaderIndex].top;
      const stickyHeight = this.positions[currentHeaderIndex].height;
      const distance = nextHeaderTop - scrollTop;

      if (distance < stickyHeight) {
        translateY = distance - stickyHeight;
      }
    }

    this.stickyOverlay.style.transform = `translate3d(0, ${translateY}px, 0)`;
  }
}

```

---

## 4. Execution & Highlight Helper Setup

```javascript
// Helper function to highlight matching text occurrences inside rendered items
function highlightText(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

// 1. Dataset Generation
const SEARCHABLE_DATA = Array.from({ length: 30 }, (_, g) => ({
  header: `Module ${g + 1}: ${['React Engine', 'Virtual DOM', 'Vite Bundler', 'Web Worker'][g % 4]} Options`,
  items: Array.from({ length: 15 }, (_, i) => ({
    id: `g${g}-i${i}`,
    title: `Optimization Step #${i + 1}`,
    meta: `Configure ${['memory management', 'tree shaking', 'lazy loading', 'code splitting'][i % 4]} pipeline.`
  }))
}));

// 2. Instantiate Scroller
const viewportEl = document.getElementById('searchable-scroller');

const scroller = new SearchableVirtualScroller({
  viewportScrollElement: viewportEl,
  groups: SEARCHABLE_DATA,
  estimatedItemHeight: 55,
  estimatedHeaderHeight: 40,
  renderHeader: (headerEntry, query) => {
    const div = document.createElement('div');
    div.className = `list-header ${headerEntry.isCollapsed ? 'collapsed' : ''}`;
    div.innerHTML = `
      <span>${highlightText(headerEntry.data, query)} (${headerEntry.itemCount} items)</span>
      <span class="chevron">▼</span>
    `;
    return div;
  },
  renderItem: (itemData, query) => {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `
      <strong>${highlightText(itemData.title, query)}</strong>
      <p style="margin: 4px 0 0 0; color: #666; font-size: 13px;">${highlightText(itemData.meta, query)}</p>
    `;
    return div;
  }
});

// 3. Attach Debounced Input Listener
const searchInput = document.getElementById('search-bar');
let debounceTimer;

searchInput.addEventListener('input', (e) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    scroller.setSearchQuery(e.target.value);
  }, 150); // 150ms debounce
});

```

---

## 5. Architectural Key Points

1. **Auto-Expanding Matched Sections:** When a search term is present, groups containing matching items automatically expand (`isCollapsed = false`), ensuring results are immediately visible without user interaction.
2. **Dynamic Phantom Recalculation:** Filtering out non-matching groups dynamically shrinks the phantom scrollbar size, maintaining accurate scroll ratios.
3. **High-Performance Text Highlighting:** The search query is passed into the renderer, enabling inline text highlighting (`<mark>`) directly during active viewport DOM node construction.
