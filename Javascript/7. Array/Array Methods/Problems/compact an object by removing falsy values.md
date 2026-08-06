```js
const compactObject = (val) => {
  // Use ternary operator to filter out falsy values for arrays, otherwise use the provided value
  const data = Array.isArray(val) ? val.filter(Boolean) : val;

  // Reduce the object to a compacted version, removing falsy values recursively
  return Object.keys(data).reduce(
    (acc, key) => {
      const value = data[key];

      // Check if the value is truthy before including it in the result
      if (Boolean(value))
        // Recursively compact object values, if applicable
        acc[key] = typeof value === "object" ? compactObject(value) : value;

      return acc;
    },
    // Initialize the result as an empty array for arrays, otherwise an empty object
    Array.isArray(val) ? [] : {}
  );
};

// Sample object with various values including falsy ones
const obj = {
  a: null,
  b: false,
  c: true,
  d: 0,
  e: 1,
  f: "",
  g: "a",
  h: [null, false, "", true, 1, "a"],
  i: { j: 0, k: false, l: "a" },
};

// Output the result of compacting the object
console.log(compactObject(obj));

// {"c":true,"e":1,"g":"a","h":[true,1,"a"],"i":{"l":"a"}}

```



To **compact an object by removing falsy values** (`false`, `null`, `undefined`, `0`, `""`, `NaN`), you can use `Object.entries()` and `Object.fromEntries()`.

## Remove All Falsy Values

```javascript
function compactObject(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => Boolean(value)
    )
  );
}

const obj = {
  name: "Sudhir",
  active: false,
  age: 0,
  city: "Pune",
  email: "",
  verified: true
};

console.log(compactObject(obj));
```

### Output

```javascript
{
  name: "Sudhir",
  city: "Pune",
  verified: true
}
```

***

## Remove Only `false`

If you want to remove **only `false` values** and keep `0`, `""`, `null`, etc.:

```javascript
function compactObject(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== false
    )
  );
}

const obj = {
  name: "Sudhir",
  active: false,
  age: 0,
  city: "",
  verified: true
};

console.log(compactObject(obj));
```

### Output

```javascript
{
  name: "Sudhir",
  age: 0,
  city: "",
  verified: true
}
```

***

## Recursive Compact Object (Nested Objects)

```javascript
function compactObject(obj) {
  if (Array.isArray(obj)) {
    return obj
      .filter(Boolean)
      .map(compactObject);
  }

  if (
    obj !== null &&
    typeof obj === "object"
  ) {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, value]) => Boolean(value))
        .map(([key, value]) => [
          key,
          compactObject(value)
        ])
    );
  }

  return obj;
}
```

### Input

```javascript
const data = {
  name: "Sudhir",
  active: false,
  profile: {
    city: "Pune",
    email: ""
  }
};
```

### Output

```javascript
{
  name: "Sudhir",
  profile: {
    city: "Pune"
  }
}
```

***

## LeetCode-Style Solution (Compact Object)

```javascript
var compactObject = function(obj) {
  if (Array.isArray(obj)) {
    return obj
      .filter(Boolean)
      .map(compactObject);
  }

  if (
    obj !== null &&
    typeof obj === "object"
  ) {
    const result = {};

    for (const key in obj) {
      const value = compactObject(obj[key]);

      if (Boolean(value)) {
        result[key] = value;
      }
    }

    return result;
  }

  return obj;
};
```

### Time Complexity

```text
O(n)
```

### Space Complexity

```text
O(n)
```

where `n` is the total number of properties/elements.

### Interview One-Liner

> Use `Object.entries() → filter() → Object.fromEntries()` for a shallow compact operation. For nested objects and arrays, use recursion to traverse the structure and remove falsy values at every level.


If you want to remove only `null` and `undefined` values while preserving `false`, `0`, `""`, and `NaN`, use:

## Shallow Compact Object

```javascript
function compactObject(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) =>
        value !== null &&
        value !== undefined
    )
  );
}

const obj = {
  name: "Sudhir",
  age: 0,
  active: false,
  city: "",
  email: null,
  phone: undefined
};

console.log(compactObject(obj));
```

### Output

```javascript
{
  name: "Sudhir",
  age: 0,
  active: false,
  city: ""
}
```

✅ Keeps:

```javascript
false
0
""
NaN
```

❌ Removes:

```javascript
null
undefined
```

***

# Recursive Version (Nested Objects & Arrays)

