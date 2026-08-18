# Scenario: bank account with enforced invariants

**Prompt:** You need an `Account` class where the balance can never go negative and can never be set directly by external code, only changed through `deposit`/`withdraw` methods that validate the amount. How do you design this so external code literally cannot bypass the rules, and what happens on invalid input?

**Approach:** Use a private `#balance` field so there's no public property to assign directly, and validate in every mutating method:

```js
class Account {
  #balance;
  constructor(initial = 0) {
    if (initial < 0) throw new RangeError("Initial balance cannot be negative");
    this.#balance = initial;
  }
  get balance() { return this.#balance; }
  deposit(amount) {
    if (amount <= 0) throw new RangeError("Deposit must be positive");
    this.#balance += amount;
    return this.#balance;
  }
  withdraw(amount) {
    if (amount <= 0) throw new RangeError("Withdrawal must be positive");
    if (amount > this.#balance) throw new RangeError("Insufficient funds");
    this.#balance -= amount;
    return this.#balance;
  }
}
```

Edge cases: floating-point deposits/withdrawals (`0.1 + 0.2` type errors) can drift the balance — for real money you'd store cents as integers rather than floats. Also decide whether `withdraw` should allow exact-balance withdrawals (`amount === balance` should succeed, only `amount > balance` should fail) — the boundary condition is a common off-by-one bug.
