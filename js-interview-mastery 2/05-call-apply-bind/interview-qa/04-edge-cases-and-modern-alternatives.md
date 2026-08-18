# Interview Q&A: edge cases and modern alternatives

**Q: Why is `apply` sometimes preferred over the spread operator for forwarding arguments?**
In modern JS they're largely interchangeable for this purpose (`fn.apply(thisArg, argsArray)` vs `fn.call(thisArg, ...argsArray)`), but `apply` remains useful when you need to forward a genuinely dynamic, unknown-length array of arguments while also controlling `this`, particularly in code that predates spread syntax or needs to interoperate with array-like objects that aren't true arrays.

**Q: What error do you get if you pass a non-array-like second argument to `apply`?**
A `TypeError`, since `apply`'s second argument is internally processed via `CreateListFromArrayLike`, which requires an object (an array, array-like object, `null`, or `undefined`) — passing something like a bare number or a primitive that isn't array-like throws.
