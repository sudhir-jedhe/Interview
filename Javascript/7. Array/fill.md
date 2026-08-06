### Explanation of the Code:

Your code includes several examples of filling arrays in JavaScript, including using built-in methods, the spread operator, and custom implementations of `fill()`. Let’s break down each section and understand the logic behind it:

### 1. **Filling an Array Using Spread Operator**

```javascript
var givenValues = [1, 2, 3, 4, 5];
console.log("Given elements:" + givenValues);

var filledArray = [...givenValues];
console.log("Array filled with given values [ " + filledArray + " ]");
```

- **Explanation:**
  - You are declaring an array `givenValues` with initial values `[1, 2, 3, 4, 5]`.
  - Using the **spread operator** (`...`), you create a new array `filledArray` which is a copy of `givenValues`. This effectively "fills" a new array with the same values.
  - The spread operator is typically used for copying or merging arrays.

- **Output:**
  ```
  Given elements:1,2,3,4,5
  Array filled with given values [ 1,2,3,4,5 ]
  ```

---

### 2. **Using `Array.fill()` to Fill an Array**

```javascript
const length = 5;
const value = 5;
const filledArray = new Array(length).fill(value);
console.log(filledArray);
```

- **Explanation:**
  - The `new Array(length)` creates an array with `length` number of empty slots.
  - `.fill(value)` fills the entire array with the specified value (`5` in this case).
  - This is a simple and efficient way to initialize an array where all values are the same.

- **Output:**
  ```
  [5, 5, 5, 5, 5]
  ```

---

### 3. **Creating an Array Filled with Zeros**

```javascript
let filledArray = Array(10).fill(0);
console.log(`Array filled with zero's values is [${filledArray}]`);
```

- **Explanation:**
  - This creates an array with 10 elements, all filled with the value `0`.
  - The array is initialized with a length of `10`, and the `.fill(0)` method fills all elements with `0`.

- **Output:**
  ```
  Array filled with zero's values is [0,0,0,0,0,0,0,0,0,0]
  ```

---

### 4. **Creating a 2D Array Filled with Zeros**

```javascript
const arr2D = new Array(3).fill().map(() => new Array(3).fill(0));
console.log(`2D array filled with zero's is`);
console.log(arr2D);
```

- **Explanation:**
  - You first create an array of size `3` using `new Array(3)`.
  - `.fill()` is used to fill this array with `undefined` (the default for uninitialized array slots).
  - `.map(() => new Array(3).fill(0))` is then used to fill each sub-array (each row) with `3` zeros.
  - This creates a 2D array (array of arrays), where each element is initialized with `0`.

- **Output:**
  ```
  2D array filled with zero's is
  [ [0, 0, 0], [0, 0, 0], [0, 0, 0] ]
  ```

---

### 5. **Custom Implementation of `fill()` Method**

Here, you have created several variations of a custom `fill()` method for arrays.

#### First Implementation:
```javascript
function customFill(value, start, end) {
  "use strict";
  if (!start && !end) {
    for (let i = 0; i < this.length; i++) {
      this[i] = value;
    }
  } else if (start && !end) {
    for (let i = start; i < this.length; i++) {
      this[i] = value;
    }
  } else if (start < 0 && end < 0) {
    for (let i = start + this.length; i < end + this.length; i++) {
      this[i] = value;
    }
  } else {
    for (let i = start; i < end; i++) {
      this[i] = value;
    }
  }
  return this;
}

Array.prototype.customFill = customFill;
```

- **Explanation:**
  - The function `customFill` is trying to replicate the behavior of `Array.prototype.fill()`.
  - It uses `start` and `end` to specify the range in which values should be filled.
  - The method fills the array with `value` starting from `start` and ending at `end`.

#### Second Implementation:

```javascript
function customFill(value, start, end) {
  "use strict";
  if (start >= this.length || end <= start || (start != undefined && isNaN(start)) || (end != undefined && isNaN(end))) {
    return this;
  }

  if (!start || start < -this.length) {
    start = 0;
  } else if (start < 0) {
    start = start + this.length;
  }

  if (!end || end >= this.length) {
    end = this.length;
  } else if (end < -this.length) {
    end = 0;
  } else if (end < 0) {
    end = end + this.length;
  }

  for (let idx = 0; idx < this.length; idx++) {
    if (idx >= start && idx < end) {
      this[idx] = value;
    }
  }
  return this;
}

Array.prototype.customFill = customFill;
```

- **Explanation:**
  - The second version of `customFill` refines the handling of `start` and `end` to ensure they are within bounds.
  - It checks for edge cases where `start` and `end` are out of bounds and handles negative indices by adjusting them.
  - The array is then filled with the `value` from `start` to `end` (exclusive).

#### Third Implementation:

```javascript
function customFill(value, start, end) {
  "use strict";
  let actualStart = 0;
  let actualEnd = this.length;

  if ((start !== undefined && isNaN(start)) || (end !== undefined && isNaN(end))) {
    return this;
  }

  if (!start) {
    actualStart = 0;
  } else if (start < 0) {
    actualStart = start + this.length;
  } else if (start < this.length * -1) {
    actualStart = 0;
  } else if (start >= this.length) {
    return this;
  } else {
    actualStart = start;
  }

  if (!end) {
    actualEnd = this.length;
  } else if (end < 0) {
    actualEnd = end + this.length;
  } else if (start < this.length * -1) {
    actualEnd = 0;
  } else if (end >= this.length) {
    actualEnd = this.length;
  } else {
    actualEnd = end;
  }

  for (let i = actualStart; i <= actualEnd - 1; i++) {
    this[i] = value;
  }
  return this;
}

Array.prototype.customFill = customFill;
```

- **Explanation:**
  - This final version of `customFill` improves boundary handling further, ensuring that negative indices and `start`/`end` conditions are applied correctly.
  - It calculates the `actualStart` and `actualEnd` based on the given inputs and fills the array accordingly.

### Conclusion:
- The provided code demonstrates multiple ways of filling arrays in JavaScript, using both built-in methods and custom implementations.
- The custom `fill()` functions replicate or extend the functionality of the native `fill()` method, with added complexity to handle `start` and `end` indices efficiently.

