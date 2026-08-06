### Stable Sorting in JavaScript

The concept of **stable sorting** refers to sorting an array in such a way that equal elements retain their original relative order. For example, if you have a list of objects with the same value, their order should remain the same after sorting. This can be particularly important when sorting multiple times based on different criteria, where you want the previous sort order to be preserved when sorting by the new criterion.

In JavaScript, **`Array.prototype.sort()`** is not guaranteed to be stable in all environments (especially in older JavaScript engines). However, you can create your own stable sorting algorithm using custom logic.

### Stable Sort Implementation

The function `stableSort` that you provided uses a clever approach to ensure stability while sorting an array. Here's how it works:

```javascript
const stableSort = (arr, compare) =>
    arr
      .map((item, index) => ({ item, index }))  // Step 1: Create an array of objects, where each object contains the item and its original index
      .sort((a, b) => compare(a.item, b.item) || a.index - b.index)  // Step 2: Sort the array by item and use the original index to resolve ties
      .map(({ item }) => item);  // Step 3: Map the sorted array back to just the items
```

#### Explanation of Steps:

1. **Map with Original Index**:
   - You create a new array where each element is an object with two properties: `item` (the original value of the element) and `index` (its original position in the array).
   
   Example:
   ```javascript
   const arr = [4, 3, 2, 1];
   arr.map((item, index) => ({ item, index }));
   // Result: [{ item: 4, index: 0 }, { item: 3, index: 1 }, { item: 2, index: 2 }, { item: 1, index: 3 }]
   ```

2. **Sort with Comparator**:
   - The `sort` function is applied to this new array of objects. It first sorts by the `item` values using the `compare` function you provide, and if two items are equal (`compare(a.item, b.item) === 0`), it uses their original indices to resolve the tie (`a.index - b.index`).
   
   This ensures that elements with the same value retain their original relative positions in the sorted array, making the sort **stable**.

3. **Map Back to Items**:
   - After sorting, you map the objects back to just their `item` property, effectively returning a sorted array of the original elements.
   
   Example:
   ```javascript
   [{ item: 4, index: 0 }, { item: 3, index: 1 }]
     .map(({ item }) => item); 
   // Result: [4, 3]
   ```

### Example with a Simple Array:

```javascript
const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const stable = stableSort(arr, () => 0);
console.log(stable);  // Output: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

In this case, the `compare` function always returns `0`, which means the sort function has no preference for any particular order. As a result, the original order of the array is preserved, and the function returns the array as-is.

### Example with a Comparator:

If you want to sort the array in ascending order, you can provide a comparator like this:

```javascript
const stable = stableSort(arr, (a, b) => a - b);
console.log(stable);  // Output: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

If the array has equal elements or you are sorting based on complex objects, the original order of those equal elements will be maintained.

---

### Why Use Stable Sort?

- **Multi-level sorting**: When you sort based on multiple criteria, stable sorting allows you to apply sorting one criterion at a time without disrupting the order of the previous sort.
  
  Example:
  ```javascript
  const students = [
    { name: 'Alice', grade: 85 },
    { name: 'Bob', grade: 85 },
    { name: 'Charlie', grade: 90 },
    { name: 'David', grade: 80 }
  ];

  // First, sort by grade (stable)
  const byGrade = stableSort(students, (a, b) => a.grade - b.grade);

  // Then, sort by name (stable)
  const byName = stableSort(byGrade, (a, b) => a.name.localeCompare(b.name));

  console.log(byName);
  ```

  Output:
  ```javascript
  [
    { name: 'David', grade: 80 },
    { name: 'Alice', grade: 85 },
    { name: 'Bob', grade: 85 },
    { name: 'Charlie', grade: 90 }
  ]
  ```
  In this case, `Alice` and `Bob` retain their relative positions in the sorted list because the sorting by grade was stable.

---

### Performance Considerations:

- The **time complexity** of the `stableSort` function is dominated by the `sort()` function, which has a worst-case time complexity of **O(n log n)**, where `n` is the number of elements in the array.
- The **space complexity** is O(n) because of the additional space required to store the mapped objects with their original indices.

In practice, this approach works efficiently for many use-cases, but you should always profile performance if you are working with very large datasets.