```javascript
function compactObject(obj) {
  if (Array.isArray(obj)) {
    return obj
      .filter(
        item =>
          item !== null &&
          item !== undefined
      )
      .map(compactObject);
  }

  if (
    obj !== null &&
    typeof obj === "object"
  ) {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(
          ([_, value]) =>
            value !== null &&
            value !== undefined
        )
        .map(([key, value]) => [
          key,
          compactObject(value)
        ])
    );
  }

  return obj;
}
```

### Example

```javascript
const data = {
  name: "Sudhir",
  email: null,
  phone: undefined,

  profile: {
    city: "Pune",
    address: null
  },

  skills: [
    "React",
    null,
    "Node",
    undefined
  ]
};

console.log(compactObject(data));
```

### Output

```javascript
{
  name: "Sudhir",

  profile: {
    city: "Pune"
  },

  skills: [
    "React",
    "Node"
  ]
}
```

***

# Using `reduce()`

Interview-friendly solution:

```javascript
function compactObject(obj) {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      if (
        value !== null &&
        value !== undefined
      ) {
        acc[key] = value;
      }

      return acc;
    },
    {}
  );
}
```

***

# React Example

Useful before sending API payloads:

```javascript
const formData = {
  firstName: "Sudhir",
  lastName: null,
  mobile: undefined,
  city: "Pune"
};

const payload =
  compactObject(formData);

console.log(payload);
```

### Payload Sent

```javascript
{
  firstName: "Sudhir",
  city: "Pune"
}
```

***

## Interview One-Liner

> To compact an object by removing only `null` and `undefined` values, use `Object.entries()` with `filter()` and reconstruct the object using `Object.fromEntries()`. This preserves valid falsy values like `false`, `0`, and empty strings while removing only missing data.


## Recursive Function to Remove Only `null` and `undefined`

This version:

✅ Removes `null`

✅ Removes `undefined`

✅ Preserves `false`

✅ Preserves `0`

✅ Preserves `""` (empty string)

✅ Handles nested objects

✅ Handles nested arrays

***

### Implementation

```javascript
function compactObject(obj) {
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj
      .filter(
        item =>
          item !== null &&
          item !== undefined
      )
      .map(item => compactObject(item));
  }

  // Handle objects
  if (
    obj !== null &&
    typeof obj === "object"
  ) {
    const result = {};

    for (const [key, value] of Object.entries(obj)) {
      if (
        value !== null &&
        value !== undefined
      ) {
        result[key] =
          compactObject(value);
      }
    }

    return result;
  }

  return obj;
}
```

***

## Example 1: Nested Object

### Input

```javascript
const data = {
  name: "Sudhir",
  age: null,
  city: "Pune",
  phone: undefined,

  profile: {
    designation: "Project Lead",
    location: null,

    address: {
      state: "MH",
      pin: undefined
    }
  }
};

console.log(
  compactObject(data)
);
```

### Output

```javascript
{
  name: "Sudhir",

  city: "Pune",

  profile: {
    designation: "Project Lead",

    address: {
      state: "MH"
    }
  }
}
```

***

## Example 2: Nested Arrays

### Input

```javascript
const data = {
  skills: [
    "React",
    null,
    "TypeScript",
    undefined,
    "Node.js"
  ]
};

console.log(
  compactObject(data)
);
```

### Output

```javascript
{
  skills: [
    "React",
    "TypeScript",
    "Node.js"
  ]
}
```

***

## Example 3: Preserve Valid Falsy Values

### Input

```javascript
const data = {
  active: false,
  score: 0,
  remarks: "",

  email: null,
  phone: undefined
};

console.log(
  compactObject(data)
);
```

### Output

```javascript
{
  active: false,
  score: 0,
  remarks: ""
}
```

Notice:

✅ `false` kept

✅ `0` kept

✅ `""` kept

❌ `null` removed

❌ `undefined` removed

***

## Interview-Friendly Version Using `Object.fromEntries`

```javascript
function compactObject(obj) {
  if (Array.isArray(obj)) {
    return obj
      .filter(
        value =>
          value !== null &&
          value !== undefined
      )
      .map(compactObject);
  }

  if (
    obj &&
    typeof obj === "object"
  ) {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(
          ([_, value]) =>
            value !== null &&
            value !== undefined
        )
        .map(([key, value]) => [
          key,
          compactObject(value)
        ])
    );
  }

  return obj;
}
```

***

## Complexity

### Time Complexity

```text
O(n)
```

where `n` is the total number of properties and array elements.

### Space Complexity

```text
O(n)
```

for the new compacted structure.

### Interview One-Liner

> Recursively traverse arrays and objects, removing only `null` and `undefined` values while preserving valid falsy values like `false`, `0`, and empty strings. This approach safely compacts deeply nested data structures without mutating the original object.


