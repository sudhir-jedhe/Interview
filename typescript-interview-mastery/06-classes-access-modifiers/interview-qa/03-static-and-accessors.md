# Static members, getters/setters, and parameter properties

**Q: Why does `this.env` fail inside an instance method when `env` is declared `static`?**
A: `static` members belong to the class/constructor function itself, not to instances — there is exactly one copy, and it's accessed as `ClassName.member`, not `this.member` from inside a regular (non-static) method. `this` inside an instance method refers to the instance, which has no static members of its own; the fix is to reference the class by name (`Config.env`) or drop `static` if per-instance state was actually intended.

**Q: What's the benefit of a getter-only accessor (no setter) over a plain computed method?**
A: Purely ergonomic and semantic — `obj.area` reads like a property access rather than a method call (`obj.getArea()`), which better communicates "this is a derived value of the object," and it also makes the property automatically read-only from the outside: TypeScript rejects any assignment attempt to an accessor that has no setter, the same way it would for a `readonly` field.

**Q: What exactly does `constructor(private name: string)` do differently from a hand-written field declaration plus a constructor assignment?**
A: Functionally nothing — it's pure syntactic sugar. `constructor(private name: string) {}` compiles to a class with a `private name` field and a constructor body that assigns `this.name = name`, identical in every observable way (including at runtime) to writing `private name: string;` above the constructor and `this.name = name;` inside it. The shorthand just removes the duplication of declaring the field and re-typing the parameter separately.

**Q: Can a `static` member be `private`?**
A: Yes — access modifiers and `static` are independent and combine freely (`private static`, `protected static readonly`, etc.). A common pattern is `private static instance` paired with a `private constructor` and a `public static getInstance()` method, implementing the singleton pattern by funneling all construction through one controlled entry point.
