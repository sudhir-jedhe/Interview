# Abstract classes, interfaces, and inheritance

**Q: Why would you choose an abstract class over an interface for a `Shape` hierarchy?**
A: An interface can only describe a shape's contract, never provide a real implementation — every subclass would have to duplicate any shared logic. An abstract class can mix `abstract` members (must be implemented by each subclass) with fully concrete members (shared, inherited as-is), which is the right fit when subclasses share genuine behavior, like a `describe()` method built on top of each subclass's own `area()`/`perimeter()`.

**Q: Can you instantiate an abstract class directly?**
A: No. `new AbstractClassName()` is a compile error — abstract classes exist to be extended, not instantiated. You can, however, declare a variable typed as the abstract class and assign it a concrete subclass instance, which is the normal way polymorphic code is written against the abstract type.

**Q: A class implements two interfaces that both declare a member named `log`, with different parameter types (`string` vs `number`). Does this ever compile?**
A: It can, if a single method's parameter type is broad enough to satisfy both — e.g., `log(arg: string | number): void` satisfies both `log(msg: string): void` and `log(value: number): void`, because a wider parameter accepts everything either narrower signature requires. It becomes genuinely unresolvable when the conflict is in a *property type* rather than a method parameter — e.g., one interface requiring `id: string` and another requiring `id: number` on the same class can never be satisfied by one value, since a single property can't simultaneously hold both types.

**Q: Does a class need the `implements` keyword to be assignable to an interface type?**
A: No — TypeScript uses structural typing, so any class (or plain object) whose shape matches an interface is assignable to that interface type, with or without `implements`. `implements` is valuable for two reasons: it documents intent, and it gives you an immediate compile error inside the class body if a required member is missing, rather than a possibly-confusing error later at some distant assignment site.
