### Ques 1 : Given an input string s, reverse the order of the words

// Input: "the sky is blue"     ----->>>>>     Output: "blue is sky the"
// Input: "  hello world  "     ----->>>>>     Output: "world hello"
// Input: "a good   example"    ----->>>>>     Output: "example good a"

// "the sky is blue" => [the,sky,is,blue]
// [] => [the,sky,is,blue] => blue is sky the

```js
const reverseWords = function (s) {
  const splitS = s.split(" ");
  const stack = [];

  for (let i of splitS) {
    stack.push(i);
  }

  let finalS = "";

  while (stack.length) {
    const current = stack.pop();

    if (current) {
      finalS += " " + current;
    }
  }

  return finalS.trim();
};

console.log(reverseWords("the sky is blue"));
console.log(reverseWords("a good   example"));

// Time Complexity = O(n)
// Space Complexity = O(n)
```

### 7. Reverse Words in Sentence Preserving Non-Letters

```javascript
function reverseWords(str) {
  return str
    .split(" ")
    .map((word) => {
      let chars = word.split("");
      let letters = chars.filter((c) => /[a-zA-Z]/.test(c)).reverse();
      let ptr = 0;
      return chars
        .map((c) => (/[a-zA-Z]/.test(c) ? letters[ptr++] : c))
        .join("");
    })
    .join(" ");
}
```

1. reverse words
Question: How would you reverse words in a sentence?

Answer: You have to check for white space and walk through the string. Ask is there could be multiple whitespace.

//have a tailing white space
//fix this later
//now i m sleepy

```js
function reverseWords(str){
 var rev = [],
     wordLen = 0;
 for(var i = str.length-1; i>=0; i--){
   if(str[i]==' ' || i==0){
     rev.push(str.substr(i,wordLen+1));
     wordLen = 0;
   }
   else
     wordLen++;
 }
 return rev.join(' ');
}
```

A quick solution with build in methods:

```js
function reverseWords(str){
  return str.split(' ').reverse();
}
```

 1. reverse in place
Question: If you have a string like "I am the good boy". How can you generate "I ma eht doog yob"? Please note that the words are in place but reverse.

Answer: To do this, i have to do both string reverse and word reverse.

```js
function reverseInPlace(str){
  return str.split(' ').reverse().join(' ').split('').reverse().join('');
}

> reverseInPlace('I am the good boy');
 = "I ma eht doog yob"
```

Interviewer: ok. fine. can you do it without using build in reverse function?

you: (you mumbled): what the heck!!

//sum two methods.
//you can simply split words by ' '
//and for each words, call reverse function
//put reverse in a separate function

//if u cant do this,
//have a glass of water, and sleep

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
var reverseWords = function(s) {
    return  s.toString().trim().replace(/\s+/g, " ").split(' ').reverse().join(' ')
};

console.log(reverseWords('"a good   example'))

/*************************************************************************************************** */
function reverseString(sentence, left, right) {
  if (!sentence || sentence.length < 2) return
  while (left < right) {
      let temp = sentence[left]
      sentence = sentence.substr(0, left) + sentence[right] + sentence.substr(left+1)
      sentence = sentence.substr(0, right) + temp + sentence.substr(right+1)
      left++
      right--
  }
  return sentence
}

function reverseWords(sentence) {
  let left = 0
  let right = 0
  sentence = sentence.split('').reverse().join('')
  while (true) {
      while(sentence[left] === ' ') left++
      if (left >= sentence.length) break
      right = left + 1
      while (right < sentence.length && sentence[right] != ' ') right++
      sentence = reverseString(sentence, left, right-1)
      left = right
  }
  return sentence
}

let sentence = "I love javascript";
console.log(sentence);
console.log(reverseWords(sentence));

/**
* Time Complexity O(N)
* Space Complexity O(1)
*/

```

### **19. Reverse the order of words in a sentence without using the built-in `reverse()` method:**

```javascript
function reverseWords(sentence) {
  const words = sentence.split(" ");
  let reversedSentence = "";

  for (let i = words.length - 1; i >= 0; i--) {
    reversedSentence += words[i] + " ";
  }

  return reversedSentence.trim();
}

