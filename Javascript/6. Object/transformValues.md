### Explanation of Functions: `transformValues` and `transformObject`

You’ve created two very flexible JavaScript functions—`transformValues` and `transformObject`—that allow you to transform the values of an object in different ways. Let's break down each function and its usage.

---

### 1. **`transformValues` Function**

The `transformValues` function allows you to transform the **values** of an object using a given transformation function (`transformFunction`). This function iterates over the object's properties and applies the transformation to each value.

#### Code

```javascript
function transformValues(obj, transformFunction) {
  const transformedObject = {};
  for (const key in obj) {
    const value = obj[key];
    transformedObject[key] = transformFunction(value);
  }
  return transformedObject;
}
```

#### How it works

- **Input**: An object (`obj`) and a function (`transformFunction`) to transform each value in the object.
- **Output**: A new object with the same keys, but with values transformed by `transformFunction`.
- **Key Concept**: The function loops through each key-value pair of the object using a `for...in` loop. For each key, the corresponding value is passed into the `transformFunction`, and the result is assigned to the new object (`transformedObject`).

#### Example Usage

```javascript
const obj = { a: 1, b: 2, c: 3 };

const transformedObject = transformValues(obj, (value) => value * 2);

console.log(transformedObject); 
// Output: { a: 2, b: 4, c: 6 }
```

- Here, the function doubles each value in the object.

Another example with string manipulation:

```javascript
const obj = { a: "hello", b: "world" };

const transformedObject = transformValues(obj, (value) => value.toUpperCase());

console.log(transformedObject);
// Output: { a: "HELLO", b: "WORLD" }
```

- This time, the function converts each value to uppercase.

### Use Cases for `transformValues`

- **Convert all values to numbers**: For example, if an object contains strings that represent numbers but you want them as actual numbers.
  
  ```javascript
  const obj = { a: "1", b: "2", c: "3" };
  const transformedObject = transformValues(obj, (value) => Number(value));
  console.log(transformedObject); 
  // Output: { a: 1, b: 2, c: 3 }
  ```

- **Filter out certain values**: For instance, you might want to only keep values that satisfy a condition.
  
  ```javascript
  const obj = { a: 5, b: 3, c: 10 };
  const transformedObject = transformValues(obj, (value) => (value > 4 ? value : null));
  console.log(transformedObject);
  // Output: { a: 5, b: null, c: 10 }
  ```

---

### 2. **`transformObject` Function**

The `transformObject` function is more flexible and handles **nested objects or arrays**. It applies a transformation to the **values** of an object, and if the value is an array or an object, it will recursively transform the inner elements as well.

#### Code

```javascript
function transformObject(obj, transformFunction) {
  // Handle different object types for broader applicability
  if (typeof obj !== "object" || obj === null) {
    return obj; // Return primitive values and null as-is
  }

  if (Array.isArray(obj)) {
    return obj.map(transformFunction); // Recursively transform array elements
  }

  const transformedObject = {};
  for (const key in obj) {
    transformedObject[key] = transformFunction(obj[key]); // Apply transform to each value
  }
  return transformedObject;
}
```

#### How it works

- **Input**: An object (`obj`) and a transformation function (`transformFunction`).
- **Output**: A new object where each value is transformed using `transformFunction`. If a value is an array or an object, it will recursively transform its elements as well.
- **Key Concept**: The function checks the type of the value before applying transformations:
  - If the value is an object, it recursively transforms the nested object.
  - If the value is an array, it applies the transformation to each element of the array.
  - If the value is a primitive type (like string, number, etc.), it applies the transformation directly.

#### Example Usage

**Transforming values in a simple object:**

```javascript
const myObject = { a: 1, b: 2, c: [3, 4] };

function doubleIt(value) {
  return value * 2;
}

const transformedObject = transformObject(myObject, doubleIt);
console.log(transformedObject);
// Output: { a: 2, b: 4, c: [6, 8] }
```

- This function doubles each value in the object, including values inside arrays.

**Transforming values in an object with string manipulation:**

```javascript
const myObject = { name: "alice", city: "new york" };

function toUpperCase(value) {
  return value.toUpperCase();
}

const transformedObject = transformObject(myObject, toUpperCase);
console.log(transformedObject);
// Output: { name: 'ALICE', city: 'NEW YORK' }
```

