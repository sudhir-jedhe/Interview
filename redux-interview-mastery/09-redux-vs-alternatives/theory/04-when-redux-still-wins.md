# When Redux Is Still the Right Choice Today

Every "Redux vs X" comparison eventually lands on this question, and the honest, senior-level answer is "it depends on characteristics of the app and team," not "Redux is legacy" or "Redux is always right." Being able to articulate the specific conditions under which Redux wins — and the specific conditions under which it's overkill — is what separates a memorized opinion from real judgment.

## Where Redux is still the right call

**Large teams needing strict, enforced conventions.** Redux's separation of actions, reducers, and selectors — and RTK's further enforcement via `createSlice` and Immer — means any engineer, on any team, in any part of a large codebase, writes state updates the same shape. This matters far more at 50 engineers than at 3; consistency has compounding value as team size grows, because code review, onboarding, and cross-team debugging all lean on "state updates always look like this."

**Complex, multi-step async flows.** Sagas (via `redux-saga`) and thunks give you well-established, testable patterns for orchestrating multi-step async logic — request cancellation, retries, debouncing, race conditions between overlapping requests, complex side-effect sequencing triggered by specific actions. This ecosystem is mature and battle-tested in Redux in a way that's still catching up in some newer state libraries.

**Time-travel debugging and action-log auditing.** Any bug reproducible as "user did X, Y, Z, then state was wrong" benefits enormously from Redux DevTools' ability to replay the exact action sequence. For apps where correctness of complex state transitions really matters (financial tools, multi-step wizards, collaborative editors), this is a genuine, hard-to-replicate debugging superpower.

**A large existing Redux codebase.** This sounds like a non-answer, but it's a real, valid engineering reason: the migration cost of moving an established app with hundreds of connected components off Redux is rarely worth the marginal ergonomic gain of a newer library, absent a specific, painful problem the current architecture can't solve.

## Where Redux is overkill

**Small apps.** A five-screen app with a handful of local UI flags doesn't need a global store, action creators, and a middleware pipeline — `useState`/`useReducer` plus, at most, Context for a couple of cross-cutting values (auth user, theme) covers it with far less ceremony.

**State that's mostly server-cache data.** This is the single most common Redux *misuse* in real codebases: reducers hand-rolled to store `users`, `loading`, `error` for data that's really just a local cache of a server response. That's exactly what React Query or RTK Query exist to solve — caching, refetching, invalidation, request deduplication, background refresh — with dramatically less code than a hand-rolled thunk-based fetch/loading/error reducer per endpoint. If you find yourself writing `pending`/`fulfilled`/`rejected` reducer cases for what is fundamentally "fetch this and keep it fresh," that's the signal to reach for a query library instead of more Redux.

## The decision isn't binary

Modern large apps often use *both*: RTK Query (or React Query) for server-cache state, and a slim Redux store (or none, replaced by Context/Zustand) for genuine client-only state — UI flags, multi-step wizard progress, undo/redo history, anything that isn't "a copy of something the server told us." Naming this hybrid approach unprompted is a strong interview signal; it shows you've internalized that "state" isn't one uniform category with one uniform tool.
