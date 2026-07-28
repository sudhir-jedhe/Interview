Let's break down the code snippets and explain the key concepts along with the expected output and behavior of the code. This includes understanding classes, inheritance, private properties, static methods, and hoisting in JavaScript.

### 1. **Inheritance and Method Overriding**

```javascript
class Animal {
    constructor(legs) {
        this.legs = legs;
    }

    sound() {
        console.log('Animal Sound');
    }
}

class Dog extends Animal {
    constructor(legs) {
        super(legs);  // Call parent constructor
    }
}

class Cat extends Animal {
    constructor(legs) {
        super(legs);  // Call parent constructor
    }

    sound() {
        console.log('Meow Meow');  // Override sound method
    }
}

let cat = new Cat(4);
console.log(cat);

let dog = new Dog(4);
console.log(dog);
```

#### Explanation

- **`Animal` class**: A basic class with a constructor that initializes the `legs` property and a `sound()` method.
- **`Dog` class**: Inherits from `Animal` using the `extends` keyword. The constructor calls the parent class constructor with `super(legs)` to initialize the `legs` property.
- **`Cat` class**: Inherits from `Animal`, but overrides the `sound()` method to produce a different sound (`'Meow Meow'`).

#### Output

```javascript
Cat { legs: 4 }
Dog { legs: 4 }
```

- `cat` is an instance of `Cat` with 4 legs.
- `dog` is an instance of `Dog` with 4 legs.

#### Key Concepts

- **Inheritance**: `Dog` and `Cat` both extend `Animal`, so they inherit its properties and methods. `Cat` overrides the `sound()` method to provide its own implementation.
- **`super()`**: Used in the constructor of `Dog` and `Cat` to call the parent class (`Animal`) constructor.

---

### 2. **Private Fields and Static Methods in ES6 Classes**

```javascript
class Employee {
    #salary  // Private field

    constructor(name, salary, skills) {
        console.log("constructor call on any instance");
        this.name = name;
        this.#salary = salary;
        this.skills = skills;
    }

    // Instance method
    displayName() {
        return this.name;
    }

    // Getter and setter
    get displayName() {
        return this.name;
    }

    set displayName(name) {
        this.name = name;
    }

    get getSalary() {
        return this.#salary;
    }

    // Static method
    static parseJson(data) {
        const obj = JSON.parse(data);
        return new Employee(obj.name, obj.salary, obj.skills);
    }
}

let emp = new Employee('Sudhir', 200000, 'React JS');
console.log(emp);

console.log(emp.displayName());  // Instance method
console.log(Employee.displayName());  // Error - instance methods can't be accessed on class directly

let emp2 = Employee.parseJson('{"name": "sager", "salary": 25000, "skills": ["oracle", "PLSQL"]}');
console.log(emp2);
```

#### Explanation

- **Private Fields (`#salary`)**: The `#` before `salary` makes it a **private** field, which can only be accessed within the class methods.
- **Instance Methods**: `displayName()` is an instance method that returns the `name` property.
- **Getter/Setter**:
  - `get displayName` is a getter for the `name` property.
  - `set displayName` is a setter to update the `name` property.
- **Static Method (`parseJson`)**: `parseJson()` is a static method, which means it can be called on the `Employee` class itself, not on an instance.

#### Output

```javascript
Employee { name: 'Sudhir', skills: 'React JS' }
Sudhir
TypeError: Employee.displayName is not a function
Employee { name: 'sager', skills: ['oracle', 'PLSQL'] }
```

- `emp.displayName()` works because it's an instance method.
- `Employee.displayName()` throws an error because `displayName` is not a static method and thus cannot be accessed directly from the class.
- `Employee.parseJson()` correctly parses the JSON string and creates a new `Employee` object.

#### Key Concepts

- **Private Fields**: The `#` syntax is used to define private fields, which cannot be accessed outside the class.
- **Static Methods**: Static methods are called on the class itself, not on an instance of the class.
- **Getters and Setters**: Getters and setters allow you to define custom behavior for accessing and modifying properties.

---

### 3. **Hoisting of Functions and Classes**

```javascript
h();  // Throws error

let h = () => {
    console.log('hello');
}

// Class hoisting
let em = new Evals();  // Throws error
class Evals() {}
```

#### Explanation

- **Function Expressions and Hoisting**:
  - `h()` is a **function expression**, defined using an arrow function. Function expressions are **not hoisted**. This means the function definition is not available before the `let h` declaration.
  - When we call `h()` before the assignment of the function, JavaScript throws an error since the function is not yet defined.

- **Classes and Hoisting**:
  - In JavaScript, **classes are not hoisted** like function declarations. Even though the class definition comes before its instantiation (`let em = new Evals();`), JavaScript does not allow accessing or instantiating the class until the declaration is fully evaluated.
  - Thus, the line `let em = new Evals();` will throw an error because `Evals` is not defined at the point of execution.

#### Output

```javascript
Uncaught ReferenceError: h is not a function
    at <anonymous>:1:1

Uncaught SyntaxError: Unexpected token ')'
    at <anonymous>:11:1
```

- **First error**: Calling `h()` before it's defined throws a `ReferenceError`.
- **Second error**: The class `Evals()` is defined incorrectly with parentheses (`()`). The correct syntax for class definitions does not include parentheses after the class name.

#### Key Concepts

- **Function Expressions**: Unlike function declarations, function expressions (like `let h = () => {}`) are **not hoisted**. They must be defined before use.
- **Class Hoisting**: Classes are **not hoisted** either. You cannot use a class before it is defined.

---

### Summary of Key Concepts

1. **Inheritance**:
   - `extends` allows one class to inherit properties and methods from another.
   - You can override methods from a parent class in a subclass.

2. **Private Fields (`#`)**:
   - Use `#` before a field name to define a private property that can't be accessed outside the class.

3. **Static Methods**:
   - Static methods are bound to the class itself, not its instances. They are called on the class, not on an object instance.

4. **Getter/Setter**:
   - Getters and setters allow for controlled access to properties.

5. **Hoisting**:
   - **Function declarations** are hoisted, while **function expressions** and **classes** are not.
   - You cannot access a class or function expression before its definition is encountered by the JavaScript engine.
