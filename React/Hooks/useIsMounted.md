```js
import React, { useEffect, useRef } from "react";
import React, { useEffect, useRef } from "react";
import { useEffect, useRef } from "react";

// When we handle async requests in React, we need to pay attention if the component is already unmounted.

// Please implement useIsMounted() for us to easily tell if the component is still not unmounted.


export function useIsMounted(): () => boolean {
  // your code here
  const isMountedRef = useRef(false);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    }
  }, [])
  return () => isMountedRef.current;
}


/********************** */



export function useIsMounted(): () => boolean {
  const mounted = useRef(true)
  useEffect(() => () => mounted.current = false, [])
  return () => mounted. Current
}



export function useIsMounted(): () => boolean {
  const mountRef = useRef(false)
  useEffect(() => {
    mountRef.current = true
    return () => {
      mountRef.current = false
    }
  }, [])
  return () => mountRef.current
}
```
