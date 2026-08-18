```js
class AppError extends Error {
  constructor(msg) {
    super(msg);
  }
}
const e = new AppError("bad");
console.log(e.name);
console.log(e instanceof AppError, e instanceof Error);
```
**Answer:**
```
Error
true true
```
**Why:** `name` is not automatically set to the subclass name — `Error`'s constructor sets `this.name = "Error"` by default, and `AppError` never overrides it. `instanceof` still works correctly through the prototype chain regardless, since `AppError.prototype` inherits from `Error.prototype`.
