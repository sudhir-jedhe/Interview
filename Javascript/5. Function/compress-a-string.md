Let's break down the tasks and solutions you've provided.

### 1. **String Compression**

You're tasked with compressing a string by replacing consecutive repeating characters with the character followed by its count. For example:
- `"a"` → `"a"`
- `"aa"` → `"a2"`
- `"aaa"` → `"a3"`
- `"aaab"` → `"a3b"`
- `"aaabb"` → `"a3b2"`
- `"aaabba"` → `"a3b2a"`

### **Solution 1: Compression with Loop and Count**

```javascript
/**
 * @param {string} str
 * @return {string}
 */
function compress(str) {
  const res = [];
  let count = 0;

  for (let i = 0; i < str.length; i++) {
    count++;
    if (str[i] !== str[i + 1]) {
      res.push(str[i]);
      if (count > 1) res.push(count);
      count = 0;
    }
  }
  return res.join("");
}
```

### Explanation:

1. **Initial Setup**:
   - `res`: An array to store the compressed result.
   - `count`: A counter to track the number of consecutive occurrences of a character.

2. **Loop Through String**:
   - The loop goes through each character and increments the `count`.
   - If the next character is different, it pushes the current character and the count (if greater than 1) into the `res` array.

3. **Return**:
   - Joins the array `res` into a string and returns it.

---

### **Solution 2: Using a More Concise Approach**

```javascript
/**
 * @param {string} str
 * @return {string}
 */
function compress(str) {
  let currentChar = '';
  let currentCount = 0;
  let result = '';
  
  for (let i = 0; i < str.length + 1; i++) {
    const char = str[i];
    if (char === currentChar) {
      currentCount += 1;
    } else {
      result += 
        currentCount === 0 ? '' :
        currentCount === 1 ? currentChar : currentChar + currentCount;
      currentChar = char;
      currentCount = 1;
    }
  }
  
  return result;
}
```

### Explanation:

1. **State Variables**:
   - `currentChar`: Stores the current character being processed.
   - `currentCount`: Keeps track of how many times the current character repeats.
   - `result`: The final compressed string.

2. **Loop**:
   - The loop iterates through the string, and if the character is the same as `currentChar`, `currentCount` is incremented.
   - When a different character is found, it appends the current character and its count (if greater than 1) to `result`.

3. **Return**:
   - Returns the final compressed string.

---

### 2. **String Uncompression**

The uncompression task is to expand a compressed string back into its original form. For example:
- `"3(ab)"` → `"ababab"`
- `"3(ab2(c))"` → `"abccabccabcc"`

### **Solution 1: Using Stack and Number Parsing**

```javascript
const isNumeric = (str) => !isNaN(parseFloat(str)) && isFinite(Number(str));

function uncompress(str) {
  const stack = [];
  
  for (const char of str) {
    if (char !== ')') {
      stack.push(char);
    } else {
      let word = '';
      let count = '';
      // Find the substring inside parentheses
      while (stack.length && stack[stack.length - 1] !== '(') word = stack.pop() + word;
      stack.pop(); // Remove '('
      // Find the repetition count
      while (stack.length && isNumeric(stack[stack.length - 1])) count = stack.pop() + count;
      stack.push(word.repeat(Number(count))); // Repeat the substring
    }
  }
  
  return stack.join('');
}
```

### Explanation:

1. **Helper Function**:
   - `isNumeric`: Checks if a string is a number.

2. **Main Loop**:
   - When encountering a closing parenthesis `)`, the loop pops characters from the stack until `(` is found to extract the substring.
   - It also extracts the repetition count (numeric value) and repeats the substring.

3. **Return**:
   - Joins the stack and returns the final uncompressed string.

---

### **Solution 2: Using Regular Expressions**

```javascript
function uncompress(str) {
  const result = str.replace(/(\d+)\(([\D]*?)\)/gi, (_, multiplier, subString) => subString.repeat(multiplier));
  return result.includes("(") ? uncompress(result) : result;
}
```

### Explanation:

1. **Regular Expression**:
   - The regex `(\d+)\(([\D]*?)\)` matches patterns where:
     - `\d+` is one or more digits (repetition count).
     - `\(([\D]*?)\)` matches the substring inside parentheses (non-digits).

2. **Replacement**:
   - The replacement part repeats the substring by multiplying it by the repetition count.

3. **Recursion**:
   - If the result still contains parentheses, the `uncompress` function is called recursively.

---

### **Solution 3: Using a Stack-Based Approach**

```javascript
function uncompress(str) {
  const stack = [''];
  const count = [];
  let n = '';
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    
    if (/\d/.test(char)) {
      n += char; // Accumulate digits
    } else if (char === '(') {
      stack.push('');
      count.push(Number(n));
      n = '';
    } else if (char === ')') {
      const sequence = stack.pop();
      const times = count.pop();
      stack.push(stack.pop() + sequence.repeat(times)); // Repeat the sequence
    } else {
      stack.push(stack.pop() + char); // Add regular characters
    }
  }
  
  return stack.pop(); // Final result
}
```

### Explanation:

1. **State Variables**:
   - `stack`: Keeps track of characters and sub-strings.
   - `count`: Holds the repetition counts for substrings.
   - `n`: Accumulates digits for repetition counts.

2. **Loop**:
   - As it processes each character:
     - If it's a digit, it accumulates it into `n`.
     - If it's an opening parenthesis `(`, it pushes a new string into the stack and stores the count.
     - If it's a closing parenthesis `)`, it repeats the sequence inside the parentheses based on the count.
     - Otherwise, it simply adds regular characters.

3. **Return**:
   - Returns the uncompressed string from the stack.

---

### Conclusion

- The **compression** solutions effectively replace consecutive repeating characters with their counts, ensuring that you handle single characters without appending a `1`.
- The **uncompression** solutions handle expanding a compressed string (e.g., "3(ab)") back into its expanded form. The stack-based approach or regular expressions are both effective for this problem.
