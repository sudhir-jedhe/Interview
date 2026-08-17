# Output-Based Questions: Error Handling

```js
function a() {
  try {
    return 1;
  } finally {
    console.log("finally a");
  }
}
console.log(a());
```
**Answer:**
```
finally a
1
```
**Why:** `try` computes the return value `1` first, but before the function actually returns, `finally` runs to completion. Since `finally` has no `return` of its own, the original value (`1`) is used. The `console.log(a())` only logs after `a()` fully returns, so "finally a" logs first.

---

```js
function b() {
  try {
    throw new Error("x");
  } finally {
    return "rescued";
  }
}
console.log(b());
```
**Answer:**
```
rescued
```
**Why:** A `return` inside `finally` overrides everything — including a pending thrown error. The exception from `try` is discarded entirely; it never propagates because `finally`'s control-flow statement (`return`) takes precedence.

---

```js
try {
  setTimeout(() => { throw new Error("late"); }, 0);
} catch (e) {
  console.log("caught");
}
console.log("after try");
```
**Answer:**
```
after try
Uncaught Error: late
```
**Why:** The `setTimeout` callback runs on a later event loop tick, long after the synchronous `try/catch` has already exited. `catch` can only intercept errors thrown synchronously while the `try` block is executing on the call stack, so "caught" never logs and the error surfaces as uncaught.

---

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

---

```js
function outer() {
  try {
    inner();
  } catch (e) {
    console.log("outer caught:", e.message);
  }
}
function inner() {
  try {
    throw new Error("deep");
  } catch (e) {
    console.log("inner caught, rethrowing");
    throw e;
  }
}
outer();
```
**Answer:**
```
inner caught, rethrowing
outer caught: deep
```
**Why:** `inner`'s `catch` runs and logs, then rethrows the same error object. Because the throw happens synchronously and `inner()` is called from within `outer`'s `try`, the rethrown error propagates up the still-active call stack and is caught by `outer`'s `catch`.

---

```js
console.log("start");
Promise.reject(new Error("oops"));
console.log("end");
```
**Answer:**
```
start
end
Uncaught (in promise) Error: oops
```
**Why:** `Promise.reject` creates an already-rejected promise with no `.catch()` attached. The synchronous log lines run first. Only after the current synchronous execution and microtask queue settle does the runtime detect the rejection was never handled and report it (this detection is deferred to the end of the microtask queue, not instantaneous).

---

```js
class AppError extends Error {
  constructor(msg) {
    super(msg);
  }
}
const e = new AppError("bad");
console.log(e.name);
console.log(e instanceof AppError, e instanceof Error);
```
**Answer:**
```
Error
true true
```
**Why:** `name` is not automatically set to the subclass name — `Error`'s constructor sets `this.name = "Error"` by default, and `AppError` never overrides it. `instanceof` still works correctly through the prototype chain regardless, since `AppError.prototype` inherits from `Error.prototype`.

---

```js
function f() {
  let result = "initial";
  try {
    result = "try";
    throw new Error("x");
  } catch (e) {
    result = "catch";
  } finally {
    console.log("result at finally:", result);
  }
  return result;
}
console.log(f());
```
**Answer:**
```
result at finally: catch
catch
```
**Why:** `finally` runs after `catch` completes (since `catch` handled the error and didn't rethrow or return), so by the time `finally` executes, `result` has already been reassigned to `"catch"`. No override occurs here because `finally` doesn't return anything, so the function proceeds to `return result`, which is `"catch"`.
