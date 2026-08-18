**You're processing a large array (100,000 items) in the browser with a heavy synchronous transformation on each item, and the UI freezes completely while it runs — no scroll, no clicks, no animations. How do you fix this using your understanding of the event loop, and what's the trade-off?**

**Approach:**
The freeze happens because the entire loop runs as one synchronous block occupying the call stack — the event loop can't process any macrotask (including UI events and rendering) until the stack is empty. The fix is to break the work into chunks and yield back to the event loop between chunks, letting pending macrotasks (rendering, input) run in between:

```js
function processInChunks(items, chunkSize, processItem) {
  let index = 0;
  function runChunk() {
    const end = Math.min(index + chunkSize, items.length);
    for (; index < end; index++) {
      processItem(items[index]);
    }
    if (index < items.length) {
      setTimeout(runChunk, 0); // yield to the event loop, then continue
    }
  }
  runChunk();
}
```
Using `setTimeout(runChunk, 0)` rather than `Promise.resolve().then(runChunk)` matters here — a microtask-based "yield" would still fully drain before the browser gets to render or process input events, so it wouldn't actually unfreeze the UI between chunks; only a macrotask genuinely yields to rendering/input. The trade-off is total processing time increases slightly (each `setTimeout` has some minimum overhead/clamping), but the UI stays responsive throughout. For CPU-heavy work, moving the loop into a Web Worker (a separate thread) is usually the better fix, avoiding the main thread entirely. See `problems/03-yield-to-event-loop-utility.md` for a reusable `yieldToEventLoop()` version of this pattern.
