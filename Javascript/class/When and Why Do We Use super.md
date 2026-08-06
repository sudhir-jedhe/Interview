In JavaScript, the `super` keyword is used in class-based inheritance to call methods or access properties from a parent class. When working with **class-based components** in **React** (or in general JavaScript classes), `super` plays a crucial role in ensuring proper initialization of the object and access to the parent class's methods.

### When and Why Do We Use `super`?

1. **To Call the Parent Class Constructor:**
   When a subclass (child class) extends a parent class, it inherits the properties and methods of the parent class. However, before the child class can access `this` (the instance of the class), the parent class's constructor must be called first. This is done using `super()`. If a subclass does not explicitly call `super()`, the JavaScript engine will automatically call the parent class constructor, but this may result in an error if `this` is accessed before the parent class is initialized.

   **Example:**
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
       super(name);  // Calling the parent constructor with `name`
       this.breed = breed;
     }

     speak() {
       console.log(`${this.name} barks`);
     }
   }

   const dog = new Dog('Max', 'Bulldog');
   dog.speak();  // Max barks
   ```

   In this example:
   - `super(name)` calls the `Animal` class's constructor, which initializes `this.name`.
   - `this.breed` is then initialized in the `Dog` class constructor.

2. **To Access Methods of the Parent Class:**
   You can use `super` to call methods defined in the parent class from the child class.

   **Example:**
   ```javascript
   class Animal {
     speak() {
       console.log('Animal speaks');
     }
   }

   class Dog extends Animal {
     speak() {
       super.speak();  // Calling the parent class's speak() method
       console.log('Dog barks');
     }
   }

   const dog = new Dog();
   dog.speak();  // Animal speaks
                // Dog barks
   ```

   In this case, `super.speak()` calls the `speak()` method from the `Animal` class before executing the `Dog` class’s `speak()` method.

### Why `super()` is Necessary in React Class Components?

In React, when creating class components, you use `super()` to call the parent class's constructor (`React.Component`) to set up the component correctly. Without calling `super()`, you cannot access `this` in the constructor, as JavaScript would not properly initialize the component instance.

**Example in React Class Component:**
```javascript
import React from 'react';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);  // Calling the parent class constructor (React.Component)
    this.state = {
      name: 'John'
    };
  }

  render() {
    return (
      <div>
        <h1>Hello, {this.state.name}</h1>
      </div>
    );
  }
}

export default MyComponent;
```

### Key Points:
- **`super()` is used to call the parent class’s constructor** when inheriting from a base class.
- It **allows you to access and initialize properties** and methods from the parent class.
- In React, **`super(props)`** is needed in the constructor of a class component to correctly initialize the component and access `this.props` in the child class.

### In Summary:
- **When**: You use `super` in class-based components (or classes in general) when you are extending another class (parent class). It’s used to call the parent class's constructor and its methods.
- **Why**: It ensures that the child class is properly initialized and has access to the parent class's methods and properties. It’s essential for setting up inheritance and ensuring that properties like `this.state` and `this.props` work in React class components.

In **React**, when you create a **class-based component**, you need to use `super()` in the constructor of the child class (the component class) to correctly initialize the **parent class** (`React.Component`). This is essential because `React.Component` is the base class that all React components inherit from, and `super()` ensures proper initialization of the React component’s instance.

Here’s a detailed breakdown of why `super()` is required in React class components:

### 1. **Accessing `this` in the Constructor:**
   - In JavaScript classes, the `this` keyword refers to the instance of the class.
   - In React class components, `this` refers to the **component instance**, which contains things like `this.state` and `this.props`.
   - The `super(props)` call **invokes the parent class constructor** (i.e., `React.Component`) and initializes `this` properly, so that `this` can be used in the child class (the component class).
   
   Without calling `super()`, you would encounter an error when trying to access `this` in the constructor, as the child class would not have been initialized correctly.

### 2. **React’s `this.props` and `this.state`:**
   - **`this.props`** holds the props passed to the component.
   - **`this.state`** is used to hold the state within a class component.
   
   By calling `super(props)` in the constructor, you allow the `React.Component` class to handle **the initialization of `this.props`**, and it sets up the component instance for you.
   
   If you don't call `super(props)`, **`this.props`** won't be initialized correctly, leading to unexpected behavior or errors.

### 3. **Inheritance and Class Initialization:**
   React components inherit from `React.Component`, which means they are **subclasses** of `React.Component`. 
   
   - When creating a class-based component, you are defining a subclass.
   - The constructor in a subclass (your React component) **must** call the parent class's constructor (`super(props)`) to initialize the inheritance chain properly.
   - This enables the child class to inherit methods and properties from the parent class (like the `render` method, `componentDidMount`, etc.), which are essential for React's functionality.

### Example of `super` in React:

```javascript
import React from 'react';

class MyComponent extends React.Component {
  constructor(props) {
    // Call the parent class constructor with `props`
    super(props);

    // Now you can use `this.state` and `this.props`
    this.state = {
      message: 'Hello, React!'
    };
  }

  render() {
    return (
      <div>
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default MyComponent;
```

### In Detail:

- **Step 1:** The `MyComponent` class is extending `React.Component`. 
- **Step 2:** Inside the constructor of `MyComponent`, `super(props)` is called. This ensures that `this` is correctly initialized, and `this.props` is available.
- **Step 3:** After calling `super(props)`, you can safely initialize the component’s state with `this.state` and also access `this.props`.

### Why Is This Important in React?

1. **Proper Initialization:** Without `super(props)`, React cannot properly initialize your component’s instance. React’s component class is complex and contains logic to handle state, lifecycle methods, and props. By calling `super(props)`, we ensure React properly sets up everything before you begin defining your own logic.

2. **Access to `this.props`:** React passes properties (props) to your component instance. If `super(props)` is not called, `this.props` will not be set up, and you won’t be able to access the props passed to the component, leading to bugs and unexpected behavior.

3. **Access to Inherited Methods:** React's component class has various methods like `componentDidMount()`, `render()`, `setState()`, etc. If you don’t call `super(props)`, you cannot access these methods or override them in your class component, which would make your component non-functional.

### What Happens If You Don’t Use `super()`?

If you forget to call `super(props)` in a React class component constructor, you will get the following error:

```
TypeError: Cannot read property 'props' of undefined
```

This error occurs because React's `React.Component` class constructor needs to be called before you can use `this.props` or `this.state` in your component.

### Summary of Why We Use `super()` in React:

- **Initialization**: It initializes the parent class (`React.Component`) so that the child class can inherit properties and methods from it.
- **Access `this`**: It allows you to safely access `this.state` and `this.props` in the constructor.
- **Prepares the Component**: It ensures that the React component is properly set up, including the state, props, and lifecycle methods, before you start adding your own logic.

In short, **`super(props)`** is a necessary part of creating class components in React to ensure the component is properly initialized, making it possible to use the component's state and props, as well as React's built-in methods.