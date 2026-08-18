# Union of Interfaces vs Intersection of Interfaces

Given two interfaces, `A | B` and `A & B` produce fundamentally different types with opposite semantics — this distinction is deceptively simple to state but easy to get wrong under interview pressure, especially when reasoning about which properties are accessible and which values actually satisfy each.

## Setup

```typescript
interface Cat {
  meow(): void;
  livesRemaining: number;
}

interface Dog {
  bark(): void;
  breed: string;
}
```

## Union: "one or the other" — access limited to common members

```typescript
type CatOrDog = Cat | Dog;

function describePet(pet: CatOrDog): void {
  // pet.meow();  // Error: Property 'meow' does not exist on type 'Dog'
  // pet.bark();  // Error: Property 'bark' does not exist on type 'Cat'

  if ("meow" in pet) {
    pet.meow(); // narrowed to Cat
  } else {
    pet.bark(); // narrowed to Dog
  }
}
```

A value of type `CatOrDog` is a **single value that is entirely one shape or the other** — a real `Cat` object, or a real `Dog` object, never a hybrid. Since `Cat` and `Dog` share no properties at all here, there is *nothing* accessible without narrowing.

## Intersection: "both at once" — a genuine hybrid required

```typescript
type CatDog = Cat & Dog;

function describeHybrid(pet: CatDog): void {
  pet.meow(); // no narrowing needed — always present
  pet.bark();  // no narrowing needed — always present
  console.log(pet.livesRemaining, pet.breed);
}

const hybrid: CatDog = {
  meow: () => console.log("meow"),
  bark: () => console.log("bark"),
  livesRemaining: 9,
  breed: "Mixed",
};
```

A value of type `CatDog` must implement **every** member of **both** `Cat` and `Dog` simultaneously — a single object satisfying both contracts at once. This is a meaningfully harder type to satisfy than either `Cat` or `Dog` alone (strictly more requirements), whereas the union `CatOrDog` is meaningfully *easier* to satisfy than requiring a specific one of them (either shape qualifies).

## The core mental model

Think in terms of the **set of values** each type describes: `A | B`'s value set is the *union* of `A`'s valid values and `B`'s valid values (bigger set, looser requirement, but less accessible without narrowing). `A & B`'s value set is the *intersection* — only values satisfying both simultaneously (smaller set, stricter requirement, but every member is always accessible without narrowing, since anything of type `A & B` definitionally has all of both). This is the direct type-level analog of set theory's union and intersection, and framing an interview answer this way ("union is broader/looser, intersection is narrower/stricter, and they're inversely related in terms of both how many values qualify and how much you can access without narrowing") tends to land clearly.

## Practical guidance

Use a union when modeling "exactly one of several distinct alternatives" (payment methods, API response outcomes, UI states) — almost always paired with a discriminant for ergonomic narrowing (see `03-discriminated-unions.md`). Use an intersection when modeling "this value must satisfy multiple independent, always-simultaneously-true requirements" — most commonly composing small, reusable shape fragments (timestamps, IDs, audit fields) into one concrete entity type, as covered in `02-intersection-types.md`.
