```typescript
class Container<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  latest(): T | undefined {
    return this.items[this.items.length - 1];
  }
}

const c = new Container();
c.add(5);
c.add("six");
console.log(c.latest());
```

Does this compile? What is the inferred type of `c`?

**Answer:** It does not compile on the second `add` call. `c` is inferred as `Container<unknown>`, so `c.add(5)` compiles (any value is assignable to `unknown`), but that's misleading — the real issue interviewers want you to spot is different from what it looks like at first glance: `c.add("six")` also compiles for the same reason, and the code actually type-checks fine end to end.

**Why:** `new Container()` is called with no explicit type argument and no constructor parameter to infer `T` from, so TypeScript falls back to `T = unknown` for `c`. `unknown` accepts any value being assigned *into* it, so both `c.add(5)` and `c.add("six")` are valid — `Container<unknown>` behaves like a loosely-typed bag at the call site even though it's technically fully typed. The real gotcha is what happens on the way *out*: `c.latest()` returns `unknown`, not `string | number`, so you cannot call `.toFixed()` or `.toUpperCase()` on the result without first narrowing it. This is the practical cost of not pinning `T` explicitly (`new Container<number>()`) or giving the constructor a parameter TypeScript can infer from — `unknown` silently swallows the input type instead of preserving it, since there's no argument for the compiler to infer `T` from at construction time.
