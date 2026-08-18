# Does this compile?

```typescript
type Logger = () => void;

const consoleLogger: Logger = () => {
  return console.log("logged"); // console.log returns `undefined`
};

const arrayLogger: Logger = () => {
  return [1, 2, 3].push(4); // Array.push returns a number (the new length)
};

const result: void = arrayLogger();
console.log(result === undefined); // what does this print?
```

**Answer:** Both `consoleLogger` and `arrayLogger` compile without error, despite `arrayLogger`'s inner function returning a `number`. At runtime, `console.log(result === undefined)` prints `true`.

**Why:** This is the "void return type still allows returning a value" rule. When a function type is declared to return `void` (like `Logger`), TypeScript allows the implementation to return *any* value — the compiler simply ignores what's returned and treats the call's result as `undefined` from the caller's perspective. This exists specifically for callback ergonomics: it lets you pass `(item) => array.push(item)` as a `void`-returning callback without wrapping it in braces to suppress the return value, even though `Array.prototype.push` returns a number. Crucially, this leniency applies only when a function's *type* (not a literal `: void` annotation on the function itself) says `void` — the actual JS return value is never discarded at runtime, but TypeScript's static view of the call always reports `void`/`undefined`, which is why `result === undefined` is `true` even though `arrayLogger()` actually executed `push` and produced `4` under the hood.
