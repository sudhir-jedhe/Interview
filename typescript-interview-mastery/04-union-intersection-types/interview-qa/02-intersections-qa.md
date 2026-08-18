# Interview Q&A: Intersection Types

**Q: What does `A & B` mean for two object types, in plain terms?**
A: A value of type `A & B` must satisfy both `A` and `B` simultaneously — it needs every property from `A` and every property from `B`, merged into one flat requirement. This is stricter (harder to satisfy) than either `A` or `B` alone, since it demands strictly more from any value claiming the type.

**Q: What happens when you intersect two object types that declare the same property with conflicting primitive types?**
A: The conflicting property's type becomes the intersection of the two conflicting types, which for genuinely incompatible primitives (like `string & number`) resolves to `never` — since no value can be both simultaneously. Critically, this doesn't error where the intersection type itself is *declared*; it only surfaces later, when you actually try to construct or assign a value of that type, since a `never`-typed property can never be satisfied by any real value.

**Q: How does `A & B` differ from `A & B` when `A` and `B` are compatible (non-conflicting) shapes, versus a union `A | B` of the same two types?**
A: For non-conflicting shapes, `A & B` produces a type requiring every member of both — a strictly narrower (smaller) set of valid values than either `A` or `B` alone, but every property from both is always accessible with no narrowing needed. `A | B`, in contrast, produces a strictly wider (larger) set of valid values (satisfying either one is enough), but only properties common to both are accessible without first narrowing to figure out which specific member you actually have.

**Q: What's a typical real-world use case for intersection types?**
A: Composing small, reusable "mixin" shapes into a concrete type — for example, combining a `Timestamped` shape (`createdAt`, `updatedAt`) and an `Identifiable` shape (`id`) into every domain entity that needs both, without repeating those fields on each entity's own declaration. It's the type-alias equivalent of an interface extending multiple base interfaces at once, useful whenever a value needs to simultaneously satisfy several independent, cross-cutting shape requirements.
