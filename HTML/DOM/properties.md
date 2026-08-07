Here is a structured, categorized reference for all standard `Document` properties and methods based on your document API reference.

---

## 1. Document Structure & Metadata Properties

Properties that provide information about the document's structure, URL, or state.

| Property              | Description                                                                 | Example / Return               |
| --------------------- | --------------------------------------------------------------------------- | ------------------------------ |
| **`documentElement`** | Returns the root element of the document (the `<html>` element).            | `document.documentElement`     |
| **`head`**            | Returns the `<head>` element of the document.                               | `document.head`                |
| **`body`**            | Sets or returns the `<body>` element of the document.                       | `document.body`                |
| **`title`**           | Sets or returns the text title of the document.                             | `document.title = "New Title"` |
| **`URL`**             | Returns the full URL string of the document.                                | `console.log(document.URL)`    |
| **`documentURI`**     | Sets or returns the location of the document.                               | `document.documentURI`         |
| **`baseURI`**         | Returns the absolute base URI of the document.                              | `document.baseURI`             |
| **`domain`**          | Returns the domain name of the server that loaded the document.             | `document.domain`              |
| **`referrer`**        | Returns the URL of the document that linked/loaded the current page.        | `document.referrer`            |
| **`cookie`**          | Returns or sets name/value cookie pairs associated with the document.       | `document.cookie`              |
| **`characterSet`**    | Returns the character encoding of the document (e.g., `"UTF-8"`).           | `document.characterSet`        |
| **`readyState`**      | Returns the loading status (`"loading"`, `"interactive"`, or `"complete"`). | `document.readyState`          |
| **`lastModified`**    | Returns the date and time the document was last modified.                   | `document.lastModified`        |
| **`defaultView`**     | Returns the associated `window` object, or `null`.                          | `document.defaultView`         |
| **`doctype`**         | Returns the Document Type Declaration (`<!DOCTYPE html>`).                  | `document.doctype`             |
| **`designMode`**      | Controls whether the entire document is editable (`"on"` or `"off"`).       | `document.designMode = "on"`   |
| **`activeElement`**   | Returns the element that currently has browser focus.                       | `document.activeElement`       |
| **`implementation`**  | Returns the `DOMImplementation` object managing this document.              | `document.implementation`      |

---

## 2. Element Selection Methods & HTML Collections

Methods and properties used to locate or group elements inside the DOM tree.

### Selection Methods

| Method                             | Description                                                           | Return Type           |
| ---------------------------------- | --------------------------------------------------------------------- | --------------------- |
| **`querySelector(selectors)`**     | Returns the **first** element matching the specified CSS selector(s). | `Element` or `null`   |
| **`querySelectorAll(selectors)`**  | Returns all elements matching the CSS selector(s).                    | Static `NodeList`     |
| **`getElementById(id)`**           | Returns the element with the specified ID.                            | `Element` or `null`   |
| **`getElementsByClassName(name)`** | Returns all elements with the specified class name.                   | Live `HTMLCollection` |
| **`getElementsByTagName(tag)`**    | Returns all elements with the specified HTML tag name.                | Live `HTMLCollection` |
| **`getElementsByName(name)`**      | Returns all elements with the specified HTML `name` attribute.        | Live `NodeList`       |

### Built-in Document Collections

| Collection Property | Description                                                                    |
| ------------------- | ------------------------------------------------------------------------------ |
| **`forms`**         | Returns an `HTMLCollection` of all `<form>` elements.                          |
| **`images`**        | Returns an `HTMLCollection` of all `<img>` elements.                           |
| **`links`**         | Returns an `HTMLCollection` of all `<a>` and `<area>` elements with an `href`. |
| **`scripts`**       | Returns an `HTMLCollection` of all `<script>` elements.                        |
| **`embeds`**        | Returns an `HTMLCollection` of all `<embed>` elements.                         |

---

## 3. Node Creation, Import & Normalization Methods

Methods for constructing or importing DOM nodes dynamically.

