# Widening comparison: let vs const

```typescript
// Snippet showing widened vs literal types side by side
let status = "idle"; // type: string
const stage = "idle"; // type: "idle"

type Status = "idle" | "loading" | "done";

function setStatus(s: Status) {
  console.log(s);
}

// setStatus(status); // Error: string is not assignable to Status
setStatus(stage); // OK: "idle" is assignable to Status
```
