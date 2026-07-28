### 52. Add an event listener to multiple elements

To add the same event listener to multiple elements, you can iterate over the NodeList of selected elements and apply `addEventListener` to each.

```javascript
function addEventListenerToMultipleElements(selector, eventType, handler) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    element.addEventListener(eventType, handler);
  });
}
```

- `addEventListenerToMultipleElements`: Adds the specified event listener to all elements that match the provided selector.

Example usage:

```javascript
addEventListenerToMultipleElements(".button", "click", () => {
  console.log("Button clicked!");
});
```

---

### 53. Remove all child nodes from a DOM element

To remove all child nodes from a DOM element, you can use a simple loop or `innerHTML` to clear the content. However, a more efficient approach is using `while` to remove child nodes one by one.

```javascript
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
```

- `removeAllChildNodes`: Removes all child nodes of a given DOM element.

Example usage:

```javascript
const parentElement = document.getElementById("parent");
removeAllChildNodes(parentElement); // Removes all child nodes from the parent element
```

---

### 54. Toggle a class on an element when clicked

To toggle a class on an element when it's clicked, you can add an event listener that toggles the class using `classList.toggle`.

```javascript
function toggleClassOnClick(selector, className) {
  const element = document.querySelector(selector);
  element.addEventListener("click", () => {
    element.classList.toggle(className);
  });
}
```

- `toggleClassOnClick`: Toggles the specified class on the selected element when clicked.

Example usage:

```javascript
toggleClassOnClick(".my-element", "active");
```

When the element with the class `my-element` is clicked, it will toggle the `active` class on and off.

---

### 55. Clone a DOM element and its children

To clone a DOM element along with its children, you can use the `cloneNode` method. Set the argument to `true` to ensure that child nodes are also cloned.

```javascript
function cloneElementWithChildren(selector) {
  const element = document.querySelector(selector);
  return element.cloneNode(true); // 'true' ensures the element and its children are cloned
}
```

- `cloneElementWithChildren`: Clones the selected element and all its child nodes.

Example usage:

```javascript
const clonedElement = cloneElementWithChildren("#element-to-clone");
document.body.appendChild(clonedElement); // Appends the cloned element to the body
```

---

These implementations provide useful methods for interacting with DOM elements: adding event listeners, removing child nodes, toggling classes, and cloning elements. Each of these tasks can be commonly required when manipulating or interacting with the DOM in a web application.
