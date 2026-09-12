Here are the three standard ways to do this using `setTimeout`:

### 1. Using a Loop with Block-Scoped `let` (Most Common)

Multiplying the index `i` by `1000ms` schedules each timeout relative to the start time. Because `let` is block-scoped, each iteration binds its own separate copy of `i`.

```javascript
for (let i = 1; i <= 10; i++) {
  setTimeout(() => {
    console.log(i);
  }, i * 1000);
}

```

---

### 2. Using Recursive `setTimeout` (True Chaining)

Instead of scheduling all 10 timers at once, each timer schedules the next one only after it executes.

```javascript
function printNumber(count) {
  if (count > 10) return;

  setTimeout(() => {
    console.log(count);
    printNumber(count + 1);
  }, 1000);
}

printNumber(1);

```

---

### 3. Using `async/await` with a Promisified `setTimeout`

```javascript
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function printOneToTen() {
  for (let i = 1; i <= 10; i++) {
    await sleep(1000);
    console.log(i);
  }
}

printOneToTen();

```
