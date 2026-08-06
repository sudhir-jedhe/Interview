// Let's break down promise chaining behavior with detailed examples

// Example 1: Original chain
console.log("Example 1: Original chain");
Promise.resolve(1)
  .then(() => 2)           // Ignores 1, returns 2
  .then(3)                 // Not a function, value passes through
  .then(value => value * 3)// 2 * 3 = 6
  .then(Promise.resolve(4))// Not a function, value passes through
  .then(console.log);      // Logs 6

// Example 2: Showing each step's value
console.log("\nExample 2: Showing each step's value");
Promise.resolve(1)
  .then(value => {
    console.log('Step 1:', value); // 1
    return 2;
  })
  .then(value => {
    console.log('Step 2:', value); // 2
    return 3;
  })
  .then(value => {
    console.log('Step 3:', value); // 3
    return value * 3;
  })
  .then(value => {
    console.log('Step 4:', value); // 9
    return value;
  })
  .then(value => {
    console.log('Final value:', value); // 9
  });

// Example 3: Common mistakes in promise chaining
console.log("\nExample 3: Common mistakes");
Promise.resolve('start')
  .then(value => {
    console.log('Non-function in then:', value);
    return value;
  })
  .then(123) // Not a function - value passes through
  .then(Promise.resolve('ignored')) // Not a function - value passes through
  .then(value => {
    console.log('Value after mistakes:', value);
  });

// Example 4: Correct vs Incorrect promise chain handling
console.log("\nExample 4: Correct vs Incorrect handling");

// Incorrect - passing promise directly
Promise.resolve(1)
  .then(Promise.resolve(2))
  .then(value => console.log('Incorrect handling:', value));

// Correct - returning promise or using function
Promise.resolve(1)
  .then(() => Promise.resolve(2))
  .then(value => console.log('Correct handling:', value));

// Example 5: Understanding value propagation
console.log("\nExample 5: Value propagation");
Promise.resolve('initial')
  .then(value => {
    console.log('Initial value:', value);
    // No return - undefined is passed
  })
  .then(value => {
    console.log('After no return:', value);
    return 'explicit return';
  })
  .then(value => {
    console.log('After explicit return:', value);
  });