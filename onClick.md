The three code snippets you provided define variations of the `onClick` function, which attaches a `click` event listener to a root element and invokes handlers based on specific predicates for elements within the root. The variations aim to handle event propagation and support multiple handlers, providing flexibility in how the handlers are invoked and allowing stopping the event propagation.

### Breakdown of Each Version:

#### 1. **First Version (Using `Map`)**

```javascript
// Map<node, Array<[predicate, handler]>>
const allHandlers = new Map();

/**
 * @param {HTMLElement} root
 * @param {(el: HTMLElement) => boolean} predicate
 * @param {(e: Event) => void} handler
 */
function onClick(root, predicate, handler) {
  if (allHandlers.has(root)) {
    allHandlers.get(root).push([predicate, handler]);
    return;
  }
  allHandlers.set(root, [[predicate, handler]]);

  // Attach the real handler
  root.addEventListener(
    "click",
    function (e) {
      let el = e.target;
      const handlers = allHandlers.get(root);
      let isPropagationStopped = false;
      e.stopPropagation = () => {
        isPropagationStopped = true;
      };

      // Bubble up the DOM tree and check predicates
      while (el) {
        let isImmediatePropagationStopped = false;
        e.stopImmediatePropagation = () => {
          isImmediatePropagationStopped = true;
          isPropagationStopped = true;
        };

        for (const [predicate, handler] of handlers) {
          if (predicate(el)) {
            handler.call(el, e);
            if (isImmediatePropagationStopped) {
              break;
            }
          }
        }

        if (el === root || isPropagationStopped) break;
        el = el.parentElement;
      }
    },
    false,
  );
}
```

- **Concept**: A global map `allHandlers` stores the predicates and handlers associated with each root element. When an event occurs, the event bubbles up from the target element to the root element, checking each handler along the way.
- **`stopPropagation` and `stopImmediatePropagation`**: Custom implementations allow stopping event propagation at the appropriate points.
  - `stopPropagation`: Prevents further event propagation.
  - `stopImmediatePropagation`: Prevents other handlers from being called on the same element.

#### 2. **Second Version (Using `root.handlers`)**

```javascript
/**
 * @param {HTMLElement} root
 * @param {(el: HTMLElement) => boolean} predicate
 * @param {(e: Event) => void} handler
 */
function onClick(root, predicate, handler) {
  if (root.handlers) {
    root.handlers.push([predicate, handler]);
  } else {
    const originalStopImmediatePropagation =
      Event.prototype.stopImmediatePropagation;
    Event.prototype.stopImmediatePropagation = function () {
      this.immediatePropagationStopped = true;
      originalStopImmediatePropagation.apply(this, arguments);
    };

    root.addEventListener("click", function (e) {
      let node = e.target;
      while (node !== root) {
        for (const [p, h] of root.handlers) {
          if (p(node)) h.call(node, e);
          if (e.immediatePropagationStopped) return;
        }
        if (e.cancelBubble) return;
        node = node.parentElement;
      }
    });
    root.handlers = [[predicate, handler]];
  }
}
```

- **Concept**: This version attaches event handlers directly to the root's `handlers` property. Each time a new handler is added, it modifies the `stopImmediatePropagation` behavior to set a flag (`immediatePropagationStopped`) indicating that the event should not propagate further.
- **Event Bubbling**: Like the first version, the event bubbles up the DOM tree from the target element. The handlers are called based on whether the `predicate` for each element is satisfied.

#### 3. **Third Version (Using `root.cache` with Enhanced Propagation Control)**

```javascript
/**
 * @param {HTMLElement} root
 * @param {(el: HTMLElement) => boolean} predicate
 * @param {(e: Event) => void} handler
 */
function onClick(root, predicate, handler) {
  if (!root.cache) {
    Event.prototype.stopImmediatePropagation = (function (protoMethod) {
      return function () {
        this.__stopPropagationImmediately = true;
        protoMethod.apply(this, arguments);
      };
    })(Event.prototype.stopImmediatePropagation);

    Event.prototype.stopPropagation = (function (protoMethod) {
      return function () {
        this.__stopPropagation = true;
        protoMethod.apply(this, arguments);
      };
    })(Event.prototype.stopPropagation);

    root.addEventListener("click", function (event) {
      let node = event.target;
      while (node !== root) {
        for (const { predicate, handler } of root.cache) {
          if (predicate(node)) handler.call(node, event);
          if (event.__stopPropagationImmediately) return;
        }
        if (event.__stopPropagation) return;
        node = node.parentElement;
      }
    });

    root.cache = [
      {
        predicate,
        handler,
      },
    ];
  } else {
    root.cache.push({ predicate, handler });
  }
}
```

- **Concept**: This version uses `root.cache` to store handlers, and enhances the `stopPropagation` and `stopImmediatePropagation` methods by introducing custom flags (`__stopPropagationImmediately` and `__stopPropagation`) that control the flow of event propagation.
- **Custom Flags**:
  - `__stopPropagationImmediately`: Stops all handlers immediately after the first one that sets this flag is invoked.
  - `__stopPropagation`: Stops the bubbling process after handlers on the current element are invoked, but allows other handlers to run if they haven't set the "immediate" flag.

### Comparison and Key Differences:

1. **Storage of Handlers**:
   - **Version 1**: Uses a `Map` (`allHandlers`) to store handlers for each root element.
   - **Version 2**: Stores handlers directly in a `handlers` property on the root element.
   - **Version 3**: Stores handlers in a `cache` property on the root element.

2. **Event Propagation Control**:
   - **Version 1**: Modifies `stopPropagation` and `stopImmediatePropagation` to implement custom behavior for stopping propagation.
   - **Version 2**: Uses the `immediatePropagationStopped` flag to stop the propagation immediately when `stopImmediatePropagation` is invoked.
   - **Version 3**: Adds additional flags (`__stopPropagationImmediately` and `__stopPropagation`) to better manage when to stop propagation and when to stop all handlers immediately.

3. **Performance Considerations**:
   - **Version 1** and **Version 2** are fairly similar in performance, as they both use a simple list of predicates and handlers.
   - **Version 3** enhances control over propagation, but might introduce some overhead due to modifying the `stopPropagation` methods.

### Conclusion:

All three versions offer a solution for attaching multiple handlers to an event with different conditions (`predicate`) and allow precise control over event propagation. The main difference lies in how handlers are stored and how event propagation is managed:

- **Version 1** uses a `Map` to store handlers for each root element and provides clear control over propagation and immediate propagation.
- **Version 2** introduces a simpler approach where handlers are attached directly to the `root` element's `handlers` property, but still offers similar event propagation control.
- **Version 3** is more advanced, using custom flags for event propagation, and could be more useful when fine-tuned control over propagation is needed.

Choose the version based on your use case:

- If you need a simple handler setup, use **Version 2** or **Version 1**.
- If you need more precise control over event propagation, **Version 3** might be the best option.
