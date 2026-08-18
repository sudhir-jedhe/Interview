# Closure Definition and Variable Lifetime

A closure is what you get when a function "remembers" the variables from the scope it was defined in, even after that outer scope has finished executing. Every function in JavaScript forms a closure over its lexical environment at creation time — this isn't an opt-in feature, it's just how functions work. The word "closure" specifically becomes relevant when a function is used *outside* the scope it was created in (returned, passed as a callback, stored somewhere) and it still has access to those outer variables.

```js
function makeCounter() {
  let count = 0; // lives in makeCounter's scope
  return function() {
    count++; // this inner function "closes over" count
    return count;
  };
}

const counter = makeCounter(); // makeCounter has already returned...
console.log(counter()); // 1 — ...yet count is still alive and accessible
console.log(counter()); // 2
```

Normally, when a function returns, its local variables would be garbage-collected because nothing references them anymore. But here, the inner function still holds a reference to `count`, so the JS engine keeps that variable alive in memory for as long as the inner function itself is reachable. This is the core mechanic: closures extend a variable's lifetime beyond its enclosing function's execution.

## Each call creates a new closure

Every invocation of `makeCounter` creates a fresh `count` variable and a fresh closure over it — they don't share state:

```js
const counterA = makeCounter();
const counterB = makeCounter();
console.log(counterA()); // 1
console.log(counterA()); // 2
console.log(counterB()); // 1 — independent count, unaffected by counterA
```

This "fresh closure per call" behavior is what makes closures usable as a general-purpose factory pattern for independent stateful objects, without ever reaching for a `class`.
