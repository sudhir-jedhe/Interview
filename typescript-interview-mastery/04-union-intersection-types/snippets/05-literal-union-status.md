# Snippet: Literal union as a lightweight status enum

Shows a `type` literal union restricting a variable to a fixed set of valid string values.

```typescript
type TaskStatus = "todo" | "in_progress" | "done";

function nextStatus(current: TaskStatus): TaskStatus {
  if (current === "todo") return "in_progress";
  if (current === "in_progress") return "done";
  return "done"; // already done
}

console.log(nextStatus("todo"));         // "in_progress"
console.log(nextStatus("in_progress"));  // "done"
```
