### **What is BOM (Browser Object Model)?**

The **Browser Object Model (BOM)** is a collection of objects provided by the browser that allow JavaScript to interact with the browser environment. It enables JavaScript to communicate with various aspects of the browser outside of the webpage content (the DOM — Document Object Model). BOM is not standardized, meaning its functionality can vary across different browsers, but it generally includes a set of objects that offer useful methods for interacting with the browser window, history, screen, and other properties.

#### Key Objects in the BOM:

1. **`window`**: 
   - The `window` object is the global object in the BOM and is considered the top-level object in the browser environment. It represents the entire browser window and contains all other BOM objects (navigator, location, history, etc.).
   - **Example**:
     ```javascript
     window.alert("Hello!"); // Shows a browser alert
     ```

2. **`navigator`**: 
   - The `navigator` object provides information about the browser, such as its name, version, and supported features.
   - **Properties**:
     - `navigator.userAgent`: Returns the user agent string of the browser.
     - `navigator.platform`: Returns the platform (operating system) on which the browser is running.
     - `navigator.language`: Returns the preferred language of the browser.
   - **Example**:
     ```javascript
     console.log(navigator.userAgent); // Logs the browser's user agent string
     console.log(navigator.language); // Logs the browser's language
     ```

3. **`history`**:
   - The `history` object allows you to interact with the browser's session history (the list of pages visited in the current window). It provides methods to manipulate the browsing history, such as navigating forward or backward through the pages.
   - **Methods**:
     - `history.back()`: Goes back one page in the browser's history (like clicking the back button).
     - `history.forward()`: Goes forward one page in the browser's history.
     - `history.pushState()` and `history.replaceState()`: Allows modifying the browser history state without reloading the page.
   - **Example**:
     ```javascript
     history.back(); // Navigates to the previous page
     ```

4. **`location`**:
   - The `location` object allows you to get or set the current URL of the browser and also provides methods to manipulate the address bar.
   - **Properties**:
     - `location.href`: Returns the entire URL of the current page.
     - `location.pathname`: Returns the path of the URL (without the domain).
     - `location.search`: Returns the query string from the URL.
   - **Methods**:
     - `location.reload()`: Reloads the current page.
     - `location.assign()`: Loads a new URL.
   - **Example**:
     ```javascript
     console.log(location.href); // Logs the current URL
     location.reload(); // Reloads the current page
     ```

5. **`screen`**:
   - The `screen` object provides information about the user's screen, such as its size and resolution.
   - **Properties**:
     - `screen.width`: Returns the width of the screen.
     - `screen.height`: Returns the height of the screen.
     - `screen.availWidth`: Returns the available width for the browser (excluding taskbars, etc.).
   - **Example**:
     ```javascript
     console.log(screen.width); // Logs the width of the screen
     console.log(screen.availHeight); // Logs the available screen height
     ```

