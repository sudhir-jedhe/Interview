The **Web Storage API** provides a mechanism for web browsers to securely store key-value pairs locally within the user's browser. It offers a much larger storage capacity (~5 MB) than cookies (~4 KB) and never transmits stored data to the server via automatic HTTP request headers.

The API consists of two mechanisms: **`window.localStorage`** and **`window.sessionStorage`**.

---

## 1. `localStorage` vs. `sessionStorage`

| Feature              | `localStorage`                                                                                    | `sessionStorage`                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Persistence**      | **Persistent:** Remains saved until explicitly cleared via code or browser cache removal.         | **Session-Only:** Cleared automatically when the tab or window is closed. |
| **Tab Scope**        | Shared across all tabs, windows, and frames opened on the same origin (protocol + domain + port). | Isolated strictly to the single browser tab/window where it was created.  |
| **Capacity**         | ~5 MB per origin.                                                                                 | ~5 MB per origin/tab.                                                     |
| **Common Use Cases** | User preferences (dark/light theme, language selection), shopping cart drafts.                    | Single-session state (multi-step wizard forms, unsaved active inputs).    |

---

## 2. Core API Methods & Code Examples

Both `localStorage` and `sessionStorage` implement the exact same `Storage` interface methods.

```javascript
// Note: Replace localStorage with sessionStorage to use session-scoped storage

// 1. Set Item (Stores key-value pair)
localStorage.setItem("theme", "dark");
localStorage.setItem("user_id", "98765");

// 2. Get Item (Returns string value or null if key doesn't exist)
const currentTheme = localStorage.getItem("theme");
console.log(currentTheme); // "dark"

const missingItem = localStorage.getItem("non_existent");
console.log(missingItem); // null

// 3. Remove Item (Deletes a specific key)
localStorage.removeItem("user_id");

// 4. Clear All (Deletes ALL keys saved for the origin)
// localStorage.clear();

// 5. Length & Key by Index
console.log(localStorage.length); // Total number of stored items
console.log(localStorage.key(0)); // Returns the key name at index 0

```

---

## 3. Storing Objects & Arrays (JSON Serialization)

The Web Storage API **only stores strings**. Passing plain objects or numbers directly will automatically convert them to the useless string `"[object Object]"`.

To store structured data like objects or arrays, serialize them with **`JSON.stringify()`** and parse them back with **`JSON.parse()`**:

```javascript
const userProfile = {
  name: "Alice",
  role: "Admin",
  permissions: ["read", "write", "delete"]
};

// ❌ WRONG: Stores "[object Object]"
// localStorage.setItem("user", userProfile);

// ✅ CORRECT: Serialize object to JSON string before storing
localStorage.setItem("user", JSON.stringify(userProfile));

// Retrieve and parse back into a JavaScript object
const storedData = localStorage.getItem("user");
if (storedData) {
  const parsedUser = JSON.parse(storedData);
  console.log(parsedUser.name); // "Alice"
  console.log(parsedUser.permissions); // ["read", "write", "delete"]
}

```

---

## 4. Listening for Cross-Tab Storage Changes (`storage` Event)

When `localStorage` is updated in one browser tab, other open tabs/windows on the same origin receive a **`storage`** event. This enables multi-tab state synchronization:

```javascript
// Run this listener in Tab B
window.addEventListener("storage", (event) => {
  console.log(`Key changed: ${event.key}`);
  console.log(`Old value: ${event.oldValue}`);
  console.log(`New value: ${event.newValue}`);
  console.log(`URL where change occurred: ${event.url}`);

  if (event.key === "theme") {
    document.body.className = event.newValue;
  }
});

// If Tab A runs: localStorage.setItem("theme", "light");
// Tab B instantly executes the listener above!

```

> **Note:** The `storage` event fires **only in other tabs**, not on the current tab that made the change.

---

## 5. Security Best Practices

1. **Never store sensitive tokens in `localStorage`:** Avoid storing unencrypted JWTs, access tokens, or passwords in `localStorage`. Any **XSS (Cross-Site Scripting)** vulnerability on your domain allows attackers to read all keys. Store sensitive authentication tokens in **`HttpOnly` cookies**.
2. **Handle Storage Quota Errors:** Wrap write calls in `try...catch` blocks to handle cases where storage is full (`QuotaExceededError`) or when private browsing mode blocks access:

```javascript
function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    if (error.name === "QuotaExceededError") {
      console.error("Storage limit reached!");
    } else {
      console.error("Storage write failed:", error);
    }
  }
}

```
