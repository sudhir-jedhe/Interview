# Comparisons: Classes & OOP

## Class-based vs prototype-based vs factory functions

| Aspect | `class` | Manual prototypes | Factory functions |
|---|---|---|---|
| Syntax | Clean, familiar to OOP devs | Verbose (`Ctor.prototype.method = ...`) | Plain functions returning objects |
| `this` binding footguns | Yes (methods can lose `this` if detached) | Yes, same issue | No — closures capture variables directly, no `this` needed |
| True private state | Yes, via `#fields` | No native privacy (convention only, e.g. `_field`) | Yes, via closure variables |
| Memory per instance | Shared methods via prototype (efficient) | Shared methods via prototype (efficient) | Each instance gets its own copies of closured functions unless you manually share them (less memory efficient) |
| `instanceof` support | Yes | Yes | No, unless manually set up |

Use `class` for most everyday OOP code — it's the readable, standard choice and gets you real private fields. Use factory functions when you want closure-based privacy without dealing with `this` at all, or when building many lightweight objects where you don't need `instanceof`. The most common mistake is detaching a class method (`const fn = instance.method`) and calling it standalone, losing the `this` binding — factory functions with closures don't have this problem at all.

## Instance methods vs static methods

| Aspect | Instance methods | Static methods |
|---|---|---|
| Called on | An instance (`obj.method()`) | The class itself (`Class.method()`) |
| Access to instance data | Yes, via `this` | No — no implicit instance context |
| Typical use | Behavior operating on that object's state | Factories, utilities, constants tied to the class conceptually |
| Inherited by subclasses | Yes, via prototype chain | Yes, via the class's own `[[Prototype]]` link to the parent class |

Use instance methods for anything that reads or mutates per-object state; use static methods for class-level utilities like `Array.from` or custom factory constructors (`User.fromJSON(json)`). The common mistake is calling an instance method as if it were static (`Class.method()` when `method` is only on `.prototype`) — it fails because static and prototype are two entirely separate property sets.

## Public fields vs private (`#`) fields

| Aspect | Public fields | Private (`#`) fields |
|---|---|---|
| Accessible from outside | Yes | No — syntax error if referenced outside the class body |
| Shows in `Object.keys`/`JSON.stringify` | Yes | No, never |
| Inherited/overridable by subclass with same name | Yes, normal shadowing rules | No — each class's `#field` is independently scoped even with the same name |
| Convention alternative | — | `_field` (soft-private, still fully accessible) |

Use `#` fields for genuine internal state you never want external code touching (validated invariants, caches). Use public fields for anything meant to be part of the object's data contract. The common mistake is assuming `_field` naming provides real protection — it's purely a convention, fully readable/writable from outside, unlike true `#` privacy.

## Getters/setters vs plain methods

| Aspect | Getter/setter | Plain method |
|---|---|---|
| Call syntax | `obj.value` (no parens) | `obj.getValue()` |
| Can run validation/computation transparently | Yes | Yes, but requires explicit call |
| Shows up as a "field" in code that doesn't know internals | Yes | No, clearly a method call |

Use getters/setters when you want a computed or validated value to look like a plain property to consumers (e.g., swapping a stored field for a computed one without changing call sites). The common mistake is overusing getters for expensive operations — since they look like cheap field access, callers may invoke them repeatedly in loops without realizing real computation runs every time.
