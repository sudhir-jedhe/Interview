```js
import React, { useEffect, useRef } from "react";
import { useEffect, useRef } from "react";

export function useTimeout(callback: () => void, delay: number) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback
  useEffect(() => {
    const timeoutId = setTimeout(() => callbackRef.current(), delay)
    return () => clearTimeout(timeoutId)
  }, [delay])
}


/********************* */

export function useTimeout(callback: () => void, delay: number) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback;
  useEffect(()=> {
    const id = setTimeout(()=>callbackRef.current(),delay);
    return () => clearTimeout(id)
  }, [delay])
}
```
