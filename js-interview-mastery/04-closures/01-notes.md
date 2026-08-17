# Closures — Notes

## Definition

A closure is what you get when a function "remembers" the variables from the scope it was defined in, even after that outer scope has finished executing. Every function in JavaScript forms a closure over its lexical environment at creation time — this isn't an opt-in feature, it's just how functions work. The word "closure" specifically becomes relevant when a function is used *outside* the scope it was created in (returned, passed as a callback, stored somewhere) and it still has access to those outer variables.

```js
function makeCounter() {
  let count = 0; // lives in makeCounter's scope
  return function() {
    count++; // this inner function "closes over" count
    return count;
  };
}

const counter = makeCounter(); // makeCounter has already returned...
console.log(counter()); // 1 — ...yet count is still alive and accessible
console.log(counter()); // 2
```

Normally, when a function returns, its local variables would be garbage-collected because nothing references them anymore. But here, the inner function still holds a reference to `count`, so the JS engine keeps that variable alive in memory for as long as the inner function itself is reachable. This is the core mechanic: closures extend a variable's lifetime beyond its enclosing function's execution.

## Each call creates a new closure

Every invocation of `makeCounter` creates a fresh `count` variable and a fresh closure over it — they don't share state:

```js
const counterA = makeCounter();
const counterB = makeCounter();
console.log(counterA()); // 1
console.log(counterA()); // 2
console.log(counterB()); // 1 — independent count, unaffected by counterA
```

## Private state and the module pattern

Because outer variables in a closure aren't accessible from outside except through whatever the closure exposes, closures give you real data privacy without needing classes or `#privateFields`:

```js
function createBankAccount(initialBalance) {
  let balance = initialBalance; // truly private — no external code can touch it directly

  return {
    deposit(amount) { balance += amount; return balance; },
    withdraw(amount) {
      if (amount > balance) throw new Error('Insufficient funds');
      balance -= amount;
      return balance;
    },
    getBalance() { return balance; }
  };
}

const account = createBankAccount(100);
account.deposit(50);
console.log(account.getBalance()); // 150
console.log(account.balance);      // undefined — not accessible directly
```

This "return an object of functions that share a closure" shape is the classic **module pattern** — it was the standard way to build encapsulated, stateful modules before ES modules and class private fields existed, and it's still widely used for factories and small stateful utilities.

## Memoization

Closures let a function cache results across calls by capturing a cache object in its closure:

```js
function memoize(fn) {
  const cache = new Map(); // captured by the returned function
  return function(arg) {
    if (cache.has(arg)) return cache.get(arg);
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

const slowSquare = (n) => { for (let i = 0; i < 1e6; i++); return n * n; };
const fastSquare = memoize(slowSquare);
fastSquare(5); // computes and caches
fastSquare(5); // returns cached result instantly
```

## Currying

Currying transforms a function taking multiple arguments into a sequence of functions each taking one, using closures to accumulate arguments across calls:

```js
function curry(a) {
  return function(b) {
    return function(c) {
      return a + b + c; // closes over a and b from the outer calls
    };
  };
}
console.log(curry(1)(2)(3)); // 6
```

## The classic loop bug (and why closures explain it)

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// logs: 3, 3, 3
```

All three arrow functions close over the *same* `i`, because `var` creates one binding shared across the whole loop. By the time the callbacks run, the loop has finished and `i` is `3`. Two fixes: use `let` (creates a distinct binding, and thus a distinct closure, per iteration), or wrap the loop body in an IIFE that captures the current value as a new local variable each iteration.

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 0, 1, 2 — each closure has its own i
}
```

## Memory implications (brief)

Because a closure keeps its captured variables alive, closures can prevent garbage collection of data you no longer need — for example, capturing a large object just to read one small property from it keeps the whole object in memory for as long as the closure exists. This is a real, common source of memory leaks in long-lived closures (event listeners, timers, caches that never evict). The full mechanics of the JS memory model and GC are covered in the dedicated memory & performance topic — for now, the key takeaway is: closures are powerful specifically because they extend a variable's lifetime, and that same power is exactly what can cause memory to be retained longer than intended.
