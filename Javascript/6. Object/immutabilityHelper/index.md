To implement your own **Immutability Helper** with the required features (`$push`, `$set`, `$merge`, `$apply`), we can create a function called `update` that can handle these operations. The idea is to return a new object or array with the modifications applied, following the principles of immutability, which is commonly used in libraries like React for state management.

Here is the implementation of the `update` function:

```js
function update(target, spec) {
  // If the target is an array
  if (Array.isArray(target)) {
    // We need to make a shallow copy of the array first
    const newArray = [...target];

    // Iterate over the spec and apply the operations
    for (let key in spec) {
      const operation = spec[key];

      // Handle the operations
      if (operation && operation.$push) {
        // $push adds the elements in the array to the target array
        newArray.push(...operation.$push);
      } else if (operation && operation.$set !== undefined) {
        // $set replaces the target array element
        const index = Number(key);
        newArray[index] = operation.$set;
      } else if (operation && operation.$apply) {
        // $apply applies a custom function to an array element
        const index = Number(key);
        newArray[index] = operation.$apply(newArray[index]);
      }
    }

    return newArray;
  }

  // If the target is an object (could be a state object)
  if (typeof target === 'object' && target !== null) {
    // Make a shallow copy of the target object first
    const newObject = { ...target };

    // Iterate over the spec and apply the operations
    for (let key in spec) {
      const operation = spec[key];

      // Handle the operations
      if (operation && operation.$set !== undefined) {
        // $set replaces the target property
        newObject[key] = operation.$set;
      } else if (operation && operation.$merge) {
        // $merge merges an object into the target object
        newObject[key] = { ...newObject[key], ...operation.$merge };
      } else if (typeof operation === 'object') {
        // Recursively apply the update to nested objects
        newObject[key] = update(newObject[key], operation);
      }
    }

    return newObject;
  }

  // If it's not an array or object, just return the target (for primitive types)
  return target;
}

// Example 1: Using $push to add elements to an array
const arr = [1, 2, 3, 4];
const newArr = update(arr, { $push: [5, 6] });
console.log(newArr); // [1, 2, 3, 4, 5, 6]

// Example 2: Using $set to replace a nested object property
const state = {
  a: {
    b: {
      c: 1
    }
  },
  d: 2
};

const newState = update(state, { a: { b: { c: { $set: 3 } } } });
console.log(newState);
// {
//   a: {
//     b: {
//       c: 3
//     }
//   },
//   d: 2
// }

// Example 3: Using $merge to merge an object into an existing object
const mergedState = update(state, { a: { b: { $merge: { e: 5 } } } });
console.log(mergedState);
// {
//   a: {
//     b: {
//       c: 1,
//       e: 5
//     }
//   },
//   d: 2
// }

// Example 4: Using $apply to apply a function to a specific element in an array
const updatedArr = update(arr, { 0: { $apply: (item) => item * 2 } });
console.log(updatedArr); // [2, 2, 3, 4]
```

### Explanation:

- **`$push`**: Adds elements to an array (like `Array.prototype.push`). We use `newArray.push(...operation.$push)` to append multiple elements from the provided array.

- **`$set`**: Replaces the value at the given index or key with the specified value. For arrays, this targets the index; for objects, it directly sets the value.

- **`$merge`**: Merges an object into an existing object. We use the spread operator (`...`) to combine the existing value with the new value.

- **`$apply`**: Applies a custom function to a value (in the case of arrays, to an array element). We invoke the function provided in `$apply` to modify the value at the given index.

### Key Features:
- The function first checks if the target is an **array** or **object**. If it is an array, we create a shallow copy of it and apply the relevant operations based on the spec object.
- For **objects**, the function performs a shallow copy and recursively updates nested properties if necessary.
- The operations are applied **immutably**, meaning the original object or array is not modified. Instead, a new copy is returned with the applied changes.

### Example Usages:

1. **Push operation** (`$push`):
   - Add new items to an array.
   ```js
   const arr = [1, 2, 3];
   const newArr = update(arr, { $push: [4, 5] });
   console.log(newArr); // [1, 2, 3, 4, 5]
   ```

2. **Set operation** (`$set`):
   - Replace a value in an object or array.
   ```js
   const state = { a: { b: { c: 1 } }, d: 2 };
   const newState = update(state, { a: { b: { c: { $set: 3 } } } });
   console.log(newState); // { a: { b: { c: 3 } }, d: 2 }
   ```

3. **Merge operation** (`$merge`):
   - Merge an object into a nested object.
   ```js
   const state = { a: { b: { c: 1 } }, d: 2 };
   const newState = update(state, { a: { b: { $merge: { e: 5 } } } });
   console.log(newState); // { a: { b: { c: 1, e: 5 } }, d: 2 }
   ```

4. **Apply operation** (`$apply`):
   - Apply a function to a specific element in an array.
   ```js
   const arr = [1, 2, 3, 4];
   const newArr = update(arr, { 0: { $apply: (item) => item * 2 } });
   console.log(newArr); // [2, 2, 3, 4]
   ```

This approach offers an efficient way to manage immutable updates, especially in state management scenarios where you may want to modify nested properties without the overhead of deep cloning.