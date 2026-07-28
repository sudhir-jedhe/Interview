// https://www.geeksforgeeks.org/call-by-value-vs-call-by-reference-in-javascript/

**Call by value & Call by reference**

The original variable is not modified on changes in other variables.
Actual and copied variables will be created in different memory locations.
On passing variables in a function, any changes made in the passed variable will not affect the original one.

The original variable gets modified on changes in other variables.
Actual and copied variables are created in the same memory location.
On passing variables in a function, any changes made in the passed parameter will update the original
variable’s reference too.

```js
// By value (primitives)
let a = 5;
let b;
b = a;
a = 3;
console.log(a);
console.log(b);

// By reference (all objects (including functions))
let c = { greeting: "Welcome" };
let d;
d = c;

// Mutating the value of c
c.greeting = "Welcome to geeksforgeeks";
console.log(c);
console.log(d);
```

In programming, **Call by Value** and **Call by Reference** refer to two different ways of passing arguments to functions. These concepts are crucial because they determine how changes to the function parameters affect the original data passed to the function.

### **1. Call by Value**

In **Call by Value**, the actual value of the argument is passed to the function. This means that the function works with a copy of the original data, and any changes made to the parameter inside the function do not affect the original value outside the function.

#### Key Points:

- A **copy** of the actual data is passed to the function.
- Changes made to the parameter inside the function do not affect the original value outside.
- It is used for **primitive** data types (e.g., numbers, strings, booleans).

#### Example in JavaScript:

```javascript
function addTen(x) {
  x = x + 10; // Modifies the copy, not the original variable
  console.log("Inside function:", x); // 20
}

let num = 10;
addTen(num);

console.log("Outside function:", num); // 10 (original num is not changed)
```

**Explanation**:

- The value of `num` is passed to the function `addTen`, and within the function, a copy of `num` is used.
- The change made inside the function (`x = x + 10`) does not affect the original `num` outside the function.

### **2. Call by Reference**

In **Call by Reference**, instead of passing a copy of the actual value, the reference (or address) of the variable is passed to the function. This means the function works with the **original data** directly, and any changes made inside the function will affect the original value outside the function.

#### Key Points:

- A **reference** (or memory address) to the original data is passed.
- Changes made to the parameter inside the function **will modify the original variable** outside the function.
- It is typically used for **objects** and **arrays** in JavaScript.

#### Example in JavaScript:

```javascript
function modifyObject(obj) {
  obj.name = "John"; // Modifies the original object directly
  console.log("Inside function:", obj);
}

let person = { name: "Jane" };
modifyObject(person);

console.log("Outside function:", person); // { name: "John" }
```

**Explanation**:

- The reference to the `person` object is passed to the function `modifyObject`.
- The function modifies the `name` property of the `person` object, which affects the original `person` object outside the function.

### **Call by Value vs. Call by Reference Summary**

| Feature                      | **Call by Value**                            | **Call by Reference**                                                 |
| ---------------------------- | -------------------------------------------- | --------------------------------------------------------------------- |
| **What is passed?**          | A copy of the actual value (primitive data)  | A reference (or memory address) to the original data (objects/arrays) |
| **Impact on original data?** | No change to the original data               | Modifies the original data                                            |
| **Used for?**                | Primitive types (numbers, strings, booleans) | Objects, arrays                                                       |
| **Examples**                 | `let a = 5;`, `let str = "hello";`           | `let obj = { name: "Alice" };`                                        |

### **JavaScript Specifics**

In JavaScript:

- **Primitive types** (e.g., `number`, `string`, `boolean`, `undefined`, `null`, `symbol`, `bigint`) are passed **by value**.
- **Objects** (including arrays and functions) are passed **by reference**.

#### Example with Arrays (Call by Reference):

```javascript
function modifyArray(arr) {
  arr.push(4); // Modifies the original array
}

let numbers = [1, 2, 3];
modifyArray(numbers);

console.log(numbers); // [1, 2, 3, 4]
```

