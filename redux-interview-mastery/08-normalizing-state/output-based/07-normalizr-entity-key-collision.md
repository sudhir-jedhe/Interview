## What does `entities` contain, and what's the subtle bug?

```javascript
import { schema, normalize } from 'normalizr';

// BUG: both schemas registered under the same key name, "users"
const authorSchema = new schema.Entity('users');
const assigneeSchema = new schema.Entity('users'); // typo/copy-paste: should probably differ, or should it?

const taskSchema = new schema.Entity('tasks', {
  author: authorSchema,
  assignee: assigneeSchema,
});

const task = {
  id: 't1',
  title: 'Fix bug',
  author: { id: 'u1', name: 'Ada' },
  assignee: { id: 'u2', name: 'Grace' },
};

const { entities } = normalize(task, taskSchema);
console.log(entities);
```

**Answer:**
```javascript
{
  users: {
    u1: { id: 'u1', name: 'Ada' },
    u2: { id: 'u2', name: 'Grace' },
  },
  tasks: {
    t1: { id: 't1', title: 'Fix bug', author: 'u1', assignee: 'u2' },
  },
}
```

**Why:** This is actually the *correct* and intended behavior, and the "bug" is a misconception about what's happening — a favorite interview gotcha precisely because it looks suspicious at first glance. `schema.Entity('users')` names an entity *type* by its plural key in the final `entities` object, not a unique per-field bucket. Both `author` and `assignee` reference a person, and people belong in the same `users` table regardless of which relationship field pointed at them — this is exactly the same "dedupe automatically" behavior from normalizing a post's author appearing both at the top level and inside a comment. If author and assignee were genuinely different entity *types* (e.g., a `Team` vs a `User`), you'd give them different schema key names (`new schema.Entity('teams')`) — but when they're the same underlying entity playing two different relational roles, sharing the schema key is correct, and each nested reference is correctly replaced with just the ID (`author: 'u1'`, `assignee: 'u2'`) while the actual data lives once, in `entities.users`.
