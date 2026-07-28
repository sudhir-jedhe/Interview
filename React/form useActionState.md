Use the useActionState hook to handle form submission and state management.
Implement an action function that:
Validates that all fields (name, email, country) are filled.
Returns an error message if any field is missing.
Waits 1 second (simulating an async request) before returning a success response.
Resets the form fields after successful submission.
Display:
A loading state (Submitting...) while the form is being processed.
An error message when validation fails.
A success message when submission completes successfully.
Disable the submit button while submitting.
Notes
useActionState receives the action function and an initial form state object.
The action function should return the updated form state after validation or submission.
Use the returned state object to show errors or success messages dynamically.
Always use defaultValue for form inputs when controlled by useActionState.
The action prop on <form> should point to the function returned by useActionState

## React 19 `useActionState` – Complete Solution

### Requirements Covered

✅ `useActionState`

✅ Form Validation

✅ Async Submission (1 second delay)

✅ Success Message

✅ Error Message

✅ Loading State

✅ Disable Submit Button

✅ Reset Form After Success

✅ `defaultValue`

✅ Accessible Form

---

## App.jsx

```jsx
import React, { useActionState } from "react";

const initialState = {
  success: false,
  error: "",
  message: "",
  values: {
    name: "",
    email: "",
    country: "",
  },
};

async function submitAction(
  prevState,
  formData
) {
  const name =
    formData.get("name")?.trim();

  const email =
    formData.get("email")?.trim();

  const country =
    formData
      .get("country")
      ?.trim();

  // Validation

  if (!name) {
    return {
      ...prevState,
      success: false,
      error:
        "Name is required",
      message: "",
      values: {
        ...prevState.values,
        name,
        email,
        country,
      },
    };
  }

  if (!email) {
    return {
      ...prevState,
      success: false,
      error:
        "Email is required",
      message: "",
      values: {
        ...prevState.values,
        name,
        email,
        country,
      },
    };
  }

  if (!country) {
    return {
      ...prevState,
      success: false,
      error:
        "Country is required",
      message: "",
      values: {
        ...prevState.values,
        name,
        email,
        country,
      },
    };
  }

  // Simulate API

  await new Promise(
    resolve =>
      setTimeout(
        resolve,
        1000
      )
  );

  return {
    success: true,
    error: "",
    message:
      "User created successfully",

    // Reset Form
    values: {
      name: "",
      email: "",
      country: "",
    },
  };
}

export default function App() {
  const [
    state,
    formAction,
    isPending,
  ] = useActionState(
    submitAction,
    initialState
  );

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "40px auto",
      }}
    >
      <h1>
        User Registration
      </h1>

      {formAction}
        <div>
          <label>
            Name
          </label>

          <input
            name="name"
            defaultValue={
              state.values.name
            }
          />
        </div>

        <br />

        <div>
          <label>
            Email
          </label>

          <input
            name="email"
            type="email"
            defaultValue={
              state.values
                .email
            }
          />
        </div>

        <br />

        <div>
          <label>
            Country
          </label>

          <select
            name="country"
            defaultValue={
              state.values
                .country
            }
          >
            <option value="">
              Select Country
            </option>

            <option value="India">
              India
            </option>

            <option value="USA">
              USA
            </option>

            <option value="UK">
              UK
            </option>
          </select>
        </div>

        <br />

        <button
          disabled={isPending}
        >
          {isPending
            ? "Submitting..."
            : "Submit"}
        </button>
      </form>

      {state.error && (
        <p
          style={{
            color: "red",
            marginTop:
              "20px",
          }}
        >
          {state.error}
        </p>
      )}

      {state.success && (
        <p
          style={{
            color: "green",
            marginTop:
              "20px",
          }}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
```

---

# Production Version with Reusable Validation

```jsx
const validators = {
  name: (value) => (value ? "" : "Name is required"),

  email: (value) => {
    if (!value) return "Email is required";

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Invalid email";
  },

  country: (value) => (value ? "" : "Country is required"),
};

function validate(formData) {
  const errors = {};

  Object.keys(validators).forEach((field) => {
    const error = validators[field](formData.get(field));

    if (error) {
      errors[field] = error;
    }
  });

  return errors;
}
```

---

# Interview Talking Points

### Why `useActionState`?

```text
React 19 feature

Designed for forms

Action-driven state updates

Works with Server Actions

Reduces form boilerplate
```

---

### Why `defaultValue`?

```text
useActionState does not create controlled inputs

Inputs should use defaultValue

Prevents re-rendering every keystroke
```

---

### Why disable button?

```jsx
disabled = { isPending };
```

Prevents:

```text
Double Submit

Duplicate API Calls

Race Conditions
```

---

### Common Interview Follow-Up

**How would you support field-level validation errors?**

```jsx
{
  errors: {
    name:
      "Name required",

    email:
      "Invalid email"
  }
}
```

Render:

```jsx
{
  state.errors?.name && <span>{state.errors.name}</span>;
}
```

---

### Senior-Level Improvements

```text
✅ Zod Validation

✅ React Hook Form

✅ Server Actions

✅ Optimistic UI

✅ Multi-Step Forms

✅ Async Email Validation

✅ Field-Level Errors

✅ Accessible Form

✅ Reusable Form Components

✅ Error Boundary Integration
```

This is the complete React 19 `useActionState` implementation expected in modern React machine-coding and senior frontend interviews.
