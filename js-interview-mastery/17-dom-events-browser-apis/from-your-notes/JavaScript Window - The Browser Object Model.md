The **Browser Object Model (BOM)** allows JavaScript to interact with the web browser outside the core HTML DOM.

At the absolute root of the BOM is the **`window` object**. In client-side JavaScript, `window` is the global object—meaning every global variable, global function, and web API (like `document`, `fetch`, or `setTimeout`) automatically becomes a property or method of `window`.

```text
                           ┌─────────────────┐
                           │  window (BOM)   │
                           └────────┬────────┘
     ┌──────────────┬───────────────┼───────────────┬──────────────┐
     ▼              ▼               ▼               ▼              ▼
┌──────────┐  ┌───────────┐   ┌───────────┐   ┌───────────┐  ┌───────────┐
│ document │  │ navigator │   │ location  │   │  history  │  │  screen   │
│  (DOM)   │  │ (Browser) │   │   (URL)   │   │ (Session) │  │ (Display) │
└──────────┘  └───────────┘   └───────────┘   └───────────┘  └───────────┘

```

---

## 1. Window Viewport Dimensions

The `window` object provides properties to measure the browser window's visible viewport size:

```javascript
// Inner dimensions: The actual viewport (excluding scrollbars/toolbars)
const viewportWidth = window.innerWidth;
const viewportHeight = window.innerHeight;

// Outer dimensions: The entire browser window including browser chrome/toolbars
const browserWidth = window.outerWidth;
const browserHeight = window.outerHeight;

console.log(`Viewport: ${viewportWidth}x${viewportHeight}`);

```

---

## 2. Core BOM Child Objects

### A. `window.location` (URL Management)

Manages the current page address, allowing you to read URL parameters or redirect the browser.

```javascript
// Read parts of the current URL
console.log(window.location.href);     // "https://example.com/shop?id=10#details"
console.log(window.location.hostname); // "example.com"
console.log(window.location.pathname); // "/shop"
console.log(window.location.search);   // "?id=10"

// Navigate to a new page
// window.location.href = "https://developer.mozilla.org";

// Reload current page
// window.location.reload();

```

---

### B. `window.navigator` (Browser & Device Capabilities)

Provides information about the user's browser engine, operating system, language, and hardware capabilities.

```javascript
console.log(window.navigator.userAgent);   // Browser identity string
console.log(window.navigator.language);    // e.g., "en-US"
console.log(window.navigator.onLine);      // true if connected to network
console.log(window.navigator.hardwareConcurrency); // CPU logical cores count

// Modern Clipboard API under navigator
async function copyToClipboard(text) {
  await window.navigator.clipboard.writeText(text);
  console.log("Copied to clipboard!");
}

```

---

### C. `window.history` (Session Navigation)

Controls forward and backward navigation through the browser's session history stack.

```javascript
// Navigate relative to history
window.history.back();    // Equivalent to clicking browser back button
window.history.forward(); // Equivalent to clicking browser forward button
window.history.go(-2);    // Go back 2 pages in history

// Single-Page Application (SPA) state manipulation without page refresh
window.history.pushState({ page: 2 }, "Title", "/page2");

```

---

### D. `window.screen` (Display Monitor Metrics)

Contains information about the physical monitor screen resolution.

```javascript
console.log(window.screen.width);       // Total physical monitor width (e.g., 1920)
console.log(window.screen.height);      // Total physical monitor height (e.g., 1080)
console.log(window.screen.availWidth);  // Available width excluding OS taskbars
console.log(window.screen.availHeight); // Available height excluding OS taskbars

```

---

## 3. Window Timing & Dialog Methods

### Timers

`setTimeout` and `setInterval` execute code asynchronously after specified delays (in milliseconds):

```javascript
// Execute once after 2000ms delay
const timerId = window.setTimeout(() => {
  console.log("Fired after 2 seconds!");
}, 2000);

// Clear timer if needed
// window.clearTimeout(timerId);

// Execute repeatedly every 1000ms
const intervalId = window.setInterval(() => {
  console.log("Tick...");
}, 1000);

// Stop interval
// window.clearInterval(intervalId);

```