console.log(reverseWords("The quick brown fox")); // "fox brown quick The"
```

### **Q14: Given a string, reverse each word in the sentence**

```javascript
function reverseWords(sentence) {
  return sentence
    .split(" ")
    .map((word) => word.split("").reverse().join(""))
    .join(" ");
}

// Example:
console.log(reverseWords("Hello World")); // "olleH dlroW"
```

### 19. **Reverse the Order of Words in a Sentence**

```javascript
function reverseWords(sentence) {
  return sentence.split(' ').reverse().join(' ');
}
```

### 51. Reverse the words in a string while maintaining their order

To reverse the words in a string without changing their order, split the string by spaces, reverse each word, and then join them back.

```javascript
function reverseWords(str) {
  return str.split(" ").reverse().join(" ");
}
```

- `reverseWords`: Reverses the words in a string while keeping their original order.

Example usage:

```javascript
console.log(reverseWords("Hello World! How are you?")); // Output: 'you? are How World! Hello'
```

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

### Final Note

If you're focusing on performance and simplicity, the first approach (`reverseWords` using built-in methods) is preferable in most cases. The second approach is more educational and gives you a deeper understanding of how you could manipulate strings manually without relying on built-in functions.

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

Here is a clean, consolidated guide containing all unique variations of string and word reversal problems in JavaScript, with redundant implementations removed.

---

## 1. Reverse Word Order (Handle Extra Spaces)

**Problem:** Reverse the order of words while removing leading/trailing spaces and reducing multiple spaces to a single space (LeetCode #151).

```javascript
// Clean built-in approach
function reverseWordOrder(s) {
  return s.trim().split(/\s+/).reverse().join(' ');
}

console.log(reverseWordOrder("  hello world  ")); // "world hello"
console.log(reverseWordOrder("a good   example")); // "example good a"

```

- **Time Complexity:** $O(N)$
- **Space Complexity:** $O(N)$

---

## 2. Reverse Word Order in Place (In-Memory Array Reversal)

**Problem:** Reverse the word order by reversing the entire character array first, then reversing each word individually. This avoids creating unnecessary intermediate strings.

```javascript
function reverseWordsInPlace(str) {
  const chars = str.trim().split('');
  
  const reverse = (arr, left, right) => {
    while (left < right) {
      [arr[left], arr[right]] = [arr[right], arr[left]];
      left++;
      right--;
    }
  };

  // Step 1: Reverse entire character array
  reverse(chars, 0, chars.length - 1);

  // Step 2: Reverse each word back to original readability
  let start = 0;
  for (let end = 0; end <= chars.length; end++) {
    if (end === chars.length || chars[end] === ' ') {
      reverse(chars, start, end - 1);
      start = end + 1;
    }
  }

  // Clean up remaining multiple internal spaces
  return chars.join('').replace(/\s+/g, ' ');
}

console.log(reverseWordsInPlace("Hello world this is JavaScript")); 
// "JavaScript is this world Hello"

```

- **Time Complexity:** $O(N)$
- **Space Complexity:** $O(N)$ due to JavaScript string immutability, but operates in $O(1)$ auxiliary space logic.

---

## 3. Reverse Characters of Each Word In-Place

**Problem:** Keep the words in their original positions, but reverse the letters inside each word.

```javascript
function reverseEachWord(sentence) {
  return sentence
    .split(' ')
    .map(word => word.split('').reverse().join(''))
    .join(' ');
}

console.log(reverseEachWord("I am the good boy")); // "I ma eht doog yob"

```

- **Time Complexity:** $O(N)$
- **Space Complexity:** $O(N)$

---

## 4. Reverse Words Preserving Non-Letter Characters

**Problem:** Reverse only alphabetic characters within each word while keeping punctuation and non-alphabetic characters in their exact index positions.

```javascript
function reverseWordsPreservePunctuation(str) {
  return str
    .split(' ')
    .map(word => {
      const chars = word.split('');
      const letters = chars.filter(c => /[a-zA-Z]/.test(c)).reverse();
      let ptr = 0;
      return chars.map(c => (/[a-zA-Z]/.test(c) ? letters[ptr++] : c)).join('');
    })
    .join(' ');
}

