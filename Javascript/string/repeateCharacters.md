"Repeat Characters" can mean multiple interview problems. Here are the most common ones:

---

# 1. Find First Repeating Character

### Input

```js
const str = "javascript";
```

### Output

```js
"a";
```

### Solution

```js
function firstRepeatingChar(str) {
  const seen = new Set();

  for (const char of str) {
    if (seen.has(char)) {
      return char;
    }

    seen.add(char);
  }

  return null;
}

console.log(firstRepeatingChar("javascript"));
```

### Complexity

```text
Time: O(n)
Space: O(n)
```

---

# 2. Count Repeated Characters

### Input

```js
"programming";
```

### Output

```js
{
  r: 2,
  g: 2,
  m: 2
}
```

### Solution

```js
function countRepeatedChars(str) {
  const freq = {};

  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }

  const result = {};

  for (const key in freq) {
    if (freq[key] > 1) {
      result[key] = freq[key];
    }
  }

  return result;
}

console.log(countRepeatedChars("programming"));
```

---

# 3. Print Duplicate Characters

### Input

```js
"programming";
```

### Output

```js
["r", "g", "m"];
```

### Solution

```js
function getDuplicateChars(str) {
  const seen = new Set();
  const duplicates = new Set();

  for (const char of str) {
    if (seen.has(char)) {
      duplicates.add(char);
    } else {
      seen.add(char);
    }
  }

  return [...duplicates];
}

console.log(getDuplicateChars("programming"));
```

---

# 4. First Non-Repeating Character

### Input

```js
"aabbccddefg";
```

### Output

```js
"e";
```

### Solution

```js
function firstNonRepeating(str) {
  const freq = {};

  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }

  for (const char of str) {
    if (freq[char] === 1) {
      return char;
    }
  }

  return null;
}

console.log(firstNonRepeating("aabbccddefg"));
```

---

# 5. Compress Repeating Characters (Run-Length Encoding)

### Input

```js
"aaabbccccd";
```

### Output

```js
"a3b2c4d1";
```

### Solution

```js
function compress(str) {
  let result = "";
  let count = 1;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === str[i + 1]) {
      count++;
    } else {
      result += str[i] + count;
      count = 1;
    }
  }

  return result;
}

console.log(compress("aaabbccccd"));
```

---

# 6. Remove Repeated Characters

### Input

```js
"programming";
```

### Output

```js
"progamin";
```

### Solution

```js
function removeDuplicates(str) {
  return [...new Set(str)].join("");
}

console.log(removeDuplicates("programming"));
```

---

# Interview Favourite: Most Frequently Repeated Character

### Input

```js
"javascript";
```

### Output

```js
"a";
```

### Solution

```js
function maxRepeatedChar(str) {
  const freq = {};

  let maxChar = "";
  let maxCount = 0;

  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;

    if (freq[char] > maxCount) {
      maxCount = freq[char];
      maxChar = char;
    }
  }

  return maxChar;
}

console.log(maxRepeatedChar("javascript"));
```

### Complexity

```text
Time: O(n)
Space: O(k)
```

Where:

```text
n = string length
k = unique characters
```

For React/JavaScript interviews, the **most frequently asked variants** are:

1. First repeating character
2. First non-repeating character
3. Find duplicate characters
4. Maximum occurring character
5. String compression (Run-Length Encoding)
