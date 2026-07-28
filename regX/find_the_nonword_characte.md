Let's break down both examples using the `\W` regular expression and explain what each part does.

### 1. **Using `\W` to Match Non-Word Characters**

In regular expressions:

- `\W` is a shorthand for matching **non-word characters**. This includes characters that are not:
  - Alphanumeric (A-Z, a-z, 0-9)
  - Underscore (`_`)

This means it will match any character that is **not a letter, digit, or underscore**.

---

### Example 1: Non-Word Characters in the String `"GeeksforGeeks@_123_$"`

```javascript
function geek() {
  let str1 = "GeeksforGeeks@_123_$";
  let regex4 = /\W/g; // \W matches non-word characters (not a-z, A-Z, 0-9, _)
  let match4 = str1.match(regex4);

  console.log("Found " + match4.length + " matches: " + match4);
}
geek();
```

#### Explanation:

1. **Input String**: `"GeeksforGeeks@_123_$"`
   - The string consists of alphanumeric characters and special symbols: `"@_123_$"`.
2. **Regular Expression**: `/\W/g`
   - `\W` will match any character that is **not** a letter (A-Z, a-z), a digit (0-9), or an underscore (`_`).
   - The **global flag (`g`)** ensures that we match all occurrences of non-word characters in the string.

3. **Matching**:
   - In this case, the string `"GeeksforGeeks@_123_$"` contains two non-word characters:
     - `"@"` (at symbol)
     - `"$"` (dollar sign)
   - These two characters will be matched.

4. **Result**:
   - The result is an array of matches: `["@","$"]`.
   - The `match4.length` will be `2`, and the output will be:
     ```
     Found 2 matches: @,$
     ```

---

### Example 2: Non-Word Characters in the String `"Geeky@128"`

```javascript
function geek() {
  let str1 = "Geeky@128";
  let regex4 = new RegExp("\\W", "g"); // \W matches non-word characters
  let match4 = str1.match(regex4);

  console.log("Found " + match4.length + " matches: " + match4);
}
geek();
```

#### Explanation:

1. **Input String**: `"Geeky@128"`
   - The string consists of alphanumeric characters and a special symbol: `"@"`.
2. **Regular Expression**: `new RegExp("\\W", "g")`
   - This is equivalent to `/\W/g`. It matches non-word characters (anything other than a letter, a digit, or an underscore).
   - The **global flag (`g`)** ensures that all occurrences are matched.

3. **Matching**:
   - The string `"Geeky@128"` contains just one non-word character:
     - `"@"` (at symbol)
   - The `match4` array will contain `["@"]`.

4. **Result**:
   - The result is an array of matches: `["@"]`.
   - The `match4.length` will be `1`, and the output will be:
     ```
     Found 1 matches: @
     ```

---

### Summary of Results:

1. **For the first example**:
   - **Input**: `"GeeksforGeeks@_123_$"`
   - **Matches**: `["@","$"]`
   - **Output**:
     ```
     Found 2 matches: @,$
     ```

2. **For the second example**:
   - **Input**: `"Geeky@128"`
   - **Matches**: `["@"]`
   - **Output**:
     ```
     Found 1 matches: @
     ```

---

### Key Points:

- `\W` is a shorthand to match **non-word characters**, which includes special characters, spaces, punctuation, etc.
- **Examples of non-word characters** that `\W` would match include symbols like `@`, `$`, `!`, spaces, punctuation, etc.
- The **global flag (`g`)** ensures that all instances of non-word characters in the string are matched, not just the first one.
