```js
function findTheDifference(s: string, t: string): string {
    const cnt: number[] = Array(26).fill(0);
    for (const c of s) {
        ++cnt[c.charCodeAt(0) - 'a'.charCodeAt(0)];
    }
    for (const c of t) {
        --cnt[c.charCodeAt(0) - 'a'.charCodeAt(0)];
    }
    for (let i = 0; ; ++i) {
        if (cnt[i] < 0) {
            return String.fromCharCode(i + 'a'.charCodeAt(0));
        }
    }
}



This solution for **LeetCode 389: Find the Difference** is functionally correct. It uses a **Frequency Array (Character Counting)** approach to determine which character was added to `t`.

---

### Code Analysis & Walkthrough

The logic follows 3 steps:

1. **Count frequencies in `s`:** Increments the index corresponding to each character in an array of size 26.
2. **Decrement frequencies in `t`:** Decrements the count for each character in `t`.
3. **Find the deficit:** The single extra character added to `t` will have a count of `-1`. The loop returns its corresponding character.

* **Time Complexity:** $\mathcal{O}(N)$ where $N$ is the length of `s` (since `t` has length $N + 1$).
* **Space Complexity:** $\mathcal{O}(1)$ (fixed frequency array of size 26).

---

### Alternative Solutions

While character counting is optimal in $O(N)$ time and $O(1)$ auxiliary space, two common alternative techniques are frequently highlighted in interviews:

#### 1. Bitwise XOR Trick ($\mathcal{O}(N)$ Time, $\mathcal{O}(1)$ Space)

Since XORing a number with itself cancels it out ($A \oplus A = 0$), XORing all characters of `s` and `t` together will cancel out all identical characters, leaving **only the extra character**.

```typescript
function findTheDifferenceXOR(s: string, t: string): string {
    let xor = 0;

    for (let i = 0; i < s.length; i++) {
        xor ^= s.charCodeAt(i);
        xor ^= t.charCodeAt(i);
    }
    // Include the extra character at the end of string t
    xor ^= t.charCodeAt(t.length - 1);

    return String.fromCharCode(xor);
}

```

---

#### 2. ASCII Sum Difference ($\mathcal{O}(N)$ Time, $\mathcal{O}(1)$ Space)

Calculate the total ASCII sum of characters in `t` and subtract the total ASCII sum of characters in `s`. The difference is the ASCII value of the added character.

```typescript
function findTheDifferenceSum(s: string, t: string): string {
    let sumS = 0;
    let sumT = 0;

    for (let i = 0; i < s.length; i++) {
        sumS += s.charCodeAt(i);
        sumT += t.charCodeAt(i);
    }
    sumT += t.charCodeAt(t.length - 1);

    return String.fromCharCode(sumT - sumS);
}

```

---

### Comparison Summary

| Approach                        | Time Complexity  | Auxiliary Space  | Key Advantage                              |
| ------------------------------- | ---------------- | ---------------- | ------------------------------------------ |
| **Frequency Array (Your Code)** | $\mathcal{O}(N)$ | $\mathcal{O}(1)$ | Easy to read and intuitive                 |
| **Bitwise XOR**                 | $\mathcal{O}(N)$ | $\mathcal{O}(1)$ | Eliminates array lookups; highly efficient |
| **ASCII Sum Difference**        | $\mathcal{O}(N)$ | $\mathcal{O}(1)$ | Extremely clean mathematical approach      |

Input: s = "abcd", t = "abcde"
Output: "e"
Explanation: 'e' is the letter that was added.
Example 2:

Input: s = "", t = "y"
Output: "y"

```
