# Output-Based Questions: Operators & Coercion

## 1.

```js
console.log([] == false);
console.log([] == "");
console.log([] == 0);
console.log([""] == false);
```

**Answer:** `true`, `true`, `true`, `true`

**Why:** In each case an array is compared against a primitive, so the array is first converted via `ToPrimitive`, which for a plain array calls `.toString()` — an empty array becomes `""`, and `[""]` (one empty-string element) also becomes `""` when joined. From there, `"" == false` coerces `false` to `0` and `""` to `0`, matching; `"" == ""` matches directly; `"" == 0` coerces `""` to `0`, matching. All four chains eventually bottom out at `0 == 0` or `"" == ""`.

## 2.

```js
console.log(1 + "2" + 3);
console.log(1 + 2 + "3");
console.log("1" + 2 + 3);
```

**Answer:** `"123"`, `"33"`, `"123"`

**Why:** `+` evaluates strictly left to right with no special-casing beyond "if either side is a string, concatenate." Line 1: `1 + "2"` is `"12"` (mixed → concat) then `"12" + 3` is `"123"`. Line 2: `1 + 2` is `3` (both numbers → arithmetic) then `3 + "3"` is `"33"`. Line 3: `"1" + 2` is `"12"` then `"12" + 3` is `"123"`. Operand order determines whether the first operation is numeric or string-based, which cascades through the rest of the chain.

## 3.

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

## 4.

```js
console.log(typeof NaN);
console.log(NaN === NaN);
console.log([NaN, NaN].indexOf(NaN));
console.log([NaN, NaN].includes(NaN));
```

**Answer:** `"number"`, `false`, `-1`, `true`

**Why:** `NaN` is, perhaps counterintuitively, a numeric value (`typeof NaN === "number"`), but by IEEE-754 definition it's not equal to any value including itself. `indexOf` uses strict `===` internally, so it can never find a `NaN` (always `-1`). `includes` uses the SameValueZero algorithm instead, which treats `NaN` as equal to `NaN` specifically for this kind of membership check, so it correctly returns `true`.

## 5.

```js
const user = { settings: { theme: "" } };
console.log(user.settings.theme || "dark");
console.log(user.settings.theme ?? "dark");
console.log(user.missing?.theme ?? "dark");
```

**Answer:** `"dark"`, `""`, `"dark"`

**Why:** `theme` is an empty string, which is falsy, so `||` treats it as "missing" and substitutes `"dark"`. `??` only treats `null`/`undefined` as missing, and `""` is neither, so it correctly preserves the empty string as a deliberately-set value. `user.missing` doesn't exist, so `?.` short-circuits the whole chain to `undefined`, and `??` then substitutes `"dark"` since `undefined` is nullish.

## 6.

```js
console.log(1 < 2 < 3);
console.log(3 > 2 > 1);
```

**Answer:** `true` then `false`

**Why:** Relational operators are left-associative and don't chain mathematically like in some other languages. `1 < 2 < 3` evaluates `1 < 2` first (`true`), then `true < 3`, where `true` coerces to `1`, giving `1 < 3` which is `true`. `3 > 2 > 1` evaluates `3 > 2` first (`true`), then `true > 1`, where `true` coerces to `1`, giving `1 > 1` which is `false` — a classic trap for anyone assuming Python-style operator chaining.

## 7.

```js
let a;
console.log(a ?? "default" ?? "fallback");
const obj = null;
console.log(obj?.prop?.deep ?? "safe");
```

**Answer:** `"default"` then `"safe"`

**Why:** `a` is `undefined`, so the first `??` immediately substitutes `"default"`; `??` chains left to right just like `||`, only ever moving to the next fallback if the current value is nullish, and `"default"` (a truthy, non-nullish string) stops the chain there. `obj` is `null`, so `obj?.prop` short-circuits the entire remaining chain to `undefined` without erroring, and `??` then substitutes `"safe"`.

## 8.

```js
console.log(+"" );
console.log(+"  ");
console.log(+"abc");
console.log(+true);
console.log(+null);
console.log(+undefined);
```

**Answer:** `0`, `0`, `NaN`, `1`, `0`, `NaN`

**Why:** Unary `+` coerces via `ToNumber`. Empty or whitespace-only strings convert to `0`. Any string with genuinely non-numeric content becomes `NaN`. Booleans convert numerically (`true`→`1`). `null` converts to `0` by spec (it's treated as having no value, mapped to zero), while `undefined` converts to `NaN` — this asymmetry between `null` and `undefined` under numeric coercion is a frequently-tested distinction, in contrast to `==` where they're treated as equal to each other.
