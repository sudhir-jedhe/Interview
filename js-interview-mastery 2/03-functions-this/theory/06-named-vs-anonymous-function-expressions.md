# Named vs Anonymous Function Expressions

A named function expression keeps its name usable inside its own body (useful for recursion) without adding that name to the enclosing scope:

```js
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1); // `fact` only resolvable inside here
};
console.log(typeof fact); // 'undefined' — not leaked to outer scope
```

Anonymous function expressions (`const factorial = function(n) {...}`) can't reference themselves by name, and historically produced less helpful stack traces — modern engines infer a display name from the variable it's assigned to, which mitigates this in practice.

The main practical benefit of a named function expression is **safe self-reference**: if the outer variable is later reassigned, the inner name still refers to the original function, which matters specifically for recursion.

```js
let run = function loop(n) {
  if (n <= 0) return 'done';
  return loop(n - 1); // always refers to this exact function, even if `run` changes
};
const originalRun = run;
run = null; // reassign the outer binding
console.log(originalRun(3)); // 'done' — still works, `loop` was never dependent on `run`
```
