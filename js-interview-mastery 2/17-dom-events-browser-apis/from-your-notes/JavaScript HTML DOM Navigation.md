**HTML DOM Navigation** allows you to navigate through the HTML document structure using node relationships. In the DOM tree, every part of an HTML document (elements, text, attributes, comments) is represented as a **node**.

---

## 1. The DOM Node Tree Structure

The document forms a hierarchical tree where nodes are related as **Parents**, **Children**, and **Siblings**:

```text
               ┌────────────────┐
               │    Document    │
               └───────┬────────┘
                       │
               ┌───────▼────────┐
               │  <html> (Root) │
               └───────┬────────┘
             ┌─────────┴─────────┐
             ▼                   ▼
      ┌────────────┐      ┌────────────┐
      │  <head>    │      │   <body>   │
      └────────────┘      └──────┬─────┘
                                 │
                          ┌──────▼──────┐
                          │  <div id>   │
                          └──────┬──────┘
                       ┌─────────┴─────────┐
                       ▼                   ▼
                 ┌───────────┐       ┌───────────┐
                 │ <h1>      │       │ <p>       │
                 └───────────┘       └───────────┘

```

---

## 2. Element Navigation vs. Node Navigation

When navigating the DOM, there are two distinct sets of properties:

1. **Element-Only Navigation (Recommended):** Ignores whitespace, line breaks, and text nodes. It navigates strictly between HTML element tags (e.g., `<div>`, `<p>`).
2. **All-Node Navigation:** Navigates *every* node type, including empty whitespace text nodes and HTML comments.

### Comparison Table

| Navigation Goal      | Element-Only (Ignores Whitespace) | All-Node Type (Includes Text/Comments) |
| -------------------- | --------------------------------- | -------------------------------------- |
| **Parent**           | `element.parentElement`           | `node.parentNode`                      |
| **Children List**    | `element.children`                | `node.childNodes`                      |
| **First Child**      | `element.firstElementChild`       | `node.firstChild`                      |
| **Last Child**       | `element.lastElementChild`        | `node.lastChild`                       |
| **Next Sibling**     | `element.nextElementSibling`      | `node.nextSibling`                     |
| **Previous Sibling** | `element.previousElementSibling`  | `node.previousSibling`                 |

---

## 3. Practical Code Examples

### A. Navigating Parent and Child Elements

```html
<div id="container">
  <h1 id="title">DOM Navigation</h1>
  <p id="description">Navigating through elements.</p>
</div>

<script>
  const title = document.getElementById("title");

  // 1. Get Parent Element
  const parent = title.parentElement;
  console.log(parent.id); // "container"

  // 2. Get All Child Elements of Parent
  const container = document.getElementById("container");
  console.log(container.children.length); // 2
  console.log(container.firstElementChild.textContent); // "DOM Navigation"
  console.log(container.lastElementChild.textContent);  // "Navigating through elements."
</script>

```

---

### B. Navigating Between Siblings

```html
<ul>
  <li id="item1">Item 1</li>
  <li id="item2">Item 2</li>
  <li id="item3">Item 3</li>
</ul>

<script>
  const item2 = document.getElementById("item2");

  // Navigate to Next Sibling
  const nextItem = item2.nextElementSibling;
  console.log(nextItem.textContent); // "Item 3"

  // Navigate to Previous Sibling
  const prevItem = item2.previousElementSibling;
  console.log(prevItem.textContent); // "Item 1"
</script>

```

---

### C. Iterating Through Children (`HTMLCollection` vs `NodeList`)

* `element.children` returns an **`HTMLCollection`** (live list of elements).
* `node.childNodes` or `document.querySelectorAll()` returns a **`NodeList`**.

```javascript
const listContainer = document.getElementById("container");

// Using Array.from to convert HTMLCollection for iteration
Array.from(listContainer.children).forEach((child, index) => {
  console.log(`Child ${index}:`, child.tagName);
});

```

---

## 4. Why You Should Prefer Element Navigation

HTML formatting often contains line breaks and indentations. The browser parses these spaces as **`#text` nodes**.

```html
<!-- Line breaks create whitespace text nodes -->
<div id="box">
  <p>Hello</p>
</div>

<script>
  const box = document.getElementById("box");

  // ❌ All-Node: Returns a #text node (the newline between <div> and <p>)
  console.log(box.firstChild); // #text

  // ✅ Element-Only: Skips whitespace and targets the <p> tag directly
  console.log(box.firstElementChild); // <p>Hello</p>
</script>

```

---

## 5. Node Properties Reference

Every node in the DOM tree exposes three key diagnostic properties:

* **`nodeName`:** Returns the uppercase tag name for elements (`"DIV"`), `"#text"` for text nodes, or `"#document"`.
* **`nodeType`:** Returns an integer representing the type:
* `1` = Element node (`ELEMENT_NODE`)
* `3` = Text node (`TEXT_NODE`)
* `8` = Comment node (`COMMENT_NODE`)
* `9` = Document node (`DOCUMENT_NODE`)

* **`nodeValue`:** Returns `null` for elements, or the text content string for text/comment nodes.

Explain how to create, remove, clone, and append DOM elements in JavaScript with code examples

