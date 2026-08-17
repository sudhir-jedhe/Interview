# Snippets: Design Patterns & Polyfills

```js
// 1. Module pattern: IIFE creates private state via closure
const BankAccount = (function () {
  let balance = 0; // private
  return {
    deposit(amount) { balance += amount; return balance; },
    getBalance() { return balance; },
  };
})();

BankAccount.deposit(100);
console.log(BankAccount.getBalance()); // 100
console.log(BankAccount.balance);      // undefined -- no direct access
```

```js
// 2. Singleton via module-level caching (the natural JS way)
// config.js (conceptually) -- ES modules are cached, so every import gets the same object
const config = { apiUrl: "https://api.example.com" };
export default config;
// Every file that does `import config from './config.js'` shares this exact same object reference.
```

```js
// 3. Minimal pub-sub event emitter
function createEmitter() {
  const listeners = new Map();
  return {
    on(event, cb) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(cb);
    },
    emit(event, payload) {
      listeners.get(event)?.forEach(cb => cb(payload));
    },
  };
}

const emitter = createEmitter();
emitter.on("greet", (name) => console.log(`Hello, ${name}`));
emitter.emit("greet", "world"); // "Hello, world"
```

```js
// 4. Factory function producing different object shapes from one entry point
function createUser(role) {
  const base = { role, createdAt: Date.now() };
  if (role === "admin") return { ...base, permissions: ["read", "write", "delete"] };
  return { ...base, permissions: ["read"] };
}

console.log(createUser("admin").permissions); // ["read", "write", "delete"]
console.log(createUser("guest").permissions); // ["read"]
```

```js
// 5. Throttle: guarantees execution at most once per interval
function throttle(fn, interval) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      fn(...args);
    }
  };
}

const onScroll = throttle(() => console.log("scroll handled"), 1000);
// Even if `onScroll()` is called 100 times in the next 500ms, it only actually
// runs once (the first call); subsequent calls within the 1000ms window are ignored.
```

```js
// 6. Polyfill for Array.prototype.reduce, including the no-initial-value edge case
Array.prototype.myReduce = function (callback, initialValue) {
  let acc = initialValue;
  let startIndex = 0;
  if (acc === undefined) {
    if (this.length === 0) throw new TypeError("Reduce of empty array with no initial value");
    acc = this[0];
    startIndex = 1;
  }
  for (let i = startIndex; i < this.length; i++) {
    if (i in this) acc = callback(acc, this[i], i, this);
  }
  return acc;
};

console.log([1, 2, 3].myReduce((a, b) => a + b));    // 6 (no initial value: starts from index 1)
console.log([1, 2, 3].myReduce((a, b) => a + b, 10)); // 16
```

```js
// 7. Polyfill for Promise.all: preserves order, rejects fast on first failure
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = new Array(promises.length);
    let remaining = promises.length;
    if (remaining === 0) return resolve(results);
    promises.forEach((p, i) => {
      Promise.resolve(p).then(
        (value) => {
          results[i] = value; // order preserved by index, regardless of settle order
          if (--remaining === 0) resolve(results);
        },
        reject // any single rejection rejects the whole thing immediately
      );
    });
  });
}

myPromiseAll([
  new Promise(r => setTimeout(() => r("slow"), 100)),
  Promise.resolve("fast"),
]).then(console.log);
// ["slow", "fast"] -- order matches input array, not resolution order
```