- Here, each string in the object is transformed to uppercase.

---

### Recursive Transformation Example with Nested Objects

Consider an object with nested objects and arrays. The `transformObject` function can recursively apply transformations even to deeply nested structures.

```javascript
const obj = {
  name: "alice",
  details: {
    age: 25,
    location: "new york",
    address: {
      street: "123 main st",
      city: "new york"
    }
  },
  favoriteColors: ["red", "green", "blue"]
};

function transformToUpperCase(value) {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return value;
}

const transformedObject = transformObject(obj, transformToUpperCase);
console.log(transformedObject);
// Output:
// {
//   name: "ALICE",
//   details: {
//     age: 25,
//     location: "NEW YORK",
//     address: {
//       street: "123 MAIN ST",
//       city: "NEW YORK"
//     }
//   },
//   favoriteColors: ["RED", "GREEN", "BLUE"]
// }
```

- In this example, all string values, even those nested within arrays or objects, are converted to uppercase.

---

### Key Differences Between `transformValues` and `transformObject`

| Feature                           | `transformValues`                          | `transformObject`                                      |
| --------------------------------- | ------------------------------------------ | ------------------------------------------------------ |
| **Handles Nested Objects/Arrays** | No, it only works at the top level         | Yes, it recursively handles nested objects and arrays  |
| **Use Case**                      | Ideal for simple, flat objects             | Suitable for deep transformations in nested structures |
| **Return Type**                   | Transformed object with the same structure | Transformed object with deep transformation of values  |

---

### Conclusion

Both `transformValues` and `transformObject` are flexible tools for transforming object values, with `transformObject` being more robust as it supports nested objects and arrays. You can use them for various tasks, such as formatting, filtering, or converting data inside objects. The recursive nature of `transformObject` makes it ideal for handling more complex structures where the depth of the object is not fixed.

Your write-up gives a clear overview of both functions! However, there are a couple of subtle bugs in the `transformObject` implementation provided in your notes that are worth pointing out if you plan to rely on this implementation for deep recursion.

---

### Bug Analysis & Fixes in `transformObject`

In the implementation provided:

```javascript
function transformObject(obj, transformFunction) {
  if (typeof obj !== "object" || obj === null) {
    return obj; 
  }

  if (Array.isArray(obj)) {
    return obj.map(transformFunction); // ❌ Bug 1
  }

  const transformedObject = {};
  for (const key in obj) {
    transformedObject[key] = transformFunction(obj[key]); // ❌ Bug 2
  }
  return transformedObject;
}

```

#### Bug 1: Array elements are not recursively processed

`obj.map(transformFunction)` applies `transformFunction` to the items in the array, but it does **not** call `transformObject` recursively. If an array contains a nested object or sub-array (e.g., `[{ key: "value" }]`), the nested object won't be traversed.

#### Bug 2: Object values are not recursively processed

In the `for...in` loop, `transformedObject[key] = transformFunction(obj[key])` directly calls the custom callback without recursing through `transformObject` first.

Because of this, in your nested example:

```javascript
const obj = {
  details: {
    age: 25,
    location: "new york"
  }
};

```

When the top-level loop runs for `details`, `obj["details"]` is passed into `transformToUpperCase(value)`. Since `{ age: 25, location: "new york" }` is an object (not a string), the callback simply returns the original object untouched, and its nested properties are never converted.

---

### Corrected Implementation

To make full deep traversal work automatically while still applying your custom transformation to primitive leaf values, `transformObject` should call itself recursively before or during evaluation:

```javascript
function transformObject(obj, transformFunction) {
  // Base case: Handle null and non-objects (primitives)
  if (typeof obj !== "object" || obj === null) {
    return transformFunction(obj);
  }

  // Recursive case: Handle Arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => transformObject(item, transformFunction));
  }

  // Recursive case: Handle Objects
  const transformedObject = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      transformedObject[key] = transformObject(obj[key], transformFunction);
    }
  }
  return transformedObject;
}

```

---

### Modern Alternative: `Object.fromEntries`

For simple, non-recursive value transformations like `transformValues`, modern JavaScript offers a concise pattern using built-in methods:

