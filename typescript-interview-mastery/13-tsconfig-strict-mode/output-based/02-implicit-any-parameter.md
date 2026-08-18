```typescript
// tsconfig: noImplicitAny: false, rest of strict left on
function logAll(items) {
  items.forEach((i) => console.log(i.toUpperCase()));
}

logAll([1, 2, 3]);
```

Does this compile? What happens at runtime?

**Answer:** It compiles with `noImplicitAny: false` (even though `strict` is otherwise on, `noImplicitAny` was explicitly disabled here). At runtime it throws `TypeError: i.toUpperCase is not a function` for each number, because `.toUpperCase()` is a string method.

**Why:** Without `noImplicitAny`, the untyped parameter `items` implicitly becomes `any`, and `any` disables all further checking on anything derived from it — `items.forEach`, the callback parameter `i`, and `i.toUpperCase()` are all silently typed as `any` too, so no type error is ever reported even though `.toUpperCase()` is nonsensical for numbers. With `noImplicitAny: true`, the original declaration `function logAll(items) {}` fails to compile immediately (`Parameter 'items' implicitly has an 'any' type`), forcing an annotation like `items: number[]`, at which point `i.toUpperCase()` would immediately fail to compile with a clear, accurate error (`Property 'toUpperCase' does not exist on type 'number'`) instead of surfacing as a vague runtime crash.
