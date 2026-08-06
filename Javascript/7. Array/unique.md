Your code provides several useful functions for working with arrays and objects, especially when handling uniqueness, duplicates, and filtering based on specific criteria. Let's break down each function and its purpose, followed by a quick walkthrough of its usage:

### 1. **`uniqueElements(arr)`**:
This function returns an array with only unique elements. It works by converting the array into a `Set` (which inherently stores only unique values), and then spreads the values back into an array.

```javascript
const uniqueElements = arr => [...new Set(arr)];
```
- **Example:**
  ```javascript
  uniqueElements([1, 2, 2, 3, 4, 4, 5]); // [1, 2, 3, 4, 5]
  ```

### 2. **`hasDuplicates(arr)`**:
This function checks if the array contains any duplicate elements. It compares the length of the original array with the size of the set. If they differ, it means there are duplicates.

```javascript
const hasDuplicates = arr => arr.length !== new Set(arr).size;
```
- **Example:**
  ```javascript
  hasDuplicates([1, 2, 2, 3, 4, 4, 5]); // true
  hasDuplicates([1, 2, 3, 4, 5]); // false
  ```

### 3. **`allDistinct(arr)`**:
This function checks if all elements in the array are distinct. It works by comparing the length of the array with the size of the set. If the lengths match, all elements are unique.

```javascript
const allDistinct = arr => arr.length === new Set(arr).size;
```
- **Example:**
  ```javascript
  allDistinct([1, 2, 2, 3, 4, 4, 5]); // false
  allDistinct([1, 2, 3, 4, 5]); // true
  ```

### 4. **`removeNonUnique(arr)`**:
This function removes elements that appear more than once, leaving only the unique ones. It converts the array to a `Set`, and then filters for elements that appear only once in the original array.

```javascript
const removeNonUnique = arr =>
  [...new Set(arr)].filter(i => arr.indexOf(i) === arr.lastIndexOf(i));
```
- **Example:**
  ```javascript
  removeNonUnique([1, 2, 2, 3, 4, 4, 5]); // [1, 3, 5]
  ```

### 5. **`removeUnique(arr)`**:
This function removes elements that are unique, leaving only the duplicates. It does this by using the `indexOf` and `lastIndexOf` methods to detect duplicate values and retain them.

```javascript
const removeUnique = arr =>
  [...new Set(arr)].filter(i => arr.indexOf(i) !== arr.lastIndexOf(i));
```
- **Example:**
  ```javascript
  removeUnique([1, 2, 2, 3, 4, 4, 5]); // [2, 4]
  ```

### 6. **`uniqueElementsBy(arr, fn)`**:
This function allows you to extract unique elements based on a custom comparison function (`fn`). It uses the `reduce` method to accumulate elements into an array, ensuring that no element with the same comparison result is added.

```javascript
const uniqueElementsBy = (arr, fn) =>
  arr.reduce((acc, v) => {
    if (!acc.some(x => fn(v, x))) acc.push(v);
    return acc;
  }, []);
```
- **Example:**
  ```javascript
  const data = [
    { id: 0, value: 'a' },
    { id: 1, value: 'b' },
    { id: 2, value: 'c' },
    { id: 1, value: 'd' },
    { id: 0, value: 'e' }
  ];

  const idComparator = (a, b) => a.id === b.id;
  uniqueElementsBy(data, idComparator);
  // [ { id: 0, value: 'a' }, { id: 1, value: 'b' }, { id: 2, value: 'c' } ]
  ```

### 7. **`hasDuplicatesBy(arr, fn)`**:
This function checks if there are duplicates based on a custom function (`fn`). It maps the array through the custom function, then compares the size of the resulting array to the original array.

```javascript
const hasDuplicatesBy = (arr, fn) => arr.length !== new Set(arr.map(fn)).size;
```
- **Example:**
  ```javascript
  const idMap = a => a.id;
  hasDuplicatesBy(data, idMap); // true
  ```

### 8. **`removeNonUniqueBy(arr, fn)`**:
This function removes non-unique elements based on a custom comparison function (`fn`). It filters elements where the comparison function indicates that the element is non-unique.

```javascript
const removeNonUniqueBy = (arr, fn) =>
  arr.filter((v, i) => arr.every((x, j) => (i === j) === fn(v, x, i, j)));
```
- **Example:**
  ```javascript
  removeNonUniqueBy(data, idComparator); // [ { id: 2, value: 'c' } ]
  ```

### **Summary of Use Cases**:
- **`uniqueElements()`**: For extracting unique elements from an array of primitive values.
- **`hasDuplicates()`**: To check if there are duplicates in the array.
- **`allDistinct()`**: To check if all elements are distinct.
- **`removeNonUnique()`**: To remove elements that appear more than once.
- **`removeUnique()`**: To remove elements that appear only once.
- **`uniqueElementsBy()`**: To get unique elements based on a custom condition (e.g., by a property like `id`).
- **`hasDuplicatesBy()`**: To check for duplicates based on a custom condition.
- **`removeNonUniqueBy()`**: To remove elements based on custom conditions (e.g., duplicates based on `id`).

### **Why This is Useful**:
These functions give you flexible and efficient ways to work with arrays, especially when dealing with complex data structures (like arrays of objects). They help to filter, deduplicate, and check for duplicates in various ways, both for simple and more complex scenarios.