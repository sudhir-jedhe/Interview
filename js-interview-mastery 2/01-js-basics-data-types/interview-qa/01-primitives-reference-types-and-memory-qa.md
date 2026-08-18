# Interview Q&A — Primitives, Reference Types, and Memory

**Q: What are the primitive types in JavaScript?**
There are seven: `string`, `number`, `boolean`, `null`, `undefined`, `symbol` (ES2015), and `bigint` (ES2020). All other values, including arrays and functions, are of type `object` under the hood. Primitives are immutable and compared/copied by value.

**Q: What's the difference between primitive and reference types in terms of memory?**
Primitives are stored directly wherever the variable lives (stack-like storage) and are copied by value on assignment. Reference types are stored in the heap, and the variable only holds a reference (pointer) to that memory location — so assigning one variable to another copies the pointer, and both variables end up referring to the same underlying object.

**Q: Are objects passed by reference or by value in JavaScript?**
Strictly speaking, JavaScript is always "pass by value" — but for objects, the value being passed is a reference (a pointer) to the object. So reassigning the parameter inside a function doesn't affect the caller's variable, but mutating a property on the object does, because both the caller and the function are pointing at the same underlying object.

**Q: What does `const` actually guarantee?**
`const` only prevents reassignment of the variable binding itself — `const x = 5; x = 6;` throws. It says nothing about the mutability of the value if it's an object or array: `const arr = []; arr.push(1);` is perfectly legal, because `arr` still points to the same array, you're just mutating its contents.
