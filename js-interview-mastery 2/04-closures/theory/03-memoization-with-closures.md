# Memoization with Closures

Closures let a function cache results across calls by capturing a cache object in its closure:

```js
function memoize(fn) {
  const cache = new Map(); // captured by the returned function
  return function(arg) {
    if (cache.has(arg)) return cache.get(arg);
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

const slowSquare = (n) => { for (let i = 0; i < 1e6; i++); return n * n; };
const fastSquare = memoize(slowSquare);
fastSquare(5); // computes and caches
fastSquare(5); // returns cached result instantly
```

A full worked implementation with verification lives in `../problems/02-memoize-function.md`.

## Memoized (closure-cached) vs recomputing every call

| Aspect | Memoized (closure-cached) | Recomputed every call |
|---|---|---|
| Speed on repeated calls with same input | Fast after first call — cache hit | Same cost every time |
| Memory cost | Grows with number of unique inputs cached | None beyond the call itself |
| Correctness risk | Stale cache if the underlying data changes but the input key doesn't | Always reflects current state |

Use memoization for expensive, pure (deterministic, side-effect-free) computations repeatedly called with a limited set of inputs. Avoid it for functions whose output can change for the same input over time (e.g. depends on external mutable state), or for cheap functions where caching overhead exceeds the savings. The common mistake is memoizing a function that isn't actually pure, silently serving stale results — see `../scenarios/04-stale-memoization-cache-bug.md` for a worked example of diagnosing exactly that bug.
