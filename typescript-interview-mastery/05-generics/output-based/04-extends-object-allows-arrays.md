```typescript
function describe<T extends object>(value: T): string {
  return Object.prototype.toString.call(value);
}

describe([1, 2, 3]);
describe(() => {});
describe({ a: 1 });
describe(42);
```

Which of these four calls fail to compile?

**Answer:** Only the last one, `describe(42)`, fails to compile. The array, the function, and the plain object all compile fine.

**Why:** `T extends object` is a much broader constraint than most people assume — in TypeScript's type system, `object` means "any non-primitive," which includes plain objects, arrays, functions, class instances, `Date`, `RegExp`, and so on. It excludes only `string`, `number`, `boolean`, `null`, `undefined`, `bigint`, and `symbol`. A common interview trap is assuming `extends object` means "plain record shape" and being surprised that arrays and functions satisfy it too. If the intent is genuinely "a plain key-value object," the correct constraint is something like `Record<string, unknown>` or a specific interface, not `object`. `describe(42)` fails because `number` is a primitive and therefore not assignable to `object` under any circumstance, regardless of `strict` mode settings.
