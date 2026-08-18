# Type-safe filter with a predicate callback

```typescript
// Reimplements Array.prototype.filter's type signature
function filterItems<T>(items: T[], predicate: (item: T) => boolean): T[] {
  return items.filter(predicate);
}

interface Task {
  title: string;
  done: boolean;
}

const tasks: Task[] = [
  { title: "Write tests", done: false },
  { title: "Ship feature", done: true },
];

const pending = filterItems(tasks, (t) => !t.done); // Task[]

console.log(pending);
```