In the case of the array, the reference to the original array `numbers` is passed to the function, and the array is modified inside the function.

### **Differences Between Call by Value and Call by Reference**

| Aspect                      | **Call by Value**                                | **Call by Reference**                                      |
| --------------------------- | ------------------------------------------------ | ---------------------------------------------------------- |
| **What is passed?**         | A copy of the value of the variable.             | A reference to the original variable (memory address).     |
| **Effect on Original Data** | No effect on the original variable.              | Changes the original data directly.                        |
| **Used with**               | Primitive data types (numbers, strings, etc.).   | Objects, arrays, and functions.                            |
| **Memory Usage**            | Requires additional memory for the copied value. | No additional memory required for copies, only references. |
| **Mutability**              | Immutable inside the function.                   | Mutable inside the function.                               |

---

### **Conclusion**

- **Call by Value**: Works with copies of data. Changes made inside the function do not affect the original data.
- **Call by Reference**: Works with the actual reference (memory address) of the data. Changes made inside the function affect the original data.

In JavaScript, the distinction is clear between primitive data types (passed by value) and objects (passed by reference), and understanding this concept is crucial when working with functions and data manipulation.

Passing by value and by reference

# Passing by value and by reference

What is the output?

<!-- prettier-ignore-start -->
```javascript
var myObject = {
  price: 20.99,
  get_price: function() {
    return this.price;
  }
};
var customObject = Object.create(myObject);
customObject.price = 19.99;
delete customObject.price;
console.log(customObject.get_price());
```
<!-- prettier-ignore-end -->
---
What is the output?
<!-- prettier-ignore-start -->
```javascript
(function(a) {
  arguments[0] = 10;
  return a;
})(5);
```
<!-- prettier-ignore-end -->
---
What is the output?
<!-- prettier-ignore-start -->
```javascript
function Car(color) {
  this.color = color;
}
var lada = new Car("Black");
Car.prototype.currentGear = 1;
console.log(++lada.currentGear);
console.log(Car.prototype.currentGear);
```
<!-- prettier-ignore-end -->
---
What is the output?
<!-- prettier-ignore-start -->
```javascript
var User = function() {};

User.prototype.attributes = {
  isAdmin: false
};

var admin = new User("Sam"),
  guest = new User("Bob");

admin.attributes.isAdmin = true;

alert(admin.attributes.isAdmin);
alert(guest.attributes.isAdmin);
```
<!-- prettier-ignore-end -->
---

What is the output?
<!-- prettier-ignore-start -->
```javascript
var obj = {
  a: 1
};
(function(obj) {
  obj = {
    a: 2
  };
})(obj);
console.log(obj.a);
```
<!-- prettier-ignore-end -->
---
What is the value of foo.x?
<!-- prettier-ignore-start -->
```javascript
var foo = { n: 1 };
var bar = foo;
foo.x = foo = { n: 2 };
```
<!-- prettier-ignore-end -->
---
how to return result for async operation in sync style?
like `.getData()` - should return data synchroniously, but data get in async by ajax. let's discuss workarounds

---
About prototype inheritance / passing by reference - What is the output?
<!-- prettier-ignore-start -->
```javascript
function Person(name) {
  if (name) this.options.name = name;
}

Person.prototype.options = {
  name: "Default name"
};

var foo = new Person("foo");
var bar = new Person("bar");

console.log(foo.options.name);
console.log(bar.options.name);
```
<!-- prettier-ignore-end -->

---

what would be the output ?

<!-- prettier-ignore-start -->
```javascript
var a = {};

(function b ( a ) {
    a.a = 10;
    a = null;
})( a );

console.log(a);
```
<!-- prettier-ignore-end -->

### Primitive vs Non-Primitive Data Types in JavaScript

#### 1. **Primitive Data Types**:

Primitive data types are simple data types that are immutable (cannot be changed) and are directly assigned to variables. They are copied by value.

**Examples of Primitive Data Types**:

- **String**: Represents text data.

  ```javascript
  let name = "John";
  let greeting = "Hello";
  ```

- **Number**: Represents both integer and floating-point numbers.

  ```javascript
  let age = 30;
  let price = 99.99;
  ```

- **Boolean**: Represents a value of either `true` or `false`.

  ```javascript
  let isActive = true;
  let isAvailable = false;
  ```

- **Undefined**: A variable that is declared but not assigned a value is of type `undefined`.

  ```javascript
  let result;
  console.log(result); // undefined
  ```

- **Null**: Represents the intentional absence of any value or object.

  ```javascript
  let car = null;
  ```

- **Symbol**: A unique and immutable primitive value used as a key for object properties (added in ES6).

  ```javascript
  const uniqueId = Symbol("id");
  ```

- **BigInt**: A new primitive type that can represent integers larger than `Number.MAX_SAFE_INTEGER` (added in ES2020).
  ```javascript
  const bigNumber = 1234567890123456789012345678901234567890n;
  ```

#### 2. **Non-Primitive (Reference) Data Types**:

Non-primitive data types are more complex and can store collections of data. They are mutable (their contents can be modified) and are passed by reference.

**Examples of Non-Primitive Data Types**:

- **Object**: Represents a collection of key-value pairs.

  ```javascript
  let person = { name: "John", age: 30 };
  ```

- **Array**: A collection of elements indexed by numbers.

  ```javascript
  let fruits = ["Apple", "Banana", "Cherry"];
  ```

- **Function**: Functions are also objects in JavaScript and hence are passed by reference.

  ```javascript
  function greet() {
    console.log("Hello!");
  }
  ```

- **Date**: Represents date and time.
  ```javascript
  let today = new Date();
  ```

### **Pass by Value vs Pass by Reference**

- **Pass by Value**:
  In JavaScript, primitive types are passed by value. This means that when you assign or pass a primitive data type to another variable, a copy of the value is made.

  **Example**:

  ```javascript
  let a = 10;
  let b = a; // b gets a copy of the value of a

  b = 20; // Changing b doesn't affect a

  console.log(a); // 10
  console.log(b); // 20
  ```

- **Pass by Reference**:
  Non-primitive data types (objects, arrays, functions, etc.) are passed by reference. This means that when you assign or pass a non-primitive type to another variable, both variables point to the same memory location, and changes to one will affect the other.

  **Example with Objects**:

  ```javascript
  let person1 = { name: "John", age: 30 };
  let person2 = person1; // person2 references the same object as person1

  person2.age = 35; // Modifying person2 will also modify person1 because they reference the same object

  console.log(person1.age); // 35
  console.log(person2.age); // 35
  ```

  **Example with Arrays**:

  ```javascript
  let arr1 = [1, 2, 3];
  let arr2 = arr1; // arr2 references the same array as arr1

  arr2.push(4); // Modifying arr2 will also modify arr1

  console.log(arr1); // [1, 2, 3, 4]
  console.log(arr2); // [1, 2, 3, 4]
  ```

### **Multiple Examples of Pass-by-Value and Pass-by-Reference**

#### **Pass by Value Example**:

```javascript
let num1 = 100;
let num2 = num1; // Copy of num1 is assigned to num2

num2 = 200; // Changing num2 does not affect num1

console.log(num1); // 100
console.log(num2); // 200
```

#### **Pass by Reference Example (Object)**:

```javascript
let obj1 = { name: "Alice", age: 25 };
let obj2 = obj1; // obj2 references the same object as obj1

obj2.age = 30; // Modifying obj2 will also modify obj1

console.log(obj1.age); // 30
console.log(obj2.age); // 30
```

#### **Pass by Reference Example (Array)**:

```javascript
let arr1 = [1, 2, 3];
let arr2 = arr1; // arr2 references the same array as arr1

arr2.push(4); // Modifying arr2 will also modify arr1

console.log(arr1); // [1, 2, 3, 4]
console.log(arr2); // [1, 2, 3, 4]
```

