# Snippets: Loops & Iterators

```js
// 1. do-while always runs at least once
let count = 10;
do {
  console.log('ran once even though condition is false');
} while (count < 5);
// ran once even though condition is false
```

```js
// 2. for-in on an array includes inherited enumerable properties
Array.prototype.customHelper = 'oops';
const arr = ['a', 'b'];
for (const key in arr) {
  console.log(key);
}
delete Array.prototype.customHelper; // clean up
// 0
// 1
// customHelper
```

```js
// 3. for-of throws on a plain (non-iterable) object
try {
  for (const x of { a: 1, b: 2 }) console.log(x);
} catch (e) {
  console.log(e.message);
}
// {a: 1, b: 2} is not iterable  (message wording varies by engine)
```

```js
// 4. labeled continue skips the OUTER loop's current iteration
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 1) continue outer;
    console.log(`i=${i} j=${j}`);
  }
}
// i=0 j=0
// i=1 j=0
// i=2 j=0
```

```js
// 5. destructuring Map entries with for-of
const scores = new Map([['a', 10], ['b', 20]]);
for (const [name, score] of scores) {
  console.log(name, score);
}
// a 10
// b 20
```

```js
// 6. a custom iterable using Symbol.iterator
const evens = {
  [Symbol.iterator]() {
    let n = 0;
    return {
      next: () => (n < 3 ? { value: (n++) * 2, done: false } : { value: undefined, done: true }),
    };
  },
};
console.log([...evens]);
// [ 0, 2, 4 ]
```

```js
// 7. a generator that lazily produces an infinite sequence, consumed partially
function* naturals() {
  let n = 1;
  while (true) yield n++;
}
const it = naturals();
console.log(it.next().value, it.next().value, it.next().value);
// 1 2 3
```
