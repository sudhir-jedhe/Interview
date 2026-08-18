# Private State and the Module Pattern

Because outer variables in a closure aren't accessible from outside except through whatever the closure exposes, closures give you real data privacy without needing classes or `#privateFields`:

```js
function createBankAccount(initialBalance) {
  let balance = initialBalance; // truly private — no external code can touch it directly

  return {
    deposit(amount) { balance += amount; return balance; },
    withdraw(amount) {
      if (amount > balance) throw new Error('Insufficient funds');
      balance -= amount;
      return balance;
    },
    getBalance() { return balance; }
  };
}

const account = createBankAccount(100);
account.deposit(50);
console.log(account.getBalance()); // 150
console.log(account.balance);      // undefined — not accessible directly
```

This "return an object of functions that share a closure" shape is the classic **module pattern** — it was the standard way to build encapsulated, stateful modules before ES modules and class private fields existed, and it's still widely used for factories and small stateful utilities. See `../problems/03-private-counter-factory.md` for a from-scratch implementation of this pattern.

## Module pattern (closures) vs ES classes for private state

| Aspect | Closures / Module Pattern | ES Classes with `#privateFields` |
|---|---|---|
| Privacy enforcement | True privacy — no syntax exists to reach the captured variable from outside | True privacy — enforced by the `#` syntax at the language level |
| Syntax overhead | A factory function returning an object of closures | Native class syntax, feels more like a "class" in other languages |
| Shared "instance" methods | Each object gets its own copies of the returned functions (higher memory per instance) | Methods live once on the prototype, shared across all instances |
| Inheritance | Awkward — no built-in mechanism, must be manually composed | Natural — `extends`, `super` |

Use the closure/module pattern for one-off factories, simple encapsulated utilities, or when you specifically don't need inheritance. Use classes with private fields when you need many instances (to avoid duplicating methods per instance) or need inheritance. The common mistake is defaulting to the closure pattern for something that will have hundreds of instances, unknowingly duplicating every method function per object instead of sharing them via the prototype.
