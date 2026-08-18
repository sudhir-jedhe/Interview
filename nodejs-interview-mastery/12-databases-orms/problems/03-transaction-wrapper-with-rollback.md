# Problem: Transaction Wrapper That Rolls Back on Any Step Failing (Simulated)

## Problem statement

Implement a `runInTransaction(queries)` utility that executes an array of async "queries" (functions) as a simulated all-or-nothing transaction: if every step succeeds, all their effects are kept; if any step throws, every effect from prior steps in the same call is rolled back.

## Requirements

- Accepts an ordered array of step functions, each of which performs some effect and returns a corresponding "undo" function
- Executes steps sequentially (later steps may depend on earlier ones having committed)
- If a step throws, calls the undo functions of every *already-completed* step, in reverse order (LIFO — undo the most recent effect first, mirroring how real database rollbacks unwind)
- Rethrows the original error after rollback completes, so the caller knows the transaction failed
- Simulated with an in-memory store standing in for a real database, so the "rollback" is concretely observable

## Worked solution

```js
// transactionSimulator.js

/**
 * Runs an array of step functions as a simulated transaction.
 * Each step is a function: async (ctx) => undoFn
 *   - `ctx` is a shared context object steps can use to pass data forward
 *   - the step performs its effect and returns an `undoFn` that reverses it
 * If any step throws, every already-completed step's undoFn is invoked in
 * reverse order before the original error is rethrown.
 */
async function runInTransaction(steps) {
  const ctx = {};
  const completedUndos = [];

  try {
    for (const step of steps) {
      const undo = await step(ctx);
      completedUndos.push(undo);
    }
    return ctx;
  } catch (err) {
    // roll back in LIFO order — undo the most recently completed step first
    for (let i = completedUndos.length - 1; i >= 0; i--) {
      try {
        await completedUndos[i]();
      } catch (undoErr) {
        // an undo failing is a serious issue (inconsistent state) — log loudly, don't swallow
        console.error('Rollback step failed — manual intervention may be required:', undoErr);
      }
    }
    throw err; // the caller must see that the transaction failed
  }
}

module.exports = runInTransaction;
```

```js
// example: simulated "accounts" store standing in for a real database
const accounts = new Map([
  ['alice', 500],
  ['bob', 100],
]);

function debit(accountId, amount) {
  return async (ctx) => {
    if (accounts.get(accountId) < amount) throw new Error(`Insufficient funds for ${accountId}`);
    accounts.set(accountId, accounts.get(accountId) - amount);
    ctx.debited = { accountId, amount };
    return async () => { accounts.set(accountId, accounts.get(accountId) + amount); }; // undo: credit it back
  };
}

function credit(accountId, amount) {
  return async (ctx) => {
    accounts.set(accountId, accounts.get(accountId) + amount);
    return async () => { accounts.set(accountId, accounts.get(accountId) - amount); }; // undo: debit it back
  };
}

function alwaysFails() {
  return async () => { throw new Error('simulated downstream failure (e.g. payment provider timeout)'); };
}

async function main() {
  console.log('before:', Object.fromEntries(accounts)); // { alice: 500, bob: 100 }

  try {
    await runInTransaction([
      debit('alice', 200),
      credit('bob', 200),
      alwaysFails(), // this step fails AFTER the two writes above already "committed" in-memory
    ]);
  } catch (err) {
    console.log('transaction failed:', err.message);
  }

  console.log('after:', Object.fromEntries(accounts)); // { alice: 500, bob: 100 } — fully rolled back
}

main();
```

**Why undo runs in reverse order:** if step 3 depends on step 2's effect (e.g. step 3 reads a row that step 2 just inserted), unwinding must happen in the opposite order the effects were applied — undo step 2 before step 1, mirroring exactly how a real database's rollback log replays changes backward to restore the pre-transaction state. This simulator makes that ordering explicit and demonstrates, with a concrete before/after account balance check, that a mid-transaction failure leaves the system exactly as it started — the same guarantee a real `BEGIN`/`COMMIT`/`ROLLBACK` provides.
