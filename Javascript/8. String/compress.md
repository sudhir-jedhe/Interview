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

This is a comprehensive guide to the **Run-Length Encoding (RLE)** interview problem.

To make this interview-ready for **Senior / Staff Level** evaluations, there are a few subtle bugs, string immutability caveats, and optimization edge cases worth addressing.

---

### Key Technical Edge Cases to Watch Out For

#### 1. Inefficient String Concatenation in $O(n^2)$ Time

In JavaScript, strings are **immutable**. Executing `result += char` inside a loop creates a new string copy on every iteration.

* **Small Strings ($n < 1,000$):** V8's rope optimization handles this fine.
* **Large Strings ($n > 100,000$):** Concatenation degrades to **$O(n^2)$** due to heap allocations.
* **Senior Fix:** Collect tokens in an `array` and call `.join('')` at the end for guaranteed $O(n)$ time and memory efficiency.

#### 2. The Unicode / Emoji Trap (`str[i]`)

Accessing string indices using standard bracket notation `str[i]` reads **UTF-16 code units**, not full characters. Emojis and surrogate pairs (like `😀`) consist of 2 code units:

```javascript
compress("😀😀😀"); 
// ❌ FAILS: Treats single emoji as two separate surrogate code units

```

**Fix:** Use `Array.from(str)` or string iterators (`for...of`) to iterate over full Unicode grapheme clusters:

```javascript
function compressUnicode(str) {
  if (!str) return "";
  const chars = Array.from(str); // Properly handles 2-byte UTF-16 surrogates
  const result = [];
  let count = 1;

  for (let i = 1; i <= chars.length; i++) {
    if (chars[i] === chars[i - 1]) {
      count++;
    } else {
      result.push(chars[i - 1], count);
      count = 1;
    }
  }

  return result.join('');
}

```

---

### Implementation for Follow-Up 3: In-Place Array Compression (LeetCode 443)

Interviewers frequently ask for **LeetCode 443** (compress the array *in-place* without allocating extra array space, returning the new length):

```javascript
/**
 * In-place Run-Length Encoding
 * @param {character[]} chars
 * @return {number} New length of array
 */
function compressInPlace(chars) {
  let write = 0; // Pointer where compressed output is written
  let read = 0;  // Pointer reading the input array

  while (read < chars.length) {
    const currentChar = chars[read];
    let count = 0;

    // Count consecutive duplicates
    while (read < chars.length && chars[read] === currentChar) {
      read++;
      count++;
    }

    // Write character
    chars[write++] = currentChar;

    // Write count if greater than 1 (as individual character digits)
    if (count > 1) {
      const countStr = String(count);
      for (let i = 0; i < countStr.length; i++) {
        chars[write++] = countStr[i];
      }
    }
  }

  return write; // Returns new length, array is modified in-place
}

// Verification
const input = ["a", "a", "b", "b", "c", "c", "c"];
const newLength = compressInPlace(input);
console.log(newLength); // 6
console.log(input.slice(0, newLength)); // ["a", "2", "b", "2", "c", "3"]

```

---

### Quick Comparison of RLE Approaches

| Variant                     | Time Complexity | Space Complexity | Best Used For                                                |
| --------------------------- | --------------- | ---------------- | ------------------------------------------------------------ |
| **Array Buffer `join('')**` | $O(n)$          | $O(n)$           | Production / High-Performance JS                             |
| **In-Place Modification**   | $O(n)$          | $O(1)$           | LeetCode 443 / Embedded Memory Limits                        |
| **Unicode (`Array.from`)**  | $O(n)$          | $O(n)$           | Internationalized text / Emojis                              |
| **Regex Decompression**     | $O(n)$          | $O(n)$           | Short, expressive scripts (`str.replace(/(\D)(\d+)/g, ...)`) |

To compress a multi-gigabyte file using Run-Length Encoding (RLE) without running out of memory, you must implement a custom Node.js **`Transform` stream**.

Because RLE requires knowing when a character changes or ends, a streaming RLE compressor must maintain a **state buffer** for the current running character and its count across chunk boundaries.

---

### Implementation: Streaming RLE Compressor

