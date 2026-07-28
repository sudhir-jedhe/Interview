JavaScript, although a prototype-based language, supports **Object-Oriented Programming (OOP)** concepts such as **Classes**, **Objects**, **Encapsulation**, **Inheritance**, **Polymorphism**, and **Abstraction**. These OOP principles can be implemented using JavaScript's `class` syntax, constructor functions, and prototype chains.

### **1. Classes and Objects in JavaScript**

In JavaScript, classes are introduced in ES6 and are syntactic sugar over JavaScript's prototype-based inheritance system. They allow you to define objects and methods that can be instantiated with the `new` keyword.

#### **Classes and Objects:**

A **class** is a blueprint for creating objects with shared properties and methods.

```javascript
// Define a class
class Person {
  constructor(name, age) {
    this.name = name; // Property
    this.age = age; // Property
  }

  greet() {
    console.log(
      `Hello, my name is ${this.name} and I am ${this.age} years old.`,
    );
  }
}

// Create an object (instance of the Person class)
const person1 = new Person("Alice", 25);
person1.greet(); // Output: Hello, my name is Alice and I am 25 years old.
```

Here:

- **`Person`** is a class.
- **`person1`** is an object (instance) of the `Person` class.
- The `constructor` method initializes the properties of the object, and the `greet` method is a behavior (or method) of the object.

### **2. Encapsulation in JavaScript**

**Encapsulation** refers to the bundling of data (properties) and methods that operate on the data into a single unit or class. It also involves restricting direct access to some of the object’s components (private properties and methods).

#### **Encapsulation Example:**

```javascript
class BankAccount {
  constructor(owner, balance = 0) {
    this.owner = owner;
    this._balance = balance; // Private property (by convention)
  }

  deposit(amount) {
    if (amount > 0) {
      this._balance += amount;
    }
  }

  withdraw(amount) {
    if (amount > 0 && amount <= this._balance) {
      this._balance -= amount;
    } else {
      console.log("Insufficient funds.");
    }
  }

  getBalance() {
    return this._balance;
  }

  setBalance(amount) {
    if (amount >= 0) {
      this._balance = amount;
    }
  }
}

const account = new BankAccount("John");
account.deposit(1000);
account.withdraw(500);
console.log(account.getBalance()); // Output: 500
account.setBalance(2000);
console.log(account.getBalance()); // Output: 2000
```

In this example:

- **Private property**: `_balance` is considered "private" by convention (though JavaScript doesn't strictly enforce this).
- **Encapsulation** is achieved by exposing methods like `deposit`, `withdraw`, `getBalance`, and `setBalance` to interact with the object's private state.

JavaScript does not support true private properties (before ES2022), but it can be simulated by convention (prefixing properties with `_`) or using **WeakMap** for private state or **private class fields** (introduced in ES2022) using `#`:

```javascript
class BankAccount {
  #balance; // private field

  constructor(owner, balance = 0) {
    this.owner = owner;
    this.#balance = balance;
  }

  deposit(amount) {
    if (amount > 0) {
      this.#balance += amount;
    }
  }

  withdraw(amount) {
    if (amount > 0 && amount <= this.#balance) {
      this.#balance -= amount;
    } else {
      console.log("Insufficient funds.");
    }
  }

  getBalance() {
    return this.#balance;
  }
}
```

Here, the `#balance` field is now **private** and can only be accessed or modified within the class.

### **3. Inheritance in JavaScript**

**Inheritance** is a mechanism in OOP where a new class (subclass) inherits properties and methods from an existing class (superclass).

#### **Inheritance Example:**

```javascript
// Base class (superclass)
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a sound.`);
  }
}

// Derived class (subclass)
class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Call the parent class constructor
    this.breed = breed;
  }

  speak() {
    console.log(`${this.name} barks.`);
  }
}

