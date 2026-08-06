```js
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
```

To replace underscores with spaces and capitalize the first letter of each word in a string using JavaScript, you can use the following approach. We'll utilize `String.replace()` to replace the underscores and `String.split()` to split the string into words, then capitalize the first letter of each word.

### Approach:

1. **Replace Underscores**: Use `replace()` to replace all underscores (`_`) with spaces.
2. **Capitalize Each Word**: Split the string into words, capitalize the first letter of each word, and then join the words back together.

### JavaScript Code:

```javascript
function capitalizeWords(str) {
  // Replace underscores with spaces, and capitalize the first letter of each word
  return str
    .replace(/_/g, " ") // Replace all underscores with spaces
    .split(" ") // Split the string by spaces into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(" "); // Join the array of words back into a single string
}

// Example usage:
const input = "hello_world_this_is_javascript";
const result = capitalizeWords(input);
console.log(result); // Output: "Hello World This Is Javascript"
```

### Explanation:

1. **`replace(/_/g, ' ')`**: This replaces all underscores (`_`) in the string with spaces (`' '`).
2. **`split(' ')`**: This splits the string into an array of words based on spaces.
3. **`map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())`**: This capitalizes the first letter of each word. The `charAt(0)` accesses the first character, `toUpperCase()` converts it to uppercase, and `slice(1)` takes the rest of the word, making it lowercase.
4. **`join(' ')`**: This joins the array of words back into a single string with spaces between them.

### Example:

```javascript
const input = "this_is_a_test_string";
const result = capitalizeWords(input);
console.log(result); // Output: "This Is A Test String"
```

This approach ensures that underscores are replaced with spaces and each word starts with a capital letter, making the string more readable and properly formatted.
