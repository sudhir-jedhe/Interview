# Snippet: Intersection of two type aliases

Shows `&` combining a base shape with an extension, the type-alias equivalent of interface extension.

```typescript
type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type Comment = Timestamped & {
  id: number;
  body: string;
};

const comment: Comment = {
  id: 1,
  body: "Great article!",
  createdAt: new Date(),
  updatedAt: new Date(),
};

console.log(comment.body);
```
