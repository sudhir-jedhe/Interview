# Problem: Module, Singleton, and Observer patterns as three working examples

**Task:** Implement each of the module pattern, the singleton pattern, and the observer pattern as a small, self-contained, runnable example (not just a snippet fragment) demonstrating the pattern actually solving a problem.

## 1. Module pattern — a rate-limited API client with private request counting

```js
const ApiClient = (function () {
  let requestCount = 0; // private -- callers cannot tamper with this
  const MAX_REQUESTS_PER_MINUTE = 60;
  let windowStart = Date.now();

  function resetWindowIfNeeded() {
    if (Date.now() - windowStart > 60_000) {
      requestCount = 0;
      windowStart = Date.now();
    }
  }

  return {
    async request(path) {
      resetWindowIfNeeded();
      if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
        throw new Error("Client-side rate limit exceeded");
      }
      requestCount += 1;
      return fetch(path).then((res) => res.json());
    },
    getRequestCount() {
      return requestCount; // read-only view -- no setter exposed
    },
  };
})();

// ApiClient.requestCount is inaccessible -- only getRequestCount() exposes a read-only view.
console.log(typeof ApiClient.requestCount); // "undefined"
console.log(typeof ApiClient.getRequestCount); // "function"
```

## 2. Singleton pattern — a single shared app-wide settings store

```js
class SettingsStore {
  static #instance;
  #settings;

  constructor(defaults = {}) {
    if (SettingsStore.#instance) return SettingsStore.#instance;
    this.#settings = { theme: "light", ...defaults };
    SettingsStore.#instance = this;
  }

  get(key) { return this.#settings[key]; }
  set(key, value) { this.#settings[key] = value; }
}

const settingsA = new SettingsStore({ theme: "dark" });
const settingsB = new SettingsStore(); // ignored -- constructor returns the existing instance

settingsA.set("locale", "en-US");
console.log(settingsB.get("locale")); // "en-US" -- same underlying instance
console.log(settingsA === settingsB); // true
```

## 3. Observer pattern — a temperature sensor notifying multiple displays

```js
class TemperatureSensor {
  #observers = new Set();
  #celsius = 0;

  subscribe(observer) {
    this.#observers.add(observer);
    return () => this.#observers.delete(observer); // unsubscribe function
  }

  setTemperature(celsius) {
    this.#celsius = celsius;
    this.#observers.forEach((observer) => observer(celsius));
  }
}

const sensor = new TemperatureSensor();

const unsubscribeCelsiusDisplay = sensor.subscribe((c) => console.log(`Celsius display: ${c}°C`));
const unsubscribeFahrenheitDisplay = sensor.subscribe((c) => console.log(`Fahrenheit display: ${(c * 9) / 5 + 32}°F`));

sensor.setTemperature(20);
// Celsius display: 20°C
// Fahrenheit display: 68°F

unsubscribeFahrenheitDisplay();
sensor.setTemperature(25);
// Celsius display: 25°C
// (Fahrenheit display no longer logs -- it unsubscribed)
```

## Why these three together

All three patterns solve encapsulation/coordination problems that come up constantly: hiding mutable state behind a controlled API (module), guaranteeing exactly one shared instance of something (singleton), and letting many independent parts react to a change without tight coupling (observer). Interviewers often ask for these because implementing them correctly requires a genuine understanding of closures, `this`/constructor semantics, and callback management — not just memorized syntax.
