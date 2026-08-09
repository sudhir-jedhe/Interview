The problem you're solving here is to generate a permutation of numbers from 0 to `n` based on a string of instructions. The string `s` consists of characters `I` (for "Increase") and `D` (for "Decrease"). The task is to generate an array that follows these instructions where:

- `I` means the current number should be greater than the previous one (increasing order).
- `D` means the current number should be smaller than the previous one (decreasing order).

The approach involves using two pointers, `lo` and `hi`, to control the range of available numbers. As we traverse the string, we push values from `lo` (for "I") or from `hi` (for "D") into the result array.

### Explanation of the `diStringMatch` function

1. **Initialization**:
   - `n = s.length`: The length of the string `s` determines how many numbers we need to match.
   - `lo = 0` and `hi = n`: These pointers represent the current lowest and highest numbers that can be placed in the result array.

2. **Loop Through the String**:
   - If the current character in the string `s[i]` is `'I'` (Increase), we append the `lo` value to the result and increment `lo` (moving upwards).
   - If the current character in the string `s[i]` is `'D'` (Decrease), we append the `hi` value to the result and decrement `hi` (moving downwards).

3. **Final Step**:
   - After processing all characters, the last number in the string must be the remaining number, so we append `lo` (which should equal `hi` at this point) to the result.

### Code Implementation

```js
// diStringMatch.js
export function diStringMatch(s) {
  const n = s.length; // Length of the string
  let lo = 0,
    hi = n; // Initialize low and high pointers
  const perm = []; // Result array to store the permutation

  // Traverse the string to construct the permutation
  for (let i = 0; i < n; i++) {
    if (s[i] === "I") {
      perm.push(lo++); // For 'I', add lo and increment it
    } else {
      perm.push(hi--); // For 'D', add hi and decrement it
    }
  }

  // After the loop, add the last remaining number (either lo or hi)
  perm.push(lo); // At the end, lo == hi, so we can use either one

  return perm;
}
```

### Example Walkthroughs

#### Example 1: `"IDID"`

- Initialize: `lo = 0`, `hi = 4`, `perm = []`
- Iterating over the string:
  - `s[0] = "I"` → Append `lo` (0) to `perm`, then `lo++` → `lo = 1`
  - `s[1] = "D"` → Append `hi` (4) to `perm`, then `hi--` → `hi = 3`
  - `s[2] = "I"` → Append `lo` (1) to `perm`, then `lo++` → `lo = 2`
  - `s[3] = "D"` → Append `hi` (3) to `perm`, then `hi--` → `hi = 2`
- At the end, append `lo` (which is 2) to `perm`.
- Final result: `[0, 4, 1, 3, 2]`

#### Example 2: `"III"`

- Initialize: `lo = 0`, `hi = 3`, `perm = []`
- Iterating over the string:
  - `s[0] = "I"` → Append `lo` (0) to `perm`, then `lo++` → `lo = 1`
  - `s[1] = "I"` → Append `lo` (1) to `perm`, then `lo++` → `lo = 2`
  - `s[2] = "I"` → Append `lo` (2) to `perm`, then `lo++` → `lo = 3`
- At the end, append `lo` (which is 3) to `perm`.
- Final result: `[0, 1, 2, 3]`

#### Example 3: `"DDI"`

- Initialize: `lo = 0`, `hi = 3`, `perm = []`
- Iterating over the string:
  - `s[0] = "D"` → Append `hi` (3) to `perm`, then `hi--` → `hi = 2`
  - `s[1] = "D"` → Append `hi` (2) to `perm`, then `hi--` → `hi = 1`
  - `s[2] = "I"` → Append `lo` (0) to `perm`, then `lo++` → `lo = 1`
- At the end, append `lo` (which is 1) to `perm`.
- Final result: `[3, 2, 0, 1]`

### Time Complexity

- **Time Complexity**: \( O(n) \), where \( n \) is the length of the string `s`. This is because we loop through the string once and each operation inside the loop is constant time.
- **Space Complexity**: \( O(n) \) because we are storing the result array `perm` which has a length of \( n+1 \).

### Example Usage

You can test the function using the following script:

```js
import { diStringMatch } from "./diStringMatch.js";

// Example 1
console.log(diStringMatch("IDID")); // Output: [0, 4, 1, 3, 2]

// Example 2
console.log(diStringMatch("III")); // Output: [0, 1, 2, 3]

// Example 3
console.log(diStringMatch("DDI")); // Output: [3, 2, 0, 1]
```

### Conclusion

This implementation solves the problem efficiently using two pointers (`lo` and `hi`) and is easy to follow. It correctly generates a permutation based on the given string of `I` and `D`, ensuring that the result follows the required pattern. The time and space complexity are optimal for this type of problem.

This is a clean, optimal explanation and implementation of **LeetCode 942: DI String Match**. The **Two-Pointer Greedy Approach** is the best way to solve this problem.

---

### Why the Greedy Two-Pointer Approach Works

By maintaining `lo` (smallest remaining unused integer) and `hi` (largest remaining unused integer):

