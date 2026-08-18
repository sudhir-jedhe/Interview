Here’s an in-depth explanation and examples for each type operator in TypeScript's advanced type system:

---

### **1. Generics - Types that Take Parameters**

Generics allow creating reusable components that work with a variety of types, enabling flexibility and type safety.

#### **Examples**:

1. **Generic Function**:

   ```typescript
   function identity<T>(value: T): T {
     return value;
   }

   const num = identity<number>(5); // 5
   const str = identity<string>("hello"); // "hello"
   ```

2. **Generic Array**:

   ```typescript
   function createArray<T>(length: number, value: T): T[] {
     return Array(length).fill(value);
   }

   const numbers = createArray<number>(3, 5); // [5, 5, 5]
   ```

3. **Generic Interface**:

   ```typescript
   interface Pair<T, U> {
     first: T;
     second: U;
   }

   const pair: Pair<string, number> = { first: "Hello", second: 42 };
   ```

4. **Generic Constraints**:

   ```typescript
   function getLength<T extends { length: number }>(item: T): number {
     return item.length;
   }

   getLength("hello"); // 5
   getLength([1, 2, 3]); // 3
   ```

5. **Generic Class**:

   ```typescript
   class Box<T> {
     content: T;
     constructor(content: T) {
       this.content = content;
     }
   }

   const stringBox = new Box<string>("TypeScript");
   ```

---

### **2. Keyof Type Operator**

The `keyof` operator generates a union of the keys of a given type.

#### **Examples**:

1. **Extracting Keys**:

   ```typescript
   type User = { id: number; name: string };
   type UserKeys = keyof User; // "id" | "name"
   ```

2. **Keyof in a Function**:

   ```typescript
   function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
     return obj[key];
   }

   const user = { id: 1, name: "Alice" };
   console.log(getProperty(user, "name")); // Alice
   ```

3. **Dynamic Lookup**:

   ```typescript
   type Car = { make: string; model: string; year: number };
   type CarKeys = keyof Car; // "make" | "model" | "year"
   ```

4. **Keyof in Classes**:

   ```typescript
   class Animal {
     species: string;
     age: number;
   }
   type AnimalKeys = keyof Animal; // "species" | "age"
   ```

5. **Use in Conditional Types**:

   ```typescript
   type IsString<T> = T extends keyof string ? true : false;

   type Result = IsString<"length">; // true
   ```

---

### **3. Typeof Type Operator**

The `typeof` operator allows creating a type from the runtime value of a variable or function.

#### **Examples**:

1. **Type Based on Variable**:

   ```typescript
   const user = { id: 1, name: "Alice" };
   type UserType = typeof user; // { id: number; name: string }
   ```

2. **Type Based on Function**:

   ```typescript
   function add(a: number, b: number): number {
     return a + b;
   }
   type AddType = typeof add; // (a: number, b: number) => number
   ```

3. **Dynamic Constants**:

   ```typescript
   const roles = {
     admin: "ADMIN",
     user: "USER",
   };

   type Roles = typeof roles; // { admin: string; user: string }
   ```

4. **Combining with Keyof**:

   ```typescript
   const colors = {
     red: "#FF0000",
     green: "#00FF00",
     blue: "#0000FF",
   };

   type ColorKeys = keyof typeof colors; // "red" | "green" | "blue"
   ```

5. **Use in Guards**:

   ```typescript
   const getType = (value: unknown) => typeof value;

   type TypeOfValue = ReturnType<typeof getType>; // "string" | "number" | "boolean" | "undefined" | "object" | "function"
   ```

---

### **4. Indexed Access Types**

Access a specific property type using `Type['key']` syntax.

#### **Examples**:

1. **Access Property Type**:

   ```typescript
   type User = { id: number; name: string };
   type UserName = User["name"]; // string
   ```

2. **Dynamic Access**:

   ```typescript
   type Options = { darkMode: boolean; fontSize: number };
   type ValueType = Options[keyof Options]; // boolean | number
   ```

