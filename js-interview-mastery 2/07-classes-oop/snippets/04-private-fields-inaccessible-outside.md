# Snippet: private fields are inaccessible outside the class

```js
class Wallet {
  #cents = 0;
  add(n) { this.#cents += n; }
  get dollars() { return this.#cents / 100; }
}
const w = new Wallet();
w.add(150);
console.log(w.dollars);        // 1.5
console.log(w.cents);          // undefined (public "cents" was never defined)
console.log(Object.keys(w));   // [] — private fields never appear here
```

`#cents` is only reachable through methods defined inside `Wallet`; there's no public property named `cents`, and enumeration APIs never see private fields at all.
