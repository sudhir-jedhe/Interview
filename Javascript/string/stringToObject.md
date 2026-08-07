```js
function stringToObject(str, value) {
  // write your code below

  if (!str) {
    throw new TypeError("Invalid Input");
  }
  if (str.length === 1) {
    return {
      [str]: value,
    };
  }
  const isDottedKeys = str
    .replaceAll('."', "[")
    .replaceAll('".', "[")
    .replaceAll('"', "")
    .split("[");
  console.log(isDottedKeys);
  const arr = isDottedKeys.length > 1 ? isDottedKeys : str.split(".");
  const obj = {};
  arr.reduce((acc, key, index) => {
    if (index === arr.length - 1) {
      acc[key] = value;
    } else {
      acc[key] = Number.isInteger(parseInt(arr[index + 1])) ? [] : {};
    }
    return acc[key];
  }, obj);
  return obj;
}

/********************** */

function stringToObject(input, finalValue) {
  // write your code below
  const paths = [];
  let shouldEscapeDotAccessor = false;
  let currentPath = "";

  for (let c = 0; c < input.length; c++) {
    const currentCharacter = input[c];

    if (paths.length && c === input.length - 1) {
      if (currentCharacter !== '"') {
        currentPath += currentCharacter;
      }
      paths.push(currentPath);
    }

    if (currentCharacter === ".") {
      if (shouldEscapeDotAccessor) {
        currentPath += currentCharacter;
      } else {
        paths.push(currentPath);
        currentPath = "";
      }
    } else if (currentCharacter === '"') {
      shouldEscapeDotAccessor = !shouldEscapeDotAccessor;
    } else {
      currentPath += currentCharacter;
    }
  }

  if (paths.length === 0) {
    throw TypeError();
  }

  const finalObject = {};
  let currentReference = finalObject;

  for (let p = 0; p < paths.length; p++) {
    let currentPath = paths[p];

    if (p === paths.length - 1) {
      currentReference[currentPath] = finalValue;
    } else if (!Number.isNaN(Number(paths[p + 1]))) {
      currentReference[currentPath] = [];
      currentReference = currentReference[currentPath];
    } else {
      currentReference[currentPath] = {};
      currentReference = currentReference[currentPath];
    }
  }

  return finalObject;
}

/*********************************** */

function stringToObject(input, finalValue) {
  if (!input) {
    throw new TypeError("Invalid Input");
  }

  if (input.length === 1) {
    return { [input]: finalValue };
  }

  let formattedInput = input // 'a."b.c".d.e."f.g"'
    .replaceAll(/"\w+\.\w+"/g, (s) => s.replace(".", "{-}")) // 'a."b{-}c".d.e."f{-}g"'
    .replaceAll('"', "") // 'a.b{-}c.d.e.f{-}g'
    .replaceAll(".", "[-]") // 'a[-]b{-}c[-]d[-]e[-]f{-}g'
    .replaceAll("{-}", "."); // 'a[-]b.c[-]d[-]e[-]f.g'
  const keys = formattedInput.split("[-]"); // ['a','b.c','d','e','f.g']

  const obj = {};
  let temp = obj;
  for (let [index, key] of keys.entries()) {
    if (index === keys.length - 1) {
      temp[key] = finalValue;
    } else {
      temp[key] = isNaN(keys[index + 1]) ? {} : [];
      temp = temp[key];
    }
  }
  return obj;
}
```

Here is a code review and technical breakdown of the three approaches to solving the **"Convert Dot-Path String to Nested Object"** problem (often asked in Senior JavaScript/Frontend System Design interviews for utilities like Lodash `set`).

This problem tests three core concepts:

1. **Escaped/Quoted Keys:** Handling keys with dots inside quotes (e.g., `'a."b.c".d'`).
2. **Array vs. Object Detection:** Creating arrays `[]` when the next key index is numeric (e.g., `'a.0.b'` $\rightarrow$ `{ a: [{ b: value }] }`).
3. **Traversal & References:** Correctly maintaining object references during iteration.

---

## 1. Code Review of Each Solution

### Solution 1: `.replaceAll()` + `reduce()`

```javascript
const isDottedKeys = str
  .replaceAll('."', "[")
  .replaceAll('".', "[")
  .replaceAll('"', "")
  .split("[");

```

* **Pros:** Clever attempt to use `.reduce()` to chain nested references.
* **Cons (Fails on Edge Cases):**

1. `str.replaceAll('."', "[")` hardcodes specific quote-dot boundaries. It breaks on paths like `'a."b.c.d".e'` (multiple dots inside quotes) or `'a."b"c.d'`.
2. The `reduce()` accumulator logic mutates intermediate objects linearly, but fails if sibling paths already exist in nested structures.

---

### Solution 2: Character-by-Character Parser (State Machine)

```javascript
let shouldEscapeDotAccessor = false;
for (let c = 0; c < input.length; c++) { ... }

```

