# Snippet: methods live on the prototype, not the instance

```js
class Dog {
  bark() { return "woof"; }
}
const d1 = new Dog();
const d2 = new Dog();
console.log(d1.bark === d2.bark);              // true, same function reference
console.log(Object.getPrototypeOf(d1) === Dog.prototype); // true
```

Every instance shares the exact same `bark` function object via the prototype chain — it isn't duplicated per instance, which is why `d1.bark === d2.bark` is `true`.
