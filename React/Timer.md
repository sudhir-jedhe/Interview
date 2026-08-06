To implement a simple timer functionality with `start` and `stop` buttons in React, we can use `useState` to keep track of the timer's state and `useEffect` to handle the timing logic. We can also make use of `setInterval` to update the timer every second.

Here’s the complete implementation:

```jsx
import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [seconds, setSeconds] = useState(0); // Timer state to track elapsed seconds
  const [isRunning, setIsRunning] = useState(false); // Track if the timer is running

  let interval;

  useEffect(() => {
    // If the timer is running, start updating the seconds every second
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000); // Update every second
    } else {
      // If the timer is stopped, clear the interval
      clearInterval(interval);
    }

    // Cleanup the interval on component unmount or when the timer stops
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true); // Start the timer
  };

  const handleStop = () => {
    setIsRunning(false); // Stop the timer
  };

  const handleReset = () => {
    setIsRunning(false); // Stop the timer
    setSeconds(0); // Reset the timer to 0
  };

  return (
    <div>
      <h2>Timer</h2>
      <div>
        <p>{seconds} seconds</p>
        <button onClick={handleStart} disabled={isRunning}>
          Start
        </button>
        <button onClick={handleStop} disabled={!isRunning}>
          Stop
        </button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default Timer;
```

### **Explanation:**

1. **State Management:**
   - `seconds`: Tracks the elapsed time in seconds.
   - `isRunning`: A boolean flag to track whether the timer is currently running.

2. **`useEffect` Hook:**
   - This hook is responsible for starting and stopping the timer.
   - If `isRunning` is true, it sets an interval that updates the `seconds` state every second.
   - If `isRunning` is false, the interval is cleared (stopping the timer).
   - The cleanup function (return statement) ensures that the interval is cleared when the component unmounts or when the timer stops.

3. **Button Actions:**
   - **Start Button**: Starts the timer by setting `isRunning` to true.
   - **Stop Button**: Stops the timer by setting `isRunning` to false.
   - **Reset Button**: Stops the timer (if running) and resets the `seconds` state to 0.

4. **Button Disable Logic:**
   - The **Start** button is disabled when the timer is already running.
   - The **Stop** button is disabled when the timer is not running.

### **Features:**

- **Start**: Begins counting the seconds.
- **Stop**: Pauses the counting of seconds.
- **Reset**: Stops the timer and resets the time to 0.

### **Sample Output:**

When the timer is started, you will see the number of seconds increment every second.

```
Timer: 5 seconds

[ Start ] [ Stop ] [ Reset ]
```

You can easily customize this implementation, such as adding a countdown timer, displaying minutes and seconds, or changing the styling of the buttons.
