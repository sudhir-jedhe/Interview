# Designing a `thisArg` Parameter Like `Array.prototype.forEach`

**Scenario:** You're writing a small utility that needs to work with array-like objects (like `arguments` or a DOM `NodeList`) and needs a consistent way to control what `this` refers to when calling a callback the caller supplies (mimicking `Array.prototype.forEach`'s `thisArg` parameter). How would you design it?

**Approach:** Accept an optional `thisArg` and use `call` to explicitly set `this` for each invocation of the callback, exactly like the built-in array methods do:

```js
function myForEach(arrayLike, callback, thisArg) {
  for (let i = 0; i < arrayLike.length; i++) {
    callback.call(thisArg, arrayLike[i], i, arrayLike);
  }
}

const logger = {
  prefix: '[LOG]',
  print(item) {
    console.log(this.prefix, item);
  }
};

myForEach(['a', 'b', 'c'], logger.print, logger);
// '[LOG] a', '[LOG] b', '[LOG] c' — this.prefix resolves correctly because we used call()
```

This mirrors how `Array.prototype.forEach(callback, thisArg)` actually works internally. The key design decision is using `callback.call(thisArg, ...)` rather than just `callback(...)`, since a bare call would default-bind `this`, breaking any object-method callback the caller passes in. This also composes correctly with arrow function callbacks — since arrow functions ignore `thisArg` entirely (they already have lexical `this`), passing `thisArg` alongside an arrow callback simply has no effect, which matches the native array method behavior exactly.
