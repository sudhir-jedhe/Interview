// Let us see how to create a useIdle() hook in React that will return the boolean value depending upon the active or inactive state of the user after a defined amount of time.

// In the last article, we had seen how to detect an idle state in React, we will be using the same approach but consolidate the logic in a hook so that it can be resued.

// A user is considered to be inactive or idle if he is not performing any sort of action using interaction hardware like a mouse, or keyboard for desktops and laptops and touch on mobile and tablets.

// For this, there are a set of events that we can listen to like mousemove, mousedown, keypress, DOMMouseScroll, mousewheel, touchmove, MSPointerMove.

// Also, we need to handle edge cases where the window or tab is out of focus, for which we will listen to the focus and blur events.

// If any of these events are triggered then set the user to be Active else if none of them have happened for a given amount of time then set the user to be Idle or Inactive.

// We will take duration as input for useIdle(delay) for which if the user is not performing any action then he will be considered as Idle.

// The logic to implement is straightforward, we will use a useState to monitor the user’s active status and useEffect to assign the event listeners on the window object as well as document and later remove the listeners during cleanup.

// Using useRef we will track a setTimeout that will change status if the user has not performed any action for the duration received as input, else clear the timer and start a fresh timeout.

```js
import { useState, useEffect, useRef } from "react";

const useIdle = (delay) => {
  const [isIdle, setIsIdle] = useState(false);

  // create a new reference to track timer
  const timeoutId = useRef();

  // assign and remove the listeners
  useEffect(() => {
    setup();

    return () => {
      cleanUp();
    };
  });

  const startTimer = () => {
    // wait till delay time before calling goInactive
    timeoutId.current = setTimeout(goInactive, delay);
  };

  const resetTimer = () => {
    //reset the timer and make user active
    clearTimeout(timeoutId.current);
    goActive();
  };

  const goInactive = () => {
    setIsIdle(true);
  };

  const goActive = () => {
    setIsIdle(false);

    // start the timer to track Inactiveness
    startTimer();
  };

  const setup = () => {
    document.addEventListener("mousemove", resetTimer, false);
    document.addEventListener("mousedown", resetTimer, false);
    document.addEventListener("keypress", resetTimer, false);
    document.addEventListener("DOMMouseScroll", resetTimer, false);
    document.addEventListener("mousewheel", resetTimer, false);
    document.addEventListener("touchmove", resetTimer, false);
    document.addEventListener("MSPointerMove", resetTimer, false);

    //edge case
    //if tab is changed or is out of focus
    window.addEventListener("blur", startTimer, false);
    window.addEventListener("focus", resetTimer, false);
  };

  const cleanUp = () => {
    document.removeEventListener("mousemove", resetTimer);
    document.removeEventListener("mousedown", resetTimer);
    document.removeEventListener("keypress", resetTimer);
    document.removeEventListener("DOMMouseScroll", resetTimer);
    document.removeEventListener("mousewheel", resetTimer);
    document.removeEventListener("touchmove", resetTimer);
    document.removeEventListener("MSPointerMove", resetTimer);

    //edge case
    //if tab is changed or is out of focus
    window.removeEventListener("blur", startTimer);
    window.removeEventListener("focus", resetTimer);

    // memory leak
    clearTimeout(timeoutId.current);
  };

  // return previous value (happens before update in useEffect above)
  return isIdle;
};




Input:
const Example = () => {
  const isIdle = useIdle(2000);

  return (
    <div>
      <h1>IsIdle: {isIdle ? "true" : "false"}</h1>
    </div>
  );
};

Output:
IsIdle: false
IsIdle: true // after 2 seconds




// If a user is Idle or not performing any type of activity then we can stop certain actions like API calls or perform session management and log out the user from the application, especially in the banking apps.

// If a user is not using interaction hardware, such as a mouse, keyboard, or touch screen on a desktop, laptop, or mobile device, then that user is said to be inactive or idle.

// We can listen to events like mousemove, mousedown, keypress, DOMMouseScroll, mousewheel, touchmove, and MSPointerMove for this.

// Additionally, we must deal with edge circumstances where the window or tab is out of focus, therefore we will listen for focus and blur events in these situations.

// If any of these events occur, set the user to be active; otherwise, if none have occurred for a predetermined period of time, set the user to be idle or inactive.

// useIdle() hook takes time as input and will notify if the user has not performed any activity for that given amount of time.

const useIdle = (delay) => {
  const [isIdle, setIsIdle] = useState(false);

  // create a new reference to track timer
  const timeoutId = useRef();

  // assign and remove the listeners
  useEffect(() => {
    setup();

    return () => {
      cleanUp();
    };
  });

  const startTimer = () => {
    // wait till delay time before calling goInactive
    timeoutId.current = setTimeout(goInactive, delay);
  };

  const resetTimer = () => {
    //reset the timer and make user active
    clearTimeout(timeoutId.current);
    goActive();
  };

  const goInactive = () => {
    setIsIdle(true);
  };

  const goActive = () => {
    setIsIdle(false);

    // start the timer to track Inactiveness
    startTimer();
  };

  const setup = () => {
    document.addEventListener("mousemove", resetTimer, false);
    document.addEventListener("mousedown", resetTimer, false);
    document.addEventListener("keypress", resetTimer, false);
    document.addEventListener("DOMMouseScroll", resetTimer, false);
    document.addEventListener("mousewheel", resetTimer, false);
    document.addEventListener("touchmove", resetTimer, false);
    document.addEventListener("MSPointerMove", resetTimer, false);

    //edge case
    //if tab is changed or is out of focus
    window.addEventListener("blur", startTimer, false);
    window.addEventListener("focus", resetTimer, false);
  };

  const cleanUp = () => {
    document.removeEventListener("mousemove", resetTimer);
    document.removeEventListener("mousedown", resetTimer);
    document.removeEventListener("keypress", resetTimer);
    document.removeEventListener("DOMMouseScroll", resetTimer);
    document.removeEventListener("mousewheel", resetTimer);
    document.removeEventListener("touchmove", resetTimer);
    document.removeEventListener("MSPointerMove", resetTimer);

    //edge case
    //if tab is changed or is out of focus
    window.removeEventListener("blur", startTimer);
    window.removeEventListener("focus", resetTimer);

    // memory leak
    clearTimeout(timeoutId.current);
  };

  // return previous value (happens before update in useEffect above)
  return isIdle;
};
```

