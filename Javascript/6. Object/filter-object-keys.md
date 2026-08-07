The code you provided is a great way to filter object properties by key or conditionally based on values, and it leverages some powerful JavaScript methods (`Object.entries()`, `Object.fromEntries()`, and `Array.filter()`). Let's break down the logic of each function and the examples to understand how these utilities work.

### 1. **`pick` and `omit` Functions**

These two functions filter object properties based on an array of keys.

#### `pick` Function

The `pick` function filters an object to include only the properties whose keys are present in the specified array (`arr`).

```js
const pick = (obj, arr) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => arr.includes(k)));
```

- **`Object.entries(obj)`**: Converts the object `obj` into an array of key-value pairs (e.g., `[['a', 1], ['b', 2], ['c', 3]]`).
- **`filter(([k]) => arr.includes(k))`**: Filters the entries based on whether the key `k` is included in the array `arr`.
- **`Object.fromEntries()`**: Converts the filtered key-value pairs back into an object.

Example:

```js
const obj = { a: 1, b: '2', c: 3 };
pick(obj, ['a', 'c']); // { 'a': 1, 'c': 3 }
```

This will return a new object with only the keys `a` and `c`, and their corresponding values.

#### `omit` Function

The `omit` function is the reverse of `pick`. It filters the object to **omit** the properties whose keys are present in the specified array (`arr`).

```js
const omit = (obj, arr) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !arr.includes(k)));
```

- **`Object.entries(obj)`**: Converts the object into an array of key-value pairs.
- **`filter(([k]) => !arr.includes(k))`**: Filters out the key-value pairs where the key `k` is in the array `arr`.
- **`Object.fromEntries()`**: Converts the filtered pairs back into an object.

Example:

```js
const obj = { a: 1, b: '2', c: 3 };
omit(obj, ['b']); // { 'a': 1, 'c': 3 }
```

This will return a new object with the key `b` omitted, leaving only `a` and `c`.

### 2. **`pickBy` and `omitBy` Functions**

These two functions allow you to filter object properties based on a condition, which is defined by a function.

#### `pickBy` Function

The `pickBy` function picks properties from the object based on whether a condition (provided in the form of a function `fn`) is satisfied for each key-value pair.

```js
const pickBy = (obj, fn) =>
  Object.fromEntries(Object.entries(obj).filter(([k, v]) => fn(v, k)));
```

- **`Object.entries(obj)`**: Converts the object into an array of key-value pairs.
- **`filter(([k, v]) => fn(v, k))`**: Filters the entries based on the result of the function `fn`, which is called with the value `v` and key `k` as arguments.
- **`Object.fromEntries()`**: Converts the filtered entries back into an object.

Example:

```js
const obj = { a: 1, b: '2', c: 3 };
pickBy(obj, x => typeof x === 'number'); // { a: 1, c: 3 }
```

This will return a new object that includes only the properties where the value is a number. The `b` key is excluded because its value is a string.

#### `omitBy` Function

The `omitBy` function is the reverse of `pickBy`. It filters the object to **omit** properties where the condition defined by the function `fn` is true.

```js
const omitBy = (obj, fn) =>
  Object.fromEntries(Object.entries(obj).filter(([k, v]) => !fn(v, k)));
```

- **`Object.entries(obj)`**: Converts the object into an array of key-value pairs.
- **`filter(([k, v]) => !fn(v, k))`**: Filters out the entries where the function `fn` returns `true`.
- **`Object.fromEntries()`**: Converts the filtered entries back into an object.

Example:

```js
const obj = { a: 1, b: '2', c: 3 };
omitBy(obj, x => typeof x !== 'number'); // { a: 1, c: 3 }
```

This will return a new object that excludes properties where the value is **not** a number, which means it omits the key `b`.

### Summary of Functions

| Function | Description                                      | Example Input                                          | Example Output   |
| -------- | ------------------------------------------------ | ------------------------------------------------------ | ---------------- |
| `pick`   | Pick properties by a list of keys.               | `{ a: 1, b: 2, c: 3 }`, `['a', 'c']`                   | `{ a: 1, c: 3 }` |
| `omit`   | Omit properties by a list of keys.               | `{ a: 1, b: 2, c: 3 }`, `['b']`                        | `{ a: 1, c: 3 }` |
| `pickBy` | Pick properties based on a condition (function). | `{ a: 1, b: '2', c: 3 }`, `x => typeof x === 'number'` | `{ a: 1, c: 3 }` |
| `omitBy` | Omit properties based on a condition (function). | `{ a: 1, b: '2', c: 3 }`, `x => typeof x !== 'number'` | `{ a: 1, c: 3 }` |

