# Output-Based: Mongoose Default Connection Pool Size and Concurrent Writes

```js
const mongoose = require('mongoose');
await mongoose.connect(process.env.MONGO_URI); // default maxPoolSize is 100

const Counter = mongoose.model('Counter', new mongoose.Schema({ value: Number }));

async function incrementBadly() {
  const doc = await Counter.findOne();
  doc.value = doc.value + 1;
  await doc.save();
}

await Promise.all([incrementBadly(), incrementBadly(), incrementBadly()]);
// starting value: 0
console.log((await Counter.findOne()).value);
```

**Answer:** The final value is unreliable — it may print `1` instead of the expected `3` (a classic lost-update race condition), depending on timing.

**Why:** Each `incrementBadly()` call does a read-then-write with no atomicity guarantee between them. When run concurrently via `Promise.all`, multiple calls can read the same starting value (e.g. all read `0`) before any of them has written back, so two of the three increments get silently overwritten. This has nothing to do with connection pooling (which is fine here) and everything to do with a missing atomic update — the fix is `Counter.updateOne({}, { $inc: { value: 1 } })`, which MongoDB executes atomically server-side.
