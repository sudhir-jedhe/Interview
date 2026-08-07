To check for a given key or value, including in nested objects, we need to create a more recursive approach. In the case of **nested keys**, we would need to traverse the object and check if the key exists at any level within the nested structure.

Here are the updated functions that account for nested keys or values:

### 1. **Check if an Object has a Given Value (Including Nested Objects)**

To check for a value in an object, including its nested objects, we can recursively check if the value is in the current object or any of its sub-objects.

```js
// Recursive function to check if a value exists in an object, including nested ones
const hasValueDeep = (obj, value) => {
  return Object.values(obj).some(val => 
    val === value || (typeof val === 'object' && val !== null && hasValueDeep(val, value))
  );
};

const obj = { 
  a: 100, 
  b: 200, 
  c: { d: 300, e: { f: 400 } }
};

console.log(hasValueDeep(obj, 100));  // true
console.log(hasValueDeep(obj, 400));  // true (nested value)
console.log(hasValueDeep(obj, 999));  // false
```

### Explanation

- **`Object.values(obj)`**: This retrieves all values of the object.
- **`.some()`**: This method checks if any of the values is the target value.
- **Recursive Check**: If the value is an object, we call `hasValueDeep` recursively to check if the value exists within that object.

### 2. **Check if an Object has a Given Key (Including Nested Keys)**

Similarly, to check if a key exists at any level in a nested object, we can recursively search through the object’s keys.

```js
// Recursive function to check if a key exists in an object, including nested ones
const hasKeyDeep = (obj, key) => {
  return Object.keys(obj).some(k => 
    k === key || (typeof obj[k] === 'object' && obj[k] !== null && hasKeyDeep(obj[k], key))
  );
};

const obj = { 
  a: 100, 
  b: 200, 
  c: { d: 300, e: { f: 400 } }
};

console.log(hasKeyDeep(obj, 'a'));  // true
console.log(hasKeyDeep(obj, 'e'));  // true (nested key)
console.log(hasKeyDeep(obj, 'z'));  // false
```

### Explanation

- **`Object.keys(obj)`**: This retrieves all keys of the object.
- **`.some()`**: This checks if any of the keys match the target key.
- **Recursive Check**: If a key points to an object, we recursively call `hasKeyDeep` to search within that object.

### Example Usage

Let's put everything together and test both `hasValueDeep` and `hasKeyDeep` with a complex object:

```js
const obj = { 
  a: 100, 
  b: { x: 50, y: 60 }, 
  c: { 
    d: 200, 
    e: { 
      f: 300, 
      g: 400 
    }
  }
};

console.log(hasValueDeep(obj, 100)); // true (top level)
console.log(hasValueDeep(obj, 400)); // true (nested value)
console.log(hasValueDeep(obj, 999)); // false (value doesn't exist)

console.log(hasKeyDeep(obj, 'a'));   // true (top level)
console.log(hasKeyDeep(obj, 'g'));   // true (nested key)
console.log(hasKeyDeep(obj, 'z'));   // false (key doesn't exist)
```

### Summary

- **`hasValueDeep`**: Recursively checks if a value exists anywhere in the object, including within nested objects.
- **`hasKeyDeep`**: Recursively checks if a key exists anywhere in the object, including within nested objects.

Both of these functions will help you navigate deeply nested structures and check for keys or values efficiently.

Both implementations are clean, idiomatic, and correctly handle deep search using recursion alongside `Array.prototype.some()`.

There are a few edge cases and optimizations worth keeping in mind when using these pattern in production environments:

### Edge Cases & Pitfalls

1. **Circular References Cause Call-Stack Overflow**
If an object references itself, both functions will cause an infinite loop and throw a `RangeError: Maximum call stack size exceeded`.

```javascript
const circularObj = { a: 1 };
circularObj.self = circularObj;

hasKeyDeep(circularObj, 'a'); // RangeError!

```

*Fix:* Pass a `WeakSet` (or `Set`) through recursive calls to track visited objects.
2. **Arrays are Treated as Objects**
In JavaScript, `typeof [] === 'object'`. Your current logic will traverse arrays, treating array indices (`'0'`, `'1'`) as keys for `hasKeyDeep`.

- For `hasValueDeep`, this is usually desirable (searching values inside arrays).
- For `hasKeyDeep`, searching for key `'0'` might return `true` if an array exists anywhere in the object tree.

1. **Value Comparison (`===`)**
Strict equality (`===`) works well for primitives, but fails for `NaN` (since `NaN === NaN` is `false`) or object/array references unless exact reference matches are passed. Consider using `Object.is(val, value)` if `NaN` checks are needed.

---

### Hardened Implementations (Production-Ready)

