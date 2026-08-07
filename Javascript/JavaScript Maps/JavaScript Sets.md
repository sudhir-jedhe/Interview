A JavaScript **`Set`** is a built-in collection of **unique values**. Unlike Arrays, a `Set` cannot contain duplicate elements—if you attempt to add an existing value, the addition is ignored.

---

## 1. Key Characteristics of `Set`

| Feature             | Behavior                                                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Uniqueness**      | Disallows duplicate values. Equality uses SameValueZero comparison (`NaN === NaN` is treated as duplicate). |
| **Value Types**     | Can hold any data type (Primitives, Objects, Functions).                                                    |
| **Insertion Order** | Remembers and preserves value insertion order during iteration.                                             |
| **Lookup Speed**    | Checking if a value exists (`.has(value)`) runs in $O(1)$ constant time vs $O(N)$ for Arrays.               |

---

## 2. Creating and Populating a `Set`

### Option A: Create Empty and Add Values

```javascript
const colors = new Set();

// Adding values (allows method chaining)
colors.add("red").add("green").add("blue").add("red"); // Duplicate "red" ignored

console.log(colors.size); // Output: 3

```

### Option B: Initialize from an Array (Array Deduplication)

```javascript
const rawNumbers = [1, 2, 2, 3, 4, 4, 5];

// Convert Array to Set (removes duplicates)
const uniqueNumbersSet = new Set(rawNumbers);

// Convert back to Array using spread operator
const uniqueNumbersArray = [...uniqueNumbersSet];
console.log(uniqueNumbersArray); // Output: [1, 2, 3, 4, 5]

```

---

## 3. Core Instance Methods and Properties

### `size`

Returns the total count of unique elements in the Set.

```javascript
const set = new Set([10, 20, 30]);
console.log(set.size); // Output: 3

```

### `add(value)`

Appends a new value to the Set. Returns the Set instance.

```javascript
set.add(40);

```

### `has(value)`

Returns `true` if the specified value exists in the Set.

```javascript
console.log(set.has(20)); // Output: true
console.log(set.has(99)); // Output: false

```

### `delete(value)`

Removes a specified value from the Set. Returns `true` if removed, `false` otherwise.

```javascript
set.delete(20);
console.log(set.has(20)); // Output: false

```

### `clear()`

Removes all elements from the Set.

```javascript
set.clear();
console.log(set.size); // Output: 0

```

---

## 4. Iterating Over Sets

Sets are native **Iterables** and can be traversed using `for...of` loops, `.forEach()`, or spread syntax.

```javascript
const fruits = new Set(["apple", "banana", "cherry"]);

// 1. Direct for...of loop
for (const item of fruits) {
  console.log(item);
}

// 2. using forEach (value and key are identical for Sets)
fruits.forEach((value, key) => {
  console.log(`${key} -> ${value}`);
});

// 3. Extracting iterator values
const iterator = fruits.values();
console.log(iterator.next().value); // Output: "apple"

```

---

## 5. Built-in Set Operations (Standardized)

Modern JS engines provide built-in methods for set logic:

```javascript
const setA = new Set([1, 2, 3]);
const setB = new Set([3, 4, 5]);

// Union (Combine all unique items)
console.log([...setA.union(setB)]); // Output: [1, 2, 3, 4, 5]

// Intersection (Common items)
console.log([...setA.intersection(setB)]); // Output: [3]

// Difference (Items in A but not in B)
console.log([...setA.difference(setB)]); // Output: [1, 2]

// Symmetric Difference (Items in either A or B, but not both)
console.log([...setA.symmetricDifference(setB)]); // Output: [1, 2, 4, 5]

```

Here is a complete categorised reference for all standard **`Set`** methods and properties in JavaScript.

---

## 1. Instance Property & Constructor

| Method / Property         | Description                                                                                              | Example                         |
| ------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------- |
| **`new Set([iterable])`** | Creates a new `Set` collection. Optionally accepts an iterable (like an Array) to pre-populate elements. | `const s = new Set([1, 2, 3]);` |
| **`size`**                | Returns the total count of unique elements in the Set.                                                   | `s.size; // 3`                  |

---

## 2. Core Mutation & Access Methods

```javascript
const set = new Set();

// 1. add(value) - Adds a value to the set. Allows chaining.
set.add(10).add(20).add(30).add(10); // Duplicate 10 ignored

// 2. has(value) - Returns true if the value exists in the set.
console.log(set.has(20)); // Output: true
console.log(set.has(99)); // Output: false

// 3. delete(value) - Removes a value. Returns true if removed, false if not found.
set.delete(20);
console.log(set.has(20)); // Output: false

// 4. clear() - Removes all elements from the set.
set.clear();
console.log(set.size); // Output: 0

```

---

## 3. Iteration Methods

```javascript
const letters = new Set(["a", "b", "c"]);

// 1. values() / keys() - Returns an iterator for the elements (keys() is an alias for values())
console.log([...letters.values()]); // Output: ["a", "b", "c"]
console.log([...letters.keys()]);   // Output: ["a", "b", "c"]

// 2. entries() - Returns an iterator of [value, value] pairs for compatibility with Map
for (const [val1, val2] of letters.entries()) {
  console.log(val1, val2); // "a a", "b b", "c c"
}

// 3. forEach(callbackFn) - Executes a callback function once for each element (value, key, set)
letters.forEach((value, key) => {
  console.log(`${key} -> ${value}`);
});

```

---

## 4. Mathematical Set Operations Methods

Modern JavaScript engines include built-in prototype methods for mathematical set algebra:

```javascript
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

// 1. union(otherSet) - Returns a new Set containing elements from both sets
console.log([...setA.union(setB)]); 
// Output: [1, 2, 3, 4, 5, 6]

// 2. intersection(otherSet) - Returns a new Set with elements present in BOTH sets
console.log([...setA.intersection(setB)]); 
// Output: [3, 4]

// 3. difference(otherSet) - Returns a new Set with elements in setA that are NOT in setB
console.log([...setA.difference(setB)]); 
// Output: [1, 2]

// 4. symmetricDifference(otherSet) - Returns a new Set with elements in setA or setB, but NOT both
console.log([...setA.symmetricDifference(setB)]); 
// Output: [1, 2, 5, 6]

// 5. isSubsetOf(otherSet) - Returns true if all elements in setA are in setB
console.log(new Set([1, 2]).isSubsetOf(setA)); // Output: true

// 6. isSupersetOf(otherSet) - Returns true if setA contains all elements of the other set
console.log(setA.isSupersetOf(new Set([1, 2]))); // Output: true

// 7. isDisjointFrom(otherSet) - Returns true if setA and setB share NO common elements
console.log(setA.isDisjointFrom(new Set([8, 9]))); // Output: true
console.log(setA.isDisjointFrom(setB));            // Output: false (they share 3 and 4)

```
