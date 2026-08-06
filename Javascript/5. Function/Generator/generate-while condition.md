// Almost every generator function needs a termination condition. Instead of writing the same code over and over again, we can easily create a generator function that takes a predicate function as an argument and keeps producing new values as long as the condition is met.

// Given a condition, we can initialize the current value using a provided seed value. Then, using a while loop we can iterate as long as the predicate function called with the current val returns true.

// Inside the loop, we can use yield to return the current val and optionally receive a new seed value, nextSeed. Finally, we can use the next function to calculate the next value from the current val and the nextSeed.
This is a highly reusable generator function implementation that combines the flexibility of custom iteration logic with a termination condition. Below, I'll provide an explanation of how the `generateWhile` function works, its components, and some additional examples to demonstrate its versatility.

---

### **How `generateWhile` Works**

1. **Arguments:**
   - `seed`: The initial value for the generator.
   - `predicate`: A function that evaluates whether the generator should continue. It takes the current value as input and returns a boolean.
   - `next`: A function that determines the next value in the sequence. It takes the current value and an optional seed as inputs.

2. **Process:**
   - The generator starts with the `seed` value.
   - It repeatedly evaluates the `predicate` function to check if iteration should continue.
   - If the condition is met:
     - It yields the current value (`val`).
     - Optionally accepts a new seed (`nextSeed`) through the `next()` method.
     - Computes the next value using the `next` function.
   - If the condition is not met, the generator stops.

3. **Return:**
   - The generator terminates once the `predicate` function returns `false`.

---

### **Example Usage**

#### Basic Example
```javascript
const generateWhile = function* (seed, predicate, next) {
    let val = seed;
    let nextSeed = null;
    while (predicate(val)) {
        nextSeed = yield val; // Yield current value and capture new seed if provided
        val = next(val, nextSeed); // Compute next value
    }
    return val;
};

// Example: Generate numbers from 1 to 5
console.log([...generateWhile(1, v => v <= 5, v => v + 1)]); // [1, 2, 3, 4, 5]
```

---

### **Additional Examples**

#### Example 1: Fibonacci Sequence (Limited by Value)
Generate Fibonacci numbers up to a maximum value.

```javascript
const fibonacciGenerator = generateWhile(
    [0, 1], // Seed
    ([a, b]) => a <= 100, // Predicate: Stop when a exceeds 100
    ([a, b]) => [b, a + b] // Next function: Compute the next pair
);

console.log([...fibonacciGenerator].map(([a]) => a)); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
```

---

#### Example 2: Multiplication Table
Generate multiples of a number up to a certain limit.

```javascript
const multiplicationTable = generateWhile(
    1, // Seed
    v => v <= 50, // Predicate: Stop at 50
    (v, factor = 2) => v + factor // Next function: Increment by factor
);

console.log([...multiplicationTable]); // [1, 3, 5, 7, 9, ..., 49]
```

---

#### Example 3: Countdown with Dynamic Steps
Count down from a number, where the step can change dynamically.

```javascript
const countdown = generateWhile(
    10, // Seed
    v => v > 0, // Predicate: Continue until 0
    (v, step = 1) => v - step // Next function: Subtract the step
);

const iterator = countdown;
console.log(iterator.next().value); // 10
console.log(iterator.next(2).value); // 8 (step 2)
console.log(iterator.next(3).value); // 5 (step 3)
console.log([...iterator]); // [4, 3, 2, 1]
```

---

### **Advantages of `generateWhile`**
- **Reusability:** The generator can handle various iteration scenarios by changing the `predicate` and `next` logic.
- **Flexibility:** Supports dynamic behavior via `yield` and `next()`.
- **Custom Termination:** Controlled by the `predicate` function, allowing for complex stopping conditions.

This generator design is versatile, making it a powerful tool for any iterative logic in JavaScript.