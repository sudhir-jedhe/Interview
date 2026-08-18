# What's the error, and where does it appear?

```typescript
interface Timer {
  seconds: number;
  tick(this: Timer): void;
}

const timer: Timer = {
  seconds: 0,
  tick(this: Timer) {
    this.seconds += 1;
  },
};

const callbacks: Array<() => void> = [timer.tick];
```

**Answer:** The line `const callbacks: Array<() => void> = [timer.tick];` fails to compile: `The 'this' context of type 'Timer' is not assignable to method's 'this' of type 'void'.`

**Why:** `timer.tick`'s full type includes its declared `this: Timer` requirement — it is only safe to call in a context where `this` will actually be a `Timer` (e.g. called as `timer.tick()`, where the receiver `timer` supplies `this`). The target type `Array<() => void>` describes plain functions with **no** `this` requirement at all (an implicit `this: void`, meaning "doesn't use `this`"). Assigning `timer.tick` into that array strips away the guarantee that it'll always be called with a proper `Timer` receiver — if something later did `callbacks[0]()`, `this` inside `tick` would be `undefined` (in strict-mode JS) and `this.seconds += 1` would throw. TypeScript's `this`-parameter checking catches this mismatch at the assignment, before the detached call ever happens — exactly the class of bug `this: Timer` annotations exist to prevent, as introduced in `theory/04-this-parameter-typing.md`.
