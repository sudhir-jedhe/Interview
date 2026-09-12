Here are two common ways to do this in JavaScript:

### 1. Using `setTimeout` (Standard Callback)

```javascript
setTimeout(() => {
  console.log("Hello World");
}, 3000);

```

---

### 2. Using `async/await` with a Promise

```javascript
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  await sleep(3000);
  console.log("Hello World");
}

run();

```
