# Which of these compile?

```typescript
interface Reader { read(): string; }
interface Writer { write(data: string): void; }

const readerOnly: Reader = { read: () => "data" };

const readWrite: Reader & Writer = {
  read: () => "data",
  write: (data) => console.log(data),
};

const asUnion: Reader | Writer = readerOnly;   // line 1
const asIntersectionFromUnion: Reader & Writer = asUnion; // line 2
const asUnionFromIntersection: Reader | Writer = readWrite; // line 3
```

**Answer:** Lines 1 and 3 compile fine. Line 2 fails: `Type 'Reader | Writer' is not assignable to type 'Reader & Writer'.` (roughly — TypeScript reports that `Writer`'s missing `read` and `Reader`'s missing `write` each cause a mismatch, depending on which union branch is considered).

**Why:** `readerOnly` (a genuine `Reader`) is trivially assignable to `Reader | Writer` — satisfying at least one member of a union is exactly what a union type requires (line 1). Going the other direction, a value merely typed as `Reader | Writer` might, as far as the compiler knows, be *only* a `Reader` (missing `write`) or *only* a `Writer` (missing `read`) — it offers no guarantee of having both, so it cannot satisfy the stricter `Reader & Writer` requirement, which demands both members' full member sets simultaneously (line 2). Line 3 works because `readWrite` genuinely has both `read` and `write` — satisfying an intersection's full requirement is always sufficient to also satisfy the looser corresponding union, since having "both" trivially implies having "at least one." This asymmetry — intersection-to-union assignment always works, union-to-intersection assignment generally doesn't — is a direct consequence of the set-theoretic framing from `theory/04-union-vs-intersection-of-interfaces.md`: the intersection's value set is a *subset* of the union's value set, so intersection values are always usable where a union is expected, but not vice versa.
