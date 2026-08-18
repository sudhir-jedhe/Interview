# Interview Q&A: Middleware Mechanics

**Q: Write the middleware signature from memory and explain each layer.**
A: `store => next => action => {...}`. The outer `store => ...` is called once when middleware is applied, receiving `{ getState, dispatch }`. The middle `next => ...` is called once per middleware by Redux's internal composition, receiving a function that forwards the action to whatever comes next in the chain (another middleware, or the real reducer-invoking dispatch for the last one). The inner `action => {...}` runs on every single `dispatch` call — this is where the middleware's actual logic lives, and it must decide whether/when to call `next(action)`.

**Q: Why is the signature curried into three single-argument functions instead of one function taking three arguments?**
A: Currying lets `applyMiddleware` initialize each middleware once (calling the outer function with `store`) and once more per-middleware to wire up the chain (calling the middle function with `next`), producing a final per-action function that closes over both `store` and `next` without needing to re-pass them on every dispatch. It also mirrors how the chain is *composed*: each middleware's `next` is literally the next middleware's inner function (or the base dispatch), which composition can only wire up cleanly if each middleware exposes exactly this three-layer shape.

**Q: Can middleware change the action before passing it on?**
A: Yes — nothing requires `next` to be called with the *same* `action` object it received. A middleware can transform the action (add a timestamp to `meta`, normalize its shape) and call `next(transformedAction)` instead, and the rest of the chain (and ultimately the reducer) only ever sees the transformed version.

**Q: What's the difference between a middleware calling `next(action)` versus calling `store.dispatch(action)`?**
A: `next(action)` continues forward through the *remaining* middleware chain from this point onward — it does not restart from the top. `store.dispatch(action)` re-enters the chain from the very beginning, running every middleware (including this one and any before it) again on the new action. This distinction matters a lot for thunk specifically: when a thunk function calls `dispatch(realAction)` internally, that's a call to `store.dispatch`, which is why it re-runs the *entire* chain (including thunk itself, which will just pass the plain object through via `next` since it's not a function) rather than skipping straight to the reducer.
