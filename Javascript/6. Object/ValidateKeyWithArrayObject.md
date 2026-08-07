The code you've provided efficiently validates the keys of JavaScript objects in various ways. I'll walk through each function and explain how it works in detail, as well as how you can use it in different situations.

### **1. Validate if all keys in the object are present in the specified array**

This function checks if all keys in the object exist in the provided array of keys.

```javascript
const keysAreValid = (obj, keys) =>
  Object.keys(obj).every(key => keys.includes(key));
```

- **Explanation**:
  - `Object.keys(obj)` gets the array of keys from the object `obj`.
  - `.every()` iterates over each key of the object and checks if the key is present in the `keys` array using `.includes()`.
  - The function returns `true` if every key of the object is included in the `keys` array, otherwise `false`.

**Example Usage**:

```javascript
const obj = { id: 1, name: 'apple', price: 1.2 };
const keys = ['id', 'name', 'price'];

console.log(keysAreValid(obj, keys)); // true
console.log(keysAreValid(obj, [...keys, 'quantity'])); // true
```

---

### **2. Validate if all keys in the specified array are present in the object**

This function checks if all keys in the provided array are present in the object.

```javascript
const allKeysArePresent = (obj, keys) => {
  const objKeys = Object.keys(obj);
  return keys.every(key => objKeys.includes(key));
};
```

- **Explanation**:
  - `Object.keys(obj)` gets the array of keys from the object `obj`.
  - `.every()` iterates over the `keys` array and checks if each key is included in `objKeys` using `.includes()`.
  - The function returns `true` if all keys in the array are present in the object, otherwise `false`.

**Example Usage**:

```javascript
const obj = { id: 1, name: 'apple', price: 1.2 };
const keys = ['id', 'name', 'price'];

console.log(allKeysArePresent(obj, keys)); // true
console.log(allKeysArePresent(obj, [...keys, 'quantity'])); // false
```

---

### **3. Validate if the keys of an object exactly match the specified array**

This function checks if the object's keys **exactly match** the provided array of keys (i.e., the object should have **only** the keys in the array, and no more).

```javascript
const keysMatch = (obj, keys) =>
  keysAreValid(obj, keys) && allKeysArePresent(obj, keys);
```

- **Explanation**:
  - It uses the previous two functions to validate both:
    1. **All object keys are in the specified array** (`keysAreValid`).
    2. **All keys in the specified array are present in the object** (`allKeysArePresent`).
  - The object will only match if both conditions are `true`.

**Example Usage**:

```javascript
const obj = { id: 1, name: 'apple', price: 1.2 };
const keys = ['id', 'name', 'price'];

console.log(keysMatch(obj, keys)); // true
console.log(keysMatch(obj, [...keys, 'quantity'])); // false
```

---

### **4. Validate against another object**

Now, the logic is extended to compare the keys of one object with another. You might want to check:

- If all keys in the target object are in the source object.
- If all keys in the source object are in the target object.
- If both objects have the exact same keys.

### **4.1. All keys in the target object are present in the source object**

```javascript
const objectKeysAreValid = (obj, source) =>
  keysAreValid(obj, Object.keys(source));
```

- **Explanation**:
  - It checks if all keys in the `obj` are present in the source object.
  - `Object.keys(source)` gets the keys of the source object.
  - It then uses `keysAreValid` to check if all these keys are in `obj`.

**Example Usage**:

```javascript
const target = { id: 1, name: 'apple', price: 1.2 };
const source = { id: 1, name: 'apple', price: 1.2 };

console.log(objectKeysAreValid(target, source)); // true
console.log(objectKeysAreValid(target, { ...source, quantity: 10 })); // true
```

### **4.2. All keys in the source object are present in the target object**

```javascript
const objectKeysArePresent = (obj, source) =>
  allKeysArePresent(obj, Object.keys(source));
```

- **Explanation**:
  - It checks if all keys in the `source` object are present in the target object.
  - `Object.keys(source)` gets the keys from the source object.
  - It then uses `allKeysArePresent` to check if those keys are in the target object.

**Example Usage**:

```javascript
console.log(objectKeysArePresent(target, source)); // true
console.log(objectKeysArePresent(target, { ...source, quantity: 10 })); // false
```

### **4.3. Check if the keys of the target object match the source object**

```javascript
const objectKeysMatch = (obj, source) =>
  keysMatch(obj, Object.keys(source));
```

- **Explanation**:
  - This function ensures that the keys in the target object **exactly match** the keys of the source object.
  - It uses the `keysMatch` function with `Object.keys(source)`.

**Example Usage**:

```javascript
console.log(objectKeysMatch(target, source)); // true
console.log(objectKeysMatch(target, { ...source, quantity: 10 })); // false
```

---

### **Summary of Functions**

1. **`keysAreValid(obj, keys)`**: Checks if all object keys are present in the provided array of keys.
2. **`allKeysArePresent(obj, keys)`**: Checks if all keys in the provided array are present in the object.
3. **`keysMatch(obj, keys)`**: Checks if the object has exactly the same keys as in the provided array (no extra or missing keys).
4. **`objectKeysAreValid(obj, source)`**: Checks if all keys in the target object are in the source object.
5. **`objectKeysArePresent(obj, source)`**: Checks if all keys in the source object are present in the target object.
6. **`objectKeysMatch(obj, source)`**: Checks if the keys of the target object match exactly the keys of the source object.

These functions help ensure that the keys of objects conform to expected patterns, whether you are comparing objects, validating configurations, or ensuring consistency in key usage.

Your breakdown is clear, well-structured, and easy to follow.

While the implementation works well for small objects and small arrays, there are key performance bottlenecks and modern JavaScript features (`Set`, `Object.hasOwn`) that can optimize these functions from **$O(N \times M)$ linear search complexity down to $O(N)$ linear time**, while reducing memory allocations.

---

### Key Optimizations & Edge Cases

#### 1. `Object.hasOwn()` instead of `Object.keys().includes()`

Using `Object.keys(obj).includes(key)` creates an intermediate array of keys and runs an $O(N)$ search for every iteration. `Object.hasOwn(obj, key)` (or `key in obj` / `obj.hasOwnProperty(key)`) performs an $O(1)$ lookup directly on the object.

```javascript
// Optimized: O(M) time, O(1) space complexity
const allKeysArePresent = (obj, keys) =>
  keys.every(key => Object.hasOwn(obj, key));

```

#### 2. `Set` for Array Lookups

In `keysAreValid`, checking `keys.includes(key)` inside `.every()` takes $O(M)$ time for each key, leading to $O(N \times M)$ overall. Wrapping `keys` in a `Set` brings lookups to $O(1)$, making the total check $O(N + M)$.

```javascript
// Optimized: O(N + M) time
const keysAreValid = (obj, keys) => {
  const validSet = new Set(keys);
  return Object.keys(obj).every(key => validSet.has(key));
};

```

#### 3. Quick Length Check for Exact Match (`keysMatch`)

Before checking every key individually in `keysMatch`, you can perform a fast fail by checking size/length first. Note that if the `keys` array contains duplicate strings, you should compare against a `Set`:

```javascript
// Optimized: Fails fast in O(1) if lengths don't match
const keysMatch = (obj, keys) => {
  const objKeys = Object.keys(obj);
  const uniqueKeys = new Set(keys);
  if (objKeys.length !== uniqueKeys.size) return false;
  return objKeys.every(key => uniqueKeys.has(key));
};

```

---

### Refactored Helper Library

Here is the updated set of functions incorporating $O(1)$ set lookups, fast-path length checks, and native `Object.hasOwn`:

```javascript
// 1. Checks if all keys in 'obj' are present in the 'allowedKeys' array
const keysAreValid = (obj, allowedKeys) => {
  const allowedSet = new Set(allowedKeys);
  return Object.keys(obj).every(key => allowedSet.has(key));
};

// 2. Checks if all keys in 'requiredKeys' exist in 'obj'
const allKeysArePresent = (obj, requiredKeys) =>
  requiredKeys.every(key => Object.hasOwn(obj, key));

// 3. Checks if object keys match the array exactly (no extra, no missing)
const keysMatch = (obj, expectedKeys) => {
  const objKeys = Object.keys(obj);
  const expectedSet = new Set(expectedKeys);
  return (
    objKeys.length === expectedSet.size &&
    objKeys.every(key => expectedSet.has(key))
  );
};

// 4. Object-to-Object comparisons
const objectKeysAreValid = (target, source) =>
  keysAreValid(target, Object.keys(source));

const objectKeysArePresent = (target, source) =>
  allKeysArePresent(target, Object.keys(source));

const objectKeysMatch = (target, source) =>
  keysMatch(target, Object.keys(source));

```

How can I adapt these key validation functions to support deeply nested objects recursively?

To validate keys in deeply nested objects recursively, you need to traverse the target object tree alongside the reference structure (either a nested key schema or a source object) and handle nested objects, arrays, and primitive values at every level.

Here are two distinct recursive patterns: validating against a **nested key schema/structure**, and validating directly against **another nested source object**.

---

### 1. Validating Against a Nested Key Schema

When validating against an array/schema structure, nested keys are represented as nested objects or arrays.

