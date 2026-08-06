Here's the code for the given tasks:

### 1. Convert a JS value to a JSON string.

```javascript
const jsValue = { name: "Alice", age: 25 };
const jsonString = JSON.stringify(jsValue);
console.log(jsonString); // Output: '{"name":"Alice","age":25}'
```

### 2. Perform a deep copy of a value, handling circular references.

```javascript
function deepCopy(obj, cache = new Map()) {
  if (obj === null || typeof obj !== "object") return obj;

  if (cache.has(obj)) return cache.get(obj); // Handle circular references

  const copy = Array.isArray(obj) ? [] : {};
  cache.set(obj, copy);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = deepCopy(obj[key], cache);
    }
  }
  return copy;
}

const circularObj = { name: "Alice" };
circularObj.self = circularObj; // Circular reference

const copiedObj = deepCopy(circularObj);
console.log(copiedObj); // Output: { name: 'Alice', self: [Circular] }
```

### 3. Convert a JSON string back to a JS value.

```javascript
const jsonString = '{"name":"Alice","age":25}';
const jsValue = JSON.parse(jsonString);
console.log(jsValue); // Output: { name: 'Alice', age: 25 }
```

### 4. Merge two objects, deeply combining properties.

```javascript
function deepMerge(target, source) {
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === "object" && source[key] !== null) {
        if (!target[key]) target[key] = Array.isArray(source[key]) ? [] : {};
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}

const obj1 = { name: "Alice", address: { city: "NYC" } };
const obj2 = { age: 25, address: { country: "USA" } };

const merged = deepMerge({}, obj1);
deepMerge(merged, obj2);
console.log(merged); // Output: { name: 'Alice', address: { city: 'NYC', country: 'USA' }, age: 25 }
```

### 5. Deep freeze an object, preventing any changes.

```javascript
function deepFreeze(obj) {
  Object.freeze(obj);

  for (let key in obj) {
    if (
      obj.hasOwnProperty(key) &&
      typeof obj[key] === "object" &&
      obj[key] !== null
    ) {
      deepFreeze(obj[key]);
    }
  }

  return obj;
}

const frozenObj = deepFreeze({ name: "Alice", address: { city: "NYC" } });
frozenObj.name = "Bob"; // This won't work, as the object is frozen
console.log(frozenObj.name); // Output: "Alice"
```

### 6. Write a polyfill for `typeof` to return the correct type.

```javascript
function myTypeof(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

console.log(myTypeof(42)); // Output: "number"
console.log(myTypeof("hello")); // Output: "string"
console.log(myTypeof([1, 2, 3])); // Output: "array"
console.log(myTypeof(null)); // Output: "null"
```

### 7. Convert a JS object into a query string.

```javascript
function toQueryString(obj) {
  return Object.keys(obj)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]))
    .join("&");
}

const queryObj = { name: "Alice", age: 25 };
const queryString = toQueryString(queryObj);
console.log(queryString); // Output: "name=Alice&age=25"
```

### 8. Parse a query string back into a JS object.

```javascript
function fromQueryString(queryString) {
  return queryString
    .slice(1) // Remove the '?' from the beginning
    .split("&")
    .reduce((obj, pair) => {
      const [key, value] = pair.split("=");
      obj[decodeURIComponent(key)] = decodeURIComponent(value);
      return obj;
    }, {});
}

const queryString = "name=Alice&age=25";
const obj = fromQueryString(queryString);
console.log(obj); // Output: { name: "Alice", age: "25" }
```

### 9. Return the longest word in a string.

```javascript
function longestWord(str) {
  return str
    .split(" ")
    .reduce(
      (longest, current) =>
        current.length > longest.length ? current : longest,
      "",
    );
}

console.log(longestWord("The quick brown fox jumped over the lazy dog")); // Output: "jumped"
```

### 10. Compare two objects for deep equality.

```javascript
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

const obj1 = { name: "Alice", age: 25 };
const obj2 = { name: "Alice", age: 25 };
const obj3 = { name: "Bob", age: 25 };

console.log(deepEqual(obj1, obj2)); // Output: true
console.log(deepEqual(obj1, obj3)); // Output: false
```

### 11. Flatten a deeply nested object.

```javascript
function flattenObject(obj, prefix = "") {
  let result = {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null) {
        Object.assign(result, flattenObject(obj[key], newKey));
      } else {
        result[newKey] = obj[key];
      }
    }
  }

  return result;
}

const nestedObj = { a: { b: { c: 1, d: 2 } }, e: 3 };
console.log(flattenObject(nestedObj)); // Output: { "a.b.c": 1, "a.b.d": 2, e: 3 }
```

### 12. Rename keys in an object based on a mapping.

```javascript
function renameKeys(obj, keyMapping) {
  const newObj = {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = keyMapping[key] || key; // Use the new key if it exists, otherwise keep the original
      newObj[newKey] = obj[key];
    }
  }

  return newObj;
}

const obj = { firstName: "Alice", lastName: "Smith" };
const mapping = { firstName: "first_name", lastName: "last_name" };

const renamedObj = renameKeys(obj, mapping);
console.log(renamedObj); // Output: { first_name: 'Alice', last_name: 'Smith' }
```

### Summary:

These functions cover various tasks like handling JSON, deep copying, object merging, freezing, query string manipulation, and deep equality checks. They should serve as useful utilities in handling objects and strings efficiently.
