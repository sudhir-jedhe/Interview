Great! You're asking about using regular expressions to check whether a string contains only alphabetic or alphanumeric characters. Below are two useful examples for string validation and how you can easily adapt these patterns for more complex needs:

### 1. **Check if a String Contains Only Alphabetic Characters (a-zA-Z)**

To check if a string contains only alphabetic characters (letters), you can use the following regular expression:

- **Pattern**: `/^[a-zA-Z]*$/`
  - `^` - Asserts the start of the string.
  - `[a-zA-Z]` - Matches any lowercase or uppercase letter.
  - `*` - Ensures that zero or more alphabetic characters are allowed.
  - `$` - Asserts the end of the string.
  - The `*` quantifier allows an empty string, meaning the string can be completely empty and still match.

#### Example:

```javascript
const isAlpha = (str) => /^[a-zA-Z]*$/.test(str);

console.log(isAlpha("sampleInput")); // true
console.log(isAlpha("this Will fail")); // false (because of space)
console.log(isAlpha("123")); // false (because of digits)
console.log(isAlpha("")); // true (empty string is allowed)
```

### 2. **Check if a String Contains Only Alphanumeric Characters (a-zA-Z0-9)**

For strings containing **only alphanumeric characters** (letters and digits), you extend the alphabetic range to include digits as well. The regular expression would look like this:

- **Pattern**: `/^[a-z0-9]*$/gi`
  - `g` and `i` flags are optional.
    - `g` (global) is typically used when you want to find all matches (though `test` only looks for one match).
    - `i` makes the search case-insensitive, but since `[a-z]` is already case-insensitive, you can omit it.
  - The pattern will match strings that consist only of lowercase and uppercase letters (`a-zA-Z`) and digits (`0-9`).

#### Example:

```javascript
const isAlphaNumeric = (str) => /^[a-z0-9]*$/gi.test(str);

console.log(isAlphaNumeric("hello123")); // true
console.log(isAlphaNumeric("123")); // true
console.log(isAlphaNumeric("hello 123")); // false (space is not allowed)
console.log(isAlphaNumeric("#$hello")); // false (special characters are not allowed)
console.log(isAlphaNumeric("")); // true (empty string is allowed)
```

### 3. **Customizing the Validation**

You can easily customize these regular expressions to accommodate other characters, such as spaces, hyphens, or underscores.

#### Allow spaces:

To allow spaces in alphanumeric validation, you can modify the regex to include the space character (`\s`):

```javascript
const isAlphaNumericWithSpace = (str) => /^[a-z0-9\s]*$/gi.test(str);

console.log(isAlphaNumericWithSpace("hello world 123")); // true
console.log(isAlphaNumericWithSpace("hello@world")); // false (contains `@`)
```

#### Allow hyphens or underscores:

To allow hyphens (`-`) or underscores (`_`), you just need to add those to the character class:

```javascript
const isAlphaNumericWithSpecialChars = (str) => /^[a-z0-9-_]*$/gi.test(str);

console.log(isAlphaNumericWithSpecialChars("hello_world-123")); // true
console.log(isAlphaNumericWithSpecialChars("hello world-123")); // false (contains space)
```

### 4. **Validating a Username (Example)**

Let’s say you want to validate a **username** that:

- Contains only letters, digits, hyphens, or underscores.
- Should not start or end with a hyphen or underscore.
- Should be between 3 to 15 characters long.

Here's a regular expression for that:

```javascript
const isValidUsername = (str) =>
  /^[a-z0-9](?:[a-z0-9-_]{1,13}[a-z0-9])?$/i.test(str);

console.log(isValidUsername("user_name-123")); // true
console.log(isValidUsername("user-123_")); // true
console.log(isValidUsername("user__123")); // false (double underscore)
console.log(isValidUsername("-username123")); // false (starts with a hyphen)
console.log(isValidUsername("u")); // false (too short)
console.log(isValidUsername("username1234567890")); // false (too long)
```

#### Explanation:

- **`^[a-z0-9]`**: The string must start with an alphanumeric character.
- **`(?:[a-z0-9-_]{1,13}[a-z0-9])?`**: The string can contain up to 13 more alphanumeric characters, hyphens, or underscores, but it must end with an alphanumeric character.
- **`i` flag**: Makes the regex case-insensitive.

### Summary:

- **Alpha Characters**: `/^[a-zA-Z]*$/` — Checks if the string contains only letters.
- **Alphanumeric Characters**: `/^[a-z0-9]*$/gi` — Checks if the string contains only letters and numbers.
- **Customization**: You can extend these regex patterns to include other characters like spaces, hyphens, or underscores, depending on your needs.

These regex patterns can easily be adapted for different types of input validation in JavaScript!
