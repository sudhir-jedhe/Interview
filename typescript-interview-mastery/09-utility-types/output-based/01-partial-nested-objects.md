```typescript
interface Address {
  street: string;
  city: string;
}

interface Customer {
  name: string;
  address: Address;
}

type PartialCustomer = Partial<Customer>;

const update: PartialCustomer = {
  address: { street: "123 Main St" }, // is this valid?
};
```

**Answer:** This does NOT compile. `Partial<Customer>` only makes the top-level properties (`name`, `address`) optional — it does not recurse into `address`. So `address`, if present, must be a *complete* `Address` object with both `street` and `city`. The error is: `Property 'city' is missing in type '{ street: string; }' but required in type 'Address'`.

**Why:** `Partial<T>` is a shallow mapped type: `{ [K in keyof T]?: T[K] }`. It rewrites the `?` modifier only on the keys of `T` itself; the value type `T[K]` — here, `Address` — is copied through unchanged, optionality and all. To get recursive optionality you need a custom `DeepPartial<T>` that applies `Partial` again to any property whose value is itself an object, which is exactly the kind of recursive mapped type covered in topic 10's `DeepReadonly` problem.
