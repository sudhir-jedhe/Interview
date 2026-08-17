# Snippets: Arrays

## 1. splice mutates and returns removed elements

```js
const arr = [1, 2, 3, 4, 5];
const removed = arr.splice(1, 2, "a", "b", "c");
console.log(arr);     // [1, "a", "b", "c", 4, 5]
console.log(removed); // [2, 3]
```

## 2. sort() and reverse() mutate in place

```js
const nums = [3, 1, 2];
const sorted = nums.sort();
console.log(nums === sorted); // true, same array reference
console.log(nums);            // [1, 2, 3]
```

## 3. Non-mutating alternatives (ES2023)

```js
const original = [3, 1, 2];
const sortedCopy = original.toSorted();
console.log(original);   // [3, 1, 2] — untouched
console.log(sortedCopy); // [1, 2, 3]
```

## 4. reduce building an object, not just a number

```js
const words = ["apple", "banana", "apple", "cherry"];
const counts = words.reduce((acc, word) => {
  acc[word] = (acc[word] ?? 0) + 1;
  return acc;
}, {});
console.log(counts); // { apple: 2, banana: 1, cherry: 1 }
```

## 5. find vs filter — element vs array

```js
const nums = [1, 2, 3, 4];
console.log(nums.find((n) => n > 2));   // 3 — first match, a single value
console.log(nums.filter((n) => n > 2)); // [3, 4] — all matches, an array
```

## 6. Array.from converting an array-like

```js
function collectArgs() { return Array.from(arguments); }
console.log(collectArgs(1, 2, 3)); // [1, 2, 3]

const withMap = Array.from({ length: 3 }, (_, i) => i * 2);
console.log(withMap); // [0, 2, 4]
```

## 7. Default sort surprise on numbers

```js
console.log([10, 1, 2].sort());              // [1, 10, 2] — lexicographic!
console.log([10, 1, 2].sort((a, b) => a - b)); // [1, 2, 10] — numeric, correct
```
