// Implement a hook in react that helps to determine if the application is in focus or not. This will help stop the background processing when the user is not focused or on the tab.

```js
import { useState, useEffect } from "react";

const useHasFocus = () => {
  // get the initial state
  const [focus, setFocus] = useState(document.hasFocus());

  useEffect(() => {
    // helper functions to update the status
    const onFocus = () => setFocus(true);
    const onBlur = () => setFocus(false);

    // assign the listener
    // update the status on the event
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);

    // remove the listener
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  // return the status
  return focus;
};


Input:
const Example = () => {
  const focus = useHasFocus();
  console.log(focus);
  return <></>;
};

Output:
true
false // change the tab
true // back to the tab
```