const dog = new Dog("Buddy", "Golden Retriever");
dog.speak(); // Output: Buddy barks.
```

Here:

- **`Animal`** is the parent class, and **`Dog`** is the child class.
- **Inheritance** is achieved by using the `extends` keyword.
- The `Dog` class inherits the `name` property from `Animal` and overrides the `speak` method.

### **4. Polymorphism in JavaScript**

**Polymorphism** allows methods to have different behaviors based on the object (instance) that invokes them. In JavaScript, polymorphism is typically achieved through **method overriding** in inherited classes.

#### **Polymorphism Example:**

```javascript
class Shape {
  area() {
    console.log("Area of the shape.");
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }

  area() {
    return Math.PI * Math.pow(this.radius, 2); // Override method
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height; // Override method
  }
}

const circle = new Circle(5);
console.log(circle.area()); // Output: 78.5398...

const rectangle = new Rectangle(4, 6);
console.log(rectangle.area()); // Output: 24
```

Here:

- The `Shape` class defines a method `area()`.
- Both `Circle` and `Rectangle` **override** the `area()` method to provide their own implementation.

This is an example of **polymorphism** where the same method name (`area`) behaves differently based on the class of the object (`Circle` or `Rectangle`).

### **5. Abstraction in JavaScript**

**Abstraction** involves hiding the complex implementation details of a system and exposing only the necessary parts. In JavaScript, this can be achieved by using **abstract classes** (via base classes) and **methods** that should be implemented by subclasses.

Although JavaScript doesn’t directly support abstract classes, we can simulate abstraction by creating a base class with abstract methods (methods that must be implemented by derived classes).

#### **Abstraction Example:**

```javascript
// Abstract class (simulated)
class Vehicle {
  constructor(make, model) {
    if (new.target === Vehicle) {
      throw new Error("Cannot instantiate abstract class.");
    }
    this.make = make;
    this.model = model;
  }

  // Abstract method
  drive() {
    throw new Error("Method 'drive' must be implemented.");
  }
}

// Concrete class (derived)
class Car extends Vehicle {
  constructor(make, model, doors) {
    super(make, model);
    this.doors = doors;
  }

  // Implement the abstract method
  drive() {
    console.log(
      `Driving the ${this.make} ${this.model} with ${this.doors} doors.`,
    );
  }
}

const myCar = new Car("Toyota", "Corolla", 4);
myCar.drive(); // Output: Driving the Toyota Corolla with 4 doors.
```

Here:

- `Vehicle` is an **abstract class** (we simulate this by preventing direct instantiation of `Vehicle`).
- The `drive` method is **abstract** because it must be implemented by any class that inherits from `Vehicle`.
- `Car` implements the `drive` method, which is called in the `myCar` object.

### **Summary of OOP Concepts in JavaScript**

1. **Classes & Objects**: JavaScript uses classes to create objects with properties and methods.
2. **Encapsulation**: Protects internal object states by providing public methods for access and modification.
3. **Inheritance**: Allows a class to inherit properties and methods from another class.
4. **Polymorphism**: Enables methods to behave differently based on the object instance.
5. **Abstraction**: Hides complex implementation details and only exposes the necessary parts of an object.

JavaScript’s object-oriented features allow you to apply OOP principles efficiently to structure and organize your code.

In JavaScript, you can implement Object-Oriented Programming (OOP) concepts using **functions** (constructor functions), rather than using the modern **`class`** syntax introduced in ES6. While the class syntax is more common today, many older JavaScript codebases rely on functions to implement OOP concepts. In fact, JavaScript is a **prototype-based** language, and even classes themselves are just syntactic sugar for functions that deal with prototypes.

Here’s how we can achieve **Encapsulation**, **Inheritance**, **Polymorphism**, and **Abstraction** using **functions** (constructor functions) and prototypes in JavaScript.

---

### 1. **Creating Objects Using Constructor Functions**

In JavaScript, **constructor functions** are used to create objects with shared properties and methods. When the function is called with the `new` keyword, it creates a new instance of the object.

#### **Example: Creating Objects Using a Constructor Function**

```javascript
function Person(name, age) {
  // Properties
  this.name = name;
  this.age = age;

  // Method
  this.greet = function () {
    console.log(
      `Hello, my name is ${this.name} and I am ${this.age} years old.`,
    );
  };
}

