# Snippet: Mongoose Schema + Model with Validation, and a Singleton Connection

```js
const mongoose = require('mongoose');

async function connectDb() {
  await mongoose.connect(process.env.MONGO_URI); // mongoose manages pooling internally
}

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  total: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'shipped', 'cancelled'], default: 'pending' },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = { connectDb, Order };
```

**Explanation:** `mongoose.connect()` should be called exactly once at startup — Mongoose manages its own internal connection pool (`maxPoolSize`, default 100) and treats the module as a singleton, so every file that `require`s this module and uses `Order` shares the same underlying connection. The schema declares validation (`required`, `min`, `enum`) that Mongoose enforces in application code before a document is saved — this is exactly the kind of app-level schema enforcement that distinguishes an ODM from the schemaless raw MongoDB driver.