Dynamic DOM manipulation—creating, appending, cloning, and removing elements—is fundamental to building dynamic user interfaces in vanilla JavaScript.

---

## 1. Creating Elements (`document.createElement`)

To create a new HTML element, pass the tag name to `document.createElement()`. You can then configure attributes, classes, styles, and content before inserting it into the DOM.

```javascript
// 1. Create a new <div> element
const card = document.createElement("div");

// 2. Set attributes and classes
card.className = "card profile-card";
card.id = "user-101";
card.setAttribute("data-role", "admin");

// 3. Add content using textContent (prevents XSS) or innerHTML
card.textContent = "Welcome back, Alice!";

```

> **Security Tip:** Use `.textContent` when injecting plain text to prevent Cross-Site Scripting (XSS) attacks. Use `.innerHTML` only when injecting sanitized HTML strings.

---

## 2. Appending Elements (`append` vs `appendChild`)

Once an element is created in memory, you insert it into the DOM using `append()`, `appendChild()`, or `prepend()`.

### A. Inserting at the End (`append` vs `appendChild`)

| Feature             | `element.appendChild()`   | `element.append()` (Modern)            |
| ------------------- | ------------------------- | -------------------------------------- |
| **Accepts Strings** | ❌ No (Node objects only)  | ✅ Yes (Appends text directly)          |
| **Multiple Items**  | ❌ No (1 Node at a time)   | ✅ Yes (Appends multiple Nodes/strings) |
| **Return Value**    | Returns the appended Node | Returns `undefined`                    |

```javascript
const container = document.getElementById("container");

// Using appendChild (Classic)
const p = document.createElement("p");
p.textContent = "Paragraph 1";
container.appendChild(p);

// Using append (Modern & Flexible)
const h2 = document.createElement("h2");
h2.textContent = "Title";

// Appends multiple elements AND raw strings in one call
container.append(h2, "Some raw text string", p);

```

### B. Other Insertion Methods

```javascript
const list = document.querySelector("ul");

// 1. Prepend: Inserts at the VERY BEGINNING of parent
const firstItem = document.createElement("li");
firstItem.textContent = "First Item";
list.prepend(firstItem);

// 2. insertBefore: Inserts BEFORE a specific child element
const newMiddleItem = document.createElement("li");
newMiddleItem.textContent = "Middle Item";
const referenceItem = list.children[1]; // Target second <li>

list.insertBefore(newMiddleItem, referenceItem);

```

---

## 3. Cloning Elements (`cloneNode`)

To duplicate an existing DOM node, use `.cloneNode()`.

* `cloneNode(false)` (Shallow clone): Copies only the element tag and its attributes, ignoring child elements and inner text.
* `cloneNode(true)` (Deep clone): Copies the element, its attributes, and all child nodes/content recursively.

```javascript
const originalCard = document.querySelector(".card");

// Deep clone: Copies <div class="card"> AND all nested children/text
const clonedCard = originalCard.cloneNode(true);

// Update ID on clone to avoid duplicate IDs in DOM
clonedCard.id = "user-102";
clonedCard.querySelector("h2").textContent = "Cloned User Card";

// Append clone to document
document.body.append(clonedCard);

```

---

## 4. Removing Elements (`remove` vs `removeChild`)

### A. Direct Removal (`element.remove()`)

Modern and direct: Call `.remove()` on the target element itself.

```javascript
const notification = document.getElementById("alert-box");

// Removes element directly from DOM
notification.remove();

```

### B. Parent-Based Removal (`parent.removeChild()`)

Legacy approach: Call `.removeChild()` on the parent element, passing the target node.

```javascript
const parentContainer = document.getElementById("container");
const childToRemove = document.getElementById("old-banner");

// Removes child and returns the removed node reference
const removedNode = parentContainer.removeChild(childToRemove);

```

---

## 5. Complete Practical Workflow Example

Here is a full interactive component demonstrating creation, cloning, appending, and deletion:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>DOM Operations Demo</title>
  <style>
    .task-item { display: flex; gap: 10px; margin: 5px 0; align-items: center; }
  </style>
</head>
<body>
  <h2>Task List Manager</h2>
  <button id="add-btn">Add Task</button>
  <ul id="task-list"></ul>

  <script>
    const taskList = document.getElementById("task-list");
    const addBtn = document.getElementById("add-btn");
    let taskCounter = 1;

    // 1. CREATE & APPEND TASK
    function createTask(text) {
      const li = document.createElement("li");
      li.className = "task-item";

      const span = document.createElement("span");
      span.textContent = text;

      // Create Duplicate/Clone Button
      const cloneBtn = document.createElement("button");
      cloneBtn.textContent = "📋 Clone";
      cloneBtn.onclick = () => cloneTask(li);

      // Create Delete Button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "❌ Delete";
      deleteBtn.onclick = () => li.remove(); // REMOVE ELEMENT

      // APPEND children to <li>
      li.append(span, cloneBtn, deleteBtn);
      
      // APPEND <li> to <ul>
      taskList.append(li);
    }

    // 2. CLONE TASK
    function cloneTask(taskElement) {
      // Deep clone the existing <li>
      const clonedLi = taskElement.cloneNode(true);

      // Re-attach event listeners (cloneNode does NOT preserve JS event listeners)
      clonedLi.querySelector("button:nth-of-type(1)").onclick = () => cloneTask(clonedLi);
      clonedLi.querySelector("button:nth-of-type(2)").onclick = () => clonedLi.remove();

      taskList.append(clonedLi);
    }

    addBtn.addEventListener("click", () => {
      createTask(`Task item #${taskCounter++}`);
    });
  </script>
