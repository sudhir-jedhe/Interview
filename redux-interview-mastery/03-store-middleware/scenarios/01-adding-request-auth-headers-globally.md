# Scenario: Every thunk needs an auth token attached, and copy-pasting it everywhere is error-prone

**Problem:** Your app has 30+ thunk action creators, each making an API call via `fetch`, and each currently reads the auth token from `getState().auth.token` and manually attaches it as an `Authorization` header. A recent bug: someone added a new thunk and forgot the header, so it silently hit the API unauthenticated in production (the endpoint fell back to anonymous access with degraded data instead of erroring loudly).

**Approach:**
1. Recognize this is a cross-cutting concern — every network-triggering action needs the same treatment, regardless of which feature it belongs to — which is exactly the class of problem middleware is designed for, rather than duplicating logic in every thunk.
2. Rather than fixing this per-thunk, introduce a middleware that intercepts a *specific, recognizable shape* of "API request" action (a common pattern: a special action type or a `meta.isApiRequest` flag) and centrally attaches whatever cross-cutting data (auth headers, a request ID for tracing, a standard error-handling wrapper) is needed, in one place.
   ```javascript
   const apiRequestMiddleware = (store) => (next) => (action) => {
     if (!action.meta || !action.meta.isApiRequest) {
       return next(action); // not an API-triggering action, pass through untouched
     }

     const token = store.getState().auth.token;
     const { url, method = 'GET', onSuccess, onError } = action.meta;

     fetch(url, {
       method,
       headers: token ? { Authorization: `Bearer ${token}` } : {},
     })
       .then((res) => res.json())
       .then((data) => store.dispatch(onSuccess(data)))
       .catch((err) => store.dispatch(onError(err.message)));

     return next(action); // still forward the original action if reducers care about it
   };
   ```
3. Convert existing thunks to dispatch this standardized shape instead of hand-rolling `fetch` + header logic each time:
   ```javascript
   const fetchUser = (id) => ({
     type: 'user/fetchRequested',
     meta: {
       isApiRequest: true,
       url: `/api/users/${id}`,
       onSuccess: (data) => ({ type: 'user/fetchSucceeded', payload: data }),
       onError: (msg) => ({ type: 'user/fetchFailed', payload: msg }),
     },
   });
   ```
4. Result: the auth-header bug becomes structurally impossible for any *new* API-triggering action, because attaching the token is no longer something each thunk author has to remember — it's centralized in one middleware that every API-shaped action passes through.

This scenario also demonstrates a design tradeoff worth naming in an interview: this pattern trades thunk's flexibility (any arbitrary async logic) for a more constrained, declarative action shape that a middleware can process uniformly — appropriate once you have enough repetition across API calls to justify the constraint, but overkill for an app with just a couple of endpoints.
