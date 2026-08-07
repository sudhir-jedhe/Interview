Deleting a nested property in JavaScript/React can be done in several ways depending on whether you want to **mutate** the original object or **keep immutability** (recommended in React).

***

# 1. Delete Nested Property (Mutates Original Object)

```js
const user = {
  id: 1,
  profile: {
    name: "Sudhir",
    age: 30,
    address: {
      city: "Pune",
      state: "MH"
    }
  }
};

delete user.profile.address.city;

console.log(user);
```

Output:

```js
{
  id: 1,
  profile: {
    name: "Sudhir",
    age: 30,
    address: {
      state: "MH"
    }
  }
}
```

***

# 2. Immutable Approach (React Recommended)

Using object destructuring:

```js
const user = {
  profile: {
    name: "Sudhir",
    age: 30,
    address: {
      city: "Pune",
      state: "MH"
    }
  }
};

const {
  city,
  ...addressWithoutCity
} = user.profile.address;

const updatedUser = {
  ...user,
  profile: {
    ...user.profile,
    address: addressWithoutCity
  }
};

console.log(updatedUser);
```

***

# 3. Delete Property Using Dynamic Path

Example:

```js
"path = profile.address.city"
```

Utility function:

```js
function removeNestedProperty(obj, path) {
  const keys = path.split(".");

  const clone = structuredClone(obj);

  let current = clone;

  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]];
  }

  delete current[keys[keys.length - 1]];

  return clone;
}
```

Usage:

```js
const user = {
  profile: {
    address: {
      city: "Pune",
      state: "MH"
    }
  }
};

const result = removeNestedProperty(
  user,
  "profile.address.city"
);

console.log(result);
```

Output:

```js
{
  profile: {
    address: {
      state: "MH"
    }
  }
}
```

***

# 4. React State Update Example

```tsx
const [user, setUser] = useState({
  profile: {
    name: "Sudhir",
    address: {
      city: "Pune",
      state: "MH"
    }
  }
});

const removeCity = () => {
  setUser(prev => {
    const { city, ...restAddress } =
      prev.profile.address;

    return {
      ...prev,
      profile: {
        ...prev.profile,
        address: restAddress
      }
    };
  });
};
```

✅ React re-renders correctly  
✅ Original state remains immutable

***

# 5. Generic Recursive Utility (Interview Favourite)

```js
function unset(obj, path) {
  const keys = path.split(".");

  const clone = structuredClone(obj);

  let current = clone;

  while (keys.length > 1) {
    current = current[keys.shift()];
  }

  delete current[keys[0]];

  return clone;
}
```

Usage:

```js
unset(user, "profile.address.city");
unset(user, "profile.name");
unset(user, "settings.theme.color");
```

***

# Lodash Solution

If using Lodash:

```js
import _ from "lodash";

_.unset(user, "profile.address.city");
```

This is often the cleanest solution for deeply nested objects.

# Interview Tip

For a **Senior React interview**, mention:

* `delete` mutates the object ❌
* Use spread operators/destructuring for React state ✅
* For dynamic paths, create a reusable `unset()` utility or use `lodash.unset`
* Time Complexity: **O(depth of path)**, not O(n) over the whole object

This demonstrates knowledge of both JavaScript object manipulation and React immutability principles.

This is a clean, well-structured guide that covers the spectrum from raw JS mechanics to React best practices and interview concepts.

A few quick observations and optional refinements you can add to elevate this further:

### 1. Nuance on #5 (Iterative vs. Recursive & Safety)

In section 5, the implementation uses a `while` loop rather than recursion:

* **Iteration vs. Recursion:** Labeling it an *iterative* utility keeps the jargon precise for interviewers.
* **Safety Guard:** If any intermediate key doesn't exist (e.g., `unset(user, "profile.nonexistent.city")`), `current[keys.shift()]` will eventually evaluate to `undefined`, throwing a `TypeError: Cannot read properties of undefined`.
* **Guard fix:**

```js
function safeUnset(obj, path) {
  const clone = structuredClone(obj);
  const keys = path.split(".");
  let current = clone;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!current || typeof current !== "object") return clone; // Early return if path doesn't exist
    current = current[keys[i]];
  }

  if (current) {
    delete current[keys[keys.length - 1]];
  }

  return clone;
}

```

---

### 2. Modern React Alternative: Immer

In large React applications with deeply nested state, manual spread operators (`...`) become verbose and error-prone (the "spread drill"). Mentioning **Immer** is a huge plus in senior React interviews:

```tsx
import { produce } from "immer";

// Mutate a draft copy safely — Immer handles immutability under the hood
setUser(
  produce((draft) => {
    delete draft.profile.address.city;
  })
);

```

---

### Key Interview Takeaways to Accentuate

* **`structuredClone` Availability:** Note that `structuredClone` is supported in all modern browsers and Node.js v17+, but it fails on functions, DOM nodes, or symbols.
* **React Re-render Trigger:** React uses shallow equality (`Object.is`) on state. Mutating `user.profile.address.city` keeps the `user` reference identical, so React ignores the state update. Re-creating object references at every level of the target path forces React to detect the change.