### Performance Considerations

- **Efficiency**: These functions use `Object.entries()` to convert the object into an array, which might not be the most performant for large objects, especially if you need to iterate over a very large number of properties. However, for most common use cases, the performance impact should be negligible.
  
- **Readability**: The code is clear and concise, and it leverages JavaScript's higher-order functions (`filter()`, `map()`) to create powerful abstractions. The use of `Object.fromEntries()` helps in creating the final object in a succinct way.

### Potential Improvements

- **Shallow Cloning**: In case the input object has nested objects, these functions only filter the top-level keys and values. If you want deep cloning or filtering, you might need to implement a deep copy mechanism.
- **Error Handling**: The functions assume that the inputs are always valid objects and arrays. Adding some basic error handling (e.g., checking for `null` or `undefined`) could make the functions more robust.

This is a very effective and readable way to filter object properties based on either keys or conditions!

Your breakdown of `pick`, `omit`, `pickBy`, and `omitBy` captures the essence of FP (Functional Programming) utilities popularized by libraries like Lodash and 30 Seconds of Code.

A few technical nuances worth pointing out enhance performance, edge cases, and type safety:

---

### 1. Performance Optimization: `Set` for `pick` and `omit`

In your implementations:

```js
const pick = (obj, arr) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => arr.includes(k)));

```

`arr.includes(k)` runs an $O(N)$ linear scan for every single property in the object. If `arr` contains 100 keys and `obj` has 1,000 properties, that results in up to 100,000 comparisons ($O(N \times M)$ time complexity).

Converting `arr` to a **`Set`** reduces lookup to $O(1)$:

```js
const pick = (obj, arr) => {
  const keySet = new Set(arr);
  return Object.fromEntries(Object.entries(obj).filter(([k]) => keySet.has(k)));
};

```

---

### 2. High-Performance imperative Alternative ($O(K)$)

`Object.entries()` creates an array of 2-element tuples in memory. For hot paths (e.g., rendering loop, streaming data), you can avoid array allocations altogether by iterating directly over the target keys:

```js
// Time Complexity: O(K) where K = number of keys in `arr`
// Allocates zero intermediate arrays
const pickFast = (obj, arr) => {
  const result = {};
  for (let i = 0; i < arr.length; i++) {
    const key = arr[i];
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
};

```

---

### 3. Edge Cases & Prototype Hazards

When using `Object.entries()`, only an object's **own enumerable string properties** are processed. Inherited properties and `Symbol` keys are ignored:

```js
const sym = Symbol('id');
const obj = { [sym]: 123, a: 1 };

console.log(pick(obj, [sym])); // Output: {} (Symbol ignored by Object.entries)

```

To include `Symbol` properties, you would need `Reflect.ownKeys(obj)` instead of `Object.entries()`.

---

### 4. TypeScript Typing Signature

For projects using TypeScript, these utilities require careful generic typing so that the returned object preserves precise property types rather than returning generic `Record<string, any>`:

```ts
// Preserves exact key-value types from the source object
function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const keySet = new Set<string | symbol>(keys as (string | symbol)[]);
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => keySet.has(k))
  ) as Pick<T, K>;
}

function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const keySet = new Set<string | symbol>(keys as (string | symbol)[]);
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !keySet.has(k))
  ) as Omit<T, K>;
}

```

How can we implement recursive deepPick and deepOmit functions that filter nested object structures?

Implementing recursive `deepPick` and `deepOmit` functions requires traversing nested structures (objects and arrays) while carefully preserving basic primitives, dates, null values, and arrays without corrupting or stripping them.

Here is how to implement both functions in modern, robust JavaScript, followed by TypeScript implementations and edge-case considerations.

---

## 1. Implementation in Vanilla JavaScript

### `deepPick`

`deepPick` recursively includes specified keys. If a nested property is an object, it traverses inside and continues filtering.

