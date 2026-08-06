JavaScript array methods generally fall into two categories: **mutating** (methods that alter the original array in place) and **non-mutating** (methods that return a new array or value without modifying the original).

Here is the complete breakdown of standard array methods categorized by behavior.

---

### Non-Mutating Methods (Return a New Array / Copy)

These methods leave the original array untouched and return a brand-new array with the result.

| Method             | Description                                                       |
| ------------------ | ----------------------------------------------------------------- |
| **`map()`**        | Transforms elements and returns a new array of the same length.   |
| **`filter()`**     | Selects elements passing a test and returns a new filtered array. |
| **`slice()`**      | Extracts a section of an array and returns it as a new array.     |
| **`concat()`**     | Joins two or more arrays together into a new array.               |
| **`flat()`**       | Flattens nested arrays up to a specified depth into a new array.  |
| **`flatMap()`**    | Maps each element and flattens the result into a new array.       |
| **`toSorted()`**   | Non-mutating version of `sort()` (ES2023+).                       |
| **`toReversed()`** | Non-mutating version of `reverse()` (ES2023+).                    |
| **`toSpliced()`**  | Non-mutating version of `splice()` (ES2023+).                     |
| **`with()`**       | Non-mutating element replacement at an index (ES2023+).           |

> **Note on ES2023+ Copy Methods:** Modern JavaScript introduced `toSorted()`, `toReversed()`, `toSpliced()`, and `with()` specifically so developers can perform sorting, reversing, splicing, and replacing without mutating the source array.

---

### Mutating Methods (Modify the Original Array In-Place)

These methods directly change the original array in memory and typically return the modified element, deleted elements, or the new array length.

| Method             | Description                                                      | Returns                   |
| ------------------ | ---------------------------------------------------------------- | ------------------------- |
| **`push()`**       | Adds items to the end of the array.                              | New array length          |
| **`pop()`**        | Removes the last item from the array.                            | The removed element       |
| **`unshift()`**    | Adds items to the beginning of the array.                        | New array length          |
| **`shift()`**      | Removes the first item from the array.                           | The removed element       |
| **`splice()`**     | Adds, removes, or replaces elements in place.                    | Array of deleted elements |
| **`sort()`**       | Sorts elements in place.                                         | The mutated array itself  |
| **`reverse()`**    | Reverses elements in place.                                      | The mutated array itself  |
| **`fill()`**       | Fills elements with a static value.                              | The mutated array itself  |
| **`copyWithin()`** | Copies array elements to another position within the same array. | The mutated array itself  |

---

### Non-Mutating Methods (Return Non-Array Values)

These methods iterate over or inspect the array and return a single calculated value (primitive, object, or boolean) without modifying the original array:

* **Aggregators/Calculators:** `reduce()`, `reduceRight()`
* **Search / Lookups:** `find()`, `findIndex()`, `findLast()`, `findLastIndex()`, `indexOf()`, `lastIndexOf()`, `at()`
* **Boolean Checks:** `includes()`, `some()`, `every()`
* **Formatters / Iterators:** `join()`, `keys()`, `values()`, `entries()`

---

### Quick Comparison Example

```javascript
const original = [3, 1, 2];

// ❌ MUTATING: sort() changes `original` directly
original.sort(); 
console.log(original); // [1, 2, 3] (Original changed!)

const numbers = [3, 1, 2];

// ✅ NON-MUTATING: toSorted() creates a copy (ES2023)
const sorted = numbers.toSorted();
console.log(sorted);  // [1, 2, 3]
console.log(numbers); // [3, 1, 2] (Original unchanged)

```

Introduced in **ECMAScript 2023 (ES2023)**, the change-array-by-copy methods—`toSorted()`, `toReversed()`, `toSpliced()`, and `with()`—allow you to perform array operations without mutating the original array.

Instead of modifying the target array in place (like `sort()`, `reverse()`, and `splice()`), these methods return a **shallow copy** with the modifications applied.

---

## 1. `toSorted()`

`toSorted()` is the non-mutating alternative to `sort()`. It sorts the array elements and returns a new sorted array.

### Syntax

```javascript
array.toSorted(compareFn)

```

### Example

