Sure! Here's the original version of your `myNew` function along with an explanation:

### Original `myNew` Code:

```javascript
const myNew = (constructor, ...args) => {
  // 1. A new object is created, inheriting from constructor's prototype.
  var that = Object.create(constructor.prototype);

  // 2. The constructor function is called with the specified arguments,
  //    and with this bound to the newly created object.
  var obj = constructor.apply(that, args);

  // 3. The object (not null, false, 3.1415 or other primitive types) returned by the constructor function becomes the result of the whole new expression.
  //    If the constructor function doesn't explicitly return an object,
  //    the object created in step 1 is used instead (normally constructors don't return a value, but they can choose to do so if they want to override the normal object creation process).
  if (obj && typeof obj === "object") {
    return obj;
  } else {
    return that;
  }
};
```

### Explanation of the Original Code:

This code tries to replicate the behavior of the `new` operator in JavaScript. Let's break down how it works:

1. **Create a new object** (`that`):
   ```javascript
   var that = Object.create(constructor.prototype);
   ```
   - This line creates an object (`that`) that inherits from the constructor's `prototype`. This allows the newly created object to have access to methods and properties defined on the constructor's prototype.

2. **Call the constructor function** (`constructor.apply`):
   ```javascript
   var obj = constructor.apply(that, args);
   ```
   - The `apply` method is used to call the constructor function with the newly created object (`that`) as the `this` context. The arguments passed to `myNew` are spread and passed to the constructor.
   - `apply` allows the constructor to execute and modify the object, but the context (`this`) is bound to the newly created object (`that`).

3. **Check the return value**:
   ```javascript
   if (obj && typeof obj === "object") {
     return obj;
   } else {
     return that;
   }
   ```
   - If the constructor function explicitly returns an object, then `obj` will be returned.
   - If the constructor doesn't return an object (it returns `null`, `undefined`, or a primitive value like `string`, `number`, etc.), we return the newly created object (`that`) as the default behavior.

### Example Usage:

1. **Basic Constructor with No Return Value**:

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const person1 = myNew(Person, "Alice", 30);
console.log(person1); // Person { name: 'Alice', age: 30 }
```
- In this case, `Person` doesn't explicitly return anything, so the newly created object (`that`) is returned.

2. **Constructor Returning an Object**:

```javascript
function Car(make, model) {
  this.make = make;
  this.model = model;
  return { custom: "value" }; // Explicitly return an object
}

const car1 = myNew(Car, "Toyota", "Corolla");
console.log(car1); // { custom: 'value' }
```
- Here, the constructor `Car` explicitly returns a new object (`{ custom: "value" }`). So, that object is returned instead of the default `that`.

3. **Constructor Returning a Primitive Value**:

```javascript
function Animal(type) {
  this.type = type;
  return "This is a string"; // Return a primitive value
}

const animal1 = myNew(Animal, "Dog");
console.log(animal1); // Animal { type: 'Dog' }
```
- Since the constructor returns a primitive (`"This is a string"`), the default object (`that`) is returned.

### Summary:

The **`myNew`** function works by:
1. Creating a new object with the constructor's prototype.
2. Calling the constructor function with the new object as the `this` context.
3. Checking if the constructor returns an object. If it does, return that object. Otherwise, return the new object.

This replicates the behavior of JavaScript's `new` operator, which automatically handles object creation, prototype inheritance, and constructor invocation.