```javascript
/**
 * Recursively picks properties from an object or array based on an array of keys.
 * @param {*} val - The target object, array, or primitive.
 * @param {Array<string>} keys - Array of keys to pick.
 * @returns {*}
 */
function deepPick(val, keys) {
  // Return non-object / null primitives directly
  if (val === null || typeof val !== 'object' || val instanceof Date || val instanceof RegExp) {
    return val;
  }

  // Handle Arrays: preserve array structure and process items recursively
  if (Array.isArray(val)) {
    return val.map((item) => deepPick(item, keys));
  }

  const keySet = new Set(keys);
  const result = {};

  for (const [key, value] of Object.entries(val)) {
    if (keySet.has(key)) {
      result[key] = deepPick(value, keys);
    } else if (value && typeof value === 'object' && !(value instanceof Date || value instanceof RegExp)) {
      // Traverse nested objects to check if sub-keys match
      const nested = deepPick(value, keys);
      // Keep nested structure if it contains matched properties
      if (typeof nested === 'object' && nested !== null && Object.keys(nested).length > 0) {
        result[key] = nested;
      }
    }
  }

  return result;
}

```

### `deepOmit`

`deepOmit` recursively strips specified keys wherever they appear at any depth in the object hierarchy.

```javascript
/**
 * Recursively omits properties from an object or array based on an array of keys.
 * @param {*} val - The target object, array, or primitive.
 * @param {Array<string>} keys - Array of keys to omit.
 * @returns {*}
 */
function deepOmit(val, keys) {
  // Return non-object / null primitives directly
  if (val === null || typeof val !== 'object' || val instanceof Date || val instanceof RegExp) {
    return val;
  }

  // Handle Arrays: process each item recursively
  if (Array.isArray(val)) {
    return val.map((item) => deepOmit(item, keys));
  }

  const keySet = new Set(keys);
  const result = {};

  for (const [key, value] of Object.entries(val)) {
    if (!keySet.has(key)) {
      result[key] = deepOmit(value, keys);
    }
  }

  return result;
}

```

---

## 2. Usage Examples

```javascript
const user = {
  id: 101,
  passwordHash: "secret_123",
  profile: {
    name: "sudhir",
    passwordResetToken: "tok_abc",
    address: {
      city: "badlapur",
      zip: 421503,
      secretNote: "Leave at door"
    }
  },
  roles: ["admin", "editor"]
};

// --- Deep Omit Example ---
const safeUser = deepOmit(user, ["passwordHash", "passwordResetToken", "secretNote"]);
console.log(safeUser);
/*
Output:
{
  id: 101,
  profile: {
    name: 'sudhir',
    address: { city: 'badlapur', zip: 421503 }
  },
  roles: [ 'admin', 'editor' ]
}
*/

// --- Deep Pick Example ---
const addressDetails = deepPick(user, ["name", "city", "zip"]);
console.log(addressDetails);
/*
Output:
{
  profile: {
    name: 'sudhir',
    address: { city: 'badlapur', zip: 421503 }
  }
}
*/

```

---

## 3. Alternative Pattern: Path-Based Deep Selection (`"a.b.c"`)

In real-world applications, you often want to target specific path locations rather than stripping a key globally at every depth level (e.g., omitting `profile.address.zip` without omitting a top-level `zip`).

Here is how path-based filtering works using dot-notation:

```javascript
function omitByPath(obj, path) {
  const parts = Array.isArray(path) ? path : path.split('.');
  
  if (obj === null || typeof obj !== 'object') return obj;
  
  const [head, ...tail] = parts;

  if (parts.length === 1) {
    const { [head]: _, ...rest } = obj;
    return rest;
  }

  if (!(head in obj)) return obj;

  return {
    ...obj,
    [head]: omitByPath(obj[head], tail)
  };
}

const data = { a: { b: { c: 1, d: 2 } } };
console.log(omitByPath(data, "a.b.c")); 
// Output: { a: { b: { d: 2 } } }

```

---

## 4. Key Implementation Nuances & Edge Cases

| Challenge               | Cause                                                                                                                 | Solution                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **`null` Check Hazard** | `typeof null === 'object'` in JavaScript.                                                                             | Always explicitly guard with `if (val === null)` before handling as an object.               |
| **Built-in Objects**    | Objects like `Date`, `RegExp`, or `Map` are typeof `'object'` but shouldn't be iterated over as plain key-value maps. | Guard with `instanceof Date` or `instanceof RegExp` to return them as leaf values.           |
| **Array Preservation**  | `Object.entries([10, 20])` yields `[['0', 10], ['1', 20]]`. Plain iteration turns arrays into numeric key objects.    | Check `Array.isArray(val)` separately and use `.map()` to preserve array structure.          |
| **Circular References** | Objects pointing to themselves (e.g., `a.self = a`) cause infinite stack recursion calls.                             | Use a `WeakSet` to track visited objects if processing arbitrary user-supplied graph inputs. |
