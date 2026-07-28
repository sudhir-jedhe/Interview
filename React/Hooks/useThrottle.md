// Throttling is a way/technique to restrict the number of function execution/call. For example, consider a lucky draw number generator, we want to get a number only after a particular time.

// Excessive function invocations in javascript applications hamper the performance drastically. To optimize an app we need to handle this correctly.

// There are scenarios where we may invoke functions when it isn’t necessary. For example, consider a scenario where we want to make an API call to the server on a button click.

// If the user spam the click then this will make an API call on each click. This is not what we want, we want to restrict the no of API calls that can be made. The other call will be made only after a specified interval of time.

// We have already seen how to implement throttle function in JavaScript.

// Let us see how to create a useThrottle() hook in React with the leading and trailing flag.

// When leading is enabled the first function will invoke right away and then after the specified delay, while when trailing is enabled the first function will invoke after the delay and so on.

// We will be using useRef() to track the timerId of setTimeout so that we can reset it as an when required and previous arguments.

// Also, we will wrap the logic inside the useCallback() to avoid needless re-renderings as the callback function returns a memoized function that only change when one of the dependency changes.

```js
const useThrottle = (fn, wait, option = { leading: true, trailing: true }) => {
    const timerId = useRef(); // track the timer
    const lastArgs = useRef(); // track the args

    // create a memoized debounce
    const throttle = useCallback(
      function (...args) {
        const { trailing, leading } = option;
        // function for delayed call
        const waitFunc = () => {
          // if trailing invoke the function and start the timer again
          if (trailing && lastArgs.current) {
            fn.apply(this, lastArgs.current);
            lastArgs.current = null;
            timerId.current = setTimeout(waitFunc, wait);
          } else {
            // else reset the timer
            timerId.current = null;
          }
        };

        // if leading run it right away
        if (!timerId.current && leading) {
          fn.apply(this, args);
        }
        // else store the args
        else {
          lastArgs.current = args;
        }

        // run the delayed call
        if (!timerId.current) {
          timerId.current = setTimeout(waitFunc, wait);
        }
      },
      [fn, wait, option]
    );

    return throttle;
  };


  Input:
const Example = () => {
  const print = () => {
    console.log("hello");
  };

  const throttled = useThrottle(print, 2500, { leading: true, trailing: false });

  return <button onClick={throttled}> click me</button>;
};

Output:
"hello" // immediately
"hello" // after 2500 milliseconds of last call
"hello" // after 2500 milliseconds of last call




Input:
const Example = () => {
  const print = () => {
    console.log("hello");
  };

  const throttled = useThrottle(print, 2500, { leading: false, trailing: true });

  return <button onClick={throttled}> click me</button>;
};

Output:
"hello" // after 2500 milliseconds
"hello" // after 2500 milliseconds of last call
"hello" // after 2500 milliseconds of last call
```
