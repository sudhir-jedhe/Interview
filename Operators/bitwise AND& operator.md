**How to check if a number is even without using the % or modulo operator?**
↑ We can use the bitwise AND& operator for this problem. The & operates on its operand and treats them as binary values and performs the AND operation.

```js
function isEven(num) {
  if (num & 1) {
    return false;
  } else {
    return true;
  }
};

```

0 in binary is 000.
1 in binary is 001.
2 in binary is 010.
3 in binary is 011.
4 in binary is 100.
5 in binary is 101.
6 in binary is 110.
7 in binary is 111.
and so on...

| a   | b   | a & b |
| --- | --- | ----- |
| 0   | 0   | 0     |
| 0   | 1   | 0     |
| 1   | 0   | 0     |
| 1   | 1   | 1     |

So when we console.log this expression 5 & 1 it returns 1. Ok, first the & operator converts both numbers to binary so 5 turns to 101 and 1 turns to 001.
Then it compares every bit (0's and 1's) using the bitwise AND operator. 101 & 001. As we can see from the table the result can be only 1 if a AND b are 1.


| 101 & 001 |
| --------- |
| 101       |
| 001       |
| 001       |


To check if a number is even without using the modulo (`%`) operator, you can leverage bitwise operations, particularly the **bitwise AND** (`&`) operator, which works on binary representations of numbers.

### Bitwise Approach (Using `&`):
- In binary, even numbers always end in `0`, while odd numbers end in `1`.
- By performing a bitwise AND operation between the number and `1` (`num & 1`), you can determine whether the last bit (the least significant bit) is `0` or `1`.
  - If the last bit is `0`, the number is even.
  - If the last bit is `1`, the number is odd.

Here's how the bitwise approach works:

### Bitwise Example:

```js
function isEven(num) {
  if (num & 1) {
    return false;  // Odd number (last bit is 1)
  } else {
    return true;   // Even number (last bit is 0)
  }
}
```

### Explanation:
1. The expression `num & 1` converts `num` to its binary form and performs the AND operation with `1`. This only looks at the least significant bit (the last bit).
    - If the number is even, its last bit is `0` (binary `0`), so `num & 1` will return `0`.
    - If the number is odd, its last bit is `1` (binary `1`), so `num & 1` will return `1`.

### Examples:
- `5` in binary is `101`. `5 & 1` results in `1` because the last bit is `1` (odd number).
- `4` in binary is `100`. `4 & 1` results in `0` because the last bit is `0` (even number).

```js
console.log(isEven(4));  // true (even)
console.log(isEven(5));  // false (odd)
```

---

### Recursive Approach (Alternative Method):
You can also solve this problem using a recursive approach, where you reduce the number by `2` each time, and check for the base case.

#### Recursive Solution:

```js
function isEven(num) {
  if (num < 0 || num === 1) return false;  // If number is negative or odd
  if (num === 0) return true;              // Base case: 0 is even
  return isEven(num - 2);                  // Recursively subtract 2
}
```

### Explanation:
- If the number is `0`, it's even.
- If the number is `1`, it's odd (since 1 is not divisible by 2).
- Otherwise, subtract `2` from the number and check again.

This recursive solution works by reducing the number by `2` until it reaches `0` (even) or `1` (odd).

### Examples:

```js
console.log(isEven(4));  // true (even)
console.log(isEven(5));  // false (odd)
console.log(isEven(0));  // true (even)
console.log(isEven(-4)); // true (even, as negative even numbers are also even)
```

---

### Conclusion:
- The **bitwise AND approach** (`num & 1`) is the most efficient and concise way to check if a number is even in JavaScript, without using the modulo operator.
- The **recursive approach** provides an alternative, though less efficient, solution by repeatedly subtracting `2` from the number. This might be useful in scenarios where you want a more algorithmic approach.

Both methods are valid, but for performance and simplicity, the bitwise approach is generally preferred.