// Creating an instance (object)
const person1 = new Person("Alice", 25);
person1.greet(); // Output: Hello, my name is Alice and I am 25 years old.
```

In the example:

- **`Person`** is a constructor function that defines the properties `name` and `age`, and a method `greet`.
- **`new Person()`** creates an object with those properties and methods.

### 2. **Encapsulation Using Functions**

Encapsulation refers to **bundling the data** (properties) and **methods** that operate on the data within a class or object. It also means restricting access to certain internal parts of the object, typically through methods that control how the data is accessed or modified.

You can achieve encapsulation using **closures** in JavaScript, where you define private data that can only be accessed via public methods.

#### **Encapsulation Example Using Functions:**

```javascript
function BankAccount(owner, balance = 0) {
  let _balance = balance; // Private variable

  // Public methods
  this.owner = owner;

  this.deposit = function (amount) {
    if (amount > 0) {
      _balance += amount;
    }
  };

  this.withdraw = function (amount) {
    if (amount > 0 && amount <= _balance) {
      _balance -= amount;
    } else {
      console.log("Insufficient funds.");
    }
  };

  this.getBalance = function () {
    return _balance;
  };
}

const account = new BankAccount("John");
account.deposit(1000);
account.withdraw(500);
console.log(account.getBalance()); // Output: 500
```

In the example:

- The **`_balance`** variable is **private** to the `BankAccount` function and cannot be accessed directly.
- The public methods (`deposit`, `withdraw`, `getBalance`) are used to interact with the private `_balance`.

This achieves **encapsulation** because the internal balance can only be modified or accessed through the methods defined inside the constructor.

### 3. **Inheritance Using Constructor Functions**

In JavaScript, inheritance can be achieved by modifying an object’s prototype. A child constructor function can inherit from a parent constructor function by setting the child’s prototype to an instance of the parent.

#### **Inheritance Example Using Functions:**

```javascript
// Parent constructor (superclass)
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function () {
  console.log(`${this.name} makes a sound.`);
};

// Child constructor (subclass)
function Dog(name, breed) {
  Animal.call(this, name); // Call the parent constructor
  this.breed = breed;
}

// Set the prototype of Dog to be an instance of Animal
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// Override the speak method
Dog.prototype.speak = function () {
  console.log(`${this.name} barks.`);
};

const dog = new Dog("Buddy", "Golden Retriever");
dog.speak(); // Output: Buddy barks.
```

In the example:

- The **`Animal`** constructor function is the parent class.
- The **`Dog`** constructor function is the child class, and it calls the parent constructor (`Animal.call(this, name)`).
- **Inheritance** is achieved by setting `Dog.prototype` to an instance of `Animal.prototype`, allowing `Dog` to inherit methods from `Animal`.
- The `speak` method is **overridden** in the `Dog` class to provide a different behavior.

### 4. **Polymorphism Using Functions**

**Polymorphism** allows different objects to be treated as instances of the same class, even though they may have different behaviors. In JavaScript, this is achieved through **method overriding** and method calls based on the type of the object.

#### **Polymorphism Example Using Functions:**

```javascript
// Base constructor (superclass)
function Shape(name) {
  this.name = name;
}

Shape.prototype.area = function () {
  console.log("Area of the shape.");
};

// Derived constructor (subclass)
function Circle(radius) {
  Shape.call(this, "Circle");
  this.radius = radius;
}

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.area = function () {
  return Math.PI * Math.pow(this.radius, 2);
};

function Rectangle(width, height) {
  Shape.call(this, "Rectangle");
  this.width = width;
  this.height = height;
}

Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.area = function () {
  return this.width * this.height;
};

// Polymorphism in action
const circle = new Circle(5);
console.log(circle.area()); // Output: 78.5398...

