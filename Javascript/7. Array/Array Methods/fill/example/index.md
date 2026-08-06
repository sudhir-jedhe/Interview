# **Code Snippet 1: Using `Array.apply()`**

Both code snippets demonstrate different ways of creating an array filled with references to the same `Given_values` array in JavaScript. Here's an explanation of each approach:

---

```javascript
var givenValues = [1, 2, 3, 4, 5];
console.log("Given elements: " + givenValues);

// Create an array of 1 element, filled with givenValues
var filledArray = Array.apply(null, Array(1)).map((_, i) => givenValues);

// Print the filled array
console.log("Array filled with given values [ " + filledArray + " ]");
```

## **Explanation**

1. **`Array.apply(null, Array(1))`**:
   - `Array(1)` creates an array with one empty slot.
   - `Array.apply(null, ...)` turns the empty slot into an actual array of length 1 with `undefined` as its single element.

2. **`.map((_, i) => givenValues)`**:
   - Iterates over the array, replacing each element (`_`) with the `givenValues` array.
   - The result is an array with references to the `givenValues` array.

### **Output**

Given elements: 1,2,3,4,5
Array filled with given values [ 1,2,3,4,5 ]
---

### **Code Snippet 2: Using `Array.from()`**

```javascript
// Declaring array with Given values
var Given_values = [1, 2, 3, 4, 5];
console.log("Given values array " + Given_values);

// Create an array of 1 element, filled with Given_values
var filledArray = Array.from({ length: 1 }, () => Given_values);

// Print the filled array
console.log("Array filled with given values [ " + filledArray + " ]");
```

## **Explanation 1**

1. **`Array.from({ length: 1 }, () => Given_values)`**:
   - Creates an array of length 1.
   - Each element in the array is initialized to the `Given_values` array via the callback function.

### **Output 1**

```
Given values array 1,2,3,4,5
Array filled with given values [ 1,2,3,4,5 ]
```

---

### **Comparison of Both Methods**

| Feature                     | `Array.apply()`                          | `Array.from()`                       |
|-----------------------------|-------------------------------------------|---------------------------------------|
| **Syntax Simplicity**       | Requires extra `.map()` call.            | More concise and readable.           |
| **Modern JS Support**       | Older ES5-compatible technique.          | Requires ES6 or newer.               |
| **Use Case**                | Useful for environments without ES6.     | Preferred in modern JavaScript code. |

---

### **Key Points**

- Both methods fill an array with references to the same `Given_values` array.
- Modifying the `Given_values` array will reflect in all elements of `filledArray`, as they reference the same object.
  
#### Example

```javascript
filledArray[0][0] = 99;
console.log(filledArray); 
// Output: [[99, 2, 3, 4, 5], [99, 2, 3, 4, 5]]
```

For modern JavaScript, **`Array.from()`** is preferred due to its simplicity and readability.
