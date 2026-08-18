# Swap the two elements of a tuple

```typescript
// Generic over both positions of a 2-tuple
function swap<A, B>(pair: [A, B]): [B, A] {
  return [pair[1], pair[0]];
}

const coords: [number, string] = [51, "north"];
const swapped = swap(coords); // ["north", 51]

console.log(swapped);
```
