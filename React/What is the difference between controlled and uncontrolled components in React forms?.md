In React, the difference between **controlled** and **uncontrolled** components comes down to **where the form data's state lives**.

---

## 1. Quick Summary Comparison

| Metric            | Controlled Component                                                   | Uncontrolled Component                                            |
| ----------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **State Driver**  | **React State** (`useState`, `useActionState`).                        | **DOM State** (Native HTML `<input>` state).                      |
| **Data Access**   | Read directly from React state variable.                               | Read via `useRef` or native `FormData`.                           |
| **Value Control** | Bound via `value={state}` and updated via `onChange`.                  | Unbound or set initially via `defaultValue`.                      |
| **Validation**    | Instant / In-flight (validate on every keystroke).                     | On submit / On blur.                                              |
| **React 19 Fit**  | Ideal for interactive UI logic, dependent inputs, and live validation. | Ideal for simple forms, native `<form>` actions, and file inputs. |

---

## 2. Controlled Components

In a controlled component, **React is the single source of truth**. Every input value is driven by React state, and every keystroke triggers a state update via an `onChange` handler.

### Code Example

```tsx
import { useState } from 'react';

export function ControlledForm() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted Email:', email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          type="email"
          value={email} // Driven by React state
          onChange={(e) => setEmail(e.target.value)} // State updated on every keystroke
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

```

### Advantages

* **Instant Feedback:** Easy to build live character counts, conditional input fields, or inline dynamic validation.
* **Format Control:** Allows restricting or formatting user input in real-time (e.g., auto-formatting credit card numbers).

### Disadvantages

* **More Boilerplate:** Requires creating a state variable and an `onChange` handler for every input.
* **Re-render Cost:** Re-renders the component on every single keystroke.

---

## 3. Uncontrolled Components

In an uncontrolled component, **the browser DOM is the single source of truth**. The input maintains its own internal state natively. In React, you read the input's current value either on demand using a **`useRef`** or by extracting data directly from the native **`FormData`** object on form submission.

### Code Example (React 19 `FormData` Pattern)

```tsx
export function UncontrolledForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Read directly from DOM via native FormData
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');

    console.log('Submitted Email:', email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        {/* Uses defaultValue instead of value. Input manages its own DOM state! */}
        <input type="email" name="email" defaultValue="" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

```

### Code Example (Using `useRef`)

```tsx
import { useRef } from 'react';

export function RefUncontrolledForm() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted Email:', inputRef.current?.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} type="email" defaultValue="" />
      <button type="submit">Submit</button>
    </form>
  );
}

```

### Advantages

* **Less Code / Boilerplate:** No need to write state handlers for simple inputs.
* **Better Initial Performance:** Fewer re-renders while typing.
* **Native React 19 Alignment:** Uncontrolled components pair seamlessly with React 19 **Actions** (`<form action={...}>`), where React automatically passes the native `FormData` object to your action function.

### Disadvantages

* Harder to execute instant, per-keystroke input validation.
* Harder to clear or manipulate input values imperatively.

---

## 4. Special Case: File Inputs

File inputs (`<input type="file" />`) in HTML are **always uncontrolled** because their value is read-only and managed directly by the browser for security reasons.

```tsx
// Always uncontrolled!
<input type="file" ref={fileInputRef} />

```

---

## Which One Should You Choose?

* Use **Uncontrolled Components** by default for standard forms, especially in React 19 when using standard forms or Server Actions where you extract data on submit via `FormData`.
* Use **Controlled Components** when you explicitly need instant UI updates—such as dynamic field validation as the user types, disabled submit buttons that depend on multiple fields, or inputs with auto-formatting constraints.
