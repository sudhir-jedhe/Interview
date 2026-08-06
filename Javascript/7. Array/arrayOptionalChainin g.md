Let's break down the two different versions of your `transform` function and understand their behaviors.

### First Version: Using Optional Chaining (`?.`)

```javascript
function transform(arr) {
    console.log(arr?.[99]);  // Optional chaining to prevent error if `arr` is undefined or has no index 99
}

transform([1, 2, 3]);  // Pass an array to the function
transform();            // Call without passing an array
```

### Explanation:

1. **When `transform([1, 2, 3])` is called**:
   - The `arr` parameter receives the array `[1, 2, 3]`.
   - `arr?.[99]` tries to access the value at index `99`. Since the array doesn't have index `99`, the result is `undefined`, which is then logged to the console.
   - **Output**: `undefined`

2. **When `transform()` is called without an argument**:
   - `arr` is `undefined`.
   - Since we're using optional chaining (`arr?.[99]`), JavaScript will not try to access `99` on `undefined`. Instead, it returns `undefined` without throwing an error.
   - **Output**: `undefined`

### Output for the First Version:

```
undefined
undefined
```

---

### Second Version: Without Optional Chaining

```javascript
function transform(arr) {
    console.log(arr[99]);  // index 99
}

transform([1, 2, 3]);  // Pass an array to the function
transform();            // Call without passing an array
```

### Explanation:

1. **When `transform([1, 2, 3])` is called**:
   - The `arr` parameter receives the array `[1, 2, 3]`.
   - `arr[99]` tries to access the value at index `99`. Since the array doesn't have index `99`, the result is `undefined`, which is then logged to the console.
   - **Output**: `undefined`

2. **When `transform()` is called without an argument**:
   - `arr` is `undefined`.
   - JavaScript will throw an error because we're trying to access `arr[99]` on `undefined`, which is not allowed.
   - The error message will be: `TypeError: Cannot read properties of undefined (reading '99')`.
   
### Output for the Second Version:

- **When `transform([1, 2, 3])` is called**:
  ```
  undefined
  ```
- **When `transform()` is called without arguments**, **an error will be thrown**:
  ```
  TypeError: Cannot read properties of undefined (reading '99')
  ```

---

### Key Differences:

1. **Optional Chaining (`?.`)**:
   - With optional chaining, if `arr` is `undefined` or `null`, it will safely return `undefined` instead of throwing an error.
   - This allows you to avoid runtime exceptions when accessing properties or indexes on potentially `null` or `undefined` values.

2. **Without Optional Chaining**:
   - Without optional chaining, if you attempt to access a property or index on an `undefined` or `null` value, it will throw an error, which can stop further execution and disrupt the program flow.

### Conclusion:

- The first version using optional chaining (`?.`) prevents errors when the array is `undefined` and allows you to safely access the index without worrying about runtime exceptions.
- The second version does not handle the case where the array might be `undefined`, leading to a runtime error if the function is called without an array argument.