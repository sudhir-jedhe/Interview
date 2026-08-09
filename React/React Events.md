In React, event handling is very similar to handling events on HTML DOM elements, but with a few key syntactical and architectural differences.

React handles events using a system called **SyntheticEvents**, which wraps the browser’s native events to ensure consistent cross-browser behavior.

---

## Key Differences: HTML Events vs. React Events

| Feature              | HTML DOM                                | React SyntheticEvent                                    |
| -------------------- | --------------------------------------- | ------------------------------------------------------- |
| **Naming**           | Lowercase (`onclick`, `onchange`)       | **camelCase** (`onClick`, `onChange`)                   |
| **Value Passed**     | String code (`onclick="handleClick()"`) | **Function reference** (`onClick={handleClick}`)        |
| **Default Behavior** | `return false` stops default            | Must explicitly call **`e.preventDefault()`**           |
| **Delegation**       | Attached directly to DOM node           | Attached via **event delegation** at the root container |

---

## 1. Syntax & Common Event Types

### A. Click Events (`onClick`)

```tsx
import React from 'react';

export function ClickExample() {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked!', e.currentTarget);
  };

  return <button onClick={handleClick}>Click Me</button>;
}

```

### B. Form & Input Events (`onChange`, `onSubmit`)

```tsx
import React, { useState } from 'react';

export function FormExample() {
  const [name, setName] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Prevents default page refresh on form submission
    e.preventDefault();
    alert(`Submitted: ${name}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={handleChange} placeholder="Enter name" />
      <button type="submit">Submit</button>
    </form>
  );
}

```

### C. Keyboard Events (`onKeyDown`, `onKeyUp`)

```tsx
import React from 'react';

export function KeyboardExample() {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('User pressed Enter!');
    }
  };

  return <input type="text" onKeyDown={handleKeyDown} placeholder="Press Enter..." />;
}

```

---

## 2. Passing Arguments to Event Handlers

If you need to pass extra arguments (like an item `id`) to an event handler, wrap the handler in an **inline arrow function**.

```tsx
export function ItemList() {
  const items = [
    { id: '1', title: 'Task 1' },
    { id: '2', title: 'Task 2' },
  ];

  const handleDelete = (id: string, e: React.MouseEvent) => {
    console.log(`Deleting item with ID: ${id}`);
  };

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.title}
          {/* Pass custom arguments via inline arrow function */}
          <button onClick={(e) => handleDelete(item.id, e)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

```

---

## 3. What is a SyntheticEvent?

When an event fires, React passes an instance of **`SyntheticEvent`** to your handler instead of the raw native browser event.

### Key Characteristics

* **Cross-Browser Consistency:** Normalizes event properties across browsers (Firefox, Chrome, Safari, Edge).
* **Same Interface as Native Events:** You still use methods like `e.preventDefault()` and `e.stopPropagation()`.
* **Accessing Native Events:** If you need the underlying browser event object for any reason, access it via `e.nativeEvent`.

```tsx
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log('Synthetic Event:', e);
  console.log('Native Browser Event:', e.nativeEvent);
};

```

---

## 4. Common TypeScript Event Types

When using TypeScript with React, typing event handlers prevents runtime bugs:

| Event Type         | React TypeScript Interface              |
| ------------------ | --------------------------------------- |
| **Mouse Click**    | `React.MouseEvent<HTMLButtonElement>`   |
| **Input / Change** | `React.ChangeEvent<HTMLInputElement>`   |
| **Form Submit**    | `React.FormEvent<HTMLFormElement>`      |
| **Keyboard Press** | `React.KeyboardEvent<HTMLInputElement>` |
| **Focus / Blur**   | `React.FocusEvent<HTMLInputElement>`    |

---

## Summary Best Practices

1. **Don't invoke functions directly in props:** Write `onClick={handleClick}`, NOT `onClick={handleClick()}` (unless `handleClick` returns another function).
2. **Prevent default form submits:** Always call `e.preventDefault()` inside `onSubmit` handlers to prevent standard browser page reloads.
3. **Use Arrow Functions for Parameter passing:** Wrap calls with `(e) => handleDelete(id)` when passing dynamic IDs.
