# Scenario: Inconsistent action shapes across a multi-team codebase

**Problem:** Your app is built by three teams, each owning different feature areas. Team A names actions `{ type: 'ADD_ITEM', item: {...} }`, Team B uses FSA-style `{ type: 'cart/itemAdded', payload: {...} }`, and Team C nests everything under `data`: `{ type: 'CART_ITEM_ADDED', data: {...} }`. A shared logging/analytics middleware needs to extract "the meaningful payload" from every action dispatched anywhere in the app, and currently has three special-cased branches, one per team's convention, which breaks every time a new team's convention shows up.

**Approach:**
1. Diagnose the root cause: without an agreed-upon action shape, generic tooling (logging, analytics, error-reporting middleware, even Redux DevTools' payload display) can't treat "the data of this action" uniformly — every consumer of the action stream has to special-case each team's format.
2. Propose standardizing on the Flux Standard Action shape (`{ type, payload, error?, meta? }`) as a team-wide lint rule, not just a suggestion — add an ESLint rule or a runtime dev-mode assertion (middleware that warns if a dispatched action has extra top-level keys beyond `type`/`payload`/`error`/`meta`) to make violations visible immediately rather than discovered later by the logging team.
   ```javascript
   // Dev-mode middleware that flags non-FSA-shaped actions
   const fsaShapeCheckMiddleware = (store) => (next) => (action) => {
     const allowedKeys = ['type', 'payload', 'error', 'meta'];
     const extraKeys = Object.keys(action).filter((k) => !allowedKeys.includes(k));
     if (extraKeys.length > 0) {
       console.warn(`Non-FSA action shape for "${action.type}": extra keys ${extraKeys.join(', ')}`);
     }
     return next(action);
   };
   ```
3. Migrate incrementally, team by team, since renaming `item` → `payload` or `data` → `payload` in an existing action creator is a small, mechanical, low-risk change per action type — and because reducers pattern-match on `action.type` and destructure `action.payload`, each conversion is isolated to that one action creator and its corresponding reducer case.
4. Once standardized, the logging middleware collapses to a single, generic implementation with zero team-specific branches:
   ```javascript
   const loggingMiddleware = (store) => (next) => (action) => {
     console.log(action.type, action.payload); // works for every action, uniformly
     return next(action);
   };
   ```

The takeaway for an interview: action shape conventions aren't cosmetic — they're what makes generic, cross-cutting tooling (logging, middleware, DevTools) possible without special-casing every domain, which is exactly why FSA became a de facto standard and why `createSlice` enforces it by default.
