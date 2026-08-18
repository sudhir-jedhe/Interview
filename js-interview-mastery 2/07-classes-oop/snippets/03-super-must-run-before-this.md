# Snippet: super() must run before `this` is used

```js
class Base {}
class Derived extends Base {
  constructor() {
    console.log(this); // ReferenceError: Must call super constructor before accessing 'this'
    super();
  }
}
```

In a derived class, `this` isn't created until `super()` runs — referencing it earlier throws, because there's genuinely nothing there yet.