</body>
</html>

```

Explain DOM Event Bubbling, Capturing, and Event Delegation in JavaScript with code examples

Event propagation in the DOM determines the exact sequence in which event listeners fire when an interaction (like a click) occurs on an element. Understanding **Bubbling**, **Capturing**, and **Event Delegation** is essential for managing user interactions efficiently.

---

## 1. The 3 Phases of DOM Event Propagation

When you click an element nested deep inside the DOM, the event doesn't just fire on that single element. It travels through the document in **3 distinct phases**:

```text
               ┌───────────────────────────────┐
               │          Window / Document    │
               └───────────────┬───────────────┘
                        ▲      │      │
                        │      │      │ Phase 1: Capturing Phase
                        │      │      │ (Trickles down from top)
                        │      ▼      │
               ┌────────┴──────────────┐
               │       <div id="parent">│
               └────────┴──────────────┘
                        ▲      │
  Phase 3: Bubbling     │      │
  (Bubbles back up)     │      ▼
               ┌────────┴──────────────┐
               │     <button id="child">│  ◄── Phase 2: Target Phase
               └───────────────────────┘

```

1. **Capturing Phase (Trickling):** The event starts at the top of the DOM tree (`window` $\rightarrow$ `document` $\rightarrow$ `<html>` $\rightarrow$ `<body>`) and trickles down towards the target element.
2. **Target Phase:** The event arrives directly at the element that received the user action (e.g., the clicked `<button>`).
3. **Bubbling Phase:** The event bubbles back up from the target element all the way to `window`, triggering listeners along the way.

---

## 2. Event Bubbling vs. Capturing in Code

By default, event listeners registered with `addEventListener(type, listener)` trigger during the **Bubbling Phase**. You can force a listener to run during the **Capturing Phase** by passing `{ capture: true }` (or `true`) as the 3rd argument.

```html
<div id="parent" style="padding: 20px; background: lightblue;">
  <button id="child">Click Me</button>
</div>

<script>
  const parent = document.getElementById("parent");
  const child = document.getElementById("child");

  // 1. Bubbling Listener (Default)
  parent.addEventListener("click", () => {
    console.log("Parent Clicked (Bubbling)");
  }, false);

  // 2. Capturing Listener
  parent.addEventListener("click", () => {
    console.log("Parent Clicked (Capturing)");
  }, { capture: true });

  // 3. Target Listener
  child.addEventListener("click", () => {
    console.log("Child Button Clicked");
  });
</script>

```

### Execution Order when the Button is clicked

1. `Parent Clicked (Capturing)` — (Fires first as event trickles down)
2. `Child Button Clicked` — (Target phase)
3. `Parent Clicked (Bubbling)` — (Fires last as event bubbles back up)

---

## 3. Stopping Event Propagation (`stopPropagation`)

If you want to prevent an event from bubbling up to parent containers, call `event.stopPropagation()`.

```javascript
child.addEventListener("click", (event) => {
  event.stopPropagation(); // Stops the event from bubbling up to parent
  console.log("Child clicked. Bubbling stopped!");
});

parent.addEventListener("click", () => {
  console.log("This will NOT run when the child button is clicked.");
});

```

---

## 4. Event Delegation (The Power Pattern)

**Event Delegation** is a performance optimization technique that leverages event bubbling.

Instead of adding separate event listeners to dozens or hundreds of individual child elements, you attach **a single event listener to a common parent element**. The parent uses `event.target` to determine which child was clicked.

### Why Use Event Delegation?

* **Memory Efficiency:** Uses 1 event listener instead of hundreds.
* **Dynamic Elements:** Automatically works for newly added DOM elements created after page load without re-attaching listeners.

---

### Code Example: Without Event Delegation (Bad)

Adding listeners to every `<li>` consumes extra memory and fails when new `<li>` items are dynamically appended:

```javascript
// ❌ Inefficient: Attaches N separate listeners
document.querySelectorAll("li").forEach((item) => {
  item.addEventListener("click", (e) => {
    console.log("Clicked:", e.target.textContent);
  });
});

```

---

### Code Example: With Event Delegation (Best Practice)

Attach a single listener to the parent `<ul>` and inspect `event.target`:

```html
<ul id="shopping-list">
  <li data-item="apple">🍎 Apple</li>
  <li data-item="banana">🍌 Banana</li>
  <li data-item="cherry">🍒 Cherry</li>
</ul>

<button id="add-btn">Add Item</button>

