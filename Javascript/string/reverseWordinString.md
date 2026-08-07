```js
/*********************Reverse Word in String remove white spaces *******************/

// Example 1:

// Input: s = "the sky is blue"
// Output: "blue is sky the"
// Example 2:

// Input: s = "  hello world  "
// Output: "world hello"
// Explanation: Your reversed string should not contain leading or trailing spaces.
// Example 3:

// Input: s = "a good   example"
// Output: "example good a"
// Explanation: You need to reduce multiple spaces between two words to a single space in the reversed string.
var reverseWords = function (s) {
  return s
    .toString()
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .reverse()
    .join(" ");
};

console.log(reverseWords('"a good   example'));

/*************************************************************************************************** */
function reverseString(sentence, left, right) {
  if (!sentence || sentence.length < 2) return;
  while (left < right) {
    let temp = sentence[left];
    sentence =
      sentence.substr(0, left) + sentence[right] + sentence.substr(left + 1);
    sentence = sentence.substr(0, right) + temp + sentence.substr(right + 1);
    left++;
    right--;
  }
  return sentence;
}

function reverseWords(sentence) {
  let left = 0;
  let right = 0;
  sentence = sentence.split("").reverse().join("");
  while (true) {
    while (sentence[left] === " ") left++;
    if (left >= sentence.length) break;
    right = left + 1;
    while (right < sentence.length && sentence[right] != " ") right++;
    sentence = reverseString(sentence, left, right - 1);
    left = right;
  }
  return sentence;
}

let sentence = "I love javascript";
console.log(sentence);
console.log(reverseWords(sentence));

/**
 * Time Complexity O(N)
 * Space Complexity O(1)
 */

function reverseWordsInArray(str) {
  // Convert the string into an array of characters
  const chars = str.split("");

  // Helper function to reverse a portion of the array
  const reverse = (arr, start, end) => {
    while (start < end) {
      [arr[start], arr[end]] = [arr[end], arr[start]]; // Swap elements
      start++;
      end--;
    }
  };

  // Step 1: Reverse the entire array
  reverse(chars, 0, chars.length - 1);

  // Step 2: Reverse each word in the array
  let start = 0;
  for (let i = 0; i <= chars.length; i++) {
    if (chars[i] === " " || i === chars.length) {
      reverse(chars, start, i - 1); // Reverse the current word
      start = i + 1; // Move to the start of the next word
    }
  }

  // Convert the array back to a string
  return chars.join("");
}

// Example usage:
const input = "Hello world this is JavaScript";
const result = reverseWordsInArray(input);
console.log(result); // Output: "JavaScript is this world Hello"

/***************************************** */

function reverseWordsInArray(str) {
  // Helper function to reverse a portion of the array
  const reverseSection = (s, left, right) => {
    while (left < right) {
      // Swap using destructuring assignment
      [s[left], s[right]] = [s[right], s[left]];
      left++;
      right--;
    }
  };

  // Convert the string to an array of characters
  const charArray = Array.from(str);

  // Step 1: Reverse the entire array
  reverseSection(charArray, 0, charArray.length - 1);

  // Step 2: Reverse each word
  let start = 0;
  for (let end = 0; end <= charArray.length; end++) {
    if (end === charArray.length || charArray[end] === " ") {
      reverseSection(charArray, start, end - 1);
      start = end + 1; // Move to the start of the next word
    }
  }

  // Convert the array back to a string
  return charArray.join("");
}

// Example usage:
const input = "Hello world this is JavaScript";
const result = reverseWordsInArray(input);
console.log(result); // Output: "JavaScript is this world Hello"
```

Your code demonstrates the classic **LeetCode 15 ("Reverse Words in a String")** problem using both high-level built-in methods and low-level two-pointer algorithms.

Here is a technical review of your solutions, correcting a **complexity claim error**, fixing a **string immutability bug**, and highlighting the **$\mathcal{O}(1)$ Extra Space In-Place algorithm**.

---

### 1. High-Level Approach (Best for Production)

```javascript
var reverseWords = function (s) {
  return s.trim().split(/\s+/).reverse().join(" ");
};

```

* **Pros:** Clean, readable, and handles multiple spaces, leading spaces, and trailing spaces automatically.
* **Complexity:** $\mathcal{O}(N)$ Time, $\mathcal{O}(N)$ Space.

---

### 2. Correcting the Complexity Claim ⚠️

In your snippet:

```javascript
/**
 * Time Complexity O(N)
 * Space Complexity O(1)
 */
function reverseString(sentence, left, right) { ... }

```

* **The Issue:** JavaScript strings are **primitive and immutable**. Calling `sentence.substr()` creates a brand-new string in memory on every single iteration of the while loop. This makes the space complexity **$\mathcal{O}(N^2)$** and time complexity **$\mathcal{O}(N^2)$**!
* **The Rule:** In JavaScript, true $\mathcal{O}(1)$ auxiliary space for string manipulation is impossible unless the input is passed directly as a **character array** (`char[]` / `string[]`).

---

### 3. Canonical Two-Pointer Algorithm ($\mathcal{O}(N)$ Time, $\mathcal{O}(1)$ Extra Space on Character Array)

To achieve true two-pointer string reversal without regular expressions or high-level methods, use the **3-Step Reverse Strategy**:

1. **Clean Spaces:** Remove extra spaces (leading, trailing, and multiple spaces between words) in-place.
2. **Reverse Whole Array:** Reverse the entire character array.
3. **Reverse Each Word:** Iterate through the array and reverse each word individually.

```javascript
/**
 * Reverses words in a character array in-place.
 * @param {string[]} chars - Array of single-character strings
 */
function reverseWordsInPlace(chars) {
  // Helper: Reverse array segment in-place
  function reverse(arr, left, right) {
    while (left < right) {
      [arr[left], arr[right]] = [arr[right], arr[left]];
      left++;
      right--;
    }
  }

  // Step 1: Clean multiple/leading/trailing spaces in-place (Two Pointers)
  let slow = 0;
  for (let fast = 0; fast < chars.length; fast++) {
    if (chars[fast] !== ' ' || (slow > 0 && chars[slow - 1] !== ' ')) {
      chars[slow] = chars[fast];
      slow++;
    }
  }
  // Trim trailing space if present
  if (slow > 0 && chars[slow - 1] === ' ') slow--;
  chars.length = slow; // Truncate array

  // Step 2: Reverse entire array
  reverse(chars, 0, chars.length - 1);

  // Step 3: Reverse each individual word back
  let start = 0;
  for (let end = 0; end <= chars.length; end++) {
    if (end === chars.length || chars[end] === ' ') {
      reverse(chars, start, end - 1);
      start = end + 1;
    }
  }

  return chars;
}

// --- Test Verification ---
const charArray = Array.from("  a good   example  ");
reverseWordsInPlace(charArray);
console.log(`"${charArray.join('')}"`); // Output: "example good a"

```

---

### Summary Matrix

| Approach                        | Handles Multiple Spaces? | Time Complexity      | Extra Space Complexity             | Best For                          |
| ------------------------------- | ------------------------ | -------------------- | ---------------------------------- | --------------------------------- |
| **`s.trim().split(/\s+/)...`**  | ✅ Yes                    | $\mathcal{O}(N)$     | $\mathcal{O}(N)$                   | **Web Applications / Clean Code** |
| **`substr()` Two-Pointer**      | ❌ Spacing Bugs           | $\mathcal{O}(N^2)$ ⚠️ | $\mathcal{O}(N^2)$ ⚠️               | Avoid (Immutability overhead)     |
| **Character Array Two-Pointer** | ✅ Yes                    | $\mathcal{O}(N)$     | **$\mathcal{O}(1)$** (on `char[]`) | **System / Low-Level Interviews** |
