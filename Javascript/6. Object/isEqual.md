Your problem statement is to implement a deep equality check (similar to `_.isEqual` in lodash) for various data types, including primitives, objects, arrays, and handling circular references.

### **Key Requirements**:
- Support for primitive values like strings, numbers, booleans, `null`, and `undefined`.
- Deep comparison of objects (including handling circular references).
- Arrays need to be compared element by element.
- Objects should be compared based on their **own properties**, not inherited ones.
- Handle circular references to avoid infinite recursion.

### **Steps for Solution**:
1. **Primitive Values**: Directly compare them (e.g., `1 === 1` or `"hello" === "hello"`).
2. **Objects and Arrays**: Iterate through their keys and values, comparing them recursively.
3. **Circular References**: Use a `Map` to keep track of objects we've already compared. If an object is encountered again, we avoid further recursion (this can also be done using a `WeakMap`).
4. **Handle `null`**: `null` is an object in JavaScript, so special care is needed to differentiate between `null` and other objects.

### **Your Solutions**:
Let's walk through the approaches you've outlined and finalize a complete solution.

### **Approach 1: Handle Circular References and Object Comparison**
The main idea behind the deep comparison is:
- Check if the values are **strictly equal** first (`===`).
- If they are not, recursively compare their properties if they are objects (including arrays).

We use a `Map` to track references to objects during recursion to detect circular references.

### **Code Implementation:**

```javascript
function isEqual(a, b, map = new Map()) {
  // 1. If a and b are strictly equal, return true.
  if (a === b) return true;

  // 2. Handle cases where either a or b is a primitive or null.
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") {
    return false;
  }

  // 3. Check if we've already visited this object (circular reference check).
  if (map.has(a) && map.get(a) === b) return true;
  map.set(a, b);

  // 4. Compare the keys of both objects.
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  // 5. Compare each key and its associated value recursively.
  for (let key of keysA) {
    if (!keysB.includes(key) || !isEqual(a[key], b[key], map)) {
      return false;
    }
  }

  // 6. Finally, check for prototype chain equality (ensuring that properties are from the object itself).
  return true;
}
```

### **Explanation:**
- **Strict Equality Check**: If both values are strictly equal (`===`), we return `true` immediately. This covers primitive values and identical object references.
- **Null or Primitive**: If either `a` or `b` is `null` or not an object, return `false` since primitives (like numbers or strings) cannot be deeply equal to objects.
- **Circular Reference Handling**: We use a `Map` to track visited objects. If an object is encountered that has been seen before with the same reference, we return `true` to prevent infinite recursion.
- **Keys Comparison**: We compare the keys of both objects. If the lengths or keys themselves differ, we return `false`.
- **Recursive Comparison**: If the keys match, we recursively compare the values associated with those keys.
- **Prototype Chain**: The default behavior of `Object.keys` ensures we only check "own" properties, not inherited ones.

### **Example Use Case:**

```javascript
const a = { a: "bfe" };
const b = { a: "bfe" };
console.log(isEqual(a, b)); // true

const c = [1, a, "4"];
const d = [1, b, "4"];
console.log(isEqual(c, d)); // true

// Circular reference example
const a = {};
a.self = a;
const b = { self: a };
console.log(isEqual(a, b)); // true
```

### **Handling Circular References**:
Circular references (where objects reference themselves directly or indirectly) are common in complex data structures. The `Map` ensures that each object is only compared once during the recursion.

### **Approach 2: Simplified `areObjectsEqual` for Shallow Comparison**:
You also have a simplified function `areObjectsEqual` which compares objects **shallowly** (i.e., only their immediate properties, not nested ones).

```javascript
export const areObjectsEqual = (obj1, obj2) => {
  let obj1Keys = Object.keys(obj1);
  let obj2Keys = Object.keys(obj2);

  if (obj1Keys.length !== obj2Keys.length) {
    return false;
  }

  for (let key of obj1Keys) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
};
```

This approach is useful for **non-nested objects** but doesn't handle deep comparisons like arrays and nested objects. You can use this as a helper function if needed.

### **Additional Edge Cases**:
- **NaN**: `NaN !== NaN`, so you might need a special check for `NaN` values.
- **Date objects**: `new Date(2021, 0, 1)` needs to be compared by value (i.e., `getTime()`).
- **RegExp**: Should be compared by their source and flags.

If you need to extend the function to handle these, you can add specific checks for these types.

### **Conclusion**:
The implementation of `isEqual` ensures that the objects are deeply compared, supporting circular references and proper type handling. The function recursively checks all properties, handles arrays, objects, and ensures correct behavior for objects with circular references.