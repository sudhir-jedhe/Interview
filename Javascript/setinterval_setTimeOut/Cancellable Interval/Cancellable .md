Implement a function that acts like setInterval but returns a function to cancel the interval

```js
function customSetInterval(callback, interval) {
  let timerId;

  function repeat() {
    callback();
    timerId = setTimeout(repeat, interval);
  }

  repeat(); // Start the interval immediately

  // Return the cancellation function
  return function cancelInterval() {
    clearTimeout(timerId);
  };
}

const intervalId = customSetInterval(() => {
  console.log("This will repeat!");
}, 1000);

// After some time...
clearInterval(intervalId); // Cancels the repeating task
```
