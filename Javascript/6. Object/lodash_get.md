The `customGet` function you provided is a great implementation of a deep object property lookup. It mimics the behavior of `_.get` from Lodash, allowing you to access nested properties of an object using either dot notation (string) or an array of keys. Additionally, it returns a default value when the path is invalid or the key doesn't exist, which is very useful for handling missing or undefined properties.

Let's break down how the function works:

### **`customGet` Function Explanation:**

1. **Input Validation:**
   - First, the function checks whether the `object` parameter is valid. If it's not an object, the function immediately returns the provided `defaultValue`.

2. **Path Conversion:**
   - The function checks if `path` is already an array. If it is, it uses it directly.
   - If `path` is a string (like `'user.info.name'`), it splits the string into an array using `.` as a delimiter (`path.split('.')`). This helps in converting dot notation into an array of keys.

3. **Path Traversal:**
   - The function then iterates through the `pathArray` (an array of keys) and navigates through the object step by step.
   - During each iteration, it checks whether the current key exists in the current level of the object.
     - If the key doesn't exist or if the current value is `null` or `undefined`, it returns the `defaultValue`.
     - Otherwise, it moves down to the next level in the object (`current = current[key]`).

4. **Return Value:**
   - If the function successfully traverses the entire path, it returns the value found at that path.
   - If any key is missing or the path doesn't exist, the function returns the `defaultValue`.

### **Example Usage:**

1. **Accessing Nested Property:**

   ```javascript
   console.log(customGet(data, 'user.info.name')); 
   // Output: 'Alice'
   ```

   The function accesses `data.user.info.name` and returns `'Alice'`.

2. **Accessing a Deeper Nested Property:**

   ```javascript
   console.log(customGet(data, 'user.info.address.city'));
   // Output: 'Wonderland'
   ```

   The function accesses `data.user.info.address.city` and returns `'Wonderland'`.

3. **Key Not Found (Returns Default Value):**

   ```javascript
   console.log(customGet(data, 'user.info.address.country', 'Unknown'));
   // Output: 'Unknown'
   ```

   The property `data.user.info.address.country` doesn't exist, so it returns the default value `'Unknown'`.

4. **Accessing a Valid Property:**

   ```javascript
   console.log(customGet(data, 'user.info.age'));
   // Output: 30
   ```

   The function successfully accesses `data.user.info.age` and returns `30`.

5. **Accessing an Undefined Array Property:**

   ```javascript
   console.log(customGet(data, 'user.info.hobbies', []));
   // Output: []
   ```

   The property `data.user.info.hobbies` doesn't exist, so it returns the default value `[]` (empty array).

6. **Using Array for Path:**

   ```javascript
   console.log(customGet(data, ['user', 'info', 'name']));
   // Output: 'Alice'
   ```

   You can also pass an array of keys directly, and the function will navigate through the object using that array.

### **Code Implementation:**

```javascript
function customGet(object, path, defaultValue) {
    if (!object || typeof object !== 'object') {
        return defaultValue; // Return default value if the object is not valid
    }

    const pathArray = Array.isArray(path) ? path : path.split('.'); // Convert path to array if it's a string
    let current = object;

    for (const key of pathArray) {
        if (current === null || current === undefined || !(key in current)) {
            return defaultValue; // Return default if the key is not found
        }
        current = current[key]; // Traverse the object
    }

    return current; // Return the found value
}

// Example usage
const data = {
    user: {
        info: {
            name: 'Alice',
            age: 30,
            address: {
                city: 'Wonderland',
                zip: '12345',
            },
        },
    },
};

console.log(customGet(data, 'user.info.name')); // Output: 'Alice'
console.log(customGet(data, 'user.info.address.city')); // Output: 'Wonderland'
console.log(customGet(data, 'user.info.address.country', 'Unknown')); // Output: 'Unknown'
console.log(customGet(data, 'user.info.age')); // Output: 30
console.log(customGet(data, 'user.info.hobbies', [])); // Output: []
console.log(customGet(data, ['user', 'info', 'name'])); // Output: 'Alice'
```

