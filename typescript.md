Here is a complete, structured guide providing answers and code examples for **all remaining non-highlighted questions** from your screenshots, categorized by category and screen.

---

## 1. Entry & Basic Questions (Screenshots 1 & 2)

### **Q1: What is the difference between `.ts` and `.tsx` extensions in TypeScript?**

- **`.ts`**: Standard TypeScript file used for vanilla TypeScript/JavaScript code, interfaces, utility functions, and backend logic.
- **`.tsx`**: TypeScript file containing JSX syntax (commonly used in React). Generics written in `.tsx` files must avoid syntax ambiguity with JSX tags (e.g., `<T,>` instead of `<T>`).

```tsx
// .ts file: Standard generic function
const getId = <T>(id: T): T => id;

// .tsx file: Trailing comma needed so JSX parser doesn't treat <T> as an HTML tag
const getIdTsx = <T,>(id: T): T => id;

```

---

### **Q2: List the built-in types in TypeScript**

TypeScript built-in types include primitives, special types, and structural types:

- **Primitives:** `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`
- **Special Types:** `any`, `unknown`, `never`, `void`
- **Complex/Object:** `object`, Arrays (`type[]`), Tuples (`[string, number]`)

---

### **Q3: How to call base class constructor from child class in TypeScript?**

Use the `super()` keyword inside the child class's constructor before accessing `this`.

```typescript
class Animal {
  constructor(public name: string) {}
}

class Dog extends Animal {
  constructor(
    name: string,
    public breed: string,
  ) {
    super(name); // Calls Animal constructor
  }
}
```

---

### **Q4 & Q5 & Q6 & Q9 & Q11 & Q17: What is TypeScript, why compile it, and why use it over JavaScript?**

- **What it is:** TypeScript is a statically typed superset of JavaScript developed by Microsoft that compiles down to plain JavaScript.
- **Why compile:** Browsers and Node.js engines only execute JavaScript, not TypeScript natively.
- **Key Benefits:**
- **Catch errors early:** Catch syntax and type mismatches at compile-time rather than runtime.
- **Self-documenting code:** Interfaces and types clarify object shapes for developers.
- **Refactoring safety:** IDEs offer reliable auto-completion and safe rename refactoring across large codebases.

---

### **Q7: How to perform string interpolation in TypeScript?**

