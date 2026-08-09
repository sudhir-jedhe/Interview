Here are multiple ways to filter array elements greater than `2` in JavaScript, ranging from standard functional methods to modern iterators and basic loops.

---

### 1. `Array.prototype.filter()` (Standard & Recommended)

The most common declarative way to filter elements based on a condition.

```javascript
const arr = [1, 2, 3, 4, 5];

const result = arr.filter(num => num > 2);
console.log(result); // [3, 4, 5]

```

---

### 2. `Array.prototype.reduce()`

Accumulates elements that satisfy the condition into a new array. Useful when transforming and filtering in a single pass.

```javascript
const arr = [1, 2, 3, 4, 5];

const result = arr.reduce((acc, num) => {
  if (num > 2) acc.push(num);
  return acc;
}, []);

console.log(result); // [3, 4, 5]

```

---

### 3. `Array.prototype.flatMap()`

Maps elements to an array containing the element if it meets the condition, or an empty array `[]` if it doesn't. `flatMap` automatically flattens the result.

```javascript
const arr = [1, 2, 3, 4, 5];

const result = arr.flatMap(num => (num > 2 ? [num] : []));
console.log(result); // [3, 4, 5]

```

---

### 4. Traditional `for` Loop / `for...of` Loop

A imperative approach using a standard loop to push items into a new array.

```javascript
const arr = [1, 2, 3, 4, 5];
const result = [];

for (const num of arr) {
  if (num > 2) {
    result.push(num);
  }
}

console.log(result); // [3, 4, 5]

```

---

### 5. `Array.prototype.forEach()`

Iterates over each element and pushes items greater than `2` into a new array.

```javascript
const arr = [1, 2, 3, 4, 5];
const result = [];

arr.forEach(num => {
  if (num > 2) result.push(num);
});

console.log(result); // [3, 4, 5]

```

---

### 6. Generator Function

Yields values dynamically on demand without creating the whole array in memory all at once.

```javascript
const arr = [1, 2, 3, 4, 5];

function* filterGreaterThanTwo(array) {
  for (const num of array) {
    if (num > 2) yield num;
  }
}

const result = [...filterGreaterThanTwo(arr)];
console.log(result); // [3, 4, 5]

```

---

### Solution Summary Table

| Method          | Best Use Case                          | Immutability                   |
| --------------- | -------------------------------------- | ------------------------------ |
| **`filter()`**  | Cleanest, standard approach            | Returns new array              |
| **`reduce()`**  | Combining filtering with aggregation   | Returns new array              |
| **`flatMap()`** | Filtering while transforming items     | Returns new array              |
| **`for...of`**  | Maximum performance / early loop break | Requires manual array creation |
| **Generator**   | Large dataset streaming                | Memory efficient               |

Yes, you can use both **`map`** and **`forEach`**, but they work differently for this task:

---

### Option 1: Using `forEach` (Direct & Straightforward)

`forEach` iterates over the array without returning anything, so you manually push elements greater than `2` into a new array.

```javascript
const arr = [1, 2, 3, 4, 5];
const result = [];

arr.forEach(num => {
  if (num > 2) {
    result.push(num);
  }
});

console.log(result); // [3, 4, 5]

```

---

### Option 2: Using `map` + `filter`

`map` **always returns an array of the exact same length** as the original array. If you try to use `map` alone with an `if` statement, elements that fail the condition return `undefined`:

```javascript
// ❌ Map alone gives undefined for values <= 2:
const wrongMap = arr.map(num => {
  if (num > 2) return num;
});
console.log(wrongMap); // [undefined, undefined, 3, 4, 5]

```

To use `map` correctly to get `[3, 4, 5]`, you must filter out `undefined` or `null` values afterward:

```javascript
// ✅ Correct way using map:
const arr = [1, 2, 3, 4, 5];

const result = arr
  .map(num => (num > 2 ? num : null))
  .filter(num => num !== null);

console.log(result); // [3, 4, 5]

```

---

### Modern Alternative: `flatMap()`

If you want the mapping syntax without having to manually clean up `undefined`/`null` values, use `flatMap()`. Returning an empty array `[]` removes the item completely:

```javascript
const arr = [1, 2, 3, 4, 5];

const result = arr.flatMap(num => (num > 2 ? [num] : []));

console.log(result); // [3, 4, 5]

```

---

### Key Takeaway

* Use **`filter()`** or **`forEach()`** for simple filtering tasks.
* Use **`flatMap()`** if you want to filter and transform values at the same time in a single step.
