// Avoiding pointless re-renders is one way to accomplish performance optimization in React, and in order to track this, we must keep an eye on what has changed in the component’s props or states.

// Use the useWhyDidYouUpdate() hook to find out what changed and caused the re-rendering so that if they are unnecessary, they can be mitigated.

// The idea is very simple, use a useRef() hook to store the previous props and then compare it with the current props to check what has triggered the re-render.

// As states are part of the component itself and controlled by it, they can be tracked separately.

```js
function useWhyDidYouUpdate(name, props) {
  // create a reference to track the previous data
  const previousProps = useRef();

  useEffect(() => {
    if (previousProps.current) {
      // merge the keys of previous and current data
      const keys = Object.keys({ ...previousProps.current, ...props });

      // to store what has change
      const changesObj = {};

      // check what values have changed between the previous and current
      keys.forEach((key) => {
        // if both are object
        if (
          typeof props[key] === "object" &&
          typeof previousProps.current[key] === "object"
        ) {
          if (
            JSON.stringify(previousProps.current[key]) !==
            JSON.stringify(props[key])
          ) {
            // add to changesObj
            changesObj[key] = {
              from: previousProps.current[key],
              to: props[key],
            };
          }
        } else {
          // if both are non-object
          if (previousProps.current[key] !== props[key]) {
            // add to changesObj
            changesObj[key] = {
              from: previousProps.current[key],
              to: props[key],
            };
          }
        }
      });

      // if changesObj not empty, print the cause
      if (Object.keys(changesObj).length) {
        console.log("This is causing re-renders", name, changesObj);
      }
    }

    // update the previous props with the current
    previousProps.current = props;
  });
}
```
