For **JavaScript / React interviews**, math-based coding questions are extremely common because they test:

```text
✅ Problem Solving
✅ Loops
✅ Recursion
✅ Time Complexity
✅ Edge Cases
✅ Math APIs
```

# 1. Reverse a Number

### Question

```text
Input: 12345
Output: 54321
```

```javascript
function reverseNumber(num) {
  let reversed = 0;

  while (num > 0) {
    reversed =
      reversed * 10 +
      (num % 10);

    num = Math.floor(num / 10);
  }

  return reversed;
}

console.log(reverseNumber(12345));
```

Output:

```text
54321
```

***

# 2. Palindrome Number

### Question

```text
121 → true
123 → false
```

```javascript
function isPalindrome(num) {
  let original = num;
  let reversed = 0;

  while (num > 0) {
    reversed =
      reversed * 10 +
      num % 10;

    num = Math.floor(num / 10);
  }

  return original === reversed;
}
```

***

# 3. Fibonacci Series

### Question

```text
0 1 1 2 3 5 8 13
```

```javascript
function fibonacci(n) {

  let result = [0, 1];

  for (let i = 2; i < n; i++) {

    result[i] =
      result[i - 1] +
      result[i - 2];
  }

  return result;
}

console.log(fibonacci(8));
```

***

# 4. Factorial

```javascript
function factorial(n) {

  let result = 1;

  for (let i = 2; i <= n; i++) {

    result *= i;

  }

  return result;
}

console.log(factorial(5));
```

Output:

```text
120
```

***

# 5. Prime Number

```javascript
function isPrime(num) {

  if (num <= 1)
    return false;

  for (
    let i = 2;
    i <= Math.sqrt(num);
    i++
  ) {

    if (num % i === 0) {
      return false;
    }
  }

  return true;
}

console.log(isPrime(13));
```

Output:

```text
true
```

***

# 6. Find Missing Number

### Question

```javascript
[1,2,3,5]
```

Output:

```text
4
```

```javascript
function findMissing(arr, n) {

  const expected =
    (n * (n + 1)) / 2;

  const actual =
    arr.reduce(
      (sum, num) =>
        sum + num,
      0
    );

  return expected - actual;
}

console.log(
  findMissing(
    [1, 2, 3, 5],
    5
  )
);
```

***

# 7. Armstrong Number

```javascript
function isArmstrong(num) {

  const digits =
    num.toString();

  const power =
    digits.length;

  const sum =
    digits
      .split("")
      .reduce(
        (acc, digit) =>
          acc +
          Math.pow(
            Number(digit),
            power
          ),
        0
      );

  return sum === num;
}

console.log(
  isArmstrong(153)
);
```

Output:

```text
true
```

***

# 8. Power Function

### Without Math.pow

```javascript
function power(
  base,
  exponent
) {

  let result = 1;

  for (
    let i = 0;
    i < exponent;
    i++
  ) {

    result *= base;
  }

  return result;
}
```

***

# 9. GCD (Greatest Common Divisor)

```javascript
function gcd(a, b) {

  while (b !== 0) {

    [a, b] = [
      b,
      a % b
    ];
  }

  return a;
}

console.log(
  gcd(48, 18)
);
```

Output:

```text
6
```

***

# 10. LCM

```javascript
function lcm(a, b) {

  return (
    (a * b) /
    gcd(a, b)
  );
}
```

***

# 11. Sum of Digits

```javascript
function sumDigits(num) {

  let sum = 0;

  while (num > 0) {

    sum += num % 10;

    num =
      Math.floor(
        num / 10
      );
  }

  return sum;
}

console.log(
  sumDigits(1234)
);
```

Output:

```text
10
```

***

# 12. Flatten and Sum Nested Array

```javascript
const arr =
  [1, [2, [3, 4]], 5];

function flattenSum(arr) {

  return arr
    .flat(Infinity)
    .reduce(
      (sum, item) =>
        sum + item,
      0
    );
}

console.log(
  flattenSum(arr)
);
```

Output:

```text
15
```

***

# Real Interview Scenarios

## EMI Calculation

```javascript
function emi(
  principal,
  rate,
  months
) {

  const r =
    rate / 12 / 100;

  return (
    (principal *
      r *
      Math.pow(
        1 + r,
        months
      )) /
    (Math.pow(
      1 + r,
      months
    ) - 1)
  );
}
```

***

## Discount Calculation

```javascript
function discount(
  price,
  percent
) {

  return (
    price -
    (price * percent) /
      100
  );
}
```

***

## Percentage

```javascript
function percentage(
  total,
  value
) {

  return (
    (value / total) * 100
  );
}
```

***

## Average

```javascript
function average(arr) {

  return (
    arr.reduce(
      (sum, n) =>
        sum + n,
      0
    ) / arr.length
  );
}
```

***

# Most Asked JavaScript Math Interview Questions

```text
✅ Prime Number

✅ Fibonacci

✅ Factorial

✅ Palindrome Number

✅ Armstrong Number

✅ Reverse Number

✅ Missing Number

✅ Sum of Digits

✅ GCD

✅ LCM

✅ Power Function

✅ Percentage

✅ Average

✅ EMI Calculation

✅ Date Difference Calculation
```

# Senior Frontend Interview Tip

For 10+ years React roles, interviewers often combine maths with arrays:

```text
Find Missing Number
Find Duplicate Number
Running Sum
Prefix Sum
Sliding Window
Two Sum
Maximum Subarray
Stock Buy & Sell
```

These are asked more frequently than pure mathematical formulas because they assess both JavaScript fundamentals and problem-solving skills.


