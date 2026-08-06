### JavaScript Quiz and Explanation

Let's break down the questions and code you've shared to explain what is happening in each case.

---

### 1. `Function instanceof Object`, `Object instanceof Function`, `Function instanceof Function`, `Object instanceof Object`

```javascript
console.log(Function instanceof Object); // true
console.log(Object instanceof Function); // false
console.log(Function instanceof Function); // true
console.log(Object instanceof Object); // true
```

#### Explanation:

- **`Function instanceof Object`**: `Function` is an object in JavaScript, so `Function` itself is an instance of `Object`. Therefore, the result is `true`.
  
- **`Object instanceof Function`**: `Object` is not a function, so this will return `false`.

- **`Function instanceof Function`**: This checks if `Function` is an instance of `Function`. Since `Function` is itself a function (a constructor function), it is an instance of `Function`, so it returns `true`.

- **`Object instanceof Object`**: The `Object` is an instance of itself, so the result is `true`.

---

### 2. `typeof null`, `null instanceof Object`, `typeof 1`, `1 instanceof Number`, `1 instanceof Object`, `Number(1) instanceof Object`, etc.

```javascript
console.log(typeof null); // "object"
console.log(null instanceof Object); // false
console.log(typeof 1); // "number"
console.log(1 instanceof Number); // false
console.log(1 instanceof Object); // false
console.log(Number(1) instanceof Object); // false
console.log(new Number(1) instanceof Object); // true
console.log(typeof true); // "boolean"
console.log(true instanceof Boolean); // false
console.log(true instanceof Object); // false
console.log(Boolean(true) instanceof Object); // false
console.log(new Boolean(true) instanceof Object); // true
console.log([] instanceof Array); // true
console.log([] instanceof Object); // true
console.log((() => {}) instanceof Object); // true
```

#### Explanation:

- **`typeof null`**: This is a historical bug in JavaScript. `typeof null` returns `"object"`, but `null` is not actually an object. It's a special primitive value representing no value or a null reference.

- **`null instanceof Object`**: This returns `false` because `null` is not an object, even though `typeof null` returns `"object"`. This is a common pitfall in JavaScript.

- **`typeof 1`**: This returns `"number"` because `1` is a number.

- **`1 instanceof Number`**: This returns `false` because `1` is a primitive number, not an instance of the `Number` object.

- **`1 instanceof Object`**: This returns `false` because primitive values (like `1`) are not instances of `Object`.

- **`Number(1) instanceof Object`**: This returns `false` because `Number(1)` is a primitive value and not an object.

- **`new Number(1) instanceof Object`**: This returns `true` because `new Number(1)` creates a `Number` object, which is an instance of `Object`.

- **`typeof true`**: This returns `"boolean"` because `true` is a boolean value.

- **`true instanceof Boolean`**: This returns `false` because `true` is a primitive value, not a `Boolean` object.

- **`true instanceof Object`**: This returns `false` because `true` is a primitive value, not an instance of `Object`.

- **`Boolean(true) instanceof Object`**: This returns `false` because `Boolean(true)` creates a primitive boolean, not a `Boolean` object.

- **`new Boolean(true) instanceof Object`**: This returns `true` because `new Boolean(true)` creates a `Boolean` object.

- **`[] instanceof Array`**: This returns `true` because `[]` is an instance of `Array`.

- **`[] instanceof Object`**: This returns `true` because arrays are objects in JavaScript.

- **`(() => {}) instanceof Object`**: This returns `true` because functions are also objects in JavaScript (in fact, functions are a special type of object).

---

### 3. `instanceOfClass` Function

```javascript
class A {}
class B extends A {}

let objB = new B();
console.log(instanceOfClass(objB, B)); // true
console.log(instanceOfClass(objB, A)); // true

class C {}
console.log(instanceOfClass(objB, C)); // false

function instanceOfClass(obj, targetClass) {
    if (!obj || typeof obj !== 'object') return false;
    if (!targetClass.prototype) throw new Error("Target class must have a prototype");

    if (Object.getPrototypeOf(obj) === targetClass.prototype) {
        return true;
    } else {
        return instanceOfClass(Object.getPrototypeOf(obj), targetClass);
    }
}
```

#### Explanation:

- **What is `instanceOfClass`?**

  The `instanceOfClass` function checks if an object is an instance of a particular class or any of its parent classes (superclasses). It does this by traversing the object's prototype chain.

  - **Base Case**: If the object's prototype matches the class's prototype, it returns `true`.
  - **Recursive Case**: If the prototype doesn't match, it continues checking the object's prototype (parent class).

#### How it works:

- `objB` is an instance of `B`, and `B` extends `A`. So, `objB` is also an instance of `A`, due to inheritance.
  
- `instanceOfClass(objB, B)` returns `true` because `objB` is an instance of `B`.

- `instanceOfClass(objB, A)` also returns `true` because `objB` inherits from `A`.

- `instanceOfClass(objB, C)` returns `false` because `objB` does not inherit from `C`.

#### Key Points:

- **Prototype Chain**: The function checks if the object's prototype matches the `prototype` of the target class. If not, it checks the prototype of the prototype, and so on.
  
- **Recursive Search**: It uses recursion to navigate the entire prototype chain to verify if the target class is found anywhere along the chain.

---

### Summary of Key Concepts:

1. **`typeof` and `instanceof`**: 
   - `typeof` checks the type of a value (such as `"object"`, `"number"`, `"boolean"`, etc.).
   - `instanceof` checks if an object is an instance of a particular class or constructor function by looking at the prototype chain.

2. **Prototype Chain**: 
   - In JavaScript, objects are linked through prototypes. An object inherits properties and methods from its prototype, and this can form a chain of objects.
   - The `instanceOfClass` function demonstrates how to manually traverse this prototype chain to check if an object is an instance of a class.

---

### Conclusion:

The quiz touches on some fundamental concepts in JavaScript, including the differences between primitive values and objects, as well as the way inheritance works in both classical and prototype-based OOP. The `instanceOfClass` function is an example of how JavaScript's prototype-based inheritance can be manually traversed, showing how `instanceof` works behind the scenes.


/********************************** */
class A {}
class B extends A {}

let objB = new B()
instanceOfClass(objB , B) // true
instanceOfClass(objB, A) // true

class C {}
instanceOfClass(objB, C) // false


function instanceOfClass(obj, targetClass) {
    if (!obj || typeof obj !== 'object') return false
    if (!target.prototype) throw Error

    if (Object.getPrototypeOf(obj) === target.prototype) {
        return true
    } else {
        return instanceOfClass(Object.getPrototypeOf(obj), target)
    }
}