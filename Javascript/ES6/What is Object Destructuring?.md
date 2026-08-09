## What is Object Destructuring?

**Object destructuring** is a JavaScript expression introduced in ES6 that allows you to unpack properties from objects into distinct variables. It provides a concise and clean syntax to extract multiple values from an object in a single line of code.

---

## Basic Syntax

To destructure an object, you place the object properties inside curly braces `{}` on the left side of an assignment operator (`=`).

```javascript
const user = {
  name: 'Sudhir',
  role: 'Developer',
  company: 'Persistent Systems'
};

// Destructuring properties into variables
const { name, role, company } = user;

console.log(name);    // 'Sudhir'
console.log(role);    // 'Developer'
console.log(company); // 'Persistent Systems'

```

---

## Key Features & Advanced Use Cases

### 1. Assigning to New Variable Names

You can extract a property and store it in a variable with a different name by using a colon (`:`).

```javascript
const user = { name: 'Sudhir', age: 37 };

const { name: fullName, age: userAge } = user;

console.log(fullName); // 'Sudhir'
console.log(userAge);  // 37

```

### 2. Setting Default Values

If a property does not exist on the object, you can assign a fallback default value to prevent `undefined` results.

```javascript
const settings = { theme: 'dark' };

const { theme, notification = true } = settings;

console.log(theme);        // 'dark'
console.log(notification); // true (default value used)

```

### 3. Nested Object Destructuring

You can extract properties from objects nested inside other objects by chaining curly braces.

```javascript
const developer = {
  name: 'Sudhir',
  location: {
    city: 'Pune',
    state: 'Maharashtra'
  }
};

const { location: { city, state } } = developer;

console.log(city);  // 'Pune'
console.log(state); // 'Maharashtra'

```

### 4. Function Parameter Destructuring

Destructuring is frequently used directly in function parameters to unpack incoming configuration or data objects cleanly.

```javascript
function displayUserInfo({ name, company }) {
  console.log(`${name} works at ${company}.`);
}

const user = { name: 'Sudhir', company: 'Persistent Systems' };

displayUserInfo(user); // 'Sudhir works at Persistent Systems.'

```

### 5. Rest Property (`...`)

You can use the rest operator to collect the remaining properties of an object into a new object.

```javascript
const user = { name: 'Sudhir', role: 'Developer', city: 'Pune' };

const { name, ...otherDetails } = user;

console.log(name);         // 'Sudhir'
console.log(otherDetails); // { role: 'Developer', city: 'Pune' }

```
