Several hidden subtle bugs, edge cases, and performance bottlenecks are worth noting in this code breakdown.

---

## Key Performance & Behavior Gotchas

### 1. Type Coercion in `CustomSet`

Because `CustomSet` uses a plain JavaScript object (`this.items = {}`) for storage, **all keys are converted to strings**.

```js
const custom = new CustomSet();
custom.add(1);
custom.add("1");

console.log(custom.size()); // Returns 1 instead of 2!
console.log(custom.values()); // Returns ['1'] (number co-erced to string)

```

* **The issue:** The custom set cannot distinguish between `1` and `"1"`, nor between objects/symbols.
* **The fix:** Use a native `Map` internally or the built-in native `Set`.

### 2. Built-in `Set` Composition Methods

The manual helper functions for `unionSets` and `intersectionSets` (Sections 4 & 5) work, but **ES2024 added native Set methods** directly to the prototype:

```js
const set1 = new Set([1, 2, 3]);
const set2 = new Set([3, 4, 5]);

// Modern Native Syntax:
set1.union(set2);         // Set(5) { 1, 2, 3, 4, 5 }
set1.intersection(set2);  // Set(1) { 3 }
set1.difference(set2);    // Set(2) { 1, 2 }
set1.isSubsetOf(set2);    // false

```

### 3. Redundant Check in `addToSet` (Section 6)

In `addToSet`, checking `if (!set.has(element))` before calling `set.add(element)` is redundant:

```js
// Redundant:
if (!set.has(element)) { set.add(element); }

// Native Set.prototype.add already ignores existing elements automatically:
array.forEach(element => set.add(element));

```

### 4. Quadratic Complexity in `intersectionSets`

If `set1` is large ($N = 1,000,000$) and `set2` is small ($M = 5$), iterating over `set1` checks all 1 million items against `set2`.

To optimize manual intersection algorithms to $\mathcal{O}(\min(N, M))$, always iterate over the **smaller** set:

```js
function intersectionSets(set1, set2) {
  const [smaller, larger] = set1.size < set2.size ? [set1, set2] : [set2, set1];
  const result = new Set();
  
  for (const item of smaller) {
    if (larger.has(item)) result.add(item);
  }
  
  return result;
}

```

---

## Comparison: `CustomSet` vs Built-in `Set`

| Feature                           | `CustomSet` (Object-based)  | Built-in `Set`                            |
| --------------------------------- | --------------------------- | ----------------------------------------- |
| **Key Types Supported**           | Strings / Numbers (Coerced) | Any type (Objects, Functions, Primitives) |
| **Equality Check**                | String Coercion             | `SameValueZero` (NaN equals NaN)          |
| **Time Complexity (`has`/`add`)** | $\mathcal{O}(1)$ average    | $\mathcal{O}(1)$ average                  |
| **Set Algebra Methods**           | Custom logic                | Native in modern JS runtimes              |

JavaScript added 7 new native `Set` methods to perform set operations directly without helper functions or external libraries.

---

## 1. Set Combination Methods (Return a New `Set`)

### `union(other)`

Returns a new set containing all unique elements present in **either** the current set or the `other` set (equivalent to $A \cup B$).

```javascript
const setA = new Set([1, 2, 3]);
const setB = new Set([3, 4, 5]);

const result = setA.union(setB);
console.log(result); // Set(5) { 1, 2, 3, 4, 5 }

```

### `intersection(other)`

Returns a new set containing elements that exist in **both** sets (equivalent to $A \cap B$).

```javascript
const setA = new Set(['apple', 'banana', 'cherry']);
const setB = new Set(['banana', 'cherry', 'date']);

const result = setA.intersection(setB);
console.log(result); // Set(2) { 'banana', 'cherry' }

```

### `difference(other)`

Returns a new set containing elements that exist in the current set **but not** in the `other` set (equivalent to $A \setminus B$).

```javascript
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5]);

const result = setA.difference(setB);
console.log(result); // Set(2) { 1, 2 }

```

### `symmetricDifference(other)`

Returns a new set containing elements present in **either** set, but **not in both** (equivalent to $(A \setminus B) \cup (B \setminus A)$ or $A \Delta B$).

```javascript
const setA = new Set([1, 2, 3]);
const setB = new Set([3, 4, 5]);

const result = setA.symmetricDifference(setB);
console.log(result); // Set(4) { 1, 2, 4, 5 }

```

---

## 2. Set Relational / Comparison Methods (Return a `Boolean`)

### `isSubsetOf(other)`

Returns `true` if **all** elements of the current set exist inside the `other` set.

```javascript
const frontend = new Set(['HTML', 'CSS']);
const fullstack = new Set(['HTML', 'CSS', 'JS', 'Node']);

console.log(frontend.isSubsetOf(fullstack)); // true
console.log(fullstack.isSubsetOf(frontend)); // false

```

### `isSupersetOf(other)`

Returns `true` if the current set contains **all** elements of the `other` set.

```javascript
const fullstack = new Set(['HTML', 'CSS', 'JS', 'Node']);
const frontend = new Set(['HTML', 'CSS']);

console.log(fullstack.isSupersetOf(frontend)); // true

```

### `isDisjointFrom(other)`

Returns `true` if the current set shares **no common elements** with the `other` set.

```javascript
const setA = new Set([1, 2]);
const setB = new Set([3, 4]);
const setC = new Set([2, 3]);

console.log(setA.isDisjointFrom(setB)); // true (no overlapping elements)
console.log(setA.isDisjointFrom(setC)); // false (shares the value 2)

```

---

## Summary Matrix

| Method                       | Return Type | Mathematical Concept   |
| ---------------------------- | ----------- | ---------------------- |
| `union(other)`               | `Set`       | $A \cup B$             |
| `intersection(other)`        | `Set`       | $A \cap B$             |
| `difference(other)`          | `Set`       | $A \setminus B$        |
| `symmetricDifference(other)` | `Set`       | $A \Delta B$           |
| `isSubsetOf(other)`          | `boolean`   | $A \subseteq B$        |
| `isSupersetOf(other)`        | `boolean`   | $A \supseteq B$        |
| `isDisjointFrom(other)`      | `boolean`   | $A \cap B = \emptyset$ |

---

## Key Features to Know

1. **Set-like Arguments:** These methods do not require `other` to strictly be a JavaScript `Set`. They accept any **Set-like object** (anything with a `.size` property, a `.has()` method, and a `.keys()` or `.values()` iterator, such as a `Map`).
2. **Immutability:** None of these methods mutate the original set; operations like `union` or `difference` always construct and return a brand-new `Set`.
