```js
function* gen() {
  const x = yield 1;
  const y = yield x + 1;
  return x + y;
}
const it = gen();
console.log(it.next());
console.log(it.next(10));
console.log(it.next(20));
```
**Answer:**
```
{ value: 1, done: false }
{ value: 11, done: false }
{ value: 30, done: true }
```
**Why:** The value passed into `next(v)` becomes the result of the *previous* `yield` expression when execution resumes, not the value of the yield about to happen. The first `next()` call has nothing to pass in (it just starts the generator, running up to `yield 1`). `next(10)` resumes with `x = 10`, computes `yield x + 1` → `yield 11`. `next(20)` resumes with `y = 20`, and the function returns `x + y = 10 + 20 = 30`, with `done: true`.
