### 1. **Different Ways of Creating an Object in JavaScript**

JavaScript allows multiple ways to create objects. Here's a breakdown of the most common methods:

#### a. **Using the Object Constructor**
```javascript
const obj = new Object();
obj.key = "value";
```

#### b. **Using Object Literal**
```javascript
const obj = { key: "value" };
```

#### c. **Using Constructor Function and `new` keyword**
```javascript
function getObject(key, value) {
  this[key] = value;
}
const obj = new getObject("key", "value");
```

#### d. **Using Class Syntax**
```javascript
class Obj {
  constructor(key, value) {
    this[key] = value;
  }
}
const obj = new Obj("key", "value");
```

#### e. **Using `Object.create`**
```javascript
const obj = Object.create({ key: "value" });
```

### 2. **Display All Keys of an Object**

The keys of an object can be obtained using `Object.keys` or a `for...in` loop.

#### a. **Using `Object.keys()`**
```javascript
Object.keys(obj).forEach((key) => console.log(key));
```

#### b. **Using `for...in` loop (Only Own Properties)**
```javascript
for (let key in obj) {
  if (obj.hasOwnProperty(key)) {
    console.log(key);
  }
}
```

### 3. **Display All Values of an Object**

The values of an object can be obtained using `Object.values` or by iterating over the object.

#### a. **Using `Object.values()`**
```javascript
console.log(Object.values(obj));
```

#### b. **Using `for...in` loop**
```javascript
for (let key in obj) {
  if (obj.hasOwnProperty(key)) {
    console.log(obj[key]);
  }
}
```

### 4. **Check If an Object is Empty**

To check if an object has no keys, you can use `Object.keys()` and `JSON.stringify()` to ensure the object is not an empty structure like a `Date`.

```javascript
function isObjectEmpty(obj) {
  if (obj !== null && typeof obj !== "undefined" && typeof obj === "object") {
    return Object.keys(obj).length === 0 && JSON.stringify(obj) === "{}";
  } else {
    return false;
  }
}
```

### 5. **Create an Empty Object with No Prototype**

You can create an object without a prototype using `Object.create(null)`:

```javascript
const obj = Object.create(null);
```

### 6. **Create an Object from Key-Value Pairs using `Object.entries`**

`Object.fromEntries()` converts an array or map of key-value pairs into an object.

#### a. **From Array of Key-Value Pairs**
```javascript
const arr = [
  ["0", "a"],
  ["1", "b"],
  ["2", "c"],
];
const obj = Object.fromEntries(arr);
```

#### b. **From a Map**
```javascript
const map = new Map([
  ["foo", "bar"],
  ["baz", 42],
]);
const obj = Object.fromEntries(map);
```

### 7. **Connect 2 Objects Prototypically**

You can connect one object to another using `Object.setPrototypeOf` or by directly modifying the `__proto__` property.

```javascript
const obj1 = { a: 1 };
const obj2 = { b: 2 };
Object.setPrototypeOf(obj2, obj1);

const obj1 = { a: "Object 1 value" };
const obj2 = { b: "Object 2 value" };
obj2.__proto__ = obj1;
```

### 8. **Object with Getter and Setter for Properties**

You can define getters and setters using `Object.defineProperty`:

```javascript
const obj = {};
Object.defineProperty(obj, "data", {
  _data: 0, // closure variable to hold the data
  get() {
    return this._data;
  },
  set(value) {
    this._data = value;
  },
});
```

### 9. **Different Types of Accessor Properties**

You can define various accessor properties with different attributes such as `writable`, `enumerable`, and `configurable`:

```javascript
const obj = {};
Object.defineProperty(obj, "prop", {
  value: 1,
  writable: true,
  configurable: true,
  enumerable: true,
});
```

### 10. **Prevent Modifications to an Object**

You can prevent modification to an object using `Object.preventExtensions`, `Object.seal`, or `Object.freeze`.

#### a. **Prevent Extensions** (Prevent addition of properties)
```javascript
Object.preventExtensions(obj);
console.log(Object.isExtensible(obj)); // false
```

#### b. **Seal** (Prevent addition and deletion of properties)
```javascript
Object.seal(obj);
console.log(Object.isSealed(obj)); // true
```

#### c. **Freeze** (Prevent addition, deletion, or modification)
```javascript
Object.freeze(obj);
console.log(Object.isFrozen(obj)); // true
```

### 11. **Using `for...of` to Iterate Over an Object**

You can make an object iterable by defining the `Symbol.iterator` property:

