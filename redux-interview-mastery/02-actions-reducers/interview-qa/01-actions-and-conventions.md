# Interview Q&A: Actions and Conventions

**Q: What's a Flux Standard Action, and why does it matter that most Redux code follows it?**
A: An FSA is an action object with a required `type` and optional `payload`, `error`, and `meta` keys, with `payload` always holding "the data of the action." It matters because it lets generic tooling — loggers, DevTools, middleware, test helpers — treat every action's meaningful data the same way, regardless of which domain or team produced it, instead of special-casing each action's ad hoc shape.

**Q: Should action `type` strings be named as commands (`'ADD_ITEM'`) or as facts/events (`'itemAdded'`)? Does it matter?**
A: It's a convention, but the "fact/event" framing (often called action-first or "event-sourcing style" naming) is preferred in modern Redux, particularly Redux Toolkit's default `sliceName/eventName` convention (`'cart/itemAdded'`). The reasoning: an action describes something that *already happened*, and the reducer decides how to respond — an action is not a command telling the reducer what to do, so naming it as a command blurs that separation of concerns. It's largely stylistic, but interviewers who ask this are checking whether you understand the "actions are facts" mental model, not just testing trivia.

**Q: Is it legal for `dispatch` to receive something other than a plain object?**
A: Not in plain Redux — `dispatch` throws if given anything other than a plain object with a `type` property. It becomes legal to dispatch other things (functions, promises) only once you add middleware that specifically intercepts and handles them before they'd otherwise reach the reducer — e.g., `redux-thunk` allows dispatching functions. The reducer itself, though, always ultimately only ever sees plain action objects; middleware's job is to translate anything else into one or more plain-object dispatches. See `03-store-middleware` for the mechanism.

**Q: Why put non-deterministic values like `Date.now()` or generated IDs in the action creator instead of the reducer?**
A: Because the reducer must be a pure function — identical `(state, action)` input must always produce identical output, which is required for Redux DevTools' replay/time-travel to work correctly and for reducer unit tests to be deterministic. An action creator has no such constraint; it runs once, at dispatch time, to produce a fixed action object, so any non-determinism it introduces is "baked into" the action's payload before the reducer ever sees it — the reducer then just consumes an already-fixed value deterministically.
