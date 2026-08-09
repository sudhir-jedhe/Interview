In React forms, the primary difference between **controlled** and **uncontrolled** components comes down to **who owns and manages the source of truth for the input's value**:

* **Controlled Components:** The **React component state** is the single source of truth.
* **Uncontrolled Components:** The **DOM itself** is the single source of truth.

---

## 1. Controlled Components

In a controlled component, the input’s value is bound directly to a React state variable (via `useState` or `useReducer`), and every user keystroke triggers a state update through an `onChange` handler.

### Key Characteristics

* **Predictable & Reactive:** React knows the exact value of the input at all times.
* **Instant Validation:** Easy to validate input on every keystroke, disable submit buttons conditionally, or format input strings dynamically.
* **More Code:** Requires state declarations and change handlers for each field.

### Code Example (Controlled Form)

```tsx
import React, { useState } from 'react';

export function ControlledForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Instant validation on every keystroke
    if (!value.includes('@')) {
      setError('Please enter a valid email address.');
    } else {
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitted Controlled Email:', email);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '300px', padding: '16px' }}>
      <h3>Controlled Form</h3>
      <div>
        <label htmlFor="controlled-email">Email:</label>
        <input
          id="controlled-email"
          type="email"
          value={email} // 1. React controls the input value
          onChange={handleChange} // 2. React updates state on change
        />
      </div>

      {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}

      <button type="submit" disabled={Boolean(error) || !email}>
        Submit
      </button>
    </form>
  );
}

```

---

## 2. Uncontrolled Components

In an uncontrolled component, the DOM maintains the input value internally. Instead of writing an event handler for every keystroke, you use a **`useRef`** to pull values from the DOM when needed (e.g., upon form submission).

### Key Characteristics

* **Zero Re-renders on Typing:** Typing into the field does **not** trigger React component re-renders.
* **Less Code:** Cleaner setup for simple forms that only need values at submission time.
* **Integration Friendly:** Easy to integrate with non-React legacy DOM libraries or file inputs (`<input type="file" />`).

### Code Example (Uncontrolled Form)

```tsx
import React, { useRef } from 'react';

export function UncontrolledForm() {
  // 1. Create a DOM reference
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 2. Read value directly from the DOM on submit
    const emailValue = emailRef.current?.value;
    console.log('Submitted Uncontrolled Email:', emailValue);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '300px', padding: '16px' }}>
      <h3>Uncontrolled Form</h3>
      <div>
        <label htmlFor="uncontrolled-email">Email:</label>
        <input
          id="uncontrolled-email"
          type="email"
          ref={emailRef} // 3. Attach DOM reference
          defaultValue="" // Initial default value without state binding
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

```

---

## Side-by-Side Feature Comparison

| Requirement / Use Case                  | Controlled Component                            | Uncontrolled Component                    |
| --------------------------------------- | ----------------------------------------------- | ----------------------------------------- |
| **Source of Truth**                     | React State (`useState`)                        | DOM Element (`useRef`)                    |
| **Value Access**                        | Always available in `state`                     | Queried on-demand (`ref.current.value`)   |
| **Performance (Typing)**                | Re-renders component on **every keystroke**     | **Zero re-renders** while typing          |
| **In-flight Validation**                | Very Easy (e.g., instant error feedback)        | Difficult (requires extra listener hooks) |
| **Conditional Submit Disable**          | Easy (`disabled={!isValid}`)                    | Harder (requires DOM state checks)        |
| **Dynamic / Formatted Inputs**          | Easy (e.g., credit card masking `1234-5678`)    | Difficult                                 |
| **File Inputs (`<input type="file">`)** | Impossible (file inputs are strictly read-only) | **Required** (must use uncontrolled/ref)  |

---

## Which One Should You Choose?

1. **Use Controlled Components when:**

* You need instant field validation as the user types.
* You need custom input masking or formatting (e.g., phone numbers or dates).
* Form fields dynamically change based on inputs in other fields.
* You are building a complex interactive form with library integrations like **React Hook Form** or **Formik**.

1. **Use Uncontrolled Components when:**

* You have a basic form that only needs data upon submission (e.g., a simple login or feedback modal).
* You are working with file upload inputs (`<input type="file" />`).
* You want to maximize performance in giant forms by avoiding re-renders on keystrokes.
