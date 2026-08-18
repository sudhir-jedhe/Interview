# Singleton Pattern

Guarantees a class/module has exactly one instance, with a single global access point to it. In JS, this is usually simpler than in class-heavy languages, since you can just export a single object literal — module systems already cache modules, so `import` naturally gives you singleton behavior.

```js
class Logger {
  static #instance;
  constructor() {
    if (Logger.#instance) return Logger.#instance;
    this.logs = [];
    Logger.#instance = this;
  }
  log(msg) { this.logs.push(msg); }
}

const a = new Logger();
const b = new Logger();
console.log(a === b); // true -- same instance
```

The `return` inside the constructor is what makes this work: when a constructor explicitly returns an object, that object is used as the result of `new`, overriding the normal "return the freshly created `this`" behavior.

## Singleton pattern vs. a plain exported module object

| Aspect | Explicit Singleton class | Plain exported object from a module |
|---|---|---|
| Enforces one instance | Yes, via constructor check | Implicitly, via module caching (import returns the same reference every time) |
| Boilerplate | More (constructor guard logic) | Less (just export an object literal) |
| When it's actually needed | When consumers might call `new` directly and need to be stopped from creating duplicates | Most everyday cases — module caching already gives you this for free |

In JavaScript, the classic Singleton pattern is often unnecessary boilerplate because the module system already caches modules — importing the same file twice gives the same object reference. The common mistake is reaching for the class-based Singleton pattern out of habit from other languages when a plain exported object would do.

```js
// config.js (conceptually) -- ES modules are cached, so every import gets the same object
const config = { apiUrl: "https://api.example.com" };
export default config;
// Every file that does `import config from './config.js'` shares this exact same object reference.
```
