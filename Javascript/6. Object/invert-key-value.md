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

#### Explanation:

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

#### Explanation:

- `Object.entries(obj)` again returns an array of `[key, value]` pairs.
- `.reduce()` is used to accumulate a result (`acc` is the accumulator) by iterating over each entry.
- For each key-value pair:
  - `acc[val] = acc[val] || []` ensures that if the value does not yet exist as a key in the accumulator, we create an empty array for it.
  - `acc[val].push(key)` adds the current key to the array associated with the value.
- The final result is an object where each value is mapped to an array of keys that have that value.

This approach handles duplicates by storing multiple keys that share the same value in an array.

---

### Key Differences:

1. **Unique Values**: In the first example, the object can only work if all values are unique. When values are duplicated, the last key with that value will overwrite the previous one.

2. **Duplicate Handling**: The second example is robust enough to handle duplicates by grouping the keys that share the same value into an array.

---

### Use Case:

- **Unique Values**: If you're sure that each value in the original object is unique, the first method is faster and simpler.
- **Duplicates**: If the values might be duplicated, the second method is the way to go because it correctly groups all keys that share the same value.