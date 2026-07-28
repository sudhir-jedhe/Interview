reate a pausable auto incrementer in JavaScript, which takes an initial value and steps as input and increments the initial value with given steps every second. The incrementer can be paused and resumed back.

It is one of the classic problems which use two of the trickiest concepts of JavaScript.

1. Timers.
2. Closure.

Use the setInterval to auto increment the values, whereas wrapping the start and stop function inside the closure and returning them, so that the incrementor can be controlled while still maintaining the value.

Defining the function body.
Our incrementor function will take two inputs, initial value, and steps.

And within the function, we will need two variables,

1. To track the value.
2. For storing the IntervalId, so that it can be cleared to stop the timer and resume when needed.

```js
const timer = (init = 0, step = 1) => {
    let intervalId;
    let count = init;
}

Copy
Start function
In the start function, setInterval will be invoked at an interval of 1 second, and in each interval call, the initial value will be increased by the given step and it will be logged in the console.

setInterval’s id will be stored In the intervalId variable.

const startTimer = () => {
    if (!intervalId){
      intervalId = setInterval(() => {
        console.log(count);
        count += step;
      }, 1000);
    }
  }Copy
There is a condition to check if intervalId is having any value or not, just to make sure we don’t start multiple intervals.

Stop function
Inside the stop function we stop the increment by invoking the clearInterval by passing the intervalId to it and also updating the intervalId to null.

const stopTimer = () => {
  clearInterval(intervalId);
  intervalId = null;
}Copy
At the end return the startTimer and stopTimer.

return {
 startTimer,
 stopTimer,
};





const timer = (init = 0, step = 1) => {
    let intervalId;
    let count = init;

    const startTimer = () => {
      if (!intervalId){
        intervalId = setInterval(() => {
          console.log(count);
          count += step;
        }, 1000);
      }
    }

    const stopTimer = () => {
      clearInterval(intervalId);
      intervalId = null;
    }

    return {
      startTimer,
      stopTimer,
    };
  }
```
