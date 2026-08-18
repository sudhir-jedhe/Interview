# Demonstrate TS `private` (compile-time only) vs JS `#private` (runtime-enforced)

## Problem

Write two versions of a small class holding a sensitive value — one using TypeScript's `private` keyword, one using JavaScript's native `#field` syntax — and demonstrate concretely that the TS version's "private" field is still reachable at runtime, while the `#field` version's is not.

## Solution

```typescript
class TsPrivateToken {
  private constructor(private readonly token: string) {}

  static issue(token: string): TsPrivateToken {
    return new TsPrivateToken(token);
  }
}

class JsPrivateToken {
  #token: string;

  constructor(token: string) {
    this.#token = token;
  }
}

const tsInstance = TsPrivateToken.issue("ts-secret-abc");
const jsInstance = new JsPrivateToken("js-secret-xyz");
```

## Demonstration

```typescript
// TypeScript blocks dot-notation access to `private`...
// tsInstance.token; // Error: 'token' is private

// ...but bracket notation bypasses it completely, at both compile time and runtime:
console.log(tsInstance["token"]); // "ts-secret-abc" — leaked

// JSON.stringify also leaks it, because `private` doesn't affect enumerability:
console.log(JSON.stringify(tsInstance)); // {"token":"ts-secret-abc"}

// Now the JS #private version:
// jsInstance.#token; // Error at compile time, AND would fail at runtime if forced
console.log(jsInstance["#token"]);        // undefined — no such accessible property
console.log(JSON.stringify(jsInstance));  // {} — #token is not enumerable, doesn't appear
console.log(Object.keys(jsInstance));     // [] — invisible to reflection entirely
```

## Discussion

Both classes look equally "private" at the type-checking level — TypeScript rejects `tsInstance.token` and `jsInstance.#token` with a compile error either way. The difference only becomes visible once you route around the type checker (bracket notation, `JSON.stringify`, `Object.keys`, or simply consuming the compiled `.js` output without `tsc` in the loop at all): the TS `private` field is a completely ordinary JavaScript property with zero runtime protection, while `#token` is a distinct language-level construct that the JavaScript engine itself refuses to expose outside the class body, under any access pattern. This is the concrete evidence behind the standard interview claim that TS `private` is "for your team," while `#field` is "for the runtime."
