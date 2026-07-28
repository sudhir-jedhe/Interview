### 42. Check if two values are deeply equal

To check if two values are deeply equal (i.e., they have the same properties and values recursively), we can create a recursive comparison function.

```javascript
function deepEqual(a, b) {
  if (a === b) return true; // Handles primitives and same reference objects
  if (
    typeof a !== "object" ||
    a === null ||
    typeof b !== "object" ||
    b === null
  )
    return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (let key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}
```

- `deepEqual`: Recursively checks if two objects (or arrays) are deeply equal.

Example usage:

```javascript
console.log(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })); // true
console.log(deepEqual([1, 2], [1, 2])); // true
```

---

### 43. Recursively flatten an array to a single level

To recursively flatten an array, we can use recursion to handle nested arrays:

```javascript
function flatten(array) {
  return array.reduce((acc, item) => {
    if (Array.isArray(item)) {
      acc.push(...flatten(item)); // Recursively flatten the nested array
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
}
```

- `flatten`: Flattens a nested array to a single level.

Example usage:

```javascript
console.log(flatten([1, [2, [3, 4]], 5])); // Output: [1, 2, 3, 4, 5]
```

---

### 44. Implement negative indexing in arrays using Proxies

A `Proxy` can be used to intercept array accesses and implement negative indexing.

```javascript
const createNegativeIndexArray = (arr) => {
  return new Proxy(arr, {
    get(target, prop) {
      if (typeof prop === "string" && prop.startsWith("-")) {
        const index = Number(prop.slice(1));
        return target[target.length + index];
      }
      return target[prop];
    },
  });
};
```

- `createNegativeIndexArray`: Wraps an array in a `Proxy` to support negative indexing.

Example usage:

```javascript
const arr = createNegativeIndexArray([10, 20, 30, 40]);
console.log(arr["-1"]); // Output: 40
console.log(arr["-2"]); // Output: 30
```

---

### 45. Create a custom version of Lodash's `_.get` method

The `_.get` method retrieves a value at a given path, returning `undefined` if the path doesn't exist.

```javascript
function get(obj, path, defaultValue = undefined) {
  const keys = path.split(".");
  let result = obj;

  for (let key of keys) {
    if (result && key in result) {
      result = result[key];
    } else {
      return defaultValue;
    }
  }

  return result;
}
```

- `get`: Retrieves a value from an object at a given path, with an optional default value if the path does not exist.

Example usage:

```javascript
const obj = { a: { b: { c: 42 } } };
console.log(get(obj, "a.b.c")); // 42
console.log(get(obj, "a.x", "default")); // 'default'
```

---

### 46. Find the intersection of two arrays

To find the intersection of two arrays, we can use `filter` and `includes`:

```javascript
function intersection(arr1, arr2) {
  return arr1.filter((value) => arr2.includes(value));
}
```

- `intersection`: Returns the common elements between two arrays.

Example usage:

```javascript
console.log(intersection([1, 2, 3], [2, 3, 4])); // Output: [2, 3]
```

---

### 47. Remove duplicates from an array

To remove duplicates from an array, we can use a `Set` to automatically filter out repeated values:

```javascript
function unique(arr) {
  return [...new Set(arr)];
}
```

- `unique`: Removes duplicates from an array by converting it to a `Set` and back to an array.

Example usage:

```javascript
console.log(unique([1, 2, 2, 3, 4, 4, 5])); // Output: [1, 2, 3, 4, 5]
```

---

### 48. Sort an array of objects by a property

To sort an array of objects by a property, you can use the `sort` method with a custom comparator:

```javascript
function sortByProperty(arr, property) {
  return arr.sort((a, b) => {
    if (a[property] < b[property]) return -1;
    if (a[property] > b[property]) return 1;
    return 0;
  });
}
```

- `sortByProperty`: Sorts an array of objects based on a specified property.

Example usage:

```javascript
const arr = [
  { name: "John", age: 25 },
  { name: "Jane", age: 22 },
];
console.log(sortByProperty(arr, "age")); // Output: [{ name: 'Jane', age: 22 }, { name: 'John', age: 25 }]
```

---

### 49. Group an array of objects by a property

To group an array of objects by a specific property, we can use `reduce` to accumulate objects into groups:

```javascript
function groupBy(arr, property) {
  return arr.reduce((acc, item) => {
    const key = item[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
}
```

- `groupBy`: Groups an array of objects by the specified property.

Example usage:

```javascript
const arr = [
  { type: "fruit", name: "apple" },
  { type: "vegetable", name: "carrot" },
  { type: "fruit", name: "banana" },
];
console.log(groupBy(arr, "type"));
// Output: { fruit: [{ type: 'fruit', name: 'apple' }, { type: 'fruit', name: 'banana' }], vegetable: [{ type: 'vegetable', name: 'carrot' }] }
```

---

### 50. Rotate an array to the left by k positions

To rotate an array to the left, you can use `slice` and `concat` to reorder the elements:

```javascript
function rotateLeft(arr, k) {
  const len = arr.length;
  k = k % len; // To handle cases where k is larger than array length
  return arr.slice(k).concat(arr.slice(0, k));
}
```

- `rotateLeft`: Rotates an array `arr` to the left by `k` positions.

Example usage:

```javascript
console.log(rotateLeft([1, 2, 3, 4, 5], 2)); // Output: [3, 4, 5, 1, 2]
```