```javascript
const obj = {
  start: 1,
  end: 10,
  [Symbol.iterator]() {
    let i = this.start;
    return {
      next: () => (i <= this.end ? { value: i++, done: false } : { done: true }),
    };
  },
};

for (let i of obj) {
  console.log(i); // 1 2 3 4 5 6 7 8 9 10
}
```

### 12. **Create a Regular Expression**

Regular expressions can be created using either the literal form or the `RegExp` constructor.

#### a. **Literal Form**
```javascript
let re = /ab+c/g;
```

#### b. **Constructor Form**
```javascript
let re = new RegExp("ab+c", "g");
```

### 13. **Polyfill for `Object.create`**

Here’s a polyfill for `Object.create` if it’s not already implemented:

```javascript
if (typeof Object.create !== "function") {
  Object.create = function (proto, propertiesObject) {
    if (typeof proto === "object" || typeof proto === "function") {
      function F() {}
      F.prototype = proto;
      return new F();
    } else {
      throw new TypeError("Invalid proto or properties object");
    }
  };
}
```

### 14. **Optional Chaining for Objects and Functions**

The optional chaining operator (`?.`) allows for safe access to deeply nested properties:

```javascript
const obj = {
  val: { prop: 10 },
  func: (x) => x * 2,
};

console.log(obj.val?.prop); // 10
console.log(obj.val?.[expr]); // dynamic property access
console.log(obj.func?.(5)); // 10
```

### 15. **Static Variables and Functions in a Class**

Static members are class-level variables or functions, accessed directly on the class.

```javascript
class Browser {
  static className = "Browser";
  
  constructor(os, browserName) {
    this.os = os;
    this.browserName = browserName;
  }

  static areTheySameBrowsers(browser1, browser2) {
    return browser1.browserName === browser2.browserName;
  }
}

console.log(Browser.className); // Browser
```

### 16. **Class with Private Variables and Functions**

Private variables in classes can be defined using the `#` syntax:

```javascript
class ClassWithPrivateFields {
  #privateVar;
  publicVar;
  
  #privatFunc() {
    this.#privateVar = 7;
    this.publicVar = 10;
  }

  publicFunc() {
    this.#privatFunc();
    return [this.#privateVar, this.publicVar];
  }
}

const instance = new ClassWithPrivateFields();
console.log(instance.publicFunc()); // [7, 10]
```

### 17. **Class Inheritance and `super` Keyword**

You can inherit from a parent class using the `extends` keyword and access the parent class methods using `super`.

```javascript
class BaseComponent {
  constructor(componentName) {
    this.componentName = componentName;
  }

  setState(obj) {
    this.state = obj;
    this.render();
  }

  addValues(props) {
    return props.reduce((a, b) => a + b);
  }
}

class Component extends BaseComponent {
  constructor(name = "", props) {
    super(name); // Call parent constructor
    this.state = { ...props };
  }

  render() {
    console.log(`Component ${this.componentName} state:`, this.state);
  }
}

const component = new Component("UI", { a: 1, b: 2 });
```

### 18. **Using Proxy to Intercept Object Operations**

You can create a `Proxy` to intercept object operations like reading or writing properties.

```javascript
let obj = { key: "value" };
let proxy = new Proxy(obj, {
  get(target, handler) {
    console.log(`Getting ${handler}`);
    return target[handler];
  },
  set(target, handler, value) {
    console.log(`Setting ${handler} to ${value}`);
    target[handler] = value;
  }
});

proxy.key = "new value"; // Proxy set is invoked
console.log

(proxy.key);   // Proxy get is invoked
```

### 19. **Iterating Over a Range Object with `for...of`**

To iterate over a range object with `for...of`, define a custom iterator.

```javascript
let range = {
  start: 1,
  end: 10,
  [Symbol.iterator]() {
    let i = this.start;
    return {
      next: () =>
        i <= this.end
          ? { value: i++, done: false }
          : { value: undefined, done: true },
    };
  },
};

for (let i of range) {
  console.log(i); // 1 2 3 4 5 6 7 8 9 10
}
```

### 20. **Private-Looking Variables in Functions Aren't Truly Private**

In JavaScript, closures can simulate private variables, but they can still be accessed indirectly through functions.

```javascript
function ObjectCreator() {
  let privateVar = 0;
  
  this.getPrivateVar = function () {
    return privateVar;
  };
  this.setPrivateVar = function (value) {
    privateVar = value;
  };
}

const obj = new ObjectCreator();
console.log(obj.getPrivateVar()); // 0

// Accessing through a getter/setter
const accessor = {
  get: obj.getPrivateVar,
  set: obj.setPrivateVar,
};
accessor.set(5);
console.log(accessor.get()); // 5
```