To shuffle the first and last elements of an array in JavaScript, you can swap the first and last elements directly. Here's an example:

### Example Code:

```javascript
function shuffleFirstAndLast(arr) {
  if (arr.length <= 1) return arr; // If the array has 1 or fewer elements, no swap is needed

  // Swap the first and last elements
  let temp = arr[0];
  arr[0] = arr[arr.length - 1];
  arr[arr.length - 1] = temp;

  return arr;
}

// Example usage:
const array = [1, 2, 3, 4, 5];
console.log(shuffleFirstAndLast(array)); // Output: [5, 2, 3, 4, 1]
```

### Explanation:

- **Step 1**: We check if the array has one or fewer elements. If that's the case, we return the array as it is because swapping doesn't make sense for a single element or an empty array.
- **Step 2**: We store the first element in a temporary variable (`temp`).
- **Step 3**: We assign the last element to the first position (`arr[0] = arr[arr.length - 1]`).
- **Step 4**: We assign the stored first element to the last position (`arr[arr.length - 1] = temp`).

This simple swap modifies the original array by switching the first and last elements.

### Edge Cases:

- **Empty array**: The function returns the same array (empty array) since there's no element to swap.
- **Single element array**: No swap is performed, and the same array is returned.

Yes, there are alternative ways to swap the first and last elements of an array in JavaScript. Below are a few more approaches:

### 1. Using Destructuring Assignment

You can use JavaScript's destructuring assignment to swap the first and last elements of the array.

```javascript
function shuffleFirstAndLast(arr) {
  if (arr.length <= 1) return arr; // No swap needed for arrays with 0 or 1 element

  // Destructuring assignment to swap first and last elements
  [arr[0], arr[arr.length - 1]] = [arr[arr.length - 1], arr[0]];

  return arr;
}

// Example usage:
const array = [1, 2, 3, 4, 5];
console.log(shuffleFirstAndLast(array)); // Output: [5, 2, 3, 4, 1]
```

### Explanation:

- **Destructuring** allows you to assign the first and last elements of the array to each other in one line, swapping them directly.

---

### 2. Using Array Methods (Pop & Unshift)

You can manipulate the array using `pop()` and `unshift()` to remove the last and first elements, then add them back in reverse order.

```javascript
function shuffleFirstAndLast(arr) {
  if (arr.length <= 1) return arr; // No swap needed for arrays with 0 or 1 element

  // Remove first and last elements using pop() and shift()
  let first = arr.shift();
  let last = arr.pop();

  // Add them back in reversed order
  arr.unshift(last);
  arr.push(first);

  return arr;
}

// Example usage:
const array = [1, 2, 3, 4, 5];
console.log(shuffleFirstAndLast(array)); // Output: [5, 2, 3, 4, 1]
```

### Explanation:

- **`shift()`** removes the first element of the array.
- **`pop()`** removes the last element of the array.
- **`unshift()`** adds the last element back at the beginning of the array.
- **`push()`** adds the first element back to the end of the array.

---

### 3. Using a Temporary Array for Immutability

If you prefer not to mutate the original array, you can create a new array where the first and last elements are swapped.

```javascript
function shuffleFirstAndLast(arr) {
  if (arr.length <= 1) return arr; // No swap needed for arrays with 0 or 1 element

  // Create a new array with swapped first and last elements
  const [first, ...middle] = arr;
  const last = arr[arr.length - 1];
  return [last, ...middle.slice(0, -1), first];
}

// Example usage:
const array = [1, 2, 3, 4, 5];
console.log(shuffleFirstAndLast(array)); // Output: [5, 2, 3, 4, 1]
```

### Explanation:

- **Destructuring** allows you to separate the first element (`first`) and the rest of the array (`middle`).
- We take the last element of the original array, and then use `slice` to combine the last element and the first element into a new array, ensuring immutability.

---

### 4. Using `reverse()` (with Caution)

This method is a bit unconventional and not typically used for swapping first and last elements, but you can reverse the entire array and then reverse it again. However, this approach changes the entire array order and should be used with caution.

```javascript
function shuffleFirstAndLast(arr) {
  if (arr.length <= 1) return arr; // No swap needed for arrays with 0 or 1 element

  return arr.reverse().reverse();
}

// Example usage:
const array = [1, 2, 3, 4, 5];
console.log(shuffleFirstAndLast(array)); // Output: [5, 2, 3, 4, 1]
```

### Explanation:

- **Reversing** the array twice can technically "swap" the first and last elements but reverses the whole array, so it's not ideal for cases where you want to maintain the original order of the elements besides swapping the first and last.

---

### Conclusion

- **Destructuring** and **array methods (`shift()`, `pop()`, `unshift()`, and `push()`)** provide clean, direct, and easy-to-understand solutions for swapping the first and last elements.
- If you want to avoid mutating the original array, **creating a new array** is the best option.
