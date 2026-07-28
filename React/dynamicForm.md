Here is a complete, lightweight dynamic form engine built in pure React without any third-party dependencies.

It dynamically initializes state based on the JSON configuration, handles field visibility (`dependsOn` / `showIf`), runs validation rules (required, regex patterns, min/max lengths), and handles inputs like text, select dropdowns, textareas, and checkboxes.

---

## 1. Dynamic Form Component

```jsx
import React, { useState } from "react";

export function DynamicForm({ config, onSubmit }) {
  // Initialize form state and error state dynamically from config
  const [formData, setFormData] = useState(() => {
    const initialValues = {};
    config.forEach((field) => {
      initialValues[field.name] =
        field.type === "checkbox" ? false : field.defaultValue || "";
    });
    return initialValues;
  });

  const [errors, setErrors] = useState({});

  // Evaluate conditional visibility for a field
  const isFieldVisible = (field) => {
    if (!field.dependsOn) return true;
    const parentValue = formData[field.dependsOn];

    // If showIf is a function, call it; otherwise compare directly
    if (typeof field.showIf === "function") {
      return field.showIf(parentValue, formData);
    }
    return parentValue === field.showIf;
  };

  // Run validation rules against a field
  const validateField = (field, value) => {
    const rules = field.validation;
    if (!rules) return "";

    // Skip validation if the field is currently hidden
    if (!isFieldVisible(field)) return "";

    // Required check
    if (rules.required) {
      if (field.type === "checkbox" && !value) {
        return `${field.label || field.name} must be checked.`;
      }
      if (typeof value === "string" && !value.trim()) {
        return `${field.label || field.name} is required.`;
      }
    }

    // Pattern (Regex) check
    if (rules.pattern && value) {
      const regex = new RegExp(rules.pattern);
      if (!regex.test(value)) {
        return rules.message || `Invalid ${field.label || field.name} format.`;
      }
    }

    // Min Length check
    if (
      rules.minLength &&
      typeof value === "string" &&
      value.length < rules.minLength
    ) {
      return `Must be at least ${rules.minLength} characters.`;
    }

    return "";
  };

  // Handle value change
  const handleChange = (e, field) => {
    const { type, name, value, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    const nextData = { ...formData, [name]: fieldValue };
    setFormData(nextData);

    // Validate field live on change
    const errorMsg = validateField(field, fieldValue);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  // Validate all visible fields on submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    let isValid = true;

    config.forEach((field) => {
      if (isFieldVisible(field)) {
        const error = validateField(field, formData[field.name]);
        if (error) {
          newErrors[field.name] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);

    if (isValid) {
      // Filter out hidden fields from the final payload
      const cleanedData = {};
      config.forEach((field) => {
        if (isFieldVisible(field)) {
          cleanedData[field.name] = formData[field.name];
        }
      });
      onSubmit(cleanedData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{ maxWidth: "400px", margin: "0 auto" }}
    >
      {config.map((field) => {
        if (!isFieldVisible(field)) return null;

        return (
          <div key={field.name} style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "6px",
              }}
            >
              {field.label}
              {field.validation?.required && (
                <span style={{ color: "red" }}> *</span>
              )}
            </label>

            {/* Input Type: Select Dropdown */}
            {field.type === "select" && (
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={(e) => handleChange(e, field)}
                style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
              >
                <option value="">-- Select --</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {/* Input Type: Checkbox */}
            {field.type === "checkbox" && (
              <input
                type="checkbox"
                name={field.name}
                checked={!!formData[field.name]}
                onChange={(e) => handleChange(e, field)}
              />
            )}

            {/* Input Type: Text, Email, Password, Number, Textarea */}
            {["text", "email", "number", "password", "textarea"].includes(
              field.type,
            ) &&
              (field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={formData[field.name]}
                  onChange={(e) => handleChange(e, field)}
                  placeholder={field.placeholder || ""}
                  rows={4}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={(e) => handleChange(e, field)}
                  placeholder={field.placeholder || ""}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
                />
              ))}

            {/* Validation Error Display */}
            {errors[field.name] && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                {errors[field.name]}
              </p>
            )}
          </div>
        );
      })}

      <button
        type="submit"
        style={{
          padding: "10px 16px",
          background: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Submit Form
      </button>
    </form>
  );
}
```

---

## 2. Config Schema & Usage Example

Here is how you structure `formConfig` using your requested example with conditional dependency (`dependsOn` and `showIf`):

