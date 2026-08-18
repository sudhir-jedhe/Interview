# Interview Q&A: method borrowing and partial application

**Q: What is "method borrowing" and how do `call`/`apply` enable it?**
Method borrowing means calling a method that belongs to one type (usually `Array.prototype`) on an object of a different type by explicitly setting `this` to that object — for example, `Array.prototype.slice.call(arguments)` to convert the array-like `arguments` object into a real array. It works because most array methods don't check that `this` is truly an `Array`; they just require indexed properties and a `.length`.

**Q: What is partial application, and how does `bind` support it?**
Partial application means fixing some of a function's arguments ahead of time, producing a new function that only needs the remaining arguments. `bind` supports this natively: any arguments passed to `bind()` after the `thisArg` are pre-filled as the leading arguments of the returned function, e.g. `const double = multiply.bind(null, 2)`.
