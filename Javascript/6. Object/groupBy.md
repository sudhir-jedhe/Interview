Here is a complete, production-ready implementation of a custom `groupBy` utility function in JavaScript and TypeScript, supporting both **property keys** and **custom callback functions** (similar to Lodash's `_.groupBy` or `Object.groupBy`).

---

### JavaScript Implementation

```javascript
/**
 * Groups the elements of an array based on a given key or callback function.
 *
 * @param {Array} collection - The array to iterate over.
 * @param {Function|string|number} iteratee - The key or function transforming elements to keys.
 * @returns {Object} Returns the composed aggregate object.
 */
function groupBy(collection, iteratee) {
  // Edge case: Handle invalid input gracefully
  if (!Array.isArray(collection) || collection.length === 0) {
    return {};
  }

  // Determine how to resolve the grouping key
  const getKey = typeof iteratee === 'function' 
    ? iteratee 
    : (item) => item?.[iteratee];

  return collection.reduce((result, item) => {
    // Resolve the key for the current item
    const key = getKey(item);

    // Ensure array exists for the given key, then push the item
    if (!Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] = [];
    }
    result[key].push(item);

    return result;
  }, {});
}

```

---

### TypeScript Implementation (Type-Safe)

```typescript
type KeySelector<T, K extends PropertyKey> = (item: T) => K;

/**
 * Type-safe groupBy implementation supporting selector functions or key strings.
 */
function groupBy<T, K extends PropertyKey>(
  collection: T[],
  iteratee: KeySelector<T, K> | keyof T
): Record<K, T[]> {
  if (!Array.isArray(collection) || collection.length === 0) {
    return {} as Record<K, T[]>;
  }

  const getKey: KeySelector<T, K> = 
    typeof iteratee === 'function'
      ? iteratee
      : (item: T) => item[iteratee] as unknown as K;

  return collection.reduce((acc, item) => {
    const key = getKey(item);

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);

    return acc;
  }, {} as Record<K, T[]>);
}

```

---

### Usage Examples

#### 1. Grouping by Callback Function (e.g., `Math.floor`)

```javascript
const numbers = [6.1, 4.2, 6.3, 4.8];
console.log(groupBy(numbers, Math.floor));
// Output:
// {
//   '4': [4.2, 4.8],
//   '6': [6.1, 6.3]
// }

```

#### 2. Grouping by Object Property String

```javascript
const users = [
  { name: 'Alice', role: 'admin' },
  { name: 'Bob', role: 'user' },
  { name: 'Charlie', role: 'admin' },
  { name: 'David', role: 'user' }
];

console.log(groupBy(users, 'role'));
// Output:
// {
//   admin: [
//     { name: 'Alice', role: 'admin' },
//     { name: 'Charlie', role: 'admin' }
//   ],
//   user: [
//     { name: 'Bob', role: 'user' },
//     { name: 'David', role: 'user' }
//   ]
// }

```

#### 3. Dynamic Property Computation (e.g., length or condition)

```javascript
const words = ['one', 'two', 'three', 'four', 'five'];

console.log(groupBy(words, 'length'));
// Output:
// {
//   '3': ['one', 'two'],
//   '5': ['three'],
//   '4': ['four', 'five']
// }

```

---

### Native JavaScript Note (`Object.groupBy`)

If you are targeting modern JavaScript runtimes, ECMAScript includes the native **`Object.groupBy()`** static method:

```javascript
const inventory = [
  { name: "asparagus", type: "vegetables", quantity: 5 },
  { name: "bananas", type: "fruit", quantity: 0 },
  { name: "goat", type: "meat", quantity: 23 },
];

const result = Object.groupBy(inventory, ({ type }) => type);

```

This is a clean, production-grade custom implementation of `groupBy`. Supporting both property keys and selector functions gives it the same ergonomic feel as Lodash's `_.groupBy`, and pointing out native `Object.groupBy` rounds out modern runtime options nicely.

To ensure this utility is bulletproof in production, there are **three subtle technical nuances** worth considering:

---

### 1. The `Object.prototype` Key Collision Bug

In your JS implementation, you used `Object.prototype.hasOwnProperty.call(result, key)` to safely check for keys. However, if the returned `key` happens to be a built-in `Object.prototype` property name like `"toString"`, `"valueOf"`, or `"constructor"`, plain objects can exhibit unexpected behavior or inherited property interference.

Using `Object.create(null)` as the initial accumulator dictionary completely eliminates prototype inheritance:

```javascript
// Creates a clean dictionary without inherited Object.prototype keys
return collection.reduce((result, item) => {
  const key = getKey(item);
  if (!result[key]) {
    result[key] = [];
  }
  result[key].push(item);
  return result;
}, Object.create(null));

```

---

### 2. Native `Object.groupBy()` vs. `Map.groupBy()`

While `Object.groupBy()` is widely supported across modern JavaScript runtimes, it forces all keys to be converted to **Strings or Symbols** (just like plain JavaScript object keys):

```javascript
const objKey = { id: 1 };
const items = [{ meta: objKey, val: "A" }];

// Object.groupBy coerces objKey to "[object Object]" string:
Object.groupBy(items, item => item.meta); 
// Output: { "[object Object]": [...] }

```

If you need to group items using **complex object references, numbers without string coercion, or Booleans as keys**, ECMAScript also provides **`Map.groupBy()`**:

```javascript
// Preserves exact key identities (including Objects/Maps as keys)
const mapResult = Map.groupBy(items, item => item.meta);
console.log(mapResult.get(objKey)); // [{ meta: { id: 1 }, val: "A" }]

```

---

### 3. TypeScript Type Definition Enhancement

In the TypeScript snippet:

```typescript
iteratee: KeySelector<T, K> | keyof T

```

If `iteratee` is passed as a string property name (e.g., `'role'`), the TypeScript compiler won't automatically narrow `K` to the return type of that property (`T[keyof T]`).

Using function overloading provides complete, strict type inference for both string keys and selector callbacks:

```typescript
// Overload 1: Property Key string
function groupBy<T, K extends keyof T>(
  collection: T[],
  iteratee: K
): Record<T[K] & PropertyKey, T[]>;

// Overload 2: Callback function
function groupBy<T, K extends PropertyKey>(
  collection: T[],
  iteratee: (item: T) => K
): Record<K, T[]>;

// Implementation
function groupBy<T>(
  collection: T[],
  iteratee: any
): Record<PropertyKey, T[]> {
  if (!Array.isArray(collection) || collection.length === 0) {
    return Object.create(null);
  }

  const getKey = typeof iteratee === 'function'
    ? iteratee
    : (item: T) => item[iteratee as keyof T];

  return collection.reduce((acc, item) => {
    const key = getKey(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, Object.create(null));
}

```

---

### Summary Checklist for Array Grouping

| Method                 | Key Types Allowed                         | Output Data Structure     | Runtime Support                     |
| ---------------------- | ----------------------------------------- | ------------------------- | ----------------------------------- |
| **Custom `groupBy**`   | Strings, Numbers, Symbols                 | Plain Object (`{}`)       | All JS environments                 |
| **`Object.groupBy()`** | Strings, Symbols (coerced)                | Plain Object (`{}`)       | ES2024 / Modern Browsers & Node 21+ |
| **`Map.groupBy()`**    | Any Type (Objects, Functions, Primitives) | JavaScript `Map` instance | ES2024 / Modern Browsers & Node 21+ |
