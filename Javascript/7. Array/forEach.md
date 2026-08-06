### Custom `forEach` Implementation and Example Usage

#### 1. **Custom `forEach` Implementation**: 

You’ve implemented a custom version of the `forEach` method to iterate over an array. Here’s a breakdown of your implementation:

```javascript
Array.prototype.customForEach = function myEach(callback) {
  for (let index = 0; index < this.length; index++) {
    let current = this[index];
    if (Object.hasOwnProperty.call(this, index)) {
      callback(current, index, this);
    }
  }
};
```

- **Explanation**:
  - You define a method `myEach` (which is the same as `forEach`) on the `Array.prototype`. This allows all arrays to use `myEach` like a regular `forEach`.
  - The method loops through the array using a traditional `for` loop, checking each index with `Object.hasOwnProperty.call()` to ensure the index exists and is not deleted or uninitialized (which would occur in sparse arrays).
  - Then, for each element, the provided `callback` is called with three arguments: the current element, the index, and the array itself.

#### 2. **Using `forEach` Method**: 

The `forEach` method calls a provided callback function for each element in an array, in ascending order. Let's look at some examples:

```javascript
const words = ["pen", "pencil", "falcon", "rock", "sky", "earth"];

words.forEach((e) => console.log(e));  // Outputs each element in the array

console.log("-------------------------");

words.forEach((e, idx) => console.log(`${e} has index ${idx}`));  
// Outputs each element with its index
```

- **Explanation**:
  - `forEach` is called on the `words` array.
  - In the first example, it logs each element (`e`).
  - In the second example, it also logs the index (`idx`) along with the element.

#### 3. **Using `forEach` to Square Numbers**:

```javascript
let vals = [1, 2, 3, 4, 5];

vals.forEach((e) => console.log(e * e));  // Logs the square of each number
console.dir(vals);  // Logs the original array
```

- **Explanation**:
  - This example demonstrates using `forEach` to perform an operation (squaring) on each element in the array.
  - `vals` remains unchanged because `forEach` doesn't return a new array — it simply performs an action on each element.

#### 4. **Using `map` and `forEach` Together**:

```javascript
let vals2 = vals.map((e) => e * e);  // Creates a new array with squared values
vals2.forEach((e) => console.log(e));  // Logs each squared value
console.dir(vals2);  // Logs the new squared array
```

- **Explanation**:
  - `map` is used to create a new array `vals2` where each element is the square of the corresponding element in `vals`.
  - `forEach` is then used to log the squared values.

#### 5. **Using `forEach` on a `Map`**:

```javascript
let stones = new Map([
  [1, "garnet"],
  [2, "topaz"],
  [3, "opal"],
  [4, "amethyst"],
]);

stones.forEach((v, k) => {
  console.log(`${k}: ${v}`);  // Logs the key and value of each entry in the Map
});
```

- **Explanation**:
  - This example demonstrates how to use `forEach` on a `Map`. The `forEach` callback on a `Map` receives two arguments: the value (`v`) and the key (`k`).
  - The method logs the key-value pairs of the `stones` map.

#### 6. **Removing Duplicates from an Array Using `forEach`**:

```javascript
let arr = ["apple", "mango", "apple", "orange", "mango", "mango"];

function removeDuplicates(arr) {
  let unique = [];
  arr.forEach((element) => {
    if (!unique.includes(element)) {
      unique.push(element);
    }
  });
  return unique;
}

console.log(removeDuplicates(arr));  // Logs an array with duplicates removed
```

- **Explanation**:
  - The `removeDuplicates` function iterates over the `arr` array using `forEach`. 
  - For each element, it checks if the element is already in the `unique` array. If not, it adds the element to `unique`.
  - The result is an array with duplicate elements removed.

---

### Key Points

- **`forEach`**: 
  - It's useful when you need to perform a side-effect for each item in the array (e.g., logging, updating external state).
  - It does **not** return a new array. Instead, it modifies or interacts with external state.
  - You **cannot break** out of a `forEach` loop like you can with a traditional `for` loop. If you need to break or return early, consider using a `for` loop, `for...of`, or `Array.some()`/`Array.every()`.

- **`map` + `forEach`**: 
  - You can use `map` to transform data into a new array, and `forEach` to iterate through it or apply operations.

- **`Map` and `forEach`**: 
  - For `Map` objects, `forEach` allows easy iteration over key-value pairs, unlike arrays which are indexed.

- **Custom `forEach`**: 
  - Implementing your own `forEach` function is a good exercise in understanding how `forEach` works under the hood. It can also be customized to handle more specific behaviors (like sparse arrays).