```javascript
const months = ['Mar', 'Jan', 'Feb', 'Dec'];

// Traditional sort() mutates original
// const mutated = months.sort(); // Modifies `months` directly!

// ES2023 toSorted() returns a new array
const sortedMonths = months.toSorted();

console.log(sortedMonths); // ['Dec', 'Feb', 'Jan', 'Mar']
console.log(months);       // ['Mar', 'Jan', 'Feb', 'Dec'] (Original is unchanged)

// Custom comparator for numbers
const scores = [40, 100, 1, 5, 25];
const ascendingScores = scores.toSorted((a, b) => a - b);

console.log(ascendingScores); // [1, 5, 25, 40, 100]
console.log(scores);          // [40, 100, 1, 5, 25]

```

---

## 2. `toReversed()`

`toReversed()` is the non-mutating alternative to `reverse()`. It reverses the order of elements and returns a new array.

### Syntax

```javascript
array.toReversed()

```

### Example

```javascript
const items = [1, 2, 3, 4, 5];

const reversedItems = items.toReversed();

console.log(reversedItems); // [5, 4, 3, 2, 1]
console.log(items);         // [1, 2, 3, 4, 5] (Original is unchanged)

```

---

## 3. `toSpliced()`

`toSpliced()` is the non-mutating alternative to `splice()`. It can remove, replace, or insert elements at a given index and returns a new array containing the result.

> **Note on return value:** While `splice()` returns an array of *deleted items*, `toSpliced()` returns the *entire new array*.

### Syntax

```javascript
array.toSpliced(start, deleteCount, item1, item2, ...)

```

### Examples

#### A. Removing elements

```javascript
const animals = ['Dog', 'Cat', 'Elephant', 'Tiger'];

// Start at index 1, delete 2 elements ('Cat', 'Elephant')
const fewerAnimals = animals.toSpliced(1, 2);

console.log(fewerAnimals); // ['Dog', 'Tiger']
console.log(animals);      // ['Dog', 'Cat', 'Elephant', 'Tiger']

```

#### B. Inserting elements without deleting

```javascript
const colors = ['Red', 'Blue'];

// Start at index 1, delete 0 elements, insert 'Green' and 'Yellow'
const updatedColors = colors.toSpliced(1, 0, 'Green', 'Yellow');

console.log(updatedColors); // ['Red', 'Green', 'Yellow', 'Blue']
console.log(colors);        // ['Red', 'Blue']

```

#### C. Replacing elements

```javascript
const numbers = [10, 20, 999, 40];

// Replace index 2 with 30
const correctedNumbers = numbers.toSpliced(2, 1, 30);

console.log(correctedNumbers); // [10, 20, 30, 40]

```

---

## 4. `with()`

`with()` is the non-mutating equivalent of using bracket notation (`arr[index] = value`) to modify a single element at a specific index. It returns a new array with the item at `index` replaced by `value`.

### Syntax

```javascript
array.with(index, value)

```

### Example

```javascript
const shoppingList = ['Milk', 'Bread', 'Eggs', 'Butter'];

// Replace index 1 ('Bread') with 'Bagels'
const updatedList = shoppingList.with(1, 'Bagels');

console.log(updatedList);   // ['Milk', 'Bagels', 'Eggs', 'Butter']
console.log(shoppingList);  // ['Milk', 'Bread', 'Eggs', 'Butter']

// Supports negative indices (counts from the end)
// Index -1 refers to the last element ('Butter')
const listWithJuice = shoppingList.with(-1, 'Juice');

console.log(listWithJuice); // ['Milk', 'Bread', 'Eggs', 'Juice']

```

---

## Summary Comparison

| Old Mutating Method                  | ES2023 Non-Mutating Alternative         | Primary Action                 |
| ------------------------------------ | --------------------------------------- | ------------------------------ |
| `arr.sort(fn)`                       | `arr.toSorted(fn)`                      | Sort elements                  |
| `arr.reverse()`                      | `arr.toReversed()`                      | Reverse array order            |
| `arr.splice(start, count, ...items)` | `arr.toSpliced(start, count, ...items)` | Add/Remove/Replace items       |
| `arr[index] = value`                 | `arr.with(index, value)`                | Replace a single item by index |

