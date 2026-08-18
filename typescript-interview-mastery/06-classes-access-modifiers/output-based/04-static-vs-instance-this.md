```typescript
class Config {
  static env = "production";

  describe(): string {
    return this.env;
  }
}

const c = new Config();
console.log(c.describe());
```

Does this compile?

**Answer:** No. TypeScript reports `Property 'env' does not exist on type 'Config'. Did you mean to access the static member 'Config.env' instead?`

**Why:** `static env` belongs to the `Config` class/constructor function itself, not to instances — `this` inside an instance method (`describe`) refers to the instance, and instances have no `env` property, only the class does. This is a very common slip when refactoring a field between static and instance, since the syntax difference (`static env` vs `env`) is small but the access path is completely different (`Config.env` vs `this.env`). The fix is either `return Config.env;` (referencing the class by name) or, if the intent was genuinely per-instance state, dropping `static` from the field declaration so `this.env` becomes valid.
