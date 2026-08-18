# for-in vs for-of

## for-in: enumerates keys

`for-in` iterates over the **enumerable property keys** of an object — including keys inherited via the prototype chain. This is its most misunderstood behavior:

```js
const parent = { inherited: true };
const child = Object.create(parent);
child.own = 1;

for (const key in child) {
  console.log(key); // "own" then "inherited"
}
```

Using `for-in` on **arrays** is a well-known anti-pattern: it iterates indices as strings, includes any enumerable properties someone attached to the array (or its prototype), and gives no guarantee about numeric ordering across engines for non-standard cases. Always prefer `for-of`, `.forEach`, or a classic `for` loop for arrays. If you must use `for-in` on an object, guard with `Object.hasOwn(obj, key)` (or the older `obj.hasOwnProperty(key)`) to skip inherited keys.

## for-of: iterates values via the iterator protocol

`for-of` works on any **iterable** — arrays, strings, `Map`, `Set`, `NodeList`, generators — and yields *values*, not keys/indices:

```js
for (const char of 'abc') {
  console.log(char); // a b c
}
```

Plain objects (`{}`) are **not** iterable by default, so `for-of` on a plain object throws `TypeError: obj is not iterable`. This is the flip side of `for-in`'s behavior and a frequent interview trap: know which loop works on which kind of thing.

## Comparison

| Aspect | `for-in` | `for-of` |
|---|---|---|
| Iterates over | Enumerable property **keys** (as strings), including inherited ones | **Values**, via the iterable protocol |
| Works on | Any object with enumerable properties | Only iterables (arrays, strings, `Map`, `Set`, generators, etc.) |
| Plain object `{}` | Works | Throws `TypeError` |
| Array use | Discouraged (index order not guaranteed, picks up extra props) | Correct way to loop array values |

Use `for-in` only when you specifically need to enumerate an object's keys (and even then, `Object.keys()` combined with `for-of` or `.forEach` is usually clearer and avoids the inherited-property pitfall). The most common mistake is using `for-in` on an array expecting clean numeric iteration — it technically "works" for simple arrays but breaks the moment any enumerable property is added to the array or `Array.prototype`.
