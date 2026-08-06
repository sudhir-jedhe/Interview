### 8. What is event bubbling in JavaScript?

**Event bubbling** is a type of event propagation in the DOM. When an event occurs on an element, it bubbles up from the target element to the root of the DOM tree, triggering any listeners attached to the ancestors of the target element.

Example: If you click on a button inside a div, the event will first trigger the button's event listener, then the div’s event listener (and so on).

### 9. What is event capturing in JavaScript?

**Event capturing** is the opposite of event bubbling. In event capturing, the event is triggered on the outermost element first (root of the DOM) and then propagates down to the target element.
