# Snippet: augmenting a third-party library's config interface

```typescript
// types/analytics-augmentation.d.ts
import "analytics-lib"; // side-effect import ties the augmentation to the real module

declare module "analytics-lib" {
  interface AnalyticsConfig {
    debugMode?: boolean; // field this app needs that the library doesn't declare
  }
}
```

```typescript
// setup.ts
import { init, AnalyticsConfig } from "analytics-lib";

const config: AnalyticsConfig = {
  debugMode: true, // compiles — merged in via augmentation
};

init(config);
```
