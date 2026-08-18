# `this` in Callbacks and Event Handlers

DOM event listeners call your handler with `this` bound to the element the listener is attached to, if you use a regular function:

```js
button.addEventListener('click', function() {
  console.log(this); // the button element
});
```

Using an arrow function here would instead inherit `this` from the surrounding scope (often the module or class), *not* the button — a common source of confusion when converting old code to arrow syntax without considering the `this` change.

This same pattern shows up constantly with any callback-taking API — `setTimeout`, `setInterval`, array methods, promise handlers, event emitters. Whenever a function you wrote is *called by someone else's code* rather than directly by you, the caller decides `this` for a regular function (usually resulting in default binding, i.e. `undefined` or the global object) unless you've explicitly bound it (`.bind(this)`) or used an arrow function to inherit the surrounding `this` lexically instead. See `../scenarios/01-fixing-lost-this-in-class-event-handlers.md` for worked fixes to this exact problem in a class context.
