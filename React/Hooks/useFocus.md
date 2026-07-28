```js
import React, { Ref, useEffect, useRef, useState } from "react";
import React, { Ref, useCallback, useRef, useState } from "react";
import React, { Ref, useCallback, useEffect, useRef, useState } from "react";

export function useFocus<T extends HTMLElement>(): [Ref<T | undefined>, boolean] {
  const [isFocused, setFocused] = useState(false)
  const ref = useRef<T>()
  useEffect(() => {
    const currentElement = ref.current
      if (!currentElement)
      return
    // !!IMPORTANT!!
    // initialize the focus state when currentElement changes.
    setFocused(document.activeElement === currentElement)

    const onFocus = () => setFocused(true)
    const onBlur = () => setFocused(false)
    currentElement.addEventListener('focus', onFocus)
    currentElement.addEventListener('blur', onBlur)
    return () => {
      currentElement.removeEventListener('focus', onFocus)
      currentElement.removeEventListener('blur', onBlur)
    }
  }, [ref.current]) // now we can pass a dependency array to get much better performance.
  return [ref, isFocused]
}



/********************************* */




export function useFocus<T extends HTMLElement>(): [Ref<T>, boolean] {
  // your code here
  const [focused, setFocused] = useState(false)
  const ref = useRef<T>()
  const onFocus = () => {
    setFocused(true)
  }
  const onBlur = () => {
    setFocused(false)
  }
  const callbackRef = useCallback((node: T) => {
    if (ref.current) {
      ref.current.removeEventListener('focus', onFocus)
      ref.current.removeEventListener('blur', onBlur)
    }
    ref.current = node
    if(node) {
      ref.current.addEventListener('focus', onFocus)
      ref.current.addEventListener('blur', onBlur)
    }
  }, [])
  return [callbackRef, focused]
}
// if you want to try your code on the right panel
// remember to export App() component like below
// export function App() {
//   const [ref, isFocused] = useFocus()
//   return <div>
//     <input ref={ref}/>
//     {isFocused && <p>focused</p>}
//   </div>
// }




/********************************* */


export function useFocus<T extends HTMLElement>(): [Ref<T>, boolean] {
  const ref = useRef<T>(null)
  const [isFocused, setIsFocused] = useState(false)
  const toggle = useCallback(() => {
    setIsFocused(!isFocused)
  }, [isFocused])
  useEffect(() => {
    const element = ref.current
    element?.addEventListener('focus', toggle)
    element?.addEventListener('blur', toggle)
    return () => {
      element?.removeEventListener('focus', toggle)
      element?.removeEventListener('blur', toggle)
    }
  })
  return [
    ref,
    isFocused
  ]
}
```
