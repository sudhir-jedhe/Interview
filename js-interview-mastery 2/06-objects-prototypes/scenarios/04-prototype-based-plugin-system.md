# Scenario: lightweight inheritance-based plugin system without classes

**Prompt:** You're writing a small library where plugins should inherit shared default behavior but override specific methods, and you want to avoid the `class` syntax to keep bundle size minimal and stay closer to the metal. How do you do this with prototypes directly, and what would you watch out for?

**Approach:** Use `Object.create` to build the chain explicitly, and factory functions to construct instances:

```js
const basePlugin = {
  init() { console.log(`${this.name} initialized`); },
  run() { console.log(`${this.name} running default behavior`); },
};

function createPlugin(name, overrides = {}) {
  const plugin = Object.create(basePlugin, {
    name: { value: name, enumerable: true },
  });
  return Object.assign(plugin, overrides);
}

const logger = createPlugin("logger", {
  run() { console.log(`${this.name} writing logs`); },
});

logger.init(); // "logger initialized" (inherited)
logger.run();  // "logger writing logs" (own override)
```

Watch out for: `Object.assign(plugin, overrides)` copies overrides as *own* properties, so `hasOwnProperty` checks and `JSON.stringify` will include them but not the inherited `init`/`run` — that asymmetry can surprise consumers who serialize plugin objects expecting to see all behavior.