1. **When we see `'I'` (Increase):**

- Pushing `lo` guarantees that whatever number comes next (whether `lo + 1` or `hi`) will be strictly **greater** than `lo`.

1. **When we see `'D'` (Decrease):**

- Pushing `hi` guarantees that whatever number comes next (whether `lo` or `hi - 1`) will be strictly **smaller** than `hi`.

This greedy strategy ensures no choices conflict downstream, using all numbers from $0$ to $n$ exactly once.

---

### Complexity Analysis Summary

| Metric               | Complexity       | Explanation                                               |
| -------------------- | ---------------- | --------------------------------------------------------- |
| **Time Complexity**  | $\mathcal{O}(n)$ | Single pass through string `s` of length $n$.             |
| **Space Complexity** | $\mathcal{O}(n)$ | Array `perm` of length $n + 1$ to return the permutation. |
| **Auxiliary Space**  | $\mathcal{O}(1)$ | Only two pointers (`lo` and `hi`) allocated.              |

---

### Alternative Implementation: TypedArray Optimization

If performance or memory overhead is crucial (e.g., handling very large strings), you can pre-allocate a fixed-size `Int32Array` or standard array rather than dynamic `.push()` calls:

```javascript
export function diStringMatch(s) {
  const n = s.length;
  let lo = 0;
  let hi = n;
  
  // Pre-allocate array of size n + 1
  const perm = new Int32Array(n + 1);

  for (let i = 0; i < n; i++) {
    perm[i] = s[i] === "I" ? lo++ : hi--;
  }
  
  // Last remaining element
  perm[n] = lo;

  return Array.from(perm);
}

```

In **LeetCode 2375: Construct Smallest Number From DI String**, you are given a string `pattern` consisting of `'I'` (Increase) and `'D'` (Decrease). You need to construct a string of digits `1` through `9` (each used at most once) such that the sequence strictly follows the `'I'` and `'D'` conditions and yields the **lexicographically smallest possible number**.

---

### Key Difference from LeetCode 942

- **LeetCode 942:** Allows picking any unused numbers from $0$ to $N$.
- **LeetCode 2375:** Requires the digits to be strictly from the set $\{1, 2, \dots, N+1\}$ in increasing order, and forces the **lexicographically smallest** arrangement.

---

### Method 1: The Stack Approach (Greedy & Intuitive)

#### Concept

To get the lexicographically smallest number, we want smaller digits as early as possible.

1. Iterate through numbers `1` to `N + 1`.
2. Push each number onto a **stack**.
3. Whenever we encounter an `'I'` (or reach the end of the string), we pop **all** elements from the stack and append them to our result string.

When we hit a sequence of `'D'`s, numbers accumulate on the stack. Reversing them upon reaching an `'I'` automatically turns the `'D'` sequence into a decreasing chain of digits!

#### Code Implementation

```javascript
/**
 * Stack-based approach
 * Time Complexity: O(N)
 * Space Complexity: O(N)
 */
function smallestNumber(pattern) {
  const result = [];
  const stack = [];

  // Iterate from 1 up to pattern.length + 1
  for (let i = 0; i <= pattern.length; i++) {
    // Push the next available digit (1-indexed)
    stack.push(i + 1);

    // If we hit 'I' or reach the end, flush the stack
    if (i === pattern.length || pattern[i] === 'I') {
      while (stack.length > 0) {
        result.push(stack.pop());
      }
    }
  }

  return result.join('');
}

// --- Test Cases ---
console.log(smallestNumber("IIIDIDDD")); // Output: "123549876"
console.log(smallestNumber("DDD"));      // Output: "4321"

```

---

### Method 2: Pure Greedy / Reverse Substrings (No Stack)

#### Concept

Instead of using a stack, start with the initial sequence `"1234...N+1"`.

Whenever you encounter a sequence of consecutive `'D'`s starting at index `i` and ending at index `j`, **reverse the substring** from index `i` to `j + 1`.

#### Walkthrough for `pattern = "DDD"`

1. **Initial string:** `"1234"`
2. **Consecutive `'D'`s:** From index 0 to 2 (length 3).
3. **Action:** Reverse substring from index `0` to `3` (`"1234"` $\rightarrow$ `"4321"`).
4. **Result:** `"4321"`

#### Code Implementation

```javascript
/**
 * String Reversal Approach
 * Time Complexity: O(N)
 * Space Complexity: O(N)
 */
function smallestNumberGreedy(pattern) {
  const n = pattern.length;
  // Initialize result with digits "123...N+1"
  const arr = Array.from({ length: n + 1 }, (_, i) => String(i + 1));

  let i = 0;
  while (i < n) {
    if (pattern[i] === 'D') {
      let j = i;
      // Find the end of the consecutive 'D' segment
      while (j < n && pattern[j] === 'D') {
        j++;
      }
      
      // Reverse segment in-place from i to j
      reverse(arr, i, j);
      
      // Move pointer past the 'D' segment
      i = j;
    } else {
      i++;
    }
  }

  return arr.join('');
}

function reverse(arr, left, right) {
  while (left < right) {
    const temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;
    left++;
    right--;
  }
}

// --- Test Cases ---
console.log(smallestNumberGreedy("IIIDIDDD")); // Output: "123549876"

```

