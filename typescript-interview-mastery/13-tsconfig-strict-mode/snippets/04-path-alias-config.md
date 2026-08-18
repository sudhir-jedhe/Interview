# Path alias configuration (tsconfig side)

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@lib/*": ["src/lib/*"]
    }
  }
}
```

```typescript
// usage in source (type-checks correctly, but needs a matching bundler alias to run)
import { formatCurrency } from "@lib/format";
```
