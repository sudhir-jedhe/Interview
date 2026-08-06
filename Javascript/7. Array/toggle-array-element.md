### Toggling an Element in an Array

In JavaScript, you can toggle (add or remove) an element from an array by checking if it already exists in the array. If it does, remove it; if it doesn't, add it. Here, I'll explain both how to do this for arrays of **primitives** (like numbers or strings) and **objects**.

---

### 1. **Toggling Elements in Arrays of Primitives**

For arrays of simple values like numbers or strings, you can use `Array.prototype.includes()` to check if the element is present. If it is, you can remove it with `Array.prototype.filter()`. If it's not present, you can append it using the spread operator (`...`).

#### Code Example:

```javascript
const toggleElement = (arr, val) =>
  arr.includes(val) ? arr.filter(el => el !== val) : [...arr, val];

console.log(toggleElement([1, 2, 3], 2)); // [1, 3]
console.log(toggleElement([1, 2, 3], 4)); // [1, 2, 3, 4]
```

#### Explanation:
- If the element `val` is found in the array (`arr.includes(val)`), it filters the array to remove `val`.
- If `val` is not found in the array, it adds `val` to the array by spreading the existing elements and appending `val`.

---

### 2. **Toggling Elements in Arrays of Objects**

When working with arrays of objects, it's a bit more complicated because you need to define how to compare objects. This is done by providing a **comparison function**, such as comparing an object property (e.g., `id` or `name`). If the element is found, it gets removed; otherwise, it is added.

#### Code Example:

```javascript
const idComparator = (a, b) => a === b;

const toggleElement = (arr, val, compFn = idComparator) => {
  const res = arr.filter(v => !compFn(v, val));  // Remove the item
  if (res.length === arr.length) res.push(val);  // If not removed, add the item
  return res;
};

// Example with simple numbers
const nums = [1, 2, 3];
console.log(toggleElement(nums, 2)); // [1, 3]
console.log(toggleElement(nums, 4)); // [1, 2, 3, 4]

// Example with objects
const john = { name: 'John', age: 30 };
const jane = { name: 'Jane', age: 28 };
const jack = { name: 'Jack', age: 28 };
const people = [john, jane];

// Toggle based on name
const nameComparator = (a, b) => a.name === b.name;

console.log(toggleElement(people, jane, nameComparator)); // [{ name: 'John', age: 30 }]
console.log(toggleElement(people, jack, nameComparator)); // [{ name: 'John', age: 30 }, { name: 'Jane', age: 28 }, { name: 'Jack', age: 28 }]
```

#### Explanation:
- The function `toggleElement` accepts a `compFn` argument, which is used to compare elements in the array. If not provided, it defaults to `idComparator`, which compares primitive values (`===`).
- **Filter step**: The `filter` method is used to remove all elements that match `val` based on the comparison function `compFn`.
- **Length check**: After filtering, if the length of the resulting array is the same as the original, it means the element wasn't found, so we append it.

---

### General Strategy for Both Cases:
1. **Check if the element is present** using `includes` (for primitives) or a comparison function (for objects).
2. **Remove the element** if it exists using `filter()`.
3. **Add the element** to the array if it wasn't found.

### Why Use a Comparison Function for Objects?
When working with objects, you can't directly compare objects using `===` because different object instances with the same properties are considered different. That's why we provide a `compFn` that checks the equality of object properties (like `name`, `id`, etc.).

For example, if you want to toggle based on a user's `name`, you'd use a `nameComparator` function to compare the `name` properties of the objects.

---

### Further Enhancements:
- **Multiple comparison criteria**: You can enhance `compFn` to compare multiple object properties if needed.
- **In-place Mutation**: If you need the array to be mutated in-place (rather than returning a new array), you can modify the function to mutate `arr` instead of returning a new array.

Let me know if you need help with further customizations!