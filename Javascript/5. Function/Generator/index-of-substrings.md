// Find all indexes of a substring in a JavaScript string
Here's the complete and well-commented code for the `indexOfSubstrings` generator function, which efficiently finds all occurrences of a substring within a string:

```javascript
/**
 * Generator function to find all indices of a substring in a string.
 * @param {string} str - The string to search in.
 * @param {string} searchValue - The substring to find.
 * @returns {Generator<number>} - A generator yielding indices of each occurrence of the substring.
 */
const indexOfSubstrings = function* (str, searchValue) {
  let i = 0; // Initialize the search index.
  while (true) {
    // Find the next occurrence of the substring.
    const r = str.indexOf(searchValue, i);

    if (r !== -1) {
      yield r; // Yield the index of the substring occurrence.
      i = r + 1; // Update the search index to continue from the next character.
    } else {
      return; // Exit the generator if no more occurrences are found.
    }
  }
};

// Example usage:
console.log([...indexOfSubstrings('tiktok tok tok tik tok tik', 'tik')]); // [0, 15, 23]
console.log([...indexOfSubstrings('tutut tut tut', 'tut')]); // [0, 2, 6, 10]
console.log([...indexOfSubstrings('hello', 'hi')]); // []
```

---

### **How it Works**

1. **Using `indexOf` with `fromIndex`**:
   - The `indexOf` method is used to find the first occurrence of `searchValue` starting from `i`.
   - If the substring is found, its index is yielded using `yield`.

2. **Updating the Search Index**:
   - After yielding, the search index `i` is updated to `r + 1` to avoid overlapping results.

3. **Terminating the Generator**:
   - If `indexOf` returns `-1` (no occurrence found), the generator exits using `return`.

---

### **Benefits of this Approach**
1. **Efficiency**: The generator doesn't calculate all occurrences upfront; it computes them as needed, which can save memory for large strings.
2. **Flexibility**: The generator allows for lazy evaluation, meaning you can consume results one at a time if needed.
3. **Versatility**: You can use it with spread syntax (`[...]`), `for...of`, or manually call `next()`.

---

### **More Usage Examples**

#### Find all indices of `"aa"` in `"aaaaa"`:
```javascript
console.log([...indexOfSubstrings('aaaaa', 'aa')]); // [0, 1, 2, 3]
```

#### Using with `for...of`:
```javascript
for (let index of indexOfSubstrings('tutut tut tut', 'tut')) {
  console.log(index); // Logs: 0, 2, 6, 10
}
```

This implementation is a flexible and powerful way to find all occurrences of a substring in a string!