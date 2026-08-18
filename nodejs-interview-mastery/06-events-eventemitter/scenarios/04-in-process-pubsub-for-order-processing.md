# In-Process Pub/Sub for Decoupling Order Processing from Consumers

**Scenario:** You need to build a simple in-process pub/sub for decoupling an order-processing service from notification/email/analytics consumers, without pulling in a message broker. How do you structure it so consumers can be added later without touching the publisher?

**Approach:** Use a single shared `EventEmitter` instance as an internal event bus, with the publisher only knowing event names/payload shapes — never the consumers.

```js
const { EventEmitter } = require('events');

const eventBus = new EventEmitter();
eventBus.setMaxListeners(20); // headroom for future consumers
eventBus.on('error', (err) => console.error('event bus error:', err));

// publisher — order-processing.js
function createOrder(order) {
  // ... persist order ...
  eventBus.emit('order.created', order);
  return order;
}

// consumer 1 — notifications.js
eventBus.on('order.created', (order) => sendPushNotification(order.userId));

// consumer 2 — email.js
eventBus.on('order.created', (order) => sendConfirmationEmail(order));

// consumer 3, added weeks later, zero changes needed to createOrder()
eventBus.on('order.created', (order) => analytics.track('order_created', order));
```

Because each listener runs synchronously inside `emit`, wrap any slow consumer logic (like sending an email) in `setImmediate` or make it fire-and-forget async so one slow consumer doesn't delay the others or block the publisher's calling code. For a version that supports namespaced wildcard subscriptions (e.g., subscribing to `'order.*'` to catch every order event), see `problems/02-namespaced-pubsub-bus.md`.
