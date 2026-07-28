```js
import { useEffect, useRef } from "react";
import { useEffect, useRef, useState } from "react";

// When using hooks how do I get the previous value of props or state?
export function usePrevious<T>(value: T): T | undefined {
  /* The ref object is a generic container whose current property is mutable
  and can hold any value, similar to an instance property on a class */
  const ref = useRef();
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}
// Ref: https://usehooks.com/usePrevious/



/*************** */


export function usePrevious<T>(value: T): T | undefined {
  const previous = useRef<T>();
  const toReturn = previous.current;
  previous.current = value;
  return toReturn;
}


// Create a hook usePrevious() to return the previous value, with initial previous value of undefined.



// usePrevious hook will take the current value as input and hold it and will return it whenever it will get a new value. For the initial render, it will return undefined as there will not be any previous value for it.

// To create the usePrevious hook we will need to use the useRef and useEffect hook together.

// useRef
// Between renderings, you can maintain values using the useRef Hook which means the value won’t change or be lost when the React components re-render. This will help us to persist the previous value.

// useEffect
// With the useEffect hook, we can manage the side effects in the components during the lifecycle events.

// Thus we can create a new reference using useRef and update its value inside the useEffect whenever a new value is provided, at the end return the reference value.


function usePrevious(value) {
  // create a new reference
  const ref = useRef();

  // store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // only re-run if value changes

  // return previous value (happens before update in useEffect above)
  return ref.current;
}




import { useState, useEffect, useRef } from "react";

const usePrevious = (value) => {
  // create a new reference
  const ref = useRef();

  // store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // only re-run if value changes

  // return previous value (happens before update in useEffect above)
  return ref.current;
};

const Example = () => {
  const [count, setCount] = useState(0);

  // get the previous value passed into the hook on the last render
  const prevCount = usePrevious(count);

  // show both current and previous value
  return (
    <div>
      <h1>
        Now: {count}, before: {prevCount}
      </h1>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
};

export default Example;
```
