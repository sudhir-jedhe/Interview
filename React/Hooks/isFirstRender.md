```js
import React from "react";
import { useRef } from "react";

export function useIsFirstRender(): boolean {
  const isFirstRender = useRef(true);
  if (isFirstRender.current) {
    isFirstRender.current = false;
    return true
  }
  return false;
}


/****** */

export function useIsFirstRender(): boolean {
  const isFirst = React.useRef(true);
  React.useEffect(() => {
    isFirst.current = false
  }, []);
  return isFirst.current;
}


function App() {
    const isFirstRender = useIsFirstRender()
    // only true for the first render
    ...
  }

```
