# Scenario: What a `Promise.all` polyfill actually needs to handle

**You're asked to implement `Promise.all` as a polyfill for an environment that doesn't have it. What are the tricky requirements beyond "wait for all promises to resolve"?**

**Approach:**
Key requirements: (1) results must preserve the *input* order, not the order promises settle in; (2) it must reject as soon as *any* input promise rejects, without waiting for the rest; (3) non-promise values in the input array must be treated as already-resolved values (wrap with `Promise.resolve`); (4) an empty input array should resolve immediately with an empty array.

```js
function myPromiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const promises = Array.from(iterable);
    const results = new Array(promises.length);
    let remaining = promises.length;

    if (remaining === 0) {
      resolve(results);
      return;
    }

    promises.forEach((item, index) => {
      Promise.resolve(item).then(
        (value) => {
          results[index] = value;
          remaining -= 1;
          if (remaining === 0) resolve(results);
        },
        (err) => reject(err) // first rejection wins, immediately
      );
    });
  });
}
```
