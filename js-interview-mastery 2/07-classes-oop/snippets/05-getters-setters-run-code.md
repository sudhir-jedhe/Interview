# Snippet: getters/setters run code, they aren't plain data

```js
class Box {
  #value = 0;
  get value() { console.log("getter ran"); return this.#value; }
  set value(v) { console.log("setter ran"); this.#value = v < 0 ? 0 : v; }
}
const b = new Box();
b.value = -5;      // "setter ran"
console.log(b.value); // "getter ran"  then  0
```

`b.value = -5` looks like a plain field write but actually invokes the setter, which clamps negative values to `0` before storing.
