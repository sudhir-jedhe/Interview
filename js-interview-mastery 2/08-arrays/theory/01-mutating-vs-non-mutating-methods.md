# Mutating vs non-mutating methods

This is the single most important distinction for avoiding array-related bugs. Mutating methods change the array in place and often return something other than the new array (frequently the removed element(s) or the new length). Non-mutating methods leave the original untouched and return a new array.

```js
const original = [3, 1, 2];

const pushResult = original.push(4);   // mutates original, returns new length
console.log(original, pushResult);     // [3,1,2,4] 4

const sorted = [...original].sort();   // copy first, then mutate the copy
console.log(original, sorted);         // [3,1,2,4] [1,2,3,4]
```

`sort()` and `reverse()` are the most commonly forgotten mutators — they look like they "produce" a new array because you usually chain or log the result, but they mutate the receiver and return a reference to that same array:

```js
const nums = [3, 1, 2];
const sorted2 = nums.sort();
console.log(nums === sorted2); // true, same array reference
console.log(nums);             // [1, 2, 3]
```

```js
const arr = [3, 1, 2];
console.log(arr.reverse().sort((a, b) => a - b) === arr); // true — both mutate and return the same arr
```

Modern engines added `toSorted()`, `toReversed()`, `toSpliced()`, and `with()` (ES2023) as the non-mutating counterparts, which is now the preferred way to avoid accidental shared-state mutation:

```js
const original2 = [3, 1, 2];
const sortedCopy = original2.toSorted();
console.log(original2);   // [3, 1, 2] — untouched
console.log(sortedCopy);  // [1, 2, 3]
```

## `splice` mutates and returns removed elements

```js
const arr2 = [1, 2, 3, 4, 5];
const removed = arr2.splice(1, 2, "a", "b", "c");
console.log(arr2);     // [1, "a", "b", "c", 4, 5]
console.log(removed);  // [2, 3]
```

`slice(start, end)` is non-mutating — it returns a shallow copy of a portion of the array without touching the original. `splice(start, deleteCount, ...items)` is mutating — it removes and/or inserts elements directly in the original array and returns the removed elements. A good mnemonic: "splice changes, slice copies."

## Comparison table

| Aspect | Mutating (`push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`, `copyWithin`) | Non-mutating (`map`, `filter`, `slice`, `concat`, `toSorted`, `toReversed`, `toSpliced`, `with`) |
|---|---|---|
| Original array | Changed in place | Left untouched |
| Return value | Often not the array itself (length, removed items) — except `sort`/`reverse` which return the mutated array | Always a new array |
| Safe with shared/state-managed data (React, Redux) | No — causes missed re-renders / stale references | Yes — designed for immutable update patterns |

Use non-mutating methods by default in any codebase with shared references or state management, and reserve mutating methods for clearly-owned local arrays where in-place efficiency matters. The most common mistake is calling `.sort()` or `.reverse()` directly on a prop/state array, not realizing it mutates the original even though it also "conveniently" returns something you can assign.
