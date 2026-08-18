# Output: for-of ignores extra non-index array properties

```js
const arr = [10, 20, 30];
arr.extra = 'bonus';
for (const val of arr) {
  console.log(val);
}
```

**Answer:** `10 20 30`

**Why:** `for-of` on an array uses the array's iterator, which only walks numeric indices `0` through `length - 1` — it completely ignores any extra non-index properties attached to the array object, unlike `for-in`, which would have also logged `"extra"`.
