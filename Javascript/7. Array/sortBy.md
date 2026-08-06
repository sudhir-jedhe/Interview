```js
function sortBy(collection, property) {
  // do not remove
  "use strict";
  const result = [...collection];
  result.sort((a, b) => {
    const keys = property.split(".");
    const aItem = keys.reduce((result, item) => {
      if (result[item] !== undefined) {
        return result[item];
      } else {
      }
    }, a);
    const bItem = keys.reduce((result, item) => {
      if (result[item] !== undefined) {
        return result[item];
      } else {
      }
    }, b);
    if (aItem == undefined || bItem == undefined) return 0;

    return aItem - bItem;
  });
  return result;
}

const arrayOne = [{ a: 1 }, { a: 3 }, { a: 2 }];

// expected output: [{a: 1}, {a: 2}, {a: 3}];
sortBy(arrayOne, "a");

const arrayTwo = [
  { a: 1, b: "z" },
  { a: 2, b: "y" },
  { a: 1, b: "x" },
  { a: 2, b: "w" },
];

// expected output: [{a: 1, b: 'z'}, {a: 1, b: 'x'}, {a: 2, b: 'y'}, {a: 2, b: 'w'}];
sortBy(arrayTwo, "a");

const arrayThree = [
  { a: 1, b: { c: 4 } },
  { a: 2, b: { c: 2 } },
  { a: 3, b: { c: 1 } },
  { a: 4, b: { c: 0 } },
];

// expected output: [{"a":4,"b":{"c":0}},{"a":3,"b":{"c":1}},{"a":2,"b":{"c":2}},{"a":1,"b":{"c":4}}]
sortBy(arrayThree, "b.c");

```
```js
function sortBy(collection, property) {
  // do not remove
  "use strict";

  // write your solution below
  return collection.sort((firstObj, secondObj) => {
    let propArray = property.split(".");
    let aitem = propArray.reduce((acc, curr, i) => {
      return acc ? acc[curr] : undefined;
    }, firstObj);
    let bitem = propArray.reduce((acc, curr) => {
      return acc ? acc[curr] : undefined;
    }, secondObj);
    if (aitem == undefined || bitem == undefined) return 0;
    return aitem - bitem;
  });
}

// console.log(s)


```

```
Given an array arr and a function fn, return a sorted array sortedArr. You can assume fn only returns numbers and those numbers determine the sort order of sortedArr. sortedArr must be sorted in ascending order by fn output.

You may assume that fn will never duplicate numbers for a given array.



Example 1:

Input: arr = [5, 4, 1, 2, 3], fn = (x) => x
Output: [1, 2, 3, 4, 5]
Explanation: fn simply returns the number passed to it so the array is sorted in ascending order.
Example 2:

Input: arr = [{"x": 1}, {"x": 0}, {"x": -1}], fn = (d) => d.x
Output: [{"x": -1}, {"x": 0}, {"x": 1}]
Explanation: fn returns the value for the "x" key. So the array is sorted based on that value.
Example 3:

Input: arr = [[3, 4], [5, 2], [10, 1]], fn = (x) => x[1]
Output: [[10, 1], [5, 2], [3, 4]]
Explanation: arr is sorted in ascending order by number at index=1.

```
```js
function sortBy(arr, fn) {
  return arr.slice().sort((a, b) => fn(a) - fn(b));
}
```


Here’s a comprehensive solution with all of the code examples for sorting using the `sortBy` function:

### 1. **Function Definition:**

The `sortBy` function is designed to take an array (`arr`) and a sorting function (`fn`). It then sorts the array based on the return value of the function applied to each element.

```javascript
function sortBy(arr, fn) {
  return arr.slice().sort((a, b) => fn(a) - fn(b));
}
```

### 2. **Examples:**

#### Example 1: **Sort by the number itself**

In this case, the array consists of numbers, and we want to sort them in ascending order. The function `fn` simply returns the number itself.

