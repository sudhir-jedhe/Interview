# Output-Based Questions: Arrays

## 1.

```js
console.log([10, 1, 21, 2].sort());
```

**Answer:** `[1, 10, 2, 21]`

**Why:** With no comparator, `sort()` converts every element to a string and compares them lexicographically (character by character). `"1" < "10" < "2" < "21"` because `"1"` is a prefix of `"10"` (shorter strings with matching prefixes sort first), and `"2"` comes after `"1..."` strings but before `"21"`. This is the classic default-sort trap.

## 2.

```js
const arr = [1, 2, 3];
const result = arr.map((n) => {
  if (n === 2) return;
  return n * 10;
});
console.log(result);
```

**Answer:** `[10, undefined, 30]`

**Why:** `map` always produces an array of the same length as the input, one output slot per input element — it does not skip or omit elements when the callback returns `undefined`. It's not a filtering operation; an explicit `return;` (or falling off the end of the function) just puts `undefined` in that slot rather than removing it.

## 3.

```js
console.log([1, [2, [3, [4]]]].flat());
console.log([1, [2, [3, [4]]]].flat(2));
```

**Answer:** `[1, 2, [3, [4]]]` then `[1, 2, 3, [4]]`

**Why:** `flat()` defaults to depth `1`, flattening only one level of nesting, so the innermost `[3, [4]]` stays nested inside the second-level array. `flat(2)` flattens two levels, unwrapping one more layer and exposing `3` while leaving `[4]` (three levels deep) still wrapped.

## 4.

```js
const arr = [1, , 3];
console.log(arr.length);
console.log(arr.map((n) => n * 2));
arr.forEach((n) => console.log("visited", n));
```

**Answer:** `3`, then `[2, <1 empty item>, 6]`, then only `"visited 1"` and `"visited 3"` (the hole is never visited)

**Why:** `[1, , 3]` creates a sparse array with an actual "hole" at index 1, not a stored `undefined`. `.length` counts holes (it's `3`). But iteration methods like `map` and `forEach` explicitly skip holes — `map` preserves the hole in its output rather than computing a value for it, and `forEach`'s callback is simply never invoked for that index.

## 5.

```js
const arr = [3, 1, 2];
console.log(arr.reverse().sort((a, b) => a - b) === arr);
```

**Answer:** `true`

**Why:** Both `reverse()` and `sort()` mutate the array in place and return a reference to that same array (not a copy), so chaining them still operates on and returns the original `arr` throughout. The final comparison `=== arr` is comparing the same object reference to itself.

## 6.

```js
console.log(Array(3));
console.log(Array(3).fill(0));
console.log(Array.of(3));
```

**Answer:** `[ <3 empty items> ]`, then `[0, 0, 0]`, then `[3]`

**Why:** `Array(n)` with a single numeric argument creates a sparse array of length `n` with no actual elements (holes), which is why `.fill(0)` is needed to get real, iterable values. `Array.of(3)` instead treats its argument literally as an element to include, producing a one-element array containing the number `3` — this is exactly why `Array.of` exists, to sidestep `Array()`'s special-cased single-number behavior.

## 7.

```js
const users = [{ name: "A", age: 20 }, { name: "B", age: 30 }];
console.log(users.find((u) => u.age > 25).name);
console.log(users.findIndex((u) => u.age > 100));
```

**Answer:** `"B"` then `-1`

**Why:** `find` returns the first element satisfying the predicate (here, the object for `"B"`), so accessing `.name` on it gives `"B"`. `findIndex` returns `-1` when no element satisfies the predicate, mirroring `indexOf`'s not-found convention rather than returning `undefined`.

## 8.

```js
const nested = [[1, 2], [3, 4]];
console.log(nested.flatMap((pair) => pair));
console.log(nested.flatMap((pair) => [pair]));
```

**Answer:** `[1, 2, 3, 4]` then `[[1, 2], [3, 4]]`

**Why:** `flatMap` is `map` followed by `flat(1)`. In the first case, mapping to `pair` (already an array) and flattening one level unwraps each pair directly into the top level. In the second case, mapping to `[pair]` wraps each pair in an *extra* array, so flattening by one level only removes that extra wrapper, leaving the original pairs intact and still nested.
