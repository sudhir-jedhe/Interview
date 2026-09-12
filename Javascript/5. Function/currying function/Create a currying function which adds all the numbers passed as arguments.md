// Create a currying function which adds all the numbers passed as arguments
addSub(1,2)(3)(4,5,6)(7,9)(); // 1+2+3+4+5+6 = 21

To solve this, we can maintain an accumulated sum using a closure, sum all arguments received in the current call, and return the function itself until it is invoked with no arguments (`()`), at which point it returns the final sum.

```javascript
function addSub(...args) {
  // If the initial call has no arguments, return 0
  if (args.length === 0) return 0;

  // Calculate the running sum of the current call's arguments
  let sum = args.reduce((acc, curr) => acc + curr, 0);

  function curried(...nextArgs) {
    // Termination condition: invoked with empty arguments ()
    if (nextArgs.length === 0) {
      return sum;
    }

    // Add incoming arguments to the accumulated sum
    sum += nextArgs.reduce((acc, curr) => acc + curr, 0);

    // Return the function itself to enable further chaining
    return curried;
  }

  return curried;
}

// Test case
const result = addSub(1, 2)(3)(4, 5, 6)(7, 9)();
console.log(result); // 37 (1 + 2 + 3 + 4 + 5 + 6 + 7 + 9)

```

---

### Alternative: Pure / Functional Implementation (No Mutation)

If you need a pure version where intermediate function references can be reused without sharing mutated state:

```javascript
function addSub(...args) {
  const sumArgs = (list) => list.reduce((a, b) => a + b, 0);

  function curried(accumulatedSum) {
    return function (...nextArgs) {
      if (nextArgs.length === 0) {
        return accumulatedSum;
      }
      return curried(accumulatedSum + sumArgs(nextArgs));
    };
  }

  if (args.length === 0) return 0;
  return curried(sumArgs(args));
}

// Intermediate branch reuse example:
const base = addSub(1, 2)(3); // accumulated: 6
console.log(base(4)());       // 10
console.log(base(10)());      // 16

```

---

### Alternative: Value via `valueOf` / `toString` (Without Final Empty Parens)

In some interview variations, the function is expected to return the sum directly when evaluated in a numeric context without calling `()` at the end:

```javascript
function addSubImplicit(...args) {
  let sum = args.reduce((acc, curr) => acc + curr, 0);

  function curried(...nextArgs) {
    sum += nextArgs.reduce((acc, curr) => acc + curr, 0);
    return curried;
  }

  curried.valueOf = () => sum;
  curried.toString = () => sum;

  return curried;
}

console.log(+addSubImplicit(1, 2)(3)(4, 5, 6)(7, 9)); // 37
console.log(addSubImplicit(1, 2)(3) == 6);            // true

```