If you need protection against circular structures and non-object inputs, here is how you can safeguard both functions:

```javascript
// Safely search values with circular reference handling
const hasValueDeep = (obj, value, visited = new WeakSet()) => {
  if (obj === null || typeof obj !== 'object') return false;
  if (visited.has(obj)) return false; // Prevent infinite loops
  visited.add(obj);

  return Object.values(obj).some(val => 
    Object.is(val, value) || (typeof val === 'object' && val !== null && hasValueDeep(val, value, visited))
  );
};

// Safely search keys with circular reference handling
const hasKeyDeep = (obj, targetKey, visited = new WeakSet()) => {
  if (obj === null || typeof obj !== 'object') return false;
  if (visited.has(obj)) return false; // Prevent infinite loops
  visited.add(obj);

  return Object.keys(obj).some(k => 
    k === targetKey || (typeof obj[k] === 'object' && obj[k] !== null && hasKeyDeep(obj[k], targetKey, visited))
  );
};

```

How can I modify these recursive functions to return the key path (e.g., 'c.e.f') instead of just a boolean?

To return the key path (like `'c.e.f'`), you need to build up the path string during recursion and return the accumulated string when a match is found instead of a boolean.

### 1. **Find Path to a Key (`findKeyPath`)**

When searching for a key, track the current path by appending the current key `k` to the parent path.

```js
const findKeyPath = (obj, targetKey, currentPath = '', visited = new WeakSet()) => {
  if (obj === null || typeof obj !== 'object') return null;
  if (visited.has(obj)) return null;
  visited.add(obj);

  for (const k of Object.keys(obj)) {
    const newPath = currentPath ? `${currentPath}.${k}` : k;

    // Found the key
    if (k === targetKey) {
      return newPath;
    }

    // Traverse sub-objects
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      const result = findKeyPath(obj[k], targetKey, newPath, visited);
      if (result) return result;
    }
  }

  return null; // Not found
};

const obj = { 
  a: 100, 
  b: { x: 50, y: 60 }, 
  c: { 
    d: 200, 
    e: { f: 300, g: 400 } 
  }
};

console.log(findKeyPath(obj, 'f')); // "c.e.f"
console.log(findKeyPath(obj, 'x')); // "b.x"
console.log(findKeyPath(obj, 'z')); // null

```

---

### 2. **Find Path to a Value (`findValuePath`)**

When searching for a value, check if the current property's value matches `targetValue`. If not, recurse into sub-objects.

```js
const findValuePath = (obj, targetValue, currentPath = '', visited = new WeakSet()) => {
  if (obj === null || typeof obj !== 'object') return null;
  if (visited.has(obj)) return null;
  visited.add(obj);

  for (const k of Object.keys(obj)) {
    const val = obj[k];
    const newPath = currentPath ? `${currentPath}.${k}` : k;

    // Found the value
    if (Object.is(val, targetValue)) {
      return newPath;
    }

    // Traverse sub-objects
    if (typeof val === 'object' && val !== null) {
      const result = findValuePath(val, targetValue, newPath, visited);
      if (result) return result;
    }
  }

  return null; // Not found
};

console.log(findValuePath(obj, 300)); // "c.e.f"
console.log(findValuePath(obj, 50));  // "b.x"
console.log(findValuePath(obj, 999)); // null

```

---

### Key Adjustments Made

1. **`for...of` Loop instead of `.some()**`: `.some()` only returns `true` or `false`. Switching to a loop allows returning the path string immediately when a branch produces a result.
2. **Path Accumulation**: `currentPath ?`${currentPath}.${k}`: k` ensures top-level keys don't start with a leading dot.
3. **`null` Fallback**: If a key or value doesn't exist anywhere in the object, the function cleanly returns `null`.

How can I modify findKeyPath and findValuePath to return an array of all matching paths if duplicates exist?

To modify `findKeyPath` and `findValuePath` so they return **all** matching paths rather than stopping at the first match, you need to:

1. **Remove early returns** when a match is found.
2. **Collect paths** in an array and pass that array through your recursive calls (or aggregate results returned from recursive calls).
3. **Continue traversing** the rest of the object/array structure even after finding a match.

Here is a clean implementation using standard JavaScript recursive helpers that return an array of path arrays (or array of formatted string paths).

---

### 1. `findKeyPath` (Returns Array of Paths)

