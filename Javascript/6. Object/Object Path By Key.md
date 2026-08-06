Both functions you've written are useful for accessing nested values in JavaScript objects using a string path. Below is an explanation and minor enhancements to ensure robust handling of edge cases, including better handling of undefined properties and missing keys.

---

### 1. `getObjectValue` function:

This function takes an object and a string path (e.g., `"a.b.c"`) and returns the value found at that path. It traverses the object step by step, checking if each key exists and if the value is an object.

#### **Code:**

```javascript
function getObjectValue(obj, keys) {
  // Split the keys into an array using "." as a separator
  const keyArray = keys.split(".");

  // Traverse the object using the keys
  let value = obj;
  for (let key of keyArray) {
    // Check if the current value is an object and contains the key
    if (value && typeof value === "object" && key in value) {
      value = value[key];
    } else {
      // If any key is not found or value is not an object, return undefined
      return undefined;
    }
  }

  return value;
}

// Example usage:
const obj = {
  a: {
    b: {
      c: 123,
    },
  },
};

const keys = "a.b.c";
const value = getObjectValue(obj, keys);
console.log("Value:", value); // Output: 123
```

#### **Explanation:**
- The function splits the `keys` string (e.g., `"a.b.c"`) into an array `keyArray` with each key.
- It iterates through each key and tries to access it in the current object. If at any point, the key does not exist or the value is not an object, it returns `undefined`.

#### **Edge Cases Handled:**
- If any key does not exist or if a non-object value is encountered along the path, it gracefully returns `undefined`.

---

### 2. `getObjectPathByKey` function:

This function is similar but with a slight difference in how it checks if a key exists in an object and then returns the corresponding value. It also avoids any unnecessary checks when a key is missing.

#### **Code:**

```javascript
function getObjectPathByKey(obj, path) {
  // Split the path string into an array of keys
  const keys = path.split(".");

  // Iterate over the keys to access nested properties
  let currentObj = obj;
  for (let key of keys) {
    // If the current object doesn't have the key, return undefined
    if (!currentObj || !currentObj.hasOwnProperty(key)) {
      return undefined;
    }
    // Move to the next nested object
    currentObj = currentObj[key];
  }

  // Return the value found at the end of the path
  return currentObj;
}

// Example usage:
const data = {
  foo: {
    bar: {
      baz: "value",
    },
  },
};

const path = "foo.bar.baz";
console.log(getObjectPathByKey(data, path)); // Output: 'value'
```

#### **Explanation:**
- Like the first function, this one splits the path and iterates through the keys.
- The key check is done using `.hasOwnProperty()` to ensure we're checking if the object **directly** contains the key (and not in the prototype chain).

#### **Edge Cases Handled:**
- If the key doesn't exist, the function will return `undefined`.
- It ensures that we don't accidentally get properties from the object's prototype chain, only from the object itself.

---

### **Possible Enhancements / Additions**

1. **Customizing the Default Return Value:**
   You could modify both functions to accept an optional third parameter for a default return value (instead of `undefined`). For example, if a key is missing, you can return a custom message like `"Not found"` or even a default value like `null`.

2. **Handling Arrays:**
   Both of these functions assume that the object is a regular object. If your objects could also include arrays (which they often do), you might want to extend the function to handle arrays by checking if the current value is an array and if the key is a valid index.

---

### **Enhancement Example (handling missing keys with default value):**

```javascript
function getObjectValueWithDefault(obj, keys, defaultValue = undefined) {
  const keyArray = keys.split(".");
  let value = obj;
  
  for (let key of keyArray) {
    if (value && typeof value === "object" && key in value) {
      value = value[key];
    } else {
      return defaultValue; // Return the default value if key not found
    }
  }

  return value;
}

// Example usage:
const obj = {
  a: {
    b: {
      c: 123,
    },
  },
};

const keys = "a.b.d";  // Non-existing key
console.log(getObjectValueWithDefault(obj, keys, "Key not found"));  // Output: "Key not found"
```

- In this enhancement, the function returns a custom default value (`"Key not found"`) when a key does not exist, rather than `undefined`.

---

### **Enhancement Example (Handling arrays):**

```javascript
function getObjectValueWithArrays(obj, keys) {
  const keyArray = keys.split(".");
  let value = obj;
  
  for (let key of keyArray) {
    // If the value is an array, use the key as an index
    if (Array.isArray(value)) {
      key = parseInt(key, 10); // Convert the key to a number if it's an array index
    }
    
    if (value && typeof value === "object" && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }

  return value;
}

// Example usage with array:
const obj = {
  a: [
    { b: 123 },
    { c: 456 },
  ],
};

console.log(getObjectValueWithArrays(obj, "a.1.c"));  // Output: 456
```

- This function extends the previous logic to handle arrays, converting the path's key into an index if the current value is an array.

---

### Conclusion:

Both `getObjectValue` and `getObjectPathByKey` are useful functions for accessing nested properties in an object, and can easily be customized to suit more complex use cases (like handling arrays, default values, etc.). The current versions already handle most edge cases well, such as missing keys and invalid paths.