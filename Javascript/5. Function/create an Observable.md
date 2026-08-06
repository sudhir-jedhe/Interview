To implement a basic `Observable` class, we'll follow the essential behavior of observables, where values are delivered to observers using the `next`, `error`, and `complete` methods. We'll also implement support for multiple subscriptions and the ability to unsubscribe.

### Requirements:

1. **Observable Class**: Should accept a function (setup function) that defines how values are delivered to subscribers. It should allow subscribers to register callbacks for `next`, `error`, and `complete` events.
2. **Observer**: An observer can be a simple object with `next`, `error`, and `complete` methods, or it could be a function, in which case the function is treated as the `next` method.
3. **Unsubscription**: The observer should be able to unsubscribe, which stops further delivery of values.
4. **Only one error and complete notification**: After an `error` or `complete` notification, no further notifications should be sent.

### Basic Design

- **Subscriber**: Each subscriber object will have `next`, `error`, `complete`, and `unsubscribe` methods. These will allow managing the subscription lifecycle.
- **Observable**: The `Observable` will execute the setup function when `subscribe` is called, passing a subscriber object.
- **Multiple subscriptions**: The observable should support multiple subscribers, and each one should receive the values.

### Code Implementation:

```javascript
class Observable {
  constructor(setup) {
    this._setup = setup; // Function that defines how the observable pushes values
  }

  // Subscribe a new subscriber
  subscribe(subscriber) {
    const subscriberWrapper = {
      unsubscribed: false,
      next(value) {
        if (this.unsubscribed) return;
        // If subscriber is a function, treat it as next callback
        if (subscriber instanceof Function) {
          return subscriber(value);
        }
        // Otherwise, use next if available
        return subscriber.next ? subscriber.next(value) : null;
      },
      error(error) {
        if (this.unsubscribed) return;
        this.unsubscribe(); // Once an error occurs, stop further notifications
        return subscriber.error ? subscriber.error(error) : null;
      },
      complete() {
        if (this.unsubscribed) return;
        this.unsubscribe(); // Once completed, stop further notifications
        return subscriber.complete ? subscriber.complete() : null;
      },
      unsubscribe() {
        this.unsubscribed = true;
      }
    };
    
    // Execute the setup function (producer logic)
    this._setup(subscriberWrapper);
    
    return subscriberWrapper; // Return a wrapper that allows unsubscription
  }
}

// Example Usage:

const observer = {
  next: (value) => console.log("Received value:", value),
  error: (err) => console.log("Received error:", err),
  complete: () => console.log("No more values.")
};

const observable = new Observable((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  setTimeout(() => {
    subscriber.next(3);
    subscriber.next(4);
    subscriber.complete();
  }, 100);
});

// Subscribing to the observable
const subscription = observable.subscribe(observer);
// Expected output: 
// Received value: 1
// Received value: 2
// (after 100ms)
// Received value: 3
// Received value: 4
// No more values.
```

### Key Concepts:

1. **Creating a Subscriber**: The `subscriberWrapper` object has methods `next`, `error`, `complete`, and `unsubscribe` which are used to handle values sent by the observable.
   
2. **Observable Setup**: The `Observable` constructor takes a `setup` function, which is called when `subscribe` is invoked. Inside this function, we invoke the appropriate subscriber methods (`next`, `error`, `complete`).

3. **Unsubscription**: The `unsubscribe()` method in the `subscriberWrapper` ensures that once an observer has received an error or complete notification, no more values will be pushed to them.

4. **Handling Errors and Completion**: The `error` and `complete` methods prevent further notifications once they've been called. After `error` or `complete`, no other notifications (`next`) should be delivered.

### Example Scenarios:

#### 1. **Delivering Values**:

```javascript
const observable = new Observable((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  setTimeout(() => {
    subscriber.next(3);
    subscriber.complete(); // End the stream
  }, 100);
});

const values = [];
const observer = {
  next: (value) => values.push(value),
  complete: () => console.log("Stream completed.")
};

observable.subscribe(observer);
console.log(values);  // Expected output: [1, 2, 3] (after 100ms)
```

#### 2. **Error Notification**:

```javascript
const observable = new Observable((subscriber) => {
  subscriber.next(1);
  subscriber.error("An error occurred"); // Trigger an error
});

const values = [];
const errors = [];
const observer = {
  next: (value) => values.push(value),
  error: (err) => errors.push(err),
};

observable.subscribe(observer);
console.log(values);  // Expected output: [1]
console.log(errors);  // Expected output: ["An error occurred"]
```

#### 3. **Unsubscribing**:

```javascript
const observable = new Observable((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  setTimeout(() => {
    subscriber.next(3);
    subscriber.complete();
  }, 100);
});

const values = [];
const observer = {
  next: (value) => values.push(value),
  complete: () => console.log("Stream completed.")
};

const subscription = observable.subscribe(observer);

setTimeout(() => {
  subscription.unsubscribe();  // Unsubscribe after 50ms
}, 50);

setTimeout(() => {
  console.log(values);  // Expected output: [1, 2]
}, 200);
```

#### 4. **Multiple Subscribers**:

```javascript
const observable = new Observable((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  setTimeout(() => {
    subscriber.next(3);
    subscriber.complete();
  }, 100);
});

const values1 = [];
const values2 = [];

const observer1 = {
  next: (value) => values1.push(value),
  complete: () => console.log("Subscriber 1 completed.")
};

const observer2 = {
  next: (value) => values2.push(value),
  complete: () => console.log("Subscriber 2 completed.")
};

observable.subscribe(observer1);
observable.subscribe(observer2);

setTimeout(() => {
  console.log(values1);  // Expected output: [1, 2, 3]
  console.log(values2);  // Expected output: [1, 2, 3]
}, 200);
```

### Summary:
- The `Observable` class manages the subscription and delivery of values to multiple observers.
- The observer can be an object with `next`, `error`, and `complete` methods, or just a function that handles `next`.
- Unsubscribing ensures no more values are delivered after a certain point.
- The class supports error handling, completion, and multiple subscribers.

This implementation should cover most basic observable functionality.