### **Edge Case Considerations:**

- **Empty Object or Non-Object Input:**
  If the first argument is not an object (i.e., it's `null`, `undefined`, or a primitive), the function will immediately return the `defaultValue`.

- **Path that Doesn't Exist:**
  If any part of the path does not exist (e.g., a missing key), the function will return the `defaultValue`.

- **Default Value:**
  The default value is returned if the object is invalid, or if the path cannot be fully traversed due to missing keys or undefined/null values at any point in the path.

### **Performance Considerations:**

- **Time Complexity:** O(n), where `n` is the length of the path. In the worst case, the function needs to traverse all keys in the path array.
- **Space Complexity:** O(1), since only the current reference to the object is maintained while traversing.

### **Final Thoughts:**

This function is a clean and efficient solution for safely accessing nested properties in JavaScript objects. It gracefully handles edge cases, like invalid paths or missing keys, and provides flexibility with both string and array paths.

Your breakdown of `customGet` is excellent and covers the core mechanics well.

While the provided implementation works for standard object keys, production-grade implementations (like Lodash's `_.get`) handle three important edge cases that simple string splitting misses: **array index notation**, **explicitly `undefined` values**, and **prototype pollution vulnerabilities**.

Here is a closer look at those edge cases and how to address them:

---

### 1. Bracket Notation & Array Indices

If a user passes a path like `'users[0].name'`, `path.split('.')` converts it to `['users[0]', 'name']`. Looking up `'users[0]'` as a property key on `users` will fail.

To handle array indices, a regular expression or string replacer can normalize bracket notation into dot paths before splitting:

```javascript
// Converts 'a[0].b.c[1]' -> ['a', '0', 'b', 'c', '1']
function parsePath(path) {
    if (Array.isArray(path)) return path;
    return path
        .replace(/\[(\d+)\]/g, '.$1') // Replace '[0]' with '.0'
        .split('.')
        .filter(Boolean);
}

```

---

### 2. Properties Set to `undefined` vs. Missing Keys

Consider this scenario:

```javascript
const obj = { user: { role: undefined } };

```

In your code:

- `customGet(obj, 'user.role', 'default')` encounters `current['role']`, which evaluates to `undefined`.
- The loop finishes and returns `undefined` (not `'default'`).

If the intention is to fall back to `defaultValue` whenever the final resolved value is strictly `undefined` (matching standard `_.get` behavior), check the final return value as well:

```javascript
return current === undefined ? defaultValue : current;

```

---

### 3. Preventing Prototype Pollution

Allowing paths that contain `__proto__`, `constructor`, or `prototype` can expose prototype pollution risks if the path comes from untrusted user input. It is best practice to explicitly block or bypass these keys:

```javascript
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

if (FORBIDDEN_KEYS.has(key)) {
    return defaultValue;
}

```

---

### Enhanced Production Implementation

Combining these fixes results in a robust utility:

```javascript
function customGet(object, path, defaultValue) {
    if (object == null) {
        return defaultValue;
    }

    const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

    // Parse path: normalizes 'a[0].b' to ['a', '0', 'b']
    const pathArray = Array.isArray(path)
        ? path
        : String(path).replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean);

    let current = object;

    for (const key of pathArray) {
        if (current == null || FORBIDDEN_KEYS.has(key) || !(key in Object(current))) {
            return defaultValue;
        }
        current = current[key];
    }

    return current === undefined ? defaultValue : current;
}

// Example with bracket notation & arrays:
const complexData = {
    users: [
        { name: 'Alice', settings: { theme: undefined } }
    ]
};

console.log(customGet(complexData, 'users[0].name')); // 'Alice'
console.log(customGet(complexData, 'users[0].settings.theme', 'dark')); // 'dark' (handles undefined)
console.log(customGet(complexData, 'users[1].name', 'Guest')); // 'Guest' (out of bounds)

```