<script>
  const list = document.getElementById("shopping-list");
  const addBtn = document.getElementById("add-btn");

  // ✅ Efficient: 1 listener handles all current AND future <li> elements
  list.addEventListener("click", (event) => {
    // Check if the clicked element matches the child selector
    const targetItem = event.target.closest("li");

    if (targetItem && list.contains(targetItem)) {
      console.log("Delegated Click Detected:", targetItem.textContent);
    }
  });

  // Dynamically add a new item to prove delegation works automatically
  addBtn.addEventListener("click", () => {
    const newItem = document.createElement("li");
    newItem.textContent = "🥭 Mango";
    list.append(newItem); // Automatically clickable without adding a new listener!
  });
</script>

```

---

## Summary Comparison

| Concept              | Direction                                    | How to Enable / Use                                  | Primary Benefit                                               |
| -------------------- | -------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------- |
| **Capturing**        | Top $\rightarrow$ Down (`window` to target)  | `addEventListener('click', fn, { capture: true })`   | Intercepting events before they reach targets.                |
| **Bubbling**         | Bottom $\rightarrow$ Up (target to `window`) | `addEventListener('click', fn)` (Default)            | Enables event delegation patterns.                            |
| **Event Delegation** | Leverages Bubbling                           | Single listener on parent + `event.target.closest()` | Drastically lowers memory usage and handles dynamic elements. |

Explain MutationObserver in JavaScript with code examples

`MutationObserver` is a built-in Web API that allows you to watch for changes in the DOM tree. It acts as an asynchronous listener that fires a callback whenever nodes are added, removed, or modified, or when element attributes/text content change.

It replaced legacy `MutationEvents` (such as `DOMNodeInserted`), providing significantly better performance because it **batches changes asynchronously** instead of blocking the main thread on every individual DOM modification.

---

## 1. Basic Lifecycle of a `MutationObserver`

Using `MutationObserver` follows a 3-step lifecycle:

1. **Instantiate:** Create an observer instance with a callback function.
2. **Observe:** Call `.observe(targetNode, options)` specifying which target element and types of mutations to watch.
3. **Disconnect / Clean Up:** Call `.disconnect()` when finished to prevent memory leaks.

```javascript
// 1. Create callback function
const callback = (mutationsList, observer) => {
  for (const mutation of mutationsList) {
    console.log("Mutation detected:", mutation.type);
  }
};

// 2. Instantiate observer
const observer = new MutationObserver(callback);

// 3. Start observing a target element
const targetNode = document.getElementById("my-element");
observer.observe(targetNode, { childList: true, attributes: true });

// 4. Stop observing when done
// observer.disconnect();

```

---

## 2. Configuration Options (`MutationObserverInit`)

When calling `.observe()`, you must pass a configuration dictionary. At least one of `childList`, `attributes`, or `characterData` **must be set to `true**`.

| Option                      | Type            | Description                                                                             |
| --------------------------- | --------------- | --------------------------------------------------------------------------------------- |
| **`childList`**             | `boolean`       | Set to `true` to watch for addition/removal of direct child nodes.                      |
| **`attributes`**            | `boolean`       | Set to `true` to watch for attribute modifications on the target.                       |
| **`characterData`**         | `boolean`       | Set to `true` to watch for text content changes inside text nodes.                      |
| **`subtree`**               | `boolean`       | Set to `true` to extend observation to all descendants (children, grandchildren, etc.). |
| **`attributeOldValue`**     | `boolean`       | Set to `true` to record the previous attribute value before change.                     |
| **`characterDataOldValue`** | `boolean`       | Set to `true` to record previous text before change.                                    |
| **`attributeFilter`**       | `Array<string>` | Array of specific attribute names to monitor (e.g., `['class', 'disabled']`).           |

---

## 3. Code Examples for Common Use Cases

### Example 1: Watching for Child Node Creation and Removal

Track when new list items or elements are added or removed dynamically.

```html
<ul id="todo-list">
  <li>Buy Groceries</li>
</ul>
<button id="add-btn">Add Todo</button>

<script>
  const todoList = document.getElementById("todo-list");

  // Create observer callback
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        // Log added nodes
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            console.log("Added element:", node.textContent);
          }
        });

        // Log removed nodes
        mutation.removedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            console.log("Removed element:", node.textContent);
          }
        });
      }
    });
  });

  // Start observing direct children changes
  observer.observe(todoList, { childList: true });

  // Simulate dynamic insertion
  document.getElementById("add-btn").addEventListener("click", () => {
    const li = document.createElement("li");
    li.textContent = "New Task " + Date.now();
    todoList.append(li);
  });
</script>

```

---

### Example 2: Tracking Attribute Changes (e.g., Dark Mode Toggle)

Detect when an element's `class` or `data-*` attribute changes, and inspect the `oldValue`.

```html
<body id="app" class="theme-light">
  <button onclick="document.body.className = 'theme-dark'">Toggle Dark</button>
</body>

<script>
  const appBody = document.body;

  const attributeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "class") {
        const oldClass = mutation.oldValue;
        const newClass = appBody.className;
        console.log(`Class changed from "${oldClass}" to "${newClass}"`);
      }
    });
  });

  // Configure to track attribute changes and preserve oldValue
  attributeObserver.observe(appBody, {
    attributes: true,
    attributeFilter: ["class"], // Only watch class attribute
    attributeOldValue: true,    // Preserve old value
  });
</script>