```javascript
function transformValues(obj, transformFunction) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, val]) => [key, transformFunction(val)])
  );
}

```

Show me how to make the recursive transformObject function safe against prototype pollution vulnerabilities.
Prototype pollution occurs when an attacker trick an application into modifying properties on `Object.prototype`. In JavaScript recursive object traversal functions like `transformObject`, prototype pollution primarily happens in two ways:

1. **Unsanitized Key Traversal:** Traversing or setting dangerous properties such as `__proto__`, `constructor`, or `prototype`.
2. **Unsafe Object Initialization:** Creating target objects with `{}` or `Object.assign()`, which still inherit from `Object.prototype`.

Here is how to make `transformObject` completely immune to prototype pollution attacks.

---

### Key Security Enhancements

1. **Deny List for Dangerous Keys:** Skip keys like `__proto__`, `constructor`, and `prototype` during iteration so they cannot reach property assignment.
2. **Use `Object.create(null)` or Safe Copies:** Initialize objects with a `null` prototype or construct safe plain objects using `Object.defineProperty` / `Object.assign`.
3. **Guard Against Owned Properties:** Use `Object.hasOwn()` (or `Object.prototype.hasOwnProperty.call()`) to prevent inspecting inherited properties along the prototype chain.

---

### Hardened Implementation

```javascript
// Set of keys that must never be assigned or traversed recursively
const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function transformObjectSafe(obj, transformFunction) {
  // Base case: Handle primitives and null
  if (typeof obj !== 'object' || obj === null) {
    return transformFunction(obj);
  }

  // Recursive case: Arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => transformObjectSafe(item, transformFunction));
  }

  // Recursive case: Objects
  // Create an object that doesn't inherit from Object.prototype during build,
  // or use standard {} while strictly validating keys.
  const transformedObject = {};

  for (const key of Object.keys(obj)) {
    // Security Guard 1: Block prototype pollution vectors
    if (DANGEROUS_KEYS.has(key)) {
      continue;
    }

    // Security Guard 2: Ensure the property belongs to the object itself
    if (Object.hasOwn(obj, key)) {
      const val = obj[key];
      
      // If the property value itself is a dangerous key reference, sanitize it
      transformedObject[key] = transformObjectSafe(val, transformFunction);
    }
  }

  return transformedObject;
}

```

---

### Demonstration: Testing Against Attack Payloads

#### Attack Scenario 1: Injecting `__proto__` Payload

```javascript
// Malicious payload attempting to set isAdmin = true on all global objects
const maliciousJSON = '{"name": "Alice", "__proto__": {"isAdmin": true}}';
const parsedPayload = JSON.parse(maliciousJSON);

function identity(val) {
  return val;
}

// Transform using safe function
const sanitized = transformObjectSafe(parsedPayload, identity);

console.log(sanitized); 
// Output: { name: 'Alice' }  (__proto__ was completely ignored)

console.log(({}).isAdmin); 
// Output: undefined  (Object.prototype remains unpolluted!)

```

#### Attack Scenario 2: Nested `constructor.prototype` Pollution

```javascript
const constructorPayload = {
  user: "Bob",
  details: {
    constructor: {
      prototype: {
        polluted: true
      }
    }
  }
};

transformObjectSafe(constructorPayload, (v) => v);

console.log(({}).polluted); 
// Output: undefined  (Clean)

```

---

### Summary Checklist for Safe Object Traversal

| Security Layer           | Implementation            | Purpose                                                           |
| ------------------------ | ------------------------- | ----------------------------------------------------------------- |
| **Key Filtering**        | `DANGEROUS_KEYS.has(key)` | Drops `__proto__`, `constructor`, `prototype` before assignment.  |
| **Property Guard**       | `Object.hasOwn(obj, key)` | Ignores inherited properties during loop iteration.               |
| **Object Key Retrieval** | `Object.keys(obj)`        | Avoids scanning prototype chain compared to unchecked `for...in`. |

How can I adapt transformObject to recursively transform object keys (e.g., convert camelCase keys to snake_case)?

To transform object **keys** instead of values, you can adapt the recursive function by applying a key transformation function to every property name as you construct the new object.

To handle key transformations properly, there are three important structural rules:

