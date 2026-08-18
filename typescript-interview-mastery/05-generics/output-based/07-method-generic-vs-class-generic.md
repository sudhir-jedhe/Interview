```typescript
class Wrapper<T> {
  constructor(private value: T) {}

  map<U>(fn: (value: T) => U): Wrapper<U> {
    return new Wrapper(fn(this.value));
  }

  get(): T {
    return this.value;
  }
}

const w = new Wrapper(10);
const mapped = w.map((n) => n.toString().padStart(3, "0"));

console.log(mapped.get());
```

What is the type of `mapped`, and what does `mapped.get()` print?

**Answer:** `mapped` is `Wrapper<string>`. `mapped.get()` prints `"010"`.

**Why:** This exercises the difference between a type parameter declared on the *class* (`T`, fixed once at construction — here `T = number` from `new Wrapper(10)`) and a type parameter declared on a *method* (`U`, fresh and independently inferred on every call to `map`). `map`'s callback receives `this.value: T` (a `number`) and returns a `string` (from `.toString().padStart(...)`), so `U` is inferred as `string` for that call, and `map` returns a brand-new `Wrapper<string>` — the original `w: Wrapper<number>` is untouched. This is the same shape as `Array.prototype.map`: the array's element type and the callback's return type are independent type parameters, one fixed by the receiver, one inferred fresh per call, which is exactly what lets `.map` change the element type of the result.