---

### 51. Reverse the words in a string while maintaining their order

To reverse the words in a string without changing their order, split the string by spaces, reverse each word, and then join them back.

```javascript
function reverseWords(str) {
  return str.split(" ").reverse().join(" ");
}
```

- `reverseWords`: Reverses the words in a string while keeping their original order.

Example usage:

```javascript
console.log(reverseWords("Hello World! How are you?")); // Output: 'you? are How World! Hello'
```

---

These implementations cover a variety of array and object manipulation tasks, such as deep equality checking, grouping, sorting, rotating, and even string manipulation like reversing words. These utilities provide core functionality useful in many JavaScript applications.

Here is a review of your utility functions. Most of these snippets are great, but **a few have subtle bugs that will fail in senior technical interviews** or edge-case tests.

Below are the key fixes and production-ready improvements for your list:

---

### Bug Fixes & Refinements

#### Fix #1: Proxy Negative Indexing (#44)

In your snippet: `const index = Number(prop.slice(1))` extracts `1` from `"-1"`, resulting in `target[length + 1]` (out of bounds!). You need `length - index` or keep the negative sign and add it: `target[length + Number(prop)]`.

```javascript
const createNegativeIndexArray = (arr) => {
  return new Proxy(arr, {
    get(target, prop) {
      if (typeof prop === "string") {
        const index = Number(prop);
        if (index < 0) {
          return target[target.length + index];
        }
      }
      return target[prop];
    },
  });
};

const arr = createNegativeIndexArray([10, 20, 30, 40]);
console.log(arr[-1]); // 40 (Handles numeric or string prop accesses)
console.log(arr[-2]); // 30
```

---

#### Fix #2: Array Intersection Performance (#46)

Using `filter` + `includes` runs in **$\mathcal{O}(n \cdot m)$ time** and returns duplicates if `arr1` contains repeating elements. Using a `Set` brings lookups down to **$\mathcal{O}(n + m)$ time** and ensures uniqueness.

```javascript
function intersection(arr1, arr2) {
  const set2 = new Set(arr2);
  return [...new Set(arr1)].filter((item) => set2.has(item));
}

console.log(intersection([1, 2, 2, 3], [2, 3, 4])); // [2, 3]
```

---

#### Fix #3: Lodash `_.get` Array & Bracket Support (#45)

Lodash paths often contain brackets or multiple separators (e.g., `'a.b[0].c'`). Standard `.split('.')` breaks on array indices.

```javascript
function get(obj, path, defaultValue = undefined) {
  // Normalize bracket notation: 'a.b[0].c' -> ['a', 'b', '0', 'c']
  const keys = Array.isArray(path)
    ? path
    : path
        .replace(/\[(\d+)\]/g, ".$1")
        .split(".")
        .filter(Boolean);

  let result = obj;
  for (let key of keys) {
    if (result !== null && result !== undefined && key in Object(result)) {
      result = result[key];
    } else {
      return defaultValue;
    }
  }

  return result === undefined ? defaultValue : result;
}

const obj = { a: { b: [{ c: 42 }] } };
console.log(get(obj, "a.b[0].c")); // 42
console.log(get(obj, "a.b.1.c", "fallback")); // 'fallback'
```

---

#### Fix #4: Reversing Words vs Reversing String (#51)

Your title says _"Reverse the words while maintaining their order"_, but your code reverses the array of words itself (`"Hello World"` $\rightarrow$ `"World Hello"`). If the goal is to **reverse the letters inside each word** while keeping word order:

```javascript
function reverseLettersInWords(str) {
  return str
    .split(" ")
    .map((word) => word.split("").reverse().join(""))
    .join(" ");
}

console.log(reverseLettersInWords("Hello World!")); // 'olleH !dlroW'
```

---

### Quick Review Table

| Snippet                   | Status           | Recommendation                                                                                                          |
| ------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **#42 Deep Equal**        | ✅ Solid         | Works well for JSON-serializable structures. _(Note: Doesn't handle cyclic objects, `Date`, or `RegExp`)._              |
| **#43 Flatten Array**     | ✅ Good          | Standard recursion. Note: `Array.prototype.flat(Infinity)` is native now.                                               |
| **#44 Negative Indexing** | ⚠️ Bug           | Fixed above to use `length + Number(prop)`.                                                                             |
| **#45 `\_.get**`          | ⚠️ Basic         | Enhanced above to handle array brackets `[0]`.                                                                          |
| **#46 Intersection**      | ⚡ Sub-optimal   | Optimized above with `Set` for $\mathcal{O}(n)$ runtime.                                                                |
| **#47 Remove Duplicates** | ✅ Ideal         | Idiomatic ES6 `[...new Set(arr)]`.                                                                                      |
| **#48 Sort Objects**      | ✅ Solid         | Standard `sort()` comparator. _(Note: Mutates original array; use `toSorted()` or `[...arr].sort()` for immutability)._ |
| **#49 Group By**          | ✅ Good          | Standard `reduce`. Note: `Object.groupBy(arr, callback)` is now native in modern JS.                                    |
| **#50 Rotate Left**       | ✅ Perfect       | Clean handle on modulo arithmetic `k % len`.                                                                            |
| **#51 Reverse Words**     | ⚠️ Clarification | Depends on whether you reverse the word order or character order per word.                                              |
