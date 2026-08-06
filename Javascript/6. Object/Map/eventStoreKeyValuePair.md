# Implement Event-Driven Key-Value Store

This is a great **Frontend / JavaScript System Design** interview question.

It combines:

✅ Key-Value Store

✅ Observer Pattern

✅ Pub/Sub

✅ Event-Driven Architecture

✅ State Management

✅ API Design

Event-driven systems typically use a publish-subscribe (Pub/Sub) or observer pattern where subscribers listen for changes and are notified when events occur. [\[skilled.dev\]](https://skilled.dev/course/pub-sub-and-event-driven-programming), [\[javascript...english.io\]](https://javascript.plainenglish.io/building-resilient-frontend-systems-with-event-driven-javascript-1bda090b9620), [\[medium.com\]](https://medium.com/@ignatovich.dm/implementing-the-pub-sub-pattern-in-javascript-a-guide-for-beginners-44714a76d8c7)

***

# Problem Statement

Implement:

```js
const store = new EventStore();

store.set("name", "Sudhir");

store.get("name");

store.on("name", (oldVal, newVal) => {
  console.log(oldVal, newVal);
});

store.set("name", "John");
```

Output

```text
Sudhir John
```

***

# Expected API

```js
store.set(key, value);

store.get(key);

store.has(key);

store.delete(key);

store.on(key, callback);

store.off(key, callback);
```

***

# Data Structure

```text
Store
 ├── values
 │     ├── name => Sudhir
 │     └── age => 30
 │
 └── listeners
       ├── name => [fn1, fn2]
       └── age => [fn3]
```

A common implementation stores values separately from event subscribers/listeners. [\[javascript...english.io\]](https://javascript.plainenglish.io/big-tech-interview-question-build-a-key-value-store-with-listeners-abe34c15b93a), [\[medium.com\]](https://medium.com/@ignatovich.dm/implementing-the-pub-sub-pattern-in-javascript-a-guide-for-beginners-44714a76d8c7)

***

# Basic Solution

```js
class EventStore {
  constructor() {
    this.data = new Map();

    this.listeners =
      new Map();
  }

  get(key) {
    return this.data.get(key);
  }

  has(key) {
    return this.data.has(key);
  }

  set(key, value) {
    const oldValue =
      this.data.get(key);

    this.data.set(
      key,
      value
    );

    this.emit(
      key,
      oldValue,
      value
    );
  }

  delete(key) {
    const oldValue =
      this.data.get(key);

    this.data.delete(
      key
    );

    this.emit(
      key,
      oldValue,
      undefined
    );
  }

  on(key, callback) {
    if (
      !this.listeners.has(
        key
      )
    ) {
      this.listeners.set(
        key,
        new Set()
      );
    }

    this.listeners
      .get(key)
      .add(callback);
  }

  off(key, callback) {
    this.listeners
      .get(key)
      ?.delete(
        callback
      );
  }

  emit(
    key,
    oldVal,
    newVal
  ) {
    const handlers =
      this.listeners.get(
        key
      );

    if (!handlers) {
      return;
    }

    handlers.forEach(
      callback =>
        callback(
          oldVal,
          newVal
        )
    );
  }
}
```

***

# Usage

```js
const store =
  new EventStore();

store.on(
  "name",
  (
    oldValue,
    newValue
  ) => {
    console.log(
      `Changed:
      ${oldValue}
      ->
      ${newValue}`
    );
  }
);

store.set(
  "name",
  "Sudhir"
);

store.set(
  "name",
  "John"
);
```

Output

```text
Changed:
undefined -> Sudhir

Changed:
Sudhir -> John
```

***

# Improve: Avoid Duplicate Events

Don't emit if value didn't change.

```js
set(key, value) {
  const oldValue =
      this.data.get(key);

  if (
      Object.is(
          oldValue,
          value
      )
  ) {
      return;
  }

  this.data.set(
      key,
      value
  );

  this.emit(
      key,
      oldValue,
      value
  );
}
```

Avoiding unnecessary notifications when values do not change is a commonly discussed design improvement for listener-based stores. [\[javascript...english.io\]](https://javascript.plainenglish.io/big-tech-interview-question-build-a-key-value-store-with-listeners-abe34c15b93a)

***

# Global Change Events

```js
store.on(
  "*",
  event => {
    console.log(
      event
    );
  }
);
```

Event:

```js
{
  key: "name",
  oldValue: "Sudhir",
  newValue: "John"
}
```

***

# Unsubscribe Support

```js
on(key, callback) {
  ...

  return () =>
      this.off(
          key,
          callback
      );
}
```

Usage:

```js
const unsubscribe =
  store.on(
    "name",
    callback
  );

unsubscribe();
```

Returning an unsubscribe handler is a common Pub/Sub design pattern. [\[javascript...english.io\]](https://javascript.plainenglish.io/big-tech-interview-question-build-a-key-value-store-with-listeners-abe34c15b93a), [\[medium.com\]](https://medium.com/@ignatovich.dm/implementing-the-pub-sub-pattern-in-javascript-a-guide-for-beginners-44714a76d8c7)

***

# React Store Version

```js
const store =
  new EventStore();
```

```tsx
function useStore(key) {
  const [value,
    setValue] =
      useState(
        store.get(key)
      );

  useEffect(() => {
    return store.on(
      key,
      (
        _,
        newValue
      ) => {
        setValue(
          newValue
        );
      }
    );
  }, [key]);

  return value;
}
```

Usage:

```tsx
const name =
  useStore("name");
```

***

# Advanced Version

Support namespaced events:

```js
store.on(
  "user:name",
  callback
);

store.on(
  "user:*",
  callback
);

store.on(
  "*",
  callback
);
```

***

# Complexity

### Set

```text
O(k)

k = listeners on key
```

### Get

```text
O(1)
```

### Subscribe

```text
O(1)
```

### Unsubscribe

```text
O(1)
```

(using `Set`)

***

# Senior Interview Answer

> I would implement the store using a `Map` for values and a second `Map` for listeners. When `set()` updates a value, the store emits a change event to all subscribers. This follows the Observer/Pub-Sub pattern, keeps components loosely coupled, supports subscriptions and unsubscriptions, and forms the foundation of event-driven state management systems. [\[skilled.dev\]](https://skilled.dev/course/pub-sub-and-event-driven-programming), [\[javascript...english.io\]](https://javascript.plainenglish.io/building-resilient-frontend-systems-with-event-driven-javascript-1bda090b9620), [\[linkedin.com\]](https://www.linkedin.com/pulse/event-driven-programming-observer-pattern-javascript-aman-yerpude-efddf)
