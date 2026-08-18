# 14. TypeScript with React

Combining TypeScript with React introduces a specific set of typing patterns beyond plain TypeScript — typing props and children, choosing when `useState` needs an explicit generic, picking the exact event type for a handler, distinguishing DOM refs from mutable-value refs, and writing generic components and hooks that stay fully typed across every consumer. This topic covers each of these patterns with the reasoning behind them, not just the syntax, since interviewers consistently probe *why* a given pattern is correct (e.g., why `as const` is needed for tuple-returning hooks, why context needs a guard hook) rather than just whether you've memorized it. It closes with three practical build exercises: a generic reusable `Select<T>` component, fixing a tuple-typing bug in a custom hook, and implementing a fully-typed `useFetch<T>` hook with proper cancellation handling.

## What's covered

- Typing function component props (`interface`/`type`, `children` as `ReactNode` vs. `ReactElement`, extending native element props)
- Typing `useState`, including when an explicit generic is required (unions, nullable initial state)
- Typing event handlers (`ChangeEvent`, `FormEvent`, `MouseEvent`, `KeyboardEvent`) and `target` vs. `currentTarget`
- Typing `useRef` for DOM nodes (the `null` initial-value pattern) vs. mutable values
- Typing custom hooks' return values: tuple vs. object returns, and why tuple returns need `as const`
- Generic, reusable components (e.g., a typed `List<T>`) and how type parameter inference flows through props
- Typing `createContext` and the standard guard-hook pattern for the "possibly undefined" problem
- Hands-on problems: a generic `Select<T>` component, fixing a hook's lost tuple typing, and a fully-typed `useFetch<T>` hook

## Index

### theory/
- [01-typing-component-props.md](theory/01-typing-component-props.md)
- [02-typing-usestate.md](theory/02-typing-usestate.md)
- [03-typing-event-handlers.md](theory/03-typing-event-handlers.md)
- [04-typing-useref.md](theory/04-typing-useref.md)
- [05-typing-custom-hooks.md](theory/05-typing-custom-hooks.md)
- [06-generic-components-and-context.md](theory/06-generic-components-and-context.md)

### snippets/
- [01-props-with-children.md](snippets/01-props-with-children.md)
- [02-usestate-union.md](snippets/02-usestate-union.md)
- [03-controlled-input-change-event.md](snippets/03-controlled-input-change-event.md)
- [04-dom-ref-focus.md](snippets/04-dom-ref-focus.md)
- [05-tuple-returning-hook.md](snippets/05-tuple-returning-hook.md)
- [06-generic-list-usage.md](snippets/06-generic-list-usage.md)
- [07-context-with-hook-guard.md](snippets/07-context-with-hook-guard.md)

### output-based/
- [01-usestate-null-inference.md](output-based/01-usestate-null-inference.md)
- [02-tuple-hook-widening.md](output-based/02-tuple-hook-widening.md)
- [03-ref-accessed-before-mount.md](output-based/03-ref-accessed-before-mount.md)
- [04-event-target-vs-currentTarget.md](output-based/04-event-target-vs-currentTarget.md)
- [05-generic-component-jsx-ambiguity.md](output-based/05-generic-component-jsx-ambiguity.md)
- [06-context-without-provider-guard.md](output-based/06-context-without-provider-guard.md)
- [07-children-reactnode-vs-reactelement.md](output-based/07-children-reactnode-vs-reactelement.md)

### scenarios/
- [01-form-with-multiple-field-types.md](scenarios/01-form-with-multiple-field-types.md)
- [02-shared-data-table-component.md](scenarios/02-shared-data-table-component.md)
- [03-third-party-hook-loose-types.md](scenarios/03-third-party-hook-loose-types.md)

### interview-qa/
- [01-props-state-events.md](interview-qa/01-props-state-events.md)
- [02-refs-hooks-generics.md](interview-qa/02-refs-hooks-generics.md)
- [03-context-typing.md](interview-qa/03-context-typing.md)

### problems/
- [01-generic-select-component.md](problems/01-generic-select-component.md) — type a generic, reusable `Select<T>` component
- [02-fix-tuple-typing-hook.md](problems/02-fix-tuple-typing-hook.md) — fix a custom hook that loses tuple typing without `as const`
- [03-usefetch-hook.md](problems/03-usefetch-hook.md) — implement a fully-typed `useFetch<T>` hook

### assets/
- [README.md](assets/README.md)

Note: this topic has no `projects/` folder — it pairs with the separate React repo's projects.
