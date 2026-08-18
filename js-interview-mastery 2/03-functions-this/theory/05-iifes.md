# IIFEs (Immediately Invoked Function Expressions)

An Immediately Invoked Function Expression runs as soon as it's defined, creating an isolated scope:

```js
(function() {
  const privateVar = 'hidden';
  console.log(privateVar);
})();
```

Historically used to avoid polluting the global scope and to create module-like private state before ES modules and block scoping (`let`/`const`) existed. Still used today for one-off setup code or to create a closure around async top-level code (`(async () => { ... })()`).

## IIFE vs regular function declaration

| Aspect | IIFE | Regular Function Declaration |
|---|---|---|
| Execution | Runs immediately upon definition | Runs only when explicitly called |
| Reusability | Typically one-time use, not named/reusable | Reusable, callable by name any number of times |
| Purpose | Create an isolated scope, run setup code once | Define reusable logic |

Use an IIFE when you need a private, one-off scope — for example wrapping async top-level code or legacy module patterns (see the scope/hoisting topic's IIFE-based private counter for a fuller example). Use a regular declared function for anything you intend to call more than once. The common mistake is reaching for an IIFE where block scoping (`let`/`const` inside a bare `{ }`) or an ES module would be simpler and equally effective in modern JS.
