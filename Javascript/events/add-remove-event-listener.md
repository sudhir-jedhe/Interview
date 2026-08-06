You've outlined a solution for implementing event delegation in JavaScript using reusable `on` and `off` functions. These functions allow you to add and remove event listeners dynamically, with the flexibility to handle delegation and options like event capturing or limiting the listener to specific target elements.

### Key Points:

1. **Event Delegation:** Instead of adding individual event listeners to multiple child elements, you add a single listener to a parent element. The listener checks if the event's target matches a specific element (the delegate).
2. **Reusable Functions:** `on` and `off` functions allow you to register and remove event listeners, supporting event delegation and custom options.
3. **Event Options:** You allow passing additional options, such as `once`, `capture`, or other options to fine-tune the event listener behavior.

### Detailed Explanation

#### 1. **on Function** (Add Event Listener with Delegation)

The `on` function is designed to handle event delegation in a reusable and flexible way.

```javascript
const on = (el, evt, fn, opts = {}) => {
  // If a 'target' option is provided, use event delegation
  const delegatorFn = (e) =>
    e.target.matches(opts.target) && fn.call(e.target, e); // Match target and invoke the callback

  // Add the event listener to the element (el)
  el.addEventListener(
    evt,
    opts.target ? delegatorFn : fn, // Use delegator if 'target' is specified
    opts.options || false, // Options for event listener (e.g., capture, once, etc.)
  );

  // If 'target' is provided, return the delegator function for later removal
  if (opts.target) return delegatorFn;
};
```

- **Parameters:**
  - `el`: The element to attach the event listener to.
  - `evt`: The event type (e.g., `click`, `keyup`).
  - `fn`: The callback function to execute when the event is triggered.
  - `opts`: An optional object containing:
    - `target`: A CSS selector string, used to delegate events to specific child elements.
    - `options`: Optional `EventListener` options (e.g., `once`, `capture`).

- **Usage Examples:**

  ```javascript
  // 1. Adding an event listener to the body element.
  on(document.body, "click", () => console.log("!"));

  // 2. Adding event delegation for clicks on <p> elements within the body.
  on(document.body, "click", () => console.log("!"), { target: "p" });

  // 3. Adding a capturing event listener.
  on(document.body, "click", () => console.log("!"), { options: true });

  // 4. Adding event delegation with a 'once' option for a <p> element.
  on(document.body, "click", () => console.log("!"), {
    target: "p",
    options: { once: true },
  });
  ```

- **How it works:**
  - When a `target` is provided in the `opts` object, the function uses event delegation to ensure the callback is executed only when the target element (or its descendants) is clicked.
  - If no `target` is provided, the event listener is added directly to the element (`el`), just like a traditional event listener.

#### 2. **off Function** (Remove Event Listener)

The `off` function is designed to remove event listeners that were previously added with the `on` function.

```javascript
const off = (el, evt, fn, opts = false) =>
  el.removeEventListener(evt, fn, opts);
```

- **Parameters:**
  - `el`: The element from which to remove the event listener.
  - `evt`: The event type (e.g., `click`, `mouseover`).
  - `fn`: The event handler function to remove.
  - `opts`: The options that were used when adding the event listener (optional, default is `false`).

- **How it works:**
  - This function simply calls `removeEventListener` on the given element (`el`) with the same parameters as when the event listener was added.
  - If a delegation function was used (`target` specified in `on`), we can pass the `delegatorFn` to `off` to ensure the correct listener is removed.

- **Usage Example:**

  ```javascript
  // 1. Adding an event listener and removing it
  const fn = () => console.log("!");
  document.body.addEventListener("click", fn);
  off(document.body, "click", fn); // Removes the listener

  // 2. Adding an event delegation listener and removing it
  const delegatorFn = on(document.body, "click", () => console.log("!"), {
    target: "p",
  });
  off(document.body, "click", delegatorFn); // Removes the delegation listener

  // 3. Removing a capturing event listener
  const delegatorFnCapturing = on(
    document.body,
    "click",
    () => console.log("!"),
    { options: true },
  );
  off(document.body, "click", delegatorFnCapturing, { options: true }); // Removes the listener with capturing
  ```

### Summary

- The `on` function allows you to register event listeners with optional delegation and custom options.
- The `off` function helps remove event listeners that were added using `on`, ensuring the listener is removed correctly, whether it's a direct or delegated listener.
- Using this pattern, you avoid the performance overhead of adding event listeners to multiple child elements and make your code more efficient and scalable.

This approach is useful in situations where you need to handle many similar elements dynamically (e.g., handling clicks on a large list of items) without attaching individual listeners to each element.

