# Memoization Using a Closure-Captured Cache

```js
function memoize(fn) {
  const cache = {};
  return (n) => {
    if (n in cache) return cache[n];
    return (cache[n] = fn(n));
  };
}
let calls = 0;
const square = memoize((n) => { calls++; return n * n; });
square(4); square(4); square(4);
console.log(calls); // 1 — only computed once, subsequent calls hit the cache
```
