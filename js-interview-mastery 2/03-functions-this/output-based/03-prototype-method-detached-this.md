# A Prototype Method Called Standalone

```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  return `${this.name} makes a sound.`;
};
const dog = new Animal('Rex');
const speak = dog.speak;
console.log(dog.speak());
try {
  console.log(speak());
} catch (e) {
  console.log(e.message);
}
```

**Answer:** `'Rex makes a sound.'` then (in strict mode) `"Cannot read properties of undefined (reading 'name')"`

**Why:** `dog.speak()` is a method call — implicit binding sets `this` to `dog`. `speak()` is called standalone; since class/prototype methods and modules are strict by default in most modern setups, `this` defaults to `undefined`, and accessing `this.name` throws.
