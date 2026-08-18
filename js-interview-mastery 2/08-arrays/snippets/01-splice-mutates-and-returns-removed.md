# Snippet: splice mutates and returns removed elements

```js
const arr = [1, 2, 3, 4, 5];
const removed = arr.splice(1, 2, "a", "b", "c");
console.log(arr);     // [1, "a", "b", "c", 4, 5]
console.log(removed); // [2, 3]
```

`splice(1, 2, "a", "b", "c")` removes 2 elements starting at index 1 (`2` and `3`) and inserts `"a", "b", "c"` in their place, mutating `arr` directly and returning the removed elements as a new array.
