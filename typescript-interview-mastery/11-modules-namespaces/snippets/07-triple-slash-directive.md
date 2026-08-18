# Snippet: a triple-slash reference in a standalone global .d.ts file

```typescript
// types/globals.d.ts — no import/export, so this is a "script", not a module
interface AppConfig {
  apiUrl: string;
}
```

```typescript
// types/window-extensions.d.ts
/// <reference path="./globals.d.ts" />

interface Window {
  __APP_CONFIG__: AppConfig; // AppConfig is visible here because of the reference above
}
```
