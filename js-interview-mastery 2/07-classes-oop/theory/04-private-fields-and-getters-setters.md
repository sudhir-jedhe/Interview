# Private fields (#) and getters/setters

## Private fields are truly private

Fields and methods prefixed with `#` are truly private — not just convention-hidden like `_field`, but syntactically inaccessible from outside the class, even via `Object.keys`, bracket access, or reflection. Accessing `obj.#field` outside the class body is a `SyntaxError`, not just `undefined`.

```js
class Account {
  #balance = 0;
  deposit(amount) { this.#balance += amount; return this.#balance; }
}
const a = new Account();
a.deposit(100);
console.log(a.#balance); // SyntaxError: Private field '#balance' must be declared in an enclosing class
```

```js
class Wallet {
  #cents = 0;
  add(n) { this.#cents += n; }
  get dollars() { return this.#cents / 100; }
}
const w = new Wallet();
w.add(150);
console.log(w.dollars);      // 1.5
console.log(w.cents);        // undefined (public "cents" was never defined)
console.log(Object.keys(w)); // [] — private fields never appear here
```

### Private fields are scoped to the class body, not the instance

Any code physically written inside the class declaration can access `#`-fields on *any* instance of that class, including from a static method:

```js
class Foo {
  #secret = 42;
  static reveal(instance) { return instance.#secret; }
}
console.log(Foo.reveal(new Foo())); // 42 — access is lexical, not instance-restricted
```

### Private fields are not inherited or overridden

Two classes' `#`-fields with the same name are entirely separate, independently-scoped fields:

```js
class Base {
  #id = "base";
  getId() { return this.#id; }
}
class Sub extends Base {
  #id = "sub";
}
const s = new Sub();
console.log(s.getId()); // "base" — getId is defined in Base, so it can only see Base's own #id
```

### Comparison: public fields vs `#` fields vs `_` convention

| Aspect | Public fields | `_prefix` convention | Private (`#`) fields |
|---|---|---|---|
| Accessible from outside | Yes | Yes (fully public) | No — `SyntaxError` if referenced outside the class body |
| Shows in `Object.keys`/`JSON.stringify` | Yes | Yes | No, never |
| Inherited/overridable by subclass with same name | Yes, normal shadowing rules | Yes, normal shadowing rules | No — each class's `#field` is independently scoped even with the same name |
| Enforcement | N/A | Purely social contract | Enforced by the language itself |

Use `#` fields for genuine internal state you never want external code touching (validated invariants, caches). Use public fields for anything meant to be part of the object's data contract. The common mistake is assuming `_field` naming provides real protection — it's purely a convention, fully readable/writable from anywhere, unlike true `#` privacy.

## Getters and setters

`get`/`set` define accessor properties that look like plain fields from the outside but run code on access — useful for validation or computed values without changing the calling API.

```js
class Temperature {
  #celsius = 0;
  get fahrenheit() { return this.#celsius * 9 / 5 + 32; }
  set fahrenheit(f) { this.#celsius = (f - 32) * 5 / 9; }
}
const t = new Temperature();
t.fahrenheit = 212;
console.log(t.fahrenheit); // 212, computed via getter each time
```

```js
class Box {
  #value = 0;
  get value() { console.log("getter ran"); return this.#value; }
  set value(v) { console.log("setter ran"); this.#value = v < 0 ? 0 : v; }
}
const b = new Box();
b.value = -5;         // "setter ran"
console.log(b.value); // "getter ran"  then  0
```

### Getters/setters vs plain methods

| Aspect | Getter/setter | Plain method |
|---|---|---|
| Call syntax | `obj.value` (no parens) | `obj.getValue()` |
| Can run validation/computation transparently | Yes | Yes, but requires explicit call |
| Shows up as a "field" in code that doesn't know internals | Yes | No, clearly a method call |

Use getters/setters when you want a computed or validated value to look like a plain property to consumers (e.g., swapping a stored field for a computed one without changing call sites). The common mistake is overusing getters for expensive operations — since they look like cheap field access, callers may invoke them repeatedly in loops without realizing real computation runs every time.
