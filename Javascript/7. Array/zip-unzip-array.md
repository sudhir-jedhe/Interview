You've provided a clear explanation and implementation of both **zipping** and **unzipping** arrays, as well as zipping and unzipping objects. I'll walk through your code and provide some insights and improvements where applicable. These operations are extremely useful in scenarios where you need to pair elements or split combined data into individual components.

### **Zipping Arrays:**

The `zip` function you implemented correctly combines multiple arrays into a single array of arrays, where each inner array contains elements from the same index of the original arrays.

#### Code:
```javascript
const zip = (...arrays) => {
  const maxLength = Math.max(...arrays.map(x => x.length));  // Find the maximum length of input arrays
  return Array.from({ length: maxLength }).map((_, i) => {
    return Array.from({ length: arrays.length }, (_, k) => arrays[k][i]);
  });
};

console.log(zip(['a', 'b'], [1, 2], [true, false])); // [['a', 1, true], ['b', 2, false]]
console.log(zip(['a'], [1, 2], [true, false])); // [['a', 1, true], [undefined, 2, false]]
```

#### Explanation:
- **Step 1**: `Math.max(...arrays.map(x => x.length))` calculates the length of the longest array. This helps ensure that the zipped result has the correct number of rows (i.e., the maximum number of elements across the input arrays).
- **Step 2**: `Array.from({ length: maxLength })` creates an array with `maxLength` elements. For each element of this array, we are using `map` to create a new array, where each item corresponds to an element from the input arrays at the same index `i`.
- **Step 3**: Inside the inner `map`, we are collecting values from each array at index `i`, using `arrays[k][i]`.

#### Example Outputs:
- `zip(['a', 'b'], [1, 2], [true, false])` results in `[ ['a', 1, true], ['b', 2, false] ]`.
- `zip(['a'], [1, 2], [true, false])` results in `[ ['a', 1, true], [undefined, 2, false] ]` because the first array has only one element.

#### Note:
- **Handling Undefined Values**: In cases where the arrays have unequal lengths, the shorter arrays will contribute `undefined` for missing elements (as shown in the second example).
  
### **Unzipping Arrays:**

The `unzip` function reverses the zipping process, splitting an array of arrays back into individual arrays.

#### Code:
```javascript
const unzip = arr =>
  arr.reduce(
    (acc, val) => (val.forEach((v, i) => acc[i].push(v)), acc),
    Array.from({
      length: Math.max(...arr.map(x => x.length))  // Get the length of the longest inner array
    }).map(x => [])
  );

console.log(unzip([['a', 1, true], ['b', 2, false]])); // [['a', 'b'], [1, 2], [true, false]]
console.log(unzip([['a', 1, true], ['b', 2]])); // [['a', 'b'], [1, 2], [true]]
```

#### Explanation:
- **Step 1**: The `reduce` function iterates over each sub-array of the zipped array and distributes the values across the result arrays.
- **Step 2**: We initialize the result array (`acc`) with empty arrays for each position. The `map(x => [])` creates an array of empty arrays for each index position based on the length of the longest inner array.
- **Step 3**: For each sub-array (`val`), `forEach` is used to push each value to the correct index in the result array (`acc`).

#### Example Outputs:
- `unzip([['a', 1, true], ['b', 2, false]])` results in `[ ['a', 'b'], [1, 2], [true, false] ]`.
- `unzip([['a', 1, true], ['b', 2]])` results in `[ ['a', 'b'], [1, 2], [true] ]`.

#### Note:
- **Handling Different Lengths**: If the inner arrays have different lengths, the function correctly handles missing values, ensuring that each output array has the correct number of elements.

### **Zipping Arrays into Objects:**

You also have a function that "zips" an array of keys with an array of values to create an object.

#### Code:
```javascript
const zipObject = (props, values) =>
  props.reduce((obj, prop, index) => ((obj[prop] = values[index]), obj), {});

console.log(zipObject(['a', 'b', 'c'], [1, 2])); // {a: 1, b: 2, c: undefined}
console.log(zipObject(['a', 'b'], [1, 2, 3])); // {a: 1, b: 2}
```

#### Explanation:
- **Step 1**: We use the `reduce` method to build the object. For each `prop` in the `props` array, we assign it the corresponding value from the `values` array at the same index (`values[index]`).
- **Step 2**: The `reduce` function starts with an empty object `{}` and progressively adds key-value pairs to it.

#### Example Outputs:
- `zipObject(['a', 'b', 'c'], [1, 2])` results in `{a: 1, b: 2, c: undefined}` because there's no value for `c`, so it gets `undefined`.
- `zipObject(['a', 'b'], [1, 2, 3])` results in `{a: 1, b: 2}` because we stop after filling the available keys with the values.

#### Note:
- **Handling Extra Values**: If the `values` array has more elements than the `props` array, the excess values are ignored.
- **Handling Undefined**: If the `props` array has more elements than the `values` array, the missing values are assigned `undefined`.

### **Unzipping Objects:**

The `unzipObject` function takes an object and separates its keys and values into two arrays.

#### Code:
```javascript
const unzipObject = obj => [
  Object.keys(obj),
  Object.values(obj)
];

console.log(unzipObject({a: 1, b: 2, c: 3})); // [['a', 'b', 'c'], [1, 2, 3]]
console.log(unzipObject({a: 1, b: 2})); // [['a', 'b'], [1, 2]]
```

#### Explanation:
- **Step 1**: `Object.keys(obj)` retrieves the keys of the object as an array.
- **Step 2**: `Object.values(obj)` retrieves the values of the object as an array.

#### Example Outputs:
- `unzipObject({a: 1, b: 2, c: 3})` results in `[ ['a', 'b', 'c'], [1, 2, 3] ]`.
- `unzipObject({a: 1, b: 2})` results in `[ ['a', 'b'], [1, 2] ]`.

### **Summary:**
- **Zip Arrays**: Combine multiple arrays into a single array of arrays, where each inner array contains elements from the same index in the original arrays.
- **Unzip Arrays**: Split a single array of arrays back into individual arrays based on index positions.
- **Zip Arrays into Objects**: Combine two arrays (one of keys and one of values) into an object, with keys mapped to corresponding values.
- **Unzip Objects into Arrays**: Convert an object back into two arrays, one for the keys and one for the values.

These utilities are fundamental in scenarios where you need to manipulate data structures and are great for working with pairs of data like key-value pairs or grouped elements!