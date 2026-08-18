# Common Web APIs

## `fetch`

`fetch(url, options)` returns a promise resolving to a `Response`; note it only rejects on network failure, not on HTTP error status — you must check `response.ok` yourself.

```js
const res = await fetch("/api/users");
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();
```

A 404 or 500 response still resolves the promise normally; `response.ok` is `false` for any non-2xx status. Forgetting to check `res.ok` is a very common bug.

## `localStorage` and `sessionStorage`

Both store string key-value pairs (you must `JSON.stringify`/`parse` for objects). `localStorage` persists across tabs/restarts; `sessionStorage` is scoped to a single tab and clears when that tab closes. Neither is safe for large data — both operate synchronously on the main thread and have a size limit (roughly 5–10MB depending on browser).

```js
localStorage.setItem("user", JSON.stringify({ name: "Ana" }));
const user = JSON.parse(localStorage.getItem("user"));
```

Values are always coerced to strings on write: `localStorage.setItem("count", 5)` stores `"5"`, so `localStorage.getItem("count") + 1` produces `"51"` (string concatenation), not `6`.

## `IntersectionObserver`

Efficiently detects when an element enters/exits the viewport (or another element) without expensive scroll-event polling — commonly used for lazy-loading images and infinite scroll.

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) console.log("visible:", entry.target);
  });
}, { rootMargin: "200px" });

observer.observe(document.querySelector("#sentinel"));
```

Before `IntersectionObserver` existed, developers used throttled `scroll` listeners combined with manual `getBoundingClientRect()` math — more CPU-intensive and janky, especially on mobile.
