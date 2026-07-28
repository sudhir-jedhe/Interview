### Problem Breakdown:

We are given an array of words, and we need to find how many **unique Morse code transformations** exist for the words. Each word is converted to Morse code by transforming each of its characters into its corresponding Morse code, then concatenating these transformations to form a single string.

The goal is to return the count of distinct Morse code transformations among all the words.

### Solution Explanation:

1. **Morse Code Table**:
   The `codes` array defines the Morse code mapping for each letter from 'a' to 'z'. The position in this array corresponds to the letter's position in the alphabet (i.e., `codes[0]` is for 'a', `codes[1]` is for 'b', etc.).

2. **Word Transformation**:
   For each word in the input list:
   - Convert each character of the word to its corresponding Morse code.
   - Concatenate these codes together to form a single string (this represents the transformed word).

3. **Unique Transformations**:
   To count how many unique transformations exist, we can use a `Set` to store the transformed strings, because a `Set` only keeps unique values.

4. **Steps in the Function**:
   - For each word, split it into individual characters.
   - For each character, map it to its corresponding Morse code using the `codes` array.
   - Join the Morse codes together to form the transformation of the word.
   - Add the transformation to a `Set` to ensure uniqueness.
   - Finally, return the size of the `Set`, which gives the number of unique transformations.

### Code:

```typescript
const codes = [
  ".-", // a
  "-...", // b
  "-.-.", // c
  "-..", // d
  ".", // e
  "..-.", // f
  "--.", // g
  "....", // h
  "..", // i
  ".---", // j
  "-.-", // k
  ".-..", // l
  "--", // m
  "-.", // n
  "---", // o
  ".--.", // p
  "--.-", // q
  ".-.", // r
  "...", // s
  "-", // t
  "..-", // u
  "...-", // v
  ".--", // w
  "-..-", // x
  "-.--", // y
  "--..", // z
];

function uniqueMorseRepresentations(words: string[]): number {
  // Create a set to store unique Morse code transformations
  const morseSet = new Set(
    words.map((word) => {
      return word
        .split("") // Split each word into individual characters
        .map((c) => codes[c.charCodeAt(0) - "a".charCodeAt(0)]) // Map each character to its Morse code
        .join(""); // Join the Morse codes to form the transformation
    }),
  );

  // The size of the set will give the count of unique transformations
  return morseSet.size;
}

// Example 1
const words1 = ["gin", "zen", "gig", "msg"];
console.log(uniqueMorseRepresentations(words1)); // Output: 2

// Example 2
const words2 = ["a"];
console.log(uniqueMorseRepresentations(words2)); // Output: 1
```

### Explanation of the Code:

1. **Morse Code Mapping**:
   - The `codes` array is indexed from 0 to 25, where each index corresponds to a letter from 'a' to 'z'. For example, `codes[0]` is `".-"`, which is the Morse code for 'a'.

2. **Mapping Words to Morse Code**:
   - For each word, we first split it into individual characters.
   - For each character, we calculate its index by using `charCodeAt(0) - 'a'.charCodeAt(0)`. This gives the position of the letter in the alphabet (e.g., for 'a', it gives 0, for 'b', it gives 1, and so on).
   - We then use this index to fetch the corresponding Morse code from the `codes` array.
   - All the Morse codes of the letters are then concatenated to form the complete Morse code transformation of the word.

3. **Using a Set to Track Unique Transformations**:
   - The transformations are stored in a `Set`, which ensures that only unique Morse code strings are kept.
   - Finally, the size of the `Set` is returned, which represents the number of unique transformations.

### Example Walkthrough:

#### Example 1:

```javascript
words = ["gin", "zen", "gig", "msg"];
```

- `"gin"`:
  - 'g' → `--.`
  - 'i' → `..`
  - 'n' → `-.`
  - Morse code for `"gin"` → `--...-.`

- `"zen"`:
  - 'z' → `--..`
  - 'e' → `.`
  - 'n' → `-.`
  - Morse code for `"zen"` → `--...-.`

- `"gig"`:
  - 'g' → `--.`
  - 'i' → `..`
  - 'g' → `--.`
  - Morse code for `"gig"` → `--...--.`

- `"msg"`:
  - 'm' → `--`
  - 's' → `...`
  - 'g' → `--.`
  - Morse code for `"msg"` → `--...--.`

So, the unique Morse code transformations are `["--...-.", "--...--."]`, and thus the output is `2`.

#### Example 2:

```javascript
words = ["a"];
```

- `"a"`:
  - 'a' → `.-`
  - Morse code for `"a"` → `.-`

Since there is only one word, the output is `1`.

### Time Complexity:

- **O(n \* m)** where:
  - `n` is the number of words in the array.
  - `m` is the average length of each word.
    This is because:
  - For each word, we are splitting it into characters (O(m)) and then mapping each character to its Morse code (O(1) operation per character).
  - We are also adding the result to a `Set`, which typically has O(1) complexity for insertion.

### Space Complexity:

- **O(n \* m)**, because:
  - We store each word's transformation (up to `m` characters) in the `Set`.
  - In the worst case, all transformations could be unique, and thus the space used by the `Set` could grow proportionally to the size of the input.

### Conclusion:

This solution efficiently computes the number of unique Morse code transformations by utilizing a `Set` to store and count distinct transformations. It performs well with a time complexity of **O(n \* m)** and a space complexity of **O(n \* m)**, where `n` is the number of words and `m` is the length of the longest word.