console.log(reverseWordsPreservePunctuation("Hello, world!")); // "olleH, dlrow!"

```

- **Time Complexity:** $O(N)$
- **Space Complexity:** $O(N)$

---

## 5. Manual Iterative Reverse (Stack / Backward Loop)

**Problem:** Reverse the order of words without using the built-in `.reverse()` array method.

```javascript
function reverseWordsManual(sentence) {
  const words = sentence.trim().split(/\s+/);
  let reversedSentence = '';

  for (let i = words.length - 1; i >= 0; i--) {
    reversedSentence += words[i] + (i === 0 ? '' : ' ');
  }

  return reversedSentence;
}

console.log(reverseWordsManual("The quick brown fox")); // "fox brown quick The"

```

- **Time Complexity:** $O(N)$
- **Space Complexity:** $O(N)$

---

## Quick Reference Summary

| Goal                     | Technique                                              | Output Example                                |
| ------------------------ | ------------------------------------------------------ | --------------------------------------------- |
| **Reverse Word Order**   | `trim()`, `split(/\s+/)`, `reverse()`, `join(' ')`     | `"sky is blue"` $\rightarrow$ `"blue is sky"` |
| **Reverse Each Word**    | `split(' ')`, `map(reverse letters)`, `join(' ')`      | `"good boy"` $\rightarrow$ `"doog yob"`       |
| **Preserve Punctuation** | Extract letters, reverse, map back to original indices | `"world!"` $\rightarrow$ `"dlrow!"`           |
| **No `.reverse()**`      | Decrementing `for` loop over split array               | Manual $O(N)$ iteration                       |

Everything major from your collection is covered! The consolidated list includes all distinct patterns from your notes:

1. **Reverse word order with space cleaning** (LeetCode #151 style using regex)
2. **Reverse word order in-place** (using two-pointer array swapping)
3. **Reverse characters inside each word** (words stay in place, letters swap)
4. **Reverse letters preserving special characters/punctuation**
5. **Reverse without built-in `.reverse()**` (iterative / stack approach)

---

### Two Niche Edge Cases You Might Encounter in Interviews

If you want to be 100% covered for tricky interview follow-ups, here are two extra scenarios worth keeping in mind:

#### 1. True In-Place Character Array Reversal (When Input is `char[]`)

In JavaScript, strings are immutable, so `str.split('')` always allocates extra memory ($O(N)$ space). However, if an interviewer hands you an **array of characters directly** (`['h','e','l','l','o',' ','w','o','r','l','d']`) and asks for strict **$O(1)$ auxiliary space**:

```javascript
function reverseWordsInPlaceArray(a) {
  // 1. Helper to swap in-place
  const reverse = (arr, start, end) => {
    while (start < end) {
      [arr[start], arr[end]] = [arr[end], arr[start]];
      start++;
      end--;
    }
  };

  // 2. Reverse whole array
  reverse(a, 0, a.length - 1);

  // 3. Reverse individual words back
  let start = 0;
  for (let end = 0; end <= a.length; end++) {
    if (end === a.length || a[end] === ' ') {
      reverse(a, start, end - 1);
      start = end + 1;
    }
  }
  return a; // Modified directly in memory
}

const input = ['t','h','e',' ','s','k','y'];
reverseWordsInPlaceArray(input);
console.log(input); // ['s','k','y',' ','t','h','e']

```

#### 2. Reversing Words while Preserving Exact Whitespace Structure

Standard approaches normalize multiple spaces down to a single space. If an interviewer asks to **keep all tabs/spaces intact** exactly as they appeared:

```javascript
function reverseWordsKeepSpaces(str) {
  // Split on spaces but capture delimiters using parentheses in regex
  return str.split(/(\s+)/).reverse().join('');
}

console.log(reverseWordsKeepSpaces("a   good   example")); 
// "example   good   a" (exact space counts preserved)

```
