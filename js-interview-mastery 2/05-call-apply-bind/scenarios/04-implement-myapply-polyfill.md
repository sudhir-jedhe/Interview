# Scenario: implementing Function.prototype.myApply from scratch

**Prompt:** You're asked in an interview to implement `Function.prototype.myApply` from scratch (not just `myBind`). What does the implementation look like, and what edge cases does a correct version need to handle?

**Approach:**

```js
Function.prototype.myApply = function(thisArg, argsArray) {
  const context = (thisArg === null || thisArg === undefined) ? globalThis : Object(thisArg);
  const fnKey = Symbol('fn'); // unique property key to avoid clobbering existing properties
  context[fnKey] = this;

  const args = argsArray === null || argsArray === undefined ? [] : argsArray;
  const result = context[fnKey](...args);

  delete context[fnKey]; // clean up the temporary property
  return result;
};

function introduce(greeting) { return `${greeting}, ${this.name}`; }
console.log(introduce.myApply({ name: 'Kai' }, ['Hi'])); // 'Hi, Kai'
```

The core trick: to make `this` resolve correctly inside the target function without using the real `apply`/`call`, you temporarily attach the function as a property on the context object and invoke it as a method call (`context[fnKey](...)`) — that's implicit binding doing the work. A `Symbol` key avoids accidentally overwriting a real property named `fn` on the context object.

**Edge cases:** (1) `thisArg` being `null`/`undefined` should fall back to the global object in non-strict semantics (real `apply` does this too, though strict-mode functions preserve `undefined`/`null` as-is — a fully spec-accurate version needs to know whether the target function is strict); (2) `argsArray` being `null`/`undefined` should call with no arguments rather than throwing; (3) if `thisArg` is a primitive (e.g. a number), it needs to be boxed via `Object(thisArg)` so you can attach a property to it, mirroring real non-strict `this` coercion behavior. See `problems/01-polyfills-mycall-myapply-mybind.md` for the full trio (`myCall`, `myApply`, `myBind`) implemented and explained together.
