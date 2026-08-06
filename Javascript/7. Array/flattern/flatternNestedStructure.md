```js 
function flattenNestedStructure(input) {
    const flatten = (arr) => {
        return arr.reduce((acc, item) => {
            if (Array.isArray(item)) {
                acc = acc.concat(flatten(item));
            } else if (typeof item === 'object' && item !== null) {
                acc = acc.concat(flatten(Object.values(item)));
            } else {
                acc.push(item);
            }
            return acc;
        }, []);
    };

    return flatten(input);
}

// Example usage:
const input = [
    1,
    [2, 3],
    {
        "key1": "value1",
        "key2": [4, 5],
        "key3": {
            "subkey1": 6,
            "subkey2": [7, 8]
        }
    }
];

console.log(flattenNestedStructure(input));

```


The `flattenNestedStructure` function you provided is a recursive solution to flatten a nested structure, where the input can be a mix of arrays, objects, and primitive values. It uses the `reduce()` method to traverse and flatten the structure, handling nested arrays and objects at any depth.

### **How the Code Works**

1. **Main Function (`flattenNestedStructure`)**:
   - This function defines a helper function `flatten` that recursively flattens the input structure.
   - `flatten` takes an array (`arr`) as input and iterates through each item to determine if it is an array, object, or a primitive value.

2. **Recursive Flattening**:
   - If the item is an array, the function calls `flatten` on that array and concatenates the result.
   - If the item is an object (but not `null`), it calls `flatten` on the values of the object (using `Object.values(item)` to get an array of values), ensuring nested objects are also flattened.
   - If the item is neither an array nor an object, it directly adds the item to the accumulator (`acc`).

3. **Base Case**:
   - If the input is a primitive value (such as a number, string, etc.), it is simply added to the resulting array.

4. **Example Usage**:
   - The input example includes both arrays and objects with nested structures. The function will recursively flatten it into a single array of values.

### **Example Walkthrough**

#### Input:
```javascript
const input = [
    1,
    [2, 3],
    {
        "key1": "value1",
        "key2": [4, 5],
        "key3": {
            "subkey1": 6,
            "subkey2": [7, 8]
        }
    }
];
```

#### Execution:

- **Step 1**: `flatten([1, [2, 3], {...}])`
  - `1` is a primitive, so it's added directly to the accumulator: `[1]`.
  - Next, it processes `[2, 3]`, calling `flatten([2, 3])`.
    - `2` and `3` are primitives, so they are added to the accumulator: `[2, 3]`.
  - Then, it processes the object `{key1: "value1", key2: [4, 5], key3: {...}}`.
    - It calls `flatten(Object.values({key1: "value1", key2: [4, 5], key3: {...}}))`, which is `flatten(["value1", [4, 5], {...}])`.
      - `"value1"` is a primitive, so it's added to the accumulator: `["value1"]`.
      - It processes `[4, 5]` by calling `flatten([4, 5])`.
        - `4` and `5` are primitives, so they are added: `[4, 5]`.
      - It processes the nested object `{subkey1: 6, subkey2: [7, 8]}`.
        - It calls `flatten(Object.values({subkey1: 6, subkey2: [7, 8]}))`, which is `flatten([6, [7, 8]])`.
          - `6` is a primitive, so it's added: `[6]`.
          - It processes `[7, 8]` by calling `flatten([7, 8])`.
            - `7` and `8` are primitives, so they are added: `[7, 8]`.
        - The nested object `{subkey1: 6, subkey2: [7, 8]}` flattens to `[6, 7, 8]`.

#### Final Flattened Array:
```javascript
[1, 2, 3, "value1", 4, 5, 6, 7, 8]
```

### **Code Example**

```javascript
function flattenNestedStructure(input) {
    const flatten = (arr) => {
        return arr.reduce((acc, item) => {
            if (Array.isArray(item)) {
                acc = acc.concat(flatten(item));
            } else if (typeof item === 'object' && item !== null) {
                acc = acc.concat(flatten(Object.values(item)));
            } else {
                acc.push(item);
            }
            return acc;
        }, []);
    };

    return flatten(input);
}

// Example usage:
const input = [
    1,
    [2, 3],
    {
        "key1": "value1",
        "key2": [4, 5],
        "key3": {
            "subkey1": 6,
            "subkey2": [7, 8]
        }
    }
];

console.log(flattenNestedStructure(input));
// Output: [1, 2, 3, "value1", 4, 5, 6, 7, 8]
```

### **Edge Cases**

- **Empty Arrays**: If the input contains an empty array, it will not affect the result, as the flattening function just ignores empty arrays.
  ```javascript
  flattenNestedStructure([[], 1, [2, 3]])  // Output: [1, 2, 3]
  ```
  
- **Empty Objects**: If the input contains empty objects, they will not contribute any values.
  ```javascript
  flattenNestedStructure([{}, 1, {key: "value"}])  // Output: [1, "value"]
  ```

- **Null or Undefined**: If the input contains `null` or `undefined`, these values will be treated as primitive values and added to the result.
  ```javascript
  flattenNestedStructure([null, undefined, 1])  // Output: [null, undefined, 1]
  ```

### **Time Complexity**
- The time complexity is **O(n)**, where `n` is the total number of elements in the structure. This is because the function visits each element once during the flattening process.

### **Space Complexity**
- The space complexity is **O(n)** as well, since the function creates a new array to store the flattened result.

### **Conclusion**
This `flattenNestedStructure` function is a powerful and flexible way to flatten deeply nested arrays and objects in JavaScript. It handles mixed data types (arrays, objects, and primitives) and can handle any level of nesting. It also uses recursion effectively to deal with nested structures, making it suitable for complex hierarchical data.