# Scenario: choosing between class inheritance and composition for a game engine

**Prompt:** You're building game entities (`Player`, `Enemy`, `NPC`) that need mixed capabilities — some can fly, some can swim, some can do both, and a straight inheritance tree quickly needs multiple inheritance, which JS classes don't support. How do you solve this?

**Approach:** Use mixin functions (which JS supports via function composition over classes) instead of deep inheritance:

```js
const CanFly = (Base) => class extends Base {
  fly() { return `${this.name} flies`; }
};
const CanSwim = (Base) => class extends Base {
  swim() { return `${this.name} swims`; }
};

class Entity {
  constructor(name) { this.name = name; }
}
class Duck extends CanFly(CanSwim(Entity)) {}

const duck = new Duck("Donald");
console.log(duck.fly());  // "Donald flies"
console.log(duck.swim()); // "Donald swims"
```

This avoids the classic "diamond problem" of true multiple inheritance while still letting you compose independent capabilities. Edge case: mixins stack in a specific prototype chain order, so if two mixins define the same method name, the last one applied (outermost wrap) wins — document mixin order carefully or you'll get silent method shadowing. See `../problems/02-mixin-composition.md` for a from-scratch, hands-on mixin exercise.
