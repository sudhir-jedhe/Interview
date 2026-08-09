Here is a production-ready `useVibrate` React hook that triggers haptic feedback via the browser's `navigator.vibrate` API.

It supports single burst durations, repeating vibration pattern arrays (`[200, 100, 200]`), loop intervals, feature detection, and automatic cancellation on unmount.

```jsx
import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook to trigger haptic vibration feedback via the Navigator Vibration API.
 *
 * @param {number|number[]} [pattern=200] - Single duration in ms or pattern array [vibrate, pause, vibrate, ...].
 * @param {Object} [options] - Configuration options.
 * @param {boolean} [options.loop=false] - If true, loops the vibration pattern until explicitly stopped or unmounted.
 * @param {number} [options.loopInterval=1000] - Pause duration in ms between loop iterations.
 * @returns {Object} { vibrate, stop, isVibrating, isSupported }
 */
export function useVibrate(pattern = 200, options = {}) {
  const { loop = false, loopInterval = 1000 } = options;

  const [isVibrating, setIsVibrating] = useState(false);
  const isSupported =
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    "vibrate" in navigator;

  const loopTimerRef = useRef(null);

  // Store pattern and options in refs to keep callback identities stable
  const patternRef = useRef(pattern);
  const optionsRef = useRef({ loop, loopInterval });

  useEffect(() => {
    patternRef.current = pattern;
    optionsRef.current = { loop, loopInterval };
  });

  // Cancel ongoing vibrations and loop timers
  const stop = useCallback(() => {
    if (loopTimerRef.current) {
      clearInterval(loopTimerRef.current);
      loopTimerRef.current = null;
    }

    if (isSupported) {
      navigator.vibrate(0);
    }

    setIsVibrating(false);
  }, [isSupported]);

  // Trigger vibration pattern
  const vibrate = useCallback(
    (customPattern) => {
      if (!isSupported) {
        console.warn("Vibration API is not supported on this browser/device.");
        return false;
      }

      const activePattern = customPattern ?? patternRef.current;
      const { loop, loopInterval } = optionsRef.current;

      stop(); // Stop any currently active vibration cycle

      const success = navigator.vibrate(activePattern);

      if (success) {
        setIsVibrating(true);

        // Calculate total pattern duration to reset state when finished
        const totalDuration = Array.isArray(activePattern)
          ? activePattern.reduce((acc, time) => acc + time, 0)
          : activePattern;

        if (loop) {
          loopTimerRef.current = setInterval(() => {
            navigator.vibrate(activePattern);
          }, totalDuration + loopInterval);
        } else {
          setTimeout(() => {
            setIsVibrating(false);
          }, totalDuration);
        }
      }

      return success;
    },
    [isSupported, stop]
  );

  // Stop vibration if component unmounts
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { vibrate, stop, isVibrating, isSupported };
}

```

---

### Usage Examples

#### 1. Form Haptic Feedback (Success & Error Patterns)

```jsx
function SubmitForm() {
  const { vibrate, isSupported } = useVibrate();

  const handleSuccess = () => {
    // Single short 100ms haptic bump
    vibrate(100);
  };

  const handleError = () => {
    // Error pattern: [vibrate, pause, vibrate, pause, vibrate]
    vibrate([100, 50, 100, 50, 200]);
  };

  return (
    <div>
      {!isSupported && <p>Haptic feedback disabled (unsupported device)</p>}
      <button onClick={handleSuccess}>Submit (Success)</button>
      <button onClick={handleError}>Submit (Error)</button>
    </div>
  );
}

```

#### 2. Looping Alarm / Incoming Notification

```jsx
function AlarmNotification() {
  // Loops pattern [300ms vibrate, 100ms pause, 300ms vibrate] every 1000ms
  const { vibrate, stop, isVibrating } = useVibrate([300, 100, 300], {
    loop: true,
    loopInterval: 1000,
  });

  return (
    <div>
      <button onClick={() => vibrate()} disabled={isVibrating}>
        {isVibrating ? "Ringing..." : "Trigger Alarm"}
      </button>

      {isVibrating && <button onClick={stop}>Dismiss Alarm</button>}
    </div>
  );
}

```

---

### Key Features

* **Custom Overrides:** Pass a custom pattern directly into `vibrate([200, 100, 200])` on execution to override default component options.
* **Loop Support:** Seamlessly handles repeating alarms and notifications using internal interval scheduling.
* **Feature & SSR Protection:** Safely evaluates `navigator.vibrate` support without breaking server-side builds or unsupported desktop browsers.
* **Automatic Teardown:** Clears active interval loops and invokes `navigator.vibrate(0)` when the component unmounts to prevent runaway vibrations.
