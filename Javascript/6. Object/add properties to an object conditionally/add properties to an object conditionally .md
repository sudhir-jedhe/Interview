In JavaScript, you can add properties to an object conditionally by using various methods, such as `if` statements, ternary operators, or logical operators. Below are some common ways to add properties to an object conditionally:

### 1. **Using an `if` statement**
You can check a condition and add properties to the object inside an `if` block:

```javascript
let obj = {};

// Condition: If the user is an admin, add an 'isAdmin' property
let isAdmin = true;

if (isAdmin) {
  obj.isAdmin = true;
}

console.log(obj); // { isAdmin: true }
```

### 2. **Using a Ternary Operator**
You can use a ternary operator to conditionally add properties, though it's typically better for assigning values rather than adding new properties. However, it can still be useful:

```javascript
let obj = {};

// Condition: If the user is active, add an 'isActive' property
let isActive = true;

isActive ? obj.isActive = true : null;

console.log(obj); // { isActive: true }
```

### 3. **Using Logical AND (`&&`)**
You can use the logical `&&` operator to conditionally add a property. This works well if you don't need an `else` condition.

```javascript
let obj = {};

// Condition: If `isPremium` is true, add 'isPremium' property
let isPremium = false;

isPremium && (obj.isPremium = true);

console.log(obj); // {} (property is not added since isPremium is false)
```

### 4. **Using Object Spread Syntax**
If you're creating a new object or modifying an existing one, you can use the spread syntax combined with a conditional check:

```javascript
let obj = {
  name: 'Alice'
};

// Condition: If the user is active, add 'isActive' property
let isActive = true;

obj = {
  ...obj,
  ...(isActive ? { isActive: true } : {})
};

console.log(obj); // { name: 'Alice', isActive: true }
```

This method is useful when you're working with immutable objects or when you're creating a new object based on conditions.

### 5. **Using `Object.assign()`**
You can also use `Object.assign()` to add properties conditionally. It's often used for merging objects, but you can use it for conditional additions as well:

```javascript
let obj = {};

// Condition: Add 'isAdmin' property if user is an admin
let isAdmin = true;

Object.assign(obj, isAdmin ? { isAdmin: true } : {});

console.log(obj); // { isAdmin: true }
```

### 6. **Using a Function**
If the condition logic is complex or needs to be reused, you could define a function that adds properties to the object conditionally:

```javascript
function addPropertyIf(condition, obj, property, value) {
  if (condition) {
    obj[property] = value;
  }
}

let user = {};

// Condition: Add 'isAdmin' property if user has admin privileges
let isAdmin = true;
addPropertyIf(isAdmin, user, 'isAdmin', true);

console.log(user); // { isAdmin: true }
```

### 7. **Using `Array.reduce()` for Complex Conditions**
If you're working with multiple conditions or objects and want to reduce them conditionally, you can use `Array.reduce()`:

```javascript
let conditions = [
  { condition: true, property: 'isAdmin', value: true },
  { condition: false, property: 'isActive', value: true }
];

let obj = conditions.reduce((acc, curr) => {
  if (curr.condition) {
    acc[curr.property] = curr.value;
  }
  return acc;
}, {});

console.log(obj); // { isAdmin: true }
```

### Summary:
- **If Statement**: Use for simple conditionals when you explicitly check and add properties.
- **Ternary Operator**: Compact, but more suited for value assignments.
- **Logical AND (`&&`)**: Ideal for simple conditional additions without needing an `else` part.
- **Object Spread/`Object.assign()`**: Useful for combining objects conditionally, especially in immutability scenarios.
- **Functions**: Good for reusable logic or more complex conditions.
- **`Array.reduce()`**: Best for iterating over multiple conditions and adding properties in a more functional style.

By using these patterns, you can add properties to an object conditionally based on specific logic in your JavaScript code.