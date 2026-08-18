# Output: Spreading a sub-array into arguments collected by rest

```js
function sum(...nums) {
  console.log(nums.length);
}
sum(1, 2, ...[3, 4], 5);
```

**Answer:** `5`

**Why:** The spread `...[3, 4]` expands to `3, 4` at the call site before the function is invoked, so `sum` actually receives the arguments `1, 2, 3, 4, 5`. The rest parameter `...nums` then collects all five into one array.
