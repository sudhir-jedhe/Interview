# Explanation of the Code

## **1. Custom `fill` Implementation**

The `Array.prototype.customFill` function replicates the behavior of the built-in `Array.prototype.fill`. It allows filling an array with a specified value, optionally starting and stopping at specified indices.

```javascript
Array.prototype.customFill = function (filledValue, start = 0, end = this.length) {
  for (let i = start; i < end; i++) {
    this[i] = filledValue;
  }
  return this;
};
```

- **Parameters**:
  - `filledValue`: The value to fill the array with.
  - `start`: The index to start filling (default is `0`).
  - `end`: The index to stop filling (default is the array's length).
- **Returns**:
  - The modified array (`this`).

- **Example Usage**:

```javascript
let arr = [1, 2, 3, 4, 5];
arr.customFill(0, 2, 4);
console.log(arr); // [1, 2, 0, 0, 5]
```

## **2. Creating a New Array Filled with Given Values**

This part demonstrates using `Array.prototype.fill` to create an array where each slot contains a reference to the same `Given_values` array.

```javascript
var Given_values = [1, 2, 3, 4, 5];
console.log(`Given values array ${Given_values}`);

var filledArray = Array(2).fill(Given_values);
console.log(`Array filled with given values is [${filledArray}]`);
```

- **Behavior**:
  - `Array(2)`: Creates an array with two empty slots.
  - `.fill(Given_values)`: Fills each slot in the array with a reference to the `Given_values` array.

- **Output**:
  - `Array filled with given values is [[1,2,3,4,5],[1,2,3,4,5]]`.

#### **Key Points**

- The `fill` method doesn't clone the array. Instead, each slot in the new array contains a reference to the same array (`Given_values`).
- Modifying one of the filled arrays will also modify the others:

```javascript
filledArray[0][0] = 99;
console.log(filledArray); 
// [[99, 2, 3, 4, 5], [99, 2, 3, 4, 5]]
```

#### **Using the Custom `fill` Method**

You can invoke `customFill` directly on an array like the built-in `fill`:

```javascript
let arr = [1, 2, 3, 4, 5];
arr.customFill(42);
console.log(arr); // [42, 42, 42, 42, 42]
```
