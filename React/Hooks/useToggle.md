```js
import { useReducer } from "react";
import { useState } from "react";
import { useCallback, useState } from "react";

export function useToggle(on: boolean): [boolean, () => void] {
  const [onState, toggle] = useReducer((state) => !state, on);
  return [onState, toggle]
}


/*********************** */


export function useToggle(on: boolean): [boolean, () => void] {
  const [toggle, setToggle] = useState(on);
  const toggleHandler = () => setToggle(prevState => !prevState);
  return [toggle, toggleHandler]
}



/************************* */

export function useToggle(on: boolean): [boolean, () => void] {
  // your code here
  const [ onOrOff, setOnOrOff ] = useState(on);
  const toggle = useCallback(() => setOnOrOff(prev => !prev), []);
  return [ onOrOff, toggle ]
}
// if you want to try your code on the right panel
// remember to export App() component like below
// export function App() {
//   return <div>your app</div>
// }




import { useCallback, useState } from "react";

const useToggle = (values, startIndex = 0) => {
  // to track the indexes
  const [index, setIndex] = useState(startIndex);

  // define and memorize the toggler function in case we pass down the component,
  // this will move the index to the next level and reset it if it goes beyond the limit.
  const toggle = useCallback(
    () => setIndex((prevIndex) => (prevIndex >= values.length - 1 ? 0 : prevIndex + 1)),
    [values]
  );

  // return value and toggle function
  return [values[index], toggle];
};




Input:
function Example() {
  // call the hook which returns, the current value and the toggled function
  const [currentValue, toggleValue] = useToggle(["a", "b", "c", "d"], 2);
  return <button onClick={toggleValue}> "currentValue" : {currentValue}</button>;
}

export default Example;

Output:
currentValue: c // initially
currentValue: d // onClick
currentValue: a // onClick
currentValue: b // onClick
currentValue: c // onClick
```

A `useToggle` hook is similar to `useBoolean`, but more flexible: it accepts an arbitrary array of values (or defaults to `[true, false]`) and cycles through them sequentially on each trigger.

Here is a flexible, production-ready implementation of `useToggle`:

```jsx
import { useState, useCallback } from "react";

export function useToggle(options = [true, false], initialIndex = 0) {
  const [index, setIndex] = useState(() => {
    return initialIndex >= 0 && initialIndex < options.length ? initialIndex : 0;
  });

  const toggle = useCallback(
    (target) => {
      // Direct jump to a specific value or index if provided
      if (target !== undefined) {
        const foundIndex = options.indexOf(target);
        if (foundIndex !== -1) {
          setIndex(foundIndex);
          return;
        }
        if (typeof target === "number" && target >= 0 && target < options.length) {
          setIndex(target);
          return;
        }
      }

      // Otherwise cycle to the next value
      setIndex((prevIndex) => (prevIndex + 1) % options.length);
    },
    [options]
  );

  return [options[index], toggle];
}

```

### Usage Examples

#### 1. Standard Boolean Toggle

```jsx
const [isOn, toggleIsOn] = useToggle();

// Usage:
// toggleIsOn()        -> flips true/false
// toggleIsOn(true)    -> explicitly sets true

```

#### 2. Multi-state Cycle (e.g., Status Filter or Theme)

```jsx
const [theme, toggleTheme] = useToggle(["light", "dark", "system"]);

// Usage:
// toggleTheme()        -> cycles: light -> dark -> system -> light
// toggleTheme("dark")  -> directly jumps to "dark"

```

### Core Features

* **Array Destructuring Standard:** Follows standard React conventions (`[value, toggle]`).
* **Multi-Value Support:** Cycles seamlessly through 2 or more options.
* **Direct Value Setting:** Passing an argument directly jumps to that value or index, eliminating the need for separate setter methods.
* **Stable Callbacks:** Wrapped in `useCallback` to maintain reference stability across renders.
