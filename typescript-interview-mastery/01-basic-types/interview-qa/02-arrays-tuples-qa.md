# Interview Q&A: Arrays and Tuples

**Q: Is there any functional difference between `string[]` and `Array<string>`?**
A: No — they're fully equivalent, compiled and checked identically by TypeScript. `T[]` is shorthand syntax for `Array<T>`. The choice is purely stylistic; some teams prefer `T[]` for simple element types and `Array<T>` for complex unions or generics-heavy code, for readability.

**Q: What's the difference between an array type and a tuple type?**
A: An array type (`T[]`) describes a collection of arbitrary, unbounded length where every element shares the same type. A tuple type (`[T1, T2, ...]`) describes a fixed-length collection where each position has its own, potentially distinct, type. Choose tuples when order and position carry semantic meaning (coordinates, key-value pairs, positional CSV fields); choose arrays when you have a homogeneous, variable-length list.

**Q: How do you make a tuple element optional, and how does that affect the tuple's length?**
A: Append `?` to the element, e.g. `type Name = [first: string, last?: string]`. This makes the tuple's valid length either 1 or 2 — `["Cher"]` and `["Ada", "Lovelace"]` both satisfy the type. Optional elements must come after all required elements (you can't have a required element after an optional one in the same tuple).

**Q: How would you type a function's rest parameters versus a tuple with a rest element — what's the difference?**
A: Function rest parameters (`function f(...args: number[])`) capture "zero or more trailing arguments of the same type" at the call site. A tuple rest element (`type T = [first: string, ...rest: number[]]`) does the same thing but as a reusable type describing an array/tuple value itself, not a parameter list. They share the same `...T[]` syntax and the same "variable-length tail, single element type" semantics, and in fact a function's parameter list *is* internally represented as a tuple type by TypeScript — which is why you can write `type Params = Parameters<typeof someFunction>` and get back a tuple type matching that function's parameter list.
