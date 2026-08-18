```js
// LazyMan is very lazy, he only eats and sleeps.

// LazyMan(name: string, logFn: (log: string) => void) would output a message, the passed logFn is used.

// LazyMan('Jack', console.log)
// // Hi, I'm Jack.
// He can eat(food: string)

// LazyMan('Jack', console.log)
//   .eat('banana')
//   .eat('apple')
// // Hi, I'm Jack.
// // Eat banana.
// // Eat Apple.

// interface Laziness {
//   sleep: (time: number) => Laziness
//   sleepFirst: (time: number) => Laziness
//   eat: (food: string) => Laziness
// }
class ALazyMan {
  constructor(name, logFn) {
    this.name = name;
    this.log = logFn;

    this.normalTasks = [];
    this.urgentTasks = [];

    this.greet();

    setTimeout(() => {
      this._triggerNext();
    }, 0);
  }

  greet() {
    this.normalTasks.push(["greet"]);
    return this;
  }

  eat(food) {
    this.normalTasks.push(["eat", food]);
    return this;
  }

  sleep(time) {
    this.normalTasks.push(["sleep", time]);
    return this;
  }

  sleepFirst(time) {
    this.urgentTasks.push(["sleep", time]);
    return this;
  }

  _triggerNext() {
    let task = this.urgentTasks.shift();
    if (!task) {
      task = this.normalTasks.shift();
    }

    if (!task) {
      return;
    }

    const [action, param] = task;

    switch (action) {
      case "greet":
        this.log(`Hi, I'm ${this.name}.`);
        this._triggerNext();
        return;
      case "eat":
        this.log(`Eat ${param}.`);
        this._triggerNext();
        return;
      case "sleep":
        setTimeout(() => {
          this.log(`Wake up after ${param} second${param > 1 ? "s" : ""}.`);
          this._triggerNext();
          return;
        }, param * 1000);
    }
  }
}
/**
 * @param {string} name
 * @param {(log: string) => void} logFn
 * @returns {Laziness}
 */
function LazyMan(name, logFn) {
  // use 2 array to to hold tasks , one for sleepFirs, one for the other
  // return `this` for each method call
  return new ALazyMan(name, logFn);
}

/**************************** */

/**
 * @param {string} name
 * @param {(log: string) => void} logFn
 * @returns {Laziness}
 */
function LazyMan(name, logFn) {
  const ids = new Map();
  let delay = 0;
  let called = false;
  const man = {
    intro: (param) => {
      ids.set(
        `intro-${param}`,
        setTimeout(() => {
          debugger;
          logFn(`Hi, I'm ${param}.`);
        }, delay),
      );
      return man;
    },
    eat: (param) => {
      ids.set(
        `eat-${param}`,
        setTimeout(() => logFn(`Eat ${param}.`), delay),
      );
      return man;
    },
    sleep: (param) => {
      delay += param * 1000;
      setTimeout(
        () => logFn(`Wake up after ${param} second${param > 1 ? "s" : ""}.`),
        delay,
      );
      return man;
    },
    sleepFirst: (param) => {
      man.sleep(param);
      for (const [name, timeout] of ids) {
        clearTimeout(timeout);
        const [n, p] = name.split("-");
        man[n](p);
      }
      return man;
    },
  };
  man.intro(name);
  return man;
}
```

This is the classic **LazyMan** problem (often asked in front-end system design and core JS interviews).

The trick to implementing `LazyMan` is using an internal **task queue (microtask / event loop execution)** combined with **chainable method calls (returning `this`)**.

---

### Key Intuition

1. **Method Chaining:** Every method (`eat`, `sleep`, `sleepFirst`) pushes a task function onto an array queue and returns `this`.
2. **Delayed Execution:** The task queue shouldn't start running immediately when `LazyMan('Jack')` is called, because chained methods (like `.eat()`) haven't been registered yet. We trigger queue processing asynchronously using `setTimeout(..., 0)` or `Promise.resolve().then(...)`.

---

### Complete Implementation

```javascript
class LazyManClass {
  constructor(name, logFn) {
    this.name = name;
    this.log = logFn || console.log;
    this.queue = [];

    // Register initial greeting
    this.queue.push(() => {
      this.log(`Hi, I'm ${this.name}.`);
      this.next(); // Continue queue
    });

    // Schedule queue execution after synchronous call stack finishes
    Promise.resolve().then(() => this.next());
  }

  // Helper to execute the next task in queue
  next() {
    const task = this.queue.shift();
    if (task) {
      task();
    }
  }

  eat(food) {
    this.queue.push(() => {
      this.log(`Eat ${food}.`);
      this.next();
    });
    return this; // Enable chaining
  }

  sleep(seconds) {
    this.queue.push(() => {
      setTimeout(() => {
        this.log(`Wake up after ${seconds} second${seconds > 1 ? "s" : ""}.`);
        this.next();
      }, seconds * 1000);
    });
    return this;
  }

  sleepFirst(seconds) {
    // Unshift puts this task at the FRONT of the queue before the greeting
    this.queue.unshift(() => {
      setTimeout(() => {
        this.log(`Wake up after ${seconds} second${seconds > 1 ? "s" : ""}.`);
        this.next();
      }, seconds * 1000);
    });
    return this;
  }
}

// Factory function
function LazyMan(name, logFn) {
  return new LazyManClass(name, logFn);
}
```

---

### Usage Examples

#### Example 1: Basic Chaining with `eat()`

```javascript
LazyMan("Jack", console.log).eat("banana").eat("apple");

// Output:
// Hi, I'm Jack.
// Eat banana.
// Eat apple.
```

#### Example 2: Normal `sleep()`

```javascript
LazyMan("Jack", console.log).eat("banana").sleep(2).eat("apple");

// Output:
// Hi, I'm Jack.
// Eat banana.
// (Waits 2 seconds)
// Wake up after 2 seconds.
// Eat apple.
```

#### Example 3: Priority `sleepFirst()`

```javascript
LazyMan("Jack", console.log).eat("banana").sleepFirst(2);

// Output:
// (Waits 2 seconds FIRST)
// Wake up after 2 seconds.
// Hi, I'm Jack.
// Eat banana.
```

---

### Why `Promise.resolve().then(...)` Works

When you run `LazyMan('Jack', console.log).eat('banana')`:

1. `LazyMan('Jack')` runs synchronously and schedules `this.next()` as a microtask.
2. Synchronous code continues, executing `.eat('banana')`, which pushes the eating task into `this.queue`.
3. The main call stack clears.
4. The microtask executes `this.next()`, consuming items in `this.queue` sequentially in order!
