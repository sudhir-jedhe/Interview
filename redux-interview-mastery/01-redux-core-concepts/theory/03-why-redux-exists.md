# Why Redux Exists

"Why not just use component state / Context?" is one of the most frequently asked Redux interview questions, and it's really a proxy for "do you understand what problem Redux solves, or did you just learn the API?"

## The problem: shared, complex state at scale

In a small app, `useState` in a handful of components is fine. As an app grows, three pains show up repeatedly:

1. **State needed by distant, unrelated components.** A logged-in user's profile might be needed in a header, a checkout form, and a settings page that live in completely different parts of the component tree. Passing it down via props means threading it through every intermediate component ("prop drilling"), even ones that don't care about it.
2. **Complex, interdependent updates.** A shopping cart's total depends on its items; an "undo" feature needs a history of previous states; a multi-step form needs validation state shared across steps. Scattering this logic across component instances makes it hard to reason about and easy to get out of sync.
3. **Debuggability.** When a bug report says "the cart total was wrong for five seconds," you want to know *exactly* what sequence of events produced that state. With state smeared across dozens of component instances, there's no single timeline to inspect.

## What Redux provides

- **A single store as shared state**, reachable from any connected component without prop drilling — `useSelector` reads directly from the store, regardless of where the component sits in the tree.
- **Predictability via pure reducers.** Because state transitions are `(state, action) => newState` with no side effects, the exact same sequence of actions always produces the exact same state. This determinism is what makes Redux apps easier to reason about at scale.
- **Time-travel debugging.** Because every state change is the result of a dispatched action, and reducers are pure, Redux DevTools can record every action, let you jump back to any prior state, and even replay actions to reproduce a bug exactly as reported.
- **A single, inspectable timeline.** Every state change traces back to one action object with a `type`; you can log every action an app has ever dispatched and reconstruct the entire history of a session.

```javascript
// Any component, anywhere in the tree, can read the same store:
function Header() {
  const user = useSelector((state) => state.user);
  return <span>{user.name}</span>;
}

function CheckoutForm() {
  const user = useSelector((state) => state.user); // same data, no prop drilling
  // ...
}
```

## What Redux costs

Redux isn't free: it adds boilerplate (actions, reducers, store setup — though Redux Toolkit cuts this drastically), an indirection layer between "user did something" and "state changed," and a learning curve around immutability and pure functions. For an app with mostly local UI state (a modal's open/closed flag, a form's current input value), Redux is overkill — `useState`/`useReducer` and React Context handle that better with less ceremony.

## The interview-ready answer

"Redux exists to make state changes in complex, large applications predictable and debuggable by centralizing state and forcing all changes through pure functions and dispatched actions, which also enables time-travel debugging and easy sharing of state across unrelated components — but it's a deliberate tradeoff, not a default choice for every piece of state." That last clause is what separates a senior answer from a junior one; see `04-when-to-use-redux.md` for the concrete decision framework.
