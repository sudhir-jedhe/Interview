# Notes: DOM, Events & Browser APIs

*(Browser-only unless noted — run these in a browser console with a page loaded, not a Node REPL.)*

## Selecting, creating, and modifying nodes

`document.querySelector(selector)` returns the first matching element (or `null`); `querySelectorAll` returns a static `NodeList` of all matches. `createElement` builds a detached node you must insert with `appendChild`/`append`/`insertBefore` to see it rendered.

```js
const el = document.createElement("div");
el.textContent = "Hello";
document.body.append(el);
```

The critical distinction is `textContent` vs `innerHTML`. `textContent` sets/reads raw text — any string assigned to it is inserted literally, never parsed as markup. `innerHTML` parses the assigned string as HTML and creates real DOM nodes from it.

```js
const userInput = "<img src=x onerror=alert('xss')>";
el.textContent = userInput; // safe: renders the literal text "<img src=x onerror=alert('xss')>"
el.innerHTML = userInput;   // DANGEROUS: creates a real <img> tag, onerror fires, XSS executes
```

This is the single most common DOM-related security bug: rendering untrusted (user- or API-supplied) content via `innerHTML`. If you must insert HTML, sanitize it first (e.g., with DOMPurify) or use safer APIs. Never build `innerHTML` strings via concatenation with unescaped user input.

## Event bubbling vs. capturing

DOM events travel in three phases: **capturing** (from `window` down to the target), **target** (the element itself), then **bubbling** (back up from target to `window`). By default, `addEventListener(type, handler)` listens during the bubbling phase. Passing `{ capture: true }` (or `true` as the third argument) listens during the capturing phase instead.

```js
document.body.addEventListener("click", () => console.log("body (capture)"), { capture: true });
document.body.addEventListener("click", () => console.log("body (bubble)"));
// clicking a child inside body logs "body (capture)" before the child's own bubble handler,
// and "body (bubble)" after it
```

Most events bubble (`click`, `input`, `keydown`), but a few don't (`focus`, `blur`, `mouseenter`, `mouseleave` — though `focusin`/`focusout`/`mouseover`/`mouseout` are their bubbling equivalents).

## Event delegation

Because events bubble, you can attach **one** listener to a common ancestor instead of one listener per child, and inspect `event.target` to figure out which child was actually interacted with. This is more memory-efficient and automatically works for children added later.

```js
// Instead of adding a click listener to every <li>...
document.querySelector("ul#todo-list").addEventListener("click", (event) => {
  const item = event.target.closest("li");
  if (!item) return; // click didn't land on/inside an <li>
  console.log("clicked:", item.textContent);
});
```

`event.target` is the actual element that triggered the event (e.g., a `<span>` inside the `<li>`); `event.currentTarget` is the element the listener is attached to (the `<ul>`). `closest()` walks up from `target` to find the nearest matching ancestor, which is what makes delegation robust to nested markup.

## preventDefault vs stopPropagation vs stopImmediatePropagation

These solve three different problems and are frequently confused:

- `preventDefault()` stops the browser's **default action** for the event (following a link, submitting a form, checking a checkbox) — it does *not* stop propagation.
- `stopPropagation()` stops the event from continuing to **bubble/capture** to other elements — it does *not* prevent the default action.
- `stopImmediatePropagation()` does what `stopPropagation` does, *and* also prevents any other listeners registered on the **same element** for the same event from running.

```js
form.addEventListener("submit", (e) => {
  e.preventDefault(); // stop the page from reloading
  // form still bubbles up to any ancestor's submit listener unless stopPropagation is also called
});
```

## Common Web APIs

`fetch(url, options)` returns a promise resolving to a `Response`; note it only rejects on network failure, not on HTTP error status — you must check `response.ok` yourself. `localStorage` and `sessionStorage` store string key-value pairs (you must `JSON.stringify`/`parse` for objects); `localStorage` persists across tabs/restarts, `sessionStorage` clears when the tab closes. `IntersectionObserver` efficiently detects when an element enters/exits the viewport (or another element) without expensive scroll-event polling — commonly used for lazy-loading images and infinite scroll.

## Debounce and throttle

High-frequency events (`scroll`, `resize`, `input`, `mousemove`) can fire dozens of times per second; running expensive work on every event kills performance. **Debounce** delays execution until events stop firing for a period (good for "search as you type" — wait until the user pauses). **Throttle** guarantees execution at most once per fixed interval regardless of how often the event fires (good for scroll position tracking, where you want steady updates, not just a final one). See `04-comparisons.md` and `../18-design-patterns-polyfills/` for full implementations.
