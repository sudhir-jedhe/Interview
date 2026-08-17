# Comparisons: Loops & Iterators

## `for-in` vs. `for-of`

| Aspect | `for-in` | `for-of` |
|---|---|---|
| Iterates over | Enumerable property **keys** (as strings), including inherited ones | **Values**, via the iterable protocol |
| Works on | Any object with enumerable properties | Only iterables (arrays, strings, `Map`, `Set`, generators, etc.) |
| Plain object `{}` | Works | Throws `TypeError` |
| Array use | Discouraged (index order not guaranteed, picks up extra props) | Correct way to loop array values |

Use `for-in` only when you specifically need to enumerate an object's keys (and even then, `Object.keys()` combined with `for-of` or `.forEach` is usually clearer and avoids the inherited-property pitfall). The most common mistake is using `for-in` on an array expecting clean numeric iteration — it technically "works" for simple arrays but breaks the moment any enumerable property is added to the array or `Array.prototype`.

## `while` vs. `do-while`

| Aspect | `while` | `do-while` |
|---|---|---|
| Condition checked | Before each iteration | After each iteration |
| Minimum executions | 0 (if condition starts false) | 1 (body always runs once) |
| Typical use | General condition-driven looping | "Run at least once" logic (e.g., menu prompts, retry-once patterns) |

The common mistake is defaulting to `while` for something that conceptually needs to run at least once (like processing a first user input before checking a stop condition) and then having to duplicate the body outside the loop just to force that first run — `do-while` exists precisely to avoid that duplication.

## `break`/`continue` vs. Labeled `break`/`continue`

| Aspect | Unlabeled | Labeled |
|---|---|---|
| Scope of effect | Nearest enclosing loop only | The specifically labeled loop (can be an outer one) |
| Syntax | `break;` / `continue;` | `break label;` / `continue label;` |
| Use case | Simple nested loops where inner-loop control is enough | Need to escape/skip an outer loop from inside a nested loop |

Labels are rarely needed and can hurt readability if overused, but they're the cleanest solution when you genuinely need to break out of nested loops early (the alternative — a flag variable checked in every inner iteration — is more error-prone). The common mistake is forgetting that unlabeled `break`/`continue` only ever affects the *innermost* loop, leading to bugs where a nested `break` doesn't stop the outer loop as intended.

## Hand-Written Iterator vs. Generator Function

| Aspect | Manual `Symbol.iterator` object | Generator function (`function*`) |
|---|---|---|
| Boilerplate | Must manually track state and return `{ value, done }` | State is implicit; `yield` handles pausing/resuming |
| Readability | Verbose for anything non-trivial | Reads like a normal loop/function |
| Two-way communication | Not built in | `next(value)` can pass values back into the generator |
| When to use | Rarely, for very specific low-level control | Default choice for building custom iterables |

For almost all real-world custom iterables, prefer a generator — it's far less error-prone than hand-tracking `done`/`value` state. The manual approach is worth knowing for interviews (to demonstrate you understand the protocol underneath) but is rarely the pragmatic production choice.
