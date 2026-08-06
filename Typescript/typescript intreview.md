Here’s an in-depth explanation of the topics and questions provided:

---

### **Basic Questions**

#### **1. What is TypeScript, and how does it differ from JavaScript?**

- **What**: TypeScript is a statically typed superset of JavaScript developed by Microsoft. It adds optional static types to JavaScript.
- **Differences**:
  1. **Type System**: TypeScript uses static typing, allowing developers to define types for variables, functions, etc., which helps prevent type-related errors at compile time.
  2. **Tooling**: TypeScript provides better tooling support like autocompletion, type-checking, and IntelliSense.
  3. **New Syntax**: TypeScript introduces additional syntax (e.g., interfaces, enums, generics) that isn't part of JavaScript.
  4. **Compilation**: TypeScript code is transpiled to JavaScript since browsers don’t natively support it.

---

#### **2. What are the benefits of using TypeScript in a project?**

- **Type Safety**: Reduces runtime errors by catching type-related bugs during development.
- **Improved Developer Experience**: Features like IntelliSense, autocompletion, and refactoring.
- **Scalability**: Easier to maintain and scale large codebases.
- **Integration**: Works seamlessly with JavaScript, allowing gradual adoption.
- **Community and Ecosystem**: Strong support for libraries, frameworks, and tools.

---

#### **3. What are the different components of TypeScript?**

1. **TypeScript Language**: The syntax and features provided by TypeScript.
2. **Compiler (tsc)**: Transforms TypeScript code into JavaScript.
3. **Type Declaration Files (`.d.ts`)**: Provide type definitions for existing JavaScript libraries.
4. **Language Services**: Enables tooling features like code completion and error detection in IDEs like VSCode.

---

#### **4. What are access modifiers in TypeScript? Can you explain public, private, and protected modifiers?**

- **Access Modifiers** control the visibility of class members.
  1. **Public (Default)**: Accessible from anywhere.
  2. **Private**: Accessible only within the class where they are defined.
  3. **Protected**: Accessible within the class and its subclasses.

**Example**:

```typescript
class Animal {
  public name: string; // Accessible anywhere
  private age: number; // Accessible only within the Animal class
  protected type: string; // Accessible in Animal and its subclasses

  constructor(name: string, age: number, type: string) {
    this.name = name;
    this.age = age;
    this.type = type;
  }
}

class Dog extends Animal {
  constructor(name: string, age: number) {
    super(name, age, "Dog");
  }

  public getType() {
    return this.type; // Accessible because it's protected
  }
}

const myDog = new Dog("Buddy", 3);
console.log(myDog.name); // Valid
console.log(myDog.getType()); // Valid
// console.log(myDog.age); // Error: 'age' is private
```

---

#### **5. Can you list some types introduced by TypeScript that are not part of JavaScript?**

- **Tuple**: Fixed-length arrays with specific types for each element.
- **Enum**: A set of named constants.
- **Any**: Disables type-checking for a variable.
- **Unknown**: A safer alternative to `any`.
- **Never**: Represents values that never occur.
- **Void**: Used for functions that do not return a value.

---

### **Intermediate Questions**

#### **1. What is the difference between type and interface in TypeScript? When would you use one over the other?**

- **Type**: Used for defining any kind of type, including primitives, union types, and complex objects.
- **Interface**: Specifically used for object structure definitions and supports extension and merging.

**Use Cases**:

- Use **interfaces** for defining object structures, especially when inheritance or merging is needed.
- Use **types** for primitives, unions, or when creating reusable and flexible types.

**Example**:

```typescript
type Point = { x: number; y: number };
interface Circle extends Point {
  radius: number;
}
```

---

#### **2. Can you explain generic types in TypeScript with an example?**

Generics allow writing reusable and flexible components that work with different types.

**Example**:

```typescript
function createArray<T>(item: T, count: number): T[] {
  return Array(count).fill(item);
}

const numbers = createArray<number>(5, 3); // [5, 5, 5]
const strings = createArray<string>("hello", 2); // ["hello", "hello"]
```

---

#### **3. What do you know about structural typing in TypeScript?**

- Structural typing is a type system where compatibility is determined by the shape or structure of the data.
- Types are considered compatible if they have the same properties, even if their names differ.

**Example**:

```typescript
type User = { name: string; age: number };
type Employee = { name: string; age: number; salary: number };

const user: User = { name: "Alice", age: 25 };
const employee: Employee = { name: "Bob", age: 30, salary: 50000 };

const assignable: User = employee; // Valid due to structural typing
```

---

#### **4. What is the purpose of the declare keyword in TypeScript?**

The `declare` keyword is used to inform TypeScript about the existence of variables, functions, or modules that exist in the global scope or are provided by external libraries.

**Example**:

```typescript
declare const globalVariable: string;

console.log(globalVariable); // No TypeScript error
```

---

#### **5. What are some rules of private fields in TypeScript?**

1. Must be declared with `private` or `#`.
2. Only accessible within the class where they are declared.
3. Cannot be accessed by subclasses or external code.

**Example**:

```typescript
class MyClass {
  private field1: string = "Private Field";

  getField1() {
    return this.field1;
  }
}

const obj = new MyClass();
console.log(obj.getField1()); // Valid
// console.log(obj.field1); // Error: 'field1' is private
```

---

### **Advanced Questions**

#### **1. What is the difference between unknown and any in TypeScript? When should you use each?**

- `any`: Opts out of type-checking entirely.
- `unknown`: Requires type-checking before usage.

**Example**:

```typescript
let value: unknown = "Hello";
// console.log(value.toUpperCase()); // Error: Object is of type 'unknown'

if (typeof value === "string") {
  console.log(value.toUpperCase()); // Works after type check
}
```

---

#### **2. What is the never type, and how does it differ from other types in TypeScript?**

- Represents a value that will never occur, often used for:
  1. Functions that throw errors.
  2. Exhaustive checks in switch cases.

**Example**:

```typescript
function error(message: string): never {
  throw new Error(message);
}
```

---

#### **3. What are ambient declarations in TypeScript, and when should they be used?**

- Used to declare external code or modules.
- Stored in `.d.ts` files.
- Example: Declaring a global variable or library not written in TypeScript.

**Example**:

```typescript
declare module "my-library" {
  export function greet(name: string): string;
}
```

---

#### **4. How does TypeScript support type declaration files for JavaScript libraries?**

Type declaration files (`.d.ts`) provide type definitions for existing JavaScript libraries, allowing TypeScript to infer their types.

---

#### **5. What are mapped types, and how are they used in TypeScript?**

- Mapped types allow transforming object types by mapping over their properties.

**Example**:

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type User = { name: string; age: number };
type ReadonlyUser = Readonly<User>; // { readonly name: string; readonly age: number }
```

---

### **Practical Examples**

#### **1. Write a generic function in TypeScript.**

```typescript
function getArray<T>(items: T[]): T[] {
  return items;
}

const stringArray = getArray<string>(["a", "b"]);
```

---

Let me know which part you'd like me to explain further!