#### **Pass by Value Example (Primitive Type)**:

```javascript
let x = 50;
let y = x; // y gets a copy of x

y = 60; // Changing y does not affect x

console.log(x); // 50
console.log(y); // 60
```

### **Key Differences**:

- **Primitive Data Types**:
  - Stored directly in the variable.
  - Passed by value, so changes do not affect the original.
  - Immutable (cannot be changed directly).

- **Non-Primitive Data Types**:
  - Stored as references to the actual data.
  - Passed by reference, so changes in one variable will affect the original.
  - Mutable (can be changed directly).

### Summary:

- **Primitive types** (like `string`, `number`, `boolean`, etc.) are passed **by value**, meaning that when you assign them to another variable, the new variable gets a copy of the original value.
- **Non-primitive types** (like `objects`, `arrays`, and `functions`) are passed **by reference**, meaning that they reference the same memory location, so changes to one will affect the other.

Here's my take: JavaScript is **strictly Call by Value**.

However, the confusion comes from _what_ is stored inside variables. Depending on whether you pass a primitive type or a complex object, JavaScript behaves in two distinct ways—a mechanism technically known as **Call by Sharing** (or _Call by Value of Reference_).

---

### The Two Rules of JavaScript

1. **Primitives** (Number, String, Boolean, null, undefined, Symbol, BigInt) are stored directly by value. When passed to a function, JavaScript creates a **fresh copy** of that value.
2. **Objects & Arrays** are stored as references (pointers to a location in memory). When passed to a function, JavaScript creates a **fresh copy of the reference pointer**.

---

### Rule 1: Primitives (Pure Call by Value)

Modifying a primitive argument inside a function never affects the original variable outside.

```javascript
function updateNumber(x) {
  x = 99; // Modifies the local copy only
  console.log("Inside function:", x); // 99
}

let num = 10;
updateNumber(num);
console.log("Outside function:", num); // 10 (Unchanged!)
```

---

### Rule 2: Objects & Arrays (Call by Sharing)

Because the function receives a copy of the _pointer_, what happens to the original object depends on whether you **modify a property** or **reassign the parameter**.

#### Case A: Modifying a Property (Mutates Original)

Both variables point to the exact same object in memory. Modifying internal properties updates the shared memory.

```javascript
function addProperty(obj) {
  obj.role = "Developer"; // Modifies property on shared memory reference
}

const user = { name: "Alex" };
addProperty(user);

console.log(user); // { name: "Alex", role: "Developer" } (Mutated!)
```

#### Case B: Reassigning the Parameter (Does NOT Mutate Original)

If you reassign the parameter inside the function using `=`, you break the pointer link and point the local variable to a brand-new memory address. The original variable remains completely untouched!

```javascript
function replaceObject(obj) {
  // Reassigns 'obj' to point to a NEW object in memory
  obj = { name: "Sarah", role: "Manager" };
  console.log("Inside function:", obj.name); // "Sarah"
}

const user = { name: "Alex" };
replaceObject(user);

console.log("Outside function:", user.name); // "Alex" (Unchanged!)
```

---

### Summary Comparison Table

| Data Type                               | What gets passed?              | Modifying Properties           | Reassigning Variable         |
| --------------------------------------- | ------------------------------ | ------------------------------ | ---------------------------- |
| **Primitives** _(Number, String, etc.)_ | Copy of the actual **value**   | N/A (Primitives are immutable) | Does **NOT** affect original |
| **Objects / Arrays**                    | Copy of the **memory pointer** | **DOES** affect original       | Does **NOT** affect original |

---

### Pro Tip: Preventing Unintended Object Mutation

If you want to pass an object or array to a function without allowing the function to modify the original data, pass a shallow or deep copy:

```javascript
const originalUser = { name: "Alex", age: 25 };

// Pass a shallow copy using Spread syntax (...)
modifyUser({ ...originalUser });

// Or pass a deep copy for nested objects
modifyUser(structuredClone(originalUser));
```
