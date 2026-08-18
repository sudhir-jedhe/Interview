```typescript
// tsconfig: strict: true (includes strictFunctionTypes)
type Handler = (event: MouseEvent) => void;

function register(handler: Handler) {}

const clickOrKeyHandler = (event: MouseEvent | KeyboardEvent) => {
  console.log(event);
};

register(clickOrKeyHandler);
```

Does this compile?

**Answer:** Yes, this compiles — and it's actually *safe*, which surprises people who expect `strictFunctionTypes` to reject it.

**Why:** `strictFunctionTypes` checks function parameters contravariantly: a function is assignable to `Handler` if its parameter type is the *same as or wider* than `MouseEvent`, because a function that can handle "any `MouseEvent | KeyboardEvent`" can always safely be used wherever only a `MouseEvent` is guaranteed to be passed — it simply handles a broader set of inputs than required. This is sound. The case `strictFunctionTypes` *rejects* is the reverse — passing a *narrower* handler where a wider one is required:

```typescript
const mouseOnlyHandler = (event: MouseEvent) => {
  console.log(event.clientX);
};

type BroadHandler = (event: MouseEvent | KeyboardEvent) => void;
function registerBroad(handler: BroadHandler) {}

registerBroad(mouseOnlyHandler);
// Error under strictFunctionTypes: mouseOnlyHandler can't safely handle
// a KeyboardEvent, but registerBroad might call it with one.
```
Without `strictFunctionTypes`, this second (genuinely unsafe) example would compile too, and calling the registered handler with a `KeyboardEvent` would crash on `event.clientX` being `undefined` on a `KeyboardEvent`.
