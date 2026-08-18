# Switch-based narrowing over a discriminated union

```typescript
// Each case narrows `action` to the matching variant
type Action =
  | { type: "increment"; amount: number }
  | { type: "reset" };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case "increment":
      return state + action.amount; // action: { type: "increment"; amount: number }
    case "reset":
      return 0;
  }
}

console.log(reducer(5, { type: "increment", amount: 3 })); // 8
```
