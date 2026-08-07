The code you've provided consists of two different implementations for inverting key-value pairs in an object. The first is for handling **unique values** (no duplicates in values), and the second is for handling **duplicate values** (where multiple keys may map to the same value).

### 1. **Inverting Key-Value Pairs (Unique Values)**

The goal here is to create a new object where the original object's values become the keys and the original keys become the values. This works only if the values in the original object are unique.

```javascript
const invertKeyValues = obj =>
    Object.fromEntries(
      Object.entries(obj).map(entry => entry.reverse())
    );

console.log(invertKeyValues({ a: 1, b: 2, c: 3 }));
// { 1: 'a', 2: 'b', 3: 'c' }

console.log(invertKeyValues({ a: 1, b: 2, c: 1 }));
// { 1: 'c', 2: 'b' }
```

#### Explanation

- `Object.entries(obj)` returns an array of `[key, value]` pairs from the object.
- `.map(entry => entry.reverse())` reverses each pair, swapping the key and value.
- `Object.fromEntries()` then converts the reversed entries back into an object.

**Important Note**: This approach does not handle duplicate values well. In the case where two keys have the same value (like `{ a: 1, c: 1 }`), only the last key (`'c'`) will be kept as the value (`1`), resulting in `{ 1: 'c', 2: 'b' }`.

---

### 2. **Inverting Key-Value Pairs (Handling Duplicates)**

When the values are not unique, we can't just replace the original values with keys. Instead, we need to store all the keys that map to the same value in an array.

```javascript
const invertKeyValues = obj =>
    Object.entries(obj).reduce((acc, [key, val]) => {
      acc[val] = acc[val] || [];  // Create an array if it doesn't exist yet
      acc[val].push(key);  // Add the key to the array for the given value
      return acc;
    }, {});

console.log(invertKeyValues({ a: 1, b: 2, c: 1 }));
// { 1: [ 'a', 'c' ], 2: [ 'b' ] }

console.log(invertKeyValues({ a: 1, b: 2, c: 1, d: 2 }));
// { 1: [ 'a', 'c' ], 2: [ 'b', 'd' ] }
```

#### Explanation

- `Object.entries(obj)` again returns an array of `[key, value]` pairs.
- `.reduce()` is used to accumulate a result (`acc` is the accumulator) by iterating over each entry.
- For each key-value pair:
  - `acc[val] = acc[val] || []` ensures that if the value does not yet exist as a key in the accumulator, we create an empty array for it.
  - `acc[val].push(key)` adds the current key to the array associated with the value.
- The final result is an object where each value is mapped to an array of keys that have that value.

This approach handles duplicates by storing multiple keys that share the same value in an array.

---

### Key Differences

1. **Unique Values**: In the first example, the object can only work if all values are unique. When values are duplicated, the last key with that value will overwrite the previous one.

2. **Duplicate Handling**: The second example is robust enough to handle duplicates by grouping the keys that share the same value into an array.

---

### Use Case

- **Unique Values**: If you're sure that each value in the original object is unique, the first method is faster and simpler.
- **Duplicates**: If the values might be duplicated, the second method is the way to go because it correctly groups all keys that share the same value.

How does `Map` differ from plain JavaScript objects when performing key-value inversions? Can `Map` handle non-primitive values as keys?

`Map` handles key-value inversion far more flexibly than plain objects because **`Map` accepts non-primitive values (objects, functions, DOM nodes, arrays) as keys**, whereas plain JavaScript object keys are always coerced into strings or symbols.

---

### Key Differences: `Map` vs. Plain Object Inversion

| Feature              | Plain Object (`{}`)                                                | `Map`                                                                     |
| -------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| **Allowed Keys**     | Strings and Symbols only (coerces objects to `"[object Object]"`). | **Any data type** (primitives, objects, functions, elements).             |
| **Key Identity**     | Values are stringified: `1` and `'1'` collide as key `'1'`.        | Uses Strict Equality / SameValueZero: `1` and `'1'` remain distinct keys. |
| **Inversion Output** | Inverted keys are converted to strings.                            | Inverted keys maintain their exact original types/references.             |

---

### Inverting a `Map` with Non-Primitive Values

Because `Map` keys can be objects or references, inverting a `Map` allows you to map **object instances, arrays, or functions back to array lists of original keys**:

```javascript
// 1. Setup a Map with object references and mixed primitive types as VALUES
const objValA = { role: 'admin' };
const objValB = { role: 'user' };

const originalMap = new Map([
  ['user_1', objValA],
  ['user_2', objValB],
  ['user_3', objValA], // Duplicate value reference!
  [42, 'active'],
  ['42', 'active']     // Numeric 42 vs string "42"
]);

// 2. Inversion Helper for Map (Handling Duplicates & Preserving Object Keys)
function invertMap(map) {
  const inverted = new Map();

  for (const [key, val] of map.entries()) {
    if (!inverted.has(val)) {
      inverted.set(val, []);
    }
    inverted.get(val).push(key);
  }

  return inverted;
}

const invertedMap = invertMap(originalMap);

// ==========================================
// VERIFICATION & BEHAVIOR
// ==========================================

// A. Non-Primitive Object as Key:
// Looking up by the EXACT object reference returns all keys pointing to it
console.log(invertedMap.get(objValA)); 
// Output: ['user_1', 'user_3'] ✅

// B. Type Strictness (1 vs '1'):
// Numeric 42 and String '42' stayed separate values, now grouped cleanly under key 'active'
console.log(invertedMap.get('active')); 
// Output: [42, '42'] ✅

```

---

### What Happens if You Try Non-Primitive Values on Plain Objects?

If you try to invert a plain object whose values are objects using `Object.fromEntries()` or `reduce()`, **all object values get stringified into `"[object Object]"**`, causing massive data corruption:

```javascript
const objVal = { role: 'admin' };
const badObject = { a: objVal, b: objVal };

// Attempting plain object inversion:
const inverted = Object.entries(badObject).reduce((acc, [k, v]) => {
  acc[v] = acc[v] || [];
  acc[v].push(k);
  return acc;
}, {});

console.log(inverted);
// Output: { "[object Object]": ['a', 'b'] } 🚨 (Lost object key identity!)

```

### When to Use `Map` for Inversion

1. **Your values are Objects/Arrays/Functions:** You need the inverted keys to retain their exact object memory references.
2. **Type Preservation Matters:** You need to distinguish between numeric keys (`100`) and string keys (`"100"`).
3. **Frequent Mutability:** You are performing large-scale lookups and updates on the inverted data structure (`Map` has performance advantages for continuous additions and deletions).
