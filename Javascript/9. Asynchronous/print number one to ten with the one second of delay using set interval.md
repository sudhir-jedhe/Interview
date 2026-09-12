```javascript
let count = 1;

const intervalId = setInterval(() => {
  console.log(count);

  if (count === 10) {
    clearInterval(intervalId);
  }

  count++;
}, 1000);

```

### How it works

* `count` tracks the current number, starting at `1`.
* `setInterval(..., 1000)` executes the callback function every **1000 milliseconds** (1 second).
* Each second, it logs the current number and increments `count`.
* Once `count` reaches `10`, `clearInterval(intervalId)` stops the timer.
