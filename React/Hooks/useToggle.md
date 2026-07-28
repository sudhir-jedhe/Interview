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
