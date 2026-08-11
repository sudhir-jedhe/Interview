The difference between `undefined` and `undeclared` comes down to whether the JavaScript engine knows the variable exists.

* **`undefined`** means a variable **has been declared** in the current scope, but it has not yet been assigned a value.
* **`undeclared`** means a variable **does not exist** in the current scope because it was never declared using `let`, `const`, or `var`.

### 1. `undefined` (Declared, but empty)

When you declare a variable without initializing it, JavaScript automatically assigns it the primitive value `undefined`.

```javascript
let userName; 

console.log(userName); // Output: undefined
console.log(typeof userName); // Output: "undefined"

```

### 2. `undeclared` (Does not exist)

When you try to access a variable that has never been declared, the engine cannot find it in the memory scope and throws a runtime error.

```javascript
// 'age' was never declared anywhere
console.log(age); 
// ❌ Throws: ReferenceError: age is not defined

```

### The `typeof` Quirk

There is one special case where JavaScript handles an `undeclared` variable without throwing an error: when using the `typeof` operator. It acts as a safety guard to check if a variable exists.

```javascript
// 'paymentMethod' is undeclared
console.log(typeof paymentMethod); 
// Output: "undefined" (Does not throw a ReferenceError)

```