---

### Complexity Analysis

| Approach            | Time Complexity  | Space Complexity | Why?                                                                           |
| ------------------- | ---------------- | ---------------- | ------------------------------------------------------------------------------ |
| **Stack Approach**  | $\mathcal{O}(N)$ | $\mathcal{O}(N)$ | Each digit `1` through `N+1` is pushed and popped from the stack exactly once. |
| **Greedy Reversal** | $\mathcal{O}(N)$ | $\mathcal{O}(N)$ | Each index in the array is visited and reversed at most once.                  |

In **LeetCode 316: Remove Duplicate Letters** (and LeetCode 1081), you are given a string `s`. You must remove duplicate letters so that every letter appears **exactly once**, while ensuring the result is the **lexicographically smallest** possible without changing the original relative order of the characters.

---

### Key Intuition & Strategy

To get the lexicographically smallest result, we want **smaller characters to appear as early as possible**.

We use a **Monotonic Stack** with two helper tracking sets/maps:

1. **`lastIndex` Map:** Keeps track of the last index where each character appears in `s`.
2. **`seen` Set:** Keeps track of which characters are currently inside our stack to prevent duplicates.

#### The Monotonic Stack Rule

When processing character `c` at index `i`:

- If `c` is already in `seen`, **skip it** (we already have an instance of `c` in the result).
- While the top character of the stack is **greater than `c**` AND that top character **appears again later in the string** (`lastIndex[top] > i`):
- Pop the top character off the stack.
- Remove it from the `seen` set.

- Push `c` onto the stack and mark it as `seen`.

---

### Step-by-Step Code Implementation

```javascript
/**
 * @param {string} s
 * @return {string}
 */
function removeDuplicateLetters(s) {
  const stack = [];
  const seen = new Set();
  const lastIndex = new Map();

  // 1. Record the last occurrence index of each character
  for (let i = 0; i < s.length; i++) {
    lastIndex.set(s[i], i);
  }

  // 2. Iterate through the string and build the monotonic stack
  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    // If character is already in our stack, skip it
    if (seen.has(char)) {
      continue;
    }

    // Monotonic Stack condition:
    // Pop top elements if they are larger than current char AND appear again later
    while (
      stack.length > 0 &&
      stack[stack.length - 1] > char &&
      lastIndex.get(stack[stack.length - 1]) > i
    ) {
      const popped = stack.pop();
      seen.delete(popped);
    }

    // Add current character to stack and mark as seen
    stack.push(char);
    seen.add(char);
  }

  return stack.join('');
}

// --- Test Cases ---
console.log(removeDuplicateLetters("bcabc"));    // Output: "abc"
console.log(removeDuplicateLetters("cbacdcbc")); // Output: "acdb"

```

---

### Example Walkthrough: `s = "cbacdcbc"`

- **Last Indices:** `c: 7, b: 6, a: 2, d: 4`

| Step  | Char  | Stack State            | `seen` Set     | Action / Reason                                                                              |
| ----- | ----- | ---------------------- | -------------- | -------------------------------------------------------------------------------------------- |
| `i=0` | `'c'` | `['c']`                | `{c}`          | Push `'c'`.                                                                                  |
| `i=1` | `'b'` | `['b']`                | `{b}`          | `'c' > 'b'` and `'c'` appears at `7 > 1` $\rightarrow$ Pop `'c'`, push `'b'`.                |
| `i=2` | `'a'` | `['a']`                | `{a}`          | `'b' > 'a'` and `'b'` appears at `6 > 2` $\rightarrow$ Pop `'b'`, push `'a'`.                |
| `i=3` | `'c'` | `['a', 'c']`           | `{a, c}`       | Push `'c'`.                                                                                  |
| `i=4` | `'d'` | `['a', 'c', 'd']`      | `{a, c, d}`    | Push `'d'`.                                                                                  |
| `i=5` | `'c'` | `['a', 'c', 'd']`      | `{a, c, d}`    | `'c'` already in `seen` $\rightarrow$ Skip.                                                  |
| `i=6` | `'b'` | `['a', 'c', 'd', 'b']` | `{a, c, d, b}` | `'d' > 'b'`, but `'d'` last index is `4 < 6` $\rightarrow$ **Cannot pop `'d'**`. Push `'b'`. |
| `i=7` | `'c'` | `['a', 'c', 'd', 'b']` | `{a, c, d, b}` | `'c'` already in `seen` $\rightarrow$ Skip.                                                  |

**Final Result:** `"acdb"`

---

### Complexity Analysis

- **Time Complexity:** $\mathcal{O}(N)$ where $N$ is the length of the string. Each character is pushed to and popped from the stack at most once.
- **Space Complexity:** $\mathcal{O}(1)$ or $\mathcal{O}(K)$ auxiliary space, where $K$ is the number of unique characters in the alphabet ($K \le 26$).
