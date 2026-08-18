# Narrowing basics

**Q: What's the difference between `typeof` and `instanceof` narrowing, and when would you use each?**
A: `typeof` checks JavaScript's primitive type tags (`"string"`, `"number"`, `"boolean"`, `"object"`, `"function"`, `"undefined"`, `"bigint"`, `"symbol"`) and is the right tool for narrowing unions of primitives. `instanceof` checks an object's prototype chain and is the right tool for narrowing unions of class instances, including built-ins like `Error` subclasses — it doesn't work for primitives or plain object-literal shapes with no shared constructor.

**Q: Why doesn't `typeof` work to distinguish two object-literal shapes in a union, like `{ email: string }` vs `{ phone: string }`?**
A: Both are plain objects, so `typeof` on either returns `"object"` — there's no primitive-type difference to check. The `in` operator (checking for a distinguishing property key) or a shared literal discriminant field are the correct tools for narrowing unions of object shapes without a common constructor.

**Q: What does truthiness narrowing filter out, and why is it sometimes the wrong tool?**
A: `if (x)` filters out every falsy value at once: `undefined`, `null`, `0`, `""`, `NaN`, `false`. It's the wrong tool whenever one of those falsy values is a legitimate, meaningful value in your domain — e.g., `0` items in a cart, or an empty string that's a valid (if unusual) input — because the check silently conflates "value is missing" with "value happens to be falsy."

**Q: Can narrowing survive a reassignment of the narrowed variable later in the same function?**
A: No — TypeScript's control-flow analysis re-evaluates the variable's type at each point in the code based on everything that's happened up to that line, so a later reassignment (even to a differently-typed value within the original union) resets or changes what's narrowed from that point forward. Narrowing is a snapshot valid only for the code paths the compiler can trace, not a permanent label attached to the variable.
