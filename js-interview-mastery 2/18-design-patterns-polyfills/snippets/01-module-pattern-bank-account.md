# Snippet: Module pattern — IIFE creates private state via closure

```js
const BankAccount = (function () {
  let balance = 0; // private
  return {
    deposit(amount) { balance += amount; return balance; },
    getBalance() { return balance; },
  };
})();

BankAccount.deposit(100);
console.log(BankAccount.getBalance()); // 100
console.log(BankAccount.balance);      // undefined -- no direct access
```