```javascript
import fs from 'fs';
import { Transform } from 'stream';

export class RleCompressorStream extends Transform {
  constructor(options = {}) {
    super({ ...options, encoding: 'utf-8' });
    this.currentChar = null;
    this.currentCount = 0;
  }

  _transform(chunk, encoding, callback) {
    // Convert chunk to string (handles buffer or string inputs)
    const str = typeof chunk === 'string' ? chunk : chunk.toString('utf-8');
    
    let output = '';

    for (let i = 0; i < str.length; i++) {
      const char = str[i];

      if (this.currentChar === null) {
        // First character ever encountered in the stream
        this.currentChar = char;
        this.currentCount = 1;
      } else if (char === this.currentChar) {
        // Consecutive match, increment run count
        this.currentCount++;
      } else {
        // Character changed: emit the accumulated run and reset state
        output += `${this.currentChar}${this.currentCount}`;
        this.currentChar = char;
        this.currentCount = 1;
      }
    }

    // Push accumulated compressed data for this chunk downstream
    if (output) {
      this.push(output);
    }
    
    callback();
  }

  _flush(callback) {
    // End of stream: flush any remaining character and count
    if (this.currentChar !== null) {
      this.push(`${this.currentChar}${this.currentCount}`);
    }
    callback();
  }
}

```

---

### Usage: Pipeline Setup

Pipe a large input file through the custom `RleCompressorStream` directly to an output write stream:

```javascript
import path from 'path';

const inputFilePath = path.join(process.cwd(), 'large-input.txt');
const outputFilePath = path.join(process.cwd(), 'large-output.rle');

console.time('Streaming RLE Compression');

const readStream = fs.createReadStream(inputFilePath, { encoding: 'utf-8' });
const writeStream = fs.createWriteStream(outputFilePath, { encoding: 'utf-8' });
const rleCompressor = new RleCompressorStream();

// Connect the streaming pipeline with backpressure handling
readStream
  .pipe(rleCompressor)
  .pipe(writeStream);

writeStream.on('finish', () => {
  console.timeEnd('Streaming RLE Compression');
  console.log('File compressed successfully via streams!');
});

writeStream.on('error', (err) => {
  console.error('Compression stream error:', err);
});

```

---

### Why This Works Efficiently for Large Files

1. **Constant Memory ($O(1)$ space):** The stream only retains the active character (`this.currentChar`) and integer count (`this.currentCount`) in memory, regardless of whether the file is 10 MB or 50 GB.
2. **Buffer Chunking:** `fs.createReadStream` feeds data in manageable 64 KB chunks, allowing Node.js to garbage-collect processed chunks instantly.
3. **Automatic Backpressure:** If the output disk write is slow, Node.js automatically pauses reading from the input file, preventing RAM overflows.

To decompress multi-digit Run-Length Encoded (RLE) strings (like `"A12B3C1"`) using a clean single-pass regex replacement, use `String.prototype.replace()` with a global match pattern and a replacer function.

---

### Implementation

```javascript
/**
 * Decompresses multi-digit RLE strings in a single regex pass.
 * 
 * @param {string} str - Encoded RLE string (e.g., "A12B3C1")
 * @returns {string} - Decompressed original string
 */
const decompressRLE = (str) => {
  if (!str) return '';

  // Match any non-digit character followed by one or more digits
  return str.replace(/([^\d])(\d+)/g, (_, char, count) => {
    return char.repeat(Number(count));
  });
};

```

---

### Verification & Test Cases

```javascript
console.log(decompressRLE("A12B3"));
// Output: "AAAAAAAAAAAABBB"

console.log(decompressRLE("A4B3C2D1A2"));
// Output: "AAAABBBCCDAA"

console.log(decompressRLE("X100"));
// Output: "X" repeated 100 times

console.log(decompressRLE(""));
// Output: ""

```

---

### How It Works

1. **`([^\d])` (Capture Group 1):** Matches a single character that is not a digit (e.g., `'A'`).
2. **`(\d+)` (Capture Group 2):** Matches one or more consecutive digits (e.g., `'12'`).
3. **`/g` (Global Flag):** Replaces every matched pair across the entire string in a single pass.
4. **`char.repeat(Number(count))`:** Repeats the matched character by the parsed integer count.

---

### Handling Full Unicode / Emoji Support

If your encoded strings contain multi-byte Unicode characters or emojis (like `"😀10😁2"`), standard non-digit matching `[^\d]` might split surrogate code units.

Use the **`u` (Unicode) flag** along with the `\D` character class to safely match complete Unicode graphemes:

```javascript
const decompressUnicodeRLE = (str) => {
  if (!str) return '';

  return str.replace(/(\D)(\d+)/gu, (_, char, count) => {
    return char.repeat(Number(count));
  });
};

console.log(decompressUnicodeRLE("😀4😁2"));
// Output: "😀😀😀😀😁😁"

```