To implement automatic logout after a period of inactivity (i.e., when the user has been idle for a specific amount of time) in a React application, you can use a combination of event listeners, a timer, and state management. The idea is to reset the idle timer on user interaction (like mouse movement, keyboard input, etc.) and log the user out after a certain amount of inactivity.

Here’s how you can achieve this in React:

### **Steps to Implement Idle Timeout in React**

1. **Set an Idle Timeout**: Determine the period of time (in milliseconds) after which the user will be logged out due to inactivity. For example, you might set it to 5 minutes (300,000 milliseconds).

2. **Listen for User Activity**: Monitor user activity such as mouse movements, key presses, or clicks to reset the idle timer.

3. **Set a Timer**: When the user is idle for the specified period, automatically log them out.

4. **Clear the Timer on User Activity**: Whenever there's user activity (e.g., mouse movement or keystrokes), reset the idle timer.

5. **Handle Logout**: When the timer expires due to inactivity, log the user out (clear their authentication state, session, or tokens).

---

### **Example Implementation in React**

```js
import React, { useEffect, useState } from "react";

function AutoLogout() {
  // Set the idle timeout period in milliseconds (e.g., 5 minutes = 300000ms)
  const idleTimeout = 300000; // 5 minutes
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Assume the user is logged in initially
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());

  // Function to log out the user
  const logout = () => {
    setIsLoggedIn(false);
    alert("You have been logged out due to inactivity.");
    // You can also clear tokens or do any other necessary logout actions here
  };

  // Function to reset the idle timer
  const resetIdleTimer = () => {
    setLastActivityTime(Date.now());
  };

  // Effect to handle idle timeout
  useEffect(() => {
    const checkIdleTimeout = setInterval(() => {
      if (Date.now() - lastActivityTime >= idleTimeout) {
        logout(); // Log the user out if idle time exceeds the timeout
      }
    }, 1000); // Check every second for inactivity

    // Event listeners for user activity (reset idle timer on events)
    const activityEvents = ["mousemove", "keydown", "click", "scroll"];
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetIdleTimer);
    });

    // Cleanup the interval and event listeners when the component is unmounted
    return () => {
      clearInterval(checkIdleTimeout);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [lastActivityTime, idleTimeout]);

  // Render login/logout based on the state
  return (
    <div>
      {isLoggedIn ? (
        <div>
          <h1>Welcome back! You are logged in.</h1>
        </div>
      ) : (
        <div>
          <h1>You have been logged out due to inactivity.</h1>
        </div>
      )}
    </div>
  );
}

export default AutoLogout;
```

