# JavaScript's `#private` Fields vs TypeScript's `private`

JavaScript itself (as of ES2022, independent of TypeScript) has native private class fields using a `#` prefix. Unlike TypeScript's `private` keyword, `#field` is enforced by the JavaScript engine at runtime — there is no way to access it from outside the class, not even with bracket notation, reflection, or `Object.keys`.

```typescript
class Counter {
  #count = 0;

  increment(): void {
    this.#count++;
  }

  get value(): number {
    return this.#count;
  }
}

const c = new Counter();
c.increment();
console.log(c.value);   // 1
console.log(c["#count"]); // undefined — there is no property literally named "#count"
// console.log(c.#count); // Error at compile time too, and would fail at runtime if forced
```

## The critical difference

- TypeScript `private field: T` — a normal JS property under the hood, protection is compile-time only, fully readable/writable via bracket notation or by anyone using the compiled output directly.
- JavaScript `#field: T` — a genuinely distinct kind of class element at the language level, invisible outside the class body, not enumerable, not accessible via `[]`, `Object.keys`, `JSON.stringify`, or `Reflect.ownKeys`.

```typescript
class TsPrivateExample {
  private secret = "ts-private";
}
class JsPrivateExample {
  #secret = "js-private";
}

const a = new TsPrivateExample();
const b = new JsPrivateExample();

console.log(Object.keys(a)); // ["secret"] — still enumerable, still there
console.log(Object.keys(b)); // [] — #secret is invisible to introspection entirely
console.log(a["secret"]);    // "ts-private" — accessible
// console.log(b["#secret"]); // undefined; there's no way in, even by guessing the name
```

## Why you'd still choose TypeScript `private` over `#field`

Despite being "fake," TypeScript's `private` has practical advantages: it works with older compilation targets without extra runtime cost, it plays more smoothly with certain decorator and serialization libraries that expect ordinary properties, and it gives clearer compiler error messages during refactors. `#field`, being a true runtime construct, is the right choice when you need actual security-relevant encapsulation (data that must never leak even if someone bypasses the type checker, e.g. via `any` or by consuming your compiled JS from plain JavaScript) or when you want fields to be truly invisible to serialization and debugging tools.

## Interaction with subclassing

Neither `#field` nor TypeScript `private` is visible to subclasses — both are stricter than `protected` in that respect. But `#field` also isn't visible to *other instances of the same class* via normal property access patterns some developers expect from `private` in other languages — actually, `#field` IS accessible from another instance of the same class, since visibility is scoped to the class body, not the instance, matching how TypeScript's `private` behaves too.

```typescript
class Money {
  #cents: number;
  constructor(cents: number) { this.#cents = cents; }

  add(other: Money): Money {
    return new Money(this.#cents + other.#cents); // ok — same class body
  }
}
```

## Why this matters in interviews

A frequent live-coding prompt is "show me the difference between TS `private` and JS `#private`" — the expected demonstration is exactly the `a["secret"]` vs `b["#secret"]` contrast above, plus the explanation that TS `private` is a `tsc`-only concept while `#field` is real ECMAScript, enforced by V8/SpiderMonkey/JavaScriptCore themselves, with zero dependency on TypeScript at all.