```

---

### Example 3: Waiting for a Dynamic Element to Appear (Third-Party Widget Integration)

A common pattern when working with single-page applications or third-party scripts where you need to run code as soon as an element renders:

```javascript
function waitForElement(selector) {
  return new Promise((resolve) => {
    // Return immediately if element already exists
    const existingElement = document.querySelector(selector);
    if (existingElement) {
      return resolve(existingElement);
    }

    // Set up MutationObserver to watch document body
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect(); // Stop observing once found
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true, // Watch entire DOM tree
    });
  });
}

// Usage:
waitForElement("#chat-widget").then((widget) => {
  console.log("Chat widget rendered successfully!", widget);
});

```

---

## 4. Key Observer Methods

* **`observer.observe(target, options)`**: Starts listening for mutations on `target`.
* **`observer.disconnect()`**: Stops the observer from receiving notifications until `.observe()` is called again.
* **`observer.takeRecords()`**: Empties the observer's queue and returns any pending `MutationRecord` items before callback execution.

---

## 5. Performance Best Practices

1. **Avoid Overusing `subtree: true`:** Watching the entire document tree (`document.body`) with `subtree: true` forces the browser to evaluate thousands of DOM nodes. Keep target scopes as narrow as possible.
2. **Always Call `disconnect()`:** Clean up observers inside single-page applications (React, Vue, Angular) when components unmount to prevent memory leaks.
3. **Avoid Infinite Loops:** Never perform a DOM mutation inside the observer callback that triggers the exact same mutation type on the target element without a guard clause.

Explain IntersectionObserver in JavaScript with code examples

Explain IntersectionObserver in JavaScript with code examples`IntersectionObserver` is a built-in Web API that asynchronously tracks when a target element intersects with an ancestor element or the browser's top-level viewport.

Historically, checking if an element was visible required attaching listeners to scroll and resize events while querying `getBoundingClientRect()`. This caused frequent layout thrashing and high CPU usage. `IntersectionObserver` offloads visibility calculations directly to the browser's render pipeline, making scroll-based operations smooth and efficient.

---

## 1. Syntax & Configuration Options

An `IntersectionObserver` takes a callback function and an optional options object:

```javascript
const options = {
  root: null,         // Defaults to the browser viewport if null
  rootMargin: '0px',  // Expands or shrinks the root bounding box (CSS format)
  threshold: 1.0,     // Percentage of element visible before firing (0.0 to 1.0)
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    // entry.isIntersecting: true if target crosses threshold
    // entry.intersectionRatio: fraction of element currently visible (0 to 1)
    // entry.target: the DOM node being observed
  });
}, options);

// Start observing an element
const target = document.querySelector('#my-element');
observer.observe(target);

```

### Options Breakdown

* **`root`**: The ancestor element acting as the bounding box frame. Default is `null` (viewport).
* **`rootMargin`**: Offsets added around the root boundary (e.g., `'100px 0px'` pre-loads images $100\text{px}$ before they scroll into view).
* **`threshold`**: A single number or array of numbers (e.g., `[0, 0.5, 1.0]`). Defines at what visibility percentages the callback triggers.

---

## 2. Practical Code Examples

### Example 1: Lazy Loading Images

Defer downloading heavy images until they enter (or near) the viewport:

```html
<img data-src="large-photo.jpg" class="lazy-image" alt="Deferred Image" src="placeholder.jpg" />

<script>
  const lazyImages = document.querySelectorAll('.lazy-image');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Swap data-src into real src attribute
        img.src = img.dataset.src;
        img.classList.remove('lazy-image');

        // Stop watching once image is loaded
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '200px 0px' // Pre-fetch 200px before scrolling into view
  });

  lazyImages.forEach((img) => imageObserver.observe(img));
</script>

```

---

### Example 2: Infinite Scroll (Fetching Data at Page Bottom)

Attach an observer to a invisible "sentinel" `<div>` placed at the bottom of a list. When the user scrolls to the bottom, trigger the API fetch:

```html
<ul id="feed">
  <li>Item 1</li>
  <li>Item 2</li>
</ul>

<!-- Sentinel element at the bottom of the list -->
<div id="sentinel">Loading more items...</div>

<script>
  const feed = document.getElementById('feed');
  const sentinel = document.getElementById('sentinel');
  let itemCounter = 3;

  const sentinelObserver = new IntersectionObserver(async (entries) => {
    const [entry] = entries;

    if (entry.isIntersecting) {
      // Simulate API data fetch
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Append new items
      for (let i = 0; i < 5; i++) {
        const li = document.createElement('li');
        li.textContent = `Item ${itemCounter++}`;
        feed.append(li);
      }
    }
  }, {
    threshold: 0.1
  });

  sentinelObserver.observe(sentinel);
</script>

```

---

### Example 3: Scroll-Triggered UI Animations (Fade In On Scroll)

Trigger CSS transition classes when elements enter the screen:

```html
<style>
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .animate-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
  }
</style>

<div class="animate-on-scroll">
  <h2>Feature Box</h2>
</div>

<script>
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        // Optional: Remove class when scrolling back up to re-trigger
        entry.target.classList.remove('visible');
      }
    });
  }, {
    threshold: 0.2 // Fire when 20% visible
  });

  animatedElements.forEach((el) => animObserver.observe(el));
