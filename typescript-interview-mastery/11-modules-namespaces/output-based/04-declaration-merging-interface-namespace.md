```typescript
class Builder {
  build(): string {
    return "built";
  }
}

namespace Builder {
  export const DEFAULT_OPTIONS = { verbose: false };
}

console.log(Builder.DEFAULT_OPTIONS.verbose); // (1)
const b = new Builder(); // (2)
```

**Answer:** Both lines compile and run fine. Line (1) prints `false`. Line (2) constructs a `Builder` instance normally.

**Why:** TypeScript allows a `class` and a `namespace` sharing the same name to merge: the namespace's exported members become "static-like" properties attached to the class's own value (not to instances). `Builder` the identifier now refers to both the class constructor *and* an object carrying `DEFAULT_OPTIONS`, because the compiler emits the namespace's members onto the same underlying JavaScript value the class compiles to. This is the mechanism behind the common `class`+`namespace` pattern for attaching related constants, types, or factory helpers to a class's name without needing a separate export — you'll see similar merging with `function`+`namespace` (used in `04-namespaces.md`'s example) and `enum`+`namespace`. It's a legitimate use of namespaces even in modern code, mainly seen in library type definitions rather than application code.
