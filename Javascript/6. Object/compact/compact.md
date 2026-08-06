Your approach for compacting arrays and objects is well-structured and covers various scenarios including shallow and deep compaction. Let's go over each part and clarify what's happening.

### 1. **Remove Falsy Values from an Object**

Your `removeFalsyValues` function iterates over the object's entries and checks if the value is truthy. If the value is truthy, it adds it to the new object, effectively removing any falsy values (`false`, `null`, `0`, `''`, `undefined`, `NaN`).

```javascript
function removeFalsyValues(obj) {
  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value) {
      newObj[key] = value;
    }
  }
  return newObj;
}

// Example usage:
const obj = {
  name: "John Doe",
  age: 30,
  occupation: null,
  hobbies: ["coding", "reading"],
};

const newObj = removeFalsyValues(obj);

console.log(newObj); 
// Output: { name: "John Doe", age: 30, hobbies: ["coding", "reading"] }
```

### 2. **Compact an Array**

To compact an array (i.e., remove all falsy values), you can use the `Array.prototype.filter()` method combined with `Boolean` to filter out falsy values:

```javascript
const compact = arr => arr.filter(Boolean);

console.log(compact([0, 1, false, 2, '', 3, 'a', 'e' * 23, NaN, 's', 34]));
// Output: [ 1, 2, 3, 'a', 's', 34 ]
```

In the example above:
- `0`, `false`, `''`, `NaN`, and other falsy values are removed.
- The resulting array contains only truthy values.

### 3. **Compact an Object**

To compact an object (i.e., remove any key-value pairs where the value is falsy), we use `Object.entries()` to get the key-value pairs, then filter those pairs based on their values:

```javascript
const compact = obj =>
  Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => Boolean(value))
  );

console.log(compact({ a: 0, b: 1, c: false, d: '', e: 2, f: 'a', g: 'e' * 23, h: NaN }));
// Output: { b: 1, e: 2, f: 'a' }
```

Here, we use `Object.entries()` to convert the object into an array of `[key, value]` pairs. Then, `filter(Boolean)` is used to keep only truthy values. After filtering, `Object.fromEntries()` is used to convert the filtered array of pairs back into an object.

### 4. **Deep Compact an Array or Object**

A **deep compaction** means that you want to recursively remove falsy values from both arrays and objects, including nested structures.

We achieve this by:
- Using recursion: If a value is an object, call the `deepCompact` function again.
- Using `Array.isArray(val)` to check if the value is an array.
- Using `Object.entries(val).reduce()` to iterate over the object's keys and values.

Here's the deep compaction function:

```javascript
const deepCompact = val => {
  const data = Array.isArray(val) ? val.filter(Boolean) : val;
  return Object.entries(data).reduce(
    (acc, [key, value]) => {
      if (Boolean(value)) {
        // If the value is truthy, we either add it or recursively compact it
        acc[key] = typeof value === 'object' ? deepCompact(value) : value;
      }
      return acc;
    },
    Array.isArray(val) ? [] : {}  // Return an array or object based on input type
  );
};

const obj = {
  a: null,
  b: false,
  c: true,
  d: 0,
  e: 1,
  f: '',
  g: 'a',
  h: [null, false, '', true, 1, 'a', { i: 0, j: 2 }],
  k: { l: 0, m: false, n: 'a', o: [0, 1] }
};

console.log(deepCompact(obj));
/*
Output:
{
  c: true,
  e: 1,
  g: 'a',
  h: [ true, 1, 'a', { j: 2 } ],
  k: { n: 'a', o: [1] }
}
*/
```

### Explanation of the `deepCompact` function:
1. **Base Case for Arrays**: If the value is an array, we filter out falsy values with `filter(Boolean)`.
2. **Base Case for Objects**: If the value is an object, we use `Object.entries(data).reduce()` to iterate through its entries.
3. **Recursive Case**: If the value of an object entry is an object itself, we recursively call `deepCompact(value)`.
4. **Boolean Check**: We only keep truthy values (`Boolean(value)` checks this).
5. **Return Type**: We use `Array.isArray(val) ? [] : {}` to decide whether the result should be an array or an object, preserving the structure.

### Output Walkthrough:

For the object:

```javascript
const obj = {
  a: null,
  b: false,
  c: true,
  d: 0,
  e: 1,
  f: '',
  g: 'a',
  h: [null, false, '', true, 1, 'a', { i: 0, j: 2 }],
  k: { l: 0, m: false, n: 'a', o: [0, 1] }
};
```

- **`a: null`**: Removed (falsy).
- **`b: false`**: Removed (falsy).
- **`c: true`**: Kept (truthy).
- **`d: 0`**: Removed (falsy).
- **`e: 1`**: Kept (truthy).
- **`f: ''`**: Removed (falsy).
- **`g: 'a'`**: Kept (truthy).
- **`h: [null, false, '', true, 1, 'a', { i: 0, j: 2 }]`**: 
  - Falsy values in the array are removed (`null`, `false`, `''`), leaving `[true, 1, 'a', { i: 0, j: 2 }]`.
- **`k: { l: 0, m: false, n: 'a', o: [0, 1] }`**:
  - Falsy values in the object (`l: 0`, `m: false`) are removed, leaving `{ n: 'a', o: [0, 1] }`.

### Summary of Functions:
- **`removeFalsyValues(obj)`**: Removes falsy values from an object.
- **`compact(arr)`**: Removes falsy values from an array.
- **`compact(obj)`**: Removes falsy values from an object.
- **`deepCompact(val)`**: Recursively removes falsy values from both arrays and objects, including nested structures.

These functions are handy when you need to clean data by removing any invalid, empty, or unnecessary entries from arrays and objects, especially when dealing with user input, API responses, or malformed data.