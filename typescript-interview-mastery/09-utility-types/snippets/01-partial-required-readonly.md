# Snippet: Partial, Required, Readonly in a settings pipeline

```typescript
// Merge partial user overrides into required, fully-populated, readonly settings.

interface EditorSettings {
  fontSize: number;
  tabWidth: number;
  theme: "light" | "dark";
}

const defaultSettings: Required<EditorSettings> = {
  fontSize: 14,
  tabWidth: 2,
  theme: "light",
};

function applyOverrides(overrides: Partial<EditorSettings>): Readonly<EditorSettings> {
  return { ...defaultSettings, ...overrides };
}

const settings = applyOverrides({ fontSize: 16 });
// settings.fontSize = 18; // Error: read-only property
console.log(settings.fontSize, settings.theme); // 16 "light"
```
