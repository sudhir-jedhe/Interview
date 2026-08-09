**JSX (JavaScript XML)** is a syntax extension for JavaScript used in React to describe what the UI should look like. It allows you to write HTML-like markup directly inside a JavaScript file, combining rendering logic with UI structure.

Under the hood, browser engines cannot read JSX directly. React compilers like **Babel** or **SWC** transform JSX markup into standard JavaScript function calls (`React.createElement` or the modern `_jsx` runtime).

---

## 1. What JSX Looks Like

```jsx
// JSX Code
const element = <h1 className="title">Hello, React!</h1>;

// Transpiled Plain JavaScript (What React actually executes)
import { jsx as _jsx } from 'react/jsx-runtime';
const element = _jsx("h1", { className: "title", children: "Hello, React!" });

```

---

## 2. Core Rules of JSX

### Rule 1: Return a Single Root Element

A component must return a single top-level element. If you have multiple sibling tags, wrap them in a parent element or a **React Fragment** (`<> ... </>`) to avoid adding extra unnecessary nodes to the DOM.

```jsx
// ❌ Invalid
return (
  <h1>Title</h1>
  <p>Paragraph</p>
);

// ✅ Valid (Using React Fragment)
return (
  <>
    <h1>Title</h1>
    <p>Paragraph</p>
  </>
);

```

### Rule 2: Embed JavaScript Expressions with Curly Braces `{ }`

Inside JSX markup, you can write any valid JavaScript expression (variables, function calls, arithmetic operations, ternary checks) by wrapping it in curly braces `{}`.

```jsx
function UserCard() {
  const name = 'Sudhir';
  const isLoggedIn = true;

  return (
    <div>
      <h2>User: {name.toUpperCase()}</h2>
      <p>Status: {isLoggedIn ? 'Active' : 'Offline'}</p>
      <p>Calculation: 2 + 2 = {2 + 2}</p>
    </div>
  );
}

```

### Rule 3: Use camelCase for Attributes

Since JSX turns into JavaScript objects, HTML attribute names follow JavaScript **camelCase** naming conventions instead of standard HTML kebab-case.

* `class` becomes **`className`** (because `class` is a reserved keyword in JS).
* `for` becomes **`htmlFor`** (because `for` is a reserved JS loop keyword).
* `tabindex` becomes **`tabIndex`**.
* Inline styles are passed as **JavaScript objects** rather than strings.

```jsx
// Inline styling in JSX requires an object: {{ key: 'value' }}
const cardStyle = {
  backgroundColor: '#f4f4f4',
  padding: '16px',
  borderRadius: '8px',
};

return (
  <div className="container" style={cardStyle}>
    <label htmlFor="user-input">Name:</label>
    <input id="user-input" tabIndex={1} />
  </div>
);

```

### Rule 4: Close All Tags

Unlike HTML, every tag in JSX **must be explicitly closed**. Self-closing tags require a trailing slash `/`.

```jsx
// ❌ Invalid HTML style
<img src="logo.png">
<br>
<input type="text">

// ✅ Valid JSX style
<img src="logo.png" />
<br />
<input type="text" />

```

---

## 3. Conditional Rendering in JSX

JSX allows you to dynamically show or hide elements using standard JavaScript logic like ternary operators or logical AND (`&&`).

### Using Ternary Operators (`condition ? true : false`)

```jsx
function StatusMessage({ isOnline }) {
  return (
    <div>
      {isOnline ? <p className="success">User is Online</p> : <p className="error">User is Offline</p>}
    </div>
  );
}

```

### Using Logical AND (`&&`)

```jsx
function Notifications({ unreadCount }) {
  return (
    <div>
      <h2>Dashboard</h2>
      {/* Renders badge only if unreadCount > 0 */}
      {unreadCount > 0 && <span className="badge">{unreadCount} unread messages</span>}
    </div>
  );
}

```

> **Caution with `&&`:** Avoid putting numbers on the left side of `&&` if they can be `0`. `{unreadCount && <Badge/>}` will render `0` to the screen when `unreadCount` is 0. Instead, convert it to a boolean explicitly: `{unreadCount > 0 && <Badge/>}`.

---

## 4. Rendering Lists in JSX (`.map()`)

To render lists of items in JSX, use the standard JavaScript `.map()` array method and assign a unique **`key` prop** to each top-level element returned.

```jsx
function FrameworkList() {
  const frameworks = [
    { id: 'f1', name: 'React' },
    { id: 'f2', name: 'Next.js' },
    { id: 'f3', name: 'Vue' },
  ];

  return (
    <ul>
      {frameworks.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

```

---

## Summary Syntax Cheatsheet

| HTML Feature       | JSX Equivalent    | Example                                            |
| ------------------ | ----------------- | -------------------------------------------------- |
| **CSS Class**      | `className`       | `<div className="card">`                           |
| **Form Label For** | `htmlFor`         | `<label htmlFor="email">`                          |
| **Inline Styles**  | Style Object      | `<div style={{ color: 'red', fontSize: '14px' }}>` |
| **Unclosed Tags**  | Self-Closing      | `<img src="a.jpg" />`                              |
| **JS Expressions** | Curly Braces      | `<h1>{title}</h1>`                                 |
| **Comments**       | `{/* comment */}` | `{/* This is a comment inside JSX */}`             |