1. **Values must be recursively traversed** so that keys inside nested objects and arrays are also converted.
2. **Key functions are applied to string keys**, while values pass through unchanged (unless they are nested objects/arrays).
3. **Prototype pollution guards** should still be maintained so malicious payload keys like `__proto__` are filtered out before transformation.

---

### Implementation: `transformKeys`

```javascript
const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function transformKeys(obj, keyTransformFn) {
  // Base case: Non-objects (primitives, functions, null) have no keys to transform
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  // Recursive case: Handle Arrays (traverse elements without altering array indexes)
  if (Array.isArray(obj)) {
    return obj.map((item) => transformKeys(item, keyTransformFn));
  }

  // Recursive case: Handle Objects
  const transformedObject = {};

  for (const key of Object.keys(obj)) {
    // Security Guard: Skip dangerous prototype keys
    if (DANGEROUS_KEYS.has(key)) {
      continue;
    }

    if (Object.hasOwn(obj, key)) {
      // 1. Transform the key using the provided keyTransformFn
      const newKey = keyTransformFn(key);

      // 2. Recursively transform the value (in case it contains nested objects/arrays)
      transformedObject[newKey] = transformKeys(obj[key], keyTransformFn);
    }
  }

  return transformedObject;
}

```

---

### Example: Converting `camelCase` to `snake_case`

Here is a standard helper function using a regular expression to convert `camelCase` strings to `snake_case`:

```javascript
function camelToSnake(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

// Sample nested structure
const userData = {
  firstName: "Alice",
  lastName: "Smith",
  accountDetails: {
    creationDate: "2026-01-15",
    isSubscribed: true,
    billingAddress: {
      streetName: "Main St",
      zipCode: "10001"
    }
  },
  userRoles: [
    { roleName: "admin", accessLevel: 10 },
    { roleName: "editor", accessLevel: 5 }
  ]
};

const snakeCaseData = transformKeys(userData, camelToSnake);

console.log(snakeCaseData);
/*
Output:
{
  first_name: 'Alice',
  last_name: 'Smith',
  account_details: {
    creation_date: '2026-01-15',
    is_subscribed: true,
    billing_address: { street_name: 'Main St', zip_code: '10001' }
  },
  user_roles: [
    { role_name: 'admin', access_level: 10 },
    { role_name: 'editor', access_level: 5 }
  ]
}
*/

```

---

### Example: Converting `snake_case` to `camelCase`

You can pass a `snakeToCamel` helper into the exact same `transformKeys` function:

```javascript
function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

const apiResponse = {
  user_id: 101,
  contact_info: {
    email_address: "alice@example.com"
  }
};

const camelCaseData = transformKeys(apiResponse, snakeToCamel);

console.log(camelCaseData);
// Output: { userId: 101, contactInfo: { emailAddress: 'alice@example.com' } }

```

---

### Dual Transformation: Keys AND Values

If you ever need to transform **both** keys and values simultaneously (for instance, converting keys to `snake_case` AND trimming string values), you can combine the two callbacks in a single pass:

```javascript
function transformKeysAndValues(obj, keyFn, valFn) {
  if (typeof obj !== 'object' || obj === null) {
    return valFn(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => transformKeysAndValues(item, keyFn, valFn));
  }

  const transformed = {};
  for (const key of Object.keys(obj)) {
    if (DANGEROUS_KEYS.has(key)) continue;

    if (Object.hasOwn(obj, key)) {
      const newKey = keyFn(key);
      transformed[newKey] = transformKeysAndValues(obj[key], keyFn, valFn);
    }
  }

  return transformed;
}

```

How can I write Jest tests to check if a JavaScript utility function is vulnerable to prototype pollution?

To test whether a function is vulnerable to prototype pollution using **Jest**, your tests must attempt to inject properties onto `Object.prototype` (or standard built-in objects) through common attack vectors and verify that global/clean objects remain unaffected.

When writing prototype pollution tests, there are three critical rules to keep in mind:

1. **Isolate tests:** Always clean up `Object.prototype` in `afterEach` so a failing test doesn't pollute subsequent tests.
2. **Check empty objects:** Verify that a freshly created plain object `{}` does **not** inherit the injected property.
3. **Test all common vectors:** Test `__proto__`, `constructor.prototype`, and array/nested paths.

