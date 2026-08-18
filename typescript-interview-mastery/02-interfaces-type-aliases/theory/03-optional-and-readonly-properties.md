# Optional and Readonly Properties

Both interfaces and type aliases support two property modifiers that control whether a property must be present (`?`) and whether it can be reassigned after creation (`readonly`). These are foundational for modeling real-world data accurately — most domain objects have a mix of required, optional, and immutable fields.

## Optional properties (`?`)

A property marked with `?` may be omitted entirely from an object satisfying the type. Its effective type becomes `T | undefined` when accessed, but critically, an optional property that's *omitted* is different from one explicitly set to `undefined` for things like `JSON.stringify` and `Object.keys`.

```typescript
interface UserProfile {
  id: number;
  bio?: string; // may be omitted
}

const minimal: UserProfile = { id: 1 };               // ok, bio omitted
const withBio: UserProfile = { id: 2, bio: "Engineer" }; // ok
const explicit: UserProfile = { id: 3, bio: undefined }; // also ok — `?` allows undefined explicitly

function printBio(profile: UserProfile): void {
  // profile.bio has type `string | undefined` — must be narrowed before string methods
  console.log(profile.bio?.toUpperCase() ?? "No bio");
}
```

Optional properties are the correct choice for fields that are genuinely sometimes-absent by design (a middle name, a discount code, an optional callback) — not as a workaround for "I'm not sure what type this is."

## Readonly properties

A property marked `readonly` can be set during object creation but cannot be reassigned afterward. This is a **compile-time-only** guarantee — it does not freeze the object at runtime (unlike `Object.freeze`), so it only protects against accidental mutation caught by the type checker, not against `as any` casts or non-TypeScript consumers.

```typescript
interface Order {
  readonly id: string;
  readonly placedAt: Date;
  status: "pending" | "shipped" | "delivered"; // mutable
}

function markShipped(order: Order): Order {
  // order.id = "new-id"; // Error: Cannot assign to 'id' because it is a read-only property
  return { ...order, status: "shipped" }; // must produce a new object instead
}
```

`readonly` composes with optional: `readonly bio?: string` is valid and means "may be absent, and if present, cannot be reassigned after creation."

## Readonly at the collection level

`readonly` also applies to array and tuple-typed properties, preventing mutation methods like `push`/`pop`/`splice`, not just reassignment of the property itself:

```typescript
interface ShoppingCart {
  readonly items: readonly string[]; // property is readonly AND the array contents are readonly
}

const cart: ShoppingCart = { items: ["sku-1", "sku-2"] };
// cart.items = [];        // Error: 'items' is read-only
// cart.items.push("sku-3"); // Error: Property 'push' does not exist on 'readonly string[]'
```

Note the difference between `readonly items: string[]` (can't reassign `items`, but the array it points to is still mutable via `cart.items.push(...)`) and `readonly items: readonly string[]` (neither reassignment nor mutation is allowed) — a subtle but frequently tested distinction.

## Deep immutability isn't automatic

Neither `?` nor `readonly` is recursive by default — a `readonly` property holding a nested object still allows mutating that nested object's own properties, unless the nested type is *also* marked readonly throughout:

```typescript
interface Address { street: string; }
interface Customer { readonly address: Address; }

const customer: Customer = { address: { street: "Main St" } };
// customer.address = { street: "Elm St" }; // Error — top-level reassignment blocked
customer.address.street = "Elm St";           // ALLOWED — nested mutation is not blocked
```

Achieving true deep immutability requires either recursively marking every nested field `readonly` by hand, or using a utility mapped type (see `09-utility-types`) that does so automatically.
