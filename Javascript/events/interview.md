When an event (like a click, keypress, or hover) occurs on a DOM element, it does not instantly fire on that target element alone. Instead, the event travels through the DOM tree in a 3-phase journey known as **DOM Event Propagation**.

---

## The 3 Phases of Event Propagation

According to the official W3C DOM standard, every event flows through the following sequential phases:

```
                  ┌───────────────────────────────┐
                  │            DOCUMENT           │
                  └───────────────┬───────────────┘
                                  │   ▲
                  Phase 1         │   │   Phase 3
             Event Capturing      │   │  Event Bubbling
              (Trickling Down)    │   │  (Bubbling Up)
                                  ▼   │
                  ┌───────────────────────────────┐
                  │         <BODY> PARENT         │
                  └───────────────┬───────────────┘
                                  │   ▲
                                  ▼   │
                  ┌───────────────────────────────┐
                  │         <DIV> CONTAINER       │
                  └───────────────┬───────────────┘
                                  │   ▲
                                  ▼   │
                  ┌───────────────────────────────┐
                  │  Phase 2: <BUTTON> TARGET     │
                  └───────────────────────────────┘

```

1. **Capturing Phase (Trickling Phase):** The event starts at the highest ancestor (`window`, then `document`, `<html>`, `<body>`) and trickles down through child elements toward the target element.
2. **Target Phase:** The event reaches the actual element that triggered the interaction (accessible via `event.target`).
3. **Bubbling Phase:** The event reverses direction and bubbles up from the target element back up through parent elements to `window`.

---

## 1. Capturing Phase vs. Bubbling Phase in Code

By default, when you attach an event listener using `addEventListener()`, it **listens only during the Bubbling Phase**.

```javascript
// Syntax: element.addEventListener(eventType, handler, useCapture)

```

The 3rd argument (`useCapture` or an options object) dictates which phase handles the event:

* `false` (Default): Listens during the **Bubbling Phase**.
* `true` (or `{ capture: true }`): Listens during the **Capturing Phase**.

### Code Example

```html
<div id="parent" style="padding: 20px; background: lightblue;">
  <button id="child">Click Me</button>
</div>

```

```javascript
const parent = document.getElementById('parent');
const child = document.getElementById('child');

// 1. Parent listener in Capturing Phase
parent.addEventListener('click', () => {
  console.log('1. Parent - Capturing Phase ⬇️');
}, true); // useCapture = true

// 2. Child listener on Target
child.addEventListener('click', () => {
  console.log('2. Child - Target Phase 🎯');
});

// 3. Parent listener in Bubbling Phase
parent.addEventListener('click', () => {
  console.log('3. Parent - Bubbling Phase ⬆️');
}, false); // useCapture = false

```

### Output when the button is clicked

```text
1. Parent - Capturing Phase ⬇️
2. Child - Target Phase 🎯
3. Parent - Bubbling Phase ⬆️

```

---

## 2. Key Event Properties: `event.target` vs. `event.currentTarget`

Understanding event propagation requires distinguishing between these two properties:

* **`event.target`**: The actual element that initiated the event (e.g., the exact button or icon clicked). This remains constant throughout propagation.
* **`event.currentTarget`**: The element to which the event listener is currently attached (e.g., the parent `div` handling the delegated event).

```javascript
parent.addEventListener('click', (e) => {
  console.log('Target:', e.target.nodeName);          // BUTTON (what was clicked)
  console.log('CurrentTarget:', e.currentTarget.nodeName); // DIV (where listener lives)
});

```

---

## 3. Controlling Propagation: `stopPropagation()` vs `stopImmediatePropagation()`

You can interrupt or stop event propagation at any point during capturing or bubbling.

### A. `event.stopPropagation()`

Prevents the event from traveling further up or down the DOM tree. However, if there are **other listeners attached to the exact same element**, those will still execute.

```javascript
child.addEventListener('click', (e) => {
  e.stopPropagation(); // Stops event from bubbling up to parent!
  console.log('Child clicked');
});

// Parent will NEVER hear this click event!
parent.addEventListener('click', () => {
  console.log('Parent clicked');
});

```

### B. `event.stopImmediatePropagation()`

Stops event propagation **AND** prevents any subsequent listeners attached to the *same* element from executing.

```javascript
child.addEventListener('click', (e) => {
  e.stopImmediatePropagation(); // Kills propagation AND blocks remaining handlers on 'child'
  console.log('First handler');
});

child.addEventListener('click', () => {
  console.log('Second handler'); // ❌ WILL NOT RUN!
});

```

### C. Bonus: `event.preventDefault()`

Does **NOT** stop propagation. Instead, it cancels the browser's default native action associated with the event (e.g., stopping a form submission or link navigation).

---

## 4. Practical Application: Event Delegation

Event bubbling is the core mechanism that makes **Event Delegation** possible. Rather than attaching event listeners to dozens of child nodes, you attach one listener to a common parent and inspect `event.target`:

```javascript
const list = document.getElementById('shopping-list');

// Handles clicks for present AND dynamically added <li> items
list.addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') {
    console.log('Item clicked:', event.target.textContent);
  }
});

```

---

## Summary Comparison Matrix

| Property / Method                | Purpose                                                 | Effect on Propagation                                                |
| -------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------- |
| **Capturing Phase**              | Event moves top-down (Window $\rightarrow$ Target)      | Fires listeners registered with `{ capture: true }`                  |
| **Bubbling Phase**               | Event moves bottom-up (Target $\rightarrow$ Window)     | Fires default listeners registered with `{ capture: false }`         |
| **`stopPropagation()`**          | Stops event moving to parent/child elements             | Halts propagation chain, but runs remaining handlers on target       |
| **`stopImmediatePropagation()`** | Complete event execution shutdown                       | Halts propagation chain AND blocks remaining handlers on same target |
| **`preventDefault()`**           | Cancels default browser behavior (e.g., link redirects) | **Does not affect** event propagation                                |
