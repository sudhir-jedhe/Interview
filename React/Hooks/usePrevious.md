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

Here is a production-ready `usePrevious` React hook that tracks prior values using `useRef` and `useEffect`.

```jsx
import { useEffect, useRef } from "react";

/**
 * Custom hook to store and retrieve the previous value of a prop or state variable.
 *
 * @param {any} value - The state or prop value to track.
 * @returns {any} The value from the previous render (undefined on initial render).
 */
export function usePrevious(value) {
  const currentRef = useRef(value);
  const previousRef = useRef(undefined);

  if (currentRef.current !== value) {
    previousRef.current = currentRef.current;
    currentRef.current = value;
  }

  return previousRef.current;
}

```

---

### Usage Examples

#### 1. Tracking Counter or Value Changes

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>
        Current: {count} | Previous: {prevCount ?? "None"}
      </p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}

```

#### 2. Triggering Effects on Specific Prop/State Transitions

```jsx
import { useEffect, useState } from "react";

function StatusNotification({ status }) {
  const prevStatus = usePrevious(status);

  useEffect(() => {
    if (prevStatus === "offline" && status === "online") {
      console.log("Connection restored!");
    }
  }, [status, prevStatus]);

  return <div>Status: {status}</div>;
}

```

---

### Key Features & Design Details

* **Render-Phase Tracking:** Storing values during rendering (rather than inside `useEffect`) ensures `usePrevious` returns the accurate prior value immediately on the current render, avoiding frame-delay or stale synchronization issues in React 18+ concurrent rendering.
* **Initial Render Safety:** Returns `undefined` on the initial mount when no prior value exists.
* **Primitive & Object Support:** Works with any data type (primitives, arrays, and objects).
