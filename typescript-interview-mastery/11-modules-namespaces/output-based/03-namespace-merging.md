```typescript
namespace Shapes {
  export interface Circle {
    radius: number;
  }
}

namespace Shapes {
  export function area(c: Circle): number {
    return Math.PI * c.radius ** 2;
  }
}

const c: Shapes.Circle = { radius: 2 };
console.log(Shapes.area(c));
```

**Answer:** This compiles and runs fine, printing approximately `12.566`. Both `namespace Shapes { ... }` blocks contribute to the *same* `Shapes` namespace — `Circle` (declared in the first block) is visible and usable inside the second block without any import or qualification.

**Why:** Like interfaces, namespaces with the same name — even across separate `namespace` blocks, whether in the same file or split across multiple files included in the same program — are merged by the compiler into one combined namespace containing every exported member from every block. This is the same declaration-merging mechanism that powers module augmentation (topic covered later in this file set): TypeScript doesn't treat a repeated `namespace Foo` or `interface Foo` declaration as a redeclaration error; it treats it as "add these members to the existing `Foo`." In practice this lets large `.d.ts` files split a namespace's declarations across multiple files for organization, all merging back into one logical namespace at compile time.
