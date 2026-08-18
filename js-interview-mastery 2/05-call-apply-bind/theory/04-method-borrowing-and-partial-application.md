# Method borrowing and partial application

Two of the most practically useful patterns built on `call`/`apply`/`bind`.

## Method borrowing: using call/apply for array-like objects

Some objects "look like" arrays (they have indexed properties and a `length`) but aren't actual `Array` instances, so they don't have array methods like `.map`, `.filter`, `.forEach`. The `arguments` object inside a function and DOM `NodeList`s are classic examples. You can "borrow" `Array.prototype` methods by explicitly setting `this` to the array-like object:

```js
function sumAll() {
  const argsArray = Array.prototype.slice.call(arguments); // borrow slice() to convert to a real array
  return argsArray.reduce((total, n) => total + n, 0);
}
console.log(sumAll(1, 2, 3)); // 6
```

This works because most array methods don't check that `this` is truly an `Array` — they just require indexed properties and a `.length`. In modern code, `Array.from(arguments)` or the spread operator (`[...arguments]`) supersede this pattern for converting array-likes, but the underlying "borrow a method via `call`" technique is still broadly useful (for one-off calls where you don't want to materialize a whole new array first) and shows up constantly in interviews.

```js
// Borrowing on a NodeList
const divs = document.querySelectorAll('div');
const visibleDivs = Array.prototype.filter.call(divs, (el) => el.offsetParent !== null);

// Modern equivalent
const visibleDivs2 = Array.from(divs).filter((el) => el.offsetParent !== null);
```

## Partial application with bind

`bind` lets you pre-fill some of a function's leading arguments, producing a more specific function:

```js
function multiply(a, b) { return a * b; }
const double = multiply.bind(null, 2); // `this` unused here, so null is fine
console.log(double(5));  // 10
console.log(double(21)); // 42
```

This is `bind`'s two responsibilities working together: it can lock `this` *and* pre-fill leading arguments in the same call. That combination is handy for deriving several specialized functions from one general-purpose method:

```js
const logger = {
  prefix: '[APP]',
  write(mode, message) {
    console.log(`${this.prefix} [${mode.toUpperCase()}] ${message}`);
  }
};

const logError = logger.write.bind(logger, 'error'); // locks `this` AND pre-fills mode='error'
const logInfo = logger.write.bind(logger, 'info');

logError('Failed to connect'); // '[APP] [ERROR] Failed to connect'
logInfo('Server started');     // '[APP] [INFO] Server started'
```

See `problems/03-partial-utility.md` for a general-purpose `partial(fn, ...presetArgs)` utility built on this idea, and `problems/02-borrowing-array-methods-for-array-likes.md` for a hands-on method-borrowing exercise.
