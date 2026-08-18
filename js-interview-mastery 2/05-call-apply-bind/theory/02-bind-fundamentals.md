# bind fundamentals

`bind` is the third member of the explicit-binding trio on `Function.prototype`, but it behaves fundamentally differently from `call`/`apply`: it does **not** invoke the function. Instead it returns a brand-new function with `this` permanently fixed to the given value.

```js
function introduce(greeting, punctuation) {
  return `${greeting}, I'm ${this.name}${punctuation}`;
}
const user = { name: 'Ada' };

const boundIntroduce = introduce.bind(user, 'Hi');
console.log(typeof boundIntroduce); // 'function' — not yet called
console.log(boundIntroduce('!'));   // "Hi, I'm Ada!" — `this` and first arg are pre-set
```

Calling the returned function later, in any context, will always use the bound `this`, ignoring whatever call-site would normally determine it. Any extra arguments passed to `bind` beyond `this` are also pre-filled (this is partial application — covered in its own theory file); remaining arguments are supplied when the bound function is eventually called.

## bind's this is permanent

Once a function has been bound, no later `call`/`apply`/`bind` can override that `this`:

```js
function whoAmI() { return this.label; }
const boundToA = whoAmI.bind({ label: 'A' });
console.log(boundToA.call({ label: 'B' })); // 'A' — call() cannot override an existing bind
```

Calling `.bind()` again on an already-bound function just wraps it in another layer — the original binding still wins when the function is finally invoked.

## Fixing `this` in callbacks

The most common real-world use of `bind` is preserving `this` when handing a method off to be called later by someone else's code (an event listener, `setTimeout`, `setInterval`):

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

Without the `.bind(this)` in the constructor, passing `t.tick` directly to `setInterval` would detach it from `t`, and `this` inside `tick` would default to `undefined` (strict mode) or the global object (sloppy mode) when the timer invokes it — not `t`.

## Quick comparison: call/apply vs bind

| Aspect | `call` / `apply` | `bind` |
|---|---|---|
| Invocation | Runs the function immediately | Does NOT run it — returns a new function |
| Return value | Whatever the function returns | A new, permanently-bound function reference |
| Reusability | One-time call | Reusable function you can call later, any number of times |
| Typical use | One-off invocation with a specific `this` | Fixing `this` for a callback, partial application |

The most common mistake is calling `bind()` and expecting it to execute the function right away — it doesn't; you get back a function you still have to call.
