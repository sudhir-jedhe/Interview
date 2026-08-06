// Ques 1 : Factorial of n
// Input:  n = 5  ----->>>>>  Output: 120

function factorial(n) {
  if (n === 0) {
    return 1;
  } else return n * factorial(n - 1);
}

console.log(factorial(5));


function factorial(n) {
  if (n === 0 || n === 1) {
      return 1; // base case
  }
  return n * factorial(n - 1); // recursive case
}

console.log(factorial(5));  // Output: 120
console.log(factorial(0));  // Output: 1
console.log(factorial(7));  // Output: 5040



function factorialIterative(n) {
  let result = 1;
  for (let i = 1; i <= n; i++) {
      result *= i;  // multiply result by i
  }
  return result;
}

console.log(factorialIterative(5));  // Output: 120
console.log(factorialIterative(0));  // Output: 1
console.log(factorialIterative(7));  // Output: 5040



const memo = {};  // Object to store previously computed factorials

function factorialMemo(n) {
    if (n === 0 || n === 1) {
        return 1;
    }
    if (memo[n]) {
        return memo[n];  // Return the cached result
    }
    // Store the result in the memo object and return it
    memo[n] = n * factorialMemo(n - 1);
    return memo[n];
}

console.log(factorialMemo(5));  // Output: 120
console.log(factorialMemo(7));  // Output: 5040
console.log(factorialMemo(5));  // Output: 120 (retrieved from memo)



function* factorialGenerator() {
  let result = 1;
  let n = 0;
  while (true) {
      if (n > 0) result *= n;  // Multiply result by n
      yield result;  // Yield the current factorial value
      n++;
  }
}

const gen = factorialGenerator();

console.log(gen.next().value);  // Output: 1 (0!)
console.log(gen.next().value);  // Output: 1 (1!)
console.log(gen.next().value);  // Output: 2 (2!)
console.log(gen.next().value);  // Output: 6 (3!)
console.log(gen.next().value);  // Output: 24 (4!)
