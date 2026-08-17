# call, apply, bind — Notes

All three methods exist on `Function.prototype`, meaning every function has access to them. They all let you explicitly set what `this` refers to when a function runs, which matters because — as covered in the functions/`this` topic — `this` is normally determined by how a function is *called*, not how it's defined. Sometimes you need to override that default behavior directly.

## `call`: invoke immediately, arguments listed individually

```js
function introduce(greeting, punctuation) {
  return `${greeting}, I'm ${this.name}${punctuation}`;
}
const user = { name: 'Ada' };
console.log(introduce.call(user, 'Hi', '!')); // "Hi, I'm Ada!"
```

`call` invokes the function right away. The first argument becomes `this` inside the function; every argument after that is passed to the function positionally, exactly like a normal call, just listed as extra arguments to `call` itself.

## `apply`: invoke immediately, arguments as an array

```js
console.log(introduce.apply(user, ['Hi', '!'])); // "Hi, I'm Ada!" — same result as call
```

`apply` behaves identically to `call` except the function's arguments are passed as a single array (or array-like) instead of individually. This matters when you already have your arguments as an array or don't know how many there are ahead of time — a classic historical use case was `Math.max.apply(null, arrayOfNumbers)` to find the max of an array before the spread operator existed (`Math.max(...arrayOfNumbers)` is the modern equivalent).

## `bind`: don't invoke, return a new permanently-bound function

```js
const boundIntroduce = introduce.bind(user, 'Hi');
console.log(boundIntroduce('!')); // "Hi, I'm Ada!" — `this` and first arg are pre-set
```

`bind` does not call the function. It returns a brand-new function with `this` permanently fixed to the given value — calling that new function later, in any context, will always use the bound `this`, ignoring whatever call-site would normally determine. Any extra arguments passed to `bind` beyond `this` are also pre-filled (partial application), and remaining arguments are supplied when the bound function is eventually called.

## Practical use case: borrowing array methods for array-like objects

Some objects "look like" arrays (they have indexed properties and a `length`) but aren't actual `Array` instances, so they don't have array methods like `.map`, `.filter`, `.forEach` — `arguments` inside a function and DOM `NodeList`s (in some contexts) are classic examples. You can "borrow" `Array.prototype` methods by explicitly setting `this` to the array-like object:

```js
function sumAll() {
  const argsArray = Array.prototype.slice.call(arguments); // borrow slice() to convert to a real array
  return argsArray.reduce((total, n) => total + n, 0);
}
console.log(sumAll(1, 2, 3)); // 6
```

In modern code, `Array.from(arguments)` or the spread operator (`[...arguments]`) supersede this pattern for converting array-likes, but the underlying "borrow a method via `call`" technique is still broadly useful and commonly asked about.

## Practical use case: partial application with `bind`

`bind` lets you pre-fill some arguments of a function, producing a more specific function:

```js
function multiply(a, b) { return a * b; }
const double = multiply.bind(null, 2); // `this` unused here, so null is fine
console.log(double(5)); // 10
console.log(double(21)); // 42
```

## Practical use case: fixing `this` in callbacks

```js
class Timer {
  constructor() {
    this.seconds = 0;
    this.tick = this.tick.bind(this); // lock `this` to the instance
  }
  tick() {
    this.seconds++;
    console.log(this.seconds);
  }
}
const t = new Timer();
setInterval(t.tick, 1000); // works correctly because tick is already bound
```

Without the `.bind(this)` in the constructor, passing `t.tick` directly to `setInterval` would detach it from `t`, and `this` inside `tick` would default to `undefined` (strict mode) when the timer invokes it.

## Writing a `myBind` polyfill

Implementing `bind` from scratch is a common interview exercise because it forces you to demonstrate real understanding of `this`, closures, argument handling, and `new`:

```js
Function.prototype.myBind = function(thisArg, ...boundArgs) {
  const originalFn = this; // the function myBind was called on
  return function(...callArgs) {
    return originalFn.apply(thisArg, [...boundArgs, ...callArgs]);
  };
};

function greet(greeting, name) { return `${greeting}, ${name}! this.x = ${this.x}`; }
const bound = greet.myBind({ x: 1 }, 'Hi');
console.log(bound('Sam')); // "Hi, Sam! this.x = 1"
```

Walking through it: `originalFn` captures the function being bound (via closure, since `this` inside `myBind` refers to whatever function it was called as a method on). The returned function is a closure over `originalFn`, `thisArg`, and `boundArgs`; when eventually called, it merges the pre-bound arguments with any new ones and invokes the original function with `apply`, forcing `this` to `thisArg`.

## How `bind` interacts with `new`

A subtlety real `bind` handles (and a from-scratch `myBind` above does not, by default): if a bound function is called with `new`, the explicitly bound `this` should be *ignored*, and the newly constructed object should be used instead — `new` binding takes precedence over any prior explicit binding. A spec-accurate polyfill needs to detect this case (usually by checking whether the function was invoked via `new`, e.g. with `new.target` or a prototype-chain check) and fall back to normal constructor behavior instead of forcing `thisArg`.
