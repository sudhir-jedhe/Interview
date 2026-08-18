# Snippet: ambient declaration for a tiny untyped library

```typescript
// types/slugify-lite.d.ts — describes a library with no bundled types
declare module "slugify-lite" {
  export default function slugify(input: string, separator?: string): string;
}
```

```typescript
// usage.ts
import slugify from "slugify-lite";

const slug: string = slugify("Hello World!", "-"); // "hello-world"
```
