# Output: static member inheritance and shadowing

```js
class A {
  static x = 10;
}
class B extends A {}
console.log(B.x);
B.x = 20;
console.log(A.x, B.x);
```

**Answer:** `10` then `10 20`

**Why:** Static members are inherited too, because `extends` links `B`'s own `[[Prototype]]` to `A` itself (not just `B.prototype` to `A.prototype`), so `B.x` resolves through that chain to `A.x`. Assigning `B.x = 20` creates a new *own* static property directly on `B`, shadowing the inherited one — it does not mutate `A.x`, which stays `10`.