For **Senior React/JavaScript interviews**, pure maths questions are less common than **math-based coding patterns**. Interview guidelines in your organisation emphasise identifying the right algorithms and data structures for typical problems. [\[Interview...Algorithms \| PDF\]](https://persistentsystems.sharepoint.com/sites/Pi/HR/Talent-Management/Documents/Interview%20Guidelines%20and%20Standards%20-%20Design%20Patterns%20and%20Algorithms.pdf?web=1)

# Top Math Coding Patterns

***

# 1. Prefix Sum Pattern

Used for:

```text
✅ Range Sum
✅ Running Total
✅ Subarray Problems
```

### Question

```javascript
[1,2,3,4]
```

Generate:

```javascript
[1,3,6,10]
```

### Solution

```javascript
function prefixSum(arr) {

  const result = [];

  let sum = 0;

  for (const num of arr) {

    sum += num;

    result.push(sum);
  }

  return result;
}
```

***

# 2. Sliding Window

Used for:

```text
✅ Maximum Sum Subarray
✅ Longest Substring
✅ Search Optimisation
```

### Question

Find maximum sum of size 3.

```javascript
[1,2,3,4,5]
```

### Solution

```javascript
function maxSum(
  arr,
  k
) {

  let windowSum = 0;

  for(let i=0;i<k;i++){
    windowSum += arr[i];
  }

  let max = windowSum;

  for(let i=k;i<arr.length;i++){

    windowSum += arr[i];
    windowSum -= arr[i-k];

    max = Math.max(
      max,
      windowSum
    );
  }

  return max;
}
```

***

# 3. Two Pointers

Used for:

```text
✅ Pair Sum
✅ Sorted Arrays
✅ Remove Duplicates
```

### Question

Find pair whose sum = 10.

```javascript
[1,2,3,4,6,7,8]
```

### Solution

```javascript
function pairSum(arr,target){

  let left = 0;
  let right = arr.length - 1;

  while(left < right){

    const sum =
      arr[left] + arr[right];

    if(sum === target){
      return [
        arr[left],
        arr[right]
      ];
    }

    sum < target
      ? left++
      : right--;
  }

  return null;
}
```

***

# 4. Frequency Counter

Used for:

```text
✅ Duplicates
✅ Character Count
✅ Anagrams
```

### Question

Count characters.

```javascript
function countChars(str){

  const map = {};

  for(const char of str){

    map[char] =
      (map[char] || 0) + 1;
  }

  return map;
}
```

***

# 5. Running Product

### Question

```javascript
[1,2,3,4]
```

Output:

```javascript
[1,2,6,24]
```

```javascript
function runningProduct(arr){

  let product = 1;

  return arr.map(num => {

    product *= num;

    return product;
  });
}
```

***

# React Example Using Math Functions

## Shopping Cart Total

Very common frontend scenario.

```jsx
function Cart() {

  const products = [
    { price: 100 },
    { price: 200 },
    { price: 300 }
  ];

  const total =
    products.reduce(
      (sum, item) =>
        sum + item.price,
      0
    );

  return (
    <h2>
      Total: ₹{total}
    </h2>
  );
}
```

Output:

```text
Total: ₹600
```

***

## Rating Average

```jsx
function Ratings() {

  const ratings =
    [4,5,3,5,4];

  const avg =
    ratings.reduce(
      (sum,rating)=>
        sum + rating,
      0
    ) / ratings.length;

  return (
    <h3>
      Average:
      {avg.toFixed(2)}
    </h3>
  );
}
```

***

## Progress Percentage

```jsx
function Progress() {

  const completed = 35;
  const total = 50;

  const percentage =
    (completed / total) * 100;

  return (
    <div>
      {percentage.toFixed(0)}%
    </div>
  );
}
```

***

# Top Math Interview Questions for React Developers

### Easy

```text
✅ Reverse Number
✅ Sum Of Digits
✅ Palindrome Number
✅ Factorial
✅ Fibonacci
✅ Prime Number
```

***

### Medium

```text
✅ Missing Number
✅ GCD
✅ LCM
✅ Armstrong Number
✅ Running Sum
✅ Prefix Sum
✅ Moving Average
```

***

### Real Frontend Scenarios

```text
✅ Shopping Cart Total

✅ Discount Calculation

✅ Tax Calculation

✅ EMI Calculation

✅ Average Ratings

✅ Progress Percentage

✅ Pagination Logic

✅ Countdown Timer

✅ Date Difference

✅ Meeting Duration
```

***

### DSA Patterns Frequently Asked in React Interviews

```text
✅ Prefix Sum
✅ Sliding Window
✅ Two Pointers
✅ Frequency Counter
✅ Hash Map
✅ Greedy
✅ Sorting
✅ Binary Search
✅ Recursion
✅ Dynamic Programming (Senior Levels)
```

# Senior React Interview Tip

For 8–12+ years React roles, expect questions like:

```javascript
// Running Sum
[1,2,3,4]
// Output
[1,3,6,10]

// Max Subarray Sum
// Two Sum
// Stock Buy Sell
// Product Except Self
// Group By Month
// Calculate Cart Total
```

These are much more common than pure mathematical formulas because they test **JavaScript, arrays, algorithms, and problem-solving together**. [\[Interview...Algorithms \| PDF\]](https://persistentsystems.sharepoint.com/sites/Pi/HR/Talent-Management/Documents/Interview%20Guidelines%20and%20Standards%20-%20Design%20Patterns%20and%20Algorithms.pdf?web=1)
