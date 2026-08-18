```typescript
// tsconfig: strict: true (includes strictPropertyInitialization)
class ReportGenerator {
  private title: string;

  setTitle(t: string) {
    this.title = t;
  }

  render(): string {
    return `Report: ${this.title}`;
  }
}
```

Does this compile?

**Answer:** No — `Property 'title' has no initializer and is not definitely assigned in the constructor.`

**Why:** `strictPropertyInitialization` requires every non-optional class property to be provably assigned by the time the constructor finishes — either via a default value at the declaration site, or an assignment on every code path through the constructor. Here, `title` is only ever set by `setTitle`, a method that might never be called before `render()` reads `this.title`. TypeScript can't prove `title` is always set, and it's right to be suspicious: `new ReportGenerator().render()` would genuinely produce `"Report: undefined"` at runtime, contradicting the declared type `string`. Fixes: give it a default (`private title = "";`), make it optional (`private title?: string;` and handle the possibly-missing case in `render`), or require it via the constructor (`constructor(private title: string) {}`).
