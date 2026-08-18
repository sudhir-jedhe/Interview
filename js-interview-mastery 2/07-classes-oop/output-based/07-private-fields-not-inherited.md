# Output: private fields are independently scoped per class

```js
class Base {
  #id = "base";
  getId() { return this.#id; }
}
class Sub extends Base {
  #id = "sub";
}
const s = new Sub();
console.log(s.getId());
```

**Answer:** `"base"`

**Why:** Private fields are not inherited or overridden the way regular properties are — `#id` in `Base` and `#id` in `Sub` are two entirely separate, independently-scoped fields that happen to share a name. `getId()` is defined in `Base`, so it can only ever see `Base`'s own `#id`, regardless of what `Sub` declares.