---

### Modal Dialogs

Synchronous pop-up dialogs (blocks main thread execution while visible):

```javascript
// 1. Alert (Notification only)
window.alert("Settings saved!");

// 2. Confirm (Returns true for OK, false for Cancel)
const userConfirmed = window.confirm("Are you sure you want to delete this file?");
if (userConfirmed) {
  console.log("File deleted");
}

// 3. Prompt (Returns input string or null if canceled)
const username = window.prompt("Enter your name:", "Guest");
console.log(`Welcome, ${username}`);

```

---

## Summary Matrix: DOM vs. BOM

| Feature             | DOM (`window.document`)                | BOM (`window`)                                   |
| ------------------- | -------------------------------------- | ------------------------------------------------ |
| **Focus**           | Document content inside the web page.  | Browser frame, window, display, and environment. |
| **Standardization** | Governed strictly by W3C standards.    | Standardized under WHATWG HTML specification.    |
| **Key Objects**     | `document`, `Element`, `Node`, `Text`. | `location`, `navigator`, `history`, `screen`.    |

Explain the JavaScript History API and pushState for Single Page Applications with code examples

The **JavaScript History API** provides access to the browser's session history stack via the `window.history` object. It allows web applications to manipulate the URL in the browser address bar **without triggering a full page refresh**.

This capability is the backbone of client-side routing in modern **Single-Page Applications (SPAs)** built with frameworks like React, Vue, Angular, or vanilla JavaScript.

---

## 1. Why SPAs Need the History API

In a traditional multi-page website, clicking a link causes the browser to make an HTTP request to a new server endpoint, download an entire HTML document, and redraw the screen.

In a Single-Page Application:

1. The initial HTML/JavaScript shell loads **once**.
2. Clicking a navigation link intercepts the browser event.
3. JavaScript fetches or renders only the required view/data dynamically.
4. **The History API updates the URL bar** so users can bookmark, share, and use the browser's **Back/Forward** buttons seamlessly.

---

## 2. Core History API Methods

### A. `history.pushState(state, title, url)`

Pushes a new entry onto the browser's history stack and updates the address bar URL immediately without reloading the page.

* **`state`**: A plain JavaScript object associated with the history entry (e.g., `{ pageId: 42 }`). Retrieved via `history.state` or `event.state`.
* **`title`**: Legacy parameter originally intended for page title (most modern browsers ignore this; pass `""`).
* **`url`**: The new URL to display in the address bar (must be on the same origin).

```javascript
// Current URL: https://myapp.com/
history.pushState({ view: "profile", userId: 101 }, "", "/profile/101");

// Address bar is now: https://myapp.com/profile/101
// Page DOES NOT reload!

```

---

### B. `history.replaceState(state, title, url)`

Modifies the **current** entry in the history stack rather than adding a new one.

Use `replaceState` when updating query parameters, search filters, or form tabs where you don't want the user to go "back" to every minor state change.

```javascript
// Replaces current history entry with updated search parameters
history.replaceState({ query: "javascript" }, "", "/search?q=javascript");

```

---

### C. Listening to Navigation (`popstate` Event)

When a user clicks the browser's **Back** or **Forward** buttons, the browser emits a `popstate` event on the `window` object.

The `event.state` object contains whatever state object you attached when calling `pushState` or `replaceState`.

```javascript
window.addEventListener("popstate", (event) => {
  // event.state contains the state object passed during pushState()
  console.log("Navigated via Back/Forward button!", event.state);

  if (event.state) {
    // Render view based on stored state
    renderView(event.state.view);
  } else {
    // Render default root view if state is null
    renderView("home");
  }
});

```

> **Note:** Calling `pushState()` or `replaceState()` manually does **NOT** fire the `popstate` event. `popstate` is triggered exclusively by user actions (like clicking back/forward buttons or calling `history.back()`).

---

## 3. Complete Vanilla SPA Router Example

