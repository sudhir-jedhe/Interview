To implement the utility functions for determining the types of primitive values and non-primitive values, we'll focus on the logic for detecting these types in JavaScript.

### **Primitive Types Functions**

Here are the functions that check for primitive types like `boolean`, `number`, `null`, `string`, `symbol`, and `undefined`.

```javascript
// Checks if the value is a boolean
function isBoolean(value) {
  return typeof value === "boolean";
}

// Checks if the value is a number (including NaN)
function isNumber(value) {
  return typeof value === "number" && isFinite(value);
}

// Checks if the value is null
function isNull(value) {
  return value === null;
}

// Checks if the value is a string
function isString(value) {
  return typeof value === "string";
}

// Checks if the value is a symbol
function isSymbol(value) {
  return typeof value === "symbol";
}

// Checks if the value is undefined
function isUndefined(value) {
  return typeof value === "undefined";
}
```

### **Non-Primitive Types Functions**

Next, let's implement the utility functions for checking non-primitive types like `Array`, `Function`, `Object`, and `Plain Object`.

```javascript
// Checks if the value is an array
function isArray(value) {
  return Array.isArray(value);
}

// Checks if the value is a function
function isFunction(value) {
  return typeof value === "function";
}

// Checks if the value is an object (excluding null)
function isObject(value) {
  return value !== null && typeof value === "object";
}

// Checks if the value is a plain object (POJO)
function isPlainObject(value) {
  return isObject(value) && Object.getPrototypeOf(value) === Object.prototype;
}
```

### **Explanation of Each Function**

1. **isBoolean**: Checks if the value is a `boolean`.
   - `typeof value === 'boolean'`
2. **isNumber**: Checks if the value is a `number`, including `NaN`. We also use `isFinite(value)` to ensure the value is a finite number and not `Infinity` or `NaN`.
   - `typeof value === 'number' && isFinite(value)`
3. **isNull**: Checks if the value is exactly `null`.
   - `value === null`
4. **isString**: Checks if the value is a `string`.
   - `typeof value === 'string'`
5. **isSymbol**: Checks if the value is a `symbol`.
   - `typeof value === 'symbol'`
6. **isUndefined**: Checks if the value is `undefined`.
   - `typeof value === 'undefined'`
7. **isArray**: Uses `Array.isArray(value)` to check if the value is an array.
8. **isFunction**: Checks if the value is a function using `typeof value === 'function'`.
9. **isObject**: Checks if the value is an object but excludes `null` because `typeof null === 'object'`. The condition is: `value !== null && typeof value === 'object'`.
10. **isPlainObject**: A plain object is defined as an object whose prototype is `Object.prototype`. We check this using `Object.getPrototypeOf(value) === Object.prototype`.

### **Example Usage:**

```javascript
// Test Cases
console.log(isBoolean(true)); // true
console.log(isNumber(42)); // true
console.log(isNull(null)); // true
console.log(isString("hello world")); // true
console.log(isSymbol(Symbol("foo"))); // true
console.log(isUndefined(undefined)); // true

console.log(isArray([1, 2, 3])); // true
console.log(isFunction(function () {})); // true
console.log(isObject({ a: 1 })); // true
console.log(isPlainObject({ a: 1 })); // true

console.log(isPlainObject([1, 2, 3])); // false (Array is not a plain object)
console.log(isPlainObject(new Date())); // false (Date is not a plain object)
console.log(isPlainObject(function () {})); // false (Function is not a plain object)
```

### **Bonus - `typeOf()` Utility Function**

You also have a function `typeOf()` that uses `Object.prototype.toString` to return the type of the given value. The `Object.prototype.toString` method returns a string in the form of `[object Type]`, and you can extract the type name from that string.

Here's how you can improve the function:

```javascript
// Function to determine the type using Object.prototype.toString
function typeOf(obj) {
  return Object.prototype.toString
    .call(obj)
    .match(/\[object (.*)\]/)[1]
    .toLowerCase();
}

// Example usage
console.log(typeOf("dsfsdf")); // "string"
console.log(typeOf(123)); // "number"
console.log(typeOf([])); // "array"
console.log(typeOf({})); // "object"
console.log(typeOf(function () {})); // "function"
console.log(typeOf(null)); // "null"
```

- `Object.prototype.toString.call(obj)` returns a string in the format `[object Type]`, where `Type` is the type of the object.
- `match(/\[object (.*)\]/)` extracts the type name.
- `toLowerCase()` ensures the result is in lowercase.

### **Summary**

- You now have utility functions to determine if a value is a specific primitive or non-primitive type.
- Functions like `isArray()`, `isFunction()`, and `isPlainObject()` help check more complex data types.
- The `typeOf()` function uses the `Object.prototype.toString` approach to get a more reliable type for various kinds of objects.
