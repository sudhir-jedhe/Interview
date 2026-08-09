```js
Input: "( p((q)) ((s)t) )";
("b) (c) ()");

Output: 3 - 1;

let maximumDepth = (str) => {
  //Keep track of the current max and total max
  let max = 0;
  let total_max = 0;

  for (let i = 0; i < str.length; i++) {
    if (str[i] == "(") {
      max++;

      //If current max is greater than total max then update
      if (max > total_max) {
        total_max = max;
      }
    } else if (str[i] == ")") {
      //Check for balanced parentheses
      if (max > 0) {
        max--;
      } else {
        return -1;
      }
    }
  }

  //Again check for balanced parentheses
  if (max != 0) {
    return -1;
  }

  //Return total
  return total_max;
};

Input: console.log(maximumDepth("( a(b) (c) (d(e(f)g)h) I (j(k)l)m)"));
console.log(maximumDepth("( p((q)) ((s)t) )"));
console.log(maximumDepth(" "));
console.log(maximumDepth("b) (c) ()"));

Output: 4;
3;
0 - 1;
/*************************** */

let maximumDepthWithStack = (str) => {
  //Keep track of the current max and total max
  let max = 0;
  let total_max = 0;
  let stack = [];

  for (let i = 0; i < str.length; i++) {
    if (str[i] == "(") {
      max++;

      //Push '(' in stack
      stack.push("(");

      //If current max is greater than total max then update
      if (max > total_max) {
        total_max = max;
      }
    } else if (str[i] == ")") {
      //Check for balanced parentheses
      let open = stack.pop();

      if (max > 0 && open == "(") {
        max--;
      } else {
        return -1;
      }
    }
  }

  //Again check for balanced parentheses
  if (stack.length != 0) {
    return -1;
  }

  //Return total
  return total_max;
};

Input: console.log(maximumDepthWithStack("( a(b) (c) (d(e(f)g)h) I (j(k)l)m)"));
console.log(maximumDepthWithStack("( p((q)) ((s)t) )"));
console.log(maximumDepthWithStack(" "));
console.log(maximumDepthWithStack("b) (c) ()"));

Output: 4;
3;
0 - 1;
```

This code demonstrates two different approaches to solving **LeetCode 1614: Maximum Nesting Depth of the Parentheses** while validating if the parentheses string is **balanced** (returning `-1` for invalid inputs like extra closing brackets `)` or unclosed opening brackets `(`).

---

### Comparison of the Two Approaches

Both implementations achieve the same functionality, but their efficiency differs in terms of space complexity:

#### 1. Counter Approach (`maximumDepth`)

* **How it works:** Increments a counter `max` when encountering `(` and decrements when encountering `)`. Tracks the peak value in `total_max`.
* **Time Complexity:** $\mathcal{O}(N)$
* **Space Complexity:** **$\mathcal{O}(1)$** (Optimal memory usage)

#### 2. Stack Approach (`maximumDepthWithStack`)

* **How it works:** Uses an actual `stack` array to store `(` characters alongside the counter. Pops from the stack on `)`.
* **Time Complexity:** $\mathcal{O}(N)$
* **Space Complexity:** **$\mathcal{O}(N)$** (Allocates unnecessary stack space)

> **Key takeaway:** The Stack approach is redundant for simple single-bracket types `()` because the counter alone tracks the open bracket depth. However, the Stack approach becomes necessary if the input includes multiple bracket types (e.g., `()`, `{}`, `[]`).

---

### Refactored & Simplified Counter Solution

Using `Math.max()` simplifies the logic and makes the implementation cleaner:

```javascript
/**
 * Finds maximum nesting depth of parentheses with balance validation.
 * @param {string} str
 * @return {number} Maximum depth, or -1 if unbalanced.
 */
const maximumDepthClean = (str) => {
  let currentDepth = 0;
  let maxDepth = 0;

  for (const char of str) {
    if (char === '(') {
      currentDepth++;
      maxDepth = Math.max(maxDepth, currentDepth);
    } else if (char === ')') {
      currentDepth--;
      // Unmatched closing parenthesis
      if (currentDepth < 0) return -1;
    }
  }

  // Unmatched opening parenthesis remaining at the end
  return currentDepth === 0 ? maxDepth : -1;
};

// --- Test Cases ---
console.log(maximumDepthClean("( a(b) (c) (d(e(f)g)h) I (j(k)l)m)")); // 4
console.log(maximumDepthClean("( p((q)) ((s)t) )"));                // 3
console.log(maximumDepthClean(" "));                                 // 0
console.log(maximumDepthClean("b) (c) ()"));                         // -1 (Unbalanced)

```

---

### Execution Results

| Input String                           | Max Depth          | Valid/Balanced?   | Output |
| -------------------------------------- | ------------------ | ----------------- | ------ |
| `"( a(b) (c) (d(e(f)g)h) I (j(k)l)m)"` | **4** (at `(f)`)   | ✅ Valid           | `4`    |
| `"( p((q)) ((s)t) )"`                  | **3** (at `((q))`) | ✅ Valid           | `3`    |
| `" "`                                  | **0**              | ✅ Valid           | `0`    |
| `"b) (c) ()"`                          | N/A                | ❌ Starts with `)` | `-1`   |