Use ES6 template literals using backticks (```) and the `${variable}` syntax.

```typescript
const username = "Alex";
const greeting = `Hello, ${username}! Today is ${new Date().toLocaleDateString()}.`;
```

---

### **Q8: What are Modules in TypeScript?**

Modules isolate scope. Any file containing a top-level `import` or `export` is treated as a module. Variables declared in a module are not visible globally.

```typescript
// mathUtils.ts
export const add = (a: number, b: number): number => a + b;

// app.ts
import { add } from "./mathUtils";
```

---

### **Q12: What is the difference between types `String` and `string` in TypeScript?**

- **`string` (lowercase):** The primitive TypeScript type representing primitive string values (preferred).
- **`String` (uppercase):** JavaScript's Wrapper Object class for strings. Using uppercase `String` as a type annotation is considered bad practice.

---

### **Q13: What is Type Erasure in TypeScript?**

Type erasure refers to the process where the TypeScript compiler (`tsc`) strips away all type annotations, interfaces, types, and generics during compilation, leaving behind clean JavaScript.

---

### **Q14 / Code Challenge Q3: How could you check `null` and `undefined` in TypeScript?**

Using loose equality (`== null`) checks for both `null` and `undefined` simultaneously. Alternatively, use optional chaining (`?.`) or nullish coalescing (`??`).

```typescript
let val: string | null | undefined;

// Loose equality check catches BOTH null and undefined
if (val == null) {
  console.log("val is either null or undefined");
}

// Nullish coalescing
const valueToUse = val ?? "default value";
```

---

### **Q15 & Q39: Which access modifiers are implied when not specified?**

Members of a class in TypeScript are **`public` by default**.

---

### **Q16 & Q32: Which Object-Oriented terms/principles are supported by TypeScript?**

TypeScript supports all four core pillars of Object-Oriented Programming (OOP):

1. **Encapsulation:** Access modifiers (`public`, `private`, `protected`).
2. **Abstraction:** `abstract` classes and `interface` shapes.
3. **Inheritance:** `extends` and `implements` keywords.
4. **Polymorphism:** Method overriding and generic constraints.

---

## 2. Junior Level Questions (Screenshots 2 & 3)

### **Q18: What is a TypeScript Map file (`.map`)?**

Source map files (`.js.map`) bridge compiled JavaScript back to original TypeScript source code. They allow tools like Chrome DevTools to let developers debug TypeScript directly.

---

### **Q19: Could we use TypeScript on backend and how?**

Yes. You can use TypeScript in Node.js/Deno/Bun applications using tools like `ts-node`, `tsx`, or compiling with `tsc` before running `node dist/index.js`.

---

### **Q20: What are assertion functions?**

Assertion functions assert that a condition is true. If false, they throw an exception. TypeScript narrows the parameter's type after the assertion call.

```typescript
function assertIsString(val: any): asserts val is string {
  if (typeof val !== "string") {
    throw new Error("Not a string!");
  }
}

function processInput(input: unknown) {
  assertIsString(input);
  // TypeScript now knows 'input' is definitely a string
  console.log(input.toUpperCase());
}
```

---

### **Q21: What is the purpose of Nullish Coalescing operator (`??`)?**

The `??` operator returns its right-hand side operand when its left-hand side operand is `null` or `undefined`. Unlike logical OR (`||`), it treats falsy values like `0`, `""`, and `false` as valid values.

```typescript
const count = 0;
const a = count || 10; // Result: 10 (0 is falsy)
const b = count ?? 10; // Result: 0 (0 is not null/undefined)
```

---

### **Q22: How do we create an `enum` with `string` values?**

Assign string values explicitly to each enum member:

```typescript
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
```

---

### **Q24 & Q27: What is Optional Chaining in TypeScript?**

Optional chaining (`?.`) short-circuits and evaluates to `undefined` if an object property before `?.` is `null` or `undefined`, preventing `TypeError: Cannot read property of undefined`.

```typescript
const user = { profile: { name: "John" } };
const zipCode = user?.profile?.address?.zipCode; // Returns undefined safely
```

---

### **Q25: Describe what are conditional types in TypeScript**

Conditional types select one of two possible types based on a type relationship condition, written in a ternary format: `T extends U ? X : Y`.

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
```

---

### **Q26: How to make Arrays that can only be read in TypeScript?**

Use `readonly T[]` or `ReadonlyArray<T>`.

```typescript
const numbers: readonly number[] = [1, 2, 3];
// numbers.push(4); // Error: Property 'push' does not exist
```

---

### **Q28: What are Decorators in TypeScript?**

Decorators are special syntax (`@expression`) attached to class declarations, methods, properties, or parameters that allow meta-programming and behavioral annotations.

```typescript
function Log(target: any, key: string) {
  console.log(`${key} method was called`);
}

class Service {
  @Log
  execute() {}
}
```

---

### **Q29 & Q30 & Q34: Interfaces vs Classes & When to use which?**

- **`interface`**: Exists **only at compile-time**. Defines pure type shapes/contracts without emitting executable JavaScript runtime code. Use for data structures/DTOs.
- **`class`**: Exists at **both compile-time and runtime**. Emits underlying JavaScript code containing factory blueprints, logic, constructors, and instance methods. Use for business logic implementation.

---

### **Q31: How to implement class constants in TypeScript?**

Use `static readonly` variables within class bodies:

```typescript
class AppConfig {
  static readonly API_URL = "https://api.example.com";
}
// Usage: AppConfig.API_URL
```

---

### **Q33: What is getters/setters in TypeScript?**

Getters and setters intercept property access and modification in class instances.

```typescript
class Circle {
  private _radius: number = 0;

  get radius(): number {
    return this._radius;
  }

  set radius(value: number) {
    if (value < 0) throw new Error("Radius cannot be negative");
    this._radius = value;
  }
}
```

---

### **Q35 & Q61 & Q81: How to choose between `never`, `unknown`, and `any`?**

- **`any`**: Turns off type checking completely (unsafe).
- **`unknown`**: Type-safe version of `any`. Must be validated via type checks before use.
- **`never`**: Represents values that can **never** occur (e.g., functions that always throw errors, infinite loops, or exhaustive switch checks).

```typescript
// Exhaustive type check using 'never'
type Shape = "Square" | "Circle";

function getArea(shape: Shape) {
  switch (shape) {
    case "Square":
      return 4;
    case "Circle":
      return 3.14;
    default:
      const _exhaustiveCheck: never = shape; // Ensures all union cases are handled
      return _exhaustiveCheck;
  }
}
```

---

### **Q37: What is Typings in TypeScript?**

"Typings" or Type Definition files (`.d.ts`) provide type metadata for pure JavaScript libraries, enabling auto-completion and static analysis without converting JS to TS source code.

---

## 3. Mid Level Questions (Screenshots 3 & 4)

### **Q38: Explain Project References and its benefits**

Project References (`tsconfig.json` `references` property) break giant TypeScript codebases into independent, buildable sub-projects. This speeds up build times via incremental builds.

---

### **Q40: Explain how and why we could use property decorators in TS?**

Property decorators observe or record property metadata on a class definition (e.g., ORM entity attributes like `@Column()`).

---

### **Q41: How to make a `readonly` tuple type in TypeScript?**

Prefix the tuple structure with `readonly`:

```typescript
type Point = readonly [number, number];
const p: Point = [10, 20];
// p[0] = 5; // Error: Cannot assign to read-only index
```

---

### **Q42: What is `unique symbol` used for?**

`unique symbol` creates guaranteed nominal primitive types for creating globally unique keys.

```typescript
const Key1: unique symbol = Symbol("Key");
```

---

### **Q43: Difference between Optional Chaining (`?.`) and Non-null assertion operator (`!`)**

- **`?.` (Safe at runtime):** Checks runtime value; returns `undefined` if null/undefined.
- **`!` (Compile-time hint):** Tells compiler "I know this isn't null" and emits regular JS property access without checks. Can throw runtime errors if wrong.

---

### **Q44: What does Short-Circuiting mean in TypeScript?**

Refers to logical short-circuit evaluation (`&&`, `||`, `??`) where evaluation stops as soon as the outcome is determined.

---

### **Q45: List a few rules of `private` fields in TypeScript**

- Compile-time protection only (unlike `#private` ES fields).
- Cannot be accessed outside class body.
- Cannot be accessed in child classes.

---

### **Q46: What are some use cases of template literal types?**

Creating complex string literal patterns dynamically:

```typescript
type Event = "click" | "hover";
type EventHandler = `on${Capitalize<Event>}`; // "onClick" | "onHover"
```

---

### **Q47: How to check the type of a variable or constant in TypeScript?**

Use `typeof` operator for primitives or `instanceof` for classes.

```typescript
if (typeof val === "string") {
  /* ... */
}
if (obj instanceof Date) {
  /* ... */
}
```

---

### **Q48: How to add types to an interface from another interface or extend types?**

Use `extends` for interfaces or `&` (intersection) for type aliases.

```typescript
interface Animal {
  name: string;
}
interface Dog extends Animal {
  breed: string;
}
```

---

### **Q50: What is the difference between `enum` and `const enum`?**

- **`enum`**: Generates a runtime JavaScript object.
- **`const enum`**: Fully inlined at compile time; emits no JS code structure.

---

### **Q51: Does TypeScript support function overloading?**

Yes. Define overload signature heads followed by a single matching implementation signature.

```typescript
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  }
  return new Date(mOrTimestamp);
}
```

---

### **Q52: What are different components of TypeScript?**

1. **Language Syntax:** Types, annotations, generics.
2. **Compiler (`tsc`):** Transforms TS to JS.
3. **Language Service:** Powers IDE auto-complete and refactoring.

---

### **Q53: How can you allow classes defined in a module to be accessible outside?**

Use the `export` keyword before class declaration.

---

### **Q55: Why do we need to use `abstract` keyword for classes and their methods?**

`abstract` classes serve as base blueprints that cannot be directly instantiated (`new Base()`). Derived classes must implement all abstract methods.

---

### **Q56: What is Structural Typing?**

TypeScript uses duck typing: Type compatibility is based on shape structure, not explicit nominal hierarchy declarations.

```typescript
type Point = { x: number; y: number };
const p = { x: 1, y: 2, z: 3 };
const point: Point = p; // Valid: 'p' satisfies the minimum shape requirements
```

---

### **Q57: How TypeScript is optionally statically typed language?**

You can selectively enable static types or bypass them by using `any` or setting `"noImplicitAny": false`.

---

## 4. Senior & Expert Level Questions (Screenshots 4 & 5)

### **Q58 & Q65: What is Mixin Class & Mixin Constructor Type?**

Mixins compose class behaviors dynamically through function composition.

```typescript
type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = new Date();
  };
}
```

---

### **Q59: How to use external plain JavaScript libraries in TypeScript?**

Install `@types/package-name` via DefinitelyTyped or declare ambient modules (`declare module 'lib-name'`).

---

### **Q60: How does `override` keyword work in TypeScript?**

Ensures child class methods correctly override a parent method. Throws a compile error if the base class method does not exist.

---

### **Q62: Explain what is Currying in TypeScript?**

Translating a multi-argument function into a series of single-argument functions while maintaining typed inference across stages.

---

### **Q63 & Q64: Index Signatures in TypeScript**

Index signatures define key-value lookup shapes for dynamic object properties:

```typescript
interface Dictionary {
  [key: string]: number;
}
```

---

### **Q66: What is dynamic `import` expression?**

Loads TypeScript/JavaScript modules asynchronously on-demand using `import("./module")`, returning a `Promise`.

---

### **Q68: How to exclude property from type in TypeScript?**

Use the `Omit<T, K>` utility type:

```typescript
type User = { id: string; name: string; email: string };
type UserWithoutEmail = Omit<User, "email">;
```

---

### **Q69: Why is the `infer` keyword needed in TypeScript?**

`infer` extracts dynamic type parameters inside conditional type checks:

```typescript
type ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never;
```

---

### **Q71: `declare enum` vs `declare const enum**`

Ambient declarations that inform TypeScript of existing runtime enums without generating runtime output. `declare const enum` inlines values everywhere.

---

### **Q72: What is the need of `--incremental` flag in TypeScript?**

Saves compilation build state into a `.tsbuildinfo` file to recompile only modified files, speeding up build times.

---

### **Q73 & Q78: `declare` keyword & Ambients**

`declare` tells TypeScript that a variable or module exists in the global environment (e.g., CDN scripts) without compiling to output code.

---

### **Q75: How to make a union type from properties in TypeScript?**

Use indexed access types: `Type[keyof Type]`.

```typescript
type Person = { name: string; age: number };
type PersonValues = Person[keyof Person]; // string | number
```

---

### **Q76: Is it possible to generate TypeScript declaration files from JS library?**

Yes, by enabling `"declaration": true` and `"allowJs": true` in `tsconfig.json`.

---

### **Q77: What is the benefit of `import` assertions features in TypeScript?**

Allows importing non-JS assets safely with target runtime validation (e.g., `import data from "./data.json" assert { type: "json" }`).

---

### **Q79: `private` keyword vs `#private` fields**

- **`private` (TS):** Compile-time check only. Erased in output JS.
- **`#private` (ES):** Hard private field enforced at JavaScript runtime engine level.

---

### **Q80: What is one thing you would change about TypeScript?**

_(Common interview answer)_: Improving native structural nominal type support or standardizing error message clarity for complex generic/conditional types.

---

## 5. Code Challenges (Screenshot 5)

### **Code Challenge Q1: Is that TypeScript code valid? Explain why**

Most invalid code questions check for assigning mismatched types, accessing private properties outside classes, or using uninitialized generic constraints.

---

### **Code Challenge Q2: How to make an array with a specific length/elements (Tuple)?**

Define a Tuple type structure:

```typescript
type FixedArray = [number, number, string]; // Fixed length 3 with typed indices
```

---

### **Code Challenge Q4: Are strongly-typed functions as parameters possible in TypeScript?**

Yes, declare callback functional signatures:

```typescript
function execute(callback: (err: Error | null, result: string) => void) {
  callback(null, "Done");
}
```

---

### **Code Challenge Q5 & Q9: What's wrong with that code?**

Look out for common errors like:

- Missing return statements in functions with defined return types.
- Direct mutation of `readonly` properties.
- Implicit `any` errors when strict mode is on.

---

### **Code Challenge Q6: What will be result of this code execution?**

Usually evaluates edge-cases like string concatenation vs number addition (`"1" + 1 === "11"`), `this` context binding losses, or short-circuiting operator behaviors.

---

### **Code Challenge Q7: How would you overload a class constructor in TypeScript?**

Use constructor overloads before the main implementation signature:

```typescript
class Point {
  constructor(x: number, y: number);
  constructor(coords: string);
  constructor(xOrCoords: number | string, y?: number) {
    // Implementation
  }
}
```

---

### **Code Challenge Q8: In `a?.b.c`, if `a.b` is `null`, then `a.b.c` will evaluate to `undefined`, right?**

**No.** `a?.b.c` only guards access to property `b` on `a`. If `a` exists and `a.b` is `null`, attempting `.c` on `null` will throw a runtime `TypeError`. The correct syntax is `a?.b?.c`.
