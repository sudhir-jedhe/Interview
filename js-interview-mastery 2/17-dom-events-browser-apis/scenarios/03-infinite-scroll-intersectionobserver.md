# Scenario: Infinite scroll without janking the page

**You need to implement infinite scroll on a feed: load the next page of items when the user scrolls near the bottom, without janking the page or firing dozens of redundant checks per second.**

**Approach:**
Avoid a raw `scroll` listener that recalculates `getBoundingClientRect()` on every event (expensive and fires very frequently). Use `IntersectionObserver` on a sentinel element placed at the bottom of the list — the browser handles the intersection calculation efficiently off the main thread's hot path, and the callback only fires when the sentinel actually enters the viewport.

```js
const sentinel = document.querySelector("#feed-sentinel");
let loading = false;

const observer = new IntersectionObserver(async (entries) => {
  const entry = entries[0];
  if (entry.isIntersecting && !loading) {
    loading = true;
    await loadNextPage();
    loading = false;
  }
}, { rootMargin: "200px" }); // start loading slightly before it's fully visible

observer.observe(sentinel);
```

If `IntersectionObserver` weren't available, the fallback would be a throttled `scroll` listener checking `window.innerHeight + window.scrollY >= document.body.offsetHeight - threshold`.
