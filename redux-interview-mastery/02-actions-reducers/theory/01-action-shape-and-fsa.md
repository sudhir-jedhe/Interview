# Action Shape: `{ type, payload }` and Flux Standard Actions

An action is a plain JavaScript object describing *something that happened* — never an instruction for *how* state should change. That distinction (fact, not command) is why action types are named in past tense or event-style (`'cart/itemAdded'`, not `'addItem'`) in idiomatic Redux code.

## The minimum shape

The only hard requirement enforced by Redux itself is a `type` property, which is conventionally a string.

```javascript
{ type: 'cart/itemAdded' }
```

Everything else is convention, not a language rule — but the near-universal convention today is the **Flux Standard Action (FSA)** shape:

```javascript
{
  type: 'cart/itemAdded',   // required: string identifying the action
  payload: { id: 1, qty: 2 }, // optional: the data associated with the action
  error: false,               // optional: true if this action represents an error
  meta: { requestId: 'abc' }, // optional: extra info not part of the payload
}
```

Redux Toolkit's `createSlice`-generated action creators produce exactly this shape by default: `itemAdded({ id: 1 })` returns `{ type: 'cart/itemAdded', payload: { id: 1 } }`.

## Why `payload`, specifically

Before FSA became standard, teams invented ad hoc shapes: `{ type, item }`, `{ type, data }`, `{ type, id, qty }` (flattening fields directly onto the action). This made writing generic tooling (loggers, serializers, middleware that needs to inspect "the data of any action" uniformly) harder, since every action's data lived under a different key or no key at all. Standardizing on `payload` means middleware, DevTools, and testing utilities can treat "the meaningful data" the same way for every action in the app, regardless of domain.

## Action `type` naming: `domain/eventName`

Redux Toolkit's convention (also common in hand-written Redux) is `'sliceName/eventDescription'`:

```javascript
'cart/itemAdded'
'auth/loginSucceeded'
'todos/todoToggled'
```

This namespacing avoids collisions between slices (`'itemAdded'` alone is ambiguous — added to what?) and makes it trivial to filter a logged action stream by domain (`action.type.startsWith('cart/')`).

## Actions describing errors

The FSA convention for a failed operation is `error: true`, with `payload` becoming the error itself (commonly an `Error` object or a serializable error description):

```javascript
{ type: 'user/fetchFailed', payload: new Error('Network timeout'), error: true }
```

This lets generic middleware (e.g., an error-reporting middleware) detect failures uniformly across the whole app without special-casing each domain's specific failure action names — see `03-store-middleware/problems` for a middleware built exactly for this.

## What an action is *not*

An action is not a function, not a promise, not a class instance with methods — it's a serializable plain object (ideally JSON-serializable: no `Date` objects, class instances, functions, `Map`/`Set`, etc. as payload values in a strict setup, since DevTools needs to serialize the action log and rehydrate it for time-travel). The exception is when middleware like `redux-thunk` is configured: then `dispatch` also accepts *functions*, but that function is not itself the action — it's a wrapper that eventually dispatches one or more real, plain-object actions. See `03-store-middleware/theory` for that mechanism.
