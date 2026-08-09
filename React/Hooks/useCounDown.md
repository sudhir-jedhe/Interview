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

Here is a flexible, production-ready `useCountdown` React hook that handles start/pause/reset controls, dynamic intervals, and custom completion callbacks.

```jsx
import { useState, useEffect, useRef, useCallback } from "react";

export function useCountdown(initialSeconds, { intervalMs = 1000, onEnd } = {}) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  // Keep a fresh reference to onEnd to prevent stale closure issues inside setInterval
  const onEndRef = useRef(onEnd);
  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(intervalId);
          setIsRunning(false);
          if (onEndRef.current) {
            onEndRef.current();
          }
          return 0;
        }
        return prevSeconds - 1;
      });
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [isRunning, intervalMs]);

  const start = useCallback(() => {
    setSeconds((prev) => (prev > 0 ? prev : initialSeconds));
    setIsRunning(true);
  }, [initialSeconds]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(
    (newSeconds = initialSeconds) => {
      setIsRunning(false);
      setSeconds(newSeconds);
    },
    [initialSeconds]
  );

  return {
    seconds,
    isRunning,
    start,
    pause,
    reset,
  };
}

```

### Usage Examples

#### 1. OTP Resend Timer

```jsx
function OtpVerification() {
  const { seconds, isRunning, start } = useCountdown(60);

  return (
    <div>
      <button onClick={start} disabled={isRunning}>
        {isRunning ? `Resend code in ${seconds}s` : "Send OTP"}
      </button>
    </div>
  );
}

```

#### 2. Quiz / Game Timer with Callback

```jsx
function QuizTimer() {
  const { seconds, isRunning, start, pause, reset } = useCountdown(10, {
    onEnd: () => alert("Time is up!"),
  });

  return (
    <div>
      <h2>Time Remaining: {seconds}s</h2>
      <button onClick={start} disabled={isRunning}>Start</button>
      <button onClick={pause} disabled={!isRunning}>Pause</button>
      <button onClick={() => reset()}>Reset</button>
    </div>
  );
}

```

### Key Features

* **Safe Closure Handlers:** Uses `onEndRef` so your `onEnd` callback always sees the latest state without tearing down and recreating the interval.
* **Full Control API:** Provides `start`, `pause`, and `reset` actions out of the box.
* **Auto Stop:** Automatically stops running and triggers the completion callback as soon as `seconds` hits `0`.
