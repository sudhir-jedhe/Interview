You're right! `Array.prototype.forEach()` is a great method for iterating over arrays, but it doesn't directly apply to objects. However, using `Object.keys()`, we can extract the keys from an object and use `forEach()` to iterate over them. This approach gives us a simple and elegant way to iterate over object properties. Let's break down the examples you provided.

### **1. Iterate over object properties using `forOwn`**

The `forOwn` function allows us to iterate over an object’s properties. It takes two arguments:
- `obj`: the object whose properties you want to iterate over.
- `fn`: the callback function that will be called for each key-value pair.

The callback function receives three arguments:
- The **value** of the property.
- The **key** of the property.
- The **object** itself (though it's not always used in simple cases).

#### Code:
```javascript
const forOwn = (obj, fn) =>
  Object.keys(obj).forEach(key => fn(obj[key], key, obj));

forOwn({ foo: 'bar', a: 1 }, (value, key, object) => {
  console.log(value);  // Logs the value of each property
});
```

#### Example Usage:
```javascript
// Input object
const myObj = { foo: 'bar', a: 1 };

// Iterate over object properties
forOwn(myObj, (value, key, object) => {
  console.log(`Key: ${key}, Value: ${value}`);
});

// Output:
// Key: foo, Value: bar
// Key: a, Value: 1
```

In the above code:
- We use `Object.keys(obj)` to get an array of the object's keys (`['foo', 'a']`).
- Then, we call `forEach()` to loop through each key and pass its corresponding value to the callback function.

### **2. Iterate over object properties in reverse using `forOwnRight`**

To iterate over the properties in reverse order, we can first reverse the keys array before calling `forEach()` on it. This approach gives you control over the order in which properties are processed.

#### Code:
```javascript
const forOwnRight = (obj, fn) =>
  Object.keys(obj)
    .reverse()  // Reverse the order of keys
    .forEach(key => fn(obj[key], key, obj));

forOwnRight({ foo: 'bar', a: 1 }, (value, key, object) => {
  console.log(value);  // Logs the value of each property
});
```

#### Example Usage:
```javascript
// Input object
const myObj = { foo: 'bar', a: 1 };

// Iterate over object properties in reverse order
forOwnRight(myObj, (value, key, object) => {
  console.log(`Key: ${key}, Value: ${value}`);
});

// Output:
// Key: a, Value: 1
// Key: foo, Value: bar
```

In the `forOwnRight` function:
- We first get the keys using `Object.keys(obj)` and then reverse them using `.reverse()`.
- After that, we call `forEach()` to process each key-value pair in reverse order.

### **Key Points to Note:**

1. **Using `Object.keys()`**: This method returns an array of the object's own enumerable property names. It does not include properties in the prototype chain.
   
2. **The callback function**: It receives three arguments:
   - `value`: The value of the current property in the iteration.
   - `key`: The key (or property name) of the current property.
   - `object`: The object itself (optional, but can be useful for some operations).

3. **Reverse iteration**: By calling `.reverse()` on the array of keys, we can iterate in reverse order. This is useful when you need to process the properties from last to first.

### **Advantages**:
- **Simplicity**: Using `Object.keys()` and `forEach()` is a clean and concise way to iterate over object properties.
- **Flexibility**: You can easily modify this pattern to reverse the iteration or add extra logic to handle special cases (e.g., sorting keys before iteration).

### **Alternative Iteration Methods**:
If you don't need to reverse the order and want a more built-in solution, you can also use `for...in` loops, which iterate over all enumerable properties (including those in the prototype chain, unless you use `hasOwnProperty` to filter it out).

But using `Object.keys()` is generally more predictable and better for ensuring that you're only iterating over the object's own properties.

### **Conclusion**:
Both `forOwn` and `forOwnRight` are handy utilities for iterating over the properties of an object in JavaScript. By leveraging `Object.keys()` and `Array.prototype.forEach()`, we can easily process the keys and values of an object in various orders, depending on the needs of the program.