```javascript
function findKeyPaths(obj, targetKey, currentPath = []) {
  let results = [];

  if (obj === null || typeof obj !== 'object') {
    return results;
  }

  // Handle Arrays
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      results.push(...findKeyPaths(obj[i], targetKey, [...currentPath, i]));
    }
    return results;
  }

  // Handle Objects
  for (const [key, value] of Object.entries(obj)) {
    const newPath = [...currentPath, key];

    // If key matches, record this path
    if (key === targetKey) {
      results.push(newPath);
    }

    // Continue searching inside child objects/arrays
    if (typeof value === 'object' && value !== null) {
      results.push(...findKeyPaths(value, targetKey, newPath));
    }
  }

  return results;
}

```

---

### 2. `findValuePath` (Returns Array of Paths)

```javascript
function findValuePaths(obj, targetValue, currentPath = []) {
  let results = [];

  if (obj === null || typeof obj !== 'object') {
    return results;
  }

  for (const [key, value] of Object.entries(obj)) {
    // Determine path segment depending on whether container is Array or Object
    const pathSegment = Array.isArray(obj) ? Number(key) : key;
    const newPath = [...currentPath, pathSegment];

    // Direct value match
    if (value === targetValue) {
      results.push(newPath);
    } 
    // Recurse into nested objects/arrays
    else if (typeof value === 'object' && value !== null) {
      results.push(...findValuePaths(value, targetValue, newPath));
    }
  }

  return results;
}

```

---

### Example Usage

```javascript
const data = {
  id: 1,
  name: "item",
  id: 2, // Duplicate key handling in JS objects overrides early keys, but nested duplicates work:
  nested: {
    id: 3,
    status: "active",
    list: [
      { id: 4, status: "active" },
      { name: "sub-item", status: "inactive" }
    ]
  }
};

// 1. Finding all paths for key 'id'
console.log(findKeyPaths(data, "id"));
// Output:
// [
//   ["id"],
//   ["nested", "id"],
//   ["nested", "list", 0, "id"]
// ]

// 2. Finding all paths for value 'active'
console.log(findValuePaths(data, "active"));
// Output:
// [
//   ["nested", "status"],
//   ["nested", "list", 0, "status"]
// ]

```

---

### Key Adjustments Made

- **Result Aggregation:** Instead of `return currentPath`, results are gathered with `results.push(...)` and returned at the end of the function scope.
- **Array Flattening (`...` spread operator):** Spreading recursive calls (`results.push(...findPaths(...))`) flattens nested arrays so you get a clean 2D array of paths (`[['a', 'b'], ['a', 'c']]`).
- **Dot Notation Formatting (Optional):** If you prefer formatted string paths like `"nested.list[0].id"` instead of path arrays (`["nested", "list", 0, "id"]`), you can map the final result:

```javascript
const paths = findValuePaths(data, "active");
const formatted = paths.map(p => p.reduce((acc, k) => 
  typeof k === 'number' ? `${acc}[${k}]` : acc ? `${acc}.${k}` : k, ""
));
// Returns: ["nested.status", "nested.list[0].status"]

```

How can I write a helper function getByPath(obj, 'c.e.f') that uses a path string to retrieve the actual value from an object?

You can implement `getByPath` using `String.prototype.split()` to turn the path string into an array of keys, and `Array.prototype.reduce()` to iteratively walk down the object.

Here is the helper function along with handling for missing keys, array indices, and custom fallback values:

```javascript
function getByPath(obj, path, defaultValue = undefined) {
  if (obj === null || typeof obj !== 'object' || !path) {
    return defaultValue;
  }

  // Normalize array notation like 'c.e[0].f' to 'c.e.0.f' and split by dot
  const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');

  const result = keys.reduce((current, key) => {
    if (current !== null && typeof current === 'object' && key in current) {
      return current[key];
    }
    return undefined;
  }, obj);

  return result !== undefined ? result : defaultValue;
}

```

---

### Example Usage

```javascript
const data = {
  a: 1,
  c: {
    e: {
      f: "Hello World",
      list: [{ name: "Item 1" }, { name: "Item 2" }]
    }
  }
};

// Basic nested lookup
console.log(getByPath(data, 'c.e.f')); 
// Output: "Hello World"

// Path with array indexing
console.log(getByPath(data, 'c.e.list[1].name')); 
// Output: "Item 2"

// Non-existent path returns default value
console.log(getByPath(data, 'c.x.y', 'Not Found')); 
// Output: "Not Found"

```

---

### Key Features

- **Array Syntax Support:** The regex `.replace(/\[(\d+)\]/g, '.$1')` automatically handles array paths like `'a.b[0].c'`, converting them to `'a.b.0.c'`.
- **Safe Property Checks:** Using `key in current` prevents runtime errors (`TypeError: Cannot read properties of undefined`) if a segment of the path does not exist.
- **Default Value Support:** Accepts an optional third argument that acts as a fallback if the path resolves to `undefined`.