</script>

```

---

## 3. Key Methods & Lifecycle Clean Up

* **`observer.observe(targetNode)`**: Registers a node to watch.
* **`observer.unobserve(targetNode)`**: Stops watching a specific node.
* **`observer.disconnect()`**: Stops watching **all** nodes registered to the observer instance (essential when unmounting single-page application components to avoid memory leaks).

Explain ResizeObserver in JavaScript with code examples

`ResizeObserver` is a built-in Web API that allows you to report changes to the dimensions (width, height, content box, or border box) of individual DOM elements.

Unlike the traditional `window.onresize` event—which only fires when the entire browser window resizes—`ResizeObserver` fires whenever a specific element changes size due to flexbox layouts, media queries, sidebar toggles, dynamic content loading, or user interactions.

---

## 1. Syntax & Core Concepts

Using `ResizeObserver` follows a standard 3-step observer workflow:

```javascript
// 1. Create callback function
const observer = new ResizeObserver((entries, observer) => {
  for (const entry of entries) {
    // entry.target: The observed DOM element
    // entry.contentRect: Legacy DOMRectReadOnly object (width, height, top, left)
    // entry.borderBoxSize: Array containing border box dimensions
    // entry.contentBoxSize: Array containing content box dimensions
    // entry.devicePixelContentBoxSize: Size in physical device pixels
    console.log('Element width:', entry.contentRect.width);
    console.log('Element height:', entry.contentRect.height);
  }
});

// 2. Target element and start observing
const box = document.querySelector('#resizable-box');
observer.observe(box);

// 3. Clean up when no longer needed
// observer.unobserve(box);
// observer.disconnect();

```

---

## 2. Understanding Observer Sizes (`box` Options)

When calling `.observe(element, options)`, you can specify which box model box size to monitor:

* **`contentBox` (Default):** The size of the element's content area (excluding padding, borders, and margins).
* **`borderBox`:** The total size including padding and borders.
* **`devicePixelContentBox`:** The size of the element's content in physical device pixels (useful for crisp canvas rendering on high-DPI/Retina screens).

```javascript
observer.observe(box, { box: 'border-box' });

```

---

## 3. Practical Code Examples

### Example 1: Container Queries / Element-Level Responsive Layout

Adapt a card component based on its *own* width rather than the window viewport size:

```html
<div id="card" class="card">
  <h2>Responsive Card Component</h2>
  <p>This layout changes based on its container size, not window size.</p>
</div>

<style>
  .card {
    padding: 20px;
    background: #f0f4f8;
    border-radius: 8px;
    transition: background 0.3s ease;
  }
  .card.small-card {
    background: #ffe3e3; /* Mobile/Sidebar layout */
  }
  .card.large-card {
    background: #d3f9d8; /* Wide layout */
  }
</style>

<script>
  const card = document.getElementById('card');

  const cardObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      // Get content box width
      const width = entry.contentRect.width;

      if (width < 400) {
        card.classList.add('small-card');
        card.classList.remove('large-card');
      } else {
        card.classList.add('large-card');
        card.classList.remove('small-card');
      }
    }
  });

  cardObserver.observe(card);
</script>

```

---

### Example 2: Automatic HTML5 `<canvas>` Rescaling

Canvas elements often look blurry on high-DPI displays unless their internal drawing surface dimensions match their CSS layout dimensions.

```html
<canvas id="chart-canvas" style="width: 100%; height: 300px;"></canvas>

<script>
  const canvas = document.getElementById('chart-canvas');
  const ctx = canvas.getContext('2d');

  function drawShape(width, height) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#4f46e5';
    ctx.fillRect(20, 20, width - 40, height - 40);
  }

  const canvasObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      // Use devicePixelContentBox for sharp rendering on retina screens
      const inlineWidth = entry.contentRect.width;
      const inlineHeight = entry.contentRect.height;

      // Sync internal drawing size with layout size
      canvas.width = inlineWidth;
      canvas.height = inlineHeight;

      // Redraw canvas content
      drawShape(inlineWidth, inlineHeight);
    }
  });

  canvasObserver.observe(canvas);
</script>

```

---

### Example 3: Truncating Dynamic Text or Expanding Read-More Buttons

Check if an element's scroll height exceeds its visible layout height:

```html
<div id="text-box" style="height: 100px; overflow: hidden; border: 1px solid #ccc;">
  <p id="text-content">Long content goes here...</p>
</div>
<button id="read-more-btn" style="display: none;">Read More</button>

<script>
  const textBox = document.getElementById('text-box');
  const readMoreBtn = document.getElementById('read-more-btn');

  const textObserver = new ResizeObserver(() => {
    // Check if content overflows container box
    const isOverflowing = textBox.scrollHeight > textBox.clientHeight;
    readMoreBtn.style.display = isOverflowing ? 'block' : 'none';
  });

  textObserver.observe(textBox);
</script>