| Method                         | Description                                                             | Code Example                                        |
| ------------------------------ | ----------------------------------------------------------------------- | --------------------------------------------------- |
| **`createElement(tagName)`**   | Creates a new Element node.                                             | `const div = document.createElement("div");`        |
| **`createTextNode(text)`**     | Creates a new Text node.                                                | `const text = document.createTextNode("Hello");`    |
| **`createComment(text)`**      | Creates a new Comment node.                                             | `const comment = document.createComment("Note");`   |
| **`createAttribute(name)`**    | Creates an Attribute node.                                              | `const attr = document.createAttribute("class");`   |
| **`createDocumentFragment()`** | Creates an empty `DocumentFragment` node for batch DOM operations.      | `const frag = document.createDocumentFragment();`   |
| **`createEvent(type)`**        | Creates a new synthetic event object.                                   | `const evt = document.createEvent("Event");`        |
| **`importNode(node, deep)`**   | Imports a copy of a node from another document.                         | `const imported = document.importNode(node, true);` |
| **`adoptNode(node)`**          | Adopts a node from an external document (removes from source).          | `const adopted = document.adoptNode(node);`         |
| **`normalize()`**              | Joins adjacent text nodes and removes empty text nodes in the document. | `document.normalize();`                             |

---

## 4. Event & Window Handling Methods

| Method                                    | Description                                               | Code Example                                      |
| ----------------------------------------- | --------------------------------------------------------- | ------------------------------------------------- |
| **`addEventListener(type, listener)`**    | Attaches an event handler to the document.                | `document.addEventListener("click", handler);`    |
| **`removeEventListener(type, listener)`** | Removes an event handler attached via `addEventListener`. | `document.removeEventListener("click", handler);` |
| **`hasFocus()`**                          | Returns `true` if the document currently has user focus.  | `if (document.hasFocus()) { ... }`                |

---

## 5. Document Output Stream Methods

| Method              | Description                                                                     |
| ------------------- | ------------------------------------------------------------------------------- |
| **`open()`**        | Opens an output stream to collect output from `document.write()`.               |
| **`write(expr)`**   | Writes HTML expressions or JavaScript code directly to an open document stream. |
| **`writeln(expr)`** | Identical to `write()`, but appends a newline character after each statement.   |
| **`close()`**       | Closes an output stream previously opened with `document.open()`.               |

---

## 6. Deprecated Features List

The following properties and methods are **deprecated** in modern web standards and should no longer be used:

* `anchors`
* `applets`
* `charset` *(Use `characterSet` instead)*
* `documentMode`
* `domConfig`
* `execCommand()`
* `inputEncoding`
* `normalizeDocument()`
* `renameNode()`
* `strictErrorChecking`

Here is a practical code example for every active `Document` method and property listed in your reference, organized by usage category.

---

## 1. Document Structure & Metadata Properties

```javascript
// 1. documentElement - Returns root <html> element
const htmlElement = document.documentElement;
console.log(htmlElement.tagName); // "HTML"

// 2. head - Access <head> tag
document.head.querySelector("meta[charset]") || console.log("Head accessed");

// 3. body - Get or set <body> tag
document.body.style.backgroundColor = "#f9f9f9";

// 4. title - Get or set document title
document.title = "Updated Page Title";

// 5. URL - Read full page URL
console.log(document.URL); // "https://example.com/page.html"

// 6. documentURI - Read location of document
console.log(document.documentURI); // "https://example.com/page.html"

// 7. baseURI - Get base URL used for resolving relative URLs
console.log(document.baseURI);

// 8. domain - Read document domain
console.log(document.domain); // "example.com"

// 9. referrer - Get URL of page that referred user here
console.log(document.referrer);

// 10. cookie - Read or set cookies
document.cookie = "username=JohnDoe; path=/";
console.log(document.cookie);

// 11. characterSet - Check encoding
console.log(document.characterSet); // "UTF-8"

// 12. readyState - Check document loading status
console.log(document.readyState); // "loading", "interactive", or "complete"

// 13. lastModified - Check when document was last modified
console.log(document.lastModified);

// 14. defaultView - Get window object associated with document
const win = document.defaultView;
console.log(win === window); // true

// 15. doctype - Get <!DOCTYPE html> node
console.log(document.doctype.name); // "html"

// 16. designMode - Toggle full page inline editing
document.designMode = "off"; // Set to "on" to make entire page editable

// 17. activeElement - Get currently focused element
console.log(document.activeElement.tagName); // e.g. "INPUT" or "BODY"

// 18. implementation - Access DOMImplementation object
const hasFeature = document.implementation.hasFeature("HTML", "2.0");

```

---

## 2. Element Selection Methods & Built-in Collections

```html
<!-- Sample Markup for Selection Examples -->
<form id="loginForm">
  <input name="username" class="field" id="userInput" type="text" />
</form>
<img src="logo.png" alt="Logo" />
<a href="/home">Home</a>
<script src="app.js"></script>

```

