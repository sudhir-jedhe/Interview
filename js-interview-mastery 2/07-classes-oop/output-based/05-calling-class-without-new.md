# Output: calling old-style vs class constructors without new

```js
function OldStyle() { this.value = 1; }
class NewStyle {}
console.log(OldStyle() === undefined);
console.log(NewStyle());
```

**Answer:** `true` then throws `TypeError: Class constructor NewStyle cannot be invoked without 'new'`

**Why:** `OldStyle()` called without `new` runs as a plain function and implicitly returns `undefined` (and, in sloppy mode, would leak `value` onto the global object), so the first comparison is `true`. Calling a `class` without `new`, however, is a hard error by design — the spec marks class constructors as non-callable without `new`, unlike old-style constructor functions which happily run as regular functions if you forget `new`.
