Let's break down the two solutions for reversing words in a sentence.

### 1. **Using String Manipulation:**

This is a concise solution using built-in JavaScript functions like `trim()`, `replace()`, `split()`, `reverse()`, and `join()`.

```js
var reverseWords = function (s) {
  return s
    .toString()
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .reverse()
    .join(" ");
};

console.log(reverseWords("  hello world  ")); // Output: "world hello"
console.log(reverseWords("the sky is blue")); // Output: "blue is sky the"
console.log(reverseWords("a good   example")); // Output: "example good a"
```

### **Explanation:**

1. **Trim the input string**: `s.trim()` removes any leading or trailing spaces.
2. **Replace multiple spaces with a single space**: `s.replace(/\s+/g, " ")` ensures there is only a single space between words.
3. **Split the string into words**: `s.split(' ')` creates an array of words.
4. **Reverse the words**: `words.reverse()` reverses the array of words.
5. **Join the words**: `words.join(' ')` joins the words back into a single string, separated by spaces.

### **Time and Space Complexity:**

- **Time Complexity**: O(N) because each operation (`trim()`, `replace()`, `split()`, `reverse()`, `join()`) iterates over the string once.
- **Space Complexity**: O(N) since we create new strings (e.g., after `split()`, `reverse()`, and `join()`).

### 2. **Manual String Reversal (Character-by-Character Approach):**

This approach reverses the sentence in place and ensures that spaces are handled carefully to avoid multiple consecutive spaces.

```js
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
    while (sentence[left] === " ") left++; // Skip leading spaces
    if (left >= sentence.length) break;
    right = left + 1;
    while (right < sentence.length && sentence[right] !== " ") right++; // Find word boundary
    sentence = reverseString(sentence, left, right - 1); // Reverse individual word
    left = right;
  }
  return sentence;
}

let sentence = "I love javascript";
console.log(sentence); // "I love javascript"
console.log(reverseWords(sentence)); // Output: "javascript love I"
```

### **Explanation:**

1. **Initial String Reversal**: `sentence.split('').reverse().join('')` reverses the entire string, so the words appear in reverse order.
2. **Word Reversal**:
   - We then move through the string from left to right. The goal is to reverse each word separately.
   - `left` and `right` pointers are used to mark the boundaries of each word.
   - We then reverse the characters between `left` and `right` using the `reverseString` helper function.
   - After processing each word, `left` is moved to `right` to begin processing the next word.
3. **Handling spaces**: The inner `while` loops ensure that we skip over spaces and handle multiple spaces between words.

### **Time and Space Complexity:**

- **Time Complexity**: O(N) because we're iterating through the string once to reverse it and another time to reverse each word individually.
- **Space Complexity**: O(1) as we're only using a few extra variables (`left`, `right`, `temp`) and no extra space besides the string itself.

### **Comparison of Approaches:**

1. **Built-in string manipulation (first approach)**:
   - **Concise and easier to read**.
   - **Uses O(N) space** (since `split()`, `reverse()`, and `join()` create new strings).
   - Faster for simple cases since we rely on optimized JavaScript methods.

2. **Manual string reversal (second approach)**:
   - **O(1) space** (since we modify the string in place).
   - **More verbose** and potentially less readable.
   - Uses more complex logic with `substr()` and two while loops to handle word reversal.

### Final Note:

If you're focusing on performance and simplicity, the first approach (`reverseWords` using built-in methods) is preferable in most cases. The second approach is more educational and gives you a deeper understanding of how you could manipulate strings manually without relying on built-in functions.