```javascript
// Checks if target has exact matching keys at every nesting level
const nestedKeysMatch = (target, schema) => {
  // Primitives or non-objects at this node match immediately
  if (
    typeof target !== 'object' ||
    target === null ||
    typeof schema !== 'object' ||
    schema === null
  ) {
    return typeof target === typeof schema;
  }

  // Handle Arrays
  if (Array.isArray(target) || Array.isArray(schema)) {
    if (!Array.isArray(target) || !Array.isArray(schema)) return false;
    if (target.length !== schema.length) return false;
    return target.every((item, idx) => nestedKeysMatch(item, schema[idx]));
  }

  const targetKeys = Object.keys(target);
  const schemaKeys = Object.keys(schema);

  // Fast length check
  if (targetKeys.length !== schemaKeys.length) return false;

  const schemaKeySet = new Set(schemaKeys);

  // Check key existence and recurse into child objects
  return targetKeys.every(
    key => schemaKeySet.has(key) && nestedKeysMatch(target[key], schema[key])
  );
};

```

#### Example Usage

```javascript
const schema = {
  user: {
    id: 1,
    profile: {
      name: '',
      email: ''
    }
  },
  roles: ['admin']
};

const validObject = {
  user: {
    id: 101,
    profile: {
      name: 'Alice',
      email: 'alice@example.com'
    }
  },
  roles: ['editor']
};

const invalidObject = {
  user: {
    id: 102,
    profile: {
      name: 'Bob'
      // Missing 'email'
    }
  },
  roles: ['viewer']
};

console.log(nestedKeysMatch(validObject, schema));  // true
console.log(nestedKeysMatch(invalidObject, schema)); // false

```

---

### 2. Validating Nested Object vs. Source Object