```jsx
import React from "react";
import { DynamicForm } from "./DynamicForm";

const formConfig = [
  {
    name: "country",
    label: "Country",
    type: "select",
    options: [
      { label: "India", value: "india" },
      { label: "USA", value: "usa" },
      { label: "Other", value: "other" },
    ],
    validation: { required: true },
  },
  {
    name: "customCountry",
    label: "Enter Country Name",
    type: "text",
    dependsOn: "country",
    showIf: "other", // Shows ONLY when country === "other"
    validation: { required: true, minLength: 2 },
  },
  {
    name: "state",
    label: "State (India)",
    type: "select",
    dependsOn: "country",
    showIf: "india", // Shows ONLY when country === "india"
    options: [
      { label: "Maharashtra", value: "maharashtra" },
      { label: "Karnataka", value: "karnataka" },
      { label: "Delhi", value: "delhi" },
    ],
    validation: { required: true },
  },
  {
    name: "zipCode",
    label: "ZIP / Postal Code",
    type: "text",
    validation: {
      required: true,
      pattern: "^[0-9]{5,6}$",
      message: "Please enter a valid 5 or 6 digit postal code.",
    },
  },
  {
    name: "subscribeNewsletter",
    label: "Subscribe to daily update newsletter?",
    type: "checkbox",
  },
];

export default function App() {
  const handleFormSubmit = (data) => {
    console.log("Validated & Filtered Form Payload:", data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div style={{ padding: "32px" }}>
      <h2>Dynamic Config Form</h2>
      <DynamicForm config={formConfig} onSubmit={handleFormSubmit} />
    </div>
  );
}
```

---

## How it Works Under the Hood

1. **State Initialization:** Uses a lazy state initializer `useState(() => ...)` to inspect the config once on mount and generate initial form key-value pairs without hardcoding fields.
2. **Dynamic Visibility:** The `isFieldVisible()` method checks `dependsOn` and `showIf`. If a field is hidden, it is both omitted from the DOM and bypassed during the validation loop on submit.
3. **Payload Sanitization:** When submitted, the form automatically strips keys corresponding to currently hidden fields so the backend only receives relevant data.

How can I dynamically update the options array of a dropdown based on another selected dropdown value?

To make dropdown options update dynamically based on another dropdown's selection (for example, selecting **India** populates States like _Maharashtra, Karnataka_, while selecting **USA** populates _California, Texas_), you can enhance your `formConfig` JSON in two ways:

1. **Option Map Pattern (Cleanest JSON):** Define an `optionsMap` object inside the field config keyed by the parent field's values.
2. **Dynamic Resolver Function:** Allow `options` to be a function that receives the current `formData` and returns the matching array.

Here is how to implement both techniques in your custom React form engine.

---

## 1. Updating the `DynamicForm` Engine

Update your field rendering logic for `<select>` inputs so that it dynamically resolves options based on the parent field's current value in `formData`.

```jsx
// Helper function inside or outside DynamicForm component
const getResolvedOptions = (field, formData) => {
  // Pattern 1: Function resolver (allows complex custom logic)
  if (typeof field.options === "function") {
    return field.options(formData);
  }

  // Pattern 2: Options map lookup based on parent field value
  if (field.dependsOn && field.optionsMap) {
    const parentValue = formData[field.dependsOn];
    return field.optionsMap[parentValue] || [];
  }

  // Fallback: Static options array
  return field.options || [];
};
```

### Inside the `DynamicForm` JSX Render:

Replace the simple `field.options.map(...)` block with:

```jsx
{
  /* Input Type: Select Dropdown */
}
{
  field.type === "select" &&
    (() => {
      const resolvedOptions = getResolvedOptions(field, formData);

      return (
        <select
          name={field.name}
          value={formData[field.name]}
          onChange={(e) => handleChange(e, field)}
          style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
          disabled={field.dependsOn && !formData[field.dependsOn]} // Disable until parent is selected
        >
          <option value="">
            {field.dependsOn && !formData[field.dependsOn]
              ? `-- Select ${field.dependsOn} first --`
              : "-- Select --"}
          </option>
          {resolvedOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    })();
}
```

---

## 2. Resetting Child Values on Parent Change

When a user changes the parent dropdown (e.g., changes country from _India_ to _USA_), any previously selected child value (like _Maharashtra_) becomes invalid.

Update `handleChange` inside `DynamicForm` to reset dependent fields automatically:

```jsx
const handleChange = (e, field) => {
  const { type, name, value, checked } = e.target;
  const fieldValue = type === "checkbox" ? checked : value;

  const nextData = { ...formData, [name]: fieldValue };

  // 🔄 Reset any child field that depends on THIS field when its value changes
  config.forEach((childField) => {
    if (childField.dependsOn === name) {
      nextData[childField.name] = childField.type === "checkbox" ? false : "";
    }
  });

  setFormData(nextData);

  // Validate live
  const errorMsg = validateField(field, fieldValue);
  setErrors((prev) => ({ ...prev, [name]: errorMsg }));
};
```

