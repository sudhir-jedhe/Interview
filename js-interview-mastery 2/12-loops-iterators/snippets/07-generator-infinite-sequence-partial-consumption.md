# A generator that lazily produces an infinite sequence, consumed partially

```js
function* naturals() {
  let n = 1;
  while (true) yield n++;
}
const it = naturals();
console.log(it.next().value, it.next().value, it.next().value);
// 1 2 3
```
