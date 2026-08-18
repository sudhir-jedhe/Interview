```typescript
// widget.ts
export default class Widget {
  render() { return "<div>widget</div>"; }
}

export const VERSION = "2.1.0";
export function createWidget(): Widget {
  return new Widget();
}
```

```typescript
// consumer.ts
import Widget, { VERSION, createWidget } from "./widget";
import { default as AlsoWidget } from "./widget";

console.log(new Widget() instanceof AlsoWidget); // (1)
```

**Answer:** This compiles, and line (1) evaluates to `true` at runtime.

**Why:** A module can have exactly one default export alongside any number of named exports, and they're imported with different syntax in the same statement: the default import (`Widget`, no braces) can be given any local name, while named imports (`{ VERSION, createWidget }`) must match the exported names (unless explicitly aliased with `as`). Critically, `import Widget from "./widget"` and `import { default as AlsoWidget } from "./widget"` are two different *syntaxes* for importing the exact same binding — the module's default export — so `Widget` and `AlsoWidget` refer to the identical class, and `new Widget() instanceof AlsoWidget` is `true`. This demonstrates that "default export" isn't a separate export mechanism under the hood — it's a named export whose name happens to be the reserved identifier `default`, importable either via the special default-import shorthand or explicitly via `{ default as X }`.