3. **Nested Types**:

   ```typescript
   type Nested = { user: { id: number; name: string } };
   type UserId = Nested["user"]["id"]; // number
   ```

4. **Index with Union**:

   ```typescript
   type Config = { optionA: string; optionB: number };
   type ConfigValues = Config["optionA" | "optionB"]; // string | number
   ```

5. **Readonly Values**:
   ```typescript
   type ReadonlyArray<T> = T[number];
   type Letters = ReadonlyArray<["a", "b", "c"]>; // "a" | "b" | "c"
   ```

---

### **5. Conditional Types**

Conditional types act like `if` statements for types.

#### **Examples**:

1. **Basic Conditional Type**:

   ```typescript
   type IsString<T> = T extends string ? true : false;

   type Test1 = IsString<string>; // true
   type Test2 = IsString<number>; // false
   ```

2. **Exclude Utility**:

   ```typescript
   type Exclude<T, U> = T extends U ? never : T;

   type Result = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
   ```

3. **Infer Keyword**:

   ```typescript
   type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

   type ReturnTypeExample = GetReturnType<() => number>; // number
   ```

4. **Filter Properties**:

   ```typescript
   type Filter<T, U> = {
     [K in keyof T]: T[K] extends U ? K : never;
   }[keyof T];

   type StringKeys = Filter<{ a: string; b: number; c: string }, string>; // "a" | "c"
   ```

5. **Distributive Conditional**:

   ```typescript
   type Flatten<T> = T extends any[] ? T[number] : T;

   type Result = Flatten<number[]>; // number
   ```

---

### **6. Mapped Types**

Mapped types allow creating new types by transforming existing types.

#### **Examples**:

1. **Readonly**:

   ```typescript
   type Readonly<T> = {
     readonly [K in keyof T]: T[K];
   };

   type User = { id: number; name: string };
   type ReadonlyUser = Readonly<User>; // { readonly id: number; readonly name: string }
   ```

2. **Optional**:

   ```typescript
   type Optional<T> = {
     [K in keyof T]?: T[K];
   };

   type User = { id: number; name: string };
   type OptionalUser = Optional<User>; // { id?: number; name?: string }
   ```

3. **Pick**:

   ```typescript
   type Pick<T, K extends keyof T> = {
     [P in K]: T[P];
   };

   type User = { id: number; name: string; email: string };
   type PickedUser = Pick<User, "id" | "name">; // { id: number; name: string }
   ```

4. **Record**:

   ```typescript
   type Record<K extends keyof any, T> = {
     [P in K]: T;
   };

   type UserRoles = Record<"admin" | "user", boolean>; // { admin: boolean; user: boolean }
   ```

5. **Transform Properties**:

   ```typescript
   type CapitalizedKeys<T> = {
     [K in keyof T as Capitalize<string & K>]: T[K];
   };

   type User = { id: number; name: string };
   type CapitalizedUser = CapitalizedKeys<User>; // { Id: number; Name: string }
   ```

---

### **7. Template Literal Types**

Template literal types allow creating types using string templates.

#### **Examples**:

1. **Simple Template**:

   ```typescript
   type ID<T extends string> = `${T}-ID`;

   type UserID = ID<"user">; // "user-ID"
   ```

2. **Dynamic Keys**:

   ```typescript
   type Prefix<T extends string, P extends string> = `${P}-${T}`;

   type PrefixedName = Prefix<"name", "user">; // "user-name"
   ```

3. **Case Transformations**:

   ```typescript
   type Capitalized<T extends string> = Capitalize<T>;

   type Result = Capitalized<"hello">; // "Hello"
   ```

4. **Union with Templates**:

   ```typescript
   type Role = "admin" | "user";
   type RoleMessage = `${Role}-message`;

   type Message = RoleMessage; // "admin-message" | "user-message"
   ```

5. **Nested Templates**:
   ```typescript
   type Nested<T extends string> = `${T}-${T}`;
   type Result = Nested<"item">; // "item-item"
   ```

---

Let me know if you'd like to dive deeper into any specific operator or concept!
