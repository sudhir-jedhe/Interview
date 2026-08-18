# Problem: `yieldToEventLoop()` Utility

**Goal:** Implement a small `await yieldToEventLoop()` utility that lets a long, synchronous-feeling loop periodically give control back to the event loop — so the UI (browser) or other pending I/O (Node) doesn't get starved — without restructuring the whole loop into a callback-based chunking scheme by hand.

## Implementation

```js
function yieldToEventLoop() {
  // A macrotask, not a microtask — genuinely yields to rendering/other pending work,
  // unlike Promise.resolve() or queueMicrotask(), which would drain before any repaint.
  return new Promise((resolve) => setTimeout(resolve, 0));
}
```

## Using it inside a long loop

```js
async function processLargeDataset(items, processItem, { yieldEveryN = 500 } = {}) {
  for (let i = 0; i < items.length; i++) {
    processItem(items[i]);
    if (i % yieldEveryN === yieldEveryN - 1) {
      await yieldToEventLoop(); // give the browser/event loop a chance to render/handle input
    }
  }
}

// Usage: processes 1,000,000 items without freezing the tab for the whole duration
await processLargeDataset(hugeArray, (item) => heavyTransform(item), { yieldEveryN: 1000 });
console.log('done — UI stayed responsive throughout');
```

## A version using `requestIdleCallback` when available (browser)

`requestIdleCallback` yields until the browser genuinely has spare time, which can be a better fit than a fixed item-count threshold when work per item varies a lot:

```js
function yieldToIdle() {
  if (typeof requestIdleCallback === 'function') {
    return new Promise((resolve) => requestIdleCallback(() => resolve()));
  }
  return yieldToEventLoop(); // fallback for Node or older browsers
}
```

## Key implementation details interviewers probe for

- **Why `setTimeout`, not `Promise.resolve()` or `queueMicrotask()`**: those are microtasks, which fully drain before the browser is allowed to render or process input — chaining enough of them back-to-back inside a loop can still freeze the UI just as badly as no yielding at all. Only a macrotask like `setTimeout` genuinely hands control back to the event loop's rendering/input step.
- **Choosing a yield frequency**: yielding too often (e.g., every single item) adds overhead from repeated timer scheduling/clamping and slows total completion time; yielding too rarely reintroduces jank. `yieldEveryN` (or a time-based check, e.g., yield if `performance.now() - lastYield > 16`) lets you tune the tradeoff.
- **This is the same underlying pattern as `problems/01-...` in the async-js topic's chunking scenario** — `yieldToEventLoop()` is just that pattern extracted into a reusable, `await`-friendly primitive.
