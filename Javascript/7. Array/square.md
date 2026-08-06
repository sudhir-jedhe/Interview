```javascript
Array.prototype.square = function () {
  return this.map((number) => number ** 2);
};

const numbers = [1, 2, 3, 4, 5];

const squaredNumbers = numbers.square();

console.log(squaredNumbers); // [1, 4, 9, 16, 25]

```


### 1. **`cube`**: Cube each number in the array.
```javascript
Array.prototype.cube = function () {
  return this.map((number) => number ** 3);
};

const cubedNumbers = numbers.cube();
console.log(cubedNumbers); // [1, 8, 27, 64, 125]
```

### 2. **`double`**: Double each number in the array.
```javascript
Array.prototype.double = function () {
  return this.map((number) => number * 2);
};

const doubledNumbers = numbers.double();
console.log(doubledNumbers); // [2, 4, 6, 8, 10]
```

### 3. **`half`**: Divide each number in the array by 2.
```javascript
Array.prototype.half = function () {
  return this.map((number) => number / 2);
};

const halvedNumbers = numbers.half();
console.log(halvedNumbers); // [0.5, 1, 1.5, 2, 2.5]
```

### 4. **`sum`**: Calculate the sum of all elements in the array.
```javascript
Array.prototype.sum = function () {
  return this.reduce((acc, curr) => acc + curr, 0);
};

const totalSum = numbers.sum();
console.log(totalSum); // 15
```

### 5. **`average`**: Calculate the average of the array elements.
```javascript
Array.prototype.average = function () {
  return this.sum() / this.length;
};

const average = numbers.average();
console.log(average); // 3
```

### 6. **`min`**: Find the minimum value in the array.
```javascript
Array.prototype.min = function () {
  return Math.min(...this);
};

const minNumber = numbers.min();
console.log(minNumber); // 1
```

### 7. **`max`**: Find the maximum value in the array.
```javascript
Array.prototype.max = function () {
  return Math.max(...this);
};

const maxNumber = numbers.max();
console.log(maxNumber); // 5
```

### 8. **`product`**: Multiply all elements in the array together.
```javascript
Array.prototype.product = function () {
  return this.reduce((acc, curr) => acc * curr, 1);
};

const productOfNumbers = numbers.product();
console.log(productOfNumbers); // 120
```

### 9. **`round`**: Round each number to the nearest integer.
```javascript
Array.prototype.round = function () {
  return this.map((number) => Math.round(number));
};

const roundedNumbers = [1.2, 2.5, 3.7, 4.4, 5.9];
const rounded = roundedNumbers.round();
console.log(rounded); // [1, 2, 4, 4, 6]
```

### 10. **`sqrt`**: Find the square root of each number.
```javascript
Array.prototype.sqrt = function () {
  return this.map((number) => Math.sqrt(number));
};

const sqrtNumbers = numbers.sqrt();
console.log(sqrtNumbers); // [1, 1.414, 1.732, 2, 2.236]
```

### 11. **`log`**: Find the natural logarithm (base `e`) of each number.
```javascript
Array.prototype.log = function () {
  return this.map((number) => Math.log(number));
};

const logNumbers = numbers.log();
console.log(logNumbers); // [0, 0.693, 1.099, 1.386, 1.609]
```

### 12. **`exp`**: Exponentiate each number to `e^x`.
```javascript
Array.prototype.exp = function () {
  return this.map((number) => Math.exp(number));
};

const expNumbers = numbers.exp();
console.log(expNumbers); // [2.718, 7.389, 20.086, 54.598, 148.413]
```

### 13. **`invert`**: Invert (reciprocal) each number in the array.
```javascript
Array.prototype.invert = function () {
  return this.map((number) => number === 0 ? 0 : 1 / number);
};

const invertedNumbers = numbers.invert();
console.log(invertedNumbers); // [1, 0.5, 0.333, 0.25, 0.2]
```

### 14. **`power`**: Raise each number to a given exponent.
```javascript
Array.prototype.power = function (exp) {
  return this.map((number) => number ** exp);
};

const poweredNumbers = numbers.power(3); // Cube each number
console.log(poweredNumbers); // [1, 8, 27, 64, 125]
```

### 15. **`isPrime`**: Check if each number is a prime number.
```javascript
Array.prototype.isPrime = function () {
  const isPrimeNumber = (n) => {
    if (n <= 1) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return false;
    }
    return true;
  };

  return this.map(isPrimeNumber);
};

const primeNumbers = [2, 3, 4, 5, 6];
const primes = primeNumbers.isPrime();
console.log(primes); // [true, true, false, true, false]
```

---

### **Example Using Multiple Math Methods**:
```javascript
const numbers = [1, 2, 3, 4, 5];

console.log(numbers.square());  // [1, 4, 9, 16, 25]
console.log(numbers.double());  // [2, 4, 6, 8, 10]
console.log(numbers.sum());     // 15
console.log(numbers.product()); // 120
console.log(numbers.average()); // 3
console.log(numbers.min());     // 1
console.log(numbers.max());     // 5
```

These are just a few of the many mathematical operations you can implement for arrays. You can always extend them based on your needs or combine different operations for more complex tasks!