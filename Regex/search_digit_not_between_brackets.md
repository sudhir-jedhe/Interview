Let's break down your code and explain how it works with regular expressions, particularly focusing on **negated character classes** (`[^...]`), which are used to match everything except a specified pattern.

### **Code Explanation:**

#### **Code 1: Matching characters that are **not** in a range (using `[^0-4]`)**

```javascript
function geek() {
  let str1 = "123456790";
  let regex4 = /[^0-4]/g; // Regular expression to match any character that is NOT between 0 and 4
  let match4 = str1.match(regex4); // Find all characters that do not match the range [0-4]

  console.log("Found " + match4.length + " matches: " + match4);
}
geek();
```

### Explanation:

- **`/[^0-4]/g`**: The regular expression `[^0-4]` matches any character **not** in the range of `0` to `4`.
  - **`[^0-4]`**: The caret `^` inside the square brackets negates the range. It matches any character that is **not** between `0` and `4` (inclusive).
  - **`g`**: The global flag ensures the regex matches all occurrences, not just the first one.

- **`match()`**: The `match()` method is used to find all characters that match the pattern and return them as an array.
  - The string `"123456790"` contains the characters `5`, `6`, `7`, and `9` that are outside the range `0-4`. These characters are returned as an array: `["5", "6", "7", "9"]`.

#### Output:

```javascript
Found 4 matches: 5,6,7,9
```

---

#### **Code 2: Replacing characters that are **not** digits (using `[^0-9]`)**

```javascript
function geek() {
  let str1 = "128@$%";
  let replacement = "#";
  let regex4 = new RegExp("[^0-9]", "g"); // Regular expression to match any character that is NOT a digit
  let match4 = str1.replace(regex4, replacement); // Replace non-digit characters with "#"

  console.log("Found " + match4.length + " matches: " + match4);
}
geek();
```

### Explanation:

- **`[^0-9]`**: The regular expression `[^0-9]` matches any character that is **not** a digit (0-9).
  - **`[^0-9]`**: The caret `^` inside the square brackets negates the character class. It matches anything **except** digits.
  - **`g`**: The global flag ensures the regex matches all non-digit characters in the string.

- **`replace()`**: The `replace()` method replaces all non-digit characters in the string with the specified replacement (`"#"`).
  - In the string `"128@$%"`, the characters `@`, `$`, and `%` are replaced with `"#"`, resulting in `"128###"`.

#### Output:

```javascript
Found 6 matches: 128###
```

### **Summary of Behavior**:

- **`/[^0-4]/g`**: Matches all characters in the string that are **not** in the range from `0` to `4`.
  - In the string `"123456790"`, it matches `5`, `6`, `7`, and `9`, and the length of the match is 4.
- **`[^0-9]`**: Matches all characters in the string that are **not** digits.
  - In the string `"128@$%"`, the non-digit characters (`@`, `$`, `%`) are replaced with `"#"`, resulting in the string `"128###"`.

### **Conclusion**:

The regular expression `[^...]` is very useful for matching any characters that do not belong to a specific group (e.g., digits, letters, or certain ranges). It can be used in combination with the `match()` method to extract non-matching characters, or with the `replace()` method to replace them with a specific value.
