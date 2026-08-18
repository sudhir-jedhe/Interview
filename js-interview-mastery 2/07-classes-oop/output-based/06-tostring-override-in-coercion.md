# Output: toString override during string coercion

```js
class Vehicle {
  constructor(type) { this.type = type; }
  toString() { return `Vehicle(${this.type})`; }
}
const v = new Vehicle("car");
console.log(`${v}`);
console.log(v + "");
```

**Answer:** `"Vehicle(car)"` then `"Vehicle(car)"`

**Why:** Both template literal interpolation and string concatenation trigger JS's `ToPrimitive`/string-coercion machinery, which calls the object's `toString()` method (found via the prototype chain since it overrides `Object.prototype.toString`) when no `Symbol.toPrimitive` is defined. Overriding `toString` on a class changes how instances behave in any string-context conversion.
