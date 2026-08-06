To check for a given key or value, including in nested objects, we need to create a more recursive approach. In the case of **nested keys**, we would need to traverse the object and check if the key exists at any level within the nested structure.

Here are the updated functions that account for nested keys or values:

### 1. **Check if an Object has a Given Value (Including Nested Objects)**

To check for a value in an object, including its nested objects, we can recursively check if the value is in the current object or any of its sub-objects.

```js
// Recursive function to check if a value exists in an object, including nested ones
const hasValueDeep = (obj, value) => {
  return Object.values(obj).some(val => 
    val === value || (typeof val === 'object' && val !== null && hasValueDeep(val, value))
  );
};

const obj = { 
  a: 100, 
  b: 200, 
  c: { d: 300, e: { f: 400 } }
};

console.log(hasValueDeep(obj, 100));  // true
console.log(hasValueDeep(obj, 400));  // true (nested value)
console.log(hasValueDeep(obj, 999));  // false
```

### Explanation

- **`Object.values(obj)`**: This retrieves all values of the object.
- **`.some()`**: This method checks if any of the values is the target value.
- **Recursive Check**: If the value is an object, we call `hasValueDeep` recursively to check if the value exists within that object.

### 2. **Check if an Object has a Given Key (Including Nested Keys)**

Similarly, to check if a key exists at any level in a nested object, we can recursively search through the object’s keys.

```js
// Recursive function to check if a key exists in an object, including nested ones
const hasKeyDeep = (obj, key) => {
  return Object.keys(obj).some(k => 
    k === key || (typeof obj[k] === 'object' && obj[k] !== null && hasKeyDeep(obj[k], key))
  );
};

const obj = { 
  a: 100, 
  b: 200, 
  c: { d: 300, e: { f: 400 } }
};

console.log(hasKeyDeep(obj, 'a'));  // true
console.log(hasKeyDeep(obj, 'e'));  // true (nested key)
console.log(hasKeyDeep(obj, 'z'));  // false
```

### Explanation

- **`Object.keys(obj)`**: This retrieves all keys of the object.
- **`.some()`**: This checks if any of the keys match the target key.
- **Recursive Check**: If a key points to an object, we recursively call `hasKeyDeep` to search within that object.

### Example Usage

Let's put everything together and test both `hasValueDeep` and `hasKeyDeep` with a complex object:

```js
const obj = { 
  a: 100, 
  b: { x: 50, y: 60 }, 
  c: { 
    d: 200, 
    e: { 
      f: 300, 
      g: 400 
    }
  }
};

console.log(hasValueDeep(obj, 100)); // true (top level)
console.log(hasValueDeep(obj, 400)); // true (nested value)
console.log(hasValueDeep(obj, 999)); // false (value doesn't exist)

console.log(hasKeyDeep(obj, 'a'));   // true (top level)
console.log(hasKeyDeep(obj, 'g'));   // true (nested key)
console.log(hasKeyDeep(obj, 'z'));   // false (key doesn't exist)
```

### Summary

- **`hasValueDeep`**: Recursively checks if a value exists anywhere in the object, including within nested objects.
- **`hasKeyDeep`**: Recursively checks if a key exists anywhere in the object, including within nested objects.

Both of these functions will help you navigate deeply nested structures and check for keys or values efficiently.
