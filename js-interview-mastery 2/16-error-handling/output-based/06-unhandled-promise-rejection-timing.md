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
