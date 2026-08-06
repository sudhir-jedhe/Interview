Let's break down each of your examples, where you're using the **`\B`** regular expression pattern, which is the **negation** of the word boundary anchor `\b`.

---

### Example 1: Matching the Word "for" with `\B`

```javascript
function geek() {
  let str1 = "GeeksforGeeks@_123_$";
  let regex4 = /\Bfor/gi; // Match 'for' not at a word boundary
  let match4 = str1.match(regex4);

  console.log("Found " + match4.length + " match: " + match4);
}
geek();
```

#### Explanation:

1. **Regular Expression**: `/\Bfor/gi`
   - **`\B`**: This is the **negation of the word boundary anchor `\b`**. It matches a position where a word boundary does **not** exist. In other words, it matches the pattern when it is **inside** a word.
   - `for`: The literal string we're searching for.
   - `g`: The **global** flag ensures that all occurrences of the pattern are matched in the entire string.
   - `i`: The **case-insensitive** flag ensures the search is case-insensitive (so "FOR", "fOr", etc. are also matched).

2. **`match()`**: The `match()` method returns an array of all matches of the regular expression in the string. In this case, it's looking for occurrences of the string `"for"` that are **not at a word boundary**.

3. **Input String**: `"GeeksforGeeks@_123_$"`
   - The word `"for"` appears as part of the word `"GeeksforGeeks"`, not as a standalone word. So, it matches the condition where there is no word boundary before `"for"`.

4. **Output**:
   - The result is an array containing one match: `["for"]`.
   - The output will be:
     ```
     Found 1 match: for
     ```

---

### Example 2: Replacing "geeky" with "GEEKY" with `\B`

```javascript
function geek() {
  let str1 = "123geeky456";
  let regex4 = new RegExp("\\Bgeeky", "gi"); // Match 'geeky' not at a word boundary
  let replace = "GEEKY"; // Replacement string
  let match4 = str1.replace(regex4, replace); // Replace the match with "GEEKY"

  console.log("New string: " + match4);
}
geek();
```

#### Explanation:

1. **Regular Expression**: `new RegExp("\\Bgeeky", "gi")`
   - **`\B`**: This negates the word boundary anchor `\b`, meaning it matches the string `"geeky"` **not at the boundary** of a word.
   - `geeky`: The literal string we want to match.
   - `g`: The **global** flag ensures that all occurrences of the pattern are matched.
   - `i`: The **case-insensitive** flag ensures the pattern will match even if the case of the string varies (e.g., "Geeky", "GEEKY", etc.).

2. **`replace()`**: The `replace()` method is used to replace the first occurrence of the matched pattern with the string `"GEEKY"`.

3. **Input String**: `"123geeky456"`
   - `"geeky"` appears between the digits `"123"` and `"456"`, which is not at a word boundary. Thus, it matches the pattern `\Bgeeky`.
   - The match `"geeky"` is replaced with `"GEEKY"`.

4. **Output**:
   - The string `"123geeky456"` is transformed into `"123GEEKY456"`.
   - The output will be:
     ```
     New string: 123GEEKY456
     ```

---

### Summary of Key Points:

- **`\B`**: The `\B` is the **inverse** of `\b`. It matches a position where a word boundary **does not** occur, meaning it matches the inside of a word, not the boundary between words.
  - **Example**: In `"GeeksforGeeks"`, the `"for"` will match because it is part of the word and not at a boundary between two words.

- **`match()`**: This method returns an array of all the matches in the string that fit the regular expression.

- **`replace()`**: This method is used to replace the first occurrence of a match with the specified replacement string.

---

### Outputs:

1. **For the first example**:

   ```
   Found 1 match: for
   ```

2. **For the second example**:
   ```
   New string: 123GEEKY456
   ```

These examples demonstrate how `\B` can be used to match patterns **inside** words, rather than at word boundaries.
