# Comparisons: Context API

### Prop drilling vs Context

| Aspect | Prop drilling | Context |
|---|---|---|
| Explicitness | Every intermediate component's props show the data flow | Data flow is implicit — you have to search for the Provider to know where a value comes from |
| Refactoring cost | Adding/removing a consumer deep in the tree requires touching every intermediate component | Add `useContext` anywhere below the Provider, no intermediate changes needed |
| Re-render behavior | Only components that actually receive the changed prop re-render (if intermediates are memoized) | Every consumer re-renders on value change, regardless of intermediate memoization |

Use prop drilling for data that only travels 1-3 levels — it's more explicit and traceable. Reach for Context when the same value is needed by many components scattered at different, unpredictable depths (theme, auth, locale). The most common mistake is reaching for Context immediately for any shared value, even ones only used by a parent and its direct child, adding indirection with no benefit.

### Context vs external state libraries (Redux/Zustand)

| Aspect | Context API | Redux / Zustand |
|---|---|---|
| Subscription granularity | Coarse — any value change re-renders all consumers | Fine-grained — selectors subscribe components only to the slice of state they read |
| Built-in tooling | None (no devtools, no middleware) out of the box | Devtools, middleware, time-travel debugging typically available |
| Setup overhead | Zero dependencies, built into React | Extra dependency, more boilerplate (though Zustand is minimal) |
| Best for | Low-frequency-update, broadly-read data (theme, auth, i18n) | High-frequency updates, complex state graphs, many components needing selective subscriptions |

Use Context for infrequently changing, widely shared data. Reach for an external store when state updates frequently and is read selectively by many components — Context's "everyone re-renders" behavior becomes a real performance problem at that point. The most common mistake is using Context as a full app-wide state manager for frequently changing data (e.g., form state, real-time data) and then fighting re-render performance instead of reaching for a selector-based store.

### Context + useState vs Context + useReducer

| Aspect | Context + `useState` | Context + `useReducer` |
|---|---|---|
| Update logic location | Scattered across whatever component calls `setX` | Centralized in one reducer function |
| Good for | Simple, independent pieces of state (a boolean, a string) | Multiple related state transitions, complex update logic |
| Dispatch stability | Each setter (`setX`) is stable across renders | `dispatch` is stable across renders, and can be split into its own context |

Use `useState` for small, single-purpose contexts (a toggle, a selected tab). Use `useReducer` when a provider manages several interrelated pieces of state with non-trivial transition logic — it centralizes the "how state changes" logic in one place instead of spreading multiple setter calls across consumers. The most common mistake is defaulting to `useReducer` for genuinely simple state, adding action-type boilerplate for no real benefit.
