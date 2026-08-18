# + is Special; Other Arithmetic Operators Are Not

`+` is overloaded: if either operand is a string (after `ToPrimitive` conversion for objects), it performs string concatenation. Every other arithmetic operator (`-`, `*`, `/`, `%`, `**`) always coerces both operands to numbers first — there's no "string subtraction."

```js
console.log("5" + 3);     // "53" — string concatenation
console.log("5" - 3);     // 2   — both coerced to numbers
console.log("5" * "2");   // 10  — both coerced to numbers
console.log(1 + "2" + 3); // "123" — left to right; "1"+"2" first, then + "3"
console.log(1 + 2 + "3"); // "33"  — 1+2 is numeric first (both numbers), then + "3" concatenates
```

## Ternary operator

`condition ? exprIfTrue : exprIfFalse` is a single expression, useful for concise conditional assignment, but nesting it deeply hurts readability fast — most style guides cap it at one level.

```js
const status = age >= 18 ? "adult" : "minor";
```

`condition ? a : b` has fairly low precedence, so it's usually the outermost part of a larger expression rather than needing extra parentheses around the condition. It's ideal for simple, single-level conditional assignment or JSX-style inline rendering; nesting ternaries (`a ? b : c ? d : e`) is technically valid but widely considered a readability hazard, and most style guides recommend an `if`/`else` or a lookup structure instead once you need more than one level.
