# Output: || default with falsy arguments

```js
function greet(name) {
  return `Hello, ${name || "Guest"}`;
}
console.log(greet(""));
console.log(greet(0));
console.log(greet(null));
```

**Answer:** `"Hello, Guest"`, `"Hello, Guest"`, `"Hello, Guest"`

**Why:** `||` falls through to the right-hand default whenever the left side is *any* falsy value, not just `null`/`undefined`. `""` and `0` are both falsy, so even though someone might pass `0` or `""` as a deliberate, valid `name` (unlikely for a name, but the pattern is the point), `||` can't distinguish "intentionally empty/zero" from "missing" — that's precisely the gap `??` was introduced to close.
