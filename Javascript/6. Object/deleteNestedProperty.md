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
