# Scenario: A "Save" button spins forever — the thunk seems to hang

**Problem:** A form's "Save" button dispatches a thunk that sets `saving: true`, calls the API, and should set `saving: false` on completion. In production, some users report the button spinner never stops, even though (per server logs) the save actually succeeded.

**Approach:**
1. Read the thunk carefully — the bug is almost always in error handling, not in the "happy path," precisely because the happy path is what gets tested first:
   ```javascript
   function saveForm(data) {
     return async (dispatch) => {
       dispatch({ type: 'form/saveStarted' });
       const response = await fetch('/api/save', { method: 'POST', body: JSON.stringify(data) });
       const result = await response.json();
       dispatch({ type: 'form/saveSucceeded', payload: result });
       // NOTE: no try/catch anywhere in this thunk
     };
   }
   ```
2. Identify the failure mode: if `fetch` resolves but the server returns a non-2xx status (common for validation errors — the request itself succeeds at the network level, but the response body signals a business-logic failure), `response.json()` might parse fine, or the code might proceed to treat a `4xx` error body as if it were success data — but the more common real-world case is that some environments (a flaky CDN, a proxy returning HTML instead of JSON on a 502) cause `response.json()` itself to throw a parsing error. Since there's no `try/catch`, that thrown error propagates out of the async thunk function as a **rejected promise** — and because nothing is awaiting or `.catch`-ing `dispatch(saveForm(data))` at the call site either, the rejection becomes an unhandled promise rejection: no `form/saveSucceeded` *or* any failure action ever dispatches, so `saving` stays `true` forever.
3. Fix the specific thunk with proper error handling, and — more importantly for preventing recurrence — add a middleware-level safety net that catches any promise rejection from a thunk's returned promise and dispatches a generic fallback failure action, so future thunks that forget a `try/catch` fail loudly (turning the spinner off, at minimum) instead of hanging silently:
   ```javascript
   // Fixed thunk
   function saveForm(data) {
     return async (dispatch) => {
       dispatch({ type: 'form/saveStarted' });
       try {
         const response = await fetch('/api/save', { method: 'POST', body: JSON.stringify(data) });
         if (!response.ok) throw new Error(`Save failed with status ${response.status}`);
         const result = await response.json();
         dispatch({ type: 'form/saveSucceeded', payload: result });
       } catch (err) {
         dispatch({ type: 'form/saveFailed', payload: err.message });
       }
     };
   }

   // Middleware-level safety net for any thunk that still forgets this
   const thunkSafetyNet = (store) => (next) => (action) => {
     const result = next(action);
     if (result && typeof result.catch === 'function') {
       result.catch((err) => {
         console.error('Unhandled thunk rejection:', err);
         store.dispatch({ type: 'app/unhandledThunkError', payload: err.message });
       });
     }
     return result;
   };
   ```
4. Explain to the team why this matters generally: any thunk missing a `catch` for its async work is a silent-hang risk, specifically because Redux (and JS promises generally) won't surface an unhandled rejection anywhere visible to the user by default — it just becomes a console warning (if that) with no UI feedback, which is exactly the "spinner never stops" symptom reported.

This is a strong scenario to discuss in interviews because it combines middleware mechanics (a thunk's return value is a promise; middleware can inspect it) with a very common, very real production bug class (unhandled async rejections leaving UI state stuck).
