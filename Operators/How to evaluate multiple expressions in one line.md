**How to evaluate multiple expressions in one line?**

↑We can use the , or comma operator to evaluate multiple expressions in one line. It evaluates from left-to-right and returns the value of the last item on the right or the last operand.

```js
let x = 5;

x = (x++ , x = addFive(x), x *= 2, x -= 5, x += 10);

function addFive(num) {
  return num + 5;
}
```

If you log the value of x it would be 27.

First, we increment the value of x it would be 6, then we invoke the function addFive(6) and pass the 6 as a parameter and assign the result to x the new value of x would be 11.

After that, we multiply the current value of x to 2 and assign it to x the updated value of x would be 22.

Then, we subtract the current value of x to 5 and assign the result to x the updated value would be 17.

And lastly, we increment the value of x by 10 and assign the updated value to x now the value of x would be 27.

The **comma operator** in JavaScript allows you to evaluate multiple expressions in a single statement, separated by commas. The comma operator evaluates each expression from left to right, but **returns the value of the last expression**. This can be useful when you need to execute several operations in one line while only using the result of the final expression.

### Syntax

```js
expr1, expr2, ..., exprN
```

Where:

- `expr1`, `expr2`, ..., `exprN` are the expressions to be evaluated.
- The result of the entire comma expression is the value of the last expression, `exprN`.

### Example: Evaluating multiple expressions

```js
let x = 5;

x = (x++, 
     x = addFive(x), 
     x *= 2, 
     x -= 5, 
     x += 10);

function addFive(num) {
  return num + 5;
}

console.log(x);  // Output: 27
```

### How it works

1. **x++**: Increments `x` by 1, changing its value from 5 to 6.
2. **x = addFive(x)**: Calls the `addFive` function with `x` (which is now 6), which returns `6 + 5 = 11`. Now `x` is 11.
3. **x *= 2**: Multiplies `x` by 2. `11 * 2 = 22`, so `x` becomes 22.
4. **x -= 5**: Subtracts 5 from `x`. `22 - 5 = 17`, so `x` is now 17.
5. **x += 10**: Adds 10 to `x`. `17 + 10 = 27`, so `x` is 27.

Finally, the **comma operator** returns the value of the last operation, which is `x += 10`. Thus, `x` becomes 27.

### Use cases for the comma operator

1. **Multiple expressions in a loop**: You can execute multiple operations in a loop or conditionally while maintaining readability.
2. **Shorter code**: When you need to perform several operations in a concise form, the comma operator can make your code more compact.
3. **Side-effects**: You can use the comma operator when you need side effects (like logging or updating a variable) in a sequence.

### Example of using the comma operator in a loop

```js
let count = 0;

for (let i = 0; i < 5; i++) {
  count = (console.log(`Iteration ${i}`), count + 1);
}

console.log(count);  // Output: 5
```

In this example:

- The `console.log` inside the loop executes, logging each iteration number.
- The `count` is incremented in each iteration using the comma operator, and the final value of `count` is logged after the loop.

### Note

Although the comma operator can make your code shorter, use it sparingly. Overusing it may reduce readability, especially if the expressions are complex. It's typically best used for simple operations or when side effects are required.
