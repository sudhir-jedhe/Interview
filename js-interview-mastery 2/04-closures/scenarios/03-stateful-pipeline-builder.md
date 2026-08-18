# A Stateful Pipeline Builder That Remembers Steps Between Calls

**Scenario:** You're asked to implement a `pipe`/compose-style function pipeline where intermediate functions can be added dynamically and the pipeline remembers previously added steps between calls, similar to a builder pattern. How would closures help here?

**Approach:**

```js
function createPipeline() {
  const steps = []; // private list, only mutable through the returned methods
  return {
    addStep(fn) {
      steps.push(fn);
      return this; // allow chaining
    },
    run(input) {
      return steps.reduce((value, step) => step(value), input);
    }
  };
}

const pipeline = createPipeline();
pipeline
  .addStep(x => x + 1)
  .addStep(x => x * 2)
  .addStep(x => x - 3);

console.log(pipeline.run(5)); // ((5+1)*2)-3 = 9
console.log(pipeline.run(10)); // ((10+1)*2)-3 = 19 — steps persist across calls
```

The `steps` array is private state captured by both `addStep` and `run` via closure — nothing outside `createPipeline` can access or corrupt it directly, and it persists across multiple `.run()` calls because it lives in the enclosing function's scope, not inside `run` itself. This is a natural extension of the module pattern: a stateful object built entirely from closures instead of a class, useful when you want encapsulation without the ceremony of `class`/`this`.