const rectangle = new Rectangle(4, 6);
console.log(rectangle.area()); // Output: 24
```

In the example:

- **Polymorphism** is demonstrated because both `Circle` and `Rectangle` have an `area` method, but the behavior of the `area` method depends on the type of the object.
- The `Shape` class provides a generic `area` method that is overridden in both the `Circle` and `Rectangle` classes.
- When you call `circle.area()` or `rectangle.area()`, the correct method is called depending on the instance type.

### 5. **Abstraction Using Functions**

**Abstraction** involves hiding the implementation details and only exposing the necessary parts of an object. In JavaScript, we can achieve abstraction by defining base functions and forcing subclasses to implement certain methods (simulating abstract methods).

#### **Abstraction Example Using Functions:**

```javascript
// Abstract constructor function
function Vehicle(make, model) {
  if (new.target === Vehicle) {
    throw new Error("Cannot instantiate an abstract class.");
  }
  this.make = make;
  this.model = model;
}

Vehicle.prototype.start = function () {
  throw new Error("Abstract method 'start' must be implemented.");
};

// Concrete constructor function (subclass)
function Car(make, model, doors) {
  Vehicle.call(this, make, model); // Call the parent constructor
  this.doors = doors;
}

Car.prototype = Object.create(Vehicle.prototype);
Car.prototype.constructor = Car;

// Implement the abstract method
Car.prototype.start = function () {
  console.log(`${this.make} ${this.model} starts with a key.`);
};

const myCar = new Car("Toyota", "Corolla", 4);
myCar.start(); // Output: Toyota Corolla starts with a key.
```

In the example:

- **`Vehicle`** is the **abstract class**. It has an abstract method `start`, which should be implemented by any subclass.
- The **`Car`** subclass **implements** the `start` method.
- If you attempt to create an instance of `Vehicle` directly, it throws an error (`new.target === Vehicle` prevents instantiation).

---

### **Summary of OOP Concepts Using Functions in JavaScript**

1. **Classes and Objects**: JavaScript functions can be used as constructors to create objects with shared properties and methods.
2. **Encapsulation**: Achieved by using closures to create private variables and exposing public methods to interact with them.
3. **Inheritance**: Achieved through the prototype chain, where one constructor function inherits properties and methods from another.
4. **Polymorphism**: Achieved by overriding methods in derived constructor functions, allowing objects of different types to respond to the same method in different ways.
5. **Abstraction**: Achieved by defining base (abstract) constructor functions and forcing subclasses to implement certain methods.

By using functions and prototypes, you can successfully implement **OOP principles** in JavaScript, even without using the `class` syntax. This approach offers flexibility and a deeper understanding of how JavaScript handles inheritance and object creation.

In JavaScript, Object-Oriented Programming (OOP) concepts such as **First-Class Functions**, **Inheritance**, **Encapsulation**, **Polymorphism**, and **Abstract Classes** can be implemented, but they work differently compared to languages like Java or C#. Let's break down each of these concepts with examples in JavaScript:

### **1. First-Class Functions**

In JavaScript, **functions are first-class citizens**, meaning they can be:

- Assigned to variables
- Passed as arguments to other functions
- Returned from other functions
- Stored in arrays or objects

#### **Example**:

```javascript
// Function as a value (First-Class Function)
const greet = function (name) {
  return `Hello, ${name}!`;
};

console.log(greet("Alice")); // "Hello, Alice!"

// Passing a function as an argument
function runGreeting(func) {
  console.log(func("Bob"));
}

runGreeting(greet); // "Hello, Bob!"
```

### **2. First Instance (Creating an Object)**

In JavaScript, instances are typically created from classes using the `new` keyword. A class defines the blueprint, and when you instantiate the class, you create an instance of it.

#### **Example**:

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

// Creating an instance (First Instance) of the class
const dog = new Animal("Dog");
dog.speak(); // "Dog makes a sound"
```

### **3. Abstract Class**

JavaScript doesn’t have a built-in `abstract class` keyword like other OOP languages. However, we can simulate abstract classes by creating base classes with methods that throw errors unless overridden by subclasses.

#### **Example**:

```javascript
class Animal {
  constructor(name) {
    if (this.constructor === Animal) {
      throw new Error(
        "Abstract class 'Animal' cannot be instantiated directly.",
      );
    }
    this.name = name;
  }

  speak() {
    throw new Error("Method 'speak()' must be implemented in a subclass.");
  }
}

class Dog extends Animal {
  speak() {
    console.log(`${this.name} barks`);
  }
}

// const animal = new Animal("Generic Animal"); // Error: Abstract class 'Animal' cannot be instantiated directly.
const dog = new Dog("Buddy");
dog.speak(); // "Buddy barks"
```