---

## 3. Configuration Examples

### Pattern A: `optionsMap` (Declarative JSON)

```javascript
const formConfig = [
  {
    name: "country",
    label: "Country",
    type: "select",
    options: [
      { label: "India", value: "india" },
      { label: "USA", value: "usa" },
    ],
    validation: { required: true },
  },
  {
    name: "state",
    label: "State",
    type: "select",
    dependsOn: "country", // Identifies parent field
    optionsMap: {
      india: [
        { label: "Maharashtra", value: "maharashtra" },
        { label: "Karnataka", value: "karnataka" },
        { label: "Delhi", value: "delhi" },
      ],
      usa: [
        { label: "California", value: "california" },
        { label: "Texas", value: "texas" },
        { label: "New York", value: "ny" },
      ],
    },
    validation: { required: true },
  },
];
```

### Pattern B: Function Resolver (Dynamic JS Logic)

```javascript
const formConfig = [
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      { label: "Electronics", value: "electronics" },
      { label: "Clothing", value: "clothing" },
    ],
  },
  {
    name: "subCategory",
    label: "Sub-Category",
    type: "select",
    dependsOn: "category",
    options: (formData) => {
      if (formData.category === "electronics") {
        return [
          { label: "Laptops", value: "laptops" },
          { label: "Smartphones", value: "smartphones" },
        ];
      }
      if (formData.category === "clothing") {
        return [
          { label: "Shirts", value: "shirts" },
          { label: "Shoes", value: "shoes" },
        ];
      }
      return [];
    },
  },
];
```

How do I add asynchronous field validation (like checking username availability via API) to this custom dynamic React form?
Adding asynchronous validation (like querying an API endpoint to verify if a username is available) requires three enhancements to your dynamic form:

1. **Debouncing** — Delaying the API call until the user stops typing (e.g., 500ms) to avoid spamming your server.
2. **Async Validation State** — Tracking `isChecking` per field to render a loading spinner or indicator.
3. **Async Rules in Config** — Supporting a `validateAsync` function inside the field definition that resolves to an error string (or `null` if valid).

---

## 1. Updated `DynamicForm` Component with Async Validation

Here is the updated component with debounced async validation and loading states:

```jsx
import React, { useState, useRef, useCallback } from "react";

export function DynamicForm({ config, onSubmit }) {
  const [formData, setFormData] = useState(() => {
    const initialValues = {};
    config.forEach((field) => {
      initialValues[field.name] =
        field.type === "checkbox" ? false : field.defaultValue || "";
    });
    return initialValues;
  });

  const [errors, setErrors] = useState({});
  // Track async pending states per field: { [fieldName]: boolean }
  const [asyncChecking, setAsyncChecking] = useState({});

  // Store active debounce timer IDs per field to prevent memory leaks or stale requests
  const debounceTimers = useRef({});

  const isFieldVisible = (field) => {
    if (!field.dependsOn) return true;
    const parentValue = formData[field.dependsOn];
    if (typeof field.showIf === "function") {
      return field.showIf(parentValue, formData);
    }
    return parentValue === field.showIf;
  };

  // Synchronous validation (runs immediately on keystroke)
  const validateSync = (field, value) => {
    const rules = field.validation;
    if (!rules || !isFieldVisible(field)) return "";

    if (rules.required) {
      if (field.type === "checkbox" && !value)
        return `${field.label || field.name} is required.`;
      if (typeof value === "string" && !value.trim())
        return `${field.label || field.name} is required.`;
    }

    if (rules.pattern && value) {
      const regex = new RegExp(rules.pattern);
      if (!regex.test(value))
        return rules.message || `Invalid ${field.label || field.name} format.`;
    }

    if (
      rules.minLength &&
      typeof value === "string" &&
      value.length < rules.minLength
    ) {
      return `Must be at least ${rules.minLength} characters.`;
    }

    return "";
  };

  // Debounced Asynchronous Validation execution
  const runAsyncValidation = useCallback(
    (field, value) => {
      if (
        !field.validation?.validateAsync ||
        !isFieldVisible(field) ||
        !value
      ) {
        return;
      }

      // Clear existing timer if user typed again before timeout ended
      if (debounceTimers.current[field.name]) {
        clearTimeout(debounceTimers.current[field.name]);
      }

      // Set loading indicator
      setAsyncChecking((prev) => ({ ...prev, [field.name]: true }));

      debounceTimers.current[field.name] = setTimeout(async () => {
        try {
          const errorMsg = await field.validation.validateAsync(
            value,
            formData,
          );
          setErrors((prev) => ({ ...prev, [field.name]: errorMsg || "" }));
        } catch (err) {
          setErrors((prev) => ({
            ...prev,
            [field.name]: "Validation error occurred.",
          }));
        } finally {
          setAsyncChecking((prev) => ({ ...prev, [field.name]: false }));
        }
      }, field.validation.debounceMs || 500); // Default 500ms debounce
    },
    [formData],
  );

  const handleChange = (e, field) => {
    const { type, name, value, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    const nextData = { ...formData, [name]: fieldValue };
    setFormData(nextData);

    // 1. Run sync validation immediately
    const syncError = validateSync(field, fieldValue);
    setErrors((prev) => ({ ...prev, [name]: syncError }));

    // 2. If sync validation passes and an async validator exists, trigger debounced check
    if (!syncError && field.validation?.validateAsync) {
      runAsyncValidation(field, fieldValue);
    } else {
      // Clear checking state if sync validation failed
      setAsyncChecking((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Block submit if any async check is currently in progress
    const isAnyAsyncPending = Object.values(asyncChecking).some(Boolean);
    if (isAnyAsyncPending) return;

    const newErrors = {};
    let isValid = true;

    // Run sync validation across all visible fields
    config.forEach((field) => {
      if (isFieldVisible(field)) {
        const error = validateSync(field, formData[field.name]);
        if (error) {
          newErrors[field.name] = error;
          isValid = false;
        }
      }
    });

    setErrors((prev) => ({ ...prev, ...newErrors }));

    // Block submit if any existing errors remain (including previous async errors)
    const hasRemainingErrors = Object.values({ ...errors, ...newErrors }).some(
      Boolean,
    );

    if (isValid && !hasRemainingErrors) {
      const cleanedData = {};
      config.forEach((field) => {
        if (isFieldVisible(field))
          cleanedData[field.name] = formData[field.name];
      });
      onSubmit(cleanedData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{ maxWidth: "400px", margin: "0 auto" }}
    >
      {config.map((field) => {
        if (!isFieldVisible(field)) return null;

        return (
          <div
            key={field.name}
            style={{ marginBottom: "16px", position: "relative" }}
          >
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "6px",
              }}
            >
              {field.label}
              {field.validation?.required && (
                <span style={{ color: "red" }}> *</span>
              )}
            </label>

            <div style={{ position: "relative" }}>
              <input
                type={field.type || "text"}
                name={field.name}
                value={formData[field.name]}
                onChange={(e) => handleChange(e, field)}
                placeholder={field.placeholder || ""}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  borderColor: errors[field.name] ? "red" : "#ccc",
                }}
              />

              {/* Loading Indicator for Async Checks */}
              {asyncChecking[field.name] && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  ⏳ Checking availability...
                </span>
              )}
            </div>

            {/* Error Message */}
            {errors[field.name] && !asyncChecking[field.name] && (
              <p
                style={{
                  color: "red",
                  fontSize: "12px",
                  marginTop: "4px",
                  margin: 0,
                }}
              >
                {errors[field.name]}
              </p>
            )}
          </div>
        );
      })}

      <button
        type="submit"
        disabled={Object.values(asyncChecking).some(Boolean)}
        style={{
          padding: "10px 16px",
          background: Object.values(asyncChecking).some(Boolean)
            ? "#ccc"
            : "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Submit
      </button>
    </form>
  );
}
```

---

## 2. Config Usage Example with Mock API Call

Here is how you define `validateAsync` in your form configuration:

```jsx
// Mock API call simulating a backend database check
const checkUsernameAvailability = async (username) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const takenUsernames = ["admin", "john_doe", "react_dev"];
      if (takenUsernames.includes(username.toLowerCase())) {
        resolve("Username is already taken.");
      } else {
        resolve(null); // Return null when valid
      }
    }, 800); // Simulates network latency
  });
};

const formConfig = [
  {
    name: "username",
    label: "Username",
    type: "text",
    placeholder: "e.g. john_doe",
    validation: {
      required: true,
      minLength: 3,
      debounceMs: 400, // Optional custom debounce time
      validateAsync: async (value) => {
        const error = await checkUsernameAvailability(value);
        return error;
      },
    },
  },
];
```

---

## Key Design Considerations

1. **Synchronous First:** The async validator is only called if synchronous checks (like `required` or `minLength`) pass. This avoids making wasteful API calls for empty strings or invalid input formats.
2. **Race Condition Prevention:** By using a `setTimeout` ref map (`debounceTimers.current`), any pending timer is cancelled when the user types a new character before the delay completes.
3. **Submit Guard:** The submit button is automatically disabled while any async check is pending (`asyncChecking`), preventing invalid forms from submitting early.