Here is a comprehensive **Jest test suite** for the recursive `compactObject()` that removes only `null` and `undefined`.

***

## Function Under Test

```javascript
export function compactObject(obj) {
  if (Array.isArray(obj)) {
    return obj
      .filter(
        value =>
          value !== null &&
          value !== undefined
      )
      .map(compactObject);
  }

  if (
    obj &&
    typeof obj === "object"
  ) {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(
          ([_, value]) =>
            value !== null &&
            value !== undefined
        )
        .map(([key, value]) => [
          key,
          compactObject(value)
        ])
    );
  }

  return obj;
}
```

***

# Unit Tests

```javascript
import { compactObject } from "./compactObject";

describe("compactObject", () => {

  test("should remove null and undefined from flat object", () => {
    const input = {
      name: "Sudhir",
      email: null,
      phone: undefined,
      city: "Pune"
    };

    expect(compactObject(input)).toEqual({
      name: "Sudhir",
      city: "Pune"
    });
  });

  test("should preserve false, 0 and empty string", () => {
    const input = {
      active: false,
      count: 0,
      remarks: "",
      email: null
    };

    expect(compactObject(input)).toEqual({
      active: false,
      count: 0,
      remarks: ""
    });
  });

  test("should clean nested objects recursively", () => {
    const input = {
      profile: {
        city: "Pune",
        phone: undefined,
        address: {
          state: "MH",
          pin: null
        }
      }
    };

    expect(compactObject(input)).toEqual({
      profile: {
        city: "Pune",
        address: {
          state: "MH"
        }
      }
    });
  });

  test("should clean arrays recursively", () => {
    const input = {
      skills: [
        "React",
        null,
        "Node",
        undefined
      ]
    };

    expect(compactObject(input)).toEqual({
      skills: [
        "React",
        "Node"
      ]
    });
  });

  test("should clean nested array objects", () => {
    const input = {
      users: [
        {
          name: "Sudhir",
          email: null
        },
        {
          name: "John",
          phone: undefined
        }
      ]
    };

    expect(compactObject(input)).toEqual({
      users: [
        {
          name: "Sudhir"
        },
        {
          name: "John"
        }
      ]
    });
  });

  test("should return empty object when all values are removable", () => {
    const input = {
      a: null,
      b: undefined
    };

    expect(compactObject(input)).toEqual({});
  });

  test("should return empty array when all array items are removable", () => {
    const input = [
      null,
      undefined
    ];

    expect(compactObject(input)).toEqual([]);
  });

  test("should handle deeply nested structure", () => {
    const input = {
      level1: {
        level2: {
          level3: {
            data: "value",
            extra: null
          },
          remove: undefined
        }
      }
    };

    expect(compactObject(input)).toEqual({
      level1: {
        level2: {
          level3: {
            data: "value"
          }
        }
      }
    });
  });

  test("should handle primitive inputs", () => {
    expect(compactObject("hello"))
      .toBe("hello");

    expect(compactObject(123))
      .toBe(123);

    expect(compactObject(false))
      .toBe(false);
  });

  test("should not mutate original object", () => {
    const input = {
      name: "Sudhir",
      email: null
    };

    const copy =
      JSON.parse(
        JSON.stringify(input)
      );

    compactObject(input);

    expect(input).toEqual({
      ...copy,
      email: null
    });
  });

});
```

***

# Additional Edge Case Tests

### Circular Reference (if supported)

```javascript
test("should handle circular references", () => {
  const obj = {
    name: "Sudhir"
  };

  obj.self = obj;

  expect(() =>
    compactObject(obj)
  ).toThrow();
});
```

> Note: Current implementation does **not** support circular references. A `WeakSet`-based solution would be required.

***

### Complex Real-World Example

```javascript
test("should compact API payload", () => {
  const payload = {
    firstName: "Sudhir",
    lastName: null,

    contact: {
      email: undefined,
      mobile: "9999999999"
    },

    preferences: {
      darkMode: false,
      notifications: null
    }
  };

  expect(compactObject(payload)).toEqual({
    firstName: "Sudhir",

    contact: {
      mobile: "9999999999"
    },

    preferences: {
      darkMode: false
    }
  });
});
```

***

## Coverage Checklist

✅ Flat objects  
✅ Nested objects  
✅ Nested arrays  
✅ Arrays of objects  
✅ Deep recursion  
✅ Empty objects  
✅ Empty arrays  
✅ Preserve `false`  
✅ Preserve `0`  
✅ Preserve `""`  
✅ Primitive values  
✅ Immutability check  
✅ Real-world payloads

This test suite provides excellent coverage for production-grade implementations of `compactObject()`.