```javascript
// Example 1: Sort by the number itself
const arr1 = [5, 4, 1, 2, 3];
const fn1 = (x) => x;  // Sorting by the number itself
console.log(sortBy(arr1, fn1)); 
// Output: [1, 2, 3, 4, 5]
```

#### Example 2: **Sort by the value of the `x` key in an object**

In this case, the array consists of objects, and we want to sort the array based on the value of the `x` key in each object. The function `fn` extracts the `x` key from each object.

```javascript
// Example 2: Sort by the value of the "x" key
const arr2 = [{"x": 1}, {"x": 0}, {"x": -1}];
const fn2 = (d) => d.x;  // Sorting by the "x" key in each object
console.log(sortBy(arr2, fn2)); 
// Output: [{"x": -1}, {"x": 0}, {"x": 1}]
```

#### Example 3: **Sort by the second element of each sub-array**

Here, the array consists of sub-arrays, and we want to sort based on the second element of each sub-array. The function `fn` extracts the second element (`x[1]`).

```javascript
// Example 3: Sort by the second element of each sub-array
const arr3 = [[3, 4], [5, 2], [10, 1]];
const fn3 = (x) => x[1];  // Sorting by the second element of each sub-array
console.log(sortBy(arr3, fn3)); 
// Output: [[10, 1], [5, 2], [3, 4]]
```

#### Example 4: **Sort by a nested object property**

In this example, the array contains objects with nested properties. We sort by the nested property `b.c`.

```javascript
// Example 4: Sort by a nested object property
const arr4 = [
  { a: 1, b: { c: 4 } },
  { a: 2, b: { c: 2 } },
  { a: 3, b: { c: 1 } },
  { a: 4, b: { c: 0 } },
];
const fn4 = (x) => x.b.c;  // Sorting by nested property "b.c"
console.log(sortBy(arr4, fn4)); 
// Output: [{"a":4,"b":{"c":0}},{"a":3,"b":{"c":1}},{"a":2,"b":{"c":2}},{"a":1,"b":{"c":4}}]
```

### 3. **Summary of All Examples in One Code Block**

```javascript
// The sortBy function
function sortBy(arr, fn) {
  return arr.slice().sort((a, b) => fn(a) - fn(b));
}

// Example 1: Sort by the number itself
const arr1 = [5, 4, 1, 2, 3];
const fn1 = (x) => x;  // Sorting by the number itself
console.log(sortBy(arr1, fn1)); 
// Output: [1, 2, 3, 4, 5]

// Example 2: Sort by the value of the "x" key
const arr2 = [{"x": 1}, {"x": 0}, {"x": -1}];
const fn2 = (d) => d.x;  // Sorting by the "x" key in each object
console.log(sortBy(arr2, fn2)); 
// Output: [{"x": -1}, {"x": 0}, {"x": 1}]

// Example 3: Sort by the second element of each sub-array
const arr3 = [[3, 4], [5, 2], [10, 1]];
const fn3 = (x) => x[1];  // Sorting by the second element of each sub-array
console.log(sortBy(arr3, fn3)); 
// Output: [[10, 1], [5, 2], [3, 4]]

// Example 4: Sort by a nested object property
const arr4 = [
  { a: 1, b: { c: 4 } },
  { a: 2, b: { c: 2 } },
  { a: 3, b: { c: 1 } },
  { a: 4, b: { c: 0 } },
];
const fn4 = (x) => x.b.c;  // Sorting by nested property "b.c"
console.log(sortBy(arr4, fn4)); 
// Output: [{"a":4,"b":{"c":0}},{"a":3,"b":{"c":1}},{"a":2,"b":{"c":2}},{"a":1,"b":{"c":4}}]
```

### 4. **Explanation:**

- The `sortBy` function works by first creating a shallow copy of the array using `arr.slice()`. This ensures that the original array is not mutated.
- It then sorts the copy of the array using the provided comparison function, which is derived from the sorting function `fn`.
- `fn` is a function that returns a value used to determine the sorting order. In the examples above, `fn` is either a simple function that extracts a number, a property value, or a nested property value.

---

This should give you a complete solution with the examples and the `sortBy` function working across different use cases!