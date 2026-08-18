# The Four Rules for `this`

`this` is not determined by where a function is *defined* — for regular functions it's determined by *how the function is called*. There are four binding rules, and remembering the order of precedence matters when more than one could apply.

**1. Default binding** — a plain function call with no context. In non-strict mode, `this` is the global object (`window` in browsers); in strict mode (or inside modules/classes, which are strict by default), it's `undefined`.

```js
function whoAmI() { console.log(this); }
whoAmI(); // non-strict: Window/globalThis; strict mode: undefined
```

**2. Implicit binding** — calling a function as a method of an object binds `this` to that object.

```js
const user = {
  name: 'Ada',
  greet() { console.log(this.name); }
};
user.greet(); // 'Ada' — this === user
```

This binding is easy to lose. If you extract the method into a standalone reference, it loses its object context and falls back to default binding:

```js
const greetFn = user.greet;
greetFn(); // this.name -> TypeError or undefined, this is no longer `user`
```

**3. Explicit binding** — `call`, `apply`, and `bind` let you set `this` directly (covered in depth in the dedicated call/apply/bind topic).

```js
function greet() { console.log(this.name); }
greet.call({ name: 'Grace' }); // 'Grace'
```

**4. `new` binding** — calling a function with `new` creates a brand-new object, sets `this` to that object inside the function, and (absent an explicit return of another object) returns it.

```js
function Person(name) {
  this.name = name;
}
const p = new Person('Linus');
console.log(p.name); // 'Linus'
```

**Precedence**, highest to lowest: `new` binding > explicit binding (`call`/`apply`/`bind`) > implicit binding (method call) > default binding.

## Comparison table

| Aspect | Implicit (`obj.method()`) | Explicit (`fn.call(obj)` / `.apply(obj)` / `.bind(obj)`) | `new` binding (`new Fn()`) |
|---|---|---|---|
| How `this` is set | Automatically, based on the object before the dot at call time | Manually specified as the first argument | A brand-new object is created and set as `this` |
| Can be overridden by another rule? | Yes — explicit and `new` binding both take precedence | `bind()` is permanent (a "hard" bound function can't be re-bound); `call`/`apply` are per-call | Highest precedence — always wins if `new` is used |
| Typical use case | Normal object method calls | Borrowing methods, fixing `this` for callbacks | Creating instances from a constructor function/class |

Understand the precedence order (`new` > explicit > implicit > default) because real bugs often come from an object method being passed as a callback, losing implicit binding, and needing to be re-bound explicitly. The common mistake is assuming a method keeps its `this` just because it "belongs" to an object — `this` binding happens at call time, not definition time (except for arrow functions — see the next file). For a from-scratch reimplementation of the rule these four cases interact with most, see `../problems/01-bind-context-polyfill.md`.
