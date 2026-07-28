### Access Modifiers in TypeScript

In TypeScript, **access modifiers** are used to define the visibility or accessibility of class members (properties and methods). They are used to control how different parts of the program can access and modify class members.

TypeScript provides three main access modifiers:

1. **`public`**
2. **`private`**
3. **`protected`**

Each access modifier serves a specific purpose and gives different levels of access control to class members. Let’s explore these in detail.

---

### 1. **`public` Access Modifier**

- **Definition**: Members (properties and methods) declared as `public` can be accessed from anywhere, both inside and outside the class. This is the **default** visibility modifier in TypeScript if no modifier is explicitly specified.
- **Example:**

  ```typescript
  class Person {
    public name: string;

    constructor(name: string) {
      this.name = name;
    }

    public greet() {
      console.log(`Hello, my name is ${this.name}.`);
    }
  }

  const person = new Person("Alice");
  console.log(person.name); // Accessible from outside the class
  person.greet(); // Accessible from outside the class
  ```

- **Default Behavior**: If you don’t explicitly declare an access modifier, the member is considered `public`.

---

### 2. **`private` Access Modifier**

- **Definition**: Members declared as `private` are only accessible within the class where they are defined. They cannot be accessed or modified from outside the class or by instances of the class.
- **Example:**

  ```typescript
  class Person {
    private age: number;

    constructor(age: number) {
      this.age = age;
    }

    public showAge() {
      console.log(`I am ${this.age} years old.`);
    }
  }

  const person = new Person(30);
  // console.log(person.age);  // Error: 'age' is private and cannot be accessed outside the class.
  person.showAge(); // Works fine
  ```

- **Use Case**: You typically use `private` for properties that you want to restrict access to, and which should not be modified by external code.

---

### 3. **`protected` Access Modifier**

- **Definition**: Members declared as `protected` are accessible within the class where they are defined, as well as in subclasses (derived classes). They cannot be accessed from outside the class or the subclass.
- **Example:**

  ```typescript
  class Animal {
    protected species: string;

    constructor(species: string) {
      this.species = species;
    }
  }

  class Dog extends Animal {
    public breed: string;

    constructor(species: string, breed: string) {
      super(species);
      this.breed = breed;
    }

    public showSpecies() {
      console.log(`This animal is a ${this.species}.`); // Accessing protected member from subclass
    }
  }

  const dog = new Dog("Dog", "Golden Retriever");
  dog.showSpecies(); // Works fine, species is accessible within the subclass
  // console.log(dog.species);  // Error: 'species' is protected and cannot be accessed outside the class or subclass
  ```

- **Use Case**: You use `protected` when you want to allow derived classes to access and modify the base class members, but prevent access from outside the class or subclass.

---

### 4. **Readonly Modifier (Optional)**

- **Definition**: While not an access modifier per se, TypeScript also allows for `readonly` properties. A `readonly` property can only be set once (either during initialization or in the constructor) and cannot be modified afterward.
- **Example:**

  ```typescript
  class Product {
    readonly productId: number;

    constructor(productId: number) {
      this.productId = productId;
    }
  }

  const product = new Product(101);
  // product.productId = 200;  // Error: Cannot assign to 'productId' because it is a read-only property.
  ```

- **Use Case**: `readonly` is useful when you want to ensure that the value of a property is immutable after initialization.

---

### Access Modifiers with **Constructor Parameters**

TypeScript allows you to define access modifiers directly on constructor parameters, which automatically creates and initializes class properties.

- **Example:**

  ```typescript
  class Employee {
    constructor(
      public name: string,
      private id: number,
    ) {}

    displayDetails() {
      console.log(`Employee: ${this.name}, ID: ${this.id}`);
    }
  }

  const emp = new Employee("John Doe", 123);
  console.log(emp.name); // Accessible, since 'name' is public
  // console.log(emp.id);  // Error: 'id' is private
  ```

In the example above, the `public` and `private` modifiers in the constructor parameters automatically create and initialize the class properties with the same names.

---

### Access Modifier Summary:

| Access Modifier | Access Level                                        | Use Case                                                                 |
| --------------- | --------------------------------------------------- | ------------------------------------------------------------------------ |
| **`public`**    | Accessible from anywhere (inside and outside class) | Default access, used for members that should be available globally       |
| **`private`**   | Accessible only within the class                    | Restrict access to class internals and prevent modification from outside |
| **`protected`** | Accessible within the class and derived (subclass)  | Allow access in subclass, but restrict outside access                    |
| **`readonly`**  | Read-only, can only be assigned once                | For properties that should not change after initialization               |

---

### When to Use Each Access Modifier:

- **Use `public`**:
  - For properties or methods that should be accessible from anywhere.
  - For most API methods and shared functionality.
- **Use `private`**:
  - For internal details or implementation that should not be accessed directly.
  - When you want to hide class internals from the outside world and avoid accidental modification.

- **Use `protected`**:
  - For properties or methods that are only meant to be used within the class and by its subclasses (inheritance).
  - For creating base classes with shared functionality that shouldn’t be accessed directly by users of the class but should be available to subclasses.

---

### Example: Full Class with Access Modifiers

```typescript
class Account {
  public accountId: number;
  private balance: number;
  protected accountType: string;

  constructor(accountId: number, balance: number, accountType: string) {
    this.accountId = accountId;
    this.balance = balance;
    this.accountType = accountType;
  }

  public deposit(amount: number) {
    if (amount > 0) {
      this.balance += amount;
    }
  }

  private calculateInterest(): number {
    return this.balance * 0.05;
  }

  protected getAccountType() {
    return this.accountType;
  }

  public getBalance(): number {
    return this.balance;
  }
}

class SavingsAccount extends Account {
  constructor(accountId: number, balance: number) {
    super(accountId, balance, "Savings");
  }

  public displayAccountDetails() {
    console.log(
      `Account Type: ${this.getAccountType()}, Balance: ${this.getBalance()}`,
    );
  }
}

const account = new SavingsAccount(12345, 1000);
account.deposit(500);
account.displayAccountDetails();
// console.log(account.calculateInterest());  // Error: 'calculateInterest' is private
// console.log(account.accountType);  // Error: 'accountType' is protected
```

In this example, you can see how `public`, `private`, and `protected` work together to restrict access to certain members while still allowing flexibility for subclasses.
