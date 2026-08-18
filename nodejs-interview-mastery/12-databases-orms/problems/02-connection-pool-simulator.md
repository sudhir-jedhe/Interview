# Problem: Minimal In-Memory Connection-Pool Simulator (Acquire/Release, Waiting Queue)

## Problem statement

Implement a minimal connection-pool simulator from scratch — no real database involved — that models the core behavior of a real pool like `pg.Pool`: a fixed number of "connections," `acquire()`/`release()` semantics, and a waiting queue when the pool is exhausted.

## Requirements

- Fixed pool size (`max` connections)
- `acquire()` returns a promise that resolves with a connection handle immediately if one is free, or waits in a FIFO queue until one is released
- `release(connection)` returns a connection to the pool and immediately hands it to the next waiter, if any
- An optional `acquireTimeoutMs` — if no connection becomes free within the timeout, the waiting `acquire()` call rejects instead of waiting forever
- Track basic stats: total connections, in-use count, waiting count

## Worked solution

```js
// connectionPoolSimulator.js

class ConnectionPoolSimulator {
  constructor({ max = 5, acquireTimeoutMs = 5000 } = {}) {
    this.max = max;
    this.acquireTimeoutMs = acquireTimeoutMs;

    // simulate real connections as simple tagged objects
    this._free = Array.from({ length: max }, (_, i) => ({ id: i, busy: false }));
    this._inUse = new Set();
    this._waitQueue = []; // { resolve, reject, timer }
  }

  get stats() {
    return { total: this.max, inUse: this._inUse.size, free: this._free.length, waiting: this._waitQueue.length };
  }

  acquire() {
    return new Promise((resolve, reject) => {
      const connection = this._free.pop();

      if (connection) {
        connection.busy = true;
        this._inUse.add(connection);
        return resolve(connection);
      }

      // pool exhausted — queue this request
      const waiter = { resolve, reject, timer: null };
      waiter.timer = setTimeout(() => {
        const idx = this._waitQueue.indexOf(waiter);
        if (idx !== -1) this._waitQueue.splice(idx, 1);
        reject(new Error(`Connection acquire timed out after ${this.acquireTimeoutMs}ms — pool exhausted`));
      }, this.acquireTimeoutMs);

      this._waitQueue.push(waiter);
    });
  }

  release(connection) {
    if (!this._inUse.has(connection)) {
      throw new Error('Attempted to release a connection not currently checked out');
    }
    this._inUse.delete(connection);
    connection.busy = false;

    if (this._waitQueue.length > 0) {
      // hand this connection directly to the next waiter — FIFO fairness
      const waiter = this._waitQueue.shift();
      clearTimeout(waiter.timer);
      connection.busy = true;
      this._inUse.add(connection);
      waiter.resolve(connection);
    } else {
      this._free.push(connection);
    }
  }
}

module.exports = ConnectionPoolSimulator;
```

```js
// usage / demonstration
async function demo() {
  const pool = new ConnectionPoolSimulator({ max: 2, acquireTimeoutMs: 1000 });

  const conn1 = await pool.acquire();
  const conn2 = await pool.acquire();
  console.log('after 2 acquires:', pool.stats); // { total: 2, inUse: 2, free: 0, waiting: 0 }

  // pool is exhausted — this acquire() will queue, then resolve once conn1 is released
  const pending = pool.acquire().then((conn) => {
    console.log('third acquire resolved with connection id:', conn.id);
    pool.release(conn);
  });

  setTimeout(() => {
    console.log('releasing conn1, should immediately satisfy the waiting acquire()');
    pool.release(conn1);
  }, 200);

  await pending;
  pool.release(conn2);
  console.log('final stats:', pool.stats); // { total: 2, inUse: 0, free: 2, waiting: 0 }
}

demo();
```

**Why the waiting queue matters:** this is exactly how a real pool like `pg.Pool` behaves under load — when every connection is checked out, new `acquire()` calls (implicitly, every `pool.query()` call) don't fail immediately; they wait in line until a connection frees up, up to `connectionTimeoutMillis`. Modeling this explicitly makes visible what "the pool is exhausted" actually means operationally: requests don't fail outright, they queue and add latency, and only time out if the backlog doesn't clear in time — which is precisely the failure mode described in the connection-pool-exhaustion scenario.
