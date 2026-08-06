### **Understanding the `every()` Method and Different Techniques**

The `every()` method in JavaScript checks whether all elements in an array pass a test defined by a predicate function. It stops checking as soon as it finds an element that doesn't satisfy the predicate and returns `false`. If all elements pass, it returns `true`. Here's a deeper look at the different ways `every()` and related methods can be used:

---

### **1. Custom Implementation of `every()`**

You can create your own version of `every()` using a loop to simulate its behavior. Below is a custom implementation of the `every()` method:

```javascript
Array.prototype.customEvery = function (callback, thisArg) {
  for (let i = 0; i < this.length; i++) {
    if (!callback.call(thisArg, this[i], i, this)) {
      return false;
    }
  }
  return true;
};

// Example usage:
const numbers = [1, 2, 3, 4, 5];

// Check if all elements are greater than 0
const allGreaterThanZero = numbers.customEvery(function (element) {
  return element > 0;
});

console.log(allGreaterThanZero); // Output: true
```

---

### **2. Early Exit with `every()`**

The `every()` method stops iterating when the condition is not fulfilled. In the example below, `isOdd` is set to `false` as soon as an even number is found in the array:

```javascript
const array = [11, 12, 13, 14, 51];
let isOdd = true;

array.every(function (el) {
  if (el % 2 === 0) {
    isOdd = false;
    return false; // Short-circuits the loop
  }
  return true;
});

console.log("Output: ", isOdd); // false
```

---

### **3. Validate Object Properties with `every()`**

You can use `every()` to check if each object in an array contains a specific property, such as `firstName`.

```javascript
const users1 = [
  { firstName: "John", lastName: "Doe" },
  { firstName: "Jane", lastName: "Doe" },
];
validateObject(users1); // Output: true

const users2 = [{ firstName: "John", lastName: "Doe" }, { lastName: "Doe" }];
validateObject(users2); // Output: false

export const validateObject = (users) => {
  return users.every((user) => user?.firstName);
};
```

---

### **4. Using `every()` to Check All Array Elements Meet a Condition**

You can pass a predicate function to `every()` to check if all elements in the array meet a condition.

```javascript
const all = (arr, fn = Boolean) => arr.every(fn);

console.log(all([4, 2, 3], x => x > 1)); // true
console.log(all([1, 2, 3])); // true
```

---

### **5. Checking Object Properties with `every()`**

You can use `every()` to check if all objects in a collection have a specific property value. For example, checking if all objects in an array have a `sex` property:

```javascript
const truthCheckCollection = (collection, pre) =>
  collection.every(obj => obj[pre]);

console.log(
  truthCheckCollection(
    [
      { user: 'Tinky-Winky', sex: 'male' },
      { user: 'Dipsy', sex: 'male' },
    ],
    'sex'
  )
); // true
```

---

### **6. Accounting for Nested Keys in Objects**

You can use `every()` to check for nested properties by chaining object keys and verifying their existence.

```javascript
const hasKeyDeep = (obj, keys) => {
  return (
    keys.length > 0 &&
    keys.every(key => {
      if (typeof obj !== 'object' || !obj.hasOwnProperty(key)) return false;
      obj = obj[key];
      return true;
    })
  );
};

let obj = {
  a: 1,
  b: { c: 4 },
  'b.d': 5
};

console.log(hasKeyDeep(obj, ['a'])); // true
console.log(hasKeyDeep(obj, ['b'])); // true
console.log(hasKeyDeep(obj, ['b', 'c'])); // true
console.log(hasKeyDeep(obj, ['b.d'])); // true
console.log(hasKeyDeep(obj, ['d'])); // false
console.log(hasKeyDeep(obj, ['c'])); // false
console.log(hasKeyDeep(obj, ['b', 'f'])); // false
```

---

### **7. Check if All Elements in an Array are Equal**

You can use `every()` to check if all elements in an array are equal by comparing each element to the first element:

```javascript
const allEqual = arr => arr.every(val => val === arr[0]);

console.log(allEqual([1, 1, 1])); // true
console.log(allEqual([1, 1, 2])); // false
```

---

### **8. Check if All Elements are Equal Based on a Property**

For arrays of objects, you can use a custom comparison function to check if a property of each object is equal across the array.

```javascript
const allEqualBy = (arr, fn) =>
  arr.every((val, i) => fn(val, i, arr) === fn(arr[0], 0, arr));

console.log(allEqualBy([{ a: 1 }, { a: 1 }, { a: 1 }], obj => obj.a)); // true
console.log(allEqualBy([{ a: 1 }, { a: 1 }, { a: 2 }], obj => obj.a)); // false
```

---

### **Summary of Usage**

Here’s a quick summary of all the various use cases of `every()`:

| **Use Case**                                      | **Code**                                                                                         | **Result** |
|---------------------------------------------------|--------------------------------------------------------------------------------------------------|------------|
| Custom `every()` Implementation                   | `Array.prototype.customEvery = function(callback) {...}`                                         | Same as native `every()` |
| Short-circuiting with `every()`                    | `array.every(callback)` checks and returns false on first failure                                | Stops on failure |
| Object property validation (`firstName` check)    | `users.every(user => user?.firstName)`                                                           | Checks if all objects have `firstName` |
| Check if all elements match a condition           | `arr.every(val => condition)`                                                                    | Check if all elements fulfill a condition |
| Nested object property check                      | `hasKeyDeep(obj, keys)` check for nested properties                                             | Checks deep properties |
| Check if all elements are equal                   | `arr.every(val => val === arr[0])`                                                                | Compares all values for equality |
| Check if objects are equal based on a property    | `allEqualBy(arr, fn)` custom comparison function                                                | Compares based on a property |

---

### **When to Use `every()`**

- **Validation**: When you need to ensure all elements in an array (or all objects in a collection) meet a specific condition.
- **Complex Comparisons**: When comparing complex objects based on properties.
- **Array Operations**: Checking if all elements pass a test before performing further operations.

