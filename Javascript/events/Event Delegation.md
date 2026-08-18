**Event Delegation** is a JavaScript pattern where a single event listener is attached to a parent element to manage events for all of its current and future child elements.

Instead of adding separate event listeners to every individual child node, event delegation leverages **Event Bubbling**—the process where an event triggered on a child node propagates (bubbles) up the DOM tree to its ancestors.

---

### How Event Bubbling Powers Delegation

When a user clicks a child element:

1. **Capturing Phase:** The event travels down from the `window` to the target element.
2. **Target Phase:** The event reaches the clicked element (`event.target`).
3. **Bubbling Phase:** The event bubbles up through parent elements (`parentElement`, `body`, `document`, `window`).

Event delegation intercepts the event during the **Bubbling Phase** at the parent level.

---

### Code Example: Without vs. With Event Delegation

#### Without Delegation (Inefficient)

Attaching listeners to every list item individually:

```javascript
// Creates a separate listener function in memory for every <li>
document.querySelectorAll('#todo-list li').forEach(item => {
  item.addEventListener('click', (e) => {
    console.log('Clicked:', e.target.textContent);
  });
});

```

* **Problem:** Consumes more memory for large lists and **does not work for dynamically added items** without manually re-binding listeners.

---

#### With Event Delegation (Efficient)

Attaching a single listener to the parent `<ul>`:

```html
<ul id="todo-list">
  <li data-id="1">Buy groceries</li>
  <li data-id="2">Pay electricity bill</li>
  <li data-id="3">Walk the dog</li>
</ul>

```

```javascript
const todoList = document.getElementById('todo-list');

todoList.addEventListener('click', (event) => {
  // Use .closest() to handle clicks on nested elements inside the <li>
  const listItem = event.target.closest('li');

  // Verify the click occurred inside an <li> belonging to this container
  if (listItem && todoList.contains(listItem)) {
    console.log('Item clicked:', listItem.textContent);
    console.log('Item ID:', listItem.dataset.id);
  }
});

```

---

### Key Properties in Event Delegation

* **`event.target`**: The actual element that triggered the event (the deepest clicked element).
* **`event.currentTarget`**: The element to which the event listener is attached (the parent container).
* **`Element.prototype.closest(selector)`**: Traverses up the DOM tree from the target to find the nearest ancestor matching the CSS selector.

---

### Benefits of Event Delegation

* **Lower Memory Usage:** Only one listener function is allocated in memory instead of hundreds or thousands.
* **Automatic Handling of Dynamic DOM Elements:** Elements added to the DOM after the initial page load automatically work without re-attaching listeners.
* **Cleaner Cleanup & Less Memory Leaks:** Easier lifecycle management and fewer event listeners to unbind when components unmount.

---

### Limitations

* **Non-Bubbling Events:** Some events do not bubble by default (e.g., `focus`, `blur`, `load`, `unload`, `mouseenter`, `mouseleave`).
* *Workaround:* Use bubbling alternatives like `focusin` / `focusout`, or set the listener's capture phase to `true` (`{ capture: true }`).

* **`event.stopPropagation()`**: If a child element explicitly calls `e.stopPropagation()`, the event will never bubble up to the delegated parent listener.
