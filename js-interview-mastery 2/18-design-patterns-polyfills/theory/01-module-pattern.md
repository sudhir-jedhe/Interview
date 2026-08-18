# Module Pattern

Before ES modules existed, JavaScript had no built-in way to keep variables private to a file — everything leaked into the global scope. The module pattern uses an IIFE (Immediately Invoked Function Expression) plus closures to create a private scope, exposing only what you choose on a returned object.

```js
const Counter = (function () {
  let count = 0; // private, inaccessible from outside
  function increment() {
    count += 1;
    return count;
  }
  function reset() {
    count = 0;
  }
  return { increment, reset }; // public API
})();

Counter.increment(); // 1
console.log(Counter.count); // undefined -- truly private
```

This pattern is largely superseded by native ES modules (`import`/`export`, which have file-level privacy by default), but it still shows up in interviews because it demonstrates a real understanding of closures and scope.

## Module pattern (IIFE) vs. ES modules

| Aspect | IIFE module pattern | ES modules (`import`/`export`) |
|---|---|---|
| Privacy mechanism | Closure over local variables | File scope — top-level bindings aren't global by default |
| Syntax overhead | Manual wrapping, manual public API object | Native `export`/`import` keywords |
| Static analysis (tree-shaking, etc.) | Not possible — dynamic object | Possible — imports/exports are statically analyzable |
| Still relevant today? | Mostly for interviews / legacy code / bundler-output patterns | Yes, the standard for all modern code |

Know the IIFE pattern because it explains *why* closures matter and shows up in legacy code and interview questions, but default to ES modules in real projects. A common mistake is over-engineering module-pattern boilerplate in new code where native modules already solve the problem more simply.
