// Create two buttons start and stop.
// On the start click, start a counter that will increment by 1 every second.
// On the stop click, pause the counter.
// When the start is clicked again, resume the counter.

```js
import React, {
  useState,
  useRef,
  useEffect,
} from "https://esm.sh/react@18.2.0";
import ReactDOM from "https://esm.sh/react-dom@18.2.0";

const App = () => {
  const [count, setCount] = useState(0);
  const timerIdRef = useRef(null);

  const onStart = () => {
    timerIdRef.current = setInterval(() => {
      setCount(count + 1);
    }, 1000);
  };

  const onStop = () => {
    clearInterval(timerIdRef.current);
  };

  return (
    <div className="box">
      <h1>Count: {count}</h1>
      <button onClick={onStart}>Start</button>
      <button onClick={onStop}>Stop</button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

// In this solution, the only problem is the counter moves from 0 to 1 and gets stuck at 1, this is because inside setInterval every time count variable is accessed its value remains 0 only. setInterval is not able to get the updated value.

// To learn more about why this happens, read this article.

// To fix this, rather than accessing the count variable, we will access the prevCount from the callback function that the state update function accepts.

const onStart = () => {
  timerIdRef.current = setInterval(() => {
    setCount((prevCount) => prevCount + 1);
  }, 1000);
};

//   Solution 2: Using setTimeout and useEffect hook
// useEffect hook in React is invoked on three instances.

// When a component is mounted.
// When any value in the dependency array changes.
// When the component is about to unmount.
// Thus we will pass the count variable to the dependency array in the useEffect hook and whenever its value changes, the useEffect will be called again and inside it we will run a setTimeout that will update the count after 1 second.

// This will go in a loop every time,

// On start click, setTimeout will run and update the count.
// When count’s value changes, useEffect will be called again, inside this invoke the setTimeout again.
// It will again update the count and things will run in a loop.
// To stop the counter, stop the setTimeout, using the clearTimeout.

import React, {
  useState,
  useRef,
  useEffect,
} from "https://esm.sh/react@18.2.0";
import ReactDOM from "https://esm.sh/react-dom@18.2.0";

const App = () => {
  const [count, setCount] = useState(0);
  const [start, setStart] = useState(false);
  const timerIdRef = useRef(null);

  useEffect(() => {
    if (start) {
      timerIdRef.current = setTimeout(() => {
        setCount(count + 1);
      }, 1000);
    }

    () => {
      clearTimeout(timerIdRef.current);
    };
  }, [count, start]);

  const onStart = () => {
    setStart(true);
  };

  const onStop = () => {
    clearTimeout(timerIdRef.current);
    setStart(false);
  };

  return (
    <div className="box">
      <h1>Count: {count}</h1>
      <button onClick={onStart}>Start</button>
      <button onClick={onStop}>Stop</button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
```
