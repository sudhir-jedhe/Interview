The **`window.history`** object (part of the Browser Object Model) provides programmatic access to the browser's session history stack—the list of pages visited by the user within the current tab or frame.

---

## 1. Properties of `window.history`

| Property                        | Type     | Description                                                                           |
| ------------------------------- | -------- | ------------------------------------------------------------------------------------- |
| **`history.length`**            | `number` | Returns the total number of entries in the session history stack for the current tab. |
| **`history.state`**             | `object  | null`                                                                                 | Returns the state object associated with the current history entry (set via `pushState` or `replaceState`). |
| **`history.scrollRestoration`** | `string` | Controls automatic scroll restoration (`'auto'` or `'manual'`).                       |

```javascript
// Check how many pages are in the history stack
console.log("Pages in history:", window.history.length);

// Check stored state object for current page
console.log("Current state:", window.history.state);

```

---

## 2. Classic History Navigation Methods

These traditional methods simulate the user clicking browser back and forward controls:

```javascript
// 1. Go back one page (Same as clicking the browser Back button)
window.history.back();

// 2. Go forward one page (Same as clicking the browser Forward button)
window.history.forward();

// 3. Go relative steps (+ for forward, - for back)
window.history.go(-1); // Equivalent to back()
window.history.go(-2); // Go back 2 pages
window.history.go(2);  // Go forward 2 pages
window.history.go(0);  // Reloads the current page

```

---

## 3. The Modern History API for Single-Page Applications (SPAs)

In modern web development, `history.pushState()` and `history.replaceState()` allow you to update the browser address bar URL **without triggering a full page refresh**.

### A. `pushState(state, title, url)`

Pushes a new entry onto the history stack. The user can click the browser's **Back** button to return to the previous URL.

```javascript
// Push a new URL and state onto the stack
const stateData = { pageId: 'settings', theme: 'dark' };
window.history.pushState(stateData, '', '/settings');

// Address bar immediately becomes "/settings" without refreshing the page

```

### B. `replaceState(state, title, url)`

Overwrites the **current** entry in the history stack instead of creating a new one. Useful for updating query parameters or search filters without clogging the user's back-button history.

```javascript
// Replace current history entry with updated URL
window.history.replaceState({ filter: 'active' }, '', '/tasks?status=active');

```

---

## 4. Handling Browser Back/Forward Buttons (`popstate` Event)

When a user navigates between history entries using the browser's **Back** or **Forward** buttons, the `window` object triggers a `popstate` event:

```javascript
window.addEventListener('popstate', (event) => {
  // event.state contains the state object passed during pushState/replaceState
  console.log('User navigated to history entry with state:', event.state);

  if (event.state) {
    // Render view corresponding to stored state
    loadPageContent(event.state.pageId);
  } else {
    // Fallback for default root page
    loadPageContent('home');
  }
});

```

> **Note:** Calling `pushState()` or `replaceState()` programmatically does **NOT** fire the `popstate` event. It fires exclusively from user actions (like clicking back/forward) or calling `history.back()` / `history.forward()`.

---

## 5. Controlling Scroll Position (`scrollRestoration`)

By default, browsers attempt to restore the scroll position when navigating back/forward. You can disable this to manage scroll positions manually in custom applications:

```javascript
// Disable automatic scroll restoration
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

```
