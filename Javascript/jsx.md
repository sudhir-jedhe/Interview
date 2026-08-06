JSX is the syntax extension that allows you to write HTML-like markup directly inside your JavaScript files. While it looks like HTML, it is fundamentally JavaScript under the hood (specifically, it compiles down to `React.createElement()` function calls).

Because it is JavaScript, there are strict rules it must follow to avoid breaking the compiler.

## 1. Return a Single Root Element

A React component can only return one single element. You cannot return multiple sibling elements at the top level.

**Invalid (Throws an error):**

```jsx
// This fails because two root elements are returned
return (
  <h1>Hello</h1>
  <p>Welcome to my app.</p>
);

```

**Valid (Wrapped in a parent):**

```jsx
// Solution A: Wrap in a div
return (
  <div>
    <h1>Hello</h1>
    <p>Welcome to my app.</p>
  </div>
);
```

If you don't want to add extra `<div>` elements to your final HTML (which can break CSS grid/flex layouts), use a **Fragment** (`<> </>`), which groups elements without leaving a trace in the actual DOM.

**Valid (Using Fragments):**

```jsx
// Solution B: Wrap in a React Fragment
return (
  <>
    <h1>Hello</h1>
    <p>Welcome to my app.</p>
  </>
);
```

## 2. Close All Tags

In standard HTML, some tags are "self-closing" and don't require a closing slash (e.g., `<br>`, `<img>`, `<input>`). In JSX, **every** tag must be closed.

**Invalid:**

```jsx
<img src="photo.jpg">
<input type="text">
<br>

```

**Valid:**

```jsx
<img src="photo.jpg" />
<input type="text" />
<br />

```

## 3. camelCase Most Things!

Since JSX turns into JavaScript, attributes that conflict with JavaScript reserved words must be renamed. Furthermore, multi-word HTML attributes are converted to `camelCase`.

- `class` becomes `className` (because `class` is a reserved JS word).
- `for` becomes `htmlFor` (because `for` is a reserved JS loop word).
- `onclick` becomes `onClick`.
- `tabindex` becomes `tabIndex`.
- `stroke-width` (in SVG) becomes `strokeWidth`.

**Invalid:**

```jsx
<div class="card" onclick={handleClick}>
  <label for="name">Name</label>
</div>
```

**Valid:**

```jsx
<div className="card" onClick={handleClick}>
  <label htmlFor="name">Name</label>
</div>
```

_(Exception: `aria-_`and`data-_` attributes are kept as lowercase with dashes, just like standard HTML.)_

## 4. Escape into JavaScript with Curly Braces

To write JavaScript logic or use variables inside your JSX, you must wrap the code in curly braces `{}`. This tells the compiler, "Stop reading this as HTML and evaluate it as JavaScript."

```jsx
const username = "Jane";
const imagePath = "/avatar.png";

return (
  <div>
    {/* Using a variable for text content */}
    <h1>Hello, {username}!</h1>

    {/* Using a variable for an attribute */}
    <img src={imagePath} alt={`${username}'s avatar`} />

    {/* Running a JavaScript expression */}
    <p>2 + 2 is {2 + 2}</p>
  </div>
);
```

## 5. Inline Styles are Objects

In HTML, the `style` attribute accepts a plain text string. In JSX, you must pass a JavaScript object, and all CSS properties must be `camelCased`.

**HTML (String):**

```html
<div style="background-color: blue; padding-top: 10px;"></div>
```

**JSX (Object):**

```jsx
// Notice the double curly braces:
// The outer {} enters JavaScript land.
// The inner {} creates a JavaScript object.
return <div style={{ backgroundColor: "blue", paddingTop: "10px" }}></div>;
```

Because JSX is ultimately converted into standard JavaScript function calls (`React.createElement`), you cannot use standard JavaScript _statements_ (like `if`, `else`, or `switch`) directly inside the JSX `{}` curly braces. You can only use JavaScript _expressions_ — things that evaluate to a value.

Here are the three standard ways to handle conditional rendering in React.

## 1. The Ternary Operator (If / Else)

When you need an "if/else" behavior directly inside your JSX, the ternary operator (`condition ? trueValue : falseValue`) is the standard tool. It acts as an inline `if/else` expression.

```jsx
export default function UserProfile({ isLoggedIn }) {
  return (
    <div>
      {/* If isLoggedIn is true, render the greeting. Else, render the login button. */}
      {isLoggedIn ? <h1>Welcome back, user!</h1> : <button>Log In</button>}
    </div>
  );
}
```

## 2. Logical AND `&&` (If / Nothing)

When you only want to render something if a condition is true, but render _nothing_ if it is false, use the logical AND (`&&`) operator.

In JavaScript, a `true && expression` always evaluates to the `expression`. A `false && expression` evaluates to `false`, and React completely ignores `false` when rendering.

```jsx
export default function Notifications({ messages }) {
  return (
    <div>
      <h1>Inbox</h1>

      {/* The paragraph only renders if there is at least one message */}
      {messages.length > 0 && (
        <p>You have {messages.length} unread messages.</p>
      )}
    </div>
  );
}
```

> **Expert Gotcha:** Always make sure the left side of your `&&` is a boolean. If you write `messages.length && <p>...</p>` and the length is `0`, JavaScript evaluates the expression to `0`. React _will_ render the number `0` to the screen. By using `messages.length > 0`, the left side becomes `false`, which React correctly ignores.

## 3. Standard `if/else` (Outside the `return`)

If your conditional logic is complex, nested, or requires calculating multiple variables, doing it inline with ternaries becomes unreadable. In these cases, handle the standard `if/else` statements _before_ your JSX `return`.

You can assign JSX to standard variables, or return entirely different component trees based on the condition.

```jsx
export default function Dashboard({ userRole }) {
  // 1. Handle standard if/else BEFORE returning JSX
  let dashboardContent;

  if (userRole === "admin") {
    dashboardContent = <AdminPanel />;
  } else if (userRole === "editor") {
    dashboardContent = <EditorTools />;
  } else {
    dashboardContent = <ReadOnlyView />;
  }

  // 2. Inject the calculated variable into the main return
  return (
    <div className="layout">
      <Sidebar />
      <main>{dashboardContent}</main>
    </div>
  );
}
```

**Rule of thumb:** If the condition fits cleanly on one or two lines, use a ternary or `&&` inside the JSX. If it requires heavy logic, extract it above the `return` statement.
