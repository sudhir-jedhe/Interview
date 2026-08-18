# Union Types and Member Access Narrowing

A union type (`A | B`) describes a value that could be *either* `A` or `B` (or any other listed member) — TypeScript doesn't know which one at any given point unless you've proven it through narrowing. Understanding exactly what you can and can't do with a union-typed value before narrowing is one of the most fundamental and most-tested TypeScript skills.

## Declaring a union

```typescript
type PaymentMethod = "credit_card" | "paypal" | "bank_transfer";

interface CreditCardDetails {
  cardNumber: string;
  expiryDate: string;
}

interface PayPalDetails {
  email: string;
}

type PaymentDetails = CreditCardDetails | PayPalDetails;
```

## Before narrowing: only common members are accessible

When a value's type is a union of object shapes, TypeScript only lets you access properties that exist — with compatible types — on **every** member of the union. This is because, without narrowing, TypeScript doesn't know which branch of the union you actually have, so it only permits operations guaranteed safe for all of them.

```typescript
function describePayment(details: PaymentDetails): string {
  // details.cardNumber; // Error: Property 'cardNumber' does not exist on type 'PayPalDetails'
  // details.email;       // Error: Property 'email' does not exist on type 'CreditCardDetails'

  if ("cardNumber" in details) {
    return `Card ending in ${details.cardNumber.slice(-4)}`; // narrowed to CreditCardDetails
  }
  return `PayPal account: ${details.email}`; // narrowed to PayPalDetails
}
```

## Narrowing techniques

TypeScript recognizes several patterns as valid ways to narrow a union, each shrinking the union down to the branch consistent with the check:

```typescript
// typeof — for primitive unions
function formatId(id: string | number): string {
  return typeof id === "string" ? id.toUpperCase() : id.toFixed(0);
}

// instanceof — for class instances
class NotFoundError extends Error {}
class ValidationError extends Error {}

function handleError(error: NotFoundError | ValidationError): string {
  if (error instanceof NotFoundError) return "404: not found";
  return "422: validation failed"; // narrowed to ValidationError by elimination
}

// in — for object shape membership, as shown above with PaymentDetails

// Array.isArray — a specialized type guard for array vs non-array unions
function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
```

## Unions of primitives vs unions of objects

A union of primitive literal types (`"pending" | "shipped" | "delivered"`) behaves like a lightweight enum — every operation valid on `string` is valid on the union as long as you're not relying on a specific literal's behavior (covered further in `05-literal-unions-as-enums.md`). A union of object shapes is different: member access is restricted to the *intersection* of the object shapes' properties until narrowed, which is often surprising to developers coming from languages with structurally looser union handling.

## Why the "only common members" rule exists

If TypeScript allowed accessing `details.cardNumber` on a `CreditCardDetails | PayPalDetails` value without narrowing, and the actual runtime value happened to be a `PayPalDetails` object, the access would return `undefined` and any further use (like `.slice(-4)`) would crash. Restricting member access to the common surface until you've proven (via narrowing) which specific branch you're dealing with is exactly what makes unions safe to use for modeling "one of several possible shapes" — the compiler forces you to handle the ambiguity explicitly rather than assuming a particular branch.
