# Does this compile?

```typescript
function format(value: string, upper: boolean): string;
function format(value: number, decimals: number): string;
function format(value: string | number, option: boolean | number): string {
  if (typeof value === "string" && typeof option === "boolean") {
    return option ? value.toUpperCase() : value;
  }
  if (typeof value === "number" && typeof option === "number") {
    return value.toFixed(option);
  }
  throw new Error("Invalid arguments");
}

const a = format("hello", true);   // line 1
const b = format(3.14159, 2);       // line 2
const c = format("hello", 2);       // line 3
```

**Answer:** Lines 1 and 2 compile fine. Line 3 fails: `No overload matches this call.` (followed by details on why each overload was rejected).

**Why:** Even though the implementation signature `format(value: string | number, option: boolean | number): string` would technically accept `("hello", 2)` at the type level (a `string` and a `number` both fit `string | number` and `boolean | number` respectively), **the implementation signature is never directly callable** — only the declared overload signatures above it define what callers can actually pass. Neither overload permits a `string` paired with a `number`: the first requires `(string, boolean)`, the second requires `(number, number)`. This is the precise rule from `theory/03-function-overloads.md`: the implementation signature exists solely so the function body typechecks against every legitimate combination, not to widen what's callable from outside.
