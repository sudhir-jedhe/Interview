# Pick\<T, K\>, Omit\<T, K\>, Record\<K, V\>

These three build *new* object shapes: `Pick` and `Omit` select a subset of an existing type's keys, and `Record` constructs a fresh object type from a key set and a value type.

## `Pick<T, K>`

`Pick<T, K>` produces a type with only the keys in `K` (a union of string literal keys) taken from `T`. Use it when a function or component only needs a slice of a larger type and you want that slice to stay in sync with the source.

```typescript
interface Product {
  id: string;
  name: string;
  priceCents: number;
  description: string;
  warehouseLocation: string;
  supplierId: string;
}

type ProductCard = Pick<Product, "id" | "name" | "priceCents">;

function renderCard(product: ProductCard) {
  return `${product.name} — $${(product.priceCents / 100).toFixed(2)}`;
}
```

If `Product` later renames `priceCents`, `ProductCard` fails to compile until you fix the `Pick` list — that's the value: the subset type can never silently drift from the source.

## `Omit<T, K>`

`Omit<T, K>` is the complement: keep every key of `T` *except* those in `K`. It shines when you want "everything but a few sensitive or irrelevant fields," which is often more concise and more resilient to new fields than a `Pick` list.

```typescript
interface User {
  id: string;
  email: string;
  passwordHash: string;
  internalNotes: string;
  name: string;
}

type PublicUser = Omit<User, "passwordHash" | "internalNotes">;

function toPublicUser(user: User): PublicUser {
  const { passwordHash, internalNotes, ...publicFields } = user;
  return publicFields;
}
```

Note the trade-off versus `Pick`: if `User` gains a new sensitive field (say, `ssn`), `Omit` won't protect you automatically — the new field flows through to `PublicUser` unless you also add it to the omit list. `Pick` is safer against accidental leaks but more verbose; `Omit` is more concise but requires discipline when the source type grows.

## `Record<K, V>`

`Record<K, V>` builds an object type where every key in `K` (typically a union of string/number/symbol literals, or `string`) maps to a value of type `V`. It's the type-safe way to express "a dictionary with known keys" or "a lookup table."

```typescript
type Role = "admin" | "editor" | "viewer";

const rolePermissions: Record<Role, string[]> = {
  admin: ["read", "write", "delete"],
  editor: ["read", "write"],
  viewer: ["read"],
};
```

Because `Role` is a closed union, TypeScript enforces that `rolePermissions` has *exactly* those three keys — omit `viewer` and you get a compile error, not a runtime `undefined`. Compare this to a plain `{ [key: string]: string[] }` index signature, which would accept any string key and give no such completeness guarantee.

## Implementation sketch

```typescript
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type MyOmit<T, K extends keyof any> = MyPick<T, Exclude<keyof T, K>>;
type MyRecord<K extends keyof any, V> = { [P in K]: V };
```

`Pick` maps directly over the key subset `K`. `Omit` is actually built *on top of* `Pick` and `Exclude` in TypeScript's own lib definitions — it computes "all keys minus the excluded ones" and then picks those. `Record` maps over `K` and assigns the same value type `V` to every key. Seeing `Omit` as "`Pick` of `Exclude<keyof T, K>`" is a common interview follow-up and demonstrates you understand these utilities compose.
