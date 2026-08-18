# Snippet: Typed `this` parameter on a method

Shows a `this` parameter catching a detached-method call at compile time.

```typescript
interface Counter {
  count: number;
  increment(this: Counter): void;
}

const counter: Counter = {
  count: 0,
  increment(this: Counter) {
    this.count += 1;
  },
};

counter.increment();
counter.increment();
console.log(counter.count); // 2

// const detached = counter.increment;
// detached(); // Error: The 'this' context of type 'void' is not assignable to 'Counter'
```
