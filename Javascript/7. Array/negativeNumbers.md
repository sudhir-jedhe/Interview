Here are the three most common ways to find negative numbers from an array in JavaScript, depending on what you need:

---

### 1. Get ALL negative numbers (`filter`)

Use `filter()` if you want an array containing every negative number.

```javascript
const numbers = [10, -5, 3, -12, 8, -1, 0];

// Filters out numbers less than 0
const negativeNumbers = numbers.filter(num => num < 0);

console.log(negativeNumbers); // Output: [-5, -12, -1]

```

---

### 2. Find the FIRST negative number (`find`)

Use `find()` if you only need the very first negative value in the array.

```javascript
const numbers = [10, -5, 3, -12, 8, -1, 0];

// Returns the first number less than 0
const firstNegative = numbers.find(num => num < 0);

console.log(firstNegative); // Output: -5

```

---

### 3. Get INDEX (position) of the first negative number (`findIndex`)

Use `findIndex()` if you need to know where the first negative number is located.

```javascript
const numbers = [10, -5, 3, -12, 8, -1, 0];

// Returns index of the first negative number (0-based)
const index = numbers.findIndex(num => num < 0);

console.log(index); // Output: 1 (because -5 is at index 1)

```

---

### Summary Checklist

* **`numbers.filter(n => n < 0)`** $\rightarrow$ Returns array of **all** negative numbers.
* **`numbers.find(n => n < 0)`** $\rightarrow$ Returns **first** negative number (or `undefined` if none exist).
* **`numbers.some(n => n < 0)`** $\rightarrow$ Returns `true` or `false` if **at least one** negative number exists.
