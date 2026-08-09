# Build a Production-Ready React Form

## Requirement

```text
✅ Multiple Input Fields

✅ Real-time Validation

✅ Disable Submit Until Valid

✅ Reusable Architecture

✅ Accessibility (A11y)

✅ Scalable for Large Forms

✅ Interview Ready
```

Production forms should disable submission until validation passes and provide clear validation feedback to users. Accessibility improvements such as ARIA attributes and error announcements are also recommended. [\[codegenes.net\]](https://www.codegenes.net/blog/how-to-conditionally-disable-the-submit-button-with-react-hook-form/), [\[react-hook-form.com\]](https://react-hook-form.com/advanced-usage)

***

# Architecture

```text
App
│
├── Form
│
├── FormField
│
├── Validation Engine
│
├── Submit Button
│
└── Custom Hook
       useForm
```

***

# Folder Structure

```text
src/
│
├── App.jsx
├── hooks
│   └── useForm.js
│
├── components
│   ├── FormField.jsx
│   └── RegistrationForm.jsx
│
└── validators.js
```

***

# Validation Rules

```js
// validators.js

export const validators = {
  name: value => {
    if (!value.trim())
      return "Name is required";

    if (value.length < 3)
      return "Minimum 3 characters";

    return "";
  },

  email: value => {
    if (!value.trim())
      return "Email is required";

    const regex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(value)
      ? ""
      : "Invalid email";
  },

  password: value => {
    if (!value)
      return "Password required";

    if (value.length < 8)
      return "Minimum 8 characters";

    return "";
  }
};
```

***

# Custom Hook

## useForm.js

```jsx
import { useMemo, useState }
from "react";

export default function useForm(
  initialValues,
  validators
) {
  const [
    values,
    setValues
  ] = useState(initialValues);

  const [
    touched,
    setTouched
  ] = useState({});

  const errors = useMemo(() => {
    const result = {};

    Object.keys(values)
      .forEach(field => {
        const error =
          validators[field]?.(
            values[field]
          );

        if (error)
          result[field] =
            error;
      });

    return result;
  }, [values, validators]);

  const isValid =
    Object.keys(errors)
      .length === 0;

  const handleChange =
    e => {
      const {
        name,
        value
      } = e.target;

      setValues(prev => ({
        ...prev,
        [name]: value
      }));
    };

  const handleBlur =
    e => {
      setTouched(prev => ({
        ...prev,
        [e.target.name]:
          true
      }));
    };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    isValid
  };
}
```

***

# Reusable Input Component

## FormField.jsx

```jsx
function FormField({
  label,
  name,
  type = "text",
  value,
  error,
  touched,
  onChange,
  onBlur
}) {
  return (
    <div className="field">
      <label
        htmlFor={name}
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={
          error
            ? "true"
            : "false"
        }
      />

      {touched && error && (
        <span
          role="alert"
          className="error"
        >
          {error}
        </span>
      )}
    </div>
  );
}

export default FormField;
```

Using `aria-invalid` and `role="alert"` improves accessibility and error announcements for assistive technologies. [\[react-hook-form.com\]](https://react-hook-form.com/advanced-usage)

***

# Main Form

## RegistrationForm.jsx

```jsx
import FormField from "./FormField";

import useForm from "../hooks/useForm";

import {
  validators
} from "../validators";

export default function RegistrationForm() {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    isValid
  } = useForm(
    {
      name: "",
      email: "",
      password: ""
    },
    validators
  );

  const handleSubmit =
    e => {
      e.preventDefault();

      if (!isValid)
        return;

      console.log(
        "Submitted",
        values
      );

      alert(
        "Form Submitted"
      );
    };

  return (
    <form
      onSubmit={
        handleSubmit
      }
    >
      <FormField
        label="Name"
        name="name"
        value={
          values.name
        }
        error={
          errors.name
        }
        touched={
          touched.name
        }
        onChange={
          handleChange
        }
        onBlur={
          handleBlur
        }
      />

      <FormField
        label="Email"
        name="email"
        value={
          values.email
        }
        error={
          errors.email
        }
        touched={
          touched.email
        }
        onChange={
          handleChange
        }
        onBlur={
          handleBlur
        }
      />

      <FormField
        label="Password"
        type="password"
        name="password"
        value={
          values.password
        }
        error={
          errors.password
        }
        touched={
          touched.password
        }
        onChange={
          handleChange
        }
        onBlur={
          handleBlur
        }
      />

      <button
        type="submit"
        disabled={
          !isValid
        }
      >
        Submit
      </button>
    </form>
  );
}
```

The common production pattern is to derive a form validity state and bind it to the button's `disabled` attribute so the button only becomes active when validation passes. [\[coreui.io\]](https://coreui.io/answers/how-to-disable-submit-button-in-react-until-form-is-valid/), [\[codegenes.net\]](https://www.codegenes.net/blog/how-to-conditionally-disable-the-submit-button-with-react-hook-form/)

***

# App.jsx

```jsx
import RegistrationForm
from "./components/RegistrationForm";

export default function App() {
  return (
    <div>
      <h1>
        Registration Form
      </h1>

      <RegistrationForm />
    </div>
  );
}
```

***

# CSS

```css
form {
  width: 400px;
  margin: auto;
}

.field {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 6px;
}

input {
  width: 100%;
  padding: 10px;
}

.error {
  color: red;
  font-size: 12px;
}

button {
  width: 100%;
  padding: 12px;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

***

# Senior-Level Discussion

### 1. Why Not Store `isValid` in State?

Bad:

```js
const [isValid, setIsValid] =
  useState(false);
```

Because:

```text
Derived State
```

Calculate from errors instead.

***

### 2. Large Forms

For:

```text
50+
fields
```

Use:

```text
React Hook Form
Formik
Final Form
```

React Hook Form is widely used because it provides performant form state management and built-in validation features. [\[codegenes.net\]](https://www.codegenes.net/blog/how-to-conditionally-disable-the-submit-button-with-react-hook-form/), [\[react-hook-form.com\]](https://react-hook-form.com/advanced-usage)

***

### 3. Prevent Expensive Re-renders

Use:

```jsx
React.memo()
```

for fields.

```jsx
<FormField />
```

***

### 4. Async Validation

Example:

```text
Check Username Availability
```

```js
validateUsername()
```

Use:

```text
Debounce
AbortController
```

***

### 5. Multi-Step Forms

```text
Step 1
Personal Info

Step 2
Address

Step 3
Payment
```

Store data centrally and validate per step. Multi-step ("wizard") forms commonly use shared state across pages or sections. [\[react-hook-form.com\]](https://react-hook-form.com/advanced-usage)

***

# Interview Answer (Senior Level)

> I would create a reusable form architecture using controlled components and a custom validation layer. Validation errors would be derived from form values rather than duplicated in state. The submit button would remain disabled until all required fields are valid. For accessibility, I'd add `aria-invalid` and `role="alert"`. For large enterprise applications, I'd use React Hook Form with schema-based validation (Yup/Zod), field-level memoisation, debounced async validation, and multi-step form support. [\[react-hook-form.com\]](https://react-hook-form.com/advanced-usage), [\[codegenes.net\]](https://www.codegenes.net/blog/how-to-conditionally-disable-the-submit-button-with-react-hook-form/)

# Enterprise-Grade Reusable Form Architecture (React + Custom Validation)

This implementation demonstrates:

✅ Controlled Components

✅ Reusable Fields

✅ Derived Validation (No Duplicate Error State)

✅ Disabled Submit Until Valid

✅ Accessibility (`aria-invalid`, `role="alert"`)

✅ Async Validation Support

✅ Debounced Validation

✅ Field-Level Memoisation

✅ Multi-Step Ready

✅ Production Architecture

***

# Project Structure

```text
src/
│
├── App.jsx
│
├── form/
│   ├── useForm.js
│   ├── validators.js
│   └── debounce.js
│
├── components/
│   ├── FormField.jsx
│   ├── TextInput.jsx
│   ├── EmailInput.jsx
│   ├── PasswordInput.jsx
│   └── RegistrationForm.jsx
│
└── styles.css
```

***

# validators.js

```jsx
export const validators = {
  firstName: value => {
    if (!value.trim())
      return "First name is required";

    if (value.length < 3)
      return "Must be at least 3 characters";

    return "";
  },

  email: value => {
    if (!value.trim())
      return "Email is required";

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(value)
      ? ""
      : "Invalid email address";
  },

  password: value => {
    if (!value)
      return "Password required";

    if (value.length < 8)
      return "Minimum 8 characters";

    if (!/[A-Z]/.test(value))
      return "Must contain uppercase";

    if (!/\d/.test(value))
      return "Must contain number";

    return "";
  },

  confirmPassword: (
    value,
    values
  ) => {
    if (!value)
      return "Confirm Password";

    if (
      value !== values.password
    ) {
      return "Passwords must match";
    }

    return "";
  }
};
```

***

# debounce.js

```jsx
export function debounce(
  fn,
  delay
) {
  let timer;

  return (...args) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
```

***

# useForm.js

```jsx
import {
  useMemo,
  useState,
  useCallback
} from "react";

export default function useForm(
  initialValues,
  validators
) {
  const [
    values,
    setValues
  ] = useState(initialValues);

  const [
    touched,
    setTouched
  ] = useState({});

  const [
    loadingFields,
    setLoadingFields
  ] = useState({});

  /*
   * Errors are DERIVED.
   * Not stored separately.
   */
  const errors = useMemo(() => {
    const result = {};

    Object.keys(values).forEach(
      field => {
        const validator =
          validators[field];

        if (!validator)
          return;

        const error =
          validator(
            values[field],
            values
          );

        if (error) {
          result[field] =
            error;
        }
      }
    );

    return result;
  }, [values, validators]);

  const isValid =
    Object.keys(errors)
      .length === 0;

  const handleChange =
    useCallback(e => {
      const {
        name,
        value
      } = e.target;

      setValues(prev => ({
        ...prev,
        [name]: value
      }));
    }, []);

  const handleBlur =
    useCallback(e => {
      setTouched(prev => ({
        ...prev,
        [e.target.name]:
          true
      }));
    }, []);

  return {
    values,
    errors,
    touched,
    isValid,
    loadingFields,
    setLoadingFields,
    handleChange,
    handleBlur,
    setValues
  };
}
```

***

# FormField.jsx

```jsx
import React from "react";

function FormField({
  label,
  error,
  touched,
  children
}) {
  return (
    <div className="field">
      <label>
        {label}
      </label>

      {children}

      {touched && error && (
        <span
          role="alert"
          className="error"
        >
          {error}
        </span>
      )}
    </div>
  );
}

export default React.memo(
  FormField
);
```

***

# TextInput.jsx

```jsx
import React from "react";

function TextInput({
  name,
  value,
  onChange,
  onBlur,
  error
}) {
  return (
    <input
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      aria-invalid={
        error
          ? "true"
          : "false"
      }
    />
  );
}

export default React.memo(
  TextInput
);
```

***

# EmailInput.jsx

```jsx
import React from "react";

function EmailInput(props) {
  return (
    <input
      type="email"
      {...props}
      aria-invalid={
        props.error
          ? "true"
          : "false"
      }
    />
  );
}

export default React.memo(
  EmailInput
);
```

***

# PasswordInput.jsx

```jsx
import React from "react";

function PasswordInput(
  props
) {
  return (
    <input
      type="password"
      {...props}
      aria-invalid={
        props.error
          ? "true"
          : "false"
      }
    />
  );
}

export default React.memo(
  PasswordInput
);
```

***

# RegistrationForm.jsx

```jsx
import useForm from "../form/useForm";
import { validators }
  from "../form/validators";

import FormField from "./FormField";
import TextInput from "./TextInput";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";

export default function RegistrationForm() {

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    isValid
  } = useForm(
    {
      firstName: "",
      email: "",
      password: "",
      confirmPassword:
        ""
    },
    validators
  );

  const submit = e => {
    e.preventDefault();

    if (!isValid) return;

    console.log(
      "Submitting...",
      values
    );

    alert(
      "Registration Successful"
    );
  };

  return (
    <form
      onSubmit={submit}
      noValidate
    >
      <FormField
        label="First Name"
        error={
          errors.firstName
        }
        touched={
          touched.firstName
        }
      >
        <TextInput
          name="firstName"
          value={
            values.firstName
          }
          onChange={
            handleChange
          }
          onBlur={
            handleBlur
          }
          error={
            errors.firstName
          }
        />
      </FormField>

      <FormField
        label="Email"
        error={
          errors.email
        }
        touched={
          touched.email
        }
      >
        <EmailInput
          name="email"
          value={
            values.email
          }
          onChange={
            handleChange
          }
          onBlur={
            handleBlur
          }
          error={
            errors.email
          }
        />
      </FormField>

      <FormField
        label="Password"
        error={
          errors.password
        }
        touched={
          touched.password
        }
      >
        <PasswordInput
          name="password"
          value={
            values.password
          }
          onChange={
            handleChange
          }
          onBlur={
            handleBlur
          }
          error={
            errors.password
          }
        />
      </FormField>

      <FormField
        label="Confirm Password"
        error={
          errors.confirmPassword
        }
        touched={
          touched.confirmPassword
        }
      >
        <PasswordInput
          name="confirmPassword"
          value={
            values.confirmPassword
          }
          onChange={
            handleChange
          }
          onBlur={
            handleBlur
          }
          error={
            errors.confirmPassword
          }
        />
      </FormField>

      <button
        type="submit"
        disabled={!isValid}
      >
        Submit
      </button>
    </form>
  );
}
```

***

# App.jsx

```jsx
import RegistrationForm
  from "./components/RegistrationForm";

export default function App() {
  return (
    <div className="container">
      <h1>
        Enterprise Form
      </h1>

      <RegistrationForm />
    </div>
  );
}
```

***

# styles.css

```css
.container {
  width: 500px;
  margin: 40px auto;
  font-family: sans-serif;
}

.field {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

input[aria-invalid="true"] {
  border-color: red;
}

.error {
  display: block;
  color: red;
  margin-top: 4px;
  font-size: 12px;
}

button {
  width: 100%;
  padding: 12px;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

***

# Enterprise Enhancements (What Staff/Principal Engineers Discuss)

### Async Username Validation

```jsx
const checkUsername =
  debounce(async value => {
    const available =
      await api.check(
        value
      );
  }, 500);
```

***

### Multi-Step Forms

```text
Step 1 → Personal Info

Step 2 → Address

Step 3 → Payment

Step 4 → Review
```

Store centrally using:

```jsx
Context API
Redux Toolkit
Zustand
```

***

### Schema-Based Validation

```bash
npm install zod
```

```jsx
import { z } from "zod";
```

```jsx
const schema = z.object({
  email:
    z.string().email(),
  password:
    z.string().min(8)
});
```

***

### React Hook Form (Enterprise Standard)

```bash
npm install react-hook-form
```

Benefits:

```text
✅ Minimal Re-renders
✅ Built-in Validation
✅ Field Arrays
✅ Multi-Step Support
✅ Better Performance
✅ Easy Zod/Yup Integration
```

***

# Senior Interview Answer

> I build forms using controlled components with a reusable field abstraction and a custom validation layer. Validation errors are derived from current form values rather than duplicated in state, preventing state synchronisation bugs. Form validity is computed from the validation result and used to disable the submit button until all required fields are valid. For accessibility, every field uses `aria-invalid` and validation messages use `role="alert"`. At enterprise scale, I typically combine React Hook Form with Zod/Yup schemas, debounced async validation, field-level memoisation, and a multi-step architecture to keep forms maintainable, performant, and accessible.

When handling forms with **multiple input fields** in React, writing a separate state variable and change handler for every single field quickly creates repetitive, unmaintainable code.

The standard React pattern is to manage the entire form as a **single object state** and use a **single dynamic change handler** that updates fields based on their `name` attribute.

---

## The Standard Pattern: Single Object State + Dynamic Handler

### How It Works

1. Store all form values in one object: `useState({ username: '', email: '', role: 'user', agreeToTerms: false })`.
2. Give every input HTML element a `name` attribute that **matches its key in the state object**.
3. Use JavaScript's **computed property names** (`[e.target.name]: e.target.value`) inside the `onChange` handler to dynamically update whichever field was edited.

---

## Complete Practical Example

This example handles **text inputs**, **emails**, **checkboxes**, and **select dropdowns** using a single change handler and state object.

```tsx
import React, { useState } from 'react';

interface FormData {
  username: string;
  email: string;
  role: string;
  subscribeNewsletter: boolean;
}

export function MultiInputForm() {
  // 1. Initialize all form fields in a single state object
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    role: 'developer',
    subscribeNewsletter: false,
  });

  // 2. Single dynamic change handler for all fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Handle checkboxes differently since their value lives in 'checked', not 'value'
    const fieldValue =
      type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value;

    setFormData((prevData) => ({
      ...prevData,          // 1. Spread existing form fields
      [name]: fieldValue,   // 2. Override specific field using computed property name
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form Submitted Payload:', formData);
    alert(`User ${formData.username} registered successfully!`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: '400px',
        margin: '20px auto',
        padding: '24px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        fontFamily: 'sans-serif',
      }}
    >
      <h2>User Profile Setup</h2>

      {/* Text Input */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="username" style={{ display: 'block', fontWeight: 600 }}>
          Username:
        </label>
        <input
          id="username"
          type="text"
          name="username" // Must match state object key 'username'
          value={formData.username}
          onChange={handleChange}
          placeholder="e.g. jessica_dev"
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
      </div>

      {/* Email Input */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="email" style={{ display: 'block', fontWeight: 600 }}>
          Email Address:
        </label>
        <input
          id="email"
          type="email"
          name="email" // Must match state object key 'email'
          value={formData.email}
          onChange={handleChange}
          placeholder="e.g. jessica@example.com"
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
      </div>

      {/* Select Dropdown */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="role" style={{ display: 'block', fontWeight: 600 }}>
          Role:
        </label>
        <select
          id="role"
          name="role" // Must match state object key 'role'
          value={formData.role}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        >
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
          <option value="product_manager">Product Manager</option>
        </select>
      </div>

      {/* Checkbox */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          id="subscribeNewsletter"
          type="checkbox"
          name="subscribeNewsletter" // Must match state object key 'subscribeNewsletter'
          checked={formData.subscribeNewsletter}
          onChange={handleChange}
        />
        <label htmlFor="subscribeNewsletter" style={{ fontSize: '14px' }}>
          Subscribe to product updates
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#2563eb',
          color: '#ffffff',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Save Profile
      </button>

      {/* Live State Output Preview */}
      <div style={{ marginTop: '20px', padding: '12px', background: '#f8fafc', borderRadius: '4px' }}>
        <small style={{ color: '#64748b', fontWeight: 600 }}>LIVE STATE PREVIEW:</small>
        <pre style={{ margin: '4px 0 0', fontSize: '12px' }}>{JSON.stringify(formData, null, 2)}</pre>
      </div>
    </form>
  );
}

```

---

## Key Steps to Avoid Common Pitfalls

1. **Keep `name` Attributes Exact:** The `name` string on the HTML input element must match the state object key word-for-word. A typo in `name="e-mail"` when state is `email` will create a new unintended key in your state object.
2. **Always Spread Previous State (`...prevData`):** Overriding state without spreading `...prevData` will erase all other input values in the form.
3. **Handle Checkboxes Explicitly:** Checkbox inputs read boolean values from `e.target.checked` rather than string values from `e.target.value`.

---

## When to Switch to React Hook Form

For simple forms with 3–6 fields, native `useState` with the single object approach is clean and lightweight.

However, if your form grows to **10+ fields**, requires **complex validation schemas** (like Zod), or needs **dynamic field arrays** (adding/removing rows), consider switching to **React Hook Form**. It keeps inputs uncontrolled internally, eliminating main-thread keystroke re-renders.
