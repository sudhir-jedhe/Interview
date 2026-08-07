The **HTML DOM History API** (`window.history`) gives JavaScript direct access to the browser's session history stack, allowing you to control browser navigation and update the address bar URL **without triggering a full page reload**.

This API forms the underlying mechanics for client-side routers in Single-Page Applications (SPAs) like React Router, Vue Router, and Angular Router.

---

## 1. How the History Stack Works

Each tab maintains a stack of visited URLs and associated state objects. You can push new URLs onto the stack, replace current entries, or move backward and forward.

---

## 2. Core History API Methods

### A. Modern State Navigation (SPA Routing)

#### `history.pushState(state, unused, url)`

Adds a new entry to the browser's history stack and changes the URL in the address bar immediately without reloading the page.

* **`state`**: A plain JavaScript object linked to the history entry.
* **`unused`**: Legacy parameter (pass `""` or `null`).
* **`url`**: The new URL string to display in the address bar (must share the same origin).

```javascript
// Current URL: https://example.com/
const userState = { userId: 42, role: "admin" };
window.history.pushState(userState, "", "/profile/42");

// Address bar updates to: https://example.com/profile/42 (No refresh!)

```

#### `history.replaceState(state, unused, url)`

Modifies the **current** entry on the history stack rather than adding a new one. Ideal for modal states, search filters, or query parameter updates.

```javascript
// Updates the current history entry with search filters
window.history.replaceState({ query: "javascript" }, "", "/search?q=javascript");

```

---

### B. Listening for Navigation (`popstate` Event)

When a user clicks the browser's **Back** or **Forward** buttons, the browser triggers a `popstate` event on the `window` object.

```javascript
window.addEventListener("popstate", (event) => {
  // event.state holds the object saved via pushState/replaceState
  console.log("Navigated to state:", event.state);

  if (event.state) {
    loadView(event.state.pageId);
  } else {
    loadView("home"); // Fallback for initial state
  }
});

```

> **Important Note:** Programmatically calling `pushState()` or `replaceState()` does **NOT** fire the `popstate` event. The event triggers exclusively when the user interacts with browser back/forward controls or when calling `history.back()`, `history.forward()`, or `history.go()`.

---

### C. Classic Step Navigation

| Method                  | Description                                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| **`history.back()`**    | Moves back one page in history (equivalent to clicking the browser Back button).                      |
| **`history.forward()`** | Moves forward one page in history (equivalent to clicking Forward).                                   |
| **`history.go(delta)`** | Moves relative steps in history (e.g., `history.go(-2)` moves back 2 pages; `history.go(0)` reloads). |

---

## 3. History API Properties

```javascript
// Total entries in the history stack for this tab
console.log(window.history.length);

// Retrieve state object attached to the active entry
console.log(window.history.state);

// Disable automatic browser scroll restoration (useful for custom scroll handling)
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual"; // Options: 'auto' or 'manual'
}

```

---

## 4. Practical Vanilla JavaScript SPA Router

Here is a functional, single-page client-side router leveraging `pushState` and `popstate`:

```html
<nav>
  <a href="/" data-link>Home</a>
  <a href="/about" data-link>About</a>
  <a href="/contact" data-link>Contact</a>
</nav>

<div id="content">Welcome to the Home Page</div>

<script>
  const routes = {
    "/": "Welcome to the Home Page",
    "/about": "About Us: We build web applications.",
    "/contact": "Contact Us: email@example.com"
  };

  function navigateTo(url, addHistory = true) {
    if (addHistory) {
      window.history.pushState({ path: url }, "", url);
    }
    document.getElementById("content").textContent = routes[url] || "404 Page Not Found";
  }

  // Intercept normal anchor tag clicks
  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault(); // Stop full browser refresh
      const href = e.target.getAttribute("href");
      navigateTo(href);
    }
  });

  // Handle browser back / forward navigation
  window.addEventListener("popstate", (e) => {
    const path = e.state?.path || window.location.pathname;
    navigateTo(path, false);
  });
</script>

```
