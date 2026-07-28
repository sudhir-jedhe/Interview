```js
function findWords(words: string[]): string[] {
    const s = '12210111011122000010020202';
    const ans: string[] = [];
    for (const w of words) {
        const t = w.toLowerCase();
        const x = s[t.charCodeAt(0) - 'a'.charCodeAt(0)];
        let ok = true;
        for (const c of t) {
            if (s[c.charCodeAt(0) - 'a'.charCodeAt(0)] !== x) {
                ok = false;
                break;
            }
        }
        if (ok) {
            ans.push(w);
        }
    }
    return ans;
}



500. Keyboard Row
Description
Given an array of strings words, return the words that can be typed using letters of the alphabet on only one row of American keyboard like the image below.

In the American keyboard:

the first row consists of the characters "qwertyuiop",
the second row consists of the characters "asdfghjkl", and
the third row consists of the characters "zxcvbnm".




Example 1:

Input: words = ["Hello","Alaska","Dad","Peace"]
Output: ["Alaska","Dad"]
Example 2:

Input: words = ["omk"]
Output: []
Example 3:

Input: words = ["adsdf","sfd"]
Output: ["adsdf","sfd"]

```

This is **LeetCode 500 — "Keyboard Row"**.

---

### Solution Strategy

1. **Map Characters to Rows:** Create a Hash Table or array mapping each character (a–z) to its corresponding row index (`1`, `2`, or `3`).
2. **Validate Each Word:**

- Convert the word to lower-case.
- Look up the row of the **first letter**.
- Verify whether **all other letters** in that word belong to the exact same row.

3. If all letters match, keep the word in the result array.

---

### JavaScript Solution

```javascript
/**
 * @param {string[]} words
 * @return {string[]}
 */
function findWords(words) {
  // Map characters to their row number
  const rowMap = new Map();

  const row1 = "qwertyuiop";
  const row2 = "asdfghjkl";
  const row3 = "zxcvbnm";

  for (const char of row1) rowMap.set(char, 1);
  for (const char of row2) rowMap.set(char, 2);
  for (const char of row3) rowMap.set(char, 3);

  const result = [];

  for (const word of words) {
    const lowerWord = word.toLowerCase();
    const targetRow = rowMap.get(lowerWord[0]);
    let isValid = true;

    for (let i = 1; i < lowerWord.length; i++) {
      if (rowMap.get(lowerWord[i]) !== targetRow) {
        isValid = false;
        break;
      }
    }

    if (isValid) {
      result.push(word);
    }
  }

  return result;
}

// Example:
console.log(findWords(["Hello", "Alaska", "Dad", "Peace"]));
// Output: ["Alaska", "Dad"]
```

---

### Regular Expression (Regex) One-Liner

You can also solve this concisely using regular expressions matching full strings belonging to any of the three row sets:

```javascript
function findWords(words) {
  const regex = /^[qwertyuiop]+$|^[asdfghjkl]+$|^[zxcvbnm]+$/i;
  return words.filter((word) => regex.test(word));
}
```

---

### Complexity Analysis

- **Time Complexity:** $\mathcal{O}(N \cdot L)$ where $N$ is the number of words and $L$ is the maximum length of a word.
- **Space Complexity:** $\mathcal{O}(1)$ auxiliary space (since the row map size is fixed at 26 characters).
