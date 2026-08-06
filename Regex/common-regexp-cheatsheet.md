### Regular Expressions Cheat Sheet

Here's a quick reference guide for common regular expressions in JavaScript, as well as some advanced features to enhance your pattern matching.

---

### **1. Exact String Match**

To match a string exactly, use `^` to anchor the start and `$` to anchor the end:

```js
const regexp = /^abc$/;
// Matches only the exact string 'abc'
```

---

### **2. Match Empty String**

To match an empty string, you can use the `^` and `$` anchors with no content in between:

```js
const regexp = /^$/;
// Matches an empty string
```

---

### **3. Match Whitespace Sequences**

To match one or more whitespace characters (spaces, tabs, newlines, etc.), use `\s+`:

```js
const regexp = /\s+/g;
// Matches sequences of one or more whitespace characters
```

---

### **4. Match Line Breaks**

Line breaks can be different across environments. Use `\r`, `\n`, or `\r\n` to match them, and the `g` and `m` flags for global and multiline matching:

```js
const regexp = /\r|\n|\r\n/gm;
// Matches all line breaks
```

---

### **5. Match Non-word Characters**

To match non-word characters (anything other than letters, digits, or underscores), use `[^\w\s]`:

```js
const regexp = /[^\w\s]/gi;
// Matches all non-word characters and non-whitespace characters (global, case-insensitive)
```

---

### **6. Match Alphanumeric, Dashes, and Hyphens**

To match strings consisting of alphanumeric characters, dashes, and hyphens (e.g., for slugs), use:

```js
const regexp = /^[a-zA-Z0-9-_]+$/;
// Matches strings with alphanumeric characters, dashes, and underscores
```

---

### **7. Match Letters and Whitespaces**

To match letters (case-insensitive) and whitespace characters, use:

```js
const regexp = /^[A-Za-z\s]+$/;
// Matches strings with letters and spaces
```

---

### **8. Exclude Certain Patterns**

To exclude strings containing specific patterns, use negative lookahead:

```js
const regexp = /^((?!(abc|bcd)).)*$/;
// Matches strings that do not contain 'abc' or 'bcd'
```

---

### **9. Match Text Inside Brackets**

To match text inside parentheses, use:

```js
const regexp = /\(([^)]+)\)/g;
// Matches text inside parentheses (capturing the content)
```

---

### **10. Validate GUID/UUID**

To validate a date format such as `DD/MM/YYYY`, use:

```js
const regexp = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
// Matches valid dates in DD/MM/YYYY or DD-MM-YYYY formats
```

---

### **11. Chunk String Into N-size Chunks**

To chunk a string into substrings of length `n`:

```js
const regexp = /.{1,2}/g;
// Splits the string into chunks of size 2
```

---

### **Anchors in Regular Expressions**

- `^`: Matches the start of the string or line (in multiline mode).
- `$`: Matches the end of the string or line (in multiline mode).
- `\b`: Word boundary.
- `\B`: Not a word boundary (opposite of `\b`).

---

### **Character Sequences**

- `.`: Matches any character except line breaks.
- `\w`: Matches any word character (letters, digits, and underscores).
- `\W`: Matches any non-word character (opposite of `\w`).
- `\s`: Matches any whitespace character (spaces, tabs, newlines).
- `\S`: Matches any non-whitespace character (opposite of `\s`).
- `\d`: Matches any digit.
- `\D`: Matches any non-digit (opposite of `\d`).

**Character Classes:**

- `[abc]`: Matches any one of the characters `a`, `b`, or `c`.
- `[^abc]`: Matches any character not `a`, `b`, or `c`.
- `[a-z]`: Matches any lowercase letter.
- `[^a-z]`: Matches any character not a lowercase letter.
- `[a-zA-Z]`: Matches any letter (lowercase or uppercase).

---

### **Quantifiers**

- `a?`: Matches zero or one occurrence of `a`.
- `a*`: Matches zero or more occurrences of `a`.
- `a+`: Matches one or more occurrences of `a`.
- `a{3}`: Matches exactly 3 occurrences of `a`.
- `a{3,}`: Matches 3 or more occurrences of `a`.
- `a{3,5}`: Matches between 3 and 5 occurrences of `a`.

---

### **Groups**

- `(ab)`: Capturing group — captures `ab`.
- `(a|b)`: Alternation — matches either `a` or `b`.
- `(?:ab)`: Non-capturing group — matches `ab` but does not capture it.

---

### **Flags**

- `g`: Global matching (matches all occurrences).
- `m`: Multiline matching (matches across multiple lines).
- `i`: Case-insensitive matching.
- `u`: Unicode matching (useful for matching Unicode characters).

---

### **Advanced Features**

#### **1. Capturing Groups**

Capturing groups allow you to extract specific parts of a match:

```js
const str = "JavaScript is a programming language";
/(JavaScript) is a (.*)/.exec(str);
/* 
  Result:
  [
    0: 'JavaScript is a programming language',
    1: 'JavaScript',
    2: 'programming language'
  ]
*/
```

#### **2. Non-Capturing Groups**

Non-capturing groups are used when you don't need to capture the matched content:

```js
const str = "JavaScript is a programming language";
/(?:JavaScript|Python) is a (.+)/.exec(str);
/* 
  Result:
  [
    0: 'JavaScript is a programming language',
    1: 'programming language'
  ]
*/
```

#### **3. Named Capturing Groups**

Named capturing groups allow you to refer to a matched group by name:

```js
const str = "JavaScript is a programming language";
/(?<subject>.+) is a (?<description>.+)/.exec(str);
/* 
  Result:
  [
    0: 'JavaScript is a programming language',
    1: 'JavaScript',
    2: 'programming language',
    groups: {
      subject: 'JavaScript',
      description: 'programming language'
    }
  ]
*/
```

#### **4. Capturing Group Backreferences**

Backreferences allow you to refer to a previously captured group:

```js
const str =
  "JavaScript is a programming language - an awesome programming language JavaScript is";
/(.+) is a (?<description>.+) - an awesome \k<description> \1 is/.exec(str);
/* 
  Result:
  [
    0: 'JavaScript is a programming language - an awesome programming language JavaScript is',
    1: 'JavaScript',
    2: 'programming language',
    groups: {
      subject: 'JavaScript',
      description: 'programming language'
    }
  ]
*/
```

#### **5. Lookaheads**

Lookaheads allow you to check if a pattern is followed by another pattern:

- **Positive lookahead** (`?=`): Matches only if the pattern is followed by another specified pattern.
- **Negative lookahead** (`?!`): Matches only if the pattern is not followed by the specified pattern.

```js
// Positive Lookahead
const str = "JavaScript is not the same as Java and you should remember that";
/Java(?=Script)(.*)/.exec(str);
/* 
  Result:
  [
    0: 'JavaScript is not the same as Java and you should remember that',
    1: 'Script is not the same as Java and you should remember that'
  ]
*/

// Negative Lookahead
/Java(?!Script)(.*)/.exec(str);
/* 
  Result:
  [
    0: 'Java and you should remember that',
    1: ' and you should remember that'
  ]
*/
```

#### **6. Unicode Matching**

Unicode matching allows you to match characters from different scripts, such as Greek or emoji characters:

```js
const str = "Greek looks like this: γεια";
/\p{Script=Greek}+/u.exec(str);
/* 
  Result:
  [
    0: 'γεια'
  ]
*/
```

---

### **Summary**

Regular expressions are a powerful tool for pattern matching and text manipulation. By using anchors, character classes, quantifiers, and advanced features like lookaheads, backreferences, and Unicode matching, you can create highly efficient and flexible search patterns in JavaScript.
