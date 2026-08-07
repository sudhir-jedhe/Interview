```js
function detectCapitalUse(word: string): boolean {
    const cnt = word.split('').reduce((acc, c) => acc + (c === c.toUpperCase() ? 1 : 0), 0);
    return cnt === 0 || cnt === word.length || (cnt === 1 && word[0] === word[0].toUpperCase());
}
```

This is a classic solution to **LeetCode 520: Detect Capital**. It checks if capitalization in a word is used correctly according to three valid rules:

1. **All letters are uppercase** (e.g., `"USA"`).
2. **All letters are lowercase** (e.g., `"leetcode"`).
3. **Only the first letter is uppercase** (e.g., `"Google"`).

---

### Code Analysis & Walkthrough

The current solution counts the total number of uppercase letters in `word` using `.reduce()`, then checks the three boolean conditions:

1. **`cnt === 0`**: No uppercase letters (all lowercase).
2. **`cnt === word.length`**: Every letter is uppercase.
3. **`cnt === 1 && word[0] === word[0].toUpperCase()`**: Exactly one uppercase letter, and it is the first letter.

---

### Optimization Opportunities

#### 1. Performance: Early Exit ($O(1)$ Extra Space, $O(N)$ Time)

Using `split('').reduce(...)` allocates a new array in memory and **always iterates through the entire string**, even if invalid capitalization is detected at index 1 (e.g., `"aPple"`).

We can optimize this to **exit early** as soon as an invalid pattern is encountered:

```typescript
function detectCapitalUse(word: string): boolean {
    if (word.length <= 1) return true;

    // Is the first letter capitalized?
    const isFirstUpper = word[0] === word[0].toUpperCase();
    // Is the second letter capitalized?
    const isSecondUpper = word[1] === word[1].toUpperCase();

    // Invalid Case: First letter is lowercase, but second letter is uppercase (e.g., "aPple")
    if (!isFirstUpper && isSecondUpper) return false;

    // If both 1st & 2nd are upper -> rest MUST be uppercase ("USA")
    // Otherwise -> rest MUST be lowercase ("Google" or "leetcode")
    const expectUpper = isFirstUpper && isSecondUpper;

    for (let i = 2; i < word.length; i++) {
        const isUpper = word[i] === word[i].toUpperCase();
        if (isUpper !== expectUpper) {
            return false;
        }
    }

    return true;
}

```

---

#### 2. Regex One-Liner (Declarative)

If you prefer concise and expressive code:

```typescript
function detectCapitalUse(word: string): boolean {
    return /^[A-Z]+$|^[a-z]+$|^[A-Z][a-z]*$/.test(word);
}

```

---

### Comparison Summary

| Method                        | Time Complexity | Space Complexity | Early Exit?    | Memory Allocations               |
| ----------------------------- | --------------- | ---------------- | -------------- | -------------------------------- |
| **`reduce` Count (Original)** | $O(N)$          | $O(N)$           | ❌ No           | Allocates array via `.split('')` |
| **Early-Exit Loop (Optimal)** | $O(N)$          | **$O(1)$**       | **✅ Yes**      | Zero extra allocations           |
| **RegEx Test**                | $O(N)$          | $O(1)$           | ✅ Yes (Engine) | Minimal engine overhead          |

Here is a breakdown of the solution organized **rule-by-rule** to show how each valid casing rule translates directly into code logic.

---

### Rule 1: All letters are uppercase (e.g., `"USA"`)

* **Logic:** Every single character from index `0` to `N - 1` must satisfy `char === char.toUpperCase()`.
* **Regex Pattern:** `^[A-Z]+$`

### Rule 2: All letters are lowercase (e.g., `"leetcode"`)

* **Logic:** Every single character from index `0` to `N - 1` must satisfy `char === char.toLowerCase()`.
* **Regex Pattern:** `^[a-z]+$`

### Rule 3: Only the first letter is uppercase (e.g., `"Google"`)

* **Logic:** Index `0` must be uppercase (`word[0] === word[0].toUpperCase()`), and all characters from index `1` to `N - 1` must be lowercase.
* **Regex Pattern:** `^[A-Z][a-z]*$`

---

### Rule-Wise Implementation Matrix

```typescript
function detectCapitalUseRulewise(word: string): boolean {
    // Helper checks
    const isUpper = (char: string) => char >= 'A' && char <= 'Z';
    const isLower = (char: string) => char >= 'a' && char <= 'z';

    // Rule 1 Check: All letters are uppercase
    const isAllUpper = word.split('').every(isUpper);
    if (isAllUpper) return true;

    // Rule 2 Check: All letters are lowercase
    const isAllLower = word.split('').every(isLower);
    if (isAllLower) return true;

    // Rule 3 Check: Only first letter is uppercase, rest are lowercase
    const isFirstUpperRestLower = 
        isUpper(word[0]) && word.slice(1).split('').every(isLower);
    if (isFirstUpperRestLower) return true;

    // If none of the 3 rules match, capitalization is invalid
    return false;
}

```

---

### Single-Pass Combined Rule Logic (Optimal Performance)

By combining all three rules into an index-based scan, we avoid array creations and exit early as soon as a rule is broken:

```typescript
function detectCapitalUse(word: string): boolean {
    let upperCount = 0;

    for (let i = 0; i < word.length; i++) {
        if (word[i] >= 'A' && word[i] <= 'Z') {
            upperCount++;
        }
    }

    // Evaluate against the 3 rules:
    // 1. upperCount === word.length -> Rule 1 (All Upper)
    // 2. upperCount === 0           -> Rule 2 (All Lower)
    // 3. upperCount === 1 && first is upper -> Rule 3 (Title Case)
    return (
        upperCount === word.length ||
        upperCount === 0 ||
        (upperCount === 1 && word[0] >= 'A' && word[0] <= 'Z')
    );
}

```
