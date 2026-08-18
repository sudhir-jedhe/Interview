# Problem 3: Generate CSS-like Property Names with Template Literal Types

## Task

Given a union of sides, build a template literal type that generates every valid `border-<side>` property name (e.g. `border-top`, `border-bottom`), then extend it to also generate `border-<side>-width` and `border-<side>-color` variants. Use the result to type a style object.

```typescript
type Side = "top" | "right" | "bottom" | "left";
```

## Solution

```typescript
type BorderSideProperty = `border-${Side}`;
// "border-top" | "border-right" | "border-bottom" | "border-left"

type BorderModifier = "width" | "color";

type BorderProperty = `border-${Side}` | `border-${Side}-${BorderModifier}`;
// "border-top" | "border-right" | "border-bottom" | "border-left" |
// "border-top-width" | "border-top-color" |
// "border-right-width" | "border-right-color" |
// "border-bottom-width" | "border-bottom-color" |
// "border-left-width" | "border-left-color"

type BorderStyles = Partial<Record<BorderProperty, string>>;

const styles: BorderStyles = {
  "border-top": "1px solid black",
  "border-bottom-width": "2px",
  "border-left-color": "red",
};

// const invalid: BorderStyles = { "border-diagonal": "1px" };
// Error: 'border-diagonal' is not assignable — not a valid BorderProperty
```

**Why this works:** `` `border-${Side}` `` interpolates the four-member `Side` union into a template literal, producing the cross-product — one literal string per side. Unioning that with `` `border-${Side}-${BorderModifier}` `` (a second template literal interpolating both `Side` and `BorderModifier`) adds the two-part variants; TypeScript computes each template literal's expansion independently and then unions the two resulting sets of literals together. Feeding the combined `BorderProperty` union into `Record` (wrapped in `Partial` since a style object rarely sets every possible border property at once) gives you an object type where every key must be one of the generated, valid CSS-like property strings — a typo like `"border-diagonal"` is caught at compile time instead of silently producing a CSS property that does nothing in the browser.

**Extending further:** the same pattern scales to a fuller CSS-in-TS system — interpolating `Side` with `"margin"`/`"padding"` prefixes, or building responsive variants like `` `sm:${BorderProperty}` `` for a Tailwind-style breakpoint system — by adding more interpolated unions, while being mindful of the combinatorial explosion covered in this topic's output-based problem on that exact failure mode.
