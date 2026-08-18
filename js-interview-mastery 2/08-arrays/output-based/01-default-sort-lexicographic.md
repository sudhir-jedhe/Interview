# Output: default sort is lexicographic

```js
console.log([10, 1, 21, 2].sort());
```

**Answer:** `[1, 10, 2, 21]`

**Why:** With no comparator, `sort()` converts every element to a string and compares them lexicographically (character by character). `"1" < "10" < "2" < "21"` because `"1"` is a prefix of `"10"` (shorter strings with matching prefixes sort first), and `"2"` comes after `"1..."` strings but before `"21"`. This is the classic default-sort trap.
