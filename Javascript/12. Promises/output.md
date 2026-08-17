This is one of the most critical sections for your repository. Interviewers use Event Loop questions to ruthlessly filter out candidates who rely on memorization rather than truly understanding how JavaScript executes under the hood.

> **Repo Organization Tip:** Save this entire block inside `04-Asynchronous-JS/output-problems.md`.

---

# Output Problems: The Event Loop & Promises

**The Golden Rule of the Event Loop:**

1. Run synchronous code (Call Stack).
2. Run all Microtasks (Promises, `queueMicrotask`).
3. Run one Macrotask (`setTimeout`, `setInterval`), then check Microtasks again.

---

### Problem 1: The Classic Race

```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
});

console.log('4');

```

---

### Problem 2: The Synchronous Executor

```javascript
console.log('A');

const promise = new Promise((resolve) => {
  console.log('B');
  resolve();
  console.log('C');
});

promise.then(() => {
  console.log('D');
});

console.log('E');

```

---

### Problem 3: Async/Await Suspension

```javascript
async function foo() {
  console.log('1');
  await Promise.resolve();
  console.log('2');
}

console.log('3');
foo();
console.log('4');

```

---

### Problem 4: The Catch Fall-Through

```javascript
Promise.resolve(1)
  .then((val) => {
    console.log(val);
    throw new Error('Broken');
  })
  .catch((err) => {
    console.log(err.message);
    return 2;
  })
  .then((val) => {
    console.log(val);
  });

```

---

### Problem 5: Queuing Tasks Inside Tasks

```javascript
setTimeout(() => console.log('1'), 0);

Promise.resolve().then(() => {
  console.log('2');
  setTimeout(() => console.log('3'), 0);
});

Promise.resolve().then(() => {
  console.log('4');
});

```

---
