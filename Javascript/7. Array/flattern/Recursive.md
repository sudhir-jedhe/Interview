### **Solution 1: Using `reduce` and `concat` for Flattening**

This approach uses `Array.prototype.reduce` along with `concat` to flatten nested arrays recursively.

#### **Explanation:**

- **`reduce`**:
   - The `reduce` method is used to iterate over the array and accumulate a single result (`acc`).
   - For each `curr` element, we check if it is an array. If it is, we recursively call `flatten(curr)` to flatten it further. If it's not an array, we add it to the accumulator `acc` directly.

- **Base Case**: If an element is not an array, it is added directly to the result array.

#### **Code Implementation:**

```js
/**
 * @param {Array<*|Array>} value
 * @return {Array}
 */
export default function flatten(value) {
  return value.reduce(
    (acc, curr) => acc.concat(Array.isArray(curr) ? flatten(curr) : curr),
    []
  );
}
```

#### **Examples:**

1. **Flatten a simple array**:
   ```js
   flatten([1, 2, 3]); 
   // Output: [1, 2, 3]
   ```
   - No nesting, so it returns the same array.

2. **Flatten an array with one level of nesting**:
   ```js
   flatten([1, [2, 3]]);
   // Output: [1, 2, 3]
   ```
   - The inner array `[2, 3]` is flattened into the main array.

3. **Flatten an array with multiple levels of nesting**:
   ```js
   flatten([1, [2, [3, [4, [5]]]]]);
   // Output: [1, 2, 3, 4, 5]
   ```
   - The deeply nested arrays are flattened recursively.

---

### **Solution 2: Using `flatMap` for Flattening**

This solution uses `Array.prototype.flatMap` in combination with recursion to flatten arrays. The `flatMap` method is used here to both apply a function and flatten the resulting array by one level.

#### **Explanation:**

- **`flatMap`**:
   - `flatMap` first maps each element to a new value and then flattens the result by one level.
   - In the recursive version, `flatMap` is called on each item to recursively flatten any nested arrays, continuing until all levels are flattened.

#### **Code Implementation:**

```js
type ArrayValue = any | Array<ArrayValue>;

export default function flatten(value: Array<ArrayValue>): Array<any> {
  return Array.isArray(value) ? value.flatMap((item) => flatten(item)) : value;
}
```

#### **Examples:**

1. **Flatten a simple array**:
   ```js
   flatten([1, 2, 3]);
   // Output: [1, 2, 3]
   ```

2. **Flatten an array with one level of nesting**:
   ```js
   flatten([1, [2, 3]]);
   // Output: [1, 2, 3]
   ```

3. **Flatten an array with multiple levels of nesting**:
   ```js
   flatten([1, [2, [3, [4, [5]]]]]);
   // Output: [1, 2, 3, 4, 5]
   ```

#### **Key Differences:**

- **`reduce + concat` Approach**: This is a more manual approach where we handle both the flattening and accumulation of values explicitly using `reduce` and `concat`.
- **`flatMap` Approach**: This is a more concise, modern solution that leverages the `flatMap` method to achieve the same result, with less boilerplate code. It recursively flattens the array until all levels are reduced.

---

### **Conclusion:**
Both solutions effectively flatten a nested array. The `reduce + concat` solution provides more control and might be more familiar to developers who prefer manual iteration. The `flatMap` solution is more concise and leverages modern JavaScript features to achieve the same result more elegantly.