6. **`document`** (Although part of the DOM, it's often considered part of the BOM in context):
   - The `document` object represents the HTML or XML document loaded into the browser. It is part of the DOM (Document Object Model) but is often treated as part of the BOM when it comes to interacting with browser-based operations.
   - **Example**:
     ```javascript
     console.log(document.title); // Logs the title of the current document
     document.title = "New Title"; // Changes the title of the document
     ```

---

### **Summary of BOM Objects and Their Uses**

| **BOM Object**  | **Description**                                                                 | **Example Methods/Properties**                                                                                                                                                                   |
|-----------------|---------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`window`**     | Represents the browser window. It is the global object in JavaScript.           | `window.alert()`, `window.location`, `window.setTimeout()`, `window.document`                                                                                                                     |
| **`navigator`**  | Provides information about the browser and system.                              | `navigator.userAgent`, `navigator.platform`, `navigator.language`                                                                                                                                 |
| **`history`**    | Allows interaction with the browser's history.                                  | `history.back()`, `history.forward()`, `history.pushState()`, `history.replaceState()`                                                                                                            |
| **`location`**   | Represents the current URL and provides methods to change the browser's URL.    | `location.href`, `location.assign()`, `location.reload()`, `location.pathname`, `location.search`                                                                                                 |
| **`screen`**     | Provides information about the user's screen.                                  | `screen.width`, `screen.height`, `screen.availWidth`, `screen.availHeight`                                                                                                                       |
| **`document`**   | Represents the loaded HTML or XML document in the browser. (Part of DOM but used in BOM context) | `document.title`, `document.querySelector()`, `document.createElement()`                                                                                                                           |

---

### **Example of BOM Usage:**

Here’s a practical example using some of the BOM objects to interact with the browser:

```javascript
// 1. Using the location object to get the current URL and reload the page
console.log("Current URL: " + location.href);  // Logs the current URL
location.reload();  // Reloads the page

// 2. Using the screen object to get the screen width and height
console.log("Screen Width: " + screen.width);  // Logs the screen width
console.log("Screen Height: " + screen.height);  // Logs the screen height

// 3. Using the history object to navigate backward
history.back();  // Goes to the previous page in history

// 4. Using the navigator object to get the browser's user agent
console.log("Browser User Agent: " + navigator.userAgent);  // Logs the user agent string
```

### **Conclusion:**

The **Browser Object Model (BOM)** provides JavaScript with the ability to interact with the browser environment, such as retrieving information about the user's browser, navigating through pages, interacting with the screen, and modifying the URL. While not standardized across all browsers, the BOM helps make web pages more dynamic and interactive by providing essential browser-level functionality.


# BOM (Browser Object Model) Objects in JavaScript

The **Browser Object Model (BOM)** allows JavaScript to interact with the browser itself (window, URL, history, screen, storage, etc.).

Think of it as:

```text
Browser
  │
  ▼
Window
 ├── Document (DOM)
 ├── Location
 ├── History
 ├── Navigator
 ├── Screen
 ├── LocalStorage
 ├── SessionStorage
 ├── Console
 ├── Timers
```

***

# BOM vs DOM

## BOM

Interacts with Browser

```javascript
window
location
history
navigator
screen
```

Example:

```javascript
window.alert("Hello");
```

***

## DOM

Interacts with HTML Elements

```javascript
document.getElementById()
```

Example:

```javascript
document.querySelector("button");
```

***

# 1. Window Object

Everything in browser JavaScript lives under:

```javascript
window
```

```javascript
console.log(window);
```

***

### Example

```javascript
window.alert("Welcome");
```

or

```javascript
alert("Welcome");
```

Because:

```javascript
window.alert()
```

is global.

***

# 2. Location Object

Used to access URL information.

Current URL:

```javascript
console.log(window.location);
```

Example URL:

```text
https://example.com/products?id=10
```

***

### Properties

```javascript
location.href
```

```javascript
location.hostname
```

```javascript
location.pathname
```

```javascript
location.search
```

Example:

```javascript
console.log(location.href);
```

Output:

```text
https://example.com/products?id=10
```

***

### Redirect

```javascript
location.href =
  "https://google.com";
```

***

### Reload Page

```javascript
location.reload();
```

***

# 3. History Object

Browser Back/Forward control.

### Go Back

```javascript
history.back();
```

Equivalent:

```text
Browser Back Button
```

***

### Go Forward

```javascript
history.forward();
```

***

### Navigate History

```javascript
history.go(-2);
```

Move back:

```text
2 pages
```

***

# React Example

```jsx
const goBack = () => {
  window.history.back();
};
```

***

# 4. Navigator Object

Browser Information.

```javascript
console.log(
  navigator.userAgent
);
```

Example:

```text
Chrome
Firefox
Edge
Safari
```

***

### Online Status

```javascript
navigator.onLine
```

Output:

```javascript
true
```

or

```javascript
false
```

***

### Language

```javascript
navigator.language
```

Output:

```text
en-GB
```

***

# React Example

```jsx
function BrowserInfo() {
  return (
    <div>
      Browser:
      {navigator.userAgent}
    </div>
  );
}
```

***

# 5. Screen Object

Information about display.

```javascript
console.log(screen);
```

***

### Width

```javascript
screen.width
```

***

### Height

```javascript
screen.height
```

Example:

```javascript
console.log(
  screen.width
);
```

Output:

```javascript
1920
```

***

# React Example

```jsx
<div>
  Screen Width:
  {screen.width}
</div>
```

***

# 6. Local Storage

Persistent browser storage.

Store data:

```javascript
localStorage.setItem(
  "user",
  "Sudhir"
);
```

Read data:

```javascript
localStorage.getItem(
  "user"
);
```

Output:

```javascript
Sudhir
```

Remove:

```javascript
localStorage.removeItem(
  "user"
);
```

***

# React Example

```jsx
useEffect(() => {
  localStorage.setItem(
    "theme",
    "dark"
  );
}, []);
```

***

# 7. Session Storage

Data survives only until tab closes.

```javascript
sessionStorage.setItem(
  "token",
  "123"
);
```

Read:

```javascript
sessionStorage.getItem(
  "token"
);
```

***

# 8. Timers

### setTimeout

```javascript
setTimeout(() => {
  console.log("Hello");
}, 2000);
```

Runs after:

```text
2 seconds
```

***

### clearTimeout

```javascript
const timer =
  setTimeout(...);

clearTimeout(timer);
```

***

### setInterval

```javascript
setInterval(() => {
  console.log("Tick");
}, 1000);
```

Every second.

***

### clearInterval

```javascript
clearInterval(intervalId);
```

***

# React Timer Example

```jsx
useEffect(() => {
  const timer =
    setInterval(() => {
      console.log("Running");
    }, 1000);

  return () =>
    clearInterval(timer);
}, []);
```

***

# 9. Alert, Confirm, Prompt

### Alert

```javascript
alert("Saved");
```

***

### Confirm

```javascript
const result =
  confirm(
    "Delete Item?"
  );
```

Result:

```javascript
true
```

or

```javascript
false
```

***

### Prompt

```javascript
const name =
  prompt(
    "Enter name"
  );
```

***

# 10. Fetch API (Window)

```javascript
fetch(
  "https://api.example.com"
);
```

Belongs to:

```javascript
window.fetch
```

***

# Common BOM Interview Questions

## Get Current URL

```javascript
location.href
```

***

## Reload Page

```javascript
location.reload();
```

***

## Browser Back

```javascript
history.back();
```

***

## Screen Size

```javascript
screen.width
screen.height
```

***

## Check Internet

```javascript
navigator.onLine
```

***

## Store User Data

```javascript
localStorage
```

***

# BOM Hierarchy

```text
window
│
├── document (DOM)
├── location
├── history
├── navigator
├── screen
├── localStorage
├── sessionStorage
├── console
├── fetch
├── setTimeout
└── setInterval
```

# Senior Interview Answer

> The Browser Object Model (BOM) provides JavaScript APIs to interact with the browser environment. The `window` object is the root BOM object and exposes APIs such as `location` for URL management, `history` for navigation, `navigator` for browser information, `screen` for display information, `localStorage` and `sessionStorage` for client-side storage, and timer APIs like `setTimeout` and `setInterval`. Unlike the DOM, which manipulates HTML elements, the BOM deals with browser-level functionality.
# BOM Objects in Detail with React Examples

The **Browser Object Model (BOM)** provides browser-specific APIs. As a React developer, you'll use BOM objects regularly for routing, storage, browser events, responsive design, geolocation, notifications, and history management.

***

# BOM Architecture

```text
window
│
├── document (DOM)
├── location
├── history
├── navigator
├── screen
├── localStorage
├── sessionStorage
├── console
├── fetch
├── setTimeout
├── setInterval
├── Notification
├── Geolocation
└── MatchMedia
```

***

# 1. Window Object

The root object of the BOM.

```javascript
console.log(window);
```

Everything below is attached to `window`.

```javascript
window.alert("Hello");

alert("Hello");
```

Both work.

***

# React Example: Window Resize

```jsx
import { useEffect, useState } from "react";

function WindowSize() {
  const [width, setWidth] =
    useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  return (
    <h2>
      Width: {width}
    </h2>
  );
}
```

***

# 2. History Object

Controls browser navigation.

```javascript
window.history
```

***

## Available Methods

```javascript
history.back();
history.forward();
history.go(-1);
```

***

## React Example: Back Button

```jsx
function BackButton() {
  return (
    <button
      onClick={() =>
        window.history.back()
      }
    >
      Go Back
    </button>
  );
}
```

***

## React Example: Navigation History

```jsx
function Navigation() {
  return (
    <>
      <button
        onClick={() =>
          history.go(-1)
        }
      >
        Previous Page
      </button>

      <button
        onClick={() =>
          history.go(1)
        }
      >
        Next Page
      </button>
    </>
  );
}
```

***

# 3. Location Object

Manages URL information.

Sample URL:

```text
https://example.com/products?id=100
```

***

## Properties

```javascript
location.href
location.hostname
location.pathname
location.search
location.protocol
```

***

## Example

```javascript
console.log(location.href);
```

Output:

```text
https://example.com/products?id=100
```

***

## React Example

```jsx
function CurrentUrl() {
  return (
    <p>
      URL:
      {window.location.href}
    </p>
  );
}
```

***

## Redirect

```javascript
window.location.href =
  "https://google.com";
```

***

# 4. Navigator Object

Provides browser information.

***

## Browser Details

```javascript
navigator.userAgent
```

***

## Online Status

```javascript
navigator.onLine
```

***

## Language

```javascript
navigator.language
```

***

## React Example

```jsx
function BrowserInfo() {
  return (
    <>
      <p>
        Browser:
        {navigator.userAgent}
      </p>

      <p>
        Language:
        {navigator.language}
      </p>
    </>
  );
}
```

***

# 5. Geolocation API

Very common React interview question.

***

## Get Current Location

```javascript
navigator.geolocation
  .getCurrentPosition(
    position => {
      console.log(
        position.coords.latitude
      );

      console.log(
        position.coords.longitude
      );
    }
  );
```

***

## React Example

```jsx
import { useState } from "react";

function LocationTracker() {
  const [location, setLocation] =
    useState(null);

  const getLocation = () => {
    navigator.geolocation
      .getCurrentPosition(
        position => {
          setLocation({
            lat:
              position.coords
                .latitude,
            lng:
              position.coords
                .longitude
          });
        }
      );
  };

  return (
    <>
      <button
        onClick={getLocation}
      >
        Get Location
      </button>

      {location && (
        <pre>
          {JSON.stringify(
            location,
            null,
            2
          )}
        </pre>
      )}
    </>
  );
}
```

***

# 6. Screen Object

Provides display information.

```javascript
screen.width;
screen.height;
```

***

## React Example

```jsx
function ScreenInfo() {
  return (
    <>
      <p>
        Width:
        {screen.width}
      </p>

      <p>
        Height:
        {screen.height}
      </p>
    </>
  );
}
```

***

# 7. Local Storage

Persists data after browser close.

***

## Save

```javascript
localStorage.setItem(
  "theme",
  "dark"
);
```

***

## Read

```javascript
localStorage.getItem(
  "theme"
);
```

***

## React Example

```jsx
import { useEffect } from "react";

function ThemeStore() {
  useEffect(() => {
    localStorage.setItem(
      "theme",
      "dark"
    );
  }, []);

  return null;
}
```

***

# 8. Session Storage

Lives only for current tab.

```javascript
sessionStorage.setItem(
  "token",
  "abc123"
);
```

***

## React Example

```jsx
function Login() {
  const login = () => {
    sessionStorage.setItem(
      "token",
      "123"
    );
  };

  return (
    <button onClick={login}>
      Login
    </button>
  );
}
```

***

# 9. MatchMedia API

Used heavily for responsive React apps.

***

## Example

```javascript
window.matchMedia(
  "(max-width: 768px)"
);
```

***

## React Example

```jsx
function MobileCheck() {
  const [mobile, setMobile] =
    useState(
      window.matchMedia(
        "(max-width:768px)"
      ).matches
    );

  return (
    <div>
      {mobile
        ? "Mobile"
        : "Desktop"}
    </div>
  );
}
```

***

# 10. Notification API

Browser notifications.

```javascript
Notification.requestPermission();
```

***

## React Example

```jsx
function Notify() {
  const showNotification =
    async () => {
      const permission =
        await Notification
          .requestPermission();

      if (
        permission ===
        "granted"
      ) {
        new Notification(
          "Welcome!"
        );
      }
    };

  return (
    <button
      onClick={
        showNotification
      }
    >
      Notify
    </button>
  );
}
```

***

# 11. Timer APIs

### setTimeout

```javascript
setTimeout(() => {
  console.log("Done");
}, 2000);
```

***

### React Example

```jsx
useEffect(() => {
  const timer =
    setTimeout(() => {
      console.log("Loaded");
    }, 2000);

  return () =>
    clearTimeout(timer);
}, []);
```

***

# 12. Fetch API

Although not usually classified separately in interviews, it hangs off `window`.

```javascript
window.fetch(...)
```

### React Example

```jsx
useEffect(() => {
  fetch(
    "https://jsonplaceholder.typicode.com/users"
  )
    .then(res => res.json())
    .then(console.log);
}, []);
```

***

# Senior React Interview Answer

### Most Used BOM Objects in React

```text
window          → events, resize
history         → navigation
location        → URL handling
navigator       → browser info
geolocation     → maps/apps
screen          → display info
localStorage    → persistence
sessionStorage  → temporary storage
Notification    → browser notifications
matchMedia      → responsive UI
setTimeout      → delayed execution
fetch           → API requests
```

### BOM vs DOM

```text
BOM
 ↓
Browser Interaction

window.location
window.history
window.navigator
```

```text
DOM
 ↓
HTML Manipulation

document.querySelector()
document.getElementById()
```

**Interview One-Liner:**

> The Browser Object Model (BOM) provides JavaScript APIs to interact with the browser environment. React applications commonly use BOM objects such as `window`, `history`, `location`, `navigator`, `localStorage`, `sessionStorage`, and `matchMedia` to manage navigation, browser state, persistence, responsive layouts, and user interactions beyond the DOM.

# BOM Objects – Detailed Properties & Methods with Examples

As a React/Frontend Developer, these are the **most important BOM objects and their properties** that are frequently asked in interviews.

***

# 1. Window Object

The root object of the Browser Object Model.

```javascript
window
```

Everything below belongs to window.

```javascript
window.alert("Hello");
window.setTimeout();
window.localStorage;
```

***

## Important Window Properties

### 1. `window.innerWidth`

Current browser viewport width.

```javascript
console.log(window.innerWidth);
```

Output:

```javascript
1366
```

### React Example

```jsx
function Width() {
  return (
    <h2>
      Width: {window.innerWidth}
    </h2>
  );
}
```

***

### 2. `window.innerHeight`

Viewport height.

```javascript
console.log(window.innerHeight);
```

***

### 3. `window.scrollX`

Horizontal scroll.

```javascript
console.log(window.scrollX);
```

***

### 4. `window.scrollY`

Vertical scroll.

```javascript
console.log(window.scrollY);
```

### React Example

```jsx
useEffect(() => {
  const handleScroll = () => {
    console.log(window.scrollY);
  };

  window.addEventListener(
    "scroll",
    handleScroll
  );

  return () =>
    window.removeEventListener(
      "scroll",
      handleScroll
    );
}, []);
```

***

### 5. `window.open()`

Open new tab/window.

```javascript
window.open(
  "https://google.com",
  "_blank"
);
```

***

# 2. Location Object

Current URL information.

Suppose URL:

```text
https://www.example.com/products/mobile?id=100#section
```

***

## location.href

Complete URL.

```javascript
console.log(
  location.href
);
```

Output:

```text
https://www.example.com/products/mobile?id=100#section
```

***

## location.hostname

Domain name.

```javascript
console.log(
  location.hostname
);
```

Output:

```text
www.example.com
```

***

## location.pathname

Route path.

```javascript
console.log(
  location.pathname
);
```

Output:

```text
/products/mobile
```

***

## location.protocol

Protocol.

```javascript
console.log(
  location.protocol
);
```

Output:

```text
https:
```

***

## location.search

Query parameters.

```javascript
console.log(
  location.search
);
```

Output:

```text
?id=100
```

***

## location.hash

Fragment.

```javascript
console.log(
  location.hash
);
```

Output:

```text
#section
```

***

## React Example

```jsx
function UrlInfo() {
  return (
    <>
      <p>
        URL:
        {location.href}
      </p>

      <p>
        Path:
        {location.pathname}
      </p>
    </>
  );
}
```

***

# 3. History Object

Browser navigation history.

***

## history.length

Number of entries.

```javascript
console.log(
  history.length
);
```

Output:

```javascript
12
```

***

## history.back()

```javascript
history.back();
```

Same as browser back button.

***

## history.forward()

```javascript
history.forward();
```

***

## history.go()

Back 2 pages.

```javascript
history.go(-2);
```

Forward 3 pages.

```javascript
history.go(3);
```

***

## React Example

```jsx
<button
  onClick={() =>
    history.back()
  }
>
  Go Back
</button>
```

***

# 4. Navigator Object

Information about browser/device.

***

## navigator.userAgent

```javascript
console.log(
  navigator.userAgent
);
```

Output:

```text
Mozilla/5.0 Chrome...
```

***

## navigator.language

```javascript
console.log(
  navigator.language
);
```

Output:

```text
en-GB
```

***

## navigator.onLine

```javascript
console.log(
  navigator.onLine
);
```

Output:

```javascript
true
```

***

## React Online Status Example

```jsx
function OnlineStatus() {
  return (
    <p>
      {
        navigator.onLine
          ? "Online"
          : "Offline"
      }
    </p>
  );
}
```

***

# 5. Screen Object

Information about monitor/screen.

***

## screen.width

```javascript
console.log(
  screen.width
);
```

Output:

```javascript
1920
```

***

## screen.height

```javascript
console.log(
  screen.height
);
```

Output:

```javascript
1080
```

***

## screen.colorDepth

```javascript
console.log(
  screen.colorDepth
);
```

Output:

```javascript
24
```

***

## React Example

```jsx
function ScreenInfo() {
  return (
    <>
      <p>
        Width:
        {screen.width}
      </p>

      <p>
        Height:
        {screen.height}
      </p>
    </>
  );
}
```

***

# 6. Local Storage

Persistent storage.

***

## setItem()

```javascript
localStorage.setItem(
  "user",
  "Sudhir"
);
```

***

## getItem()

```javascript
localStorage.getItem(
  "user"
);
```

Output:

```text
Sudhir
```

***

## removeItem()

```javascript
localStorage.removeItem(
  "user"
);
```

***

## clear()

```javascript
localStorage.clear();
```

***

## React Example

```jsx
useEffect(() => {
  localStorage.setItem(
    "theme",
    "dark"
  );
}, []);
```

***

# 7. Session Storage

Same API as localStorage.

Only survives until tab closes.

```javascript
sessionStorage.setItem(
  "token",
  "abc123"
);
```

***

# 8. Timers

***

## setTimeout

```javascript
setTimeout(() => {
  console.log("Hello");
}, 3000);
```

Runs once after:

```text
3s
```

***

## clearTimeout

```javascript
const timer =
  setTimeout(...);

clearTimeout(timer);
```

***

## setInterval

```javascript
setInterval(() => {
  console.log("Tick");
}, 1000);
```

Every second.

***

## clearInterval

```javascript
clearInterval(id);
```

***

## React Example

```jsx
useEffect(() => {
  const id =
    setInterval(() => {
      console.log(
        "Running"
      );
    }, 1000);

  return () =>
    clearInterval(id);
}, []);
```

***

# 9. Geolocation

***

## Current Position

```javascript
navigator.geolocation.getCurrentPosition(
  position => {
    console.log(
      position.coords.latitude
    );

    console.log(
      position.coords.longitude
    );
  }
);
```

### Properties

```javascript
position.coords.latitude
position.coords.longitude
position.coords.accuracy
```

***

# 10. MatchMedia

Used for responsive apps.

```javascript
window.matchMedia(
  "(max-width:768px)"
);
```

***

## Property

```javascript
.matches
```

Example:

```javascript
const mobile =
  window.matchMedia(
    "(max-width:768px)"
  ).matches;

console.log(mobile);
```

Output:

```javascript
true
```

***

# 11. Notification

***

## Permission

```javascript
Notification.permission
```

Output:

```text
granted
denied
default
```

***

## Request Permission

```javascript
Notification.requestPermission();
```

***

## Create Notification

```javascript
new Notification(
  "New Message"
);
```

***

# 12. Console Object

***

## log()

```javascript
console.log("Hello");
```

***

## error()

```javascript
console.error(
  "Something failed"
);
```

***

## table()

```javascript
console.table([
  { name: "Sudhir" },
  { name: "John" }
]);
```

***

# Frequently Asked BOM Interview Questions

### Current URL

```javascript
location.href
```

### Current Route

```javascript
location.pathname
```

### Go Back

```javascript
history.back()
```

### Browser Name

```javascript
navigator.userAgent
```

### Internet Status

```javascript
navigator.onLine
```

### Screen Size

```javascript
screen.width
screen.height
```

### Save Data

```javascript
localStorage.setItem()
```

### Responsive Check

```javascript
matchMedia().matches
```

### Show Notification

```javascript
new Notification()
```

# Senior Interview Answer

```text
window
├── location
├── history
├── navigator
├── screen
├── localStorage
├── sessionStorage
├── fetch
├── Notification
├── Geolocation
├── MatchMedia
├── setTimeout
└── setInterval
```

As a React developer, the most commonly used BOM APIs are:

* `window` → resize, scroll, events
* `location` → URL management
* `history` → navigation
* `localStorage/sessionStorage` → persistence
* `navigator` → browser/device information
* `matchMedia` → responsive design
* `Notification` → browser alerts
* `Geolocation` → maps and location-based features

These are heavily used in enterprise React applications, routing, dashboards, PWAs, and accessibility-focused applications.