```

---

## 4. Key Observer Methods & Lifecycle

* **`observer.observe(target, options)`**: Starts watching target element.
* **`observer.unobserve(target)`**: Stops watching a specific element.
* **`observer.disconnect()`**: Stops watching **all** registered elements (essential when unmounting React, Vue, or Angular components to prevent memory leaks).

---

## Summary Matrix: Observer APIs Comparison

| Observer API               | Primary Trigger                       | Primary Use Cases                                                             |
| -------------------------- | ------------------------------------- | ----------------------------------------------------------------------------- |
| **`ResizeObserver`**       | Element dimensions/box changes        | Component-level responsive layouts, dynamic canvas resizing, text truncation. |
| **`IntersectionObserver`** | Element crosses viewport threshold    | Lazy loading images, infinite scroll, scroll animations.                      |
| **`MutationObserver`**     | DOM node creation/deletion/attributes | Watching dynamic DOM modifications, third-party script detection.             |

Explain IntersectionObserver in JavaScript with code examples

`IntersectionObserver` is a built-in Web API that asynchronously tracks when a target element intersects with an ancestor element or the browser's top-level viewport.

Historically, checking if an element was visible required attaching listeners to scroll and resize events while querying `getBoundingClientRect()`. This caused frequent layout thrashing and high CPU usage. `IntersectionObserver` offloads visibility calculations directly to the browser's render pipeline, making scroll-based operations smooth and efficient.

---

## 1. Syntax & Configuration Options

An `IntersectionObserver` takes a callback function and an optional options object:

```javascript
const options = {
  root: null,         // Defaults to the browser viewport if null
  rootMargin: '0px',  // Expands or shrinks the root bounding box (CSS format)
  threshold: 1.0,     // Percentage of element visible before firing (0.0 to 1.0)
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    // entry.isIntersecting: true if target crosses threshold
    // entry.intersectionRatio: fraction of element currently visible (0 to 1)
    // entry.target: the DOM node being observed
  });
}, options);

// Start observing an element
const target = document.querySelector('#my-element');
observer.observe(target);

```

### Options Breakdown

* **`root`**: The ancestor element acting as the bounding box frame. Default is `null` (viewport).
* **`rootMargin`**: Offsets added around the root boundary (e.g., `'100px 0px'` pre-loads images $100\text{px}$ before they scroll into view).
* **`threshold`**: A single number or array of numbers (e.g., `[0, 0.5, 1.0]`). Defines at what visibility percentages the callback triggers.

---

## 2. Practical Code Examples

### Example 1: Lazy Loading Images

Defer downloading heavy images until they enter (or near) the viewport:

```html
<img data-src="large-photo.jpg" class="lazy-image" alt="Deferred Image" src="placeholder.jpg" />

<script>
  const lazyImages = document.querySelectorAll('.lazy-image');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Swap data-src into real src attribute
        img.src = img.dataset.src;
        img.classList.remove('lazy-image');

        // Stop watching once image is loaded
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '200px 0px' // Pre-fetch 200px before scrolling into view
  });

  lazyImages.forEach((img) => imageObserver.observe(img));
</script>

```

---

### Example 2: Infinite Scroll (Fetching Data at Page Bottom)

Attach an observer to an invisible "sentinel" `<div>` placed at the bottom of a list. When the user scrolls to the bottom, trigger the API fetch:

```html
<ul id="feed">
  <li>Item 1</li>
  <li>Item 2</li>
</ul>

<!-- Sentinel element at the bottom of the list -->
<div id="sentinel">Loading more items...</div>

<script>
  const feed = document.getElementById('feed');
  const sentinel = document.getElementById('sentinel');
  let itemCounter = 3;

  const sentinelObserver = new IntersectionObserver(async (entries) => {
    const [entry] = entries;

    if (entry.isIntersecting) {
      // Simulate API data fetch
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Append new items
      for (let i = 0; i < 5; i++) {
        const li = document.createElement('li');
        li.textContent = `Item ${itemCounter++}`;
        feed.append(li);
      }
    }
  }, {
    threshold: 0.1
  });

  sentinelObserver.observe(sentinel);
</script>

```

---

### Example 3: Scroll-Triggered UI Animations (Fade In On Scroll)

Trigger CSS transition classes when elements enter the screen:

```html
<style>
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .animate-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
  }
</style>

<div class="animate-on-scroll">
  <h2>Feature Box</h2>
</div>

<script>
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        // Optional: Remove class when scrolling back up to re-trigger
        entry.target.classList.remove('visible');
      }
    });
  }, {
    threshold: 0.2 // Fire when 20% visible
  });

  animatedElements.forEach((el) => animObserver.observe(el));
</script>

```

---

## 3. Key Methods & Lifecycle Clean Up

* **`observer.observe(targetNode)`**: Registers a node to watch.
* **`observer.unobserve(targetNode)`**: Stops watching a specific node.
* **`observer.disconnect()`**: Stops watching **all** nodes registered to the observer instance (essential when unmounting single-page application components to avoid memory leaks).

Explain MutationObserver in JavaScript with code examples

`MutationObserver` is a built-in Web API that allows you to watch for changes in the DOM tree. It acts as an asynchronous listener that fires a callback whenever nodes are added, removed, or modified, or when element attributes/text content change.

It replaced legacy `MutationEvents` (such as `DOMNodeInserted`), providing significantly better performance because it **batches changes asynchronously** instead of blocking the main thread on every individual DOM modification.

---

## 1. Basic Lifecycle of a `MutationObserver`

Using `MutationObserver` follows a 3-step lifecycle:

1. **Instantiate:** Create an observer instance with a callback function.
2. **Observe:** Call `.observe(targetNode, options)` specifying which target element and types of mutations to watch.
3. **Disconnect / Clean Up:** Call `.disconnect()` when finished to prevent memory leaks.

```javascript
// 1. Create callback function
const callback = (mutationsList, observer) => {
  for (const mutation of mutationsList) {
    console.log("Mutation detected:", mutation.type);
  }
};

