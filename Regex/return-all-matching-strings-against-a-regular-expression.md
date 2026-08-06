Let's break down your code and understand the functionality step by step.

### Part 1: Using `search()` method on a string

In the first part of your code, you are using the `String.prototype.search()` method to find the position of a regular expression match within a string.

The `search()` method returns the index of the **first match** of the regular expression, or `-1` if no match is found.

#### Example:

```javascript
// Taking input a string
const str = "GeeksforGeeks is for computer science geeks";

// Taking a regular expression
const regexp1 = /cie/;
const regexp2 = /c/;
const regexp3 = /z/;

// Expected Output: 31
console.log(str.search(regexp1)); // Returns -1 since 'cie' is not found

// Expected Output: 21
console.log(str.search(regexp2)); // Finds 'c' at index 21

// Expected Output: -1
console.log(str.search(regexp3)); // 'z' is not found, so returns -1
```

### Explanation:

1. **`/cie/`**: This regular expression looks for the substring `'cie'` in the string. Since `'cie'` does not exist in `"GeeksforGeeks is for computer science geeks"`, `search()` returns `-1`.
2. **`/c/`**: This regular expression searches for the first occurrence of the character `'c'`. The first `'c'` appears at index 21 in the string, so `search()` returns `21`.

3. **`/z/`**: This regular expression searches for the character `'z'`. Since `'z'` is not present in the string, `search()` returns `-1`.

### Part 2: Using `search()` with an array of strings

In the second part, you are iterating over an array of strings and checking whether each string matches a regular expression. If the regular expression finds a match, you push the string into the `arr` array.

```javascript
// Taking an array of str
const str = [
  "GeeksforGeeks is computer science portal",
  "I am a Geek",
  "I am coder",
  "I am a student",
  "I am a computer science Geek",
];

// Taking a regular expression
const regexp = /Gee/;
let arr = [];

for (let i = 0; i < str.length; i++) {
  if (str[i].search(regexp) != -1) {
    // Check if 'Gee' is found in each string
    arr.push(str[i]); // Add matching strings to the array
  }
}

console.log(arr); // Output: ["GeeksforGeeks is computer science portal", "I am a Geek", "I am a computer science Geek"]
```

### Explanation:

1. The regular expression `/Gee/` searches for the substring `'Gee'` in each of the strings.
2. **First String**: `"GeeksforGeeks is computer science portal"` contains `'Gee'`, so it's added to the `arr`.
3. **Second String**: `"I am a Geek"` contains `'Gee'`, so it's added to the `arr`.

4. **Third String**: `"I am coder"` does **not** contain `'Gee'`, so it's not added.

5. **Fourth String**: `"I am a student"` does **not** contain `'Gee'`, so it's not added.

6. **Fifth String**: `"I am a computer science Geek"` contains `'Gee'`, so it's added to the `arr`.

### Output:

```javascript
[
  "GeeksforGeeks is computer science portal",
  "I am a Geek",
  "I am a computer science Geek",
];
```

### Conclusion:

- The `search()` method is useful for finding the position of the first match of a pattern in a string.
- In the second part, you successfully used `search()` inside a loop to check for matches in multiple strings, and then filtered those strings that contained the required pattern (`Gee`).
