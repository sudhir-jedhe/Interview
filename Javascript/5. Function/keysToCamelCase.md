Sure! Here is the **complete set of solutions** to convert all object keys to camelCase, including multiple approaches that handle various scenarios such as nested objects, arrays, and primitive values.

### **1. Solution 1: Simple and Direct Approach**

This solution is the simplest and most direct approach to recursively convert object keys to camelCase. It handles both objects and arrays, and it doesn't modify the values of the object, only the keys.

```javascript
// Helper function to convert a string to camelCase
function toCamelCase(str) {
  return str
    .replace(/_([a-z])/g, (match, p1) => p1.toUpperCase()) // Convert _letter to letterUppercase
    .replace(/^[A-Z]/, (match) => match.toLowerCase()); // Make the first character lowercase
}

// Recursive function to convert all object keys to camelCase
function camelCaseKeys(collection) {
  if (Array.isArray(collection)) {
    // Process each item in the array recursively
    return collection.map(item => camelCaseKeys(item));
  }

  if (typeof collection === 'object' && collection !== null) {
    const result = {};

    // Process each key-value pair in the object
    for (let [key, value] of Object.entries(collection)) {
      const camelCaseKey = toCamelCase(key);
      result[camelCaseKey] = camelCaseKeys(value); // Recursively handle the value
    }

    return result;
  }

  return collection; // Return the value as-is if it's neither an object nor an array
}

// Example usage:
const snakeCaseObject = {
  first_name: "John",
  last_name: "Doe",
  age_group: "Adult",
  address: {
    street_name: "Main St",
    city_name: "New York"
  },
  hobbies: [
    { hobby_name: "Reading", description: "Books" },
    { hobby_name: "Travelling", description: "World" }
  ]
};

const camelCaseObject = camelCaseKeys(snakeCaseObject);
console.log(camelCaseObject);
```

### **Explanation of Solution 1:**

1. **`toCamelCase(str)`**: Converts a single string to camelCase.
   - It replaces underscores followed by a letter (`_a` becomes `a`).
   - It also makes sure the first letter is lowercase.

2. **`camelCaseKeys(collection)`**:
   - If the collection is an array, it maps over each item and recursively calls `camelCaseKeys` on each element.
   - If the collection is an object, it processes each key-value pair, converts the key to camelCase, and recursively processes the value.
   - If it's neither an object nor an array (a primitive value), it simply returns the value.

### **2. Solution 2: Using `reduce()` for More Control**

This solution uses `reduce()` to handle the object transformation, which is slightly more functional and offers more control over how keys are handled.

```javascript
function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase())
            .replace(/^[A-Z]/, (match) => match.toLowerCase());
}

function camelCaseKeys(collection) {
  if (Array.isArray(collection)) {
    return collection.map(item => camelCaseKeys(item)); // Recursive for arrays
  }

  if (typeof collection === 'object' && collection !== null) {
    return Object.entries(collection).reduce((acc, [key, value]) => {
      const camelCaseKey = toCamelCase(key); // Convert key to camelCase
      acc[camelCaseKey] = camelCaseKeys(value); // Recursively handle the value
      return acc;
    }, {});
  }

  return collection; // Return the value as-is if it's a primitive
}

// Example usage:
const snakeCaseObject = {
  first_name: "John",
  last_name: "Doe",
  address: {
    street_name: "Main St",
    city_name: "New York"
  }
};

const camelCaseObject = camelCaseKeys(snakeCaseObject);
console.log(camelCaseObject);
```

### **3. Solution 3: Handling Nested Arrays and Objects with `Object.entries()`**

This approach is almost the same as the previous ones but uses `Object.entries()` to handle key-value pairs. It will also handle nested structures in a more structured way.

