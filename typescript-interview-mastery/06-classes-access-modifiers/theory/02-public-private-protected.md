# public, private, protected — and Why They're Compile-Time Only

TypeScript's `public`, `private`, and `protected` modifiers control visibility *at the type-checker level only*. They exist purely to help you and your team avoid accidentally depending on internal details, and they produce compile errors when violated — but none of that enforcement survives into the compiled JavaScript. This is the single most important fact to internalize about these modifiers.

```typescript
class BankAccount {
  public accountNumber: string;
  private balance: number;
  protected owner: string;

  constructor(accountNumber: string, owner: string, initialBalance: number) {
    this.accountNumber = accountNumber;
    this.owner = owner;
    this.balance = initialBalance;
  }

  private logTransaction(amount: number): void {
    console.log(`Transaction: ${amount}`);
  }

  deposit(amount: number): void {
    this.balance += amount;
    this.logTransaction(amount);
  }
}

const acct = new BankAccount("ACC-001", "Meera", 1000);
acct.accountNumber;      // ok, public
acct.balance;             // Error: 'balance' is private
acct.owner;                // Error: 'owner' is protected
acct.logTransaction(50);  // Error: 'logTransaction' is private
```

## What each one means

- `public` (the default if you write nothing): accessible from anywhere.
- `private`: accessible only from within the declaring class itself, not from subclasses and not from outside code.
- `protected`: accessible from the declaring class and any subclass, but not from outside code.

```typescript
class SavingsAccount extends BankAccount {
  applyInterest(rate: number): void {
    console.log(this.owner); // ok — protected is visible to subclasses
    // console.log(this.balance); // Error — private is NOT visible to subclasses
  }
}
```

## Compile-time only: the bracket-notation escape hatch

Because `private`/`protected` are erased at compile time, the compiled JavaScript has an ordinary property with no protection at all. TypeScript blocks `acct.balance` using dot notation, but the exact same property is reachable with bracket notation, because bracket-notation string-keyed access bypasses TypeScript's declared-member visibility check.

```typescript
console.log(acct["balance"]); // 1000 — compiles fine, `private` doesn't stop this
acct["balance"] = 999999;      // also compiles, silently mutates a "private" field
```

This isn't a bug — it's a direct consequence of `private` being a type-checker construct, not a language-level runtime feature. Anyone with the compiled `.js` output (which is everyone, since that's what actually ships and runs) can read or write `balance` freely; TypeScript's `private` only stops *other TypeScript code that goes through the type checker* from doing so accidentally.

## Why this matters in interviews

This is one of the most commonly tested TypeScript-vs-JavaScript distinctions. Interviewers want you to say, unprompted, that `private` is enforced by `tsc` and disappears entirely at runtime — and ideally to contrast it with JavaScript's native `#privateField` syntax (covered in the next file), which *is* enforced at runtime by the JS engine itself, with no bracket-notation escape hatch.