Event delegation is one of the most powerful patterns in JavaScript DOM manipulation. It leverages **event bubbling** to attach a single event listener to a parent element rather than attaching individual listeners to multiple existing (or future) child elements.

Here is a complete, production-ready, reusable **`on`** and **`off`** event delegation helper module written in modern JavaScript.

---

### Core Implementation

```javascript
/**
 * Internal weak map to keep track of handler references so they can be removed with `off`.
 * Key: Original listener function
 * Value: Map of element -> delegated wrapper function
 */
const listenerMap = new WeakMap();

/**
 * Attaches an event listener to a target, supporting event delegation.
 *
 * @param {Element|Document|Window} element - Parent container to attach event listener to.
 * @param {string} eventType - Event type (e.g., 'click', 'input').
 * @param {string|Function} selectorOrHandler - CSS selector for delegation OR handler callback if no delegation.
 * @param {Function|Object} [handlerOrOptions] - Handler callback OR event options object.
 * @param {Object} [options] - Event listener options (e.g., { capture: true, once: true, passive: true }).
 */
export function on(
  element,
  eventType,
  selectorOrHandler,
  handlerOrOptions,
  options,
) {
  let selector;
  let handler;
  let listenerOptions;

  // Handle signature overload: on(element, type, handler, options) vs on(element, type, selector, handler, options)
  if (typeof selectorOrHandler === "function") {
    handler = selectorOrHandler;
    listenerOptions = handlerOrOptions;
    selector = null;
  } else {
    selector = selectorOrHandler;
    handler = handlerOrOptions;
    listenerOptions = options;
  }

  // Create the delegation wrapper
  const delegatedWrapper = function (event) {
    if (!selector) {
      // Direct event listener (no delegation)
      return handler.call(this, event);
    }

    // Delegated event listener: find nearest matching ancestor from event.target
    const targetElement = event.target.closest(selector);

    // Ensure the target element matches the selector and lives inside the registered parent element
    if (targetElement && element.contains(targetElement)) {
      // Call handler with targetElement as `this` context
      return handler.call(targetElement, event, targetElement);
    }
  };

  // Store wrapper mapping for removal via `off()`
  if (!listenerMap.has(handler)) {
    listenerMap.set(handler, new Map());
  }
  listenerMap.get(handler).set(element, delegatedWrapper);

  // Attach listener
  element.addEventListener(eventType, delegatedWrapper, listenerOptions);
}

/**
 * Removes an event listener previously attached via `on`.
 *
 * @param {Element|Document|Window} element - Target container element.
 * @param {string} eventType - Event type.
 * @param {Function} handler - Original callback function used when calling `on`.
 * @param {Object} [options] - Event listener options (e.g., { capture: true }).
 */
export function off(element, eventType, handler, options) {
  const handlerBindings = listenerMap.get(handler);
  const delegatedWrapper = handlerBindings?.get(element);

  // Fallback to original handler if wrapper isn't found
  const targetListener = delegatedWrapper || handler;

  element.removeEventListener(eventType, targetListener, options);

  // Clean up internal map
  if (handlerBindings) {
    handlerBindings.delete(element);
    if (handlerBindings.size === 0) {
      listenerMap.delete(handler);
    }
  }
}
```

---

### Key Features Explained

1. **`Element.prototype.closest()`**: Traverses up the DOM tree from `event.target` to match the selector. This guarantees that clicks on child elements nested inside your targeted selector (like an `<i>` icon inside a `<button class="btn">`) are handled correctly.
2. **Flexible Signature**: Supports both delegated usage (`on(parent, 'click', '.btn', fn)`) and non-delegated direct binding (`on(btn, 'click', fn)`).
3. **WeakMap Memory Management**: The module uses `WeakMap` to associate original handler references with internal delegation wrappers. This allows clean removal via `off(parent, 'click', fn)` without requiring you to store wrapper instances manually.
4. **Context Binding**: Inside the delegated callback, `this` (and the second parameter) points directly to the matching delegated element (`targetElement`), mirroring standard DOM event behavior.

---

### Usage Examples

#### 1. Delegated Event Listener on Dynamic Elements

```javascript
import { on, off } from "./eventDelegation.js";

const listContainer = document.querySelector("#item-list");

// Callback function
function handleItemClick(event, target) {
  console.log("Clicked Item ID:", target.dataset.id);
}

// Attach delegated listener to any '.item' elements (present or dynamically added later)
on(listContainer, "click", ".item", handleItemClick);

// Clean up listener later
// off(listContainer, 'click', handleItemClick);
```

#### 2. Event Delegation with Options (e.g. Capture or Passive)

```javascript
// Attach listener using event capturing option
on(
  document.body,
  "click",
  ".modal-close",
  (e, target) => {
    console.log("Modal closing from:", target);
  },
  { capture: true },
);
```
