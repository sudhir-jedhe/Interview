**"Print numbers from 10 to 1 with a delay of one second using setTimeout."**

Here are the 3 ways to implement it in JavaScript:

---

### Method 1: Using a `for` Loop

```javascript
for (let i = 10; i >= 1; i--) {
  setTimeout(() => {
    console.log(i);
  }, (11 - i) * 1000);
}

```

---

### Method 2: Using Recursive `setTimeout`

```javascript
function printCountdown(num) {
  if (num < 1) return;

  setTimeout(() => {
    console.log(num);
    printCountdown(num - 1);
  }, 1000);
}

printCountdown(10);

```

---

### Method 3: Using `async/await` and Promises

```javascript
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function countdown() {
  for (let i = 10; i >= 1; i--) {
    await sleep(1000);
    console.log(i);
  }
}

countdown();

```
