Here are various implementations for **deep cloning** objects, including solutions that handle circular references and nested objects. Each implementation uses a different approach to achieve the deep copy.

---

### 1. **Deep Clone with `WeakMap` for Circular References**

This version ensures that circular references are handled by using a `WeakMap` to keep track of already cloned objects.

```js
function deepCopy(value) {
  const seen = new WeakMap(); // To track already copied objects

  function _copy(value) {
    if (typeof value !== 'object' || value === null) {
      return value; // Primitive types - return directly
    }

    if (seen.has(value)) {
      return seen.get(value);  // Circular reference detected
    }

    const copy = Array.isArray(value) ? [] : {};
    seen.set(value, copy); // Mark the original as seen

    for (const key in value) {
      if (value.hasOwnProperty(key)) { 
        copy[key] = _copy(value[key]); // Recursively copy nested properties 
      }
    }

    return copy;
  }

  return _copy(value);
}

// Example usage
const circularObject = { a: 1, b: {} };
circularObject.b.c = circularObject; // Create a circular reference

const deepCopiedObject = deepCopy(circularObject);
console.log(deepCopiedObject); 
console.log(deepCopiedObject === circularObject);  // false
console.log(deepCopiedObject.b.c === deepCopiedObject);  // true
```

---

### 2. **Simple Deep Clone (Handling Arrays and Objects)**

This version uses `Array.isArray` and recursion to deep clone arrays and objects but does not handle circular references.

```js
const isObject = (data) => typeof data === "object";
const isArray = (data) => Object.prototype.toString.call(data) === "[object Array]";

const deepClone = (data) => {
  let clone; // can be a primitive, an array, or an object

  if (!isObject(data) || data === null) {
    clone = data;
    return clone;
  }

  // when data is an array
  if (isArray(data)) {
    clone = [];
    for (let i = 0; i < data.length; i++) {
      clone[i] = deepClone(data[i]);
    }
  }

  // when data is an object
  clone = {};
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      if (!isObject(data[key])) {
        clone[key] = data[key];
      } else {
        // when the key is itself an object (nested object)
        clone[key] = deepClone(data[key]);
      }
    }
  }
  return clone;
};

module.exports = deepClone;
```

---

### 3. **Deep Clone Using `Object.entries`**

This version uses `Object.entries()` and recursion to perform the deep cloning of objects and arrays.

```js
function deepClone(obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  } else if (typeof obj === "object" && obj !== null) {
    const clone = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        clone[key] = deepClone(obj[key]);
      }
    }
    return clone;
  } else {
    return obj;
  }
}
```

---

### 4. **Deep Clone Using `Object.keys()` with Recursion**

This implementation uses `Object.keys()` to iterate through object properties and recursively deep clones them.

```js
const clone = (input) => {
  if (input === null || typeof input !== "object") {
    return input;
  }

  let initialValue = Array.isArray(input) ? [] : {};
  return Object.keys(input).reduce((acc, key) => {
    acc[key] = clone(input[key]);
    return acc;
  }, initialValue);
};
```

---

### 5. **Deep Clone with ES6 `Object.fromEntries()`**

This version uses ES6 `Object.fromEntries()` to deep clone an object. It also handles arrays and nested objects.

```js
export default function deepClone(value) {
  if (typeof value !== "object" || value === null) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item));
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, value]) => [key, deepClone(value)]),
  );
}
```

---

### 6. **Deep Clone Using `JSON.parse` and `JSON.stringify`**

This is the most basic deep cloning approach but is limited to objects and arrays without functions, `undefined`, or circular references.

```js
export default function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}
```

**Limitations**:
- Does not handle `undefined`, `functions`, `Date`, `RegExp`, or `undefined` values properly.
- Cannot handle circular references.

---

### 7. **Deep Clone with Circular References (Using `WeakMap`)**

A more robust deep clone solution that handles circular references using `WeakMap`.

```js
function deepCloneWithCircular(obj, cloneMap = new WeakMap()) {
  // Handle non-object types and null
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  // Check if we've already cloned this object
  if (cloneMap.has(obj)) {
    return cloneMap.get(obj);
  }

  // Create a new object or array for the clone
  let clone = Array.isArray(obj) ? [] : {};

  // Record this object in the clone map
  cloneMap.set(obj, clone);

  // Clone all properties recursively
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepCloneWithCircular(obj[key], cloneMap);
    }
  }

  return clone;
}
```

---

### 8. **Deep Clone with `Map` for Circular References**

This version is similar to the `WeakMap` version but uses a `Map`. It's also a valid approach if you need to keep track of all objects, not just those referenced by the clone.

```js
function deepClone(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  const seen = new Map();

  function clone(obj) {
    if (seen.has(obj)) {
      return seen.get(obj);
    }

    const newObj = Array.isArray(obj) ? [] : {};
    seen.set(obj, newObj);

    for (const key in obj) {
      const value = obj[key];
      newObj[key] = clone(value);
    }

    return newObj;
  }

  return clone(obj);
}
```

---

### Summary of Key Points:
- **Circular References**: The solutions using `WeakMap` or `Map` handle circular references, preventing infinite loops during recursion.
- **Primitive Types**: All deep cloning solutions handle primitive types like numbers, strings, and booleans by directly returning them without modification.
- **Array Handling**: Arrays are cloned recursively in all implementations that support deep cloning, ensuring that each element is copied correctly.
- **Limitations**: The `JSON.parse(JSON.stringify(...))` method is simple but fails for complex objects, such as those containing functions, `undefined`, or `Date` objects.