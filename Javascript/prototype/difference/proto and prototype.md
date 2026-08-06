
The `__proto__` object is the actual object that is used in the lookup chain to resolve methods, etc. Whereas `prototype` is the object that is used to build `__proto__` when you create an object with new.

```js
new Employee().__proto__ === Employee.prototype;
new Employee().prototype === undefined;
```

// Prototype:
// Access:  All the function constructors have prototype properties. 
// Purpose: Used to reduce memory wastage with a single copy of function
// ECMAScript: Introduced in ES6 
// Usage: Frequently used 



// proto:
// Access:  All the objects have \_\_proto\_\_ property   
// Purpose: Used in lookup chain to resolve methods, constructors etc.
// ECMAScript:  Introduced in ES5    
// Usage: Rarely used 


### Prototype in JavaScript

In JavaScript, **prototypes** are central to how inheritance and object sharing work. Understanding prototypes is key to mastering JavaScript's object-oriented behavior. Here’s a breakdown of the core concepts:

#### 1. **[[Prototype]] vs __proto__**

- **[[Prototype]]** is an internal, hidden property of every JavaScript object. It's not directly accessible via JavaScript code, but it links an object to its prototype, from which it can inherit properties and methods.
  
- **__proto__** is the method provided by JavaScript to access the `[[Prototype]]` property of an object. While this is not part of the official ECMAScript specification, it is widely supported by browsers for backward compatibility and is useful for inspecting an object's prototype chain.

Example:
```javascript
function Person() {}
const personA = new Person();
console.log(personA.__proto__); // Logs the prototype object of `personA`
```

#### 2. **__proto__ vs prototype**

- **__proto__** is an internal property for each instance of an object. It's the object that contains methods and properties shared by all instances of the object.
  
- **prototype**, on the other hand, is a property of **constructor functions** (i.e., functions that are used to create objects). The `prototype` property is an object that contains properties and methods shared by all instances created from that constructor function.

Example:
```javascript
function Person() {}
const personA = new Person();

console.log(personA.__proto__ === Person.prototype); // true
```

Here, `personA.__proto__` is the prototype of the object instance, and `Person.prototype` is the prototype of the constructor function. They are the same, indicating that `personA` inherits from `Person.prototype`.

#### 3. **The Prototype Chain**

The **prototype chain** is a mechanism in JavaScript that allows objects to inherit properties and methods from their prototype objects. When you attempt to access a property or method on an object, JavaScript first checks if that property exists on the object. If it doesn't, JavaScript looks up the prototype chain to see if any prototype object contains the property.

This lookup continues up the chain until:
- The property is found, or
- The chain reaches `null` (the end of the chain, indicating no prototype object is available).

For example, an object created with a constructor function has a `[[Prototype]]` that links to the constructor's `prototype`. If that doesn't contain the property, the search continues up the chain to `Object.prototype` (which is the end of the prototype chain for most objects).

Example:
```javascript
function Person() {}
const personA = new Person();

console.log(personA.__proto__.__proto__); // Object.prototype
console.log(personA.__proto__.__proto__.__proto__); // null
```

#### 4. **Prototypal Inheritance**

JavaScript implements inheritance through the prototype chain. Prototypal inheritance allows objects to inherit properties and methods from other objects without requiring class-based inheritance.

- You can add properties or methods to the prototype of a constructor function. All instances created from that constructor will inherit those properties and methods.

Example of **prototypal inheritance**:
```javascript
function Animal() {}

Animal.prototype.sleep = function () {
  console.log("sleeping...");
};

const cat = new Animal();
cat.sleep(); // Outputs: sleeping...
```

Here, `Animal` has a `sleep` method added to its prototype. All instances of `Animal` (like `cat`) inherit this method, even though the method isn’t explicitly defined on the instance.

In this way, **prototypal inheritance** allows sharing methods and properties across all instances of an object, reducing the need for redundancy and improving memory efficiency.

