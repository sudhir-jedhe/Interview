# Scenario: A Growing Team's Context-Based State Is Becoming Unmanageable

An app started with `useReducer` + Context for its cart and user state, back when the team was 2 engineers. The team has since grown to 15 engineers across 4 feature squads. Code review is now regularly catching bugs where one squad's component reads a Context value that another squad's reducer changed in a way the first squad didn't expect, because there's no single place that documents "here is every kind of update that can happen to this state." A recent incident involved two different components both directly calling the context's `dispatch` with slightly different, undocumented action shapes for what was meant to be the same logical update.

## Approach:

**1. Name the actual problem precisely.** This isn't really "Context is slow" (performance isn't the reported issue) — it's "Context plus a hand-rolled reducer has no enforced contract for what actions look like, and no single artifact (like a DevTools action log) that lets anyone audit what's happening across squads." That's a *conventions and observability* problem, which is exactly what Redux's ecosystem (action creators, DevTools, one canonical `{ type, payload }` shape) was built to solve at scale.

**2. Propose migrating to Redux Toolkit specifically, not just "Redux."** `createSlice`'s single API for defining an action creator and its reducer case together, with a mandatory action type, would have made the "two components dispatching slightly different shapes for the same logical update" incident structurally much harder — there would be exactly one `cartItemAdded` action creator, importable and shared, rather than each component constructing its own dispatch payload from scratch.

**3. Sell the DevTools/observability win concretely.** With Redux DevTools, any engineer investigating "why did the cart show the wrong total" can look at the action log, see exactly which actions fired in what order, and replay state at any point — versus today's reality of Context updates being invisible outside of manually-added `console.log`s scattered through dispatch call sites.

**4. Migrate incrementally, slice by slice, mirroring the approach from `08-normalizing-state`'s legacy-migration scenario.** Start with the slice that caused the recent incident (cart), convert its Context+reducer into an RTK slice, keep other Context-based state as-is temporarily, and expand slice-by-slice as bandwidth allows — never a big-bang rewrite that blocks 15 engineers' feature work simultaneously.

**5. Acknowledge what doesn't need to change.** Not every piece of state needs to move — genuinely local, single-component state should stay as `useState`, and this migration is specifically about *shared, cross-squad* state where the lack of enforced conventions caused a real incident, not a blanket "Redux everything" mandate.

**Result:** the specific failure mode (undocumented, ad-hoc action shapes causing cross-squad bugs) gets addressed by adopting the tool whose core value proposition is exactly "enforced conventions + auditable action history," while avoiding an unnecessary full rewrite.
