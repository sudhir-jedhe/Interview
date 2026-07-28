```js
import { useState, useEffect, useCallback } from "react";

export function useCountdown(initialSeconds: number, interval = 1000) {
  const [count, setCount] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  const start = useCallback(() => setIsRunning(true), []);
  const stop = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    setCount(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning || count <= 0) return;

    const timer = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          setIsRunning(false);
          return 0;
        }
        return c - 1;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isRunning, count, interval]);

  return [count, { start, stop, reset, isRunning }] as const;
}
```