### **4. Inheritance**

JavaScript supports **inheritance** through prototypes, which allows one class to inherit properties and methods from another class. The modern `class` syntax (introduced in ES6) simplifies this process.

#### **Example**:

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Calling the parent class constructor
    this.breed = breed;
  }

  speak() {
    console.log(`${this.name} the ${this.breed} barks`);
  }
}

const dog = new Dog("Buddy", "Golden Retriever");
dog.speak(); // "Buddy the Golden Retriever barks"
```

In this example, the `Dog` class inherits from the `Animal` class and overrides the `speak` method to provide its own behavior.

### **5. Encapsulation**

**Encapsulation** is the concept of restricting access to certain details of an object's implementation and only exposing a controlled interface. In JavaScript, you can use private fields (with `#` symbol) and getter/setter methods to achieve encapsulation.

#### **Example**:

```javascript
class Person {
  #name; // Private field

  constructor(name) {
    this.#name = name; // Private member variable
  }

  get name() {
    return this.#name; // Getter for private field
  }

  set name(newName) {
    if (newName.length > 2) {
      this.#name = newName; // Setter for private field
    } else {
      console.log("Name must be at least 3 characters long.");
    }
  }
}

const person = new Person("Alice");
console.log(person.name); // "Alice"
person.name = "Jo"; // "Name must be at least 3 characters long."
console.log(person.name); // "Alice"
person.name = "John"; // Changes the name to "John"
console.log(person.name); // "John"
```

In this example, the `#name` field is private, and access is controlled via getter and setter methods.

### **6. Polymorphism**

**Polymorphism** allows objects of different classes to be treated as objects of a common superclass. It allows the same method to behave differently depending on the object’s class.

#### **Example**:

```javascript
class Animal {
  speak() {
    console.log("Animal makes a sound");
  }
}

class Dog extends Animal {
  speak() {
    console.log("Dog barks");
  }
}

class Cat extends Animal {
  speak() {
    console.log("Cat meows");
  }
}

function makeAnimalSpeak(animal) {
  animal.speak(); // This method can accept any object that extends Animal
}

const dog = new Dog();
const cat = new Cat();

makeAnimalSpeak(dog); // "Dog barks"
makeAnimalSpeak(cat); // "Cat meows"
```

In this example, the `speak` method is **overridden** in both the `Dog` and `Cat` classes, and `makeAnimalSpeak` demonstrates **polymorphism** by calling the `speak` method on both dog and cat objects.

### **Summary of Key OOP Concepts in JavaScript**

1. **First-Class Functions**: Functions can be treated as objects — passed as arguments, returned from other functions, etc.
2. **First Instance**: Using the `new` keyword, you can instantiate an object from a class.
3. **Abstract Class**: Simulated through throwing errors in methods of a base class to force subclasses to implement them.
4. **Inheritance**: Achieved using the `extends` keyword and `super` for calling parent class methods and constructors.
5. **Encapsulation**: Use private fields (`#` symbol) and getter/setter methods to control access to object properties.
6. **Polymorphism**: Objects of different classes can be treated as instances of a common superclass, allowing for method overriding and dynamic behavior.

These are foundational principles of Object-Oriented Programming in JavaScript, and while JavaScript does not enforce them as strictly as some other languages, they can be implemented effectively with the language's features.

**Object-Oriented Programming (OOP)** in JavaScript is a programming paradigm based on the concept of **objects** containing data (properties) and code (methods).

While traditional languages like Java or C++ use _class-based_ OOP, JavaScript was built as a **prototype-based** language. Today, JavaScript supports class syntax, but it operates as syntactic sugar over prototypes under the hood.

Here are the core concepts of OOP in JavaScript, explained from basic syntax to the 4 main pillars.

---

## 1. Creating Objects & Classes

ES6 introduced the `class` keyword, making OOP syntax clean and familiar.

