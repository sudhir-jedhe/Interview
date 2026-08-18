# strictPropertyInitialization requiring a constructor assignment

```typescript
class ShoppingCart {
  // Error without initialization: Property 'items' has no initializer
  // and is not definitely assigned in the constructor.
  private items: string[];

  constructor() {
    this.items = []; // satisfies strictPropertyInitialization
  }
}
```
