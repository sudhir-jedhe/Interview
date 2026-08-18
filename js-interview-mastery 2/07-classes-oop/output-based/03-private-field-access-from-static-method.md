# Output: private field access from a static method

```js
class Foo {
  #secret = 42;
  static reveal(instance) { return instance.#secret; }
}
console.log(Foo.reveal(new Foo()));
```

**Answer:** `42`

**Why:** Private field access is scoped to the class body lexically, not to the instance — any code physically written inside the `Foo` class declaration can access `#secret` on any `Foo` instance, including a static method. Privacy in JS classes is about where the code lives, not which object is calling it.
