In this example, we are using a closure to create a function that "remembers" its previously passed values. The `sum` variable stores the accumulated sum of all values passed to the inner function, and each time we call the function, it adds the current number to that stored sum.

### How It Works:
1. **Outer Function (`curry`)**: It initializes the `sum` variable to 0 and returns an inner function.
2. **Inner Function**: This function accepts a number (`num`), adds it to the `sum` stored in the outer function, and then returns the updated sum. If no argument is passed, the function assumes `num = 0` (default value).

### Example Breakdown:
- The first call to `sum(5)` adds 5 to the initial `sum` of 0 and returns 5.
- The second call to `sum(3)` adds 3 to the previous result (5) and returns 8.
- The third call to `sum(4)` adds 4 to the result (8) and returns 12.
- The fourth call to `sum(0)` adds 0, so the result remains 12.
- The last call to `sum()` with no argument returns the current stored sum, which is 12.

### Code:
```javascript
const curry = () => {
  // To store the previous values
  let sum = 0;

  // Return an inner function
  // Which will have access to its parent function's store
  return function (num = 0) {
    sum += num;
    return sum;
  };
};

// Returns and stores the inner function.
let sum = curry();

console.log(sum(5)); // 5
console.log(sum(3)); // 8
console.log(sum(4)); // 12
console.log(sum(0)); // 12
console.log(sum());  // 12
```

### **Output:**
```
5
8
12
12
12
```

This solution effectively demonstrates how a JavaScript function can "remember" its previous state using closures and maintain a running total. Each call to the `sum` function updates and returns the current total, maintaining an internal state across function calls.