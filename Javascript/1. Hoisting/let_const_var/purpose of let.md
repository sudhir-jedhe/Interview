The `let` statement in JavaScript provides **block scope**, meaning that variables declared with `let` are only accessible within the block, statement, or expression where they are defined. This is different from `var`, which has **function scope** or **global scope**, depending on where it's declared.

Here's an explanation of your example:

### **Code Explanation**
```javascript
let counter = 30; // Declares a block-scoped variable `counter` with a value of 30.

if (counter === 30) {
  let counter = 31; // Declares a new block-scoped variable `counter` inside the if block.
  console.log(counter); // Output: 31
}

console.log(counter); // Output: 30 (The `counter` inside the if block is not accessible here.)
```

---

### **Key Concepts Illustrated**
1. **Block Scope**:
   - The `counter` declared inside the `if` block (`let counter = 31;`) is a separate variable.
   - This variable is only accessible within the `if` block.
   - Outside the `if` block, the original `counter` (`let counter = 30;`) remains unaffected.

2. **Separation of Scopes**:
   - The `counter` inside the `if` block shadows the outer `counter` but does not overwrite it.
   - Once the execution leaves the block, the inner `counter` is destroyed.

3. **Comparison to `var`**:
   If `var` had been used instead of `let`, the `counter` inside the `if` block would have been function-scoped and would overwrite the outer `counter`:
   ```javascript
   var counter = 30;
   if (counter === 30) {
     var counter = 31; // Same variable, re-declared and reassigned.
     console.log(counter); // Output: 31
   }
   console.log(counter); // Output: 31 (The `counter` in the if block overwrites the outer `counter`.)
   ```

---

### **Advantages of `let` in this Context**
1. **Prevents Variable Pollution**:
   - Variables declared with `let` are limited to their specific blocks, reducing the chance of accidental overwrites or conflicts.
   
2. **Encourages Clearer Code**:
   - Each block has its own independent variables, making the code easier to understand and debug.

3. **Improved Maintainability**:
   - Helps avoid unintended side effects, especially in larger codebases where functions and blocks may interact in complex ways.

---

### **Practical Use Cases**
1. **Avoiding Variable Conflicts**:
   ```javascript
   let user = "Alice";
   function greet() {
     let user = "Bob"; // A different variable, only for this function.
     console.log(`Hello, ${user}`); // Output: Hello, Bob
   }
   greet();
   console.log(user); // Output: Alice
   ```

2. **Using in Loops**:
   ```javascript
   for (let i = 0; i < 3; i++) {
     console.log(i); // Outputs: 0, 1, 2
   }
   console.log(i); // ReferenceError: i is not defined (because `i` is block-scoped)
   ```

---

### **Conclusion**
Using `let` instead of `var` promotes better scoping practices, reduces errors, and makes code more predictable. It ensures that variables are limited to their specific blocks, maintaining clarity and avoiding unexpected behavior in larger programs.