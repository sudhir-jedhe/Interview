# yield* delegates to a nested generator, flattening the sequence

```js
function* letters() { yield 'a'; yield 'b'; }
function* combined() {
  yield 1;
  yield* letters();
  yield 2;
}
console.log([...combined()]);
// [ 1, 'a', 'b', 2 ]
```

`yield* letters()` pulls every value out of `letters()` in turn and re-yields it from `combined()`, as if those `yield`s had been written inline — this is how generators compose without manual `for...of` re-yielding loops.
