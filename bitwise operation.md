**0/ Check if a number is odd**
`X & 1 == 1`

- The least significant bit determines if a number is odd. This works because odd numbers always have their last bit as 1, while even numbers have it as 0.
- Example: For `X = 5` (`101` in binary), `5 & 1 = 1`, so it’s odd.

**1/ Set the kth bit**
`X = X | (1 << k)`

- Use OR to ensure the kth bit is set to 1 without changing any other bits.
- Example: For `X = 5` (`101`) and `k = 1`, `(1 << 1)` creates `10` in binary. OR-ing `101 | 10` gives `111` (`7` in decimal).

**2/ Flip the kth bit**
`X = X ^ (1 << k)`

- XOR toggles the kth bit. If it’s 1, it becomes 0; if it’s 0, it becomes 1.
- Example: For `X = 5` (`101`) and `k = 1`, `(1 << 1)` creates `10`. XOR-ing `101 ^ 10` gives `111` (`7` in decimal).

**3/ Count the number of set bits**
Use `__builtin_popcount(X)` (C++) or `bin(X).count('1')` (Python).

- Efficiently count 1s in the binary representation of a number.
- Example: For `X = 13` (`1101`), the result is 3, as there are three 1s.

**4/ Check if the kth bit is set**
`(X >> k) & 1 == 1`

- Shift the binary representation of `X` to the right by `k` places. Use AND to check if the last bit is 1.
- Example: For `X = 13` (`1101`) and `k = 2`, shifting gives `11` (`3` in decimal), and `3 & 1 = 1`, so the 2nd bit is set.

**5/ Check if a number is a power of 2**
`X & (X - 1) == 0`

- Numbers that are powers of 2 have exactly one bit set. Subtracting 1 flips all bits after the set bit, making the AND operation zero.
- Example: For `X = 8` (`1000`), `X - 1 = 7` (`0111`), and `8 & 7 = 0`.

**6/ Extract the lowest set bit**
`X & -X`

- Isolates the least significant bit that’s set to 1.
- Example: For `X = 10` (`1010`), `X & -X = 2` (`0010`), as the lowest set bit is in the 2nd position.

**7/ Swap two numbers without a temporary variable**

A = A ^ B
B = A ^ B
A = A ^ B

- XOR reverses itself, effectively swapping values.
- Example: Let `A = 3` and `B = 5`. After performing these steps, `A = 5` and `B = 3`.

**8 / Super handy addition trick**
`A + B = (A | B) + (A & B)`

- OR counts each bit once, and AND adds overlapping bits twice.
- Example: For `A = 6` (`110`) and `B = 3` (`011`), `A | B = 7` and `A & B = 2`, so `A + B = 9`.

**9/ Unset the kth bit**
`X = X & ~(1 << k)`

- Combine AND with the negation of a left shift to clear the kth bit.
- Example: For `X = 13` (`1101`) and `k = 2`, `(1 << 2)` gives `100`. Negating it gives `011`. AND-ing `1101 & 011` gives `9` (`1001`).

Here is how these bitwise tricks translate directly to **JavaScript**, along with critical JS-specific nuances (like Bitwise 32-bit conversion, BigInt support, and operator precedence rules).

---

### JavaScript Bitwise Quirks to Keep in Mind

1. **32-Bit Signed Integers:** In JS, bitwise operations (`&`, `|`, `^`, `~`, `<<`, `>>`) implicitly convert numbers from 64-bit floats to **32-bit signed integers**.
2. **Operator Precedence:** Bitwise operators (`&`, `|`, `^`) have **lower precedence** than comparison operators (`===`, `!==`). Always use parentheses around bitwise checks!
3. **Unsigned Shift (`>>>`):** JS includes a zero-fill right shift (`>>>`) which treats numbers as unsigned 32-bit integers.

---

### JavaScript Bitwise Cheatsheet

```javascript
// 0/ Check if a number is odd
const isOdd = (X) => (X & 1) !== 0;
console.log(isOdd(5)); // true
console.log(isOdd(4)); // false

// 1/ Set the kth bit (0-indexed)
const setKthBit = (X, k) => X | (1 << k);
console.log(setKthBit(5, 1)); // 7  (101 | 010 = 111)

// 2/ Flip / Toggle the kth bit
const flipKthBit = (X, k) => X ^ (1 << k);
console.log(flipKthBit(5, 1)); // 7  (101 ^ 010 = 111)

// 3/ Count set bits (Population Count)
// Method A: Loop clearing lowest set bit (Brian Kernighan)
function countSetBits(X) {
  let count = 0;
  while (X !== 0) {
    X &= X - 1;
    count++;
  }
  return count;
}

// Method B: Modern JS BigInt trick (clean & concise)
const countSetBitsBigInt = (X) =>
  BigInt(X).toString(2).replaceAll("0", "").length;

console.log(countSetBits(13)); // 3 (1101 -> three 1s)
console.log(countSetBitsBigInt(13)); // 3

// 4/ Check if the kth bit is set
const isKthBitSet = (X, k) => ((X >> k) & 1) === 1;
// Alternative: (X & (1 << k)) !== 0
console.log(isKthBitSet(13, 2)); // true  (1101, 2nd bit from right is 1)

// 5/ Check if a number is a power of 2
// Must check X > 0 because 0 & -1 === 0 would give false positive
const isPowerOfTwo = (X) => X > 0 && (X & (X - 1)) === 0;
console.log(isPowerOfTwo(8)); // true
console.log(isPowerOfTwo(6)); // false

// 6/ Extract the lowest set bit (Isolate LSB)
const lowestSetBit = (X) => X & -X;
console.log(lowestSetBit(10)); // 2  (1010 -> lowest 1 is at bit position 1, val = 2)

// 7/ Swap two numbers in-place (Array destructuring or XOR)
let A = 3,
  B = 5;

// Modern JS idiomatic way (Array destructuring):
[A, B] = [B, A];

// Bitwise XOR way (Classic trick):
// A ^= B; B ^= A; A ^= B;
console.log(A, B); // 5, 3

// 8/ Addition trick
const addBits = (A, B) => (A | B) + (A & B);
console.log(addBits(6, 3)); // 9

// 9/ Unset / Clear the kth bit
const unsetKthBit = (X, k) => X & ~(1 << k);
console.log(unsetKthBit(13, 2)); // 9  (1101 & ~0100 = 1001)
```

---

### Bonus JS Bitwise Tricks

#### Fast Double Bitwise NOT (`~~`) for Truncating Numbers

Used as a fast alternative to `Math.floor()` for positive numbers or `Math.trunc()`:

```javascript
console.log(~~4.9); // 4
console.log(~~-4.9); // -4
```

#### Fast In-Place Floor Division by 2

```javascript
const half = (X) => X >> 1;
console.log(half(9)); // 4
```

#### Toggle Case of ASCII Characters

```javascript
const toggleCase = (char) => String.fromCharCode(char.charCodeAt(0) ^ 32);

console.log(toggleCase("a")); // 'A'
console.log(toggleCase("B")); // 'b'
```
