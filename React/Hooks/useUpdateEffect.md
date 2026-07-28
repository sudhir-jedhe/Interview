```js
import React, { DependencyList, EffectCallback } from "react";
import React, { DependencyList, EffectCallback, useEffect, useRef, useState } from "react";

// Implement useUpdateEffect() that it works the same as useEffect() except that it skips running the callback on first render.

export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
  // your code here
  const ref = React.useRef(false);
  React.useEffect(() => {
    if (ref.current) return effect();
    ref.current = true;
  }, deps);
}


/***************************** */
export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
  // your code here
  let isFirstRender = useRef(true);
    useEffect(() => {
    console.log('isFirstRender ', isFirstRender.current)
    if(!isFirstRender.current){
      console.log('not skipped')
      return effect();
    }else{
      isFirstRender.current = false;
    }
  }, deps);
}
// to try your code on the right panel
// export App() component like below
export function App() {
  const [data, setData] = useState<number>(0)
  useUpdateEffect(() => {
    console.log('Update useUpdateEffect only', { data })
  }, [data])
  return <div>
    <p>Open your console</p>
  <button onClick={() => setData(Date.now())}>Update data</button>
  </div>
}
```
