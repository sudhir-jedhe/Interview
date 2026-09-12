In JavaScript, functions do not strictly enforce arity: passing fewer arguments sets the missing ones to `undefined`, and passing extra ones simply ignores them by default.

Here are the ways arguments are structured and handled in modern JavaScript (ES6+):

---

### 1. Positional Arguments

The standard mechanism where arguments match parameters based on order:

```javascript
function greet(firstName, lastName) {
  return `Hello, ${firstName} ${lastName}`;
}

greet("Jane", "Doe"); // firstName = "Jane", lastName = "Doe"

```

---

### 2. Default Arguments

Provide fallback values when an argument is omitted or explicitly passed as `undefined`:

```javascript
function connect(host, port = 3000, timeout = 5000) {
  // port defaults to 3000 if not provided
}

connect("localhost"); 
connect("localhost", undefined, 10000); // port still resolves to 3000

```

---

### 3. Rest Parameters (`...args`)

Modern JavaScript's replacement for the legacy `arguments` object. It gathers any number of trailing positional arguments into a genuine Array:

```javascript
function sum(multiplier, ...numbers) {
  // numbers is a true Array [2, 4, 6]
  return numbers.map(n => n * multiplier);
}

sum(2, 2, 4, 6);

```

---

### 4. Named / Destructured Arguments (Simulated Keyword Args)

JavaScript has no native `func(key=value)` calling syntax. Instead, an object literal is passed and unpacked via destructuring. This allows arbitrary argument order and named optional properties:

```javascript
function createUser({ name, role = "viewer", active = true } = {}) {
  // role defaults to "viewer", empty object fallback prevents TypeError if omitted
}

// Order does not matter
createUser({ role: "admin", name: "Alice" });
createUser(); // Valid because of `= {}` fallback

```

---

### 5. Callback Arguments

Because functions are first-class citizens, passing functions as arguments to control asynchronous flow, event handling, or iteration is standard practice:

```javascript
const numbers = [1, 2, 3];
numbers.filter((val, index) => val > 1); // anonymous function passed as argument

```

---

### 6. The Legacy `arguments` Object

An array-like local variable automatically available inside non-arrow functions:

```javascript
function legacySum() {
  // arguments is Array-like (has .length and indices, but no map/filter)
  const args = Array.from(arguments);
  return args.reduce((acc, curr) => acc + curr, 0);
}

```

*Note: The `arguments` object does not exist in arrow functions and is largely superseded by rest parameters (`...args`).*

---

### Memory & Passing Mechanism: Call-by-Sharing

* **Primitives** (numbers, strings, booleans, symbols, null, undefined): Passed by value. Mutating the local parameter does not affect the outer scope.
* **Objects / Arrays / Functions**: Passed by copy of the reference. Mutating properties on the object updates the original, but reassigning the argument variable breaks the link:

```javascript
function update(user) {
  user.name = "Bob";     // Mutates external object
  user = { name: "Eve" }; // Reassignment: does NOT affect outer reference
}

```
