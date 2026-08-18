# Spread vs. Rest — the Mental Model

Same three dots, opposite job, disambiguated purely by **position**:

- On the right side of `=` or in a call — it's spread (expanding).
- On the left side of `=` (a pattern) or as the last function parameter — it's rest (collecting).

| Aspect | Spread (`...`) | Rest (`...`) |
|---|---|---|
| Direction | Expands an iterable/object into individual items | Collects multiple items into one array/object |
| Where it appears | Array/object literals, function call arguments | Function parameter list, destructuring pattern |
| Example | `foo(...args)` | `function foo(...args) {}` |
| Result | Values are spread out | A new array/object is created |

The syntax is identical, so the only reliable way to tell them apart is context: if it's producing values (right-hand side, call site), it's spread; if it's consuming/binding values (left-hand side, parameter list), it's rest. The most common mistake is assuming `...` always "means the same thing" and getting confused reading `function f(...args)` vs `f(...arr)` side by side.