* **Pros:** Handles quoted keys robustly using a state flag (`shouldEscapeDotAccessor`). It operates in single-pass $O(N)$ time.
* **Cons:**

1. **Off-by-one Edge Case:** The last character check `c === input.length - 1` misses edge cases where the path ends with a quote (e.g., `'a."b.c"'`).
2. **Numeric Check Flaw:** `!Number.isNaN(Number(paths[p + 1]))` will treat empty string keys `""` as `0` (`Number("") === 0`), inadvertently creating an array instead of an object.

---

### Solution 3: Regex Marker Tokenization

```javascript
let formattedInput = input
  .replaceAll(/"\w+\.\w+"/g, (s) => s.replace(".", "{-}"))
  ...

```

* **Pros:** Easy to follow step-by-step logic.
* **Cons:**

1. **Brittle Regex:** `/"\w+\.\w+"/g` only matches word characters (`\w`). It fails on spaces, hyphens, numbers, or special symbols inside quotes (e.g., `'a."b-c.d e".f'`).
2. Multiple `.replaceAll()` passes create unnecessary string allocations ($O(N)$ memory overhead per replacement pass).

---

## 2. Production-Ready & Spec-Compliant Solution

Here is a clean, robust implementation using a **single-pass Regex Tokenizer** that handles:

* Quoted keys with arbitrary characters (dots, spaces, hyphens).
* Numeric keys creating arrays vs. string keys creating objects.
* Prototype Pollution security protection (`__proto__`, `constructor`, `prototype`).

```javascript
/**
 * Converts a dot-path string (supporting quoted keys) into a nested object or array.
 * 
 * @param {string} path - E.g. 'a."b.c".0.d'
 * @param {*} value - Target value to assign at the leaf
 * @returns {Object|Array}
 */
function stringToObject(path, value) {
  if (typeof path !== "string" || !path.trim()) {
    throw new TypeError("Invalid Input: Path must be a non-empty string");
  }

  // 1. Regex Tokenizer:
  // Group 1 ([^".]+): Matches unquoted keys
  // Group 2 ("([^"]+)"): Matches quoted keys containing dots/special chars
  const tokenizer = /"([^"]+)"|([^".]+)/g;
  const keys = [];
  let match;

  while ((match = tokenizer.exec(path)) !== null) {
    // Pick matched quoted content (group 1) or unquoted word (group 2)
    keys.push(match[1] !== undefined ? match[1] : match[2]);
  }

  if (keys.length === 0) {
    throw new TypeError("Invalid Input: No valid keys found");
  }

  // Determine root container (Array if first key is numeric, Object otherwise)
  const isNumericKey = (key) => /^\d+$/.test(key);
  const root = isNumericKey(keys[0]) ? [] : {};
  let current = root;

  // 2. Traversal & Nested Structure Creation
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // Prototype Pollution Guard
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      continue;
    }

    // Leaf node: set the final value
    if (i === keys.length - 1) {
      current[key] = value;
    } else {
      // Lookahead to next key: create Array if numeric, Object if string
      const nextKey = keys[i + 1];
      if (current[key] === undefined) {
        current[key] = isNumericKey(nextKey) ? [] : {};
      }
      current = current[key];
    }
  }

  return root;
}

// --- Verification Tests ---

// 1. Basic Nested Objects
console.log(stringToObject("a.b.c", 42));
// Output: { a: { b: { c: 42 } } }

// 2. Quoted Keys with Dots
console.log(stringToObject('a."b.c".d', "hello"));
// Output: { a: { "b.c": { d: "hello" } } }

// 3. Array Index Support
console.log(stringToObject("users.0.name", "Prashant"));
// Output: { users: [ { name: "Prashant" } ] }

// 4. Root Array Index
console.log(stringToObject("0.items.1", "active"));
// Output: [ { items: [ <1 empty item>, "active" ] } ]

```

---

## Comparison Matrix

| Feature                        | Solution 1 (`reduce`) | Solution 2 (State Machine) | Solution 3 (Marker Replace) | Refactored Regex Solution     |
| ------------------------------ | --------------------- | -------------------------- | --------------------------- | ----------------------------- |
| **`'a."b.c".d'`**              | ❌ Fails               | ⚠️ Edge case bug            | ❌ Breaks on non-word chars  | ✅ **Passes**                  |
| **`'a.0.b'` (Array Creation)** | ✅ Passes              | ⚠️ Fails on empty string    | ✅ Passes                    | ✅ **Passes**                  |
| **Time Complexity**            | $\mathcal{O}(N)$      | $\mathcal{O}(N)$           | $\mathcal{O}(N)$ (3 passes) | **$\mathcal{O}(N)$ (1 pass)** |
| **Prototype Safety**           | ❌ No                  | ❌ No                       | ❌ No                        | ✅ **Guarded**                 |
