# Interview Q&A: createSlice and Immer

**Q1: `createSlice` reducers look like they mutate `state` directly. Doesn't that break Redux's "reducers must be pure and not mutate state" rule?**

A: No, because `createSlice` wraps every case reducer with Immer's `produce`. The `state` argument you receive inside a reducer is actually a Proxy — a "draft" — not the real state object. Immer records whatever operations you perform on the draft (`push`, property assignment, `delete`) and, once your function returns, uses those recordings to compute a genuinely new, immutably-updated state object with structural sharing for anything you didn't touch. The real underlying state object is never mutated; you're only ever mutating a disposable proxy. Redux's actual purity contract is upheld — it's just Immer producing the new state on your behalf instead of you writing `{ ...state, ... }` by hand.

**Q2: Can you mix mutating the draft and returning a new value in the same reducer?**

A: No, and this is a real bug people write. Immer's rule: if your reducer function returns any value other than `undefined`, that returned value entirely replaces whatever the draft looked like — any mutations you made to `state` before the `return` are silently discarded, with no error or warning. So a reducer must pick one style: either mutate `state` and implicitly return `undefined` (no `return` statement, or `return;`), or don't touch `state` at all and `return` a brand-new value (e.g. `return initialState` for a reset case).

**Q3: If I do `state.items = state.items.filter(...)` inside a case reducer, is that a mutation Immer can track, or does it count as "returning a new value"?**

A: It's a tracked mutation, not a return — you're reassigning a *property on the draft* (`state.items`), which Immer's proxy intercepts and records just like `state.items.push(x)` would be. It's completely valid and common — often clearer than `.push`/`.splice` for "remove matching items." The distinction that matters is specifically about the reducer function's own `return` statement, not about reassigning properties inside `state`.

**Q4: When would you use the `{ reducer, prepare }` object form of a reducer instead of a plain function?**

A: When the action's payload needs to be computed rather than passed in as-is — for example, generating an id (`nanoid()`) or a timestamp before it reaches the reducer. `prepare(...)` receives whatever arguments the action creator is called with and must return `{ payload, ...optional meta/error }`; `reducer(state, action)` then receives that constructed action. This keeps "how do we shape this action's payload" logic next to the reducer that consumes it, rather than duplicated across every dispatch call site that would otherwise need to generate the id itself before calling the plain action creator.
