The code you provided contains two functions that transform data between different structures. Here's an explanation of how both `listify` and `delistify` work, along with a couple of improvements and clarifications:

### 1. **Converting an Object to an Array of Objects (`listify`)**

The `listify` function takes an object and a mapping function (`mapFn`) as arguments. It uses `Object.entries(obj)` to convert the object into an array of key-value pairs and then applies the provided `mapFn` to each key-value pair.

#### Code:
```javascript
const listify = (obj, mapFn) =>
  Object.entries(obj).map(([key, value]) => mapFn(key, value));
  
const people = [
  { name: 'John', age: 42 },
  { name: 'Adam', age: 39 },
];

const result = listify(people, (key, value) => ({ name: key, ...value }));
console.log(result);
// [ { name: 'John', age: 42 }, { name: 'Adam', age: 39 } ]
```

### Explanation:
- **`Object.entries(obj)`**: Converts an object into an array of `[key, value]` pairs.
- **`mapFn(key, value)`**: Applies the function to each key-value pair, in this case, constructing a new object with the `name` property and spreading the rest of the properties from the value (which is an object).

#### **Output**:
```javascript
[
  { name: 'John', age: 42 },
  { name: 'Adam', age: 39 }
]
```

### 2. **Converting an Array of Objects to an Object (`delistify`)**

The `delistify` function takes an array of objects and a mapping function (`mapFn`). It uses `Object.fromEntries()` to convert the array into an object where each element is transformed by `mapFn` into a `[key, value]` pair.

#### Code:
```javascript
const delistify = (arr, mapFn) =>
  Object.fromEntries(arr.map(mapFn));

const people = [
  { name: 'John', age: 42 },
  { name: 'Adam', age: 39 },
];

const result = delistify(people, (obj) => {
  const { name, ...rest } = obj;
  return [name, rest];
});
console.log(result);
// { John: { age: 42 }, Adam: { age: 39 } }
```

### Explanation:
- **`arr.map(mapFn)`**: Applies `mapFn` to each item in the array. Each item is transformed into a `[key, value]` pair, where the `name` of the person becomes the key, and the rest of the object is the value.
- **`Object.fromEntries()`**: Converts an array of `[key, value]` pairs back into an object.

#### **Output**:
```javascript
{
  John: { age: 42 },
  Adam: { age: 39 }
}
```

### Key Notes:
- **`listify`**: Turns an object into an array of objects, where each object in the array contains the original `key` and `value` mapped by the provided function.
- **`delistify`**: Converts an array of objects back into an object, where each object in the array provides a `[key, value]` pair, created by the `mapFn` function.

### Example: Using `listify` and `delistify` Together
```javascript
const originalObject = {
  John: { age: 42 },
  Adam: { age: 39 }
};

// Convert object to array of objects using listify
const listified = listify(originalObject, (key, value) => ({ name: key, ...value }));
console.log(listified);
// [ { name: 'John', age: 42 }, { name: 'Adam', age: 39 } ]

// Convert it back to an object using delistify
const delistified = delistify(listified, (obj) => {
  const { name, ...rest } = obj;
  return [name, rest];
});
console.log(delistified);
// { John: { age: 42 }, Adam: { age: 39 } }
```

In this way, you can round-trip data between an object and an array of objects using these two functions.