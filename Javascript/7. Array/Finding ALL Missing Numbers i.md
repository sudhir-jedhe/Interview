To find the missing numbers from a sequence, we first need to look at the pattern or range.

For the array **[1, 2, 3, 5, 7]**:

If this represents a contiguous sequence from **1 to 7**, there are **two missing numbers**: **4** and **6**.

---

### How to Find Missing Numbers Programmatically

#### Case 1: Finding ALL Missing Numbers in a Range (JavaScript)

```javascript
function findMissingNumbers(arr) {
  const missing = [];
  const min = Math.min(...arr); // 1
  const max = Math.max(...arr); // 7
  const set = new Set(arr);

  for (let i = min; i <= max; i++) {
    if (!set.has(i)) {
      missing.push(i);
    }
  }

  return missing;
}

console.log(findMissingNumbers([1, 2, 3, 5, 7])); // Output: [4, 6]

```

---

#### Case 2: Finding a SINGLE Missing Number (Mathematical Formula)

If there was only **one** missing number in a sequence from $1$ to $n$, you could use the Gauss summation formula:

$$\text{Sum} = \frac{n \times (n + 1)}{2}$$

* **Expected Sum** for 1 to 5: $\frac{5 \times 6}{2} = 15$
* **Actual Sum** of `[1, 2, 3, 5]`: $1 + 2 + 3 + 5 = 11$
* **Missing Number:** $15 - 11 = 4$
