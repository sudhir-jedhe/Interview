# Output: `Promise.all` polyfill rejects on the first rejection

```js
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let remaining = promises.length;
    promises.forEach((p, i) => {
      p.then(v => {
        results[i] = v;
        if (--remaining === 0) resolve(results);
      }, reject);
    });
  });
}

myPromiseAll([
  Promise.resolve(1),
  Promise.reject("fail"),
  Promise.resolve(3),
]).then(
  r => console.log("resolved:", r),
  e => console.log("rejected:", e)
);
```

**Answer:**
```
rejected: fail
```

**Why:** `Promise.all` semantics (correctly replicated here) mean the very first rejection immediately rejects the combined promise, regardless of whether other promises later resolve. The `.then(resolve, reject)` on the second promise fires `reject("fail")` as soon as that promise settles, short-circuiting the whole `myPromiseAll` call.
