# The Classic Loops

`for` gives you explicit control over initialization, condition, and increment — best when you need the index itself:

```js
for (let i = 0; i < 3; i++) {
  console.log(i); // 0 1 2
}
```

`while` and `do-while` are condition-driven rather than counter-driven. The difference between them is when the condition is checked: `while` checks *before* the first iteration, `do-while` checks *after*, so a `do-while` body always runs at least once even if the condition is false from the start:

```js
let n = 5;
do {
  console.log(n); // 5 — runs once even though condition is already false
} while (n < 3);
```

## while vs do-while

| Aspect | `while` | `do-while` |
|---|---|---|
| Condition checked | Before each iteration | After each iteration |
| Minimum executions | 0 (if condition starts false) | 1 (body always runs once) |
| Typical use | General condition-driven looping | "Run at least once" logic (e.g., menu prompts, retry-once patterns) |

The common mistake is defaulting to `while` for something that conceptually needs to run at least once (like processing a first user input before checking a stop condition) and then having to duplicate the body outside the loop just to force that first run — `do-while` exists precisely to avoid that duplication.
