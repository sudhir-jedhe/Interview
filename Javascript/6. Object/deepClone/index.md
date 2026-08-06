To implement a deep clone function that works for JavaScript objects containing JSON-serializable values, we can use recursion. Since you're specifically asking for the deep cloning of objects without dealing with other complex data types like `Date`, `Map`, `Set`, etc., we can focus on handling the basic types (null, boolean, number, string, arrays, and plain objects) and make sure that the cloned object is fully independent of the original object.

Here’s how we can implement `deepClone`:

### Solution

```js
function deepClone(value) {
  // If the value is not an object or is null, return it directly (primitive values).
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // If the value is an array, we clone each element recursively.
  if (Array.isArray(value)) {
    return value.map(deepClone);
  }

  // If it's an object, we create a new object and copy all the properties.
  const clonedObj = {};

  // Iterate over all the object's properties.
  for (const key in value) {
    if (value.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(value[key]);
    }
  }

  return clonedObj;
}

// Test cases
const obj1 = { user: { role: "admin" } };
const clonedObj1 = deepClone(obj1);

clonedObj1.user.role = "guest"; // Change the cloned user's role to 'guest'.
console.log(clonedObj1.user.role); // 'guest'
console.log(obj1.user.role); // Should still be 'admin'.

const obj2 = { foo: [{ bar: "baz" }] };
const clonedObj2 = deepClone(obj2);

obj2.foo[0].bar = "bax"; // Modify the original object.
console.log(obj2.foo[0].bar); // 'bax'
console.log(clonedObj2.foo[0].bar); // Should still be 'baz'.
```

### Explanation:

1. **Base Case for Primitives**: If the `value` is `null` or not an object (i.e., a primitive value like `string`, `number`, `boolean`), it is returned directly. This ensures that the function doesn't attempt to recursively deep clone primitive types.

2. **Array Handling**: If the value is an array, we use `Array.prototype.map()` to iterate over each element of the array and recursively call `deepClone` on each element. This ensures that arrays are deeply cloned, and no references to the original elements remain.

3. **Object Handling**: If the value is an object (excluding arrays, which we handle separately), we create a new object (`clonedObj`) and recursively clone each of its properties using a `for...in` loop. This ensures that nested objects are cloned deeply.

4. **Edge Case for `null`**: If the value is `null`, it's directly returned. This prevents errors from trying to access properties on `null`.

### Test Cases:

1. **Nested Object Cloning**:
   - We have `obj1` with a nested `user` object. After cloning, we modify the `role` property of the `user` object in the cloned object. The original object remains unaffected.
   
2. **Array Cloning**:
   - `obj2` contains an array with a nested object. We modify the array's nested object's property in the original, and the cloned object should not be affected.

### Output:

```js
'guest'   // Output for clonedObj1.user.role
'admin'   // Output for obj1.user.role
'bax'     // Output for obj2.foo[0].bar
'baz'     // Output for clonedObj2.foo[0].bar
```

### Notes:

- This deep cloning function will not handle non-serializable objects like `Date`, `RegExp`, `Map`, `Set`, or functions. If you need to handle those cases, you'd have to modify the function further, e.g., by checking the type of object and manually cloning `Date` or `RegExp`.
- The function works correctly for arrays and nested objects, as demonstrated in the test cases. It prevents shared references between the original and cloned objects, ensuring they are fully independent.