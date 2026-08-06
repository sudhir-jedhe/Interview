Yes, you can check if a JavaScript string contains a substring regardless of case by using a **case-insensitive regular expression**. This can be achieved by utilizing the `RegExp` constructor along with the `'i'` flag, which makes the regular expression case-insensitive. This approach is better than the naive approach of converting both strings to lowercase because it uses the regular expression engine, which is optimized for such tasks.

Here's how you can do it:

### Case-insensitive substring matching in JavaScript

You can use the `RegExp` constructor to create a regular expression with the `'i'` flag (which makes the search case-insensitive), and then use the `RegExp.prototype.test()` method to check if the substring is present.

### Example Implementation:

```javascript
const includesCaseInsensitive = (str, searchString) =>
  new RegExp(searchString, "i").test(str);

// Usage examples:
console.log(includesCaseInsensitive("Blue Whale", "blue")); // true
console.log(includesCaseInsensitive("Blue Whale", "WhALE")); // true
console.log(includesCaseInsensitive("Hello World", "hello")); // true
console.log(includesCaseInsensitive("Hello World", "WORLD")); // true
console.log(includesCaseInsensitive("JavaScript", "java")); // true
console.log(includesCaseInsensitive("JavaScript", "python")); // false
```

### Explanation:

- **`new RegExp(searchString, 'i')`**: This creates a regular expression from the `searchString` and adds the `'i'` flag, which makes the match case-insensitive.
- **`test()`**: This method tests whether the string `str` contains the pattern specified by the regular expression. It returns `true` if a match is found and `false` otherwise.

### Why is this better than converting to lowercase?

- **Performance**: While converting both strings to lowercase is a simple approach, using the regular expression is generally faster, especially if the strings are long or the operation needs to be performed repeatedly.
- **Flexibility**: The regular expression approach allows more advanced matching patterns (like wildcards, character sets, etc.) if needed, making it a more flexible solution.

### Edge Cases:

1. **Empty strings**:
   - If `searchString` is an empty string, the method will return `true` because any string contains an empty string.
   - If `str` is empty and `searchString` is not empty, the method will return `false`.

2. **Special Characters**:
   - Be cautious when using special characters in `searchString`, as they will be treated as part of the regular expression syntax. You may want to escape special characters (like `*`, `+`, `?`, etc.) in the `searchString` if it's user input.

   Example:

   ```javascript
   const includesCaseInsensitive = (str, searchString) => {
     // Escape special characters in searchString
     searchString = searchString.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
     return new RegExp(searchString, "i").test(str);
   };
   ```

This solution is concise, efficient, and flexible for most use cases where case-insensitive substring matching is required.
