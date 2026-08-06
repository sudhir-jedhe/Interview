### Swapping Two Numbers Without Using a Temporary Variable:

There are different ways to swap two numbers without using a temporary variable. Let's break down the methods you've shown with explanations:

---

### **Method 1: Using Arithmetic Operations (Addition and Subtraction)**

```javascript
function swapNumbers(a, b){
    console.log('Before swapping a = '+a+' and b = '+b);
    
    // Step 1: b = b - a
    b = b - a;  // Subtract a from b, so b becomes b - a

    // Step 2: a = a + b
    a = a + b;  // Add the new value of b to a, so a becomes a + (b - a) which is the original value of b

    // Step 3: b = a - b
    b = a - b;  // Now subtract the new value of b from a to get the original value of a, and assign it to b

    console.log('After swapping a = '+a+' and b = '+b);
}

swapNumbers(10, 15);
```

**Explanation**:
- **Step 1**: We subtract `a` from `b`, so `b = b - a`.
- **Step 2**: Then, we add the new value of `b` to `a`, making `a` hold the value of the original `b`.
- **Step 3**: Finally, we subtract the new value of `b` from `a`, giving us the original value of `a` and assign it to `b`.

**Output**:
```
Before swapping a = 10 and b = 15
After swapping a = 15 and b = 10
```

---

### **Method 2: Using Bitwise XOR**

```javascript
function swapNumbers(a, b){
    console.log('Before swapping a = '+a+' and b = '+b);

    // Step 1: a = a ^ b
    a = a ^ b;  // XOR a and b, the result is stored in a

    // Step 2: b = a ^ b
    b = a ^ b;  // XOR the new value of a and the original value of b, the result is the original value of a

    // Step 3: a = a ^ b
    a = a ^ b;  // XOR the new values of a and b, the result is the original value of b

    console.log('After swapping a = '+a+' and b = '+b);
}

swapNumbers(10, 15);
```

**Explanation**:
- XOR works by comparing each bit of `a` and `b`:
  - If the bits are different, the result is `1`.
  - If the bits are the same, the result is `0`.
  
  In the case of XORing the numbers:
  
  - **Step 1**: XOR `a` and `b` and store the result in `a`. Now `a` contains a combination of both `a` and `b`.
  - **Step 2**: XOR the new value of `a` with the original `b` to extract the original `a` and store it in `b`.
  - **Step 3**: Finally, XOR the new values of `a` and `b` to extract the original `b` and store it in `a`.

**Output**:
```
Before swapping a = 10 and b = 15
After swapping a = 15 and b = 10
```

---

### **Method 3: Using Array Destructuring (ES6)**

```javascript
function swapNumbers(a, b){
    console.log('Before swapping a = '+a+' and b = '+b);
    
    // Swap using array destructuring
    [a, b] = [b, a];
    
    console.log('After swapping a = '+a+' and b = '+b);
}

swapNumbers(10, 15);
```

**Explanation**:
- This method leverages **ES6 destructuring** syntax, which allows swapping two variables in a single line.
- The expression `[a, b] = [b, a]` creates a new array with the values of `b` and `a` and then assigns them back to `a` and `b` respectively.

**Output**:
```
Before swapping a = 10 and b = 15
After swapping a = 15 and b = 10
```

---

### Summary of Methods:

1. **Arithmetic Operations** (Addition/Subtraction) – Does not require extra space and works with numbers.
2. **Bitwise XOR** – Efficient for swapping but a little harder to understand for beginners. It works directly with binary operations.
3. **Array Destructuring** – Simple and clean syntax for swapping, especially in JavaScript.

All three methods achieve the same result: swapping the values of `a` and `b` without using a temporary variable.

