# `const` Prevents Reassignment, Not Mutation

```js
const arr = [1, 2, 3];
arr.push(4);          // fine — mutating the array
console.log(arr);     // [1, 2, 3, 4]

try {
  arr = [];            // TypeError: Assignment to constant variable.
} catch (e) {
  console.log(e.message);
}
```

`const` locks the *binding* (you can't point `arr` at a different array), not the *contents* of what it points to.
