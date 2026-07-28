```js
import { Ref, useCallback, useRef, useState } from "react";
import { Ref, useCallback, useRef, useState } from "react";
import { useCallback, useLayoutEffect, useState } from "react";

export function useHover<T extends HTMLElement>(): [Ref<T>, boolean] {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  const ref = useRef<T>();
  const callbackRef = useCallback(node => {
    if (ref.current) {
      ref.current.removeEventListener('mouseenter', handleMouseEnter);
      ref.current.removeEventListener('mouseleave', handleMouseLeave);
    }
    ref.current = node;
    if (ref.current) {
      ref.current.addEventListener('mouseenter', handleMouseEnter);
      ref.current.addEventListener('mouseleave', handleMouseLeave);
    }
  }, [handleMouseEnter, handleMouseLeave]);
  // your code here
  return [callbackRef, isHovered];
}
// if you want to try your code on the right panel
// remember to export App() component like below
// export function App() {
//   return <div>your app</div>
// }



/************************ */


mport { Ref, useRef, useState, useEffect } from 'react'
export function useHover<T extends HTMLElement>(): [Ref<T | undefined>, boolean] {
  const ref = useRef<T>()
  const [isHovering, setHovering] = useState(false)
  useEffect(() => {
    // false by default if ref.current changes
    setHovering(false)
    const element = ref.current
    if (!element)
      return
    const setYes = () => setHovering(true)
    const setNo = () => setHovering(false)

    element.addEventListener('mouseenter', setYes)
    element.addEventListener('mouseleave', setNo)
    return () => {
      element.removeEventListener('mouseenter', setYes)
      element.removeEventListener('mouseleave', setNo)
    }
  }, [ref.current]) // now we could pass a dependency array for better performances.
  return [ref, isHovering]
}
 17
 mute

 /******************************* */

 Using AbortController removes the need of saving the reference to the callback function in order to successfully do the cleanup

export function useHover<T extends HTMLElement>(): [Ref<T>, boolean] {
   const [isHovered, setIsHovered] = useState<boolean>(false);
   const controllerRef = useRef(new AbortController());
  const ref = useRef<T>();
  const callbackRef = useCallback(node => {
    if (ref.current) {
      controllerRef.current.abort();
      controllerRef.current = new AbortController();
    }
    const { signal } = controllerRef.current
    ref.current = node;
    if (ref.current) {
      ref.current.addEventListener('mouseenter', () => setIsHovered(true), { signal });
      ref.current.addEventListener('mouseleave', () => setIsHovered(false), { signal });
    }
  }, []);
  // your code here
  return [callbackRef, isHovered];
}


/******************************** */


export function useHover<T extends HTMLElement | null>(): [
  (_ref: T) => void,
  boolean
] {
  const [node, setNode] = useState<T>();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const ref = useCallback((_ref: T) => setNode(_ref), []);
  useLayoutEffect(() => {
    if (!node) return;
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    node.addEventListener('mouseenter', handleMouseEnter);
    node.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      node.removeEventListener('mouseenter', handleMouseEnter);
      node.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [node]);
  return [ref, isHovered];
}
```