The key behavioral difference between the traditional mutating array methods (`sort`, `reverse`, `splice`) and the ES2023 copy-based methods (`toSorted`, `toReversed`, `toSpliced`, `with`) is **how they treat empty slots (sparse arrays)**.

Traditional array methods retain or propagate empty slots, maintaining the array's "sparseness." In contrast, all ES2023 non-mutating methods **dense-ify** the array—they read empty slots as `undefined` and write `undefined` into those positions in the newly created array.

---

### 1. `toSorted()` vs. `sort()`

* **`sort()` (Mutating):** Preserves empty slots and moves them all to the end of the array without passing them to the comparison function.
* **`toSorted()` (Non-Mutating):** Treats empty slots as `undefined`, sorts them to the end (since `undefined` values are sorted to the end in JavaScript), and writes actual `undefined` values into those positions in the new array.

```javascript
const sparse = [3, , 1, , 2]; // Length 5 with empty slots at index 1 and 3

// Traditional sort()
const mutatingResult = [...sparse].sort();
console.log(mutatingResult);      // [1, 2, 3, empty × 2]
console.log(1 in mutatingResult); // false (index 1 is an empty slot)

// ES2023 toSorted()
const denseResult = sparse.toSorted();
console.log(denseResult);      // [1, 2, 3, undefined, undefined]
console.log(3 in denseResult); // true (index 3 holds actual `undefined`)

```

---

### 2. `toReversed()` vs. `reverse()`

* **`reverse()` (Mutating):** Swaps indices while maintaining sparse holes. If index 0 has a value and index 4 is empty, swapping them leaves index 0 empty and index 4 with the value.
* **`toReversed()` (Non-Mutating):** Converts any empty slot into `undefined` at its reversed index position in the new array.

```javascript
const sparse = ['a', , 'c']; // Length 3, empty at index 1

// Traditional reverse()
const mutatingResult = [...sparse].reverse();
console.log(mutatingResult);      // ['c', empty, 'a']
console.log(1 in mutatingResult); // false

// ES2023 toReversed()
const denseResult = sparse.toReversed();
console.log(denseResult);      // ['c', undefined, 'a']
console.log(1 in denseResult); // true (empty slot converted to `undefined`)

```

---

### 3. `toSpliced()` vs. `splice()`

* **`splice()` (Mutating):** Retains empty slots in any unaffected regions of the original array.
* **`toSpliced()` (Non-Mutating):** Converts any untouched empty slots in the array into `undefined` in the returned copy.

```javascript
const sparse = [1, , 3, , 5];

// ES2023 toSpliced() deleting 1 item at index 0
const result = sparse.toSpliced(0, 1);

console.log(result);      // [undefined, 3, undefined, 5]
console.log(0 in result); // true (index 0 is now explicit `undefined`, not empty)

```

---

### 4. `with()` vs. Bracket Assignment (`arr[i] = val`)

* **Bracket Assignment (Mutating):** Assigning `arr[0] = 'x'` modifies index 0 without filling empty slots elsewhere in a sparse array.
* **`with()` (Non-Mutating):** Copies the entire array first, converting all empty slots to `undefined`, then assigns the new value at the specified index.

```javascript
const sparse = [, , 'c']; // Length 3, empty at indices 0 and 1

// Bracket assignment
const mutated = [...sparse];
mutated[0] = 'a';
console.log(mutated);      // ['a', empty, 'c']
console.log(1 in mutated); // false

// ES2023 with()
const dense = sparse.with(0, 'a');
console.log(dense);      // ['a', undefined, 'c']
console.log(1 in dense); // true (index 1 is now explicit `undefined`)

```

---

### Summary Table

| Method                                                   | Handles Empty Slots By:               | Resulting Array Type            |
| -------------------------------------------------------- | ------------------------------------- | ------------------------------- |
| `sort()` / `reverse()` / `splice()`                      | Preserving empty holes                | **Sparse** (holes remain holes) |
| `toSorted()` / `toReversed()` / `toSpliced()` / `with()` | Converting empty slots to `undefined` | **Dense** (no empty holes)      |

A **sparse array** in JavaScript is an array where the elements are not contiguous—meaning it has "holes" or unassigned indices where no value or property exists at all.

Unlike a dense array (where every index from `0` to `length - 1` holds a defined value, even if that value is `null` or `undefined`), a sparse array's `length` property is greater than the actual number of elements stored in memory.

