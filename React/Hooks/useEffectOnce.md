```js
import { EffectCallback, useEffect, useRef } from "react";
import { EffectCallback, useEffect } from "react";

export function useEffectOnce(effect: EffectCallback) {
  const ref = useRef(effect);
  useEffect(() => ref.current(), []);
}


/************* */



export function useEffectOnce(effect: EffectCallback) {
  useEffect(effect, [])
}
```
