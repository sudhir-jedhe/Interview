An **`AggregateError`** is a built-in JavaScript error object introduced in ES2021. It represents a single error that wraps **multiple underlying errors** together into an iterable `.errors` array property.

Its primary purpose is to handle scenarios where **multiple asynchronous operations fail at the same time**—giving you a single error object to catch while retaining every individual error detail.

---

## Key Use Cases

### 1. `Promise.any()` (The Primary Native Trigger)

The most common native trigger for `AggregateError` is `Promise.any()`.

Unlike `Promise.all()` (which rejects as soon as _one_ promise fails), `Promise.any()` waits for the _first fulfilled promise_. If **every single promise rejects**, `Promise.any()` throws an `AggregateError` containing the errors of every failed promise.

```javascript
async function fetchFromFallbackServers() {
  const endpoints = [
    "https://server1.example.com/api/data",
    "https://server2.example.com/api/data",
    "https://server3.example.com/api/data",
  ];

  try {
    // Tries all endpoints simultaneously; succeeds as soon as ANY one returns 200 OK
    const response = await Promise.any(
      endpoints.map((url) =>
        fetch(url).then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
          return res.json();
        }),
      ),
    );
    return response;
  } catch (err) {
    if (err instanceof AggregateError) {
      console.error("All backup servers failed!");
      console.error("Total failure count:", err.errors.length);

      // Inspect each individual failure
      err.errors.forEach((singleError, index) => {
        console.error(`Server ${index + 1} Error:`, singleError.message);
      });
    }
  }
}
```

---

## 2. Multi-Field Form Validation (Custom Throwing)

When validating a complex form or incoming API request, users prefer seeing **all validation errors at once** rather than fixing them one by one in a tedious loop.

You can throw a custom `AggregateError` to aggregate every field validation failure into a single error payload:

```javascript
function validateUserData(user) {
  const errors = [];

  if (!user.username || user.username.length < 3) {
    errors.push(new Error("Username must be at least 3 characters long."));
  }
  if (!user.email || !user.email.includes("@")) {
    errors.push(new Error("Invalid email address format."));
  }
  if (!user.age || user.age < 18) {
    errors.push(new Error("User must be at least 18 years old."));
  }

  // If there are multiple failures, group them in an AggregateError
  if (errors.length > 0) {
    throw new AggregateError(errors, "User validation failed.");
  }
}

// Handling in controller/caller
try {
  validateUserData({ username: "al", email: "invalid-email", age: 15 });
} catch (err) {
  if (err instanceof AggregateError) {
    console.log(err.message); // "User validation failed."

    // Send array of field errors back to UI or API response
    const errorList = err.errors.map((e) => e.message);
    console.log(errorList);
    // Output:
    // [
    //   'Username must be at least 3 characters long.',
    //   'Invalid email address format.',
    //   'User must be at least 18 years old.'
    // ]
  }
}
```

---

## 3. Parallel Batch Operations with `Promise.allSettled()`

When performing bulk actions (e.g., uploading 10 files or deleting 50 records), `Promise.allSettled()` returns an array of results with status `'fulfilled'` or `'rejected'`.

You can aggregate all rejected items into an `AggregateError` to report failure details gracefully:

```javascript
async function deleteSelectedItems(itemIds) {
  const results = await Promise.allSettled(
    itemIds.map((id) => deleteSingleItemFromDatabase(id)),
  );

  // Filter out all rejections
  const failures = results
    .filter((res) => res.status === "rejected")
    .map((res) => res.reason);

  if (failures.length > 0) {
    throw new AggregateError(
      failures,
      `Failed to delete ${failures.length} out of ${itemIds.length} items.`,
    );
  }

  return "All items deleted successfully!";
}
```

---

## Structure of `AggregateError`

```javascript
const err = new AggregateError(
  [new Error("Error A"), new TypeError("Error B")],
  "Operation failed",
);

console.log(err.name); // "AggregateError"
console.log(err.message); // "Operation failed"
console.log(err.errors); // [ Error('Error A'), TypeError('Error B') ]
```

### Properties:

- **`.errors`**: An array containing all underlying error objects passed during creation.
- **`.message`**: The summary error message describing the overall failure.
- **`.name`**: Always `"AggregateError"`.

How can I handle and render AggregateError gracefully inside React Error Boundaries?

