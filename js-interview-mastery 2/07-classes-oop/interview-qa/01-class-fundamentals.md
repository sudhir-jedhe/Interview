# Interview Q&A: class fundamentals

**Q: Is `class` in JavaScript a new object model, or sugar over something else?**
It's syntactic sugar over JavaScript's existing prototype-based inheritance. A class declaration creates a function (the constructor), and instance methods are attached to that function's `.prototype`, exactly as with pre-ES6 constructor functions. It adds real new capabilities on top though — strict mode by default, private `#` fields, and a hard requirement to use `new` — so it's not purely cosmetic.

**Q: What's the difference between instance fields and static fields?**
Instance fields are initialized per-object, typically in or alongside the constructor, and are only accessible via an instance (`this.field` or `obj.field`). Static fields live on the class itself, are shared across all instances, and are accessed via `Class.field` — they're conceptually class-level state, like a counter of how many instances were created.

**Q: What happens if a subclass doesn't define a constructor?**
JavaScript implicitly provides a default constructor that just calls `super(...args)` and forwards all arguments to the parent constructor. This is only a shorthand for the common case — if you need to do anything extra (initialize new fields, validate arguments) you must write an explicit constructor and call `super()` yourself.
