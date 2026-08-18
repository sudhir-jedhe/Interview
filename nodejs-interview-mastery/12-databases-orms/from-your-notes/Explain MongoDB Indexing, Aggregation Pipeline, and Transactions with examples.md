### 1. MongoDB Indexing

Indexes improve query execution speed by preventing MongoDB from performing full collection scans (`COLLSCAN`). Without an index, MongoDB scans every document in a collection to match the query criteria. An index creates a sorted, $B\text{-tree}$ data structure storing a small portion of the collection's data set in an easily traversable form.

#### Common Index Types

* **Single Field Index:** Sorts data by a single field.
* **Compound Index:** Sorts data by multiple fields. The order of fields matters (follows the **ESR Rule**: Equality, Sort, Range).
* **Text Index:** Supports text search inside string content.
* **Multikey Index:** Automatically created when indexing an array field.

#### Example: Creating & Testing an Index

```javascript
// Create a Compound Index on 'category' (ascending) and 'price' (descending)
db.products.createIndex({ category: 1, price: -1 });

// Query leveraging the index
db.products.find({ category: "Electronics", price: { $gte: 100 } });

// Inspect performance using explain()
db.products.find({ category: "Electronics" }).explain("executionStats");

```

*Look for `IXSCAN` (Index Scan) in the explain output instead of `COLLSCAN` to verify that the query is optimized.*

---

### 2. MongoDB Aggregation Pipeline

The Aggregation Pipeline processes data through multi-stage transformations. Documents pass through stages sequentially, where each stage transforms the documents and passes the results to the next stage.

#### Common Stages

* `$match`: Filters documents (like SQL `WHERE`).
* `$group`: Groups documents by a specified identifier and computes aggregations (e.g., `$sum`, `$avg`).
* `$project`: Reshapes documents by adding, removing, or renaming fields.
* `$sort`: Sorts documents.
* `$lookup`: Performs a left outer join to another collection.

#### Example: E-Commerce Sales Summary Report

Find total revenue and average order value for completed orders per user:

```javascript
db.orders.aggregate([
  // Stage 1: Filter completed orders
  { 
    $match: { status: "completed" } 
  },
  
  // Stage 2: Group by user and calculate aggregates
  { 
    $group: {
      _id: "$userId",
      totalSpent: { $sum: "$totalAmount" },
      totalOrders: { $sum: 1 },
      averageOrderValue: { $avg: "$totalAmount" }
    }
  },
  
  // Stage 3: Join with Users collection to get user details
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "userDetails"
    }
  },
  
  // Stage 4: Reshape the final output
  {
    $project: {
      _id: 1,
      totalSpent: 1,
      totalOrders: 1,
      averageOrderValue: 1,
      userName: { $arrayElemAt: ["$userDetails.name", 0] }
    }
  },
  
  // Stage 5: Sort by highest spender
  { 
    $sort: { totalSpent: -1 } 
  }
]);

```

---

### 3. MongoDB Transactions (Multi-Document ACID)

MongoDB supports multi-document ACID transactions starting from version 4.0 (for replica sets) and 4.2 (for sharded clusters). Transactions allow you to perform multiple read and write operations across collections atomically—either all operations succeed, or all are rolled back.

#### Example: Bank Account Transfer Transaction (Node.js Driver)

```javascript
const { MongoClient } = require('mongodb');

async function transferFunds(client, senderId, receiverId, amount) {
  // 1. Start a session
  const session = client.startSession();

  try {
    // 2. Start the transaction
    session.startTransaction({
      readConcern: { level: 'snapshot' },
      writeConcern: { w: 'majority' }
    });

    const accountsCollection = client.db('bank').collection('accounts');

    // Step A: Deduct amount from sender
    const deductResult = await accountsCollection.updateOne(
      { _id: senderId, balance: { $gte: amount } },
      { $inc: { balance: -amount } },
      { session }
    );

    if (deductResult.modifiedCount === 0) {
      throw new Error("Insufficient balance or sender account not found.");
    }

    // Step B: Add amount to receiver
    await accountsCollection.updateOne(
      { _id: receiverId },
      { $inc: { balance: amount } },
      { session }
    );

    // 3. Commit the transaction if all operations succeed
    await session.commitTransaction();
    console.log('Transaction completed successfully.');

  } catch (error) {
    console.error('Transaction aborted due to an error:', error.message);
    // 4. Abort transaction on failure
    await session.abortTransaction();
  } finally {
    // 5. End session
    await session.endSession();
  }
}

```

---

### Summary Checklist

| Concept                  | Primary Purpose                                       | Key Benefit                                     |
| ------------------------ | ----------------------------------------------------- | ----------------------------------------------- |
| **Indexing**             | Speeds up read operations via $B\text{-tree}$ lookups | Prevents full collection scans (`COLLSCAN`)     |
| **Aggregation Pipeline** | Transforms, filters, and groups data across stages    | Replaces complex client-side data processing    |
| **Transactions**         | Enforces atomic multi-document state changes          | Ensures data integrity across operations (ACID) |