Handling an `AggregateError` inside a React Error Boundary requires unwrapping its nested `.errors` array so your fallback UI can present each individual failure clearly to the user (e.g., showing a list of failed API endpoints, validation errors, or missing resources) rather than displaying a generic, unhelpful error message.

---

## 1. Creating the Error Boundary Component

In React, Error Boundaries must still be Class Components (or built using third-party libraries like `react-error-boundary`).

Here is how to create a custom Error Boundary that inspects incoming errors, checks if the error is an instance of `AggregateError`, and extracts its `.errors` list for the UI:

```tsx
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | AggregateError | null;
}

export class AggregateErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError && this.state.error) {
      const isAggregate = this.state.error instanceof AggregateError;

      // Extract individual errors if it's an AggregateError, or treat as single item array
      const errorList: Error[] = isAggregate
        ? (this.state.error as AggregateError).errors
        : [this.state.error];

      return (
        <div
          className="error-fallback-card"
          role="alert"
          style={{
            padding: "1.5rem",
            border: "1px solid #f87171",
            borderRadius: "8px",
            backgroundColor: "#fef2f2",
          }}
        >
          <h2 style={{ color: "#991b1b", marginTop: 0 }}>
            {isAggregate ? "Multiple Errors Occurred" : "An Error Occurred"}
          </h2>

          <p style={{ color: "#7f1d1d" }}>{this.state.error.message}</p>

          {/* Render individual errors list */}
          <ul style={{ color: "#991b1b", textAlign: "left" }}>
            {errorList.map((err, index) => (
              <li key={index}>
                <strong>{err.name || "Error"}:</strong>{" "}
                {err.message || String(err)}
              </li>
            ))}
          </ul>

          <button
            onClick={this.handleReset}
            style={{
              padding: "0.5rem 1rem",
              marginTop: "1rem",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 2. Important Catch: Asynchronous Errors (`Promise.any`)

By default, React Error Boundaries **do NOT catch async errors** (such as uncaught promise rejections inside `setTimeout`, `fetch`, or event handlers).

Because `AggregateError` usually originates from asynchronous calls like `Promise.any()`, you must re-throw the async error into React's render phase so the Error Boundary can intercept it.

### A. Re-throwing Async Errors into Render Phase

To catch async errors in functional components, use `useState` to re-throw the error:

```tsx
import { useState } from "react";

export function DataFetcher() {
  const [, setError] = useState();

  const handleFetch = async () => {
    try {
      // Promise.any throws an AggregateError if all endpoints fail
      await Promise.any([
        fetch("/api/primary-server").then((res) => {
          if (!res.ok) throw new Error("Primary server 500");
        }),
        fetch("/api/backup-server").then((res) => {
          if (!res.ok) throw new Error("Backup server 503");
        }),
      ]);
    } catch (err) {
      // Re-throw inside a state setter to pass async errors to ErrorBoundary
      setError(() => {
        throw err;
      });
    }
  };

  return <button onClick={handleFetch}>Load Data</button>;
}
```

---

## 3. Using Modern `react-error-boundary` (Alternative)

If you are using the popular `react-error-boundary` library, you can use the `useErrorBoundary` hook to trigger boundaries from async handlers and provide a custom fallback:

```tsx
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";

// Custom Fallback Component
function FallbackUI({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  const isAggregate = error instanceof AggregateError;
  const errors = isAggregate ? (error as AggregateError).errors : [error];

  return (
    <div className="error-box">
      <h3>{error.message || "Operation Failed"}</h3>
      <ul>
        {errors.map((err, idx) => (
          <li key={idx}>{err.message}</li>
        ))}
      </ul>
      <button onClick={resetErrorBoundary}>Retry</button>
    </div>
  );
}

// Component using async logic
function UserProfile() {
  const { showBoundary } = useErrorBoundary();

  const loadData = async () => {
    try {
      await Promise.any([
        /* ... async operations ... */
      ]);
    } catch (err) {
      showBoundary(err); // Pass AggregateError directly to nearest ErrorBoundary
    }
  };

  return <button onClick={loadData}>Load Profile</button>;
}

// App Usage
export function App() {
  return (
    <ErrorBoundary FallbackComponent={FallbackUI}>
      <UserProfile />
    </ErrorBoundary>
  );
}
```
