Your implementation of the `customOmit` function is a great solution for omitting specific keys from an object. It works similarly to the `_.omit` function from Lodash, allowing you to exclude specified keys from an object and return a new object with the remaining properties.

### **How the `customOmit` function works:**

1. **Input Validation:**
   - The function first checks if the `object` parameter is a valid object (i.e., not `null` or a non-object type). If it's invalid, it throws a `TypeError`.

2. **Key Array Preparation:**
   - The function checks if `keys` is an array or not. If it's not an array (i.e., a single key string), it wraps the key in an array so that it can handle both cases uniformly.

3. **Iterating Over the Object's Own Properties:**
   - Using `for...in` to iterate over all the properties of the object, the function checks whether the property is an "own" property (i.e., it’s not inherited from the prototype) using `object.hasOwnProperty(key)`.
   
4. **Key Exclusion:**
   - If the current key is **not** in the `keysArray`, the function adds it to the `result` object. Otherwise, it skips the key and does not include it in the new object.

5. **Return New Object:**
   - After iterating through all keys, the `result` object is returned, containing all properties except the ones specified in `keys`.

### **Example Usage:**

1. **Omitting Multiple Keys:**
   ```javascript
   const data = {
       name: 'Alice',
       age: 30,
       city: 'Wonderland',
       country: 'Fictional',
   };

   const omittedData = customOmit(data, ['age', 'city']);
   console.log(omittedData); 
   // Output: { name: 'Alice', country: 'Fictional' }
   ```

   In this example, the `age` and `city` keys are omitted from the object.

2. **Omitting a Single Key:**
   ```javascript
   const omittedSingle = customOmit(data, 'country');
   console.log(omittedSingle); 
   // Output: { name: 'Alice', age: 30, city: 'Wonderland' }
   ```

   Here, the `country` key is omitted, and the remaining properties are returned.

### **Edge Cases Handled:**

1. **Non-Object Input:**
   If the first argument isn't an object (for example, it's a primitive type or `null`), a `TypeError` is thrown:
   ```javascript
   customOmit(null, ['key']); // Throws TypeError
   ```

2. **Empty Keys Array:**
   If the keys array is empty, the function will return a copy of the original object:
   ```javascript
   const noKeysOmitted = customOmit(data, []);
   console.log(noKeysOmitted); 
   // Output: { name: 'Alice', age: 30, city: 'Wonderland', country: 'Fictional' }
   ```

3. **Non-Existent Keys:**
   If the keys to omit are not present in the object, it simply skips them without affecting the original object:
   ```javascript
   const result = customOmit(data, ['nonExistentKey']);
   console.log(result); 
   // Output: { name: 'Alice', age: 30, city: 'Wonderland', country: 'Fictional' }
   ```

4. **Single Key as String:**
   The function correctly handles a single key string instead of an array of keys:
   ```javascript
   const omittedSingle = customOmit(data, 'age');
   console.log(omittedSingle); 
   // Output: { name: 'Alice', city: 'Wonderland', country: 'Fictional' }
   ```

### **Code Implementation:**

```javascript
function customOmit(object, keys) {
    if (!object || typeof object !== 'object') {
        throw new TypeError('First argument must be an object');
    }

    const result = {};

    // Ensure keys is an array
    const keysArray = Array.isArray(keys) ? keys : [keys];

    for (const key in object) {
        if (object.hasOwnProperty(key) && !keysArray.includes(key)) {
            result[key] = object[key]; // Copy property if not in keys
        }
    }

    return result; // Return the new object without omitted keys
}

// Example usage
const data = {
    name: 'Alice',
    age: 30,
    city: 'Wonderland',
    country: 'Fictional',
};

const omittedData = customOmit(data, ['age', 'city']);
console.log(omittedData); // Output: { name: 'Alice', country: 'Fictional' }

const omittedSingle = customOmit(data, 'country');
console.log(omittedSingle); // Output: { name: 'Alice', age: 30, city: 'Wonderland' }
```

### **Summary:**
The `customOmit` function is an efficient and flexible way to exclude one or more keys from an object. It allows you to omit keys either by passing a single key (as a string) or an array of keys, and handles edge cases like invalid inputs and missing keys gracefully.