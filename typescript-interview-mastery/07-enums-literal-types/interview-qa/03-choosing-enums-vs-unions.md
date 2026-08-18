# Choosing between enums and literal unions

**Q: Name three concrete advantages literal unions have over enums.**
A: Smaller runtime footprint (a literal union produces zero runtime code, whereas a non-const enum generates a real object); easier composition with other unions/types using ordinary `|`/`&` syntax, since literal types are just regular types with no special enum machinery; and no import/conversion friction — raw strings from JSON, form inputs, or URLs are directly compatible with a literal union, whereas an enum requires the value to go through the enum's own symbol or an explicit cast.

**Q: Is there ever a good reason to still use an enum instead of a literal union?**
A: Yes — when you want IDE-discoverable, namespaced dot-access (`OrderStatus.` autocompletes every member clearly, in a way that's sometimes less obvious with a bare union type), or when working within a framework/codebase that already idiomatically uses enums, where consistency with the surrounding code outweighs the general-purpose advantages of a union.

**Q: How would you force a compile error if a developer adds a new member to a status union but forgets to update a corresponding "display label" map?**
A: Type the label map explicitly as `Record<StatusUnion, string>` rather than letting it be inferred loosely, and build it as an object literal (not populated dynamically). `Record<T, V>` requires every member of `T` to have a corresponding key, so omitting the new status's label fails to compile at the object literal itself, catching the gap immediately rather than at runtime when someone looks up a missing key and gets `undefined`.

**Q: If you need both a type for compile-time checking and a real array to iterate over at runtime (e.g., to populate a dropdown), which pattern do you reach for and why not just use an enum?**
A: `const VALUES = [...] as const;` paired with `type T = (typeof VALUES)[number];` — this gives you a real, iterable runtime array (`VALUES.map(...)`, `VALUES.includes(...)`) and a precise literal-union type derived from the same single source, with no duplication. An enum also gives you both a runtime object and a type from one declaration, but with the tradeoffs discussed elsewhere (reverse mapping for numeric enums, nominal-type friction for string enums) that this pattern avoids entirely.
