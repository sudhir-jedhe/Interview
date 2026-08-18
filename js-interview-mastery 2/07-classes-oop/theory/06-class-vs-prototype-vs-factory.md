# class vs manual prototypes vs factory functions

Classes and manual prototypes are functionally near-identical — classes just add cleaner syntax, real private fields, and stricter semantics (strict mode, no calling without `new`, temporal dead zone). Factory functions build objects via closures instead of `new`+prototype, trading shared-method memory efficiency for a simpler mental model and no `this`-binding footguns.

## Comparison table

| Aspect | `class` | Manual prototypes | Factory functions |
|---|---|---|---|
| Syntax | Clean, familiar to OOP devs | Verbose (`Ctor.prototype.method = ...`) | Plain functions returning objects |
| `this` binding footguns | Yes (methods can lose `this` if detached) | Yes, same issue | No — closures capture variables directly, no `this` needed |
| True private state | Yes, via `#fields` | No native privacy (convention only, e.g. `_field`) | Yes, via closure variables |
| Memory per instance | Shared methods via prototype (efficient) | Shared methods via prototype (efficient) | Each instance gets its own copies of closured functions unless you manually share them (less memory efficient) |
| `instanceof` support | Yes | Yes | No, unless manually set up |

Use `class` for most everyday OOP code — it's the readable, standard choice and gets you real private fields. Use factory functions when you want closure-based privacy without dealing with `this` at all, or when building many lightweight objects where you don't need `instanceof`.

## The classic class footgun: detached methods lose `this`

```js
class Dog {
  bark() { return "woof"; }
}
const d1 = new Dog();
const d2 = new Dog();
console.log(d1.bark === d2.bark);                          // true, same function reference
console.log(Object.getPrototypeOf(d1) === Dog.prototype);  // true

const fn = d1.bark; // detach the method from its instance
// fn() would throw or return the wrong thing if bark() used `this`
```

The most common mistake with classes is detaching a method (`const fn = instance.method`) and calling it standalone, losing the `this` binding — factory functions with closures don't have this problem at all, since closured variables aren't tied to a call-site-determined `this`.

```js
// Factory function equivalent: no `this`, no detachment risk
function createDog() {
  return {
    bark() { return "woof"; }, // could also reference private closure vars instead of `this`
  };
}
```

## When to reach for each

- **`class`** — default choice for most application code: readable, standard, gives you real private state and `instanceof`.
- **Manual prototypes** — rarely written by hand today; mostly useful to understand because it's what `class` desugars to, and shows up in interview "implement inheritance without class" exercises (see `../problems/01-classical-inheritance-vs-es6-classes.md`).
- **Factory functions** — closures-based privacy without `this` footguns; good for many small, throwaway objects, or when you specifically want to avoid `instanceof`/prototype machinery.
