# Snippet: static members belong to the class, not instances

```js
class MathHelper {
  static PI_APPROX = 3.14;
  static double(n) { return n * 2; }
}
console.log(MathHelper.double(5));              // 10
console.log(new MathHelper().double);           // undefined, not inherited by instances
```

Static members live directly on the class function itself, not on `.prototype`, so instances have no access to them at all.
