# Snippet: stripping readonly and optionality with -readonly / -?

```typescript
// Strip both modifiers to get a fully mutable, fully required draft type.

interface FrozenDraft {
  readonly title?: string;
  readonly body?: string;
}

type EditableDraft = { -readonly [K in keyof FrozenDraft]-?: FrozenDraft[K] };
// { title: string; body: string }

const draft: EditableDraft = { title: "Hello", body: "World" };
draft.title = "Updated"; // legal — readonly stripped, and both fields required
```
