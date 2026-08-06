You’ve provided examples demonstrating different ways of removing elements from an array in JavaScript, including using `delete`, `splice()`, and a custom filtering function. Let's break down each one and explain the behavior:

### **1. Using `delete`**

When you use `delete` on an array element, it removes the element but **does not reindex the array**. Instead, the element is replaced with `undefined`, leaving a "hole" in the array. This is why the array size remains the same, but the deleted element is now `undefined`.

```javascript
let arr = [123, 'Prashant Yadav', 'India', null, {'abc':'xyz'}, {'pqr': 'stu'}];

delete arr[4];

console.log(arr);
// Output: [123, 'Prashant Yadav', 'India', null, undefined, {'pqr': 'stu'}]
```

**Explanation:**
- The `delete arr[4]` removes the element at index 4 (`{'abc':'xyz'}`) and leaves `undefined` in its place.
- The array length doesn't change, and there’s a hole where the deleted item was.

### **2. Using `splice()`**

The `splice()` method is used to **remove elements** from an array and optionally add new elements in place. Unlike `delete`, `splice()` **reindexes the array** and adjusts its length.

```javascript
let arr = [123, 'Prashant Yadav', 'India', null, {'abc':'xyz'}, {'pqr': 'stu'}];

arr.splice(4, 1);  // Remove 1 element starting from index 4

console.log(arr);
// Output: [123, 'Prashant Yadav', 'India', null, {'pqr': 'stu'}]
```

**Explanation:**
- `splice(4, 1)` removes 1 element starting at index 4.
- The array is reindexed, and the deleted element is removed entirely (no `undefined` left).

### **3. Using `filter()` for Custom Object Removal**

In this example, you're using the `filter()` method to filter out elements from an array based on a condition. Specifically, you're checking for objects that have a certain key-value pair and removing them.

```javascript
let arr = [123, 'Prashant Yadav', 'India', null, {'abc':'xyz'}, {'pqr': 'stu'}];

let filterObjects = (key, value) => {
  // Filter array based on the key and value
  return arr.filter((e) => {
    // Check if the current element is an object and has the key
    if (e && e.hasOwnProperty(key) && e[key] === value) {
      return false; // Remove this element from the result
    }

    return true; // Keep all other elements
  });
};

console.log(filterObjects('pqr', 'stu'));
// Output: [123, 'Prashant Yadav', 'India', null, {'abc': 'xyz'}]
```

**Explanation:**
- `arr.filter()` creates a new array where each element is tested with the provided condition.
- If an element is an object and contains a specific key-value pair (`e[key] === value`), that element is **removed**.
- In this case, the object `{ 'pqr': 'stu' }` is removed because it matches the condition (`'pqr' === 'stu'`).

### **Summary of Methods**

- **`delete`**: Removes the element but leaves a `undefined` in its place, without reindexing the array.
- **`splice()`**: Removes elements and reindexes the array. This method is ideal for removing elements and changing the array's size.
- **`filter()`**: Creates a new array by including elements that do not match the condition (e.g., removing objects with a certain key-value pair).

Let me know if you need further clarification or more examples!