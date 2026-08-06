To implement `myNew()`, we need to simulate what happens when we use the `new` keyword in JavaScript. Let's break it down step-by-step and then walk through the solution.

### Steps to Implement `myNew`:

1. **Create a new object**: When `new` is used, a new object is created. This object will inherit from the constructor's prototype.
   
2. **Bind the `this` context of the constructor**: The constructor function should be invoked with the newly created object as `this`. This allows us to initialize properties on the new object.

3. **Handle the constructor's return value**: The constructor might return an object. If it does, we should return that object. Otherwise, we should return the newly created object. This handles cases where the constructor explicitly returns an object, which overrides the default behavior of returning the newly created object.

### Solution

```javascript
/**
 * @param {Function} constructor
 * @param {any[]} args - arguments passed to the constructor
 * `myNew(constructor, ...args)` should return the same as `new constructor(...args)`
 */
const myNew = (constructor, ...args) => {
  // 1. Create a new object inheriting from constructor's prototype
  const thisObj = Object.create(constructor.prototype);

  // 2. Call the constructor function with the new object as 'this'
  const result = constructor.apply(thisObj, args);

  // 3. If the constructor returns an object, return that, else return the newly created object
  return result && typeof result === 'object' ? result : thisObj;
};
```

### Explanation:

1. **Create a new object with `Object.create`**:  
   `Object.create(constructor.prototype)` creates a new object that has the constructor's prototype as its prototype. This ensures that the new object inherits methods and properties from the constructor's prototype.

2. **Call the constructor**:  
   `constructor.apply(thisObj, args)` invokes the constructor with the newly created object (`thisObj`) as `this` and passes the arguments (`args`) to the constructor. This is similar to how `new` works.

3. **Handle the return value of the constructor**:  
   If the constructor explicitly returns an object (e.g., `return newObj`), we return that object. Otherwise, we return the newly created object (`thisObj`). This step ensures that if the constructor doesn't explicitly return anything (or returns a non-object), the default behavior is to return the new object.

### Example Usage:

```javascript
// Constructor function
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// Creating an object using `myNew`
const person = myNew(Person, 'John', 30);

console.log(person.name); // 'John'
console.log(person.age);  // 30

// Using `new` to do the same
const person2 = new Person('Alice', 25);

console.log(person2.name); // 'Alice'
console.log(person2.age);  // 25
```

### What Happens Behind the Scenes with `new`:

When we use `new`:

1. A new object is created and linked to the constructor's prototype.
2. The constructor function is called with `this` pointing to the new object.
3. If the constructor returns an object, that object is returned. Otherwise, the new object is returned.

`myNew` mimics this process by manually setting up the object and calling the constructor. 

### Edge Case Handling:

- **Constructor returns a non-object**: If the constructor function returns a primitive value (like `null`, `undefined`, or a number), we ensure that the new object (`thisObj`) is returned.
  
- **Constructor returns an object**: If the constructor explicitly returns an object, that object is returned instead of the new object.

### Final Thoughts:

This implementation of `myNew()` simulates the behavior of `new` in JavaScript without actually using the `new` keyword. By carefully managing the prototype chain and constructor invocation, we replicate how `new` works under the hood.