---

### Key Difference: Empty Slots vs. `undefined`

In JavaScript, an empty slot is **not** the same as an element set to `undefined`.

```javascript
const dense = [undefined, undefined];
const sparse = [, ,];

console.log(dense.length);  // 2
console.log(sparse.length); // 2

// Checking property existence on the array object
console.log(0 in dense);  // true  (index 0 exists and contains `undefined`)
console.log(0 in sparse); // false (index 0 does NOT exist; it is a hole)

```

---

### How Sparse Arrays Are Created

Sparse arrays are usually created unintentionally through one of four common patterns:

#### 1. Array Literals with Omitted Values (Elision)

Leaving extra commas in an array literal creates empty slots:

```javascript
const arr = [1, , 3]; // Missing index 1

```

#### 2. The `Array(n)` Constructor

Calling `Array(length)` with a single numeric argument creates an array of that length filled entirely with empty holes:

```javascript
const arr = new Array(3); // Creates 3 empty slots, NOT [undefined, undefined, undefined]

```

#### 3. Writing to an Index Beyond the Current Length

Assigning a value to an index higher than `arr.length - 1` automatically expands `length` and leaves holes in the gap:

```javascript
const arr = [1, 2];
arr[5] = 6; // Automatically expands length to 6
console.log(arr); // [1, 2, <3 empty items>, 6]

```

#### 4. Using `delete` on an Array Element

Using the `delete` operator on an array deletes the key at that index rather than shortening the array, leaving a hole behind:

```javascript
const arr = ['a', 'b', 'c'];
delete arr[1]; // Deletes index 1 without re-indexing
console.log(arr); // ['a', <1 empty item>, 'c']

```

---

### Why You Should Avoid Sparse Arrays

#### 1. Inconsistent and Confusing Method Behavior

Built-in JavaScript array methods handle empty slots inconsistently:

* **Skipped entirely:** `forEach()`, `map()`, `filter()`, `reduce()`, `every()`, and `some()` skip empty slots altogether during iteration.
* **Converted to `undefined`:** `find()`, `findIndex()`, `includes()`, `Array.from()`, spread syntax (`[...arr]`), and ES2023 copy methods (`toSorted()`, `toReversed()`, `with()`) treat empty slots as `undefined`.
* **Preserved:** `reverse()`, `sort()`, and `slice()` preserve holes.

**Example of unexpected `map()` behavior:**

```javascript
const sparse = new Array(3); // [empty × 3]

// The callback NEVER runs because map() skips empty slots!
const result = sparse.map(() => "hello");

console.log(result); // [empty × 3] (Expected ['hello', 'hello', 'hello'])

```

#### 2. V8 / Engine Performance Penalties

Modern JavaScript engines like V8 optimize arrays based on continuous memory layout types (e.g., *PACKED_SMI*, *PACKED_ELEMENTS*).

When an array becomes sparse, V8 transitions the array internally to a **HOLEY** or **DICTIONARY** (hash table) mode. This degrades lookup speeds from fast, contiguous memory offsets $O(1)$ to key-value property lookups on an object. Once an array becomes sparse/holey, engines usually cannot transition it back to a fast packed layout.

#### 3. Bug-Prone Code

Sparse arrays cause subtle bugs when checking values or looping with standard `for` loops vs. higher-order methods:

```javascript
const sparse = [1, , 3];

// Method 1: Higher-order method (skips hole)
sparse.forEach(x => console.log(x)); 
// Logs: 1, 3

// Method 2: Traditional for-loop (evaluates hole as undefined)
for (let i = 0; i < sparse.length; i++) {
  console.log(sparse[i]); 
}
// Logs: 1, undefined, 3

```

---

### How to Create Dense Arrays Correctly

Instead of using `new Array(n)` or sparse assignments, use modern dense initializer patterns:

```javascript
// ✅ Use Array.fill()
const dense1 = new Array(3).fill(null); // [null, null, null]

// ✅ Use Array.from()
const dense2 = Array.from({ length: 3 }, (_, i) => i + 1); // [1, 2, 3]

// ✅ Use Spread syntax on a sparse array to flatten holes to `undefined`
const dense3 = [...new Array(3)]; // [undefined, undefined, undefined]

```
