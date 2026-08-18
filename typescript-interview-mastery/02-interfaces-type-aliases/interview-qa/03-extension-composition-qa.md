# Interview Q&A: Extension and Composition

**Q: How do you compose multiple shapes into one interface, and how does TypeScript handle conflicting members?**
A: List multiple interfaces after `extends`, comma-separated: `interface Invoice extends Timestamped, Identifiable { ... }`. Every member from each extended interface becomes required on the child. If two extended interfaces declare the same property name with incompatible types, TypeScript raises a compile error at the child interface's declaration — `Interface 'X' cannot simultaneously extend types 'A' and 'B'` — rather than silently picking one or merging them unsafely.

**Q: What's the type-alias equivalent of `interface extends`, and is the behavior identical?**
A: The intersection operator `&`: `type Invoice = Timestamped & Identifiable & { ... }`. The result is similar for well-behaved (non-conflicting) shapes, but the failure behavior differs: a type alias intersection with a conflicting property doesn't error at the type's definition — it silently resolves that property to `never`, and the error only surfaces later, when you try to construct or assign a value of the resulting type. `interface extends` catches the same conflict immediately and more clearly.

**Q: Why might you prefer several small "mixin" interfaces (`Timestamped`, `SoftDeletable`, `Identifiable`) over one large interface with all fields inline?**
A: Reuse and single-responsibility: cross-cutting concerns like timestamps or soft-deletion apply to many unrelated entities. Defining them once and composing them via `extends` avoids duplicating the same two or three fields across every entity interface, and lets you write functions that accept just the narrow concern they need (`function isDeleted(entity: SoftDeletable)`) rather than a specific concrete entity type — the function then works for any entity that happens to include that shape, with zero coupling to a class hierarchy.

**Q: Is there a limit to how many interfaces you can extend at once, or how deep an extension chain can go?**
A: No hard limit imposed by the language for realistic use — TypeScript resolves the full merged member set regardless of how many interfaces are listed or how deep the chain runs (e.g. `SuperAdmin extends Admin extends User`). In practice, very deep or very wide extension hierarchies become harder to reason about and are a code-smell signal to flatten or refactor into composition of smaller pieces, but this is a design concern, not a compiler limitation.
