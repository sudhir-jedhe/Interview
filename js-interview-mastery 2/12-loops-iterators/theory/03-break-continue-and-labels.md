# break, continue, and Labels

`break` exits the nearest enclosing loop entirely; `continue` skips to the next iteration. A **label** lets you target an outer loop from inside a nested one:

```js
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 1) continue outer; // skips to next i, not just next j
    console.log(i, j);
  }
}
```

## Unlabeled vs labeled break/continue

| Aspect | Unlabeled | Labeled |
|---|---|---|
| Scope of effect | Nearest enclosing loop only | The specifically labeled loop (can be an outer one) |
| Syntax | `break;` / `continue;` | `break label;` / `continue label;` |
| Use case | Simple nested loops where inner-loop control is enough | Need to escape/skip an outer loop from inside a nested loop |

Labels are rarely needed and can hurt readability if overused, but they're the cleanest solution when you genuinely need to break out of nested loops early (the alternative — a flag variable checked in every inner iteration — is more error-prone). The common mistake is forgetting that unlabeled `break`/`continue` only ever affects the *innermost* loop, leading to bugs where a nested `break` doesn't stop the outer loop as intended.
