# Scenario: Search-as-you-type flooding the API with stale results flickering

**You're building a search-as-you-type box that hits an API on every keystroke. Users on slower connections complain about a flood of requests and results flickering as older, slower responses arrive after newer ones.**

**Approach:**
Two separate problems: too many requests (fix with debounce, since you only care about the value after the user pauses typing), and out-of-order responses (fix by tracking a request id/token and ignoring stale responses, or using `AbortController` to cancel in-flight requests when a new one starts).

```js
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

let controller;
const search = debounce(async (query) => {
  controller?.abort(); // cancel any still-pending previous request
  controller = new AbortController();
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
    const results = await res.json();
    renderResults(results);
  } catch (err) {
    if (err.name !== "AbortError") console.error(err);
  }
}, 300);

searchInput.addEventListener("input", (e) => search(e.target.value));
```

This exact pattern — debounced input, keyboard navigation, mock data — is built out as a full runnable project in `../projects/typeahead-search/`.
