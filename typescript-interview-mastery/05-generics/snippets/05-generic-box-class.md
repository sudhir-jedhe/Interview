# A minimal generic container class

```typescript
// Wraps a single value of any type T, fully typed on get/set
class Box<T> {
  constructor(private value: T) {}

  get(): T {
    return this.value;
  }

  set(next: T): void {
    this.value = next;
  }
}

const box = new Box(100);
box.set(200);
console.log(box.get()); // 200
```
