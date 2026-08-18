# Numeric vs string enums

**Q: What is reverse mapping, and which kind of enum has it?**
A: Reverse mapping is a bidirectional lookup TypeScript generates for numeric enums specifically — the compiled object maps names to values (`Status.Active` → `1`) and also values back to names (`Status[1]` → `"Active"`). String enums don't get this; their compiled object only maps name to value, in one direction, which is part of why string enums avoid the associated bugs.

**Q: Why does a numeric enum type accept a raw number that was never one of its declared members?**
A: Because a numeric enum's type is effectively just `number` for assignability purposes — TypeScript doesn't restrict the type to the specific declared values. `function f(x: SomeNumericEnum)` will happily accept `f(9999)` even if `9999` matches no member, which defeats the intuitive expectation that an "enum" type restricts you to its enumerated set.

**Q: Why does a string enum reject a plain string literal that matches a member's value exactly?**
A: String enums are nominal types — `SomeEnum` and `string` are treated as distinct, incompatible types by the assignability checker, even when a specific string value is runtime-identical to one of the enum's members. You must reference the enum member itself (`SomeEnum.Value`) or use an explicit cast to satisfy a parameter typed as that enum.

**Q: What real-world bug can happen if you insert a new member in the middle of an existing numeric enum?**
A: Every member declared after the insertion point silently shifts to a new auto-incremented value, because numeric enum values default to "one more than the previous member." If any of the old values were persisted somewhere (a database column, a serialized payload, a URL parameter) before the insertion, that stored value's meaning silently changes after the code is redeployed, with no compile error anywhere to flag it — a classic case of TypeScript's type safety not extending to data that predates a code change.
