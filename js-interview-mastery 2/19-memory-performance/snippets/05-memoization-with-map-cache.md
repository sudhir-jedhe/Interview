# Snippet: Memoization with a Map cache

```js
function memoize(fn) {
  const cache = new Map();
  return (n) => {
    if (cache.has(n)) {
      console.log("cache hit for", n);
      return cache.get(n);
    }
    const result = fn(n);
    cache.set(n, result);
    return result;
  };
}

const slowSquare = (n) => { for (let i = 0; i < 1e6; i++); return n * n; };
const fastSquare = memoize(slowSquare);
fastSquare(5); // computes, caches
fastSquare(5); // "cache hit for 5" -- returns instantly from cache
```
