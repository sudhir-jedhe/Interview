# Comparisons: Custom Hooks

### Custom hooks vs Higher-Order Components (HOCs)

| Aspect | Custom hooks | HOCs (`withX(Component)`) |
|---|---|---|
| Composition style | Flat — call multiple hooks directly in the component body | Nested wrapping — each HOC adds a layer to the component tree ("wrapper hell") |
| Prop naming collisions | None — hooks return values you name yourself, no prop injection | Possible — two HOCs injecting the same prop name silently conflict |
| Debugging | Values are visible directly in the component's own scope | Extra layers show up in React DevTools tree, harder to trace which HOC provided what |

Prefer custom hooks for new code — they're more composable and don't add extra component layers or obscure prop origins. HOCs are still seen in older codebases and some library integrations (e.g., `connect()` from older Redux patterns) but are largely superseded by hooks for logic reuse. The most common mistake is combining several HOCs on one component and losing track of which one injects which prop.

### Custom hooks vs Render Props

| Aspect | Custom hooks | Render props |
|---|---|---|
| Syntax | Direct function call, destructure the return value | Component takes a function-as-child/prop, JSX nesting required |
| Nesting depth in JSX | None added | Adds a level of JSX nesting per render-prop component used |
| Conditional hook usage | Must follow Rules of Hooks (no conditional calls) | No equivalent restriction — it's just a function call in JSX |

Custom hooks are generally preferred today because they avoid the extra JSX nesting ("callback hell" in markup) that render props introduce, and read more like plain synchronous code. Render props still show up for cases needing render-time flexibility tied to JSX structure itself. The most common mistake is reaching for a render-props library pattern for logic reuse when a plain custom hook would be simpler and flatter.

### Sharing logic (custom hooks) vs sharing state (Context / external store)

| Aspect | Custom hook (e.g. `useToggle`) | Context or external store |
|---|---|---|
| What's shared between call sites | Only the logic/implementation — each call gets independent state | The actual state value itself, synchronized across all consumers |
| Use when | Multiple components need the same *kind* of behavior, each with its own instance | Multiple components need to read/write the exact same shared value |

Use a custom hook when each component should have its own independent copy of some stateful behavior (e.g., every accordion panel manages its own open/closed state via `useToggle`). Use Context or an external store when components need to observe and mutate one shared piece of state (e.g., the currently logged-in user). The most common mistake is expecting two calls to the same custom hook to be "linked" and being surprised when updating one doesn't affect the other.
