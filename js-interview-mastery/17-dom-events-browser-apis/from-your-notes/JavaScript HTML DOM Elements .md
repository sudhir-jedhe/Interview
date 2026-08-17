In JavaScript, **HTML DOM Elements** represent every tag on a web page (such as `<div>`, `<p>`, or `<h1>`). The DOM (Document Object Model) structures these elements as objects in a tree, allowing JavaScript to select, create, modify, or remove them dynamically.

---

## 1. Finding / Selecting Elements

Before modifying an element, you must select it. Modern JavaScript provides several methods:

```javascript
// 1. Select by ID (Single element)
const title = document.getElementById("main-title");

// 2. Select by CSS Selector (First match)
const firstButton = document.querySelector(".btn-primary");

// 3. Select by CSS Selector (All matches - returns static NodeList)
const allCards = document.querySelectorAll(".card");

// 4. Select by Class Name (Returns live HTMLCollection)
const items = document.getElementsByClassName("list-item");

// 5. Select by Tag Name (Returns live HTMLCollection)
const paragraphs = document.getElementsByTagName("p");

```

---

## 2. Modifying Element Content & Attributes

Once selected, you can alter an element's text, HTML structure, styling, or HTML attributes.

```javascript
const element = document.querySelector("#user-box");

// Content Modification
element.textContent = "Hello Alice!"; // Safe plain text (prevents XSS)
element.innerHTML = "<strong>Hello Alice!</strong>"; // Renders inner HTML tags

// Styling
element.style.color = "blue";
element.style.backgroundColor = "#f0f0f0"; // CamelCase for CSS properties

// Class Manipulation
element.classList.add("active");
element.classList.remove("hidden");
element.classList.toggle("selected");

// Attribute Manipulation
element.setAttribute("data-status", "logged-in");
console.log(element.getAttribute("data-status")); // "logged-in"
element.removeAttribute("data-status");

```

---

## 3. Creating & Appending Elements

To dynamically add new HTML elements to the page:

```javascript
// 1. Create the new element tag
const newCard = document.createElement("div");

// 2. Configure its properties
newCard.className = "card";
newCard.textContent = "New Dynamic Content";

// 3. Append it to a container in the DOM
const container = document.querySelector("#container");
container.append(newCard); // Modern method (accepts elements or strings)

```

---

## 4. Removing Elements

```javascript
const elementToRemove = document.querySelector("#old-banner");

// Modern Direct Removal
elementToRemove.remove();

// Parent-Based Removal (Classic)
// elementToRemove.parentNode.removeChild(elementToRemove);

```

---

## 5. Modern Element Manipulation Matrix

| Operation           | Best Practice Method                  | Example                              |
| ------------------- | ------------------------------------- | ------------------------------------ |
| **Select Single**   | `document.querySelector(selector)`    | `document.querySelector('#nav')`     |
| **Select Multiple** | `document.querySelectorAll(selector)` | `document.querySelectorAll('.item')` |
| **Create**          | `document.createElement(tagName)`     | `document.createElement('div')`      |
| **Append**          | `parent.append(...nodesOrStrings)`    | `container.append(newEl, "text")`    |
| **Prepend**         | `parent.prepend(...nodesOrStrings)`   | `container.prepend(header)`          |
| **Remove**          | `element.remove()`                    | `btn.remove()`                       |

Explain JavaScript HTML DOM Navigation with code examples

**HTML DOM Navigation** allows you to move through the HTML document structure using node relationships. In the DOM tree, every part of an HTML document (elements, text, attributes, comments) is represented as a **node**.

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

## 2. Element Navigation vs. All-Node Navigation

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

* `element.children` returns an **`HTMLCollection`** (a live list of element nodes).
* `node.childNodes` or `document.querySelectorAll()` returns a **`NodeList`**.

```javascript
const listContainer = document.getElementById("container");

// Using Array.from to convert HTMLCollection into an array for iteration
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
