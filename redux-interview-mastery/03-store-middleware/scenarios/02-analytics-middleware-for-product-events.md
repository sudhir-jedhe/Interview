# Scenario: Product wants to track specific user actions in an analytics tool, without polluting every component with tracking calls

**Problem:** The product team wants "add to cart," "checkout started," and "search performed" events sent to an analytics provider (e.g., Segment/Amplitude-style). The obvious approach — calling `analytics.track(...)` directly inside each relevant component's event handler — means tracking logic is scattered across dozens of files, easy to forget when adding a new trigger point for an existing event, and hard to audit ("which exact user actions do we currently track?").

**Approach:**
1. Notice that every trackable event already corresponds to a Redux action being dispatched — `cart/itemAdded`, `checkout/started`, `search/performed` — so there's a single, central point (the dispatch pipeline) where every one of these events already flows through, regardless of which component triggered them.
2. Write an analytics middleware that maintains a lookup table mapping specific action types to analytics event names/payload shapers, and forwards matching actions to the analytics provider — completely decoupled from any component:
   ```javascript
   const trackedActions = {
     'cart/itemAdded': (action) => ({ event: 'Product Added', properties: { productId: action.payload.id } }),
     'checkout/started': () => ({ event: 'Checkout Started' }),
     'search/performed': (action) => ({ event: 'Search Performed', properties: { query: action.payload } }),
   };

   const analyticsMiddleware = (store) => (next) => (action) => {
     const shape = trackedActions[action.type];
     if (shape) {
       const { event, properties } = shape(action);
       analytics.track(event, properties); // fire-and-forget, doesn't block dispatch
     }
     return next(action);
   };
   ```
3. Register it once in `configureStore`'s middleware array — no component ever imports the analytics library directly, and adding tracking for a new event is a one-line addition to `trackedActions`, not a hunt through every component that might trigger that action.
4. This also gives a complete, auditable list of exactly which user actions are tracked — `Object.keys(trackedActions)` — answering "what do we track" definitively, which is valuable for privacy review and onboarding new engineers.

The interview-relevant insight: middleware is a natural fit for any cross-cutting concern that can be expressed as "react to this action type, regardless of where it was dispatched from" — logging, analytics, and auth-header attachment (see the sibling scenario) are all variations of the same underlying pattern.
