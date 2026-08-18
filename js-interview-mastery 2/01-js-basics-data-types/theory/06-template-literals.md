# Template Literals

Template literals (backticks) support interpolation and multi-line strings without concatenation:

```js
const name = 'Sam';
const greeting = `Hello, ${name}! You have ${2 + 3} messages.`;
// 'Hello, Sam! You have 5 messages.'
```

Expressions inside `${}` are evaluated, coerced to strings, and inserted — this is cleaner and less error-prone than `'Hello, ' + name + '!'` chains, especially with nested expressions or function calls.

```js
const price = 19.999;
const qty = 3;
console.log(`Total: $${(price * qty).toFixed(2)}`);
// 'Total: $60.00' — the expression (price * qty).toFixed(2) is fully evaluated before interpolation
```

Template literals also support genuine multi-line strings without `\n` escapes:

```js
const html = `
  <div>
    <span>${name}</span>
  </div>
`;
```

Any valid JS expression can go inside `${}` — arithmetic, function calls, ternaries, even nested template literals — which is why they're preferred over string concatenation for anything beyond a trivial single-variable insert.