// 2. Instantiate observer
const observer = new MutationObserver(callback);

// 3. Start observing a target element
const targetNode = document.getElementById("my-element");
observer.observe(targetNode, { childList: true, attributes: true });

// 4. Stop observing when done
// observer.disconnect();

```

---

## 2. Configuration Options (`MutationObserverInit`)

When calling `.observe()`, you must pass a configuration dictionary. At least one of `childList`, `attributes`, or `characterData` **must be set to `true**`.

| Option                      | Type            | Description                                                                             |
| --------------------------- | --------------- | --------------------------------------------------------------------------------------- |
| **`childList`**             | `boolean`       | Set to `true` to watch for addition/removal of direct child nodes.                      |
| **`attributes`**            | `boolean`       | Set to `true` to watch for attribute modifications on the target.                       |
| **`characterData`**         | `boolean`       | Set to `true` to watch for text content changes inside text nodes.                      |
| **`subtree`**               | `boolean`       | Set to `true` to extend observation to all descendants (children, grandchildren, etc.). |
| **`attributeOldValue`**     | `boolean`       | Set to `true` to record the previous attribute value before change.                     |
| **`characterDataOldValue`** | `boolean`       | Set to `true` to record previous text before change.                                    |
| **`attributeFilter`**       | `Array<string>` | Array of specific attribute names to monitor (e.g., `['class', 'disabled']`).           |

---

## 3. Code Examples for Common Use Cases

### Example 1: Watching for Child Node Creation and Removal

Track when new list items or elements are added or removed dynamically.

```html
<ul id="todo-list">
  <li>Buy Groceries</li>
</ul>
<button id="add-btn">Add Todo</button>

<script>
  const todoList = document.getElementById("todo-list");

  // Create observer callback
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        // Log added nodes
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            console.log("Added element:", node.textContent);
          }
        });

        // Log removed nodes
        mutation.removedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            console.log("Removed element:", node.textContent);
          }
        });
      }
    });
  });

  // Start observing direct children changes
  observer.observe(todoList, { childList: true });

  // Simulate dynamic insertion
  document.getElementById("add-btn").addEventListener("click", () => {
    const li = document.createElement("li");
    li.textContent = "New Task " + Date.now();
    todoList.append(li);
  });
</script>

```

---

### Example 2: Tracking Attribute Changes (e.g., Dark Mode Toggle)

Detect when an element's `class` or `data-*` attribute changes, and inspect the `oldValue`.

```html
<body id="app" class="theme-light">
  <button onclick="document.body.className = 'theme-dark'">Toggle Dark</button>
</body>

<script>
  const appBody = document.body;

  const attributeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "class") {
        const oldClass = mutation.oldValue;
        const newClass = appBody.className;
        console.log(`Class changed from "${oldClass}" to "${newClass}"`);
      }
    });
  });

  // Configure to track attribute changes and preserve oldValue
  attributeObserver.observe(appBody, {
    attributes: true,
    attributeFilter: ["class"], // Only watch class attribute
    attributeOldValue: true,    // Preserve old value
  });
</script>

```

---

### Example 3: Waiting for a Dynamic Element to Appear (Third-Party Widget Integration)

A common pattern when working with single-page applications or third-party scripts where you need to run code as soon as an element renders:

```javascript
function waitForElement(selector) {
  return new Promise((resolve) => {
    // Return immediately if element already exists
    const existingElement = document.querySelector(selector);
    if (existingElement) {
      return resolve(existingElement);
    }

    // Set up MutationObserver to watch document body
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect(); // Stop observing once found
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true, // Watch entire DOM tree
    });
  });
}

// Usage:
waitForElement("#chat-widget").then((widget) => {
  console.log("Chat widget rendered successfully!", widget);
});

```

---

## 4. Key Observer Methods

* **`observer.observe(target, options)`**: Starts listening for mutations on `target`.
* **`observer.disconnect()`**: Stops the observer from receiving notifications until `.observe()` is called again.
* **`observer.takeRecords()`**: Empties the observer's queue and returns any pending `MutationRecord` items before callback execution.

---

## 5. Performance Best Practices

1. **Avoid Overusing `subtree: true`:** Watching the entire document tree (`document.body`) with `subtree: true` forces the browser to evaluate thousands of DOM nodes. Keep target scopes as narrow as possible.
2. **Always Call `disconnect()`:** Clean up observers inside single-page applications (React, Vue, Angular) when components unmount to prevent memory leaks.
3. **Avoid Infinite Loops:** Never perform a DOM mutation inside the observer callback that triggers the exact same mutation type on the target element without a guard clause.
