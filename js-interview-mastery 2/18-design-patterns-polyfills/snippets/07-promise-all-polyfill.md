# Snippet: Polyfill for `Promise.all` — preserves order, rejects fast on first failure

```js
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = new Array(promises.length);
    let remaining = promises.length;
    if (remaining === 0) return resolve(results);
    promises.forEach((p, i) => {
      Promise.resolve(p).then(
        (value) => {
          results[i] = value; // order preserved by index, regardless of settle order
          if (--remaining === 0) resolve(results);
        },
        reject // any single rejection rejects the whole thing immediately
      );
    });
  });
}

myPromiseAll([
  new Promise(r => setTimeout(() => r("slow"), 100)),
  Promise.resolve("fast"),
]).then(console.log);
// ["slow", "fast"] -- order matches input array, not resolution order
```