```javascript
// --- Selection Methods ---

// 1. querySelector() - First match by CSS selector
const form = document.querySelector("#loginForm");

// 2. querySelectorAll() - All matches as static NodeList
const fields = document.querySelectorAll(".field");

// 3. getElementById() - Match by ID attribute
const userInput = document.getElementById("userInput");

// 4. getElementsByClassName() - Live HTMLCollection by class
const classItems = document.getElementsByClassName("field");

// 5. getElementsByTagName() - Live HTMLCollection by tag name
const formsList = document.getElementsByTagName("form");

// 6. getElementsByName() - Live NodeList by name attribute
const usernameInputs = document.getElementsByName("username");


// --- Built-in Document Collections ---

// 7. forms - Collection of <form> elements
console.log(document.forms.length);

// 8. images - Collection of <img> elements
console.log(document.images[0].src);

// 9. links - Collection of <a> and <area> tags with href
console.log(document.links[0].href);

// 10. scripts - Collection of <script> elements
console.log(document.scripts.length);

// 11. embeds - Collection of <embed> elements
console.log(document.embeds.length);

```

---

## 3. Node Creation, Import & Normalization Methods

```javascript
// 1. createElement() - Create a new element node
const newDiv = document.createElement("div");

// 2. createTextNode() - Create a plain text node
const newText = document.createTextNode("Hello World");
newDiv.appendChild(newText);

// 3. createComment() - Create an HTML comment
const comment = document.createComment("This is a dynamic comment");
document.body.appendChild(comment);

// 4. createAttribute() - Create an attribute node
const customAttr = document.createAttribute("data-status");
customAttr.value = "active";
newDiv.setAttributeNode(customAttr);

// 5. createDocumentFragment() - Create lightweight container for batch insertion
const fragment = document.createDocumentFragment();
for (let i = 0; i < 3; i++) {
  const li = document.createElement("li");
  li.textContent = `Item ${i + 1}`;
  fragment.appendChild(li);
}
document.body.appendChild(fragment); // Performs single reflow

// 6. createEvent() - Create synthetic event (Legacy pattern)
const customEvt = document.createEvent("Event");
customEvt.initEvent("build", true, true);

// 7. importNode() - Copy node from an iframe/external document
const iframe = document.querySelector("iframe");
if (iframe && iframe.contentDocument) {
  const externalEl = iframe.contentDocument.querySelector("p");
  const importedNode = document.importNode(externalEl, true); // true = deep clone
  document.body.appendChild(importedNode);
}

// 8. adoptNode() - Move node from external document (removes from original)
if (iframe && iframe.contentDocument) {
  const nodeToMove = iframe.contentDocument.querySelector("h1");
  if (nodeToMove) {
    const adoptedNode = document.adoptNode(nodeToMove);
    document.body.appendChild(adoptedNode);
  }
}

// 9. normalize() - Clean up empty text nodes and join adjacent text nodes
const parent = document.createElement("p");
parent.appendChild(document.createTextNode("Part 1 "));
parent.appendChild(document.createTextNode("Part 2"));
console.log(parent.childNodes.length); // 2
parent.normalize();
console.log(parent.childNodes.length); // 1 ("Part 1 Part 2")

```

---

## 4. Event & Focus Handling Methods

```javascript
// 1. addEventListener() & removeEventListener()
function handleGlobalClick(event) {
  console.log("Clicked at:", event.clientX, event.clientY);
}

// Attach event listener
document.addEventListener("click", handleGlobalClick);

// Remove event listener
document.removeEventListener("click", handleGlobalClick);

// 2. hasFocus() - Check if document currently has user focus
if (document.hasFocus()) {
  console.log("User is active on this tab/window");
}

```

---

## 5. Output Stream Methods

> **Note:** `document.write()` and document streams overwrite the entire page if called after the page has finished loading. They are primarily used in isolated testing environments or dynamically generated iframe popups.

```javascript
// 1. open(), write(), writeln(), close() - Writing to a dynamic window/iframe stream
const newWindow = window.open("", "_blank", "width=300,height=200");

// Open output stream
newWindow.document.open();

// Write lines to stream
newWindow.document.write("<h1>Popup Title</h1>");
newWindow.document.writeln("<p>Line 1 of content</p>");
newWindow.document.writeln("<p>Line 2 of content</p>");

// Close stream to finish rendering
newWindow.document.close();

```
