# A Constructor That Returns an Object Overrides `new`'s `this`

```js
function Person(name) {
  this.name = name;
  return { name: 'Overridden' };
}
const p = new Person('Alice');
console.log(p.name);
```

**Answer:** `'Overridden'`

**Why:** When a constructor function explicitly returns an **object**, `new` uses that returned object instead of the newly created `this` object. Had the function returned a primitive (string, number, etc.) instead, `new` would ignore it and return the constructed `this` object as usual.
