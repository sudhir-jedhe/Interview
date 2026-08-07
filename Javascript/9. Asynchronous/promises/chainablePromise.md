# How can you combine method chaining with Promise.all to run steps concurrently in JavaScript?

To run method-chained sequences concurrently using `Promise.all`, map an array of items into chained Promise pipelines and pass that mapped array directly into `Promise.all`.

Each item in the array executes its own independent, sequential chain, while `Promise.all` runs all those chains in parallel and waits for every chain to complete.

---

## Basic Pattern

```javascript
// Step 1: Define chainable async functions
const fetchUser = (id) => Promise.resolve({ id, name: `User ${id}` });
const fetchUserPosts = (user) => Promise.resolve({ ...user, posts: [`Post A`, `Post B`] });
const formatSummary = (data) => ({ summary: `${data.name} has ${data.posts.length} posts.` });

const userIds = [1, 2, 3];

// Step 2: Combine method chaining inside Array.prototype.map()
const concurrentChains = userIds.map(id => 
  fetchUser(id)
    .then(user => fetchUserPosts(user))
    .then(data => formatSummary(data))
    .catch(err => ({ error: err.message })) // Optional per-item error handling
);

// Step 3: Run all chains concurrently
Promise.all(concurrentChains)
  .then(results => console.log(results))
  .catch(err => console.error("One of the chains failed:", err));

```

---

### Fluent Fluent / Class-Based Builder Pattern

If you are using a class-based fluent API (like Knex, Cypress, or a custom SDK), return `this` or a `Promise` from your methods to preserve the chain before mapping:

```javascript
class DataPipeline {
  constructor(id) {
    this.id = id;
    this.promise = Promise.resolve({ id });
  }

  fetchDetails() {
    this.promise = this.promise.then(data => ({ ...data, details: "Loaded" }));
    return this;
  }

  transform() {
    this.promise = this.promise.then(data => ({ ...data, processed: true }));
    return this;
  }

  // Finalizer method to get the underlying Promise
  execute() {
    return this.promise;
  }
}

const items = [10, 20, 30];

// Build and execute all pipelines concurrently
const results = await Promise.all(
  items.map(id => 
    new DataPipeline(id)
      .fetchDetails()
      .transform()
      .execute() // Returns the chained Promise
  )
);

```

---

### Key Takeaways

* **Isolation:** Each chain created in `.map()` runs as an isolated Promise sequence.
* **Concurrency:** All chains start executing immediately during the `.map()` iteration; `Promise.all` aggregates their outcomes.
* **Error Behavior:** Standard `Promise.all` will short-circuit on the first rejection. If you want all chains to finish regardless of failures, swap `Promise.all` with `Promise.allSettled`.
