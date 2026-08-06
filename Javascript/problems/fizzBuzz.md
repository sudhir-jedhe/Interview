The `fizzBuzz` function is a well-known coding problem where, for each number from 1 to `n`:

- Print "Fizz" if the number is divisible by 3.
- Print "Buzz" if the number is divisible by 5.
- Print "FizzBuzz" if the number is divisible by both 3 and 5.
- Print the number itself if it is divisible by neither 3 nor 5.

You've provided a few different implementations of this problem. Let's go over each one in detail:

### 1. **First Implementation (Multiple `if` statements)**

```javascript
function fizzBuzz(n) {
  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      console.log("FizzBuzz");
    } else if (i % 3 === 0) {
      console.log("Fizz");
    } else if (i % 5 === 0) {
      console.log("Buzz");
    } else {
      console.log(i);
    }
  }
}

// Example usage:
fizzBuzz(15);
```

### Explanation:

- **Time Complexity**: O(n) because you are iterating over each number from `1` to `n`.
- **Space Complexity**: O(1) because you are only using a constant amount of extra space.
- **How it works**: For each number, you check if it is divisible by 3 and 5 first (for "FizzBuzz"), then by 3 and by 5 separately, and finally print the number if none of those conditions are met.

### 2. **Second Implementation (String concatenation)**

```javascript
function fizzBuzz(n) {
  for (let i = 1; i <= n; i++) {
    let output = "";

    if (i % 3 === 0) {
      output += "Fizz";
    }

    if (i % 5 === 0) {
      output += "Buzz";
    }

    // If neither 3 nor 5 divides the number, print the number itself
    if (output === "") {
      output = i;
    }

    console.log(output);
  }
}

// Example usage:
fizzBuzz(20);
```

### Explanation:

- **Time Complexity**: O(n)
- **Space Complexity**: O(1) since the only additional space used is for the `output` string in each iteration.
- **How it works**: Instead of checking first for both 3 and 5 together, it uses string concatenation to append "Fizz" and/or "Buzz" depending on whether the number is divisible by 3 and/or 5. If neither condition is met, it prints the number.

### 3. **Third Implementation (Multiple `if` checks)**

```javascript
function fizzBuzz(n) {
  for (let i = 1; i <= n; i++) {
    // Check if the number is divisible by both 3 and 5
    if (i % 3 === 0 && i % 5 === 0) {
      console.log("FizzBuzz");
    }
    // Check if the number is divisible by 3
    else if (i % 3 === 0) {
      console.log("Fizz");
    }
    // Check if the number is divisible by 5
    else if (i % 5 === 0) {
      console.log("Buzz");
    }
    // If the number is not divisible by 3 or 5, print the number itself
    else {
      console.log(i);
    }
  }
}

// Example usage:
fizzBuzz(15);
```

### Explanation:

- **Time Complexity**: O(n)
- **Space Complexity**: O(1)
- **How it works**: This approach is similar to the first one but written in a slightly different way. It uses standard `if-else` statements to decide the output for each number.

### 4. **Fourth Implementation (Using an array and returning values)**

```javascript
const fizzBuzz = function (n) {
  let arr = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) arr.push("FizzBuzz");
    else if (i % 3 === 0) arr.push("Fizz");
    else if (i % 5 === 0) arr.push("Buzz");
    else arr.push(`${i}`);
  }
  return arr;
};
```

### Explanation:

- **Time Complexity**: O(n)
- **Space Complexity**: O(n) because you are storing the output in an array that will eventually hold `n` elements.
- **How it works**: This approach returns an array of results instead of logging to the console. It directly stores the result for each number in the array (`arr.push`) and returns the array after finishing the loop.

### Comparison:

- **Output**:
  - In the first three implementations, the result is printed to the console, making them suitable for quick outputs.
  - The fourth implementation returns an array, which could be more useful for cases where you need to process the results further or use them in another context.

- **Approach**:
  - The first and third approaches directly print the result while looping.
  - The second approach constructs the output string more efficiently by using concatenation and checks separately for divisibility.
  - The fourth approach is more general-purpose, as it returns the result in an array for later use.

### Example Usage:

```javascript
// Example 1: Classic fizzBuzz output printed to the console
fizzBuzz(15); // Prints to the console the fizzBuzz sequence from 1 to 15

// Example 2: Returning the fizzBuzz sequence as an array
const result = fizzBuzz(20);
console.log(result); // Returns an array containing the FizzBuzz sequence
```

### Conclusion:

- If you want to **print** the result directly to the console, the first, second, or third approaches work well.
- If you want to **return** the result in an array (for further manipulation or testing), the fourth implementation is the most suitable.
- All solutions have **O(n)** time complexity, but the fourth one has an additional space complexity of **O(n)** due to the array storage.
