# Modeling a credential store where leaking a secret is a real security bug

Your app holds API tokens in memory for the duration of a session (e.g., a third-party OAuth token used to call a partner API). A `console.log(session)` anywhere in the codebase, an accidental `JSON.stringify(session)` sent to a logging service, or careless serialization must never leak the raw token — this goes beyond "help the team avoid mistakes," it's a real security requirement, which changes which privacy mechanism is appropriate.

**Approach:** TypeScript's `private` is compile-time only and would still show up in `JSON.stringify`/`Object.keys`/bracket access, so it's the wrong tool here despite being the "obvious" choice syntactically. Use JavaScript's `#field` instead, which is invisible to serialization, enumeration, and any bracket-notation access — genuine runtime protection.

```typescript
class Session {
  readonly userId: string;
  #accessToken: string;

  constructor(userId: string, accessToken: string) {
    this.userId = userId;
    this.#accessToken = accessToken;
  }

  authorizeRequest(headers: Record<string, string>): Record<string, string> {
    return { ...headers, Authorization: `Bearer ${this.#accessToken}` };
  }

  toJSON() {
    // Explicit allow-list — #accessToken can't leak even by accident,
    // because it isn't enumerable and this method doesn't reference it.
    return { userId: this.userId };
  }
}

const session = new Session("user_42", "sk_live_abc123");

console.log(JSON.stringify(session)); // {"userId":"user_42"} — token never appears
console.log(Object.keys(session));    // ["userId"] — #accessToken isn't enumerable
console.log(session["#accessToken"]); // undefined — no bracket-notation escape hatch

const headers = session.authorizeRequest({ "Content-Type": "application/json" });
```

If `#accessToken` had instead been declared `private accessToken: string` (TypeScript-only privacy), `JSON.stringify(session)` would include it by default — `JSON.stringify` serializes all own enumerable properties regardless of TypeScript-level `private`, since that modifier is erased before the code ever runs. The `toJSON()` override adds a second layer of defense (an explicit allow-list), but the `#` field is what makes leaking the token structurally impossible rather than just discouraged by convention.