### **Explanation:**

1. **State Management**:
   - `isLoggedIn`: This state tracks whether the user is logged in or not.
   - `lastActivityTime`: This stores the timestamp of the last user activity (mouse movement, keypress, etc.).

2. **`logout()` Function**:
   - This function is called when the user has been idle for too long (i.e., the idle time exceeds the defined threshold). It sets the `isLoggedIn` state to `false` and can also trigger any other necessary logout actions, such as clearing session tokens, redirecting the user to the login page, etc.

3. **Idle Timer Check**:
   - We set an interval (`checkIdleTimeout`) to check every second if the user has been inactive for the specified `idleTimeout`. If so, the `logout()` function is called.

4. **Resetting the Timer on User Activity**:
   - The `resetIdleTimer()` function resets the idle timer each time there's user interaction (such as `mousemove`, `keydown`, `click`, or `scroll`).
   - We attach event listeners to these events to ensure that the timer is reset whenever the user is active.

5. **Cleanup**:
   - When the component is unmounted, we clear the interval and remove the event listeners to prevent memory leaks.

### **Customization:**

- You can modify the `idleTimeout` variable to change the timeout duration.
- You can adjust the event listeners to suit your needs. For example, you can also listen to `touchstart` events if you are building a mobile application.
- You can replace the `alert()` in the `logout()` function with a more sophisticated logout behavior, such as redirecting to a login page or showing a logout modal.

### **Additional Improvements:**

1. **Session Timeout Warning**:
   - You could enhance the user experience by adding a warning before the session is timed out. For example, show a modal or toast notification that says, "You will be logged out in 1 minute due to inactivity." The user can click "Stay Logged In" to reset the idle timer.

2. **LocalStorage or SessionStorage**:
   - You might also want to persist the user's login state (e.g., using `localStorage` or `sessionStorage`) so the session can be maintained across page reloads.

3. **Server-Side Session Expiry**:
   - You can implement a similar idle timeout on the server side as well. If the server detects no activity (or no API requests) from the user for a specified time, the user can be logged out automatically.

### **Conclusion:**

This solution provides a simple, effective way to implement automatic logout in a React application after a period of user inactivity. It ensures that your application remains secure by logging out inactive users, preventing potential misuse of an active session.

Creating a **custom hook** in React allows you to extract reusable logic that can be shared across multiple components. Custom hooks are a great way to manage state, side effects, or even complex behavior that doesn't belong directly in a component.

### **Creating a Custom Hook for Auto Logout**

Let's create a custom hook that handles user inactivity (idle timeout) and logs out the user after a certain period of inactivity. This will allow us to reuse the logic across different components.

---

### **1. Create a Custom Hook for Idle Timeout**

We'll create a custom hook called `useIdleTimeout` that will manage the inactivity timer and log the user out after the specified idle timeout period.

