Your article is a great explanation of how to truth-check values in JavaScript arrays using various methods such as `every`, `some`, and a few additional checks to ensure all or any of the values satisfy certain conditions. Let's walk through and expand upon these concepts with more examples and clarifications:

### 1. **Check if all values in an array are truthy**
You can use `Array.prototype.every()` combined with the `Boolean` function to check if all values in an array are truthy.

#### Example:
```javascript
const all = (arr, fn = Boolean) => arr.every(fn);

console.log(all([4, 2, 3], x => x > 1)); // true
console.log(all([1, 2, 3])); // true
console.log(all([0, 2, 3])); // false (because 0 is falsy)
```

Here:
- `arr.every(fn)` checks if every element in the array passes the condition defined by the `fn` callback.
- `Boolean` is the default function that checks if each value is truthy. You can replace `Boolean` with any custom condition.

#### Additional Example:
```javascript
console.log(all([1, 2, 3], x => x > 0)); // true
console.log(all([1, -2, 3], x => x > 0)); // false
```

### 2. **Check if any values in an array are truthy**
To check if at least one element in an array is truthy, you can use `Array.prototype.some()` with `Boolean` as the default function.

#### Example:
```javascript
const any = (arr, fn = Boolean) => arr.some(fn);

console.log(any([0, 1, 2, 0], x => x >= 2)); // true
console.log(any([0, 0, 0])); // false (no truthy values)
```

Here:
- `arr.some(fn)` checks if at least one element in the array satisfies the condition.
- `Boolean` is the default callback, which checks if any value is truthy.

#### Additional Example:
```javascript
console.log(any([0, '', null, 'hello'])); // true (because 'hello' is truthy)
console.log(any([false, 0, undefined, null])); // false (no truthy values)
```

### 3. **Check if all values in an array are falsy**
To check if **none** of the values in an array are truthy, you can use `Array.prototype.some()` with `Boolean` negated to check for falsy values.

#### Example:
```javascript
const none = (arr, fn = Boolean) => !arr.some(fn);

console.log(none([0, 1, 3, 0], x => x == 2)); // true (because no element is equal to 2)
console.log(none([0, 0, 0])); // true (all values are falsy)
console.log(none([1, 2, 3])); // false (there are truthy values)
```

Here:
- `arr.some(fn)` checks if any value is truthy, and by negating it (`!`), you ensure it checks if none of the values are truthy.

#### Additional Example:
```javascript
console.log(none([null, undefined, false])); // true (all are falsy)
console.log(none([null, true, false])); // false (because `true` is truthy)
```

### 4. **Check if all objects have a given property**
This is useful for validating objects in an array, ensuring that they all contain a particular property.

#### Example:
```javascript
const truthCheckCollection = (collection, pre) =>
  collection.every(obj => obj[pre]);

console.log(truthCheckCollection(
  [
    { user: 'Tinky-Winky', sex: 'male' },
    { user: 'Dipsy', sex: 'male' },
  ],
  'sex'
)); // true
```

Here:
- `arr.every(fn)` checks if every object in the collection contains the property specified by `pre`.
- The callback function `obj => obj[pre]` checks if the property exists and is truthy (if you want to check the existence of the property, regardless of its truthy or falsy value, you can use `obj.hasOwnProperty(pre)` instead).

#### Additional Example:
```javascript
console.log(truthCheckCollection(
  [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 30 },
  ],
  'age'
)); // true

console.log(truthCheckCollection(
  [
    { name: 'Alice', age: 25 },
    { name: 'Bob' }, // Missing 'age' property
  ],
  'age'
)); // false
```

### Summary:
- **`every()`**: Use it when you want to check if **every element** in an array satisfies a condition (truthy or custom condition).
- **`some()`**: Use it when you want to check if **at least one element** in an array satisfies a condition (truthy or custom condition).
- **`!some()`**: Use it when you want to check if **none of the elements** in an array are truthy.
- **`truthCheckCollection()`**: Use it when you want to check if **all objects in an array** contain a specific property (and optionally whether the property value is truthy).

These techniques can be very powerful for array validation, data cleaning, and checks within arrays of various data types!