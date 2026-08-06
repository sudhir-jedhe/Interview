```js
Array.prototype.customPop = function () {
    // Get the current length of the array
    const currentLength = this.length;
  
    // Check if the array is empty
    if (currentLength === 0) {
      return undefined; // Return undefined for an empty array
    }
  
    // Get the last element
    const poppedElement = this[currentLength - 1];
  
    // Remove the last element by truncating the array
    this.length = currentLength - 1;
  
    // Return the popped element
    return poppedElement;
  };
  
  // Example usage:
  const numbers = [1, 2, 3];
  const poppedElement = numbers.customPop();
  
  console.log(poppedElement); // Output: 3
  console.log(numbers); // Output: [1, 2]

  
const words = [];
  const el2 = words.pop();
console.log(el2);
console.log(words);

```


## Custom `pop()` Polyfill (Interview Question)

The native `pop()` method:

✅ Removes the last element from an array

✅ Returns the removed element

✅ Mutates the original array

***

### Native `pop()`

```javascript
const arr = [1, 2, 3, 4];

const removed = arr.pop();

console.log(removed);
console.log(arr);
```

### Output

```javascript
4

[1, 2, 3]
```

***

# Custom `pop()` Implementation

```javascript
function customPop(arr) {
  if (arr.length === 0) {
    return undefined;
  }

  const lastElement = arr[arr.length - 1];

  arr.length = arr.length - 1;

  return lastElement;
}
```

### Usage

```javascript
const numbers = [10, 20, 30];

const removed = customPop(numbers);

console.log(removed);
console.log(numbers);
```

### Output

```javascript
30

[10, 20]
```

***

# How It Works

### Step 1

```javascript
const lastElement =
  arr[arr.length - 1];
```

For:

```javascript
[10, 20, 30]
```

Gets:

```javascript
30
```

***

### Step 2

```javascript
arr.length =
  arr.length - 1;
```

Changes:

```javascript
[10,20,30]
```

to:

```javascript
[10,20]
```

***

### Step 3

```javascript
return lastElement;
```

Returns:

```javascript
30
```

***

# Handle Empty Arrays

```javascript
const arr = [];

console.log(customPop(arr));
```

Output:

```javascript
undefined
```

Just like native `pop()`.

***

# More Complete Polyfill

```javascript
function customPop(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError(
      "Expected an array"
    );
  }

  if (arr.length === 0) {
    return undefined;
  }

  const removed =
    arr[arr.length - 1];

  arr.length--;

  return removed;
}
```

***

# React Example

### ❌ Avoid Direct Mutation

```javascript
const arr = [...users];

arr.pop();

setUsers(arr);
```

Works, but there are cleaner immutable approaches.

***

### ✅ React-Friendly Way

```javascript
setUsers(prev =>
  prev.slice(0, -1)
);
```

Example:

```javascript
[
  "Sudhir",
  "John",
  "Mike"
]
```

After update:

```javascript
[
  "Sudhir",
  "John"
]
```

***

# Interview Comparison

| Method         | Returns Removed Item | Mutates Original Array |
| -------------- | -------------------- | ---------------------- |
| `pop()`        | ✅                    | ✅                      |
| `slice(0, -1)` | ❌                    | ❌                      |
| `filter()`     | ❌                    | ❌                      |

***

# Time Complexity

```javascript
arr.pop()
```

### Time

```text
O(1)
```

### Space

```text
O(1)
```

Very efficient because it only adjusts array length.

***

# Interview Favourite Question

### What is the Output?

```javascript
const arr = [1, 2, 3];

console.log(arr.pop());
console.log(arr);
```

Output:

```javascript
3

[1, 2]
```

***

## Senior JavaScript Interview Answer

> `pop()` removes the last element from an array, returns the removed value, and mutates the original array. A custom implementation can retrieve the last element using `arr[arr.length - 1]`, reduce the array length by one, and return the removed element. The operation runs in **O(1)** time and is one of the most efficient array operations in JavaScript.
# `pop()` Behaviour with Empty Arrays

The `pop()` method removes and returns the **last element** of an array.

### Normal Case

```javascript
const arr = [1, 2, 3];

const removed = arr.pop();

console.log(removed); // 3
console.log(arr);     // [1, 2]
```

***

## Empty Array Case

```javascript
const arr = [];

const removed = arr.pop();

console.log(removed);
console.log(arr);
```

### Output

```javascript
undefined
[]
```

### Why?

Since there is no last element to remove:

```javascript
arr.length === 0
```

`pop()` simply returns:

```javascript
undefined
```

and leaves the array unchanged.

***

## Custom Pop Implementation

```javascript
function customPop(arr) {
  if (arr.length === 0) {
    return undefined;
  }

  const removed =
    arr[arr.length - 1];

  arr.length--;

  return removed;
}
```

### Example

```javascript
console.log(
  customPop([])
);
```

Output:

```javascript
undefined
```

***

# `pop()` vs `slice()` for Removing Last Element

Both can be used to remove the last element, but they behave very differently.

***

## Using `pop()`

```javascript
const numbers = [1, 2, 3];

const removed = numbers.pop();

console.log(removed);
console.log(numbers);
```

Output:

```javascript
3
[1, 2]
```

### Characteristics

✅ Returns removed element

✅ Modifies original array

✅ O(1) time complexity

✅ Memory efficient

***

## Using `slice()`

```javascript
const numbers = [1, 2, 3];

const newArray =
  numbers.slice(0, -1);

console.log(newArray);
console.log(numbers);
```

Output:

```javascript
[1, 2]
[1, 2, 3]
```

### Characteristics

✅ Does NOT modify original array

✅ Returns a new array

❌ Does not return removed element

✅ React-friendly

***

# Visual Comparison

### `pop()`

```javascript
let arr = [1, 2, 3];

arr.pop();
```

Before:

```javascript
[1, 2, 3]
```

After:

```javascript
[1, 2]
```

Original array changed.

***

### `slice()`

```javascript
let arr = [1, 2, 3];

const newArr =
  arr.slice(0, -1);
```

Original:

```javascript
[1, 2, 3]
```

New Array:

```javascript
[1, 2]
```

Original remains untouched.

***

# React Example

### ❌ Avoid Mutating State with `pop()`

```javascript
users.pop();

setUsers(users);
```

Problem:

```text
Mutates existing React state
```

***

### ✅ Use `slice()`

```javascript
setUsers(prev =>
  prev.slice(0, -1)
);
```

Before:

```javascript
["Sudhir", "John", "Mike"]
```

After:

```javascript
["Sudhir", "John"]
```

This follows React's immutable update pattern.

***

# Interview Comparison Table

| Feature                 | `pop()` | `slice(0, -1)` |
| ----------------------- | ------- | -------------- |
| Removes Last Element    | ✅       | ✅              |
| Returns Removed Element | ✅       | ❌              |
| Mutates Original Array  | ✅       | ❌              |
| Returns New Array       | ❌       | ✅              |
| React State Friendly    | ❌       | ✅              |
| Time Complexity         | O(1)    | O(n)           |

***

# Senior React Interview Answer

> `pop()` removes the last element and mutates the original array, returning the removed value. When called on an empty array it simply returns `undefined`. In React, `slice(0, -1)` is usually preferred because it creates a new array without mutating existing state, which aligns with React's immutable update principles.
