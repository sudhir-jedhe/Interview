# Output: calling the parent's version via super

```js
class Shape {
  area() { return "not implemented"; }
}
class Circle extends Shape {
  area() { return super.area() + " (circle)"; }
}
console.log(new Circle().area());
```

**Answer:** `"not implemented (circle)"`

**Why:** `super.area()` explicitly invokes the parent class's version of the method rather than the overridden one, letting `Circle` extend rather than fully replace `Shape`'s behavior. This is the standard pattern for augmenting inherited logic instead of duplicating it.
