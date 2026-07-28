// The clearInterval() function is used in javascript to clear the interval which has been set by setInterval() function. i.e, The return value returned by setInterval() function is stored in a variable and it’s passed into the clearInterval() function to clear the interval.

// For example, the below setInterval method is used to display the message for every 3 seconds. This interval can be cleared by the clearInterval() method.

```js
var msg;
function greeting() {
  alert("Good morning");
}
function start() {
  msg = setInterval(greeting, 3000);
}

function stop() {
  clearInterval(msg);
}

/****************************** */
function clearAllIntervals() {
  // Get all interval IDs
  const intervalIds = Object.keys(window).filter((key) =>
    key.startsWith("interval"),
  );

  // Clear each interval
  intervalIds.forEach((id) => {
    clearInterval(window[id]);
    delete window[id]; // Remove the interval ID from the window object
  });
}

// Set some intervals
const interval1 = setInterval(() => console.log("Interval 1"), 1000);
const interval2 = setInterval(() => console.log("Interval 2"), 2000);

// Clear all intervals
clearAllIntervals();

/************************************** */
let intervalIds = [];

function clearAllIntervals() {
  intervalIds.forEach((id) => clearInterval(id));
  intervalIds = [];
}

// Override window.setInterval
window.setInterval = (func, interval) => {
  const intervalId = setInterval(func, interval);
  intervalIds.push(intervalId);
  return intervalId;
};

// Example usage:
// Assume some intervals are set using window.setInterval
clearAllIntervals();

/***************************** */

const MY_TIMERS = {
  intervalIds: [], //global interval id's arrays
  //create a MY_TIMERS's interval
  setInterval: function (fn, delay) {
    let id = setInterval(fn, delay);
    this.intervalIds.push(id);
    return id;
  },
  //MY_TIMERS's clearAllTimeout
  clearAllInterval: function () {
    while (this.intervalIds.length) {
      clearTimeout(this.intervalIds.pop());
    }
  },
};

Input: MY_TIMERS.setInterval(() => {
  console.log("Hello");
}, 2000);

MY_TIMERS.setInterval(() => {
  console.log("Hello2");
}, 500);

MY_TIMERS.clearAllInterval();

MY_TIMERS.setInterval(() => {
  console.log("Hello3");
}, 1000);

Output: "Hello3"; // after every ~1 sec
```
