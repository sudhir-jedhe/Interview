```js
const isFunction = (func: any) => typeof func === "function";
```
```js
const isObject = (supposedObject: any) =>
  typeof supposedObject === "object" &&
  supposedObject !== null &&
  !Array.isArray(supposedObject);
```
```js
const isThenable = (obj: any) => isObject(obj) && isFunction(obj.then);

```
```js
const identity = (val: any) => val;

```
```js
export { isObject, isThenable, identity, isFunction };

```
```js

export function isBoolean(value) {
  return value === true || value === false;
}


```
```js

export function isNumber(value) {
  return typeof value === "number";
}


```
```js
export function isNull(value) {
  return value === null;
}

```
```js
export function isString(value) {
  return typeof value === "string";
}


```
```js

export function isSymbol(value) {
  return typeof value === "symbol";
}


```
```js
export function isUndefined(value) {
  return value === undefined;
}


```
```js

export function isArray(value) {
  return Array.isArray(value);
}


```
```js
// Alternative to isArray.
export function isArrayAlt(value) {
  // For null and undefined.
  if (value == null) {
    return false;
  }

  return value.constructor === Array;
}


```
```js
export function isFunction(value) {
  return typeof value === "function";
}


```
```js
export function isObject(value) {
  // For null and undefined.
  if (value == null) {
    return false;
  }

  const type = typeof value;
  return type === "object" || type === "function";
}


```
```js

export function isPlainObject(value) {
  // For null and undefined.
  if (value == null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}



```
```js
// Alternative to isPlainObject, Lodash's implementation.
export function isPlainObjectAlternative(value) {
  if (!isObject(value)) {
    return false;
  }

  // For objects created via Object.create(null);
  if (Object.getPrototypeOf(value) === null) {
    return true;
  }

  let proto = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(value) === proto;
}

```

Your Type Utilities are a great collection of functions that provide robust type checks and help handle edge cases in JavaScript. Below is a breakdown of your functions along with some observations and improvements:

### **Type-Checking Utilities**

1. **`isFunction`**:

   - Checks if a value is a function using the `typeof` operator.
   - **Example**:
     ```javascript
     console.log(isFunction(() => {})); // true
     console.log(isFunction(42)); // false
     ```

2. **`isObject`**:

   - Checks if a value is a non-null object and not an array. This is important because `typeof null` returns `"object"`, which is a JavaScript quirk.
   - **Example**:
     ```javascript
     console.log(isObject({})); // true
     console.log(isObject([])); // false
     console.log(isObject(null)); // false
     console.log(isObject(() => {})); // false
     ```

3. **`isThenable`**:

   - Checks if an object has a `then` method (often used to identify promise-like objects).
   - This is a very useful check for working with Promises or other asynchronous code.
   - **Example**:
     ```javascript
     console.log(isThenable({ then: () => {} })); // true
     console.log(isThenable([])); // false
     ```

4. **`identity`**:
   - This is an identity function that returns the same value passed to it. It's a common function in functional programming or for use in higher-order functions like `map`.
   - **Example**:
     ```javascript
     console.log(identity(42)); // 42
     console.log(identity("hello")); // "hello"
     ```

---

### **Primitive Type-Checking Utilities**

5. **`isBoolean`**:

   - Checks if the value is strictly `true` or `false`.
   - **Example**:
     ```javascript
     console.log(isBoolean(true)); // true
     console.log(isBoolean(false)); // true
     console.log(isBoolean(0)); // false
     ```

6. **`isNumber`**:

   - Checks if the value is of type `number`. It doesn’t differentiate between valid numbers and `NaN` (which is technically a number).
   - **Example**:
     ```javascript
     console.log(isNumber(42)); // true
     console.log(isNumber("42")); // false
     console.log(isNumber(NaN)); // true
     ```

7. **`isNull`**:

   - Checks if the value is `null`.
   - **Example**:
     ```javascript
     console.log(isNull(null)); // true
     console.log(isNull(undefined)); // false
     ```

