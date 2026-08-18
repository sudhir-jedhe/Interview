In TypeScript, the `ambient` keyword is used in the context of declaring types for code that exists outside the TypeScript project but is expected to be available during runtime. This is most often used in declaration files (e.g., `.d.ts` files) to define types for external libraries or global variables that TypeScript doesn't directly know about.

### **Ambient Declarations**

The `ambient` declaration is typically used when you are working with third-party libraries, external scripts, or any other code that's not directly written in TypeScript. It tells TypeScript about the types and shape of variables, classes, functions, and modules that are defined outside your current file, often in the global scope or within other modules.

In TypeScript, ambient declarations are commonly created with the `declare` keyword. These are typically placed in `.d.ts` files.

### **Key Use Cases for Ambient Declarations**

1. **Global Variables**:
   If there are global variables that are accessible during runtime (e.g., from a script tag or external library), you can declare their type using `declare`.

2. **External Modules**:
   If you're using a module that is not written in TypeScript (like a plain JavaScript module), you can declare its types and interfaces for TypeScript to understand the module's API.

3. **Third-Party JavaScript Libraries**:
   When working with third-party JavaScript libraries that do not have TypeScript definitions, you can write or use existing ambient type declarations to describe the library's API.

### **Examples of Ambient Declarations**

1. **Declaring Global Variables**
   If you're including a global JavaScript library (e.g., `jQuery`) and you don't have TypeScript type definitions for it, you can declare it like this:

   ```typescript
   // ambient.d.ts
   declare var $: any;
   ```

   In this example, we declare that there's a global variable `$` (which could be jQuery or another library), and we specify that its type is `any`, meaning it could be anything. TypeScript will not try to enforce any type checking on `$` in this case.

2. **Declaring External Modules**
   If you are using a JavaScript module without TypeScript definitions, you can declare its types manually:

   ```typescript
   // ambient.d.ts
   declare module "my-javascript-library" {
     export function myFunction(a: string): number;
   }
   ```

   In this example, we're declaring a module `'my-javascript-library'` and specifying that it exports a function `myFunction`, which takes a `string` as an argument and returns a `number`.

3. **Declaring Global Functions or Classes**
   If you have a global function or class that's defined elsewhere in your JavaScript, you can declare it like this:

   ```typescript
   // ambient.d.ts
   declare function myGlobalFunction(a: string): void;
   declare class MyClass {
     constructor();
     myMethod(): string;
   }
   ```

   In this example, we declare a global function `myGlobalFunction` and a global class `MyClass`, including their types. TypeScript will now understand the types for these entities.

4. **Using `declare` with TypeScript Modules**
   If you are writing TypeScript declaration files for external libraries or modules, you can declare types for modules that might not have their own TypeScript typings.

   ```typescript
   // ambient.d.ts
   declare module "some-external-library" {
     export function someFunction(arg: string): boolean;
   }
   ```

   In this case, we declare a module that exists as an external dependency and specify its function signature.

### **`declare` vs `ambient`**

While you may see the term **ambient** in TypeScript documentation, it doesn't refer to a specific keyword but rather a concept—types that are available globally, even if they aren't part of the TypeScript file itself. You use `declare` to mark these types or values as ambient.

### **Common Uses of Ambient Declarations**

- **Global variables** that come from external scripts, such as jQuery, that you reference in your TypeScript code.
- **External JavaScript libraries** without TypeScript definitions.
- **Environment-specific types** like browser `window` object or Node.js `process` object that are already available in the runtime.

### **Example: Ambient Declaration for `window` object**

TypeScript has built-in types for common environments like the browser or Node.js. You can declare new properties on the `window` object if needed.

```typescript
// ambient.d.ts
declare global {
  interface Window {
    myGlobalVar: string;
  }
}
```

Here, we are augmenting the `Window` interface to declare a new property `myGlobalVar` of type `string`. After this, you can safely access `window.myGlobalVar` in TypeScript with proper type checking.

### **Summary of Key Points:**

- **`declare`** is used for creating ambient declarations.
- Ambient declarations tell TypeScript about types or values that are available globally but not directly written in TypeScript.
- **Common uses**: Declaring global variables, third-party libraries, or environment-specific values that exist outside TypeScript code (e.g., JavaScript libraries, global variables, etc.).

By using ambient declarations, TypeScript can better integrate with non-TypeScript code while still providing type safety wherever possible.
