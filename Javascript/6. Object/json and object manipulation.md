Here's the code for the given tasks:

### 1. Convert a JS value to a JSON string

```javascript
const jsValue = { name: "Alice", age: 25 };
const jsonString = JSON.stringify(jsValue);
console.log(jsonString); // Output: '{"name":"Alice","age":25}'
```

### 2. Perform a deep copy of a value, handling circular references

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

### 3. Convert a JSON string back to a JS value

```javascript
const jsonString = '{"name":"Alice","age":25}';
const jsValue = JSON.parse(jsonString);
console.log(jsValue); // Output: { name: 'Alice', age: 25 }
```

### 4. Merge two objects, deeply combining properties

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

### 5. Deep freeze an object, preventing any changes

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

### 6. Write a polyfill for `typeof` to return the correct type

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

### 7. Convert a JS object into a query string

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

### 8. Parse a query string back into a JS object

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

### 9. Return the longest word in a string

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

### 10. Compare two objects for deep equality

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

### 11. Flatten a deeply nested object

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

### 12. Rename keys in an object based on a mapping

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

### Summary

These functions cover various tasks like handling JSON, deep copying, object merging, freezing, query string manipulation, and deep equality checks. They should serve as useful utilities in handling objects and strings efficiently.

Your collection of core JavaScript utilities covers many essential interview and utility patterns. However, several of these implementations contain subtle edge cases and bugs that can lead to unexpected failures in production.

Here is a breakdown of the critical issues across these functions and how to fix them.

---

## 1. Deep Merge (`#4`) Overwrites Arrays Instead of Merging

In your `deepMerge`, if both `target` and `source` contain arrays or nested objects, `target[key]` gets mutated or completely overwritten if it doesn't match expected structures.

### The Bug

```javascript
// Current behavior: Array elements get merged like key-value objects!
const obj1 = { tags: ['a', 'b'] };
const obj2 = { tags: ['c'] };

// Output: { tags: ['c', 'b'] } 🚨 (Index 0 overwritten, index 1 preserved)

```

### The Production Fix

Explicitly handle array concats or replacements vs object merges:

```javascript
function deepMerge(target, source) {
  if (typeof target !== "object" || target === null) target = {};

  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    const tgtVal = target[key];

    if (Array.isArray(srcVal)) {
      target[key] = Array.isArray(tgtVal) ? [...tgtVal, ...srcVal] : [...srcVal];
    } else if (typeof srcVal === "object" && srcVal !== null) {
      target[key] = deepMerge(tgtVal || {}, srcVal);
    } else {
      target[key] = srcVal;
    }
  }
  return target;
}

```

---

## 2. Polyfill for `typeof` (`#6`) Misses `Set`, `Map`, `Date`, `RegExp`

Your `myTypeof` correctly handles `null` and `Array`, but returns `"object"` for `Date`, `RegExp`, `Map`, and `Set`.

### The Production Fix

Use `Object.prototype.toString.call(value)` to extract the true underlying JS internal type tag:

```javascript
function myTypeof(value) {
  if (value === null) return "null";
  
  // Extract '[object Type]' -> 'type'
  const rawType = Object.prototype.toString.call(value);
  return rawType.slice(8, -1).toLowerCase();
}

console.log(myTypeof(new Date()));    // "date" ✅
console.log(myTypeof(/abc/));         // "regexp" ✅
console.log(myTypeof(new Map()));     // "map" ✅
console.log(myTypeof([1, 2, 3]));     // "array" ✅

```

---

## 3. Query String Parser (`#8`) Fails on Leading `?`

Your code uses `queryString.slice(1)`. If a query string is passed **without** a leading `?` (e.g., `"name=Alice&age=25"`), `slice(1)` cuts off the first character, resulting in `"ame=Alice"`.

### The Production Fix

Use `URLSearchParams` or conditionally strip `?`:

```javascript
// Modern Standard Solution
function fromQueryString(queryString) {
  const params = new URLSearchParams(queryString);
  return Object.fromEntries(params.entries());
}

console.log(fromQueryString("?name=Alice&age=25")); // { name: "Alice", age: "25" }
console.log(fromQueryString("name=Alice&age=25"));  // { name: "Alice", age: "25" }

```

---

## 4. Flatten Object (`#11`) Flattens Arrays and Destroys Empty Objects

If an object contains an array (`{ a: [10, 20] }`) or an empty object (`{ a: {} }`), your function coerces array indices into keys (`"a.0": 10`) and drops empty objects entirely.

### The Production Fix

Guard against arrays and empty objects:

```javascript
function flattenObject(obj, prefix = "") {
  return Object.keys(obj).reduce((acc, key) => {
    const pre = prefix ? `${prefix}.${key}` : key;
    const val = obj[key];

    if (
      typeof val === "object" && 
      val !== null && 
      !Array.isArray(val) && 
      Object.keys(val).length > 0
    ) {
      Object.assign(acc, flattenObject(val, pre));
    } else {
      acc[pre] = val;
    }
    return acc;
  }, {});
}

const nested = { a: { b: {} }, tags: ["js", "web"] };
console.log(flattenObject(nested)); 
// Output: { "a.b": {}, tags: ["js", "web"] } ✅

```

---

## Summary Matrix of Edge Cases

| Function                 | Hidden Edge Case                                                    | Impact                                                          |
| ------------------------ | ------------------------------------------------------------------- | --------------------------------------------------------------- |
| **`deepCopy` (`#2`)**    | Doesn't copy `Date`, `RegExp`, `Map`, `Set` instances.              | Converts custom data structures into empty `{}` objects.        |
| **`deepFreeze` (`#5`)**  | Circular references cause infinite recursion stack overflow.        | Crashes with `RangeError: Maximum call stack size exceeded`.    |
| **`longestWord` (`#9`)** | Strips punctuation with words (e.g., `"hello!"` counts as 6 chars). | Return values include attached punctuation like commas/periods. |
| **`deepEqual` (`#10`)**  | Order of object keys doesn't matter, but `NaN !== NaN` fails.       | `deepEqual({ a: NaN }, { a: NaN })` evaluates to `false`.       |
