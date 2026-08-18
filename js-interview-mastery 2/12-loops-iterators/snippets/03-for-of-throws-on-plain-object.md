# for-of throws on a plain (non-iterable) object

```js
try {
  for (const x of { a: 1, b: 2 }) console.log(x);
} catch (e) {
  console.log(e.message);
}
// {a: 1, b: 2} is not iterable  (message wording varies by engine)
```
