# Does this compile?

```typescript
let a: any = "hello";
let u: unknown = "hello";

let x: string = a;   // line 1
let y: string = u;   // line 2

let anyTarget: unknown = a; // line 3
let unknownTarget: any = u; // line 4
```

**Answer:** Line 2 fails to compile: `Type 'unknown' is not assignable to type 'string'.` Lines 1, 3, and 4 all compile fine.

**Why:** `any` is assignable *to* and *from* virtually every type, including `string` (line 1) and `unknown` (line 3) — it fully bypasses the type checker in both directions. `unknown`, by contrast, can be assigned *from* anything (which is why `let u: unknown = "hello"` works), but cannot be assigned *to* a more specific type like `string` without narrowing first — that's line 2's error. Line 4 works because `any` accepts an assignment from literally any type, including `unknown`, since `any` opts the target variable out of checking entirely. The asymmetry is the whole point of `unknown`: it's exactly as flexible as `any` for *receiving* values, but forces you to prove the type before *using* it as something more specific — which is what makes it the safe default for untrusted input.
