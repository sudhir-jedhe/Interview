### Working with Whitespace in JavaScript using Regular Expressions

Whitespace characters (spaces, tabs, newlines, etc.) are essential for formatting text and separating elements within a string. In JavaScript, the `\s` regular expression is used to match any whitespace character, and this can be quite useful for various string manipulation tasks.

Here are some useful functions that involve working with whitespace characters:

---

### 1. **Check if a string contains any whitespace**

You can use `RegExp.prototype.test()` with the regular expression `\s` to check if a string contains at least one whitespace character.

#### Example:

```javascript
const containsWhitespace = (str) => /\s/.test(str);

console.log(containsWhitespace("lorem")); // false
console.log(containsWhitespace("lorem ipsum")); // true
```

#### Explanation:

- **`/\s/`** matches any whitespace character (spaces, tabs, newlines, etc.).
- **`test()`** checks if the regular expression matches any part of the string.
- If there is at least one whitespace character in the string, `containsWhitespace()` will return `true`.

---

### 2. **Remove all whitespaces from a string**

To remove all whitespace characters from a string, you can use `String.prototype.replace()` with the global flag (`g`) and a regular expression that matches one or more whitespace characters (`\s+`).

#### Example:

```javascript
const removeWhitespace = (str) => str.replace(/\s+/g, "");

console.log(removeWhitespace("Lorem ipsum.\n Dolor sit amet. "));
// Output: 'Loremipsum.Dolorsitamet.'
```

#### Explanation:

- **`/\s+/g`** matches **one or more whitespace characters** (including spaces, newlines, etc.) globally across the string.
- **`replace()`** is used to remove these matches by replacing them with an empty string (`''`).

---

### 3. **Compact whitespaces in a string (replace multiple spaces with a single space)**

Sometimes, you might want to replace sequences of multiple whitespace characters with a single space. You can do this using `String.prototype.replace()` with a regular expression that matches two or more whitespace characters (`\s{2,}`).

#### Example:

```javascript
const compactWhitespace = (str) => str.replace(/\s{2,}/g, " ");

console.log(compactWhitespace("Lorem    Ipsum")); // 'Lorem Ipsum'
console.log(compactWhitespace("Lorem \n Ipsum")); // 'Lorem Ipsum'
```

#### Explanation:

- **`/\s{2,}/g`** matches **2 or more whitespace characters**.
- **`replace()`** replaces any sequence of 2 or more whitespace characters with a **single space** (`' '`).

---

### Summary of the Functions

#### 1. **Check if a string contains any whitespace**

```javascript
const containsWhitespace = (str) => /\s/.test(str);
```

- **Usage**: Checks if the string contains any whitespace characters (space, tab, newline, etc.).

#### 2. **Remove all whitespaces from a string**

```javascript
const removeWhitespace = (str) => str.replace(/\s+/g, "");
```

- **Usage**: Removes all whitespace characters from the string.

#### 3. **Compact multiple whitespaces into a single space**

```javascript
const compactWhitespace = (str) => str.replace(/\s{2,}/g, " ");
```

- **Usage**: Replaces sequences of 2 or more whitespace characters with a single space.

---

### Additional Notes:

- **`\s`**: Matches any whitespace character, including spaces, tabs, and newlines.
- **`\s+`**: Matches **one or more** whitespace characters.
- **`\s{2,}`**: Matches **two or more** whitespace characters.

By using these techniques, you can easily handle whitespace in strings, whether you need to check, remove, or normalize it.
