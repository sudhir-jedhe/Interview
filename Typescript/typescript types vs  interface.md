In TypeScript, both `types` and `interfaces` are used to define shapes of objects, and they serve a similar purpose but have some key differences in how they can be used and extended. Here's a comparison between the two:

### 1. **Basic Syntax:**

- **Type Aliases:**
  ```typescript
  type Person = {
    name: string;
    age: number;
  };
  ```
- **Interfaces:**
  ```typescript
  interface Person {
    name: string;
    age: number;
  }
  ```

### 2. **Extension/Inheritance:**

- **Interfaces:**
  Interfaces can be extended using the `extends` keyword.
  ```typescript
  interface Employee extends Person {
    employeeId: number;
  }
  ```
- **Types:**
  Types can extend other types using intersection (`&`).
  ```typescript
  type Employee = Person & {
    employeeId: number;
  };
  ```

### 3. **Declaration Merging (Only for Interfaces):**

- **Interfaces:**
  Interfaces support declaration merging, meaning you can declare an interface multiple times, and TypeScript will merge them together.

  ```typescript
  interface Person {
    name: string;
  }

  interface Person {
    age: number;
  }

  const person: Person = { name: "John", age: 30 }; // No error
  ```

- **Types:**
  Types do not support declaration merging. If you declare a type with the same name twice, you will get a duplicate identifier error.

  ```typescript
  type Person = {
    name: string;
  };

  type Person = {
    // Error: Duplicate identifier 'Person'.
    age: number;
  };
  ```

### 4. **Use in Advanced Types:**

- **Types:**
  Types are more flexible and can be used for more complex type compositions, such as union types, intersection types, and mapped types.
  ```typescript
  type Animal = { name: string };
  type Dog = Animal & { breed: string }; // Intersection type
  type Cat = Animal | { breed: string }; // Union type
  ```
- **Interfaces:**
  Interfaces are generally used for object shapes but can’t be used for unions or intersections. They are more restrictive in this regard.
  ```typescript
  interface Animal {
    name: string;
  }
  interface Dog extends Animal {
    breed: string;
  }
  // But can't do union like: Animal | Dog
  ```

### 5. **Instantiating Objects:**

- **Interfaces:**
  You can use interfaces to type objects directly and create object structures that can be implemented in classes.
  ```typescript
  interface Animal {
    name: string;
  }
  class Dog implements Animal {
    name: string;
    constructor(name: string) {
      this.name = name;
    }
  }
  ```
- **Types:**
  Types can be used similarly, but they are not intended to be used for class implementation. They can be used for object shapes as well.
  ```typescript
  type Animal = { name: string };
  const dog: Animal = { name: "Rex" };
  ```

### 6. **When to Use Types vs. Interfaces:**

- **Use `interface` when:**
  - You want to define an object shape and ensure it's extendable.
  - You want to take advantage of declaration merging.
  - You are working with class-based structures.
- **Use `type` when:**
  - You need more complex type compositions (like unions, intersections, mapped types, etc.).
  - You need to define primitive types, tuple types, or function signatures.
  - You want more flexibility in expressing types.

### 7. **Summary of Key Differences:**

| Feature                    | `Interface`                              | `Type Alias`                                                       |
| -------------------------- | ---------------------------------------- | ------------------------------------------------------------------ |
| Extends other types        | Uses `extends`                           | Uses intersection (`&`)                                            |
| Declaration merging        | Supports declaration merging             | Does not support declaration merging                               |
| Usage flexibility          | More specialized for object shapes       | More flexible for advanced types (union, intersection, etc.)       |
| Compatibility with classes | Can be implemented by classes            | Cannot be implemented by classes                                   |
| Can be used for            | Object types, method signatures, classes | Object types, primitive types, unions, intersections, tuples, etc. |

### Conclusion:

- Use `interface` for defining object shapes and when you want to take advantage of its ability to be merged and extended.
- Use `type` when you need more advanced and flexible type definitions, especially for unions, intersections, and more complex type operations.