8. **`isString`**:

   - Checks if the value is of type `string`.
   - **Example**:
     ```javascript
     console.log(isString("hello")); // true
     console.log(isString(42)); // false
     ```

9. **`isSymbol`**:

   - Checks if the value is a `Symbol`.
   - **Example**:
     ```javascript
     console.log(isSymbol(Symbol())); // true
     console.log(isSymbol("symbol")); // false
     ```

10. **`isUndefined`**:
    - Checks if the value is `undefined`.
    - **Example**:
      ```javascript
      console.log(isUndefined(undefined)); // true
      console.log(isUndefined(null)); // false
      ```

---

### **Array and Object-Checking Utilities**

11. **`isArray`**:

    - Checks if the value is an array using the built-in `Array.isArray()` method.
    - **Example**:
      ```javascript
      console.log(isArray([1, 2, 3])); // true
      console.log(isArray("hello")); // false
      ```

12. **`isArrayAlt`**:

    - Alternative implementation of `isArray` that checks the constructor of the value. This approach may have some edge cases where custom array-like objects could pass the check.
    - **Example**:
      ```javascript
      console.log(isArrayAlt([1, 2, 3])); // true
      console.log(isArrayAlt("hello")); // false
      ```

13. **`isFunction`**:

    - This seems to be repeated in the section for array and object checks. If this is intentional, it provides the same functionality as the earlier `isFunction` check, but is duplicated.
    - **Example**:
      ```javascript
      console.log(isFunction(() => {})); // true
      console.log(isFunction(42)); // false
      ```

14. **`isObject`**:

    - This `isObject` is similar to the first one but has extra checks for `null` and `undefined`. This will also treat `function` values as objects since functions are technically objects in JavaScript.
    - **Example**:
      ```javascript
      console.log(isObject({})); // true
      console.log(isObject(null)); // false
      console.log(isObject([])); // false
      console.log(isObject(() => {})); // true
      ```

15. **`isPlainObject`**:

    - Checks if an object is a plain object (i.e., it was created by `{}` or `Object.create(null)`). This is useful when distinguishing plain objects from instances of user-defined classes or built-in objects like `Date`.
    - **Example**:
      ```javascript
      console.log(isPlainObject({})); // true
      console.log(isPlainObject(new Date())); // false
      console.log(isPlainObject(Object.create(null))); // true
      ```

16. **`isPlainObjectAlternative`**:
    - A more complex alternative to `isPlainObject`. It handles objects that were created via `Object.create(null)`. This could be used when you need to be very strict about plain objects.
    - **Example**:
      ```javascript
      console.log(isPlainObjectAlternative({})); // true
      console.log(isPlainObjectAlternative(new Date())); // false
      console.log(isPlainObjectAlternative(Object.create(null))); // true
      ```

---

### **Improvements & Observations**

1. **Duplicated Functions**:

   - The `isFunction` and `isObject` functions are declared twice in the provided code. You can remove the redundant definitions to keep the code clean.

2. **Type Safety**:

   - The utility functions are written with good type-checking practices, but for some of the functions like `isObject`, you could improve type safety by using TypeScript to explicitly define the parameter types.

3. **Performance**:

   - For `isPlainObjectAlternative`, there's a `while` loop that walks up the prototype chain. This might be slow for deep prototype chains. If performance is a concern, you might want to explore alternatives like checking if `value` is an object with a `prototype` equal to `Object.prototype`.

4. **`isArrayAlt`**:
   - `isArrayAlt` is an interesting approach but would not account for `Array` objects that are created across different realms (e.g., in iframes). `Array.isArray()` would be preferred for cross-realm consistency.

---

### **Summary**

These utility functions provide an effective and efficient way to check various types and structures in JavaScript, especially when working with different data types, objects, and arrays. By utilizing them, you can easily manage different types and handle edge cases more gracefully in your code. They are well-suited for use in a broader library or framework for type checking, data validation, or runtime type enforcement.
