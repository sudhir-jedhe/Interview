```js
async function f() {
  throw new Error("async fail");
}
f().catch(e => console.log("outer catch:", e.message));
console.log("sync line");
```
**Answer:**
```
sync line
outer catch: async fail
```
**Why:** An `async function` that throws returns a rejected promise rather than throwing synchronously to the caller. `f()` returns immediately (microtask scheduled), so `"sync line"` logs first; the `.catch()` handler runs as a microtask after the current synchronous code finishes.
