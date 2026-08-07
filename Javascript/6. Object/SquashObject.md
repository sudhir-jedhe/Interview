To flatten a nested JavaScript object into a single level, we need to recursively explore each key and value. When we encounter an object, we need to traverse its keys, append the parent key to create a new key, and recursively flatten it. If the value is a primitive (like a string, number, etc.), we can simply add it to the resulting object.

Here are multiple ways to implement this, all of which "squash" or "flatten" an object into a single level:

### **Flatten Object Using Recursion**

#### 1. **Flattening with `for...in` Loop and Recursion**

This approach iterates over each key in the object and checks if the value is an object. If it is, it recursively flattens it and appends the parent key to the child keys.

```javascript
// Flattening an object into a single level recursively
const flattenObj = (ob) => {
  let result = {};

  // Iterate through the object's keys
  for (const i in ob) {
    if (typeof ob[i] === "object" && !Array.isArray(ob[i])) {
      // Recursively flatten the nested object
      const temp = flattenObj(ob[i]);
      for (const j in temp) {
        // Concatenate parent and child keys
        result[i + "." + j] = temp[j];
      }
    } else {
      // If value is a primitive, just assign it
      result[i] = ob[i];
    }
  }

  return result;
};

let ob = {
  Company: "GeeksforGeeks",
  Address: "Noida",
  contact: "+91-999999999",
  mentor: {
    HTML: "GFG",
    CSS: "GFG",
    JavaScript: "GFG",
  },
};

console.log(flattenObj(ob));
/* Output:
{
  Company: "GeeksforGeeks",
  Address: "Noida",
  contact: "+91-999999999",
  "mentor.HTML": "GFG",
  "mentor.CSS": "GFG",
  "mentor.JavaScript": "GFG"
}
*/
```

#### 2. **Flattening Using `Object.assign()` and Recursion**

This approach uses `Object.assign()` to merge objects at each recursive call. It is another efficient way to flatten an object, especially when working with deep objects.

```javascript
function squashObject(inputObject, parentKey = "") {
  const outputObject = {};

  // Iterate through all keys in the input object
  for (const key in inputObject) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (
      typeof inputObject[key] === "object" &&
      !Array.isArray(inputObject[key])
    ) {
      // Recursively flatten the object
      Object.assign(outputObject, squashObject(inputObject[key], newKey));
    } else {
      // If it's a primitive, directly assign the value
      outputObject[newKey] = inputObject[key];
    }
  }

  return outputObject;
}

const nestedObject = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3,
    },
  },
};

const squashedObject = squashObject(nestedObject);
console.log(squashedObject);
// Output: { a: 1, 'b.c': 2, 'b.d.e': 3 }
```

#### 3. **Flattening with `Object.assign()` Using `map()`**

This method leverages the `Object.keys()` method to iterate through the object, calling `map()` to flatten nested objects, and then merges them using `Object.assign()`.

```javascript
function squashObject(obj) {
  return Object.assign(
    {},
    ...Object.keys(obj).map((k) =>
      typeof obj[k] === "object" ? squashObject(obj[k]) : { [k]: obj[k] }
    )
  );
}

const nestedObj = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3,
    },
  },
};

console.log(squashObject(nestedObj));
// Output: { a: 1, 'b.c': 2, 'b.d.e': 3 }
```

#### 4. **Using `reduce()` for Flattening**

Another way to flatten the object is by using `reduce()` to accumulate the flattened key-value pairs.

```javascript
function squashObject(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    return typeof value === "object"
      ? { ...acc, ...squashObject(value) }  // Recursively flatten
      : { ...acc, [key]: value };  // Add primitive value
  }, {});
}

const nestedObj = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3,
    },
  },
};

console.log(squashObject(nestedObj));
// Output: { a: 1, 'b.c': 2, 'b.d.e': 3 }
```

### Summary of Differences

| Approach                            | Description                                                                                    |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| **`for...in` Loop with Recursion**  | Uses a loop to iterate through the object and recursively flattens nested objects.             |
| **`Object.assign()` and Recursion** | Uses `Object.assign()` to merge recursively flattened objects.                                 |
| **`Object.keys()` with `map()`**    | Uses `map()` to iterate over keys and flatten nested objects.                                  |
| **`reduce()` with Recursion**       | Uses `reduce()` to accumulate the final flattened object, handling nested objects recursively. |

### Conclusion

Each of these methods can be used depending on the situation, but generally, the recursive approach using `Object.keys()` or `for...in` is the most flexible for flattening objects with nested structures.

While all four approaches outline the general concept of object flattening, **Methods 3 and 4 contain serious bugs** that will produce broken outputs or runtime errors in practical applications.

Here is a breakdown of why Methods 1 and 2 work, why Methods 3 and 4 fail, and how to write a production-ready flattener.

---

## 1. Critique of the 4 Methods

### ✅ Method 1: `for...in` Loop & Method 2: `Object.assign()`

Both of these methods pass a `parentKey` accumulator (or concatenate keys during recursion) and mutate/construct an explicit output object.

