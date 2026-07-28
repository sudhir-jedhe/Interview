Let's break down your code and understand how it works with regular expressions and string manipulation.

### **Using `\d` to match digits in a string:**

#### Code 1:

```javascript
function geek() {
  let str1 = "GeeksforGeeks@_123_$";
  let regex4 = /\d/g; // Regular expression to match digits globally
  let match4 = str1.match(regex4);

  console.log("Found " + match4.length + " matches: " + match4);
}
geek();
```

### Explanation:

- **`/\d/g`**: The regular expression `/\d/g` is used to match all digit characters (0-9) globally across the string.
  - **`\d`**: Matches any digit (equivalent to `[0-9]`).
  - **`g`**: The **global flag** ensures that the regex finds all matches in the string, not just the first one.

- **`match()`**: This method returns an array of all the matches found in the string based on the regular expression.
  - In the example `"GeeksforGeeks@_123_$"`, the digits present are `1`, `2`, and `3`, so the `match()` method will return an array: `["1", "2", "3"]`.
  - **`match4.length`** will return the number of matches (which is 3 in this case).
  - **`match4`** will return the array of matches, `["1", "2", "3"]`.

#### Output:

```javascript
Found 3 matches: 1,2,3
```

---

#### Code 2:

```javascript
function geek() {
  let str1 = "Geeky@128";
  let regex4 = new RegExp("\\d", "g"); // Creating regex using RegExp constructor
  let match4 = str1.match(regex4);

  console.log("Found " + match4.length + " matches: " + match4);
}
geek();
```

### Explanation:

- **`new RegExp("\\d", "g")`**: This is the **RegExp constructor**, which allows you to create regular expressions dynamically. Here, we are using `\\d` to match a digit (since `\` is an escape character in strings, we need to escape it by using `\\`).
  - This regular expression is similar to `/\d/g` used earlier, which matches all digits globally in the string.
- **`match()`**: As in the first example, this method returns an array of all the digits found in the string `"Geeky@128"`. The digits present are `1`, `2`, and `8`.
  - So, the `match()` method will return `["1", "2", "8"]`.

#### Output:

```javascript
Found 3 matches: 1,2,8
```

---

### **Summary**:

Both examples use the same logic to match digits within a string:

1. **`/\d/g`** and **`new RegExp("\\d", "g")`** both work similarly to match digits in the string.
2. The `match()` method is used to retrieve all matching digits.
3. The first example matches `1`, `2`, and `3`, while the second one matches `1`, `2`, and `8` because the strings being tested are different.
4. The number of matches is logged using `match4.length`.

### Conclusion:

- **`/\d/g`** is a short and direct way to match digits globally in a string.
- Using **`new RegExp()`** is useful when you need to create the regular expression dynamically or when it involves variables.
