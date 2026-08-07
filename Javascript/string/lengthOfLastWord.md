Your solution for **LeetCode 58: Length of Last Word** is **optimal, clean, and runs in $\mathcal{O}(N)$ time with $\mathcal{O}(1)$ space**.

---

### Code Analysis & Walkthrough

Your two-pointer approach moves backwards from the end of the string in two distinct phases:

1. **Phase 1 (Skip Trailing Whitespace):** Decrements index `i` until it lands on the last non-space character (the end of the last word).
2. **Phase 2 (Measure Word Length):** Sets `j = i` and continues decrementing `j` until encountering the next space or the start of the string.
3. **Difference:** Returning `i - j` gives the exact length of that word without allocating any extra memory.

* **Time Complexity:** $\mathcal{O}(N)$ where $N$ is the length of `s` (in the worst case, we traverse the string once).
* **Space Complexity:** $\mathcal{O}(1)$ auxiliary space (uses only index pointers).

---

### Alternative Solutions in JavaScript

#### 1. One-Liner (Built-in String Methods)

For production code or quick prototype scripts:

```javascript
var lengthOfLastWordBuiltIn = function(s) {
    s = s.trim();
    return s.length - s.lastIndexOf(' ') - 1;
};

```

* **Time Complexity:** $\mathcal{O}(N)$
* **Space Complexity:** $\mathcal{O}(N)$ (creates a trimmed copy of the string)

---

#### 2. Single Loop Variant

You can also express the backwards iteration in a single `while` loop:

```javascript
var lengthOfLastWordSingleLoop = function(s) {
    let length = 0;
    
    for (let i = s.length - 1; i >= 0; i--) {
        if (s[i] !== ' ') {
            length++;
        } else if (length > 0) {
            // Once we've accumulated letters and hit the first space, we're done
            break;
        }
    }
    
    return length;
};

```

---

### Complexity Comparison

| Solution                     | Time Complexity  | Space Complexity     | Notes                                            |
| ---------------------------- | ---------------- | -------------------- | ------------------------------------------------ |
| **Two Pointers (Your Code)** | $\mathcal{O}(N)$ | **$\mathcal{O}(1)$** | **Optimal** — stops early, no string allocations |
| **Single Loop**              | $\mathcal{O}(N)$ | **$\mathcal{O}(1)$** | Highly readable alternative                      |
| **`s.trim().split(' ')`**    | $\mathcal{O}(N)$ | $\mathcal{O}(N)$     | Allocates an entire array of words in memory     |
