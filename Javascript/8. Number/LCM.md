### Explanation of LCM and GCD Implementation

The provided code consists of multiple implementations of LCM (Least Common Multiple) calculation using different approaches:

---

### **1. Using GCD to Calculate LCM**

**Code:**
```javascript
function gcd(a, b) {
  for (let temp = b; b !== 0; ) {
    b = a % b;
    a = temp;
    temp = b;
  }
  return a;
}

function lcmFunction(a, b) {
  const gcdValue = gcd(a, b);
  return (a * b) / gcdValue;
}

let num1 = 12;
let num2 = 18;
let lcm = lcmFunction(num1, num2);
console.log("LCM of given numbers is :", lcm);
```

**Explanation:**
- The `gcd` function calculates the greatest common divisor using the Euclidean algorithm.
- `lcmFunction` uses the formula:
  \[
  \text{LCM}(a, b) = \frac{a \times b}{\text{GCD}(a, b)}
  \]
- Example:
  - \( GCD(12, 18) = 6 \)
  - \( LCM(12, 18) = \frac{12 \times 18}{6} = 36 \)

---

### **2. Brute Force LCM Calculation**

**Code:**
```javascript
function findLCM(a, b) {
  let lar = Math.max(a, b);
  let small = Math.min(a, b);
  for (i = lar; ; i += lar) {
    if (i % small == 0) return i;
  }
}

let a = 5, b = 7;
console.log("LCM of " + a + " and " + b + " is " + findLCM(a, b));
```

**Explanation:**
- The function starts with the larger of the two numbers (`Math.max(a, b)`).
- It increments the larger number (`lar`) until it finds a multiple of the smaller number (`small`).
- This ensures that the first number divisible by both `a` and `b` is the LCM.

---

### **3. Generalized Brute Force Approach**

**Code:**
```javascript
function lcmFunction(a, b) { 
	let larger = Math.max(a, b); 
	let smaller = Math.min(a, b); 
	for (let i = larger; ; i += larger) { 
		if (i % smaller === 0) { 
			return i; 
		} 
	} 
} 

let num1 = 12; 
let num2 = 18; 
let result = lcmFunction(num1, num2); 
console.log(`LCM of ${num1} and ${num2} is ${result}`);
```

**Explanation:**
- Similar to the second approach.
- Uses a `for` loop to find the smallest common multiple of `larger` and `smaller`.

---

### **Comparison of Approaches**

| **Method**                | **Advantages**                | **Disadvantages**                     |
|---------------------------|-------------------------------|----------------------------------------|
| Using GCD Formula         | Efficient and mathematically elegant. | Requires implementation of GCD logic. |
| Brute Force Starting from Max | Simple logic, no GCD required.       | Can be slow for large numbers.         |

---

### **Output**
For \( \text{num1} = 12 \) and \( \text{num2} = 18 \):
```
LCM of given numbers is : 36
LCM of 5 and 7 is 35
LCM of 12 and 18 is 36
```