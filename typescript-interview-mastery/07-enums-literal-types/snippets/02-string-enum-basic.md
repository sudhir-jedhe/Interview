# String enum with explicit values

```typescript
// Every member requires an explicit string literal, no auto-increment
enum Theme {
  Light = "light",
  Dark = "dark",
  System = "system",
}

function applyTheme(theme: Theme): void {
  document.body?.setAttribute("data-theme", theme);
}

applyTheme(Theme.Dark);
```
