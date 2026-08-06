# String Compression and Decompression (JavaScript Interview)

This is a classic interview problem based on **Run-Length Encoding (RLE)**, where consecutive repeated characters are replaced by the character and its count. [\[geeksforgeeks.org\]](https://www.geeksforgeeks.org/dsa/run-length-encoding/), [\[geeksforgeeks.org\]](https://www.geeksforgeeks.org/problems/run-length-encoding/1)

---

# Problem

## Compress

Input

```text
AAAABBBCCDAA
```

Output

```text
A4B3C2D1A2
```

## Decompress

Input

```text
A4B3C2D1A2
```

Output

```text
AAAABBBCCDAA
```

Run-length encoding replaces repeated characters with a count representation and can be implemented in linear time. [\[geeksforgeeks.org\]](https://www.geeksforgeeks.org/dsa/run-length-encoding/), [\[medium.com\]](https://medium.com/@ishifoev/run-length-encoding-rle-algorithm-step-by-step-guide-b0b89f3a4a9f)

---

# Compression

### Approach

```text
AAAABBBCCDAA

A repeated 4 times
B repeated 3 times
C repeated 2 times
D repeated 1 time
A repeated 2 times

Result:
A4B3C2D1A2
```

---

## Solution

```js
function compress(str) {
  if (!str.length) {
    return "";
  }

  let result = "";
  let count = 1;

  for (let i = 1; i <= str.length; i++) {
    if (str[i] === str[i - 1]) {
      count++;
    } else {
      result += str[i - 1] + count;
      count = 1;
    }
  }

  return result;
}
```

### Example

```js
compress("AAAABBBCCDAA");
```

Output

```text
A4B3C2D1A2
```

[\[geeksforgeeks.org\]](https://www.geeksforgeeks.org/dsa/run-length-encoding/), [\[js-craft.io\]](https://www.js-craft.io/blog/js-interview-question-1-length-encoding-and-decoding-for-strings/)

---

# Decompression

### Approach

```text
A4
AAAA

B3
BBB

C2
CC
```

---

## Solution

```js
function decompress(str) {
  let result = "";

  for (let i = 0; i < str.length; i += 2) {
    const char = str[i];
    const count = Number(str[i + 1]);

    result += char.repeat(count);
  }

  return result;
}
```

### Example

```js
decompress("A4B3C2D1A2");
```

Output

```text
AAAABBBCCDAA
```

[\[js-craft.io\]](https://www.js-craft.io/blog/js-interview-question-1-length-encoding-and-decoding-for-strings/)

---

# Better Decompression (Multi-Digit Counts)

Interviewers often add:

```text
A12B3
```

The previous solution fails.

---

## Production Version

```js
function decompress(str) {
  let result = "";
  let i = 0;

  while (i < str.length) {
    const char = str[i++];

    let count = "";

    while (i < str.length && /\d/.test(str[i])) {
      count += str[i++];
    }

    result += char.repeat(Number(count));
  }

  return result;
}
```

### Example

```js
decompress("A12B3");
```

Output

```text
AAAAAAAAAAAABBB
```

---

# Interview Optimisation

Sometimes asked:

> Return compressed string only if it is shorter.

Example:

```text
ABCD

Compressed:
A1B1C1D1

Longer than original
```

Return:

```text
ABCD
```

---

```js
function compress(str) {
  let compressed = "";
  let count = 1;

  for (let i = 1; i <= str.length; i++) {
    if (str[i] === str[i - 1]) {
      count++;
    } else {
      compressed += str[i - 1] + count;

      count = 1;
    }
  }

  return compressed.length < str.length ? compressed : str;
}
```

This optimisation is commonly used in interview variants of the string compression problem. [\[dev.to\]](https://dev.to/dpc/daily-javascript-challenge-js-250-string-compression-5650)

---

# TypeScript Version

```ts
function compress(str: string): string {
  let result = "";
  let count = 1;

  for (let i = 1; i <= str.length; i++) {
    if (str[i] === str[i - 1]) {
      count++;
    } else {
      result += str[i - 1] + count;

      count = 1;
    }
  }

  return result;
}
```

---

# Complexity

### Compression

```text
Time:  O(n)
Space: O(n)
```

### Decompression

```text
Time:  O(n)
Space: O(n)
```

[\[geeksforgeeks.org\]](https://www.geeksforgeeks.org/dsa/run-length-encoding/), [\[medium.com\]](https://medium.com/@ishifoev/run-length-encoding-rle-algorithm-step-by-step-guide-b0b89f3a4a9f)

---

# Senior Interview Follow-Ups

### 1. Compress Arrays

```js
[1,1,1,2,2,3]

↓

1x3 2x2 3x1
```

### 2. Streaming Compression

```text
Large file
1GB+
```

Process chunk by chunk.

### 3. In-Place Compression

LeetCode 443 variant:

```js
["a", "a", "a", "b"];
```

↓

```js
["a", "3", "b"];
```

### 4. Unicode Support

```text
😀😀😀😀😁😁
```

Use:

```js
Array.from(str);
```

---

## Senior Interview Answer

> The optimal solution uses Run-Length Encoding. Traverse the string once, count consecutive characters, and append the character plus its count. For decompression, parse the character and numeric count and rebuild the original string. Both operations run in **O(n)** time. [\[geeksforgeeks.org\]](https://www.geeksforgeeks.org/dsa/run-length-encoding/), [\[medium.com\]](https://medium.com/@ishifoev/run-length-encoding-rle-algorithm-step-by-step-guide-b0b89f3a4a9f)
