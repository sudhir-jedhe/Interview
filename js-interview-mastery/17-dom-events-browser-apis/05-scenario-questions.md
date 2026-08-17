# Scenario Questions: DOM, Events & Browser APIs

## 1. You're building a comments feed that renders user-submitted text (which may contain HTML-like characters) alongside a small set of allowed formatting tags (bold, italic, links). How do you render this safely?

**Approach:**
Never pipe raw user input straight into `innerHTML`. If you only need plain text, use `textContent` — it's immune to injection by construction. If you genuinely need to allow a limited set of tags, run the input through a sanitizer (e.g., DOMPurify) configured with an allowlist before assigning to `innerHTML`, rather than trying to hand-write a regex-based filter (regex-based HTML sanitization is notoriously easy to bypass).

```js
function renderComment(container, rawText) {
  // Safe default: plain text, no formatting risk at all
  const p = document.createElement("p");
  p.textContent = rawText;
  container.append(p);
}

// If limited formatting is required, sanitize first:
function renderFormattedComment(container, rawHtml) {
  const clean = DOMPurify.sanitize(rawHtml, { ALLOWED_TAGS: ["b", "i", "a"], ALLOWED_ATTR: ["href"] });
  const p = document.createElement("p");
  p.innerHTML = clean; // safe because it passed through an allowlist sanitizer
  container.append(p);
}
```

## 2. You have a table with thousands of rows, each with a "delete" button. Attaching a click listener to every button causes noticeable memory/perf overhead and slow initial render. How do you fix this?

**Approach:**
Use event delegation: attach a single click listener to the table (or `<tbody>`) and use `event.target.closest()` to identify whether a delete button was clicked and which row it belongs to. This also means new rows added dynamically (e.g., after pagination or an insert) work automatically without wiring up new listeners.

```js
const tbody = document.querySelector("tbody");

tbody.addEventListener("click", (event) => {
  const deleteBtn = event.target.closest("button.delete");
  if (!deleteBtn) return;
  const row = deleteBtn.closest("tr");
  const id = row.dataset.id;
  deleteRow(id); // e.g., calls an API then removes the row from the DOM
  row.remove();
});
```

## 3. You need to implement infinite scroll on a feed: load the next page of items when the user scrolls near the bottom, without janking the page or firing dozens of redundant checks per second.

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

## 4. You're building a search-as-you-type box that hits an API on every keystroke. Users on slower connections complain about a flood of requests and results flickering as older, slower responses arrive after newer ones.

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

## 5. You want a modal dialog that closes when the user clicks outside of it, but clicking inside the modal (including on buttons within it) should not close it.

**Approach:**
Attach a click listener to a full-screen overlay behind the modal, and rely on the fact that a click on the modal content itself won't reach the overlay's listener *if* the modal stops propagation — or, more robustly, check whether the click's target is outside the modal element using `contains()`, which avoids relying on `stopPropagation` scattered across child components.

```js
const overlay = document.querySelector(".modal-overlay");
const modal = document.querySelector(".modal");

overlay.addEventListener("click", (event) => {
  if (!modal.contains(event.target)) {
    closeModal();
  }
});
```

This approach is preferred over `stopPropagation()` on every interactive element inside the modal, because it centralizes the "am I inside or outside" logic in one place instead of requiring every button/link inside the modal to remember to stop propagation.
