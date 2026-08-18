# protected members are visible to subclasses only

```typescript
// Subclass can read `role`; outside code cannot
class Employee {
  protected role: string;

  constructor(role: string) {
    this.role = role;
  }
}

class Manager extends Employee {
  describe(): string {
    return `Manager overseeing ${this.role}s`; // ok, protected is visible here
  }
}

const m = new Manager("engineer");
console.log(m.describe());
// console.log(m.role); // Error: 'role' is protected
```
