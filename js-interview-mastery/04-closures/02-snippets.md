# Closures — Snippets

```js
// 1. Basic closure: inner function retains access to outer variable after outer returns
function makeGreeter(greeting) {
  return function(name) {
    return `${greeting}, ${name}!`;
  };
}
const sayHello = makeGreeter('Hello');
console.log(sayHello('Sam')); // 'Hello, Sam!' — greeting still accessible
```

```js
// 2. Each closure instance is independent
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const c1 = makeCounter();
const c2 = makeCounter();
console.log(c1(), c1(), c2()); // 1 2 1 — c2 has its own separate count
```

```js
// 3. Private state via closure (module pattern)
function createStack() {
  const items = [];
  return {
    push: (x) => items.push(x),
    pop: () => items.pop(),
    size: () => items.length
  };
}
const stack = createStack();
stack.push(1);
stack.push(2);
console.log(stack.size()); // 2
console.log(stack.pop());  // 2
console.log(stack.items);  // undefined — no direct access
```

```js
// 4. Memoization using a closure-captured cache
function memoize(fn) {
  const cache = {};
  return (n) => {
    if (n in cache) return cache[n];
    return (cache[n] = fn(n));
  };
}
let calls = 0;
const square = memoize((n) => { calls++; return n * n; });
square(4); square(4); square(4);
console.log(calls); // 1 — only computed once, subsequent calls hit the cache
```

```js
// 5. Currying via nested closures
const add = (a) => (b) => (c) => a + b + c;
console.log(add(1)(2)(3)); // 6
const addFive = add(5);      // partially applied, closes over a=5
console.log(addFive(2)(3));  // 10
```

```js
// 6. The var loop bug vs the let fix, side by side
const varResults = [];
for (var i = 0; i < 3; i++) {
  varResults.push(() => i);
}
console.log(varResults.map(fn => fn())); // [3, 3, 3]

const letResults = [];
for (let j = 0; j < 3; j++) {
  letResults.push(() => j);
}
console.log(letResults.map(fn => fn())); // [0, 1, 2]
```

```js
// 7. Closures used to build a debounce utility (real-world pattern)
function debounce(fn, delay) {
  let timeoutId; // captured across every call to the debounced function
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
const log = debounce((msg) => console.log(msg), 100);
log('a'); log('b'); log('c'); // only 'c' will actually log, ~100ms later
```
