# `useObjectState` – Custom React Hook

A common React pattern is creating a custom hook that behaves like `setState` from class components by **merging object updates instead of replacing them**. This is often referred to as `useObjectState`. [\[learnhooks.dev\]](https://learnhooks.dev/articles/simplify-complex-state-management), [\[github.com\]](https://github.com/thers/use-object-state)

---

# Basic Implementation

```tsx
import { useState } from "react";

function useObjectState<T extends object>(initialState: T) {
  const [state, setState] = useState(initialState);

  const updateState = (updates: Partial<T>) => {
    setState((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  return [state, updateState] as const;
}
```

---

# Usage

```tsx
function Profile() {
  const [user, setUser] = useObjectState({
    name: "",
    email: "",
    age: 0,
  });

  return (
    <div>
      <input
        value={user.name}
        onChange={(e) =>
          setUser({
            name: e.target.value,
          })
        }
      />

      <input
        value={user.email}
        onChange={(e) =>
          setUser({
            email: e.target.value,
          })
        }
      />
    </div>
  );
}
```

---

# Advanced Version (Supports Function Updates)

This is the version I recommend for interviews because it handles React state batching correctly. Similar discussions around object-state merging note the importance of supporting functional updates when state depends on previous state. [\[stackoverflow.com\]](https://stackoverflow.com/questions/55342406/updating-and-merging-state-object-using-react-usestate-hook), [\[stackoverflow.com\]](https://stackoverflow.com/questions/60921604/create-custom-hook-to-override-usestate-hook-and-merge-object-properties-reac)

```tsx
import { useState } from "react";

type Update<T> = Partial<T> | ((prev: T) => Partial<T>);

export function useObjectState<T extends object>(initialState: T) {
  const [state, setState] = useState(initialState);

  const updateState = (update: Update<T>) => {
    setState((prev) => {
      const updates = typeof update === "function" ? update(prev) : update;

      return {
        ...prev,
        ...updates,
      };
    });
  };

  return [state, updateState] as const;
}
```

---

# Usage

```tsx
const [counter, setCounter] = useObjectState({
  count: 0,
  total: 100,
});

const increment = () => {
  setCounter((prev) => ({
    count: prev.count + 1,
  }));
};
```

---

# Form Handling Example

```tsx
const [form, setForm] = useObjectState({
  firstName: "",
  lastName: "",
  email: "",
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setForm({
    [e.target.name]: e.target.value,
  });
};
```

```tsx
<input
  name="firstName"
  value={form.firstName}
  onChange={handleChange}
/>

<input
  name="lastName"
  value={form.lastName}
  onChange={handleChange}
/>

<input
  name="email"
  value={form.email}
  onChange={handleChange}
/>
```

---

# Even Better API

```tsx
function useObjectState<T extends object>(initialState: T) {
  const [state, setState] = useState(initialState);

  const merge = (updates: Partial<T>) => {
    setState((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const reset = () => {
    setState(initialState);
  };

  return {
    state,
    merge,
    reset,
  };
}
```

Usage:

```tsx
const { state, merge, reset } = useObjectState({
  name: "",
  age: 0,
});

merge({
  name: "Sudhir",
});

reset();
```

---

# Senior Interview Discussion

### Why useObjectState?

React's `useState` **replaces** state:

```tsx
setUser({
  name: "John",
});
```

Result:

```tsx
{
  name: "John";
}
```

Other fields are lost.

`useObjectState` merges:

```tsx
setUser({
  name: "John",
});
```

Result:

```tsx
{
  name: "John",
  email: "john@test.com",
  age: 30
}
```

---

# Common Enhancements

```text
✅ reset()
✅ deep merge
✅ undo/redo
✅ localStorage persistence
✅ validation
✅ nested property updates
✅ TypeScript generics
✅ Immer integration
```

### Interview Answer

> `useObjectState` is a custom hook built on top of `useState` that merges object updates rather than replacing the entire object. It is particularly useful for forms and complex object state management where multiple fields need independent updates. [\[learnhooks.dev\]](https://learnhooks.dev/articles/simplify-complex-state-management), [\[usehooks.com\]](https://usehooks.com/useobjectstate)