If you are comparing two JavaScript objects directly (e.g., verifying `target` has a subset, superset, or exact match of `source`'s keys recursively):

```javascript
// 1. Recursive Keys Are Valid (No extra keys in target at any level)
const recursiveKeysAreValid = (target, source) => {
  if (
    typeof target !== 'object' || target === null ||
    typeof source !== 'object' || source === null
  ) {
    return true;
  }

  const sourceKeySet = new Set(Object.keys(source));
  
  return Object.keys(target).every(key => {
    if (!sourceKeySet.has(key)) return false;
    return recursiveKeysAreValid(target[key], source[key]);
  });
};

// 2. Recursive All Keys Present (No missing required keys in target at any level)
const recursiveKeysArePresent = (target, source) => {
  if (
    typeof source !== 'object' || source === null
  ) {
    return true;
  }
  if (typeof target !== 'object' || target === null) return false;

  return Object.keys(source).every(key => {
    if (!Object.hasOwn(target, key)) return false;
    return recursiveKeysArePresent(target[key], source[key]);
  });
};

// 3. Recursive Exact Match (Keys match at all levels)
const recursiveObjectKeysMatch = (target, source) =>
  recursiveKeysAreValid(target, source) && recursiveKeysArePresent(target, source);

```

---

### Key Edge Cases to Keep in Mind

1. **`null` Check**: In JavaScript, `typeof null === 'object'`. Always check `val !== null` before calling `Object.keys()`.
2. **Arrays vs. Objects**: `typeof [] === 'object'`. If your objects contain arrays, explicitly use `Array.isArray()` to prevent treat numerical array indexes as object keys unless that is desired.
3. **Circular References**: If target objects reference themselves, unbounded recursion will cause a `RangeError: Maximum call stack size exceeded`. You can pass a `WeakSet` of seen objects to break cycles if processing un-sanitized user input.

How can I add circular reference detection using WeakSet to prevent call stack overflow errors?

To detect circular references, track objects as you traverse down a branch using a `WeakSet`. If an object is encountered that already exists in the `WeakSet`, a cycle is detected and recursion halts immediately.

Using a `WeakSet` is ideal because it holds **weak references** to objects—preventing memory leaks and eliminating the need to manually clear items when stepping out of a call stack.

---

### Implementation with `WeakSet`

To accurately track circular references per branch, pass a new or cloned `WeakSet` into each child recursive call:

```javascript
const recursiveKeysAreValid = (target, source, seen = new WeakSet()) => {
  // 1. Primitive or null values don't have object keys
  if (
    typeof target !== 'object' || target === null ||
    typeof source !== 'object' || source === null
  ) {
    return true;
  }

  // 2. Circular reference check
  if (seen.has(target) || seen.has(source)) {
    // Cycle detected! Return false (or true depending on handling preference)
    return false;
  }

  // Mark current nodes as visited for this recursion branch
  seen.add(target);
  seen.add(source);

  const sourceKeySet = new Set(Object.keys(source));

  return Object.keys(target).every(key => {
    if (!sourceKeySet.has(key)) return false;
    
    // Pass a cloned WeakSet (or isolated branch tracker) down the call chain
    return recursiveKeysAreValid(target[key], source[key], new WeakSet(seen));
  });
};

```

---

### Alternative: Tracking Visited Nodes with standard `Set`

Since `WeakSet` cannot be cloned directly (it is not iterable in JavaScript), an alternative pattern using a standard `Set` allows manual tracking and cleanup via **backtracking** (`seen.add()` before recursing, `seen.delete()` after):

```javascript
const safeRecursiveKeysMatch = (
  target,
  source,
  seenTarget = new Set(),
  seenSource = new Set()
) => {
  // Base checks
  if (typeof target !== 'object' || target === null || typeof source !== 'object' || source === null) {
    return typeof target === typeof source;
  }

  // Handle arrays vs standard objects
  if (Array.isArray(target) !== Array.isArray(source)) return false;

  // Cycle Detection Check
  if (seenTarget.has(target) || seenSource.has(source)) {
    // If both refer back to known cycles, fail gracefully rather than crashing
    return false;
  }

  // Add to visited stack
  seenTarget.add(target);
  seenSource.add(source);

  const targetKeys = Object.keys(target);
  const sourceKeys = Object.keys(source);

  if (targetKeys.length !== sourceKeys.length) {
    // Clean up before returning
    seenTarget.delete(target);
    seenSource.delete(source);
    return false;
  }

  const sourceKeySet = new Set(sourceKeys);

  const result = targetKeys.every(key => {
    if (!sourceKeySet.has(key)) return false;
    return safeRecursiveKeysMatch(target[key], source[key], seenTarget, seenSource);
  });

  // Backtrack: remove nodes when leaving this branch of the tree
  seenTarget.delete(target);
  seenSource.delete(source);

  return result;
};

```

---

### Example Test Case

```javascript
// Setup circular reference objects
const objA = { name: 'Alice', details: { age: 30 } };
objA.details.self = objA; // Creates cycle

const objB = { name: 'Alice', details: { age: 30 } };
objB.details.self = objB; // Creates cycle

// Before: Uncaught RangeError: Maximum call stack size exceeded
// After: Safe failure / handling
console.log(safeRecursiveKeysMatch(objA, objB)); // false

```

How can I modify these recursive validation functions to return exact missing or unexpected key paths (e.g., 'user.profile.email') when validation fails?

To return exact key paths (like `user.profile.email`), you can pass a `path` parameter (an array of string keys) through the recursive call stack. Instead of returning a plain boolean `true`/`false`, return a structured result object containing `valid: boolean` and an array of `errors`.

This approach gives you complete visibility into **missing keys**, **unexpected keys**, and **type mismatches**.

---

### Implementation with Detailed Error Reporting

```javascript
/**
 * Recursively validates object keys and returns detailed failure paths.
 * 
 * @param {Object} target - The object to validate.
 * @param {Object} schema - The reference schema or source object.
 * @param {Array<string>} path - Internal path tracker for nested errors.
 * @param {Set<Object>} seen - Internal tracker for circular reference safety.
 * @returns {{ valid: boolean, errors: Array<{ path: string, message: string, type: string }> }}
 */
const validateKeysWithPaths = (target, schema, path = [], seen = new Set()) => {
  const errors = [];
  const currentPathStr = path.length ? path.join('.') : 'root';

  // 1. Primitive or Null Check
  if (
    typeof target !== 'object' || target === null ||
    typeof schema !== 'object' || schema === null
  ) {
    if (typeof target !== typeof schema) {
      errors.push({
        path: currentPathStr,
        type: 'TYPE_MISMATCH',
        message: `Expected type ${typeof schema}, but received ${typeof target}`
      });
    }
    return { valid: errors.length === 0, errors };
  }

  // 2. Array vs Object Type Mismatch
  if (Array.isArray(target) !== Array.isArray(schema)) {
    errors.push({
      path: currentPathStr,
      type: 'TYPE_MISMATCH',
      message: `Expected ${Array.isArray(schema) ? 'Array' : 'Object'}, but received ${Array.isArray(target) ? 'Array' : 'Object'}`
    });
    return { valid: false, errors };
  }

  // 3. Circular Reference Guard
  if (seen.has(target)) {
    errors.push({
      path: currentPathStr,
      type: 'CIRCULAR_REFERENCE',
      message: `Circular reference detected at path '${currentPathStr}'`
    });
    return { valid: false, errors };
  }

  seen.add(target);

  // Handle Array Items
  if (Array.isArray(target)) {
    target.forEach((item, index) => {
      if (schema[index] !== undefined) {
        const childResult = validateKeysWithPaths(item, schema[index], [...path, `[${index}]`], seen);
        errors.push(...childResult.errors);
      }
    });
    seen.delete(target);
    return { valid: errors.length === 0, errors };
  }

  // 4. Key Validation Logic
  const targetKeys = Object.keys(target);
  const schemaKeys = Object.keys(schema);

  const targetKeySet = new Set(targetKeys);
  const schemaKeySet = new Set(schemaKeys);

  // Check for MISSING keys (in schema, but not in target)
  for (const key of schemaKeys) {
    const keyPath = [...path, key];
    if (!targetKeySet.has(key)) {
      errors.push({
        path: keyPath.join('.'),
        type: 'MISSING_KEY',
        message: `Missing required key '${keyPath.join('.')}'`
      });
    } else {
      // Recurse into nested target child
      const childResult = validateKeysWithPaths(target[key], schema[key], keyPath, seen);
      errors.push(...childResult.errors);
    }
  }

  // Check for UNEXPECTED keys (in target, but not in schema)
  for (const key of targetKeys) {
    if (!schemaKeySet.has(key)) {
      const keyPath = [...path, key];
      errors.push({
        path: keyPath.join('.'),
        type: 'UNEXPECTED_KEY',
        message: `Unexpected key '${keyPath.join('.')}' found`
      });
    }
  }

  // Clean up visited set on backtrack
  seen.delete(target);

  return {
    valid: errors.length === 0,
    errors
  };
};

```

---

### Example Usage

```javascript
const schema = {
  user: {
    id: 1,
    profile: {
      name: 'John',
      email: 'john@example.com',
      age: 30
    }
  },
  settings: {
    theme: 'dark'
  }
};

const invalidTarget = {
  user: {
    id: 101,
    profile: {
      name: 'Alice',
      // 'email' is MISSING
      age: 25,
      role: 'admin' // 'role' is UNEXPECTED
    }
  },
  // 'settings' is MISSING completely
};

const result = validateKeysWithPaths(invalidTarget, schema);

console.log('Is Valid:', result.valid);
console.log('Errors:', JSON.stringify(result.errors, null, 2));

```

#### Console Output

```json
Is Valid: false
Errors: [
  {
    "path": "user.profile.email",
    "type": "MISSING_KEY",
    "message": "Missing required key 'user.profile.email'"
  },
  {
    "path": "user.profile.role",
    "type": "UNEXPECTED_KEY",
    "message": "Unexpected key 'user.profile.role' found"
  },
  {
    "path": "settings",
    "type": "MISSING_KEY",
    "message": "Missing required key 'settings'"
  }
]

```

---

### Key Features of this Pattern

1. **Full Coverage**: Collects **all** errors in a single pass rather than exiting on the first failure.
2. **Accurate Error Formatting**: Dot notation (`user.profile.email`) makes it easy to map back to UI forms or log outputs.
3. **Array-Aware**: Standard object dot-notation is supplemented with array bracket notation (`items.[0].id`).
4. **Memory Clean**: Removes objects from the backtrack `seen` set upon return, handling shared sub-objects without false-positive circular errors.

How can I add options like { allowExtraKeys: true, ignoreTypes: true } to configure validation behavior dynamically?

You can support dynamic options like `{ allowExtraKeys: true, ignoreTypes: true }` by passing an options object into the function with sensible default values.

Here is the updated validator accepting a third configuration parameter, `options`, along with additional flags like `allowMissingKeys` and `failFast`.

---

### Implementation with Dynamic Options

```javascript
/**
 * Recursively validates target object keys/types against a schema with dynamic options.
 * 
 * @param {Object} target - The object to validate.
 * @param {Object} schema - Reference schema or source object.
 * @param {Object} [options] - Dynamic configuration flags.
 * @param {boolean} [options.allowExtraKeys=false] - Ignore unexpected keys in target.
 * @param {boolean} [options.allowMissingKeys=false] - Ignore missing keys in target.
 * @param {boolean} [options.ignoreTypes=false] - Skip type/primitive checking.
 * @param {boolean} [options.failFast=false] - Stop checking after the first error.
 * @returns {{ valid: boolean, errors: Array<{ path: string, message: string, type: string }> }}
 */
const validateWithConfig = (
  target,
  schema,
  options = {},
  path = [],
  seen = new Set()
) => {
  const {
    allowExtraKeys = false,
    allowMissingKeys = false,
    ignoreTypes = false,
    failFast = false
  } = options;

  const errors = [];
  const currentPathStr = path.length ? path.join('.') : 'root';

  // Helper to handle fast exit when failFast is enabled
  const addError = (err) => {
    errors.push(err);
    return failFast;
  };

  // 1. Primitive & Type Verification
  if (
    typeof target !== 'object' || target === null ||
    typeof schema !== 'object' || schema === null
  ) {
    if (!ignoreTypes && typeof target !== typeof schema) {
      errors.push({
        path: currentPathStr,
        type: 'TYPE_MISMATCH',
        message: `Expected type ${typeof schema}, but received ${typeof target}`
      });
    }
    return { valid: errors.length === 0, errors };
  }

  // 2. Array vs Object Structural Verification
  if (!ignoreTypes && Array.isArray(target) !== Array.isArray(schema)) {
    errors.push({
      path: currentPathStr,
      type: 'TYPE_MISMATCH',
      message: `Expected ${Array.isArray(schema) ? 'Array' : 'Object'}, but received ${Array.isArray(target) ? 'Array' : 'Object'}`
    });
    return { valid: false, errors };
  }

  // 3. Circular Reference Safeguard
  if (seen.has(target)) {
    errors.push({
      path: currentPathStr,
      type: 'CIRCULAR_REFERENCE',
      message: `Circular reference detected at path '${currentPathStr}'`
    });
    return { valid: false, errors };
  }

  seen.add(target);

  // 4. Handle Array Recursion
  if (Array.isArray(target)) {
    for (let index = 0; index < target.length; index++) {
      if (schema[index] !== undefined) {
        const childResult = validateWithConfig(target[index], schema[index], options, [...path, `[${index}]`], seen);
        errors.push(...childResult.errors);
        if (failFast && errors.length > 0) break;
      }
    }
    seen.delete(target);
    return { valid: errors.length === 0, errors };
  }

  // 5. Keys Validation Logic
  const targetKeys = Object.keys(target);
  const schemaKeys = Object.keys(schema);

  const targetKeySet = new Set(targetKeys);
  const schemaKeySet = new Set(schemaKeys);

  // Check for MISSING keys (unless allowMissingKeys = true)
  for (const key of schemaKeys) {
    const keyPath = [...path, key];
    
    if (!targetKeySet.has(key)) {
      if (!allowMissingKeys) {
        if (addError({
          path: keyPath.join('.'),
          type: 'MISSING_KEY',
          message: `Missing required key '${keyPath.join('.')}'`
        })) break;
      }
    } else {
      // Recurse down into present key
      const childResult = validateWithConfig(target[key], schema[key], options, keyPath, seen);
      errors.push(...childResult.errors);
      if (failFast && errors.length > 0) break;
    }
  }

  // Check for UNEXPECTED keys (unless allowExtraKeys = true)
  if (!allowExtraKeys && !(failFast && errors.length > 0)) {
    for (const key of targetKeys) {
      if (!schemaKeySet.has(key)) {
        const keyPath = [...path, key];
        if (addError({
          path: keyPath.join('.'),
          type: 'UNEXPECTED_KEY',
          message: `Unexpected key '${keyPath.join('.')}' found`
        })) break;
      }
    }
  }

  seen.delete(target);

  return {
    valid: errors.length === 0,
    errors
  };
};

```

---

### Example Behaviors

Given this target and schema:

```javascript
const schema = {
  id: 1,
  details: {
    name: 'Item',
    score: '100' // schema expects a string
  }
};

const payload = {
  id: 1,
  extraField: 'allowed or ignored?',
  details: {
    name: 'Item',
    score: 100 // target is a number
    // 'missingProp' isn't here
  }
};

```

#### Scenario 1: Strict Validation (Default options)

```javascript
console.log(validateWithConfig(payload, schema));
/*
Output:
{
  valid: false,
  errors: [
    { path: 'details.score', type: 'TYPE_MISMATCH', message: 'Expected type string, but received number' },
    { path: 'extraField', type: 'UNEXPECTED_KEY', message: "Unexpected key 'extraField' found" }
  ]
}
*/

```

#### Scenario 2: Allow Extra Keys + Ignore Data Types

```javascript
console.log(validateWithConfig(payload, schema, { 
  allowExtraKeys: true, 
  ignoreTypes: true 
}));
/*
Output:
{
  valid: true,
  errors: []
}
*/

```

#### Scenario 3: Fail Fast on First Error

```javascript
console.log(validateWithConfig(payload, schema, { failFast: true }));
/*
Output:
{
  valid: false,
  errors: [
    { path: 'details.score', type: 'TYPE_MISMATCH', message: 'Expected type string, but received number' }
  ]
}
*/

```

How can I add custom validation rules (e.g., regex matching or range checks) per key?

To support custom validation rules like regex matching, range checks, or custom functions per key, you can define a **schema definition mapping**.

Instead of passing an example object as the schema, you map keys to rule objects that define expectations such as `type`, `pattern` (Regex), `min`/`max` ranges, or a custom `validate(value)` function.

---

### Implementation with Custom Key Rules

```javascript
/**
 * Recursively validates an object against a schema definition with custom rules.
 * 
 * @param {Object} target - The object to validate.
 * @param {Object} schema - Schema mapping keys to rule objects or nested schemas.
 * @param {Object} [options] - General flags like allowExtraKeys, failFast, etc.
 * @param {Array<string>} [path] - Internal path tracker.
 * @returns {{ valid: boolean, errors: Array<{ path: string, message: string, type: string }> }}
 */
const validateWithRules = (
  target,
  schema,
  options = {},
  path = []
) => {
  const { allowExtraKeys = false, allowMissingKeys = false, failFast = false } = options;
  const errors = [];

  const addError = (err) => {
    errors.push(err);
    return failFast;
  };

  if (typeof target !== 'object' || target === null) {
    errors.push({
      path: path.length ? path.join('.') : 'root',
      type: 'TYPE_MISMATCH',
      message: 'Target must be an object'
    });
    return { valid: false, errors };
  }

  const targetKeys = Object.keys(target);
  const schemaKeys = Object.keys(schema);

  const targetKeySet = new Set(targetKeys);
  const schemaKeySet = new Set(schemaKeys);

  // 1. Validate Schema Keys & Rules against Target
  for (const key of schemaKeys) {
    const keyPath = [...path, key];
    const pathStr = keyPath.join('.');
    const rule = schema[key];
    const val = target[key];

    // Check key presence
    if (!targetKeySet.has(key)) {
      const isRequired = rule.required ?? !allowMissingKeys;
      if (isRequired) {
        if (addError({
          path: pathStr,
          type: 'MISSING_KEY',
          message: `Missing required key '${pathStr}'`
        })) break;
      }
      continue;
    }

    // Skip validation if value is null/undefined and not explicitly required
    if ((val === undefined || val === null) && rule.optional) {
      continue;
    }

    // Check for nested schema (if rule is a plain nested object without rule properties)
    const isRuleObject = rule && typeof rule === 'object' && (
      rule.type || rule.pattern || rule.min !== undefined || 
      rule.max !== undefined || typeof rule.validate === 'function' || 
      rule.properties || rule.items
    );

    if (!isRuleObject && typeof rule === 'object' && rule !== null) {
      // Treat as nested object schema
      const nestedResult = validateWithRules(val, rule, options, keyPath);
      errors.push(...nestedResult.errors);
      if (failFast && errors.length > 0) break;
      continue;
    }

    // --- APPLY FIELD RULES ---

    // Nested Object Rule via `properties`
    if (rule.type === 'object' && rule.properties) {
      const nestedResult = validateWithRules(val, rule.properties, options, keyPath);
      errors.push(...nestedResult.errors);
      if (failFast && errors.length > 0) break;
      continue;
    }

    // Nested Array Rule via `items`
    if (rule.type === 'array' && rule.items && Array.isArray(val)) {
      for (let i = 0; i < val.length; i++) {
        const itemPath = [...keyPath, `[${i}]`];
        if (typeof rule.items === 'object' && rule.items.properties) {
          const itemResult = validateWithRules(val[i], rule.items.properties, options, itemPath);
          errors.push(...itemResult.errors);
        } else if (typeof rule.items.validate === 'function') {
          const customErr = rule.items.validate(val[i]);
          if (customErr) errors.push({ path: itemPath.join('.'), type: 'CUSTOM_RULE_FAILED', message: customErr });
        }
        if (failFast && errors.length > 0) break;
      }
      continue;
    }

    // Type Check
    if (rule.type && typeof val !== rule.type) {
      if (addError({
        path: pathStr,
        type: 'TYPE_MISMATCH',
        message: `Expected type '${rule.type}', but received '${typeof val}'`
      })) break;
      continue; // Skip further type-dependent checks if type fails
    }

    // Regex Pattern Check
    if (rule.pattern instanceof RegExp && typeof val === 'string') {
      if (!rule.pattern.test(val)) {
        if (addError({
          path: pathStr,
          type: 'PATTERN_MISMATCH',
          message: rule.message || `Value '${val}' does not match pattern ${rule.pattern}`
        })) break;
      }
    }

    // Numeric Range Checks
    if (typeof val === 'number') {
      if (rule.min !== undefined && val < rule.min) {
        if (addError({
          path: pathStr,
          type: 'RANGE_UNDERFLOW',
          message: `Value ${val} is below minimum ${rule.min}`
        })) break;
      }
      if (rule.max !== undefined && val > rule.max) {
        if (addError({
          path: pathStr,
          type: 'RANGE_OVERFLOW',
          message: `Value ${val} exceeds maximum ${rule.max}`
        })) break;
      }
    }

    // String / Array Length Checks
    if (typeof val === 'string' || Array.isArray(val)) {
      if (rule.minLength !== undefined && val.length < rule.minLength) {
        if (addError({
          path: pathStr,
          type: 'LENGTH_TOO_SHORT',
          message: `Length ${val.length} is less than minimum ${rule.minLength}`
        })) break;
      }
      if (rule.maxLength !== undefined && val.length > rule.maxLength) {
        if (addError({
          path: pathStr,
          type: 'LENGTH_TOO_LONG',
          message: `Length ${val.length} exceeds maximum ${rule.maxLength}`
        })) break;
      }
    }

    // Custom Validation Function: validate(value, targetObject)
    if (typeof rule.validate === 'function') {
      const customResult = rule.validate(val, target);
      // Return a string message on error, or false for generic failure
      if (customResult === false || typeof customResult === 'string') {
        if (addError({
          path: pathStr,
          type: 'CUSTOM_RULE_FAILED',
          message: typeof customResult === 'string' ? customResult : `Custom validation failed for key '${pathStr}'`
        })) break;
      }
    }
  }

  // 2. Check for Unexpected Extra Keys
  if (!allowExtraKeys && !(failFast && errors.length > 0)) {
    for (const key of targetKeys) {
      if (!schemaKeySet.has(key)) {
        const keyPath = [...path, key];
        if (addError({
          path: keyPath.join('.'),
          type: 'UNEXPECTED_KEY',
          message: `Unexpected key '${keyPath.join('.')}' found`
        })) break;
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

```

---

### Example Schema with Rules

```javascript
const userSchema = {
  username: {
    type: 'string',
    minLength: 3,
    maxLength: 15,
    pattern: /^[a-zA-Z0-9_]+$/,
    message: 'Username must be alphanumeric (3-15 chars)'
  },
  age: {
    type: 'number',
    min: 18,
    max: 120
  },
  email: {
    type: 'string',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Invalid email address'
  },
  // Custom cross-field validation rule
  confirmPassword: {
    type: 'string',
    validate: (val, parentObj) => {
      if (val !== parentObj.password) {
        return 'confirmPassword must match password';
      }
    }
  },
  password: {
    type: 'string',
    minLength: 8
  },
  // Nested object with rules
  profile: {
    type: 'object',
    properties: {
      website: {
        type: 'string',
        optional: true,
        pattern: /^https?:\/\//
      }
    }
  }
};

```

#### Test Runs

```javascript
const invalidUser = {
  username: 'usr!',          // Regex fails, length ok
  age: 15,                   // Below min 18
  email: 'not-an-email',     // Invalid pattern
  password: 'secretpassword',
  confirmPassword: 'wrong',  // Custom rule fails (does not match password)
  profile: {
    website: 'ftp://site.com' // Pattern fails
  }
};

const result = validateWithRules(invalidUser, userSchema);

console.log('Is Valid:', result.valid);
console.log(result.errors);

```

#### Output

```json
[
  { "path": "username", "type": "PATTERN_MISMATCH", "message": "Username must be alphanumeric (3-15 chars)" },
  { "path": "age", "type": "RANGE_UNDERFLOW", "message": "Value 15 is below minimum 18" },
  { "path": "email", "type": "PATTERN_MISMATCH", "message": "Invalid email address" },
  { "path": "confirmPassword", "type": "CUSTOM_RULE_FAILED", "message": "confirmPassword must match password" },
  { "path": "profile.website", "type": "PATTERN_MISMATCH", "message": "Value 'ftp://site.com' does not match pattern /^https?:\\/\\//" }
]

```

---

### Capabilities Provided

1. **Primitive & Structural Types**: `type: 'string' | 'number' | 'boolean' | 'object' | 'array'`
2. **Regex Patterns**: Supports custom error messages via `message`.
3. **Numeric Ranges**: `min` and `max` limits.
4. **Length Constraints**: `minLength` and `maxLength` for strings and arrays.
5. **Cross-Field Validation**: The `validate(val, parentObj)` callback grants access to sibling properties in the object for interdependent checks.
6. **Optional Fields**: `optional: true` skips validations if the value is `undefined` or `null`.