```js
import { useState, useEffect } from "react";

const useIdleTimeout = (timeoutDuration, onLogout) => {
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Function to reset the idle timer
  const resetIdleTimer = () => {
    setLastActivityTime(Date.now());
  };

  // Handle user logout when idle time exceeds the timeout
  const logout = () => {
    setIsLoggedIn(false);
    onLogout(); // Call the logout handler passed from the parent component
  };

  useEffect(() => {
    const checkIdleTimeout = setInterval(() => {
      if (Date.now() - lastActivityTime >= timeoutDuration) {
        logout(); // Log the user out if idle time exceeds the timeout
      }
    }, 1000); // Check every second

    // Event listeners for user activity (reset idle timer on events)
    const activityEvents = ["mousemove", "keydown", "click", "scroll"];
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetIdleTimer);
    });

    // Cleanup the interval and event listeners when the component is unmounted
    return () => {
      clearInterval(checkIdleTimeout);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [lastActivityTime, timeoutDuration]);

  return { isLoggedIn, setIsLoggedIn };
};

export default useIdleTimeout;
```

### **Explanation of the `useIdleTimeout` Hook:**

1. **State Variables**:
   - `lastActivityTime`: Tracks the timestamp of the last user activity (mouse move, key press, etc.).
   - `isLoggedIn`: Indicates whether the user is logged in.

2. **`resetIdleTimer`**:
   - Resets the `lastActivityTime` whenever there is user activity.

3. **`logout`**:
   - This function sets `isLoggedIn` to `false` and triggers the `onLogout` function (which could be a function passed down to the hook, used for logging the user out).

4. **`useEffect`**:
   - We set an interval to check for inactivity every second. If the user has been inactive for longer than the specified `timeoutDuration`, they are logged out.
   - We add event listeners for user activity events (`mousemove`, `keydown`, `click`, `scroll`). Whenever one of these events occurs, the timer is reset.
   - We clean up the interval and event listeners when the component is unmounted to prevent memory leaks.

5. **Return**:
   - The hook returns the `isLoggedIn` state and a setter `setIsLoggedIn` in case you need to update the login state externally.

---

### **2. Using the Custom Hook in a Component**

Now, we can use this `useIdleTimeout` hook in a component to manage the idle timeout logic.

```js
import React, { useState } from "react";
import useIdleTimeout from "./useIdleTimeout";

const AutoLogoutComponent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Logout function to be passed to the custom hook
  const handleLogout = () => {
    setIsLoggedIn(false);
    alert("You have been logged out due to inactivity!");
    // Optionally, clear session or token here
  };

  const { isLoggedIn: loggedInStatus } = useIdleTimeout(300000, handleLogout); // 5 minutes timeout

  return (
    <div>
      {loggedInStatus ? (
        <h1>Welcome! You are logged in.</h1>
      ) : (
        <h1>You have been logged out due to inactivity.</h1>
      )}
    </div>
  );
};

export default AutoLogoutComponent;
```

### **Explanation of Usage in `AutoLogoutComponent`:**

1. **State**:
   - `isLoggedIn`: Tracks whether the user is logged in or not.

2. **`handleLogout`**:
   - This function handles the logout process when the user has been idle for the specified amount of time. You can add additional logic here, like clearing tokens or redirecting the user to a login page.

3. **Using the Custom Hook**:
   - `useIdleTimeout(300000, handleLogout)`: We pass the timeout duration (in milliseconds) and the `handleLogout` function to the hook. The hook will automatically log the user out after 5 minutes of inactivity.

4. **Rendering the Status**:
   - If the user is still logged in (`loggedInStatus` is `true`), we display a welcome message. If the user is logged out (`loggedInStatus` is `false`), we display a logout message.

---

### **Benefits of Using Custom Hooks**

1. **Reusability**: The `useIdleTimeout` hook can now be used in multiple components without duplicating the logic for handling inactivity and logout.
2. **Separation of Concerns**: By moving the logic for managing idle timeout and logging out into a custom hook, the component becomes cleaner and more focused on UI rendering, while the hook handles the logic.

3. **Maintainability**: The custom hook can be easily updated or extended without modifying the components that use it. For instance, you can add more event listeners or change the idle timeout duration in one place.

---

### **Conclusion**

This is how you can create a **custom hook** in React to handle user inactivity and automatically log them out after a certain period. By using hooks, you can encapsulate the logic for idle timeouts, making your components more concise and reusable.

```

```
