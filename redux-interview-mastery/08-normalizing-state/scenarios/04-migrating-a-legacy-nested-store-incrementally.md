# Scenario: Migrating a Large, Legacy Nested Redux Store Without a Rewrite

You've inherited a five-year-old Redux app with a deeply nested `state.projects` tree: each project embeds its tasks, each task embeds its assignee and comments, each comment embeds its author. The tree is read and written from roughly 80 components and 30 reducers/thunks. A full rewrite is too risky to ship in one PR, but the nesting is now causing real problems: reducers are 200+ lines of nested spreads, and a recent incident involved a reducer bug that silently mutated shared state (an assignee object referenced from two different tasks), corrupting unrelated data.

## Approach:

**1. Don't attempt a big-bang rewrite.** Migrating 80 components and 30 reducers atomically is how migrations stall for months and accumulate merge conflicts. Instead, normalize incrementally, entity type by entity type, starting with whichever one is causing the most active pain — here, `comments` and `assignees`, since those were implicated in the recent incident.

**2. Introduce the normalized tables alongside the legacy shape, not instead of it, initially.** Add `state.entities.comments` and `state.entities.users` (via `createEntityAdapter`) populated by the *same* actions that currently update the nested tree, using a small adapter reducer that runs alongside the legacy one. Both shapes are correct and in sync during the transition — this is deliberately temporary duplication in service of a safe migration, not a normalization violation.

```javascript
// Root reducer, during migration: legacy tree AND new normalized tables both updated
const rootReducer = combineReducers({
  projects: legacyProjectsReducer, // old nested shape, unchanged for now
  entities: combineReducers({ comments: commentsAdapterReducer, users: usersAdapterReducer }),
});
```

**3. Migrate reader components first, one at a time, behind the safety of the still-correct legacy shape.** Point the comment-list component and the assignee-avatar component at the new normalized selectors instead of `state.projects...`. Since the legacy tree is still being kept correct in parallel, any regression is caught by comparing against the old UI's behavior, and you can revert a single component's selector without touching the reducer layer.

**4. Migrate writers next.** Once all *readers* of comments/users are off the legacy tree, redirect the dispatchers (the reducers/thunks that currently write into `state.projects[...].comments`) to write only into the normalized tables, and delete the now-dead legacy comment/assignee code from the projects reducer. This ordering (readers before writers) means you never have a window where data is written to the new shape but a component is still reading stale data from the old one.

**5. Repeat per entity type, prioritized by pain.** After `comments`/`users`, move to `tasks`, then `projects` themselves referencing tasks by ID. Each entity type's migration is independently shippable and revertable, and the codebase is never in a broken intermediate state — it's either "both shapes maintained" or "fully migrated," never "half-written."

**6. Directly address the mutation incident with the migration itself.** The original bug — an assignee object mutated in place because it was referenced (by object identity) from two nested tasks — becomes structurally harder to reintroduce once assignees are normalized: there's exactly one `users.byId[assigneeId]` object, updated via one adapter-generated reducer path (`updateOne`, Immer-safe), rather than N copies scattered through nested task objects that some old reducer might mutate directly.

**Result:** the migration ships incrementally over several sprints with no risky big-bang cutover, each step is independently revertable, and the specific mutation bug that motivated the project becomes structurally much harder to reintroduce.
