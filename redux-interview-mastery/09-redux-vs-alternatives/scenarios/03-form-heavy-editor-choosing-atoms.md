# Scenario: A Form-Heavy Document Editor Has a Redux Re-Render Problem

You're maintaining a document editor with a large properties panel — 60+ independently editable fields (font size, color, alignment, spacing, per-element metadata) all backed by a single Redux slice: `state.document.properties`. Every keystroke in any field dispatches an action that updates that one slice, and because most components select from `state.document.properties` at some granularity, typing in one field causes visible lag as unrelated fields' components also re-render on every keystroke.

## Approach:

**1. Diagnose why granular `useSelector`s aren't already fixing this.** If every field component were doing `useSelector(state => state.document.properties.fontSize)` (selecting a single primitive), only components selecting the changed field would re-render. Investigate first — the likely finding is that several components select a *larger* object (e.g., `state.document.properties` wholesale, or a sub-object like `properties.text`) for convenience, which means any field within that sub-object changing causes all of them to re-render, since the object reference changes on every update regardless of which key changed.

**2. Try the in-Redux fix first, since it's the smallest change.** Tighten every field component's selector to the single primitive value it actually needs, and where a component genuinely needs several related fields, wrap the selector in `reselect`'s `createSelector` so it only produces a new reference when those specific fields change (not on every properties update). This alone often resolves the majority of the lag without a tooling change.

**3. If the lag persists because the *sheer number* of fields makes even careful selector-scoping unwieldy, this is the legitimate case for considering an atomic model.** With 60+ genuinely independent fields, Jotai's per-field atoms would mean each field's input component subscribes to exactly its own atom with zero selector-authoring effort — the "only re-render on your own dependency" behavior is structural rather than something 60 engineers each have to remember to implement correctly in their field's `useSelector` call.

**4. Scope the migration narrowly if you go this route.** Don't migrate the whole app's Redux store to Jotai — introduce atoms specifically for the properties panel's fields, syncing the atom values back into the Redux store at meaningful checkpoints (e.g., on blur, or debounced) if other parts of the app (undo/redo history, the document's serialized save format) still need a single Redux-tracked source of truth for the document.

**5. Make the trade-off explicit to the team before committing.** Mixing two state paradigms in one app is a real ongoing complexity cost — new engineers now need to understand both models and where the boundary between them is. This choice should be justified by a measured, reproducible perf problem (profile before/after), not adopted speculatively because atomic state models are perceived as more modern.

**Result:** if selector-scoping alone via `reselect` fixes the lag, that's the preferred, lower-complexity outcome; if 60+ fields' worth of manual selector discipline is itself the maintenance burden, a narrowly-scoped Jotai adoption for just the properties panel directly targets the structural cause without migrating the whole app's architecture.
