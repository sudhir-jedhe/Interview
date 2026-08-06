Explain why arrow functions cannot be used as constructor functions with the new keyword in JavaScript.

Attempting to instantiate an arrow function using the **`new`** keyword throws an immediate runtime error:

```javascript
const User = (name) => {
  this.name = name;
};

const user = new User('Alice'); 
// ❌ TypeError: User is not a constructor

```

There are **three core technical reasons** built into the ECMAScript specification that prevent arrow functions from serving as constructors.

---

### 1. Lack of Internal `[[Construct]]` Method

In JavaScript, objects that can be instantiated with `new` are known as **Constructors**. To qualify as a constructor, a function object must possess an internal specification method called **`[[Construct]]`**.

When you execute `new Fn()`:

1. The engine checks if `Fn` has a `[[Construct]]` method.
2. **For Regular Functions / Classes:** `[[Construct]]` exists. The engine creates a new plain object, sets up prototype inheritance, binds `this` to the new object, and executes the function body.
3. **For Arrow Functions:** The spec explicitly defines arrow functions **without** the `[[Construct]]` internal method (they only have `[[Call]]`). When `new` is invoked, the engine checks for `[[Construct]]`, finds `undefined`, and throws `TypeError: User is not a constructor`.

---

### 2. No Prototype Property (`User.prototype` is `undefined`)

Every regular JavaScript function is created with a default `prototype` property pointing to an object containing a `constructor` reference. This prototype object serves as the blueprint for instances created via `new`.

Arrow functions **do not have a `prototype` property at all**:

```javascript
function RegularUser() {}
console.log(RegularUser.prototype); 
// Output: { constructor: f ... }

const ArrowUser = () => {};
console.log(ArrowUser.prototype); 
// Output: undefined

```

Because there is no `prototype` object attached to an arrow function, the engine has no prototype chain to assign to a newly created instance object (`instance.__proto__ = Constructor.prototype`).

---

### 3. Lexical `this` Binding

The primary purpose of a constructor function is to initialize a newly created instance object by binding `this` to that new object during execution.

As established earlier, arrow functions do not have a dynamic `this` binding. Their `this` is **lexically inherited from their enclosing scope** at definition time. Allowing `new` on an arrow function would contradict the fundamental design of arrow functions: `new` would attempt to set `this` to a fresh instance, while lexical binding would force `this` to refer to the outer scope.

To eliminate this ambiguity, the ECMAScript specification forbids `new` with arrow functions entirely.

---

### Summary Architectural Comparison

| Internal Property / Behavior        | Regular Function (`function() {}`)      | Arrow Function (`() => {}`)    |
| ----------------------------------- | --------------------------------------- | ------------------------------ |
| **`[[Call]]` Internal Method**      | ✅ Yes (Can be invoked: `fn()`)          | ✅ Yes (Can be invoked: `fn()`) |
| **`[[Construct]]` Internal Method** | ✅ Yes (Can be instantiated: `new fn()`) | ❌ No (Throws `TypeError`)      |
| **`prototype` Property**            | ✅ Yes (`{ constructor: fn }`)           | ❌ `undefined`                  |
| **`this` Binding**                  | Dynamic (Bound at invocation)           | Lexical (Inherited from scope) |
| **`arguments` Object**              | ✅ Has own `arguments` object            | ❌ Inherits outer `arguments`   |

Explain step-by-step what happens under the hood when the new keyword is executed in JavaScript.

When you execute a function or class using the **`new`** keyword in JavaScript (for example, `const user = new User('Alice')`), the engine performs a precise 4-step sequence under the hood.

Here is the step-by-step breakdown of how JavaScript transforms a constructor call into a newly instantiated object.

---

### Step-by-Step Breakdown

```
  1. CREATE           2. LINK               3. BIND & EXECUTE        4. RETURN
┌───────────┐      ┌─────────────────┐      ┌──────────────────┐     ┌───────────────┐
│ Create    │ ──►  │ Set __proto__ = │ ──►  │ Call Constructor │ ──► │ Return new    │
│ empty {}  │      │ Fn.prototype    │      │ with this = {}   │     │ or explicitly │
│ object    │      │                 │      │                  │     │ returned obj  │
└───────────┘      └─────────────────┘      └──────────────────┘     └───────────────┘

```

