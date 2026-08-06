```js
let arr = ["apple", "mango", "apple", "orange", "mango", "mango"];

function removeDuplicates(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}
console.log(removeDuplicates(arr));

```

You can remove duplicates from an array in JavaScript using several methods, each with its own approach. Below are the examples for removing duplicates using `Set`, `Array.from()`, `reduce()`, `forEach()`, and `filter()` with `indexOf()`.

### 1. **Using `Set`**

A **Set** is a built-in JavaScript object that only allows unique values. Using a `Set` is one of the most concise and efficient ways to remove duplicates from an array.

```javascript
const arr = [1, 2, 2, 3, 4, 4, 5];

const uniqueArr = [...new Set(arr)];

console.log(uniqueArr); // [1, 2, 3, 4, 5]
```

- **Explanation**: 
  - A `Set` automatically removes duplicates because it only stores unique values.
  - We use the spread operator (`...`) to convert the `Set` back to an array.

### 2. **Using `Array.from()`**

The `Array.from()` method can be used to convert a `Set` back into an array after we have used it to remove duplicates.

```javascript
const arr = [1, 2, 2, 3, 4, 4, 5];

const uniqueArr = Array.from(new Set(arr));

console.log(uniqueArr); // [1, 2, 3, 4, 5]
```

- **Explanation**:
  - Similar to the previous example, we first convert the array into a `Set` (which removes duplicates), and then convert the `Set` back to an array using `Array.from()`.

### 3. **Using `reduce()`**

The `reduce()` method can be used to iterate over the array and accumulate only unique values.

```javascript
const arr = [1, 2, 2, 3, 4, 4, 5];

const uniqueArr = arr.reduce((acc, curr) => {
  if (!acc.includes(curr)) {
    acc.push(curr);
  }
  return acc;
}, []);

console.log(uniqueArr); // [1, 2, 3, 4, 5]
```

- **Explanation**:
  - We use `reduce()` to accumulate unique values into an accumulator array `acc`.
  - The `includes()` method is used to check if the current value already exists in the accumulator.

### 4. **Using `forEach()`**

You can also use `forEach()` to iterate through the array and manually push unique elements to a new array.

```javascript
const arr = [1, 2, 2, 3, 4, 4, 5];

const uniqueArr = [];
arr.forEach((item) => {
  if (!uniqueArr.includes(item)) {
    uniqueArr.push(item);
  }
});

console.log(uniqueArr); // [1, 2, 3, 4, 5]
```

- **Explanation**:
  - The `forEach()` method iterates over each element in the original array.
  - `includes()` checks if the element is already in the `uniqueArr`, and if not, it is pushed to the result array.

### 5. **Using `filter()` with `indexOf()`**

The `filter()` method can be used with `indexOf()` to keep only the first occurrence of each element.

```javascript
const arr = [1, 2, 2, 3, 4, 4, 5];

const uniqueArr = arr.filter((item, index) => arr.indexOf(item) === index);

console.log(uniqueArr); // [1, 2, 3, 4, 5]
```

- **Explanation**:
  - The `filter()` method checks if the current element's index matches the first occurrence of that element in the array.
  - `indexOf()` returns the first index where the element appears in the array.
  - If the current index matches the first occurrence index, the element is included in the result; otherwise, it's ignored.

---

### Comparison of Methods

- **`Set` and `Array.from()`** are the most efficient and concise ways to remove duplicates because they automatically handle uniqueness without needing explicit checks.
- **`reduce()`, `forEach()`, and `filter()` with `indexOf()`** work by iterating over the array and performing checks to ensure uniqueness. These methods are less efficient compared to `Set`, especially for large arrays, since `includes()` and `indexOf()` both involve linear searches.

---

### Conclusion

Each method shown above can be used to remove duplicates from an array in JavaScript, and which one you choose depends on your needs:
- **For conciseness and efficiency**: Use `Set` or `Array.from()`.
- **For custom handling or older browsers**: `reduce()`, `forEach()`, and `filter()` can be used, but they are typically less efficient due to the multiple searches (`indexOf`, `includes`) for each element.