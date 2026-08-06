The function `collectionSize` is designed to return the size of a collection, handling three different types of collections: arrays, sets, and maps. Let's break down its functionality and see how it works.

### Explanation:

1. **Array**:  
   If the input `collection` is an array (checked using `Array.isArray(collection)`), the function returns its length using the `.length` property.
   
2. **Set**:  
   If the input is a `Set` (checked using `collection instanceof Set`), it returns the size of the set using the `.size` property. A `Set` is a collection of unique values, and `.size` returns the number of unique elements in the set.

3. **Map**:  
   If the input is a `Map` (checked using `collection instanceof Map`), it returns the size of the map using the `.size` property. A `Map` stores key-value pairs, and `.size` returns the number of key-value pairs in the map.

4. **Error Handling**:  
   If the input is none of the above (i.e., it's not an array, set, or map), the function throws an error indicating that the collection type is invalid.

### Code:

```javascript
function collectionSize(collection) {
  if (Array.isArray(collection)) {
    return collection.length;
  } else if (collection instanceof Set) {
    return collection.size;
  } else if (collection instanceof Map) {
    return collection.size;
  } else {
    throw new Error("Invalid collection type");
  }
}
```

### Example Usage:

1. **Array Example**:
   ```javascript
   const arr = [1, 2, 3, 4];
   console.log(collectionSize(arr)); // Output: 4
   ```

2. **Set Example**:
   ```javascript
   const mySet = new Set([1, 2, 3, 4]);
   console.log(collectionSize(mySet)); // Output: 4
   ```

3. **Map Example**:
   ```javascript
   const myMap = new Map([
     ['a', 1],
     ['b', 2],
     ['c', 3]
   ]);
   console.log(collectionSize(myMap)); // Output: 3
   ```

4. **Invalid Collection Type Example**:
   ```javascript
   const obj = { a: 1, b: 2 };
   try {
     console.log(collectionSize(obj)); // This will throw an error
   } catch (e) {
     console.log(e.message); // Output: "Invalid collection type"
   }
   ```

### Edge Cases:

- **Empty collections**:
  - If the collection is an empty array, set, or map, the function will return `0` because these collections have no elements.
  
  Example:
  ```javascript
  console.log(collectionSize([])); // Output: 0 (Empty array)
  console.log(collectionSize(new Set())); // Output: 0 (Empty set)
  console.log(collectionSize(new Map())); // Output: 0 (Empty map)
  ```

- **Non-array, non-set, non-map types**:
  - If a non-collection type is passed (like an object or a string), the function will throw an error.
  
  Example:
  ```javascript
  console.log(collectionSize("Hello")); // Throws "Invalid collection type"
  ```

### Conclusion:

This function provides a flexible way to determine the size of common JavaScript collections (arrays, sets, and maps). It handles different collection types and throws an error for unsupported types, ensuring that it only works with valid collections.