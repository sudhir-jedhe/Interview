# find / findIndex / some / every

`find` returns the first matching **element** (or `undefined`); `findIndex` returns its **index** (or `-1`). `some` returns a boolean — true if at least one element passes; `every` returns true only if all elements pass. All four short-circuit, stopping as soon as the answer is determined.

```js
const users = [{ id: 1, active: false }, { id: 2, active: true }];
users.find((u) => u.active);  // { id: 2, active: true }
users.some((u) => u.active);  // true
users.every((u) => u.active); // false
```

```js
const nums = [1, 2, 3, 4];
console.log(nums.find((n) => n > 2));   // 3 — first match, a single value
console.log(nums.filter((n) => n > 2)); // [3, 4] — all matches, an array
```

```js
const users2 = [{ name: "A", age: 20 }, { name: "B", age: 30 }];
console.log(users2.find((u) => u.age > 25).name); // "B"
console.log(users2.findIndex((u) => u.age > 100)); // -1
```

`find` returns the first element satisfying the predicate, so accessing `.name` on it works directly. `findIndex` returns `-1` when no element satisfies the predicate, mirroring `indexOf`'s not-found convention rather than returning `undefined`.

## find/findIndex vs filter

`find`/`findIndex` return the first matching element (or its index) and stop iterating as soon as a match is found. `filter` always iterates the entire array and returns a new array of *all* matches. Use `find` when you expect/need at most one result and want early termination for performance; use `filter` when you need every match.

## find/findIndex vs some/every

| Aspect | `find` / `findIndex` | `some` / `every` |
|---|---|---|
| Return type | Element / index (or `undefined` / `-1`) | Boolean |
| Use case | You need the matching item itself | You only need to know if a condition holds |
| Short-circuits | Yes | Yes |

Use `find`/`findIndex` when you need the actual matching data; use `some`/`every` when you only need a yes/no answer, since returning a boolean is cheaper to reason about and avoids accidentally treating a found object as truthy/falsy logic (an object is always truthy, so misusing `find` in an `if` works but is less explicit than `some`).
