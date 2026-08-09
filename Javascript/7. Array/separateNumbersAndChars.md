Here are two common ways to separate numbers and characters (letters) into different arrays in JavaScript, depending on what you want to do with symbols and spaces.

---

### Option 1: Standard Regex (Letters vs. Digits)

This is the cleanest approach. It separates numbers (`0-9`) into one array and letters (`a-z`, `A-Z`) into another, ignoring spaces and punctuation.

```javascript
function separateNumbersAndChars(str) {
  // \d matches digits, [a-zA-Z] matches letters
  const numbers = str.match(/\d/g) || [];
  const characters = str.match(/[a-zA-Z]/g) || [];

  return { numbers, characters };
}

// Example usage:
const text = "Hello 123 World! 456";
const result = separateNumbersAndChars(text);

console.log(result.numbers);    // Output: ["1", "2", "3", "4", "5", "6"]
console.log(result.characters); // Output: ["H", "e", "l", "l", "o", "W", "o", "r", "l", "d"]

```

---

### Option 2: Single Pass Loop (Include Everything)

If you want to iterate through every character in the string once and separate digits from non-digits (including spaces and symbols), use a `for...of` loop:

```javascript
function splitStringByCharType(str) {
  const numbers = [];
  const characters = [];

  for (const char of str) {
    if (/\d/.test(char)) {
      numbers.push(char);
    } else {
      characters.push(char); // Includes letters, spaces, and punctuation
    }
  }

  return { numbers, characters };
}

// Example usage:
const text = "A1b2C3!";
const result = splitStringByCharType(text);

console.log(result.numbers);    // Output: ["1", "2", "3"]
console.log(result.characters); // Output: ["A", "b", "C", "!"]

```

---

### Option 3: Extract Multi-digit Whole Numbers

If you want whole multi-digit numbers (like `123` instead of `"1", "2", "3"`), adjust the regex using `\d+`:

```javascript
function extractFullNumbers(str) {
  // \d+ matches one or more consecutive digits
  const numbers = str.match(/\d+/g)?.map(Number) || [];
  const characters = str.match(/[a-zA-Z]/g) || [];

  return { numbers, characters };
}

// Example usage:
const text = "Room 101 and 205";
const result = extractFullNumbers(text);

console.log(result.numbers);    // Output: [101, 205]
console.log(result.characters); // Output: ["R", "o", "o", "m", "a", "n", "d"]

```