* **Why they work:** They properly construct dot-notated paths (e.g., `'b.d.e'`).
* **Caveat:** Using `for...in` iterates over inherited prototype properties unless guarded with `Object.hasOwn(obj, key)`. Additionally, neither handles `null` checks (`typeof null === 'object'`).

---

### ❌ Method 3: `Object.keys()` + `map()` (Broken)

```javascript
function squashObject(obj) {
  return Object.assign(
    {},
    ...Object.keys(obj).map((k) =>
      typeof obj[k] === "object" ? squashObject(obj[k]) : { [k]: obj[k] }
    )
  );
}

```

**Why it fails:**

1. **Lost Key Context:** The recursive call `squashObject(obj[k])` does **not** receive the parent key `k`. The inner object loses its path prefix completely.
2. **Incorrect Output:** For `{ a: 1, b: { c: 2, d: { e: 3 } } }`, it outputs `{ a: 1, c: 2, e: 3 }` instead of `{ a: 1, 'b.c': 2, 'b.d.e': 3 }`.
3. **`null` Crash:** Passing `{ a: null }` causes `Object.keys(null)` inside the recursive call to throw a `TypeError: Cannot convert undefined or null to object`.

---

### ❌ Method 4: `reduce()` with Object Spread (Broken & $O(N^2)$)

```javascript
function squashObject(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    return typeof value === "object"
      ? { ...acc, ...squashObject(value) }
      : { ...acc, [key]: value };
  }, {});
}

```

**Why it fails:**

1. **Lost Key Context:** Just like Method 3, calling `squashObject(value)` drops the parent key context, destroying the dot notation.
2. **$O(N^2)$ Performance:** Spreading `{ ...acc, ... }` inside a `.reduce()` loop creates a new object copy on every single iteration, degrading runtime efficiency from $O(N)$ to $O(N^2)$.
3. **`null` Crash:** `typeof null === 'object'` causes `squashObject(null)` to run, throwing a `TypeError` at `Object.keys(null)`.

---

## 2. Robust, Production-Ready Implementation

A complete flattening utility must handle:

1. **Key Preservation:** Correct dot-notation prefixing (`'a.b.c'`).
2. **`null` & Primitives:** Guarding against `typeof null === 'object'`.
3. **Array Handling:** Converting array indices into key paths (e.g., `'users.0.name'`) or leaving arrays intact depending on requirement.
4. **$O(N)$ Efficiency:** Direct mutation of an accumulator object instead of spread operators.

### $O(N)$ Optimal Solution (Recursive)

```javascript
const flattenObject = (obj, parentKey = '', result = {}) => {
  if (obj === null || typeof obj !== 'object') return result;

  for (const key of Object.keys(obj)) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;
    const value = obj[key];

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      flattenObject(value, newKey, result);
    } else {
      result[newKey] = value;
    }
  }

  return result;
};

// Usage Example
const nested = {
  user: {
    name: "Alex",
    address: {
      city: "Noida",
      zip: null
    }
  },
  active: true
};

console.log(flattenObject(nested));
/* Output:
{
  'user.name': 'Alex',
  'user.address.city': 'Noida',
  'user.address.zip': null,
  active: true
}
*/

```

---

### Non-Recursive Solution (Iterative / Stack-Based)

For deeply nested objects where call stack overflow (`RangeError: Maximum call stack size exceeded`) is a risk, an iterative queue/stack approach is ideal:

```javascript
const flattenObjectIterative = (root) => {
  const result = {};
  const stack = [{ obj: root, prefix: '' }];

  while (stack.length > 0) {
    const { obj, prefix } = stack.pop();

    if (obj === null || typeof obj !== 'object') continue;

    for (const key of Object.keys(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        stack.push({ obj: value, prefix: newKey });
      } else {
        result[newKey] = value;
      }
    }
  }

  return result;
};

```

---

## Performance and Edge Case Comparison

| Feature / Issue         | Method 1 (`for...in`) | Method 2 (`Object.assign`) | Fixed $O(N)$ Recursive |
| ----------------------- | --------------------- | -------------------------- | ---------------------- |
| **Preserves Key Path**  | ✅ Yes                 | ✅ Yes                      | ✅ Yes                  |
| **Time Complexity**     | $O(N)$                | $O(N)$                     | **$O(N)$**             |
| **`null` Value Guard**  | ❌ Fails / Unsafe      | ❌ Fails / Unsafe           | ✅ Safe                 |
| **Prototype Safety**    | ❌ Iterates prototype  | ✅ Safe (`Object.keys`)     | ✅ Safe (`Object.keys`) |
| **Stack Overflow Safe** | ❌ No                  | ❌ No                       | ❌ (Use Iterative)      |

Write a JavaScript unflatten function that takes a flattened object with dot-notated keys and restores it to its nested object structure.

Here is a clean, $O(N)$ implementation of an `unflatten` (or `expand`) function.

It iterates through each key-value pair of the flattened object, splits the dot-notated key into individual segments, and recursively builds or traverses the nested objects.

### `unflatten` Implementation

```javascript
const unflattenObject = (flatObj) => {
  if (flatObj === null || typeof flatObj !== 'object' || Array.isArray(flatObj)) {
    return flatObj;
  }

  const result = {};

  for (const flatKey of Object.keys(flatObj)) {
    const keys = flatKey.split('.');
    let current = result;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const isLast = i === keys.length - 1;

      if (isLast) {
        current[key] = flatObj[flatKey];
      } else {
        // If the path doesn't exist, create an empty object
        if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
          current[key] = {};
        }
        current = current[key];
      }
    }
  }

  return result;
};

// Usage Example
const flattened = {
  'user.name': 'Alex',
  'user.address.city': 'Noida',
  'user.address.zip': null,
  active: true,
};

console.log(unflattenObject(flattened));
/* Output:
{
  user: {
    name: 'Alex',
    address: {
      city: 'Noida',
      zip: null
    }
  },
  active: true
}
*/

```

---

### Handling Array Indices (Optional Extension)

If your flattened object contains array index paths (e.g., `'items.0.name'`, `'items.1.name'`), you can automatically construct arrays instead of object keys by checking if a key segment is a numeric index:

```javascript
const unflattenWithArrays = (flatObj) => {
  if (flatObj === null || typeof flatObj !== 'object') return flatObj;

  const result = {};

  for (const flatKey of Object.keys(flatObj)) {
    const keys = flatKey.split('.');
    let current = result;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const isLast = i === keys.length - 1;
      const nextKey = keys[i + 1];
      const nextIsIndex = !isNaN(Number(nextKey));

      if (isLast) {
        current[key] = flatObj[flatKey];
      } else {
        if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
          // Initialize array if next key is numeric, otherwise object
          current[key] = nextIsIndex ? [] : {};
        }
        current = current[key];
      }
    }
  }

  return result;
};

// Example with Arrays
const flatWithArrays = {
  'title': 'Project',
  'members.0.name': 'Alice',
  'members.1.name': 'Bob',
};

console.log(unflattenWithArrays(flatWithArrays));
/* Output:
{
  title: 'Project',
  members: [
    { name: 'Alice' },
    { name: 'Bob' }
  ]
}
*/

```

---

### Key Mechanics & Edge Cases Covered

1. **$O(N \cdot K)$ Performance:** Operates in linear time relative to the number of keys ($N$) and the depth of keys ($K$).
2. **Prototype Pollution Protection:** By using `Object.keys()` and standard property assignment rather than dynamically executing `eval()` or un-sanitized string building, standard prototype pollution vectors are minimized. (If accepting untrusted input, filter out keys containing `'__proto__'`, `'constructor'`, or `'prototype'`).
3. **Overwriting Collision Safety:** If a path key collides with a primitive value already assigned (e.g., `{ 'a': 1, 'a.b': 2 }`), the function safely overwrites the primitive with an object to allow key nesting to continue.

Modify the flattenObject utility to handle nested arrays, turning indices into keys like 'users.0.name'.

Here is the updated `flattenObject` utility that handles nested arrays by appending array indices directly into the key path (e.g., `'users.0.name'`).

### Implementation

```javascript
const flattenObject = (obj, parentKey = '', result = {}) => {
  if (obj === null || typeof obj !== 'object') return result;

  for (const key of Object.keys(obj)) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;
    const value = obj[key];

    // Recurse if value is a non-null object OR an array
    if (typeof value === 'object' && value !== null) {
      flattenObject(value, newKey, result);
    } else {
      result[newKey] = value;
    }
  }

  return result;
};

// Example Usage
const input = {
  company: "TechCorp",
  users: [
    {
      name: "Alice",
      hobbies: ["reading", "coding"]
    },
    {
      name: "Bob",
      hobbies: []
    }
  ]
};

console.log(flattenObject(input));
/* Output:
{
  'company': 'TechCorp',
  'users.0.name': 'Alice',
  'users.0.hobbies.0': 'reading',
  'users.0.hobbies.1': 'coding',
  'users.1.name': 'Bob'
}
*/

```

---

### Key Changes & Behavior

1. **Removed `!Array.isArray(value)` Check:** In JavaScript, arrays are objects (`typeof [] === 'object'`). Removing the array guard allows `Object.keys()` on an array to return its indices as string keys (`"0"`, `"1"`, etc.), naturally formatting paths as `users.0.name`.
2. **Empty Arrays & Objects Handling:** Empty arrays (`[]`) or objects (`{}`) will simply produce no entries because `Object.keys()` returns an empty array `[]`, avoiding dangling empty keys like `'users.1.hobbies'`.

---

### Round-Trip Pair (`flatten` + `unflatten`)

This array-aware `flattenObject` seamlessly pairs with the `unflattenWithArrays` function from the previous step:

```javascript
const flat = flattenObject(input);
const restored = unflattenWithArrays(flat);

console.log(JSON.stringify(restored) === JSON.stringify(input)); // true

```
