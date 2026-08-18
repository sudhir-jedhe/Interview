# True runtime-private field with #

```typescript
// #balance is invisible outside the class, no bracket-notation escape hatch
class Wallet {
  #balance: number;

  constructor(initial: number) {
    this.#balance = initial;
  }

  deposit(amount: number): void {
    this.#balance += amount;
  }

  get balance(): number {
    return this.#balance;
  }
}

const w = new Wallet(100);
w.deposit(50);
console.log(w.balance);      // 150
console.log(w["#balance"]);  // undefined — no such accessible property
```
