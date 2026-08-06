In JavaScript, **shallow copy** and **deep copy** refer to two different ways of copying objects or arrays. Let's break down both concepts with examples to better understand how they differ:

### 1. **Shallow Copy**

A **shallow copy** means that only the first level of the object or array is copied, but nested objects or arrays still reference the original objects (i.e., references to inner objects are shared). Changes to the inner object in the copy will affect the original.

#### Example 1: Shallow Copy with Arrays

```javascript
const originalArray = [1, 2, { a: 10, b: 20 }];
const shallowCopy = [...originalArray]; // Spread operator

// Modify the inner object
shallowCopy[2].a = 100;

console.log(originalArray[2].a); // 100, as the inner object is shared
console.log(shallowCopy[2].a); // 100
```

#### Example 2: Shallow Copy with Objects

```javascript
const originalObject = { x: 1, y: 2, nested: { a: 10, b: 20 } };
const shallowCopy = { ...originalObject }; // Spread operator

// Modify the nested object
shallowCopy.nested.a = 100;

console.log(originalObject.nested.a); // 100, as the inner object is shared
console.log(shallowCopy.nested.a); // 100
```

In both examples, the shallow copy creates a new reference for the outer array or object, but the nested objects (or arrays) are still pointing to the same references as in the original.

### 2. **Deep Copy**

A **deep copy** means that all nested objects or arrays are also copied, so changes to any part of the copied object or array will not affect the original.

#### Example 1: Deep Copy with Arrays (Using JSON Methods)

```javascript
const originalArray = [1, 2, { a: 10, b: 20 }];
const deepCopy = JSON.parse(JSON.stringify(originalArray));

// Modify the inner object
deepCopy[2].a = 100;

console.log(originalArray[2].a); // 10, the original array is unaffected
console.log(deepCopy[2].a); // 100, deep copy has its own reference
```

#### Example 2: Deep Copy with Objects (Using JSON Methods)

```javascript
const originalObject = { x: 1, y: 2, nested: { a: 10, b: 20 } };
const deepCopy = JSON.parse(JSON.stringify(originalObject));

// Modify the nested object
deepCopy.nested.a = 100;

console.log(originalObject.nested.a); // 10, the original object is unaffected
console.log(deepCopy.nested.a); // 100, deep copy has its own reference
```

In these deep copy examples, we used `JSON.parse(JSON.stringify(...))` to create a deep copy. This method works well for simple objects without functions, `undefined`, or circular references, but it has limitations (e.g., it can't copy methods or handle `undefined` values).

#### Example 3: Deep Copy with Recursive Function (for Complex Structures)

For objects that might include methods, functions, or other complex structures, we can write a custom function to create a deep copy.

```javascript
function deepCopy(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj; // If it's not an object, return it as is
  }

  let copy = Array.isArray(obj) ? [] : {}; // Create array or object

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = deepCopy(obj[key]); // Recursively copy nested objects
    }
  }

  return copy;
}

const originalObject = { x: 1, y: 2, nested: { a: 10, b: 20 } };
const deepCopyObject = deepCopy(originalObject);

// Modify the nested object
deepCopyObject.nested.a = 100;

console.log(originalObject.nested.a); // 10, the original object is unaffected
console.log(deepCopyObject.nested.a); // 100, deep copy has its own reference
```

This custom `deepCopy` function handles all types of objects, including arrays, and can be modified to handle more complex data structures, such as dates or maps.

### 3. **Shallow vs Deep Copy Comparison**

Here’s a side-by-side comparison of the behavior of shallow and deep copies with respect to nested data structures:

```javascript
const original = { a: 1, b: [1, 2, 3], c: { x: 10, y: 20 } };

// Shallow Copy
const shallow = { ...original };

// Deep Copy (Using JSON)
const deep = JSON.parse(JSON.stringify(original));

// Modifying nested data
shallow.b[0] = 99; // Affects original.b because it's a shallow copy
shallow.c.x = 999; // Affects original.c because it's a shallow copy

deep.b[1] = 999; // Does not affect original.b (deep copy)
deep.c.x = 1000; // Does not affect original.c (deep copy)

console.log(original.b); // [99, 2, 3] (shallow copy modified original)
console.log(original.c); // { x: 999, y: 20 } (shallow copy modified original)
console.log(deep.b); // [1, 999, 3] (deep copy is unaffected)
console.log(deep.c); // { x: 1000, y: 20 } (deep copy is unaffected)
```

### Key Differences:

- **Shallow Copy**: Only the top-level structure is copied. Nested objects or arrays are shared between the original and copied object/array.
- **Deep Copy**: The entire structure, including nested objects/arrays, is fully copied, and changes in the copy do not affect the original.

### Conclusion:

- **Shallow Copy** is fast and efficient but can lead to unintended side effects when working with nested objects or arrays.
- **Deep Copy** is safer for complex structures, especially when you need to modify deeply nested objects independently of the original, but it can be slower, especially for large objects.

Choose shallow or deep copy depending on the use case and the complexity of the objects you're working with.
