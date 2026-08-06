Your code provides various examples of how to find the index of an element in an array, with a few custom implementations and different scenarios. Let's break it down:

### 1. **Basic `findIndex` Implementation**

This is a straightforward custom implementation of the `findIndex` method. It iterates through the array, checks each element with the provided callback, and returns the index of the first matching element.

#### Code:

```javascript
function findIndex(array, callback) {
  for (let i = 0; i < array.length; i++) {
    if (callback(array[i])) {
      return i;
    }
  }
  return -1;
}

const array = [1, 2, 3, 4, 5];
const index = findIndex(array, (element) => element > 3);
console.log(index); // 3
```

- This implementation is useful for when you need to find the index of an element based on a condition defined by the callback function.
- **Time Complexity**: O(n), where `n` is the length of the array.

---

### 2. **Finding the Index of the First Trough**

This example demonstrates how to use `findIndex` to find the first "trough" in an array. A "trough" here is defined as an element that is both greater than the one before it and smaller than the one after it.

#### Code:

```javascript
const numbers = [3, -1, 1, 4, 1, 5, 9, 2, 6];
const firstTrough = numbers
  .filter((num) => num > 0) // Remove non-positive numbers first
  .findIndex((num, idx, arr) => {
    if (idx > 0 && num >= arr[idx - 1]) return false;
    if (idx < arr.length - 1 && num >= arr[idx + 1]) return false;
    return true;
  });

console.log(firstTrough); // 1
```

- Here, we filter out non-positive numbers, then use `findIndex` to find the first element that is smaller than both its neighbors. 
- This is a bit complex, as it uses both `filter` and `findIndex`. 
- **Time Complexity**: O(n) due to filtering and then finding the index.

---

### 3. **Using `findIndex` with a Prime Check**

Here, you define a function `isPrime` and use `findIndex` to find the index of the first prime number in an array.

#### Code:

```javascript
function isPrime(element) {
  if (element % 2 === 0 || element < 2) {
    return false;
  }
  for (let factor = 3; factor <= Math.sqrt(element); factor += 2) {
    if (element % factor === 0) {
      return false;
    }
  }
  return true;
}

console.log([4, 6, 8, 9, 12].findIndex(isPrime)); // -1, no primes
console.log([4, 6, 7, 9, 12].findIndex(isPrime)); // 2 (array[2] is 7)
```

- The `isPrime` function checks whether a number is prime. We then use `findIndex` to find the index of the first prime number in an array.
- **Time Complexity**: O(sqrt(n)) for prime check, and O(n) for `findIndex`, so the overall complexity is O(n * sqrt(m)), where `m` is the average number in the array.

---

### 4. **Finding the Index of Numbers Larger Than 13**

Here’s a simple example using `findIndex` to find the index of the first number greater than 13.

#### Code:

```javascript
const array1 = [5, 12, 8, 130, 44];
const isLargeNumber = (element) => element > 13;

console.log(array1.findIndex(isLargeNumber)); // 3
```

- This example demonstrates using `findIndex` to find the first index of a number that satisfies the condition `element > 13`.
- **Time Complexity**: O(n), where `n` is the length of the array.

---

### 5. **Custom `myFindIndex` Implementation**

This is your own custom implementation of the `findIndex` method. It mimics the behavior of `Array.prototype.findIndex` but with additional error handling and checks.

#### Code:

```javascript
Array.prototype.myFindIndex = function (callback, thisArg) {
  if (this == null) {
    throw new TypeError(
      "Array.prototype.myFindIndex called on null or undefined"
    );
  }

  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const arr = Object(this);
  const len = arr.length >>> 0; // Ensures length is a non-negative integer
  let k = 0;

  while (k < len) {
    if (k in arr && callback.call(thisArg, arr[k], k, arr)) {
      return k;
    }
    k++;
  }

  return -1;
};
```

- **Explanation**: This custom method adds validation to ensure that the method is called on a valid array and that the callback is a function. It mimics the built-in `findIndex` method.
- **Time Complexity**: O(n), same as the built-in `findIndex`.

---

### **Summary of Key Points**

1. **Basic `findIndex`**: Finds the first element that satisfies a given condition.
2. **Finding Troughs**: A more complex example using both `filter` and `findIndex`.
3. **Prime Check with `findIndex`**: Find the first prime number in an array.
4. **Simple Conditional Check**: A basic example of finding the index of the first large number.
5. **Custom `myFindIndex`**: A custom implementation of `findIndex`, adding validation checks and mimicking the native method.

These examples showcase how you can leverage `findIndex` for a variety of use cases, and even extend its functionality by creating your own version with additional checks.