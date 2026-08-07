If you'd like to preserve the original object and not modify it directly while removing the specified keys, you can create a deep copy of the object first. This way, any modifications are made on the copy, leaving the original object unchanged.

Here's an updated version of your `removeKeys` function that makes a deep copy of the object before performing the key removal. This ensures that the original object remains unchanged:

### Updated `removeKeys` Function (with Deep Copy)

```javascript
function deepCopy(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj; // return primitive value as is
  }

  // Create a new object or array based on the type of obj
  const copy = Array.isArray(obj) ? [] : {};

  // Recurse for each key of the object or array
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = deepCopy(obj[key]);
    }
  }

  return copy;
}

function removeKeys(obj, keys) {
  // Make a deep copy to ensure the original object remains unmodified
  const newObj = deepCopy(obj);

  // Recursively iterate over the new object
  function recurse(obj) {
    if (Array.isArray(obj)) {
      // If it's an array, iterate over its elements and apply removeKeys recursively
      obj.forEach((item) => recurse(item));
    } else if (typeof obj === 'object' && obj !== null) {
      // If it's an object, iterate over its keys
      Object.keys(obj).forEach((key) => {
        if (keys.includes(key)) {
          delete obj[key]; // Delete the key if it matches the keys array
        } else {
          recurse(obj[key]); // Recursively call removeKeys for nested objects or arrays
        }
      });
    }
  }

  recurse(newObj); // Start recursion on the copied object
  return newObj; // Return the modified copy
}

// Example usage:
const obj = {
  name: "John Doe",
  age: 30,
  address: {
    street: "123 Main Street",
    city: "San Francisco",
    state: "CA",
  },
  hobbies: ["coding", "reading", "hiking"],
};

const keysToRemove = ["age", "hobbies"];

const modifiedObj = removeKeys(obj, keysToRemove);

console.log(modifiedObj);
// Output: { name: "John Doe", address: { street: "123 Main Street", city: "San Francisco", state: "CA" } }

console.log(obj);
// Original object is unchanged:
// { name: "John Doe", age: 30, address: { street: "123 Main Street", city: "San Francisco", state: "CA" }, hobbies: ["coding", "reading", "hiking"] }
```

### Key Points

1. **Deep Copy:**
   The `deepCopy` function creates a deep copy of the input object. This way, the original object remains unchanged, and all modifications (like deleting keys) are done on the copy.

2. **Recursive Removal:**
   The `removeKeys` function recursively traverses the object, checking each key and removing it if it matches any of the keys specified in the `keys` array. It handles nested objects and arrays.

3. **Preserving Original Object:**
   The original `obj` is preserved as it is. All modifications are done to the deep copy (`newObj`), which is returned after the specified keys are removed.

### Example with Nested Objects

```javascript
const obj = {
  name: "Alice",
  age: 25,
  address: {
    street: "456 Elm St",
    city: "Los Angeles",
    state: "CA",
  },
  hobbies: [
    { type: "sport", name: "basketball" },
    { type: "reading", name: "novels" },
  ],
};

const keysToRemove = ["age", "name"];

const modifiedObj = removeKeys(obj, keysToRemove);

console.log(modifiedObj);
// Output:
// {
//   address: { street: "456 Elm St", city: "Los Angeles", state: "CA" },
//   hobbies: [ { type: "sport" }, { type: "reading" } ]
// }

console.log(obj);
// Output: Original object remains unchanged:
// {
//   name: "Alice",
//   age: 25,
//   address: { street: "456 Elm St", city: "Los Angeles", state: "CA" },
//   hobbies: [ { type: "sport", name: "basketball" }, { type: "reading", name: "novels" } ]
// }
```

### Explanation

- **Deep Copy Function:**  
   The `deepCopy` function ensures that nested objects and arrays are also copied recursively. This prevents any reference to the original object from being shared with the copy.
  
- **No Direct Modification of Original Object:**  
   By operating on a deep copy (`newObj`), the original object (`obj`) remains untouched and unchanged, which is crucial when you need immutability in your data.

- **Removing Keys from Nested Objects/Arrays:**  
   The recursion ensures that if a nested object or array contains the specified keys, those are removed as well.

### Conclusion

This version of the `removeKeys` function ensures that the original object remains intact while performing the removal of specified keys on a new deep copy. This approach is useful when you want to maintain immutability or preserve the original data structure.

The implementation effectively demonstrates the core concepts of immutability and deep recursion. However, a few optimization and edge-case improvements are worth pointing out for production JavaScript:

### Key Edge Cases & Modern Alternatives

1. **Modern Built-in Deep Copy (`structuredClone`)**
In modern JavaScript environments (Node.js 17+, modern browsers), custom recursive deep clone functions can be replaced with the native `structuredClone` API. It handles dates, regular expressions, and circular references automatically.
2. **Array Index/Key Edge Case**
In JavaScript, `keys.includes(key)` treats array indices as strings (e.g., `"0"`, `"1"`). If `keys` contains numbers or string representations of indices, keys inside arrays might be deleted unexpectedly when iterating over array keys.
3. **Combined Single-Pass Approach**
Rather than cloning the full tree first and then making a second pass to delete keys, you can prune the keys **during** the clone operation in a single traversal.

---

### Optimized Single-Pass Implementation

Here is a cleaner implementation that filters keys while copying, avoiding unnecessary allocations and double traversals:

```javascript
function removeKeys(obj, keysToRemove) {
  const keysSet = new Set(keysToRemove);

  function clean(item) {
    if (item === null || typeof item !== 'object') {
      return item;
    }

    if (Array.isArray(item)) {
      return item.map(clean);
    }

    const copy = {};
    for (const [key, value] of Object.entries(item)) {
      if (!keysSet.has(key)) {
        copy[key] = clean(value);
      }
    }
    return copy;
  }

  return clean(obj);
}

```

### Improvements in the Single-Pass Version

- **Single Traversal:** Performs cloning and key deletion simultaneously, cutting execution steps roughly in half.
- **$\mathcal{O}(1)$ Lookup Time:** Converting `keysToRemove` to a `Set` makes matching checks $O(1)$ instead of $O(n)$ array scans on every key.
- **Array Preservation:** Ensures array elements are recursively cleaned without accidentally deleting numeric array indexes.
