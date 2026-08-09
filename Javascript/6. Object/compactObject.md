Here is the complete guide and solution for LeetCode #2705: **Compact Object** (recursively removing all falsy values from an object or array).

---

### Solution

```javascript
/**
 * Recursively removes all falsy values from an object or array.
 *
 * @param {Object|Array} obj - The input object or array.
 * @return {Object|Array} Compacted object or array.
 */
var compactObject = function(obj) {
  // Base cases: if obj is null or not an object/array, return it as-is
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle Array case: filter out falsy items and recursively compact truthy elements
  if (Array.isArray(obj)) {
    const compactArr = [];
    for (const item of obj) {
      if (Boolean(item)) {
        compactArr.push(compactObject(item));
      }
    }
    return compactArr;
  }

  // Handle Object case: iterate keys and keep only truthy values (compacted)
  const compactObj = {};
  for (const key in obj) {
    if (Boolean(obj[key])) {
      compactObj[key] = compactObject(obj[key]);
    }
  }
  return compactObj;
};

```

---

### Alternative Implementation Approaches

#### 1. Functional Approach (`Array.prototype.reduce` / `filter`)

```javascript
var compactObject = function(obj) {
  if (obj === null || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj
      .filter(Boolean)
      .map(compactObject);
  }

  return Object.keys(obj).reduce((acc, key) => {
    if (Boolean(obj[key])) {
      acc[key] = compactObject(obj[key]);
    }
    return acc;
  }, {});
};

```

#### 2. Iterative Depth-First Search with Stack (Avoids Stack Overflow)

For extreme nesting depths, an explicit stack prevents exceeding maximum recursion limit:

```javascript
var compactObject = function(obj) {
  if (obj === null || typeof obj !== 'object') return obj;

  // DFS stack storing [source, targetRef, key/index]
  const stack = [[obj, null, null]];
  let root = null;

  while (stack.length > 0) {
    const [curr, parent, key] = stack.pop();
    let compacted;

    if (curr === null || typeof curr !== 'object') {
      compacted = curr;
    } else if (Array.isArray(curr)) {
      compacted = [];
      for (let i = curr.length - 1; i >= 0; i--) {
        if (Boolean(curr[i])) {
          stack.push([curr[i], compacted, null]);
        }
      }
    } else {
      compacted = {};
      for (const k in curr) {
        if (Boolean(curr[k])) {
          stack.push([curr[k], compacted, k]);
        }
      }
    }

    if (parent === null) {
      root = compacted;
    } else if (Array.isArray(parent)) {
      parent.push(compacted);
    } else {
      parent[key] = compacted;
    }
  }

  return root;
};

```

---

### Usage Examples

#### Example 1: Simple Object with Falsy Values

```javascript
const obj = { "a": null, "b": [false, 1] };
console.log(compactObject(obj));
// Output: { "b": [1] }

```

#### Example 2: Flat Array with Falsy Values

```javascript
const obj = [null, 0, false, 1];
console.log(compactObject(obj));
// Output: [1]

```

#### Example 3: Deeply Nested Structure

```javascript
const obj = { "a": 1, "b": 0, "c": { "d": "", "e": [0, false, 42] } };
console.log(compactObject(obj));
// Output: { "a": 1, "c": { "e": [42] } }

```

---

### Key Takeaways

1. **Falsy Values in JavaScript:** Values that evaluate to `false` in a boolean context are `false`, `0`, `""` (empty string), `null`, `undefined`, and `NaN`.
2. **`typeof null === 'object'` Trap:** In JavaScript, `typeof null` returns `"object"`. You must check `obj === null` explicitly before treating `obj` as an iterable object.
3. **Array vs Object Differences:**

* **Arrays:** Falsy elements are completely dropped, shortening the resulting array length.
* **Objects:** Keys with falsy values are omitted from the compacted output object.
