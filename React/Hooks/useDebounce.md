```js
import { useEffect, useState } from "react";
import { useEffect, useRef, useState } from "react";

// For a frequently changing value like text input you might want to debounce the changes.

// Implement useDebounce() to achieve this.

// function App() {
//   const [value, setValue] = useState(...)
//   // this value changes frequently,
//   const debouncedValue = useDebounce(value, 1000)
//   // now it is debounced
// }



export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value)
    }, delay);
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])
  return debounced
}


/*******************************************
 *
 */


export function useDebounce<T>(value: T, delay: number) {
  // your code here
  const currentTimer = useRef<any>();
  const [val, setVal] = useState(value);
  useEffect(()=>{
    if(currentTimer.current){
      clearTimeout(currentTimer.current);
    }
    currentTimer.current = setTimeout(()=>{
      setVal(value)
    },delay)

  },[value])
  return val
}
// if you want to try your code on the right panel
// remember to export App() component like below
const list: Array<string> = []
  const throttledList: Array<string> = []
  let currentTime = 0
  export function App() {
    const [data, setData] = useState('A')
    const throttledData = useDebounce(data, 3)
    list.push(data + '@' + currentTime)
    throttledList.push(throttledData + '@' + currentTime)
    console.log(throttledList)
    return null
  }



//   Debouncing is a method or a way to execute a function when it is made sure that no further repeated event will be triggered in a given frame of time.

// We have already seen how to implement normal debounce and debounce with an immediate flag.

// Let us see how to create a useDebounce() hook in React with the immediate flag as it will behave normally as well depending upon the flag.

// We will be using useRef() to track the timerId of setTimeout so that we can reset it if a subsequent full call is made within the defined time.

// Also, we will wrap the logic inside the useCallback() to avoid needless re-renderings as the callback function returns a memoized function that only change when one of the dependency changes.

const useDebounce = (fn, delay, immediate = false) => {
  // ref the timer
  const timerId = useRef();

  // create a memoized debounce
  const debounce = useCallback(
    function () {
      // reference the context and args for the setTimeout function
      let context = this,
        args = arguments;

      // should the function be called now? If immediate is true
      // and not already in a timeout then the answer is: Yes
      const callNow = immediate && !timerId.current;

      // base case
      // clear the timeout to assign the new timeout to it.
      // when event is fired repeatedly then this helps to reset
      clearTimeout(timerId.current);

      // set the new timeout
      timerId.current = setTimeout(function () {
        // Inside the timeout function, clear the timeout variable
        // which will let the next execution run when in 'immediate' mode
        timerId.current = null;

        // check if the function already ran with the immediate flag
        if (!immediate) {
          // call the original function with apply
          fn.apply(context, args);
        }
      }, delay);

      // immediate mode and no wait timer? Execute the function immediately
      if (callNow) fn.apply(context, args);
    },
    [fn, delay, immediate]
  );

  return debounce;
};



Input:
const Example = () => {
  const print = () => {
    console.log("hello");
  };

  const debounced = useDebounce(print, 500);

  useEffect(() => {
    window.addEventListener("mousemove", debounced, false);

    return () => {
      window.removeEventListener("mousemove", debounced, false);
    };
  });

  return <></>;
};

Output:
"hello" //after 500 millisecond delay when user stops moving mouse





Input:
const Example = () => {
  const print = () => {
    console.log("hello");
  };

  // immediate
  const debounced = useDebounce(print, 500, true);

  useEffect(() => {
    window.addEventListener("mousemove", debounced, false);

    return () => {
      window.removeEventListener("mousemove", debounced, false);
    };
  });

  return <></>;
};

Output:
"hello" //immediately only once till the mouse moving is not stopped
"hello" //immediately again once till the mouse moving is not stopped
```