### Key Takeaways:
- **[[Prototype]]** is an internal property used by JavaScript to link objects to their prototypes.
- **__proto__** is a method (not officially in the ECMAScript spec) used to access the `[[Prototype]]` property of an object.
- **prototype** is a property of constructor functions that defines the prototype object, which instances created by the constructor will inherit from.
- The **prototype chain** is the mechanism through which properties and methods are inherited from an object's prototype, continuing up until `null`.
- **Prototypal inheritance** allows objects to inherit methods and properties from other objects through the prototype chain, providing a flexible, non-class-based inheritance model.

This system allows JavaScript to implement inheritance without the need for classical class-based models.


**What is prototype?**
In JavaScript, each object contains an internal hidden property [[Prototype]], which corresponds to the prototype of that object, which may be null or point to another object. However, since [[Prototype]] is an internal property that cannot be accessed directly, the browser provides the __proto__ access method, which can be referenced in the following code.

But we need to pay attention that the __proto__ method is not in the ECMAScript specification. In fact, when developing, we will use Object.getPrototypeOf to get the prototype of the object.

// Person is a constructor function
function Person() {}

// Create a personA object through the Person constructor function
const personA = new Person();

// Through the __proto__ method, view the prototype of personA
console.log(personA.__proto__); // {constructor: ƒ}

// personA object can be accessed to its prototype through the __proto__ method
personA.__proto__ === Person.prototype; // true
Object.getPrototypeOf(personA) === Person.prototype; // true
personA.__proto__ === Object.getPrototypeOf(personA); // true
What is the difference between __proto__ and [[Prototype]]?
Followed by the previous question, [[Prototype]] is a special hidden property in JavaScript objects, but because it cannot be directly accessed, it can be accessed through the __proto__ access method.

What is the difference between __proto__ and prototype?
__proto__ and prototype are different properties. __proto__ is a hidden property of each object, and each object can access its prototype through __proto__. And prototype is a property that exists in all constructor functions, and the prototype of the constructor function is actually the same as the __proto__, which is called the prototype object. (See the following code)

// Person is a constructor function
function Person() {}

// Create a personA object through the Person constructor function
const personA = new Person();

personA.__proto__ === Person.prototype; // true
What is the prototype chain?
Prototype is a special hidden property in JavaScript objects, and each object can access its prototype through __proto__. The prototype itself is an object, so it also has its own prototype. When we try to access an attribute of an object, if the object does not have the required attribute, it will look for it in its prototype. If the prototype still does not find it, it will continue to look up one level until it is found, or until it reaches null. This continuous path is called the prototype chain, and the end of the chain is null.

personA.__proto__.__proto__.__proto__ === null;
For example, we often use the filter method of the array. Assuming that there is an array "list" now, and we use the filter method on this array. But in fact, the filter method does not exist in this list, but exists in the Array constructor function. We can use the filter method today through the prototype chain.

What is prototypal inheritance?
The prototype chain is a very important concept in JavaScript, but it is not enough to understand the prototype chain. To answer this question, we can understand it through why we need prototypal inheritance.

Assume that there is an object "animal", which has its own properties and methods. At the same time, we want to create two objects based on "animal", namely "cat" and "dog". These two objects will have some unique methods and properties, but at the same time need to use the methods and properties of the "animal" object. In JavaScript, we don't need to copy or reimplement it, but we can achieve this goal through prototypal inheritance.

To sum up, although the "cat" and "dog" objects themselves do not have the methods of the "animal" object, they can inherit the methods from their prototypes to use them. In practice, we will add properties or methods to the prototype. Then all objects that are instantiated from this object can use this method or property.

// Constructor function Animal
function Animal() {}

// Instance of Animal
const cat = new Animal();

// Add a method to the prototype object
Animal.prototype.sleep = function () {
  console.log("sleep");
};

// Use the method of the constructor function's prototype
cat.sleep(); // sleep