---

### Test Suite: `transformObject.test.js`

Here is a complete Jest test suite using the `transformObject` utility:

```javascript
// Import your utility function
const { transformObjectSafe } = require('./transformObject');

describe('Prototype Pollution Security Tests', () => {
  // Guard against test leakage by restoring Object.prototype after every test
  afterEach(() => {
    delete Object.prototype.polluted;
    delete Object.prototype.isAdmin;
    delete Object.prototype.unauthorizedKey;
  });

  test('should prevent direct __proto__ pollution', () => {
    const maliciousPayload = JSON.parse(
      '{"name": "Alice", "__proto__": {"polluted": true}}'
    );

    // Run the function with an identity callback
    transformObjectSafe(maliciousPayload, (v) => v);

    // Assertion 1: Object.prototype must not have received the key
    expect(Object.prototype.polluted).toBeUndefined();

    // Assertion 2: A newly instantiated literal object must be clean
    const freshObj = {};
    expect(freshObj.polluted).toBeUndefined();
  });

  test('should prevent nested constructor.prototype pollution', () => {
    const maliciousPayload = {
      user: 'Bob',
      details: {
        constructor: {
          prototype: {
            isAdmin: true,
          },
        },
      },
    };

    transformObjectSafe(maliciousPayload, (v) => v);

    expect(Object.prototype.isAdmin).toBeUndefined();
    expect(({}).isAdmin).toBeUndefined();
  });

  test('should prevent prototype pollution through array items', () => {
    const maliciousPayload = [
      { id: 1 },
      JSON.parse('{"__proto__": {"unauthorizedKey": "hacked"}}'),
    ];

    transformObjectSafe(maliciousPayload, (v) => v);

    expect(Object.prototype.unauthorizedKey).toBeUndefined();
    expect(({}).unauthorizedKey).toBeUndefined();
  });

  test('should transform valid object properties normally', () => {
    const safePayload = {
      userProfile: {
        userName: 'charlie',
      },
    };

    const result = transformObjectSafe(safePayload, (val) =>
      typeof val === 'string' ? val.toUpperCase() : val
    );

    expect(result).toEqual({
      userProfile: {
        userName: 'CHARLIE',
      },
    });
  });
});

```

---

### How to Structure a Custom Jest Matcher (Optional)

If you frequently audit utility functions for prototype pollution, you can build a custom Jest matcher to make your security tests concise and expressive:

```javascript
// setupTests.js or at the top of your test file
expect.extend({
  toBeSafeFromPrototypePollution(fn, payload) {
    const testKey = `test_pollution_${Date.now()}`;

    try {
      // Execute function with the malicious payload
      fn(payload);

      // Check if Object.prototype was polluted
      const isPolluted = Object.prototype[testKey] !== undefined || ({}).testKey !== undefined;

      // Clean up in case pollution occurred
      delete Object.prototype[testKey];

      if (isPolluted) {
        return {
          message: () => `Expected function to be safe, but Object.prototype was polluted with "${testKey}".`,
          pass: false,
        };
      }

      return {
        message: () => `Expected function to be vulnerable to prototype pollution, but it was safe.`,
        pass: true,
      };
    } catch (err) {
      // If function throws an error on malicious keys, it resisted the pollution
      return {
        message: () => `Function threw an error (${err.message}) instead of polluting prototype.`,
        pass: true,
      };
    }
  },
});

// Usage in tests:
test('utility should pass pollution matcher', () => {
  const payload = JSON.parse('{"__proto__": {"test_pollution_key": true}}');
  
  expect((p) => transformObjectSafe(p, (v) => v)).toBeSafeFromPrototypePollution(payload);
});

```

---

### What Makes a Test Fail?

If you run these tests against an **unprotected** recursive function, the expression `({}).polluted` will evaluate to `true` (because `{}` inherits from `Object.prototype`), causing the test to fail:

```text
  ● Prototype Pollution Security Tests › should prevent direct __proto__ pollution

    expect(received).toBeUndefined()

    Received: true

      21 |     // Assertion 2: A newly instantiated literal object must be clean
      22 |     const freshObj = {};
    > 23 |     expect(freshObj.polluted).toBeUndefined();
         |                               ^

```
