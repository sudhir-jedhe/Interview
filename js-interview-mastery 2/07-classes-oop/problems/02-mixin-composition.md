# Problem: compose two behaviors into a class via mixins (no traditional inheritance)

## Requirements

Implement a mixin pattern that lets a class gain two independent behaviors — say, `Serializable` (adds `toJSON()`/`fromJSON()`-style helpers) and `Observable` (adds a simple pub/sub `on`/`emit` API) — without using a single-parent `extends` chain to get both, since JS classes only support one direct superclass.

## Solution: functional mixins

A mixin here is a function that takes a base class and returns a new class extending it with additional methods. Because each mixin returns a *class*, mixins compose by nesting function calls, which nests the classes in the prototype chain:

```js
const Serializable = (Base) => class extends Base {
  toJSON() {
    // Only serialize own enumerable properties — mirrors JSON.stringify's default behavior
    return { ...this };
  }
  static fromJSON(json) {
    const instance = Object.create(this.prototype);
    return Object.assign(instance, json);
  }
};

const Observable = (Base) => class extends Base {
  #listeners = {};
  on(event, handler) {
    (this.#listeners[event] ??= []).push(handler);
    return this; // chainable
  }
  emit(event, payload) {
    (this.#listeners[event] ?? []).forEach((handler) => handler(payload));
  }
};

class Entity {
  constructor(name) { this.name = name; }
}

class Player extends Observable(Serializable(Entity)) {
  constructor(name, score) {
    super(name);
    this.score = score;
  }
}

const p = new Player("Ada", 0);
p.on("scoreChange", (newScore) => console.log(`Score is now ${newScore}`));
p.score = 10;
p.emit("scoreChange", p.score); // "Score is now 10"

console.log(p.toJSON()); // { name: "Ada", score: 10 } — Serializable, not directly on Player
console.log(p instanceof Entity); // true — the whole chain is still a real prototype chain
```

## Why this counts as composition, not traditional inheritance

`Player` has exactly one direct superclass at any given point in the chain, so it's still ordinary single inheritance from JS's point of view — but the *shape* of what ends up in that chain is built by composing independent, reusable mixin functions rather than hand-writing one monolithic base class with every possible behavior baked in. `Serializable` and `Observable` know nothing about each other or about `Player`; either can be applied to any base class, in any order (though see the caveat below), and reused across unrelated class hierarchies.

## Mixin order matters

```js
class A extends Observable(Serializable(Entity)) {} // Observable "wins" if both define an overlapping method
class B extends Serializable(Observable(Entity)) {} // Serializable "wins" instead
```

Mixins stack in a specific prototype chain order — the outermost-applied mixin's methods sit closest to the instance and are found first during lookup. If two mixins happen to define a method with the same name, the last one applied (outermost wrap) silently shadows the other. Document mixin order carefully, or avoid overlapping method names across mixins entirely, since there's no built-in warning when this happens.

## Comparison to inheritance-only design

An inheritance-only approach would need `class ObservableSerializableEntity extends Entity` with both feature sets hardcoded together, then a *second*, separately-hardcoded class for entities that only need one of the two behaviors — an exponential blow-up as more optional behaviors are added. Mixins keep each behavior as an independent, composable unit, applied only where needed.
