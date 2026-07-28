In these two JavaScript code snippets, you're using the `\S` (non-whitespace) regular expression to find all non-whitespace characters in a string. Let me walk you through both examples to explain how they work.

### Example 1: Using `\S` to Find Non-Whitespace Characters

```javascript
function geek() {
  let str1 = "GeeksforGeeks @ _123_ $";
  let regex4 = /\S/g; // Regular expression to match non-whitespace characters
  let match4 = str1.match(regex4); // Finding all non-whitespace characters

  console.log("Found " + match4.length + " matches: " + match4);
}
geek();
```

#### Explanation:

- **The Regular Expression `\S`**:
  - `\S` is a shorthand character class that matches **any non-whitespace character**. This includes letters, digits, punctuation, and symbols.
  - **Whitespace characters** include spaces, tabs (`\t`), newlines (`\n`), and carriage returns (`\r`), which are **excluded** by `\S`.

- **`match()` Method**:
  - The `match()` method is used on the string `str1` to find all occurrences that match the regular expression `\S`. It returns an array of **all non-whitespace characters** in the string.

- **Input String**: `"GeeksforGeeks @ _123_ $"`
  - The string contains the following non-whitespace characters: `"G", "e", "e", "k", "s", "f", "o", "r", "G", "e", "e", "k", "s", "@", "_", "1", "2", "3", "_", "$"`.
  - The spaces between these characters are excluded from the match.

- **Output**:
  - The `match4` array contains 20 non-whitespace characters.
  - The result will be:
    ```
    Found 20 matches: G,e,e,k,s,f,o,r,G,e,e,k,s,@,_,1,2,3,_,$
    ```

---

### Example 2: Using `\S` to Find Non-Whitespace Characters

```javascript
function geek() {
  let str1 = "Geeky@128";
  let regex4 = new RegExp("\\S", "g"); // Regular expression to match non-whitespace characters
  let match4 = str1.match(regex4); // Finding all non-whitespace characters

  console.log("Found " + match4.length + " matches: " + match4);
}
geek();
```

#### Explanation:

- **The Regular Expression `\S`**:
  - As explained earlier, `\S` matches any non-whitespace character.
  - In this case, it's used in the regular expression constructor `new RegExp("\\S", "g")`. The `"g"` flag is for **global search**, meaning it will search the entire string, not just the first match.

- **`match()` Method**:
  - `match()` is called on the string `"Geeky@128"`, and it returns an array of all non-whitespace characters.

- **Input String**: `"Geeky@128"`
  - The string contains the following non-whitespace characters: `"G", "e", "e", "k", "y", "@", "1", "2", "8"`.
  - There are no spaces, tabs, or newlines in this string, so all the characters match.

- **Output**:
  - The `match4` array contains 9 non-whitespace characters.
  - The result will be:
    ```
    Found 9 matches: G,e,e,k,y,@,1,2,8
    ```

---

### Summary of Key Points:

1. **Regular Expression `\S`**:
   - `\S` matches any character **except** for whitespace characters like spaces, tabs, and newlines.
   - It will match letters, numbers, punctuation, and symbols.

2. **Using `match()`**:
   - The `match()` method returns an array of all matches in the string that fit the given regular expression.
   - If no matches are found, `match()` will return `null`.

3. **Global Flag (`g`)**:
   - The `"g"` flag in the regular expression ensures that the search is global, meaning it looks for all occurrences of the pattern in the entire string, not just the first one.

### Outputs:

- For `"GeeksforGeeks @ _123_ $"`:

  ```
  Found 20 matches: G,e,e,k,s,f,o,r,G,e,e,k,s,@,_,1,2,3,_,$
  ```

- For `"Geeky@128"`:
  ```
  Found 9 matches: G,e,e,k,y,@,1,2,8
  ```

You can apply the same logic to any string to count and list non-whitespace characters, making `\S` a useful shorthand for such tasks.
