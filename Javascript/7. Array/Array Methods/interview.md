Here are answers to your questions:

### 1. What is the difference between `slice()` and `splice()` in JavaScript?

- **`slice()`**:
  - Does not modify the original array.
  - Creates a shallow copy of a portion of an array, selected from a start index to an end index.
  - Syntax: `array.slice(startIndex, endIndex)`
  - Returns a new array with the extracted portion.

- **`splice()`**:
  - Modifies the original array.
  - Used to add, remove, or replace elements from an array.
  - Syntax: `array.splice(startIndex, deleteCount, item1, item2, ...)`
  - Returns an array of removed elements (if any).