#### Step 1: A Brand-New Plain Object is Created

The engine creates a fresh, empty object in memory (`{}`).

#### Step 2: Prototype Linkage (`__proto__`)

The engine sets the internal `[[Prototype]]` link (accessible via `__proto__`) of this newly created object to point to the constructor function's **`prototype` property**.

* This is what establishes **prototype inheritance**, granting the new instance access to all methods defined on `Constructor.prototype`.

#### Step 3: Execution and `this` Binding

The constructor function is executed with its **`this` context explicitly bound to the newly created object** from Step 1.

* Any arguments passed to `new Constructor(arg1, arg2)` are supplied to the constructor.
* Lines like `this.name = name` write properties directly onto the new object.

#### Step 4: Conditional Return

The engine inspects the return value of the constructor function:

* **If the constructor explicitly returns a non-primitive object** (e.g., `{ custom: 'object' }`, an `Array`, or a `Function`), that returned object overrides the new instance and becomes the result of the `new` expression.
* **If the constructor returns a primitive** (e.g., `string`, `number`, `boolean`, `null`, `undefined`) or has no `return` statement, the engine ignores the return value and automatically returns the newly created object from Step 1.

---

### Hand-Crafted `new` Implementation (Polyfill)

To see this exact 4-step algorithm operating in JavaScript, here is how you can write a custom `myNew` function that simulates the `new` keyword behavior:

```javascript
function myNew(Constructor, ...args) {
  // STEP 1: Create a brand-new empty object
  const newObj = {};

  // STEP 2: Link [[Prototype]] to Constructor.prototype (if Constructor.prototype exists)
  if (Constructor.prototype) {
    Object.setPrototypeOf(newObj, Constructor.prototype);
  }

  // STEP 3: Execute Constructor with 'this' set to newObj
  const result = Constructor.apply(newObj, args);

  // STEP 4: Return result if it's a non-primitive object; otherwise return newObj
  const isObject = typeof result === 'object' && result !== null;
  const isFunction = typeof result === 'function';

  if (isObject || isFunction) {
    return result; // Custom object return override
  }

  return newObj; // Default new instance return
}

```

---

### Code Demonstration & Edge Cases

```javascript
function User(name, age) {
  this.name = name;
  this.age = age;
}

User.prototype.sayHello = function () {
  return `Hello, I'm ${this.name}!`;
};

// -------------------------------------------------------------
// Comparing native 'new' vs our custom 'myNew'
// -------------------------------------------------------------

const userNative = new User('Alice', 25);
const userCustom = myNew(User('Bob', 30)); // Using custom polyfill

console.log(userNative.sayHello()); // "Hello, I'm Alice!"
console.log(userNative.__proto__ === User.prototype); // true

// -------------------------------------------------------------
// Edge Case: Explicit Object Return Override
// -------------------------------------------------------------

function OverriddenUser(name) {
  this.name = name;
  return { role: 'Admin' }; // Explicitly returning an object!
}

const overrideTest = new OverriddenUser('Charlie');
console.log(overrideTest); // Output: { role: 'Admin' } ('name' is discarded!)

// -------------------------------------------------------------
// Edge Case: Returning a Primitive (Ignored)
// -------------------------------------------------------------

function PrimitiveUser(name) {
  this.name = name;
  return "I am a string!"; // Returning a primitive!
}

const primitiveTest = new PrimitiveUser('David');
console.log(primitiveTest); // Output: PrimitiveUser { name: 'David' } (String is ignored!)

```

---

### What About ES6 `class` Constructors?

Under the hood, ES6 `class` syntax uses the exact same prototype mechanism and 4-step allocation process as traditional constructor functions.

However, `class` constructors add a safety check: their internal `[[Construct]]` method marks them as classes, causing the JS engine to throw `TypeError: Class constructor User cannot be invoked without 'new'` if you attempt to call `User()` without the `new` keyword.