```javascript
class Car {
  // Constructor method initializes new instances
  constructor(brand, speed) {
    this.brand = brand; // Property
    this.speed = speed; // Property
  }

  // Method (attached to Car.prototype)
  accelerate() {
    this.speed += 10;
    console.log(`${this.brand} is going at ${this.speed} km/h`);
  }
}

// Instantiate an object using the 'new' keyword
const myCar = new Car("Tesla", 100);
myCar.accelerate(); // "Tesla is going at 110 km/h"
```

---

## 2. The 4 Pillars of OOP in JavaScript

### Pillar 1: Encapsulation

Encapsulation means keeping data inside an object private or protected, exposing only necessary interfaces. Modern JavaScript supports true private fields using the `#` prefix.

```javascript
class BankAccount {
  #balance = 0; // Private field (cannot be accessed outside the class)

  constructor(owner, initialBalance) {
    this.owner = owner;
    this.#balance = initialBalance;
  }

  deposit(amount) {
    if (amount > 0) this.#balance += amount;
  }

  getBalance() {
    return `$${this.#balance}`;
  }
}

const account = new BankAccount("Alice", 500);
account.deposit(200);
console.log(account.getBalance()); // "$700"
// console.log(account.#balance);   // ❌ SyntaxError: Private field '#balance' must be declared in an enclosing class
```

---

### Pillar 2: Inheritance

Inheritance allows a child class to inherit properties and methods from a parent class using the `extends` keyword and `super()` constructor call.

```javascript
// Parent Class
class Animal {
  constructor(name) {
    this.name = name;
  }

  makeSound() {
    console.log("Generic animal sound");
  }
}

// Child Class
class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Calls Animal's constructor
    this.breed = breed;
  }

  // Overriding parent method
  makeSound() {
    console.log(`${this.name} barks! Woof!`);
  }
}

const myDog = new Dog("Buddy", "Golden Retriever");
myDog.makeSound(); // "Buddy barks! Woof!"
```

---

### Pillar 3: Polymorphism

Polymorphism means "many shapes." In JavaScript, it allows different classes to implement methods with the same name, performing different behaviors based on the object calling it.

```javascript
class Shape {
  area() {
    return 0;
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }

  area() {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }
}

// Polymorphic function
function printArea(shape) {
  console.log(`Area: ${shape.area()}`);
}

printArea(new Circle(5)); // Area: 78.5398...
printArea(new Rectangle(4, 5)); // Area: 20
```

---

### Pillar 4: Abstraction

Abstraction involves hiding complex internal details and showing only essential features to the user.

```javascript
class CoffeeMachine {
  #boilWater() {
    console.log("Boiling water...");
  }

  #grindBeans() {
    console.log("Grinding beans...");
  }

  // Simple public interface hiding complex steps
  makeCoffee() {
    this.#grindBeans();
    this.#boilWater();
    console.log("Coffee is ready! ☕");
  }
}

const machine = new CoffeeMachine();
machine.makeCoffee(); // User doesn't need to trigger boiling or grinding manually
```

---

## 3. Prototypes: What Happens Under the Hood

Even when using `class` syntax, JavaScript delegates methods using the **Prototype Chain**.

```javascript
function Person(name) {
  this.name = name;
}

// Attaching method to prototype so all instances share one function in memory
Person.prototype.sayHello = function () {
  console.log(`Hi, I'm ${this.name}`);
};

const bob = new Person("Bob");
bob.sayHello(); // "Hi, I'm Bob"

console.log(Object.getPrototypeOf(bob) === Person.prototype); // true
```

---

## Quick Reference Summary

| Concept            | JS Implementation               | Purpose                                        |
| ------------------ | ------------------------------- | ---------------------------------------------- |
| **Class**          | `class Person {}`               | Blueprint for creating objects                 |
| **Constructor**    | `constructor()`                 | Method that runs on `new` instantiation        |
| **Encapsulation**  | `#privateProperty`              | Hides internal state from direct modification  |
| **Inheritance**    | `class Child extends Parent {}` | Reuses code from existing classes              |
| **Polymorphism**   | Method Overriding               | Same method name, different behavior per class |
| **Prototype Link** | `[[Prototype]]` / `__proto__`   | Mechanism enabling object-to-object delegation |