Here is a functional, single-page client router using `pushState` and `popstate`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Vanilla SPA Router</title>
  <style>
    nav { display: flex; gap: 15px; margin-bottom: 20px; }
    .nav-link { cursor: pointer; color: blue; text-decoration: underline; }
    .page { padding: 20px; background: #f4f4f4; border-radius: 8px; }
  </style>
</head>
<body>

  <nav>
    <a class="nav-link" href="/" data-path="/">Home</a>
    <a class="nav-link" href="/about" data-path="/about">About</a>
    <a class="nav-link" href="/dashboard" data-path="/dashboard">Dashboard</a>
  </nav>

  <div id="app" class="page">Loading...</div>

  <script>
    const routes = {
      "/": "<h1>Home Page</h1><p>Welcome to our Single Page Application!</p>",
      "/about": "<h1>About Us</h1><p>Learn more about our team and mission.</p>",
      "/dashboard": "<h1>Dashboard</h1><p>User metrics and analytics live here.</p>"
    };

    const app = document.getElementById("app");

    // 1. Render view based on current path
    function navigateTo(path, addToHistory = true) {
      const content = routes[path] || "<h1>404</h1><p>Page Not Found</p>";
      app.innerHTML = content;

      if (addToHistory) {
        // Update URL bar without page refresh
        window.history.pushState({ path }, "", path);
      }
    }

    // 2. Intercept navigation links using Event Delegation
    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-path]");
      if (link) {
        e.preventDefault(); // Stop full page HTTP reload
        const path = link.getAttribute("data-path");
        navigateTo(path, true);
      }
    });

    // 3. Handle Browser Back / Forward buttons
    window.addEventListener("popstate", (event) => {
      const path = event.state?.path || window.location.pathname;
      navigateTo(path, false); // Don't push to history again on popstate!
    });

    // 4. Handle initial page load / refresh
    navigateTo(window.location.pathname, false);
  </script>
</body>
</html>

```

---

## 4. Key Server Requirement for SPA History Routing

When using clean URLs (like `[myapp.com/dashboard](https://myapp.com/dashboard)` instead of hash fragments like `[myapp.com/#dashboard](https://myapp.com/#dashboard)`), you **must configure your web server** (Nginx, Apache, Node.js/Express).

If a user directly enters `[https://myapp.com/dashboard](https://myapp.com/dashboard)` into their browser address bar or presses **F5 / Refresh**, the browser sends a direct request to the server for `/dashboard`.

* **Without Server Fallback:** The server returns a `404 Not Found` error because `/dashboard` isn't a physical file on disk.
* **With Server Fallback:** Configure the server to rewrite all unknown requests back to `index.html`. Client-side JavaScript then reads `window.location.pathname` and renders the correct view.

---

## Summary Reference

| Method / Property                          | Description                                                                    |
| ------------------------------------------ | ------------------------------------------------------------------------------ |
| **`history.pushState(state, "", url)`**    | Adds a new entry to session history and changes URL without refresh.           |
| **`history.replaceState(state, "", url)`** | Replaces current history entry and changes URL without refresh.                |
| **`window.addEventListener("popstate")`**  | Fires when user clicks browser Back or Forward buttons.                        |
| **`history.state`**                        | Returns the current state object attached to the current active history entry. |
| **`history.back()` / `history.forward()**` | Programmatically navigates backward or forward in history.                     |

Explain URL and URLSearchParams in JavaScript with code examples

The **`URL`** and **`URLSearchParams`** modern Web APIs provide an object-oriented approach to parsing, building, and manipulating URLs and query strings without prone-to-error string concatenation or regular expressions.

---

## 1. The `URL` API

The `URL` constructor parses a URL string into structured, editable properties (such as protocol, hostname, pathname, search query, and hash fragment).

### Syntax

```javascript
const url = new URL(urlString, [baseURL]);

```

### Basic Example

```javascript
const urlString = "https://user:pass@example.com:8080/shop/items?category=shoes&page=2#reviews";
const parsedUrl = new URL(urlString);

console.log(parsedUrl.protocol); // "https:"
console.log(parsedUrl.host);     // "example.com:8080"
console.log(parsedUrl.hostname); // "example.com"
console.log(parsedUrl.port);     // "8080"
console.log(parsedUrl.pathname); // "/shop/items"
console.log(parsedUrl.search);   // "?category=shoes&page=2"
console.log(parsedUrl.hash);     // "#reviews"
console.log(parsedUrl.origin);   // "https://example.com:8080"

```

### Resolving Relative URLs

Pass a second parameter to resolve relative URLs against a base origin:

```javascript
const base = "https://api.example.com/v1/";
const relativeUrl = new URL("users/profile", base);

console.log(relativeUrl.href); // "https://api.example.com/v1/users/profile"

```

---

## 2. The `URLSearchParams` API

The `URLSearchParams` interface handles reading, writing, and mutating the query parameters of a URL (the `?key=value` portion).

Access it directly via `url.searchParams` on a `URL` object, or instantiate it independently from a query string.

### Working with `url.searchParams`

```javascript
const myUrl = new URL("https://example.com/search?category=laptops&sort=price_asc");

// 1. READ parameters
console.log(myUrl.searchParams.get("category")); // "laptops"
console.log(myUrl.searchParams.has("sort"));     // true

// 2. ADD or MODIFY parameters
myUrl.searchParams.set("sort", "rating_desc"); // Overwrites existing key
myUrl.searchParams.append("filter", "in_stock"); // Appends key (allows multi-values)

// 3. DELETE a parameter
myUrl.searchParams.delete("category");

console.log(myUrl.toString());
// Output: "https://example.com/search?sort=rating_desc&filter=in_stock"

```

---

## 3. Common `URLSearchParams` Methods

| Method                  | Description                                                | Example                         |
| ----------------------- | ---------------------------------------------------------- | ------------------------------- |
| **`get(name)`**         | Returns first value associated with `name`, or `null`.     | `params.get("q")`               |
| **`getAll(name)`**      | Returns an array of all values for a given `name`.         | `params.getAll("tag")`          |
| **`set(name, val)`**    | Sets `name` to `val`, removing duplicate occurrences.      | `params.set("page", "1")`       |
| **`append(name, val)`** | Appends a new parameter without overwriting existing ones. | `params.append("color", "red")` |
| **`has(name)`**         | Returns boolean indicating if key exists.                  | `params.has("id")`              |
| **`delete(name)`**      | Removes specified parameter.                               | `params.delete("page")`         |
| **`sort()`**            | Sorts all key/value pairs alphabetically by key.           | `params.sort()`                 |

---

## 4. Iterating and Converting Query Parameters

`URLSearchParams` implements an iterable interface, allowing `for...of` loops and conversion to standard JavaScript objects or arrays.

### Iterating over Key-Value Pairs

```javascript
const searchString = "?role=admin&status=active&tag=js&tag=web";
const params = new URLSearchParams(searchString);

for (const [key, value] of params) {
  console.log(`${key}: ${value}`);
}
// Logs:
// role: admin
// status: active
// tag: js
// tag: web

```

---

### Converting Between Objects and Query Strings

```javascript
// 1. Convert plain Object -> URLSearchParams (building query strings)
const filterObject = { page: 1, limit: 20, search: "react & vue" };
const queryParams = new URLSearchParams(filterObject);

console.log(queryParams.toString());
// Automatic encoding: "page=1&limit=20&search=react+%26+vue"

// 2. Convert URLSearchParams -> plain Object
const paramsFromUrl = new URLSearchParams("?category=books&author=king");
const obj = Object.fromEntries(paramsFromUrl);

console.log(obj); // { category: "books", author: "king" }

```

---

## 5. Practical Fetch API Example

`URLSearchParams` automatically handles percent-encoding special characters (spaces, `&`, `#`), making it reliable for API calls:

```javascript
async function fetchProducts(category, minPrice) {
  const url = new URL("https://api.example.com/products");

  // Construct query parameters safely
  url.searchParams.set("category", category);
  url.searchParams.set("min_price", minPrice);
  url.searchParams.set("in_stock", "true");

  console.log("Fetching from:", url.toString());
  // Fetching from: https://api.example.com/products?category=electronics&min_price=500&in_stock=true

  const response = await fetch(url);
  return response.json();
}

// fetchProducts("electronics", 500);

```