```javascript
function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase())
            .replace(/^[A-Z]/, (match) => match.toLowerCase());
}

function camelCaseKeys(collection) {
  if (Array.isArray(collection)) {
    return collection.map(item => camelCaseKeys(item)); // Handle arrays
  }

  if (typeof collection === 'object' && collection !== null) {
    return Object.entries(collection).reduce((acc, [key, value]) => {
      const camelCaseKey = toCamelCase(key); // Convert key to camelCase
      acc[camelCaseKey] = camelCaseKeys(value); // Recurse for nested objects/arrays
      return acc;
    }, {});
  }

  return collection; // Return primitives without modification
}

// Example usage:
const snakeCaseObject = {
  first_name: "John",
  last_name: "Doe",
  address: {
    street_name: "Main St",
    city_name: "New York",
    contact_info: { email_address: "john.doe@example.com" }
  },
  hobbies: [
    { hobby_name: "Reading", description: "Books" },
    { hobby_name: "Travelling", description: "World" }
  ]
};

const camelCaseObject = camelCaseKeys(snakeCaseObject);
console.log(camelCaseObject);
```

### **4. Solution 4: Use a More Generic Utility Function for Key Conversion**

This version of the function is designed for greater flexibility, allowing for customization of how keys are converted (e.g., through an optional `formatter` argument for different cases).

```javascript
function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase())
            .replace(/^[A-Z]/, (match) => match.toLowerCase());
}

function convertKeys(collection, keyConverter = toCamelCase) {
  if (Array.isArray(collection)) {
    return collection.map(item => convertKeys(item, keyConverter)); // Handle arrays
  }

  if (typeof collection === 'object' && collection !== null) {
    return Object.entries(collection).reduce((acc, [key, value]) => {
      const convertedKey = keyConverter(key); // Convert the key with the provided function
      acc[convertedKey] = convertKeys(value, keyConverter); // Recursively handle the value
      return acc;
    }, {});
  }

  return collection; // Return primitive values as-is
}

// Example usage:
const snakeCaseObject = {
  first_name: "John",
  last_name: "Doe",
  address: {
    street_name: "Main St",
    city_name: "New York"
  }
};

const camelCaseObject = convertKeys(snakeCaseObject);
console.log(camelCaseObject);
```

### **Explanation of Solution 4:**

- **`convertKeys()`**: This function is similar to the previous ones, but it allows you to pass a custom `keyConverter` function.
- **Customization**: You can provide your own function to transform the keys. In this example, we used `toCamelCase` as the default.
- **Recursive**: Handles arrays, objects, and nested structures by recursively calling itself.

### **5. Final Solution with Edge Case Handling**

The final solution will account for edge cases like null values, non-object types, and empty arrays or objects.

```javascript
function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase())
            .replace(/^[A-Z]/, (match) => match.toLowerCase());
}

function isPrimitive(val) {
  return val === null || typeof val !== "object";
}

function camelCaseKeys(collection) {
  if (isPrimitive(collection)) {
    return collection; // Return primitive values unchanged
  }

  if (Array.isArray(collection)) {
    return collection.map(item => camelCaseKeys(item)); // Process each item in the array
  }

  if (typeof collection === 'object') {
    return Object.entries(collection).reduce((acc, [key, value]) => {
      const camelCaseKey = toCamelCase(key); // Convert key to camelCase
      acc[camelCaseKey] = camelCaseKeys(value); // Recursively handle nested values
      return acc;
    }, {});
  }

  return collection; // Return the original value if it's not an object or array
}

// Example usage:
const snakeCaseObject = {
  first_name: "John",
  last_name: "Doe",
  nested_obj: {
    some_property: "value",
    another_property: [
      { foo_bar: "baz" },
      { more_data: "example" }
    ]
  },
};

const camelCaseObject = camelCaseKeys(snakeCaseObject);
console.log(camelCaseObject);
```

---

### **Key Features of All Solutions:**

1. **Handling Objects and Arrays**: Each solution handles both arrays and nested objects, ensuring deep recursion for deeply nested structures.
2. **Preserving Values**: Only the keys are modified to camelCase, while the values remain untouched.
3. **Edge Case Handling**: The solutions handle edge cases like non-object/array values, null, and empty