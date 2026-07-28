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
