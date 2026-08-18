# Getter/setter with validation on write

```typescript
// Setter enforces an invariant; getter exposes a derived value
class Percentage {
  private _value = 0;

  set value(v: number) {
    if (v < 0 || v > 100) throw new Error("Out of range");
    this._value = v;
  }

  get value(): number {
    return this._value;
  }

  get fraction(): number {
    return this._value / 100;
  }
}

const p = new Percentage();
p.value = 75;
console.log(p.value, p.fraction); // 75 0.75
```
