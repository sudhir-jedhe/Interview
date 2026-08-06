### Explanation of Each Code Snippet

#### 1. **Using Array with `.filter` to Find Factors**
```javascript
let fact = (n) =>
    [...Array(n + 1).keys()]
    .filter((i) => n % i === 0);
console.log(fact(12)); // Output: [1, 2, 3, 4, 6, 12]
```
- **Logic**:
  - `[...Array(n + 1).keys()]` generates an array `[0, 1, 2, ..., n]`.
  - `.filter((i) => n % i === 0)` filters the numbers that divide `n` without a remainder.
- **Pros**:
  - Concise and functional approach.
- **Cons**:
  - Includes `0` in the array, which is filtered out automatically by the condition.

---

#### 2. **Using a `for` Loop**
```javascript
let n = 12;
let i = 1;
for (i = 1; i < n; i++) {
    if (n % i == 0) {
        console.log(i);
    }
}
console.log(n);
```
- **Logic**:
  - Iterates from `1` to `n-1`.
  - If `n % i === 0`, `i` is printed.
  - Finally, `n` is printed as it is a factor of itself.
- **Pros**:
  - Simple and easy to follow.
- **Cons**:
  - The loop can be optimized to iterate only up to `Math.sqrt(n)`.

---

#### 3. **Using `.reduce`**
```javascript
let n = 12;
[...Array(n + 1).keys()].reduce((_, i) => {
    if (i !== 0 && n % i === 0) {
        console.log(i);
    }
});
```
- **Logic**:
  - Similar to `.filter` but uses `.reduce` to iterate over the array.
  - The callback checks if `i !== 0` and `n % i === 0`.
- **Pros**:
  - Flexible approach using `.reduce`.
- **Cons**:
  - Less intuitive than `.filter` for this specific use case.

---

#### 4. **Using `.map` and `.filter`**
```javascript
let n = 12;
let fact = [...Array(n + 1).keys()]
    .map((i) => {
        if (n % i === 0) {
            return i;
        }
    })
    .filter((i) => i !== undefined);
console.log(fact); // Output: [1, 2, 3, 4, 6, 12]
```
- **Logic**:
  - `.map` applies a transformation where it returns the factor `i` or `undefined` if `i` is not a factor.
  - `.filter` removes `undefined` values.
- **Pros**:
  - Uses chaining for a functional approach.
- **Cons**:
  - Unnecessary overhead of creating `undefined` values and filtering them.

---

#### 5. **Using a `while` Loop**
```javascript
let n = 12;
let i = 1;
let factors = [];

while (i <= n) {
    if (n % i === 0) {
        factors.push(i);
    }
    i++;
}

console.log(factors); // Output: [1, 2, 3, 4, 6, 12]
```
- **Logic**:
  - Initializes `i = 1` and iterates until `i <= n`.
  - If `n % i === 0`, adds `i` to the `factors` array.
- **Pros**:
  - Simple and explicit.
- **Cons**:
  - Iterates unnecessarily beyond `Math.sqrt(n)`.

---

### Optimized Approach: Iterating up to `Math.sqrt(n)`
To improve efficiency, we can iterate only up to the square root of `n`, as every factor has a corresponding pair:
```javascript
let n = 12;
let factors = [];

for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
        factors.push(i);
        if (i !== n / i) {
            factors.push(n / i);
        }
    }
}

console.log(factors.sort((a, b) => a - b)); // Output: [1, 2, 3, 4, 6, 12]
```
- **Logic**:
  - Checks up to `Math.sqrt(n)`.
  - Adds both `i` and `n / i` if they are factors.
- **Pros**:
  - Optimized for large numbers.
  - Avoids unnecessary iterations.
- **Cons**:
  - Slightly more complex logic.

--- 
Each method has its own use case, but for efficiency and clarity, the optimized approach is recommended.