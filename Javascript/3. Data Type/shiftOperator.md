### Explanation of Bitwise Operations

Bitwise operations directly manipulate the individual bits of a number, and they work on the binary representation of integers. Let's walk through each operation you've mentioned and the associated code examples.

### **1. Left Shift (`<<`)**

The left shift operator (`<<`) shifts all the bits of a number to the left by a specified number of positions. The left shift operation essentially multiplies the number by 2 for each shift.

```js
let x = 7; // Binary: 00000000000000000000000000000111 (7)
x <<= 2; // Left shift by 2 positions
console.log(x); // Output: 28 (Binary: 00000000000000000000000000011100)
```

Explanation:

- The binary representation of `7` is `00000000000000000000000000000111`.
- Shifting it left by 2 positions results in `00000000000000000000000000011100`, which equals `28` in decimal.

---

### **2. Left Shift with Negative Number**

Left shifting a negative number behaves in a similar way, but since the most significant bit represents the sign (for signed integers), the result can be a large negative number due to the sign extension.

```js
let x = 1; // Binary: 00000000000000000000000000000001
x <<= -1; // Left shift by -1 positions
console.log(x); // Output: -2147483648
```

Explanation:

- In JavaScript, numbers are represented as 32-bit signed integers, and a left shift of `-1` causes the bits to shift in a way that results in a large negative value, i.e., `-2147483648` due to the sign bit becoming the most significant bit.

---

### **3. Left Shift with Variable Shift Amount**

The number of positions to shift can be dynamically specified.

```js
let a = 10; // Binary: 00000000000000000000000000001010
let b = 5; // Binary: 00000000000000000000000000000101
a = a << b; // Shift `a` by `b` positions
console.log(a); // Output: 320
```

Explanation:

- Left shifting `10` by `5` positions results in `00000000000000000000000101000000`, which is `320` in decimal.

---

### **4. Right Shift (`>>>` - Zero-fill Right Shift)**

The right shift operator (`>>>`) shifts the bits of a number to the right, filling the empty positions with zeros. This operator is different from the signed right shift (`>>`), as `>>>` always fills with `0` regardless of the sign of the number.

#### **For Non-Negative Numbers:**

```js
let a = 12; // Binary: 00000000000000000000000000001100
let b = 2; // Shift by 2 positions
console.log(a >>> b); // Output: 3 (Binary: 00000000000000000000000000000011)
```

Explanation:

- Shifting `12` (`00000000000000000000000000001100`) to the right by 2 positions results in `3` (`00000000000000000000000000000011`).

#### **For Negative Numbers:**

```js
let a = -10; // Binary: 11111111111111111111111111110110 (signed 32-bit)
let b = 3; // Shift by 3 positions
console.log(a >>> b); // Output: 536870909
```

Explanation:

- Right shifting `-10` results in `536870909`, since `>>>` does not preserve the sign bit, and instead, it fills with `0` on the left.

---

### **5. Bitwise AND Assignment (`&=`)**

The `&=` operator performs a bitwise AND operation and assigns the result to the left operand. The `&` operator compares each bit of two numbers and returns `1` if both bits are `1`, otherwise it returns `0`.

```js
let x = 7; // Binary: 00000000000000000000000000000111
x &= 3; // Binary: 00000000000000000000000000000011
console.log(x); // Output: 3
```

Explanation:

- The bitwise AND of `7` (`00000111`) and `3` (`00000011`) results in `3` (`00000011`).

---

### **6. Bitwise AND (`&`)**

The bitwise AND operator performs the operation between two numbers' bits.

```js
let a = 5; // Binary: 00000000000000000000000000000101
let b = 3; // Binary: 00000000000000000000000000000011
console.log(a & b); // Output: 1 (Binary: 00000001)
```

Explanation:

- The bitwise AND of `5` (`00000101`) and `3` (`00000011`) results in `1` (`00000001`), because only the least significant bit is `1` in both numbers.

---

### **7. Check Odd or Even Using Bitwise AND (`&`)**

You can use the bitwise AND operator to check if a number is odd or even. The least significant bit of odd numbers is `1`, while it is `0` for even numbers.

```js
function checkOddOrEven(n) {
  if (n & (1 == 1)) {
    return "Number is odd";
  }
  return "Number is even";
}

console.log(checkOddOrEven(123)); // Output: Number is odd
console.log(checkOddOrEven(246)); // Output: Number is even
```

Explanation:

- `123 & 1` results in `1`, so the function returns "Number is odd".
- `246 & 1` results in `0`, so the function returns "Number is even".

---

### **8. Bitwise OR (`|`)**

The bitwise OR operator compares each bit of two numbers and returns `1` if at least one of the bits is `1`. Otherwise, it returns `0`.

```js
let a = 3; // Binary: 00000000000000000000000000000011
let b = 5; // Binary: 00000000000000000000000000000101
console.log(a | b); // Output: 7 (Binary: 00000000000000000000000000000111)
```

Explanation:

- The bitwise OR of `3` (`00000011`) and `5` (`00000101`) results in `7` (`00000111`).

---

### **9. Bitwise OR with Larger Numbers**

```js
let a = 24; // Binary: 00000000000000000000000000011000
let b = 45; // Binary: 00000000000000000000000000101101
console.log(a | b); // Output: 61 (Binary: 00000000000000000000000000111101)
```

Explanation:

- The bitwise OR of `24` (`00011000`) and `45` (`00101101`) results in `61` (`00111101`).

---

### **Summary of Bitwise Operators:**

- **AND (`&`)**: Sets each bit to `1` if both bits are `1`.
- **OR (`|`)**: Sets each bit to `1` if one of the bits is `1`.
- **XOR (`^`)**: Sets each bit to `1` if only one of the bits is `1`.
- **NOT (`~`)**: Inverts all the bits of the number.
- **Left Shift (`<<`)**: Shifts bits to the left, filling with `0`s.
- **Right Shift (`>>`)**: Shifts bits to the right, preserving the sign.
- **Zero-fill Right Shift (`>>>`)**: Shifts bits to the right, filling with `0`s, regardless of the sign.

These operations are particularly useful in lower-level programming, cryptography, and performance-critical code due to their efficiency.
