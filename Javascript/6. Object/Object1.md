# Object Creation / Object Definitions in JavaScript

JavaScript provides multiple ways to create objects. This is a very common interview topic.

***

# 1. Using an Object Literal (Most Common)

Simplest and most frequently used approach.

```javascript
const person = {
  name: "Sudhir",
  age: 35,

  greet() {
    console.log(
      `Hello ${this.name}`
    );
  }
};

console.log(person.name);
person.greet();
```

Output:

```text
Sudhir
Hello Sudhir
```

### Pros

✅ Easy to write

✅ Readable

✅ Best for small objects

***

# 2. Using `new Object()`

Creating object using Object constructor.

```javascript
const person =
  new Object();

person.name = "Sudhir";
person.age = 35;

console.log(person);
```

Output:

```javascript
{
  name: "Sudhir",
  age: 35
}
```

### Equivalent To

```javascript
const person = {};
```

### Interview Tip

```text
Prefer object literals over new Object()
```

***

# 3. Using Constructor Functions

Before ES6 Classes, this was the standard way.

```javascript
function Person(
  name,
  age
) {

  this.name = name;

  this.age = age;

  this.greet =
    function() {

      console.log(
        `Hello ${this.name}`
      );

    };
}

const user1 =
  new Person(
    "Sudhir",
    35
  );

console.log(user1);
```

Output:

```javascript
Person {
  name: "Sudhir",
  age: 35
}
```

### Real Benefit

Create multiple objects.

```javascript
const u1 =
  new Person("A", 20);

const u2 =
  new Person("B", 25);
```

***

# 4. Using Object.assign()

Copies properties.

```javascript
const person = {
  name: "Sudhir"
};

const details = {
  age: 35
};

const user =
  Object.assign(
    {},
    person,
    details
  );

console.log(user);
```

Output:

```javascript
{
  name: "Sudhir",
  age: 35
}
```

***

### Cloning Example

```javascript
const original = {

  name: "Sudhir"

};

const copy =
  Object.assign(
    {},
    original
  );
```

⚠️ Shallow Copy only.

***

# 5. Using Object.create()

Creates objects using prototypes.

### Example

```javascript
const person = {

  greet() {

    console.log("Hello");

  }

};

const user =
  Object.create(
    person
  );

user.name = "Sudhir";

console.log(user.name);

user.greet();
```

Output:

```text
Sudhir
Hello
```

***

### Prototype Chain

```text
user
 ↓
person
 ↓
Object.prototype
```

***

### Interview Question

Why use Object.create()?

```text
Inheritance

Prototype sharing

Memory efficiency
```

***

# 6. Using Object.fromEntries()

Converts key-value pairs into object.

### Example

```javascript
const entries = [

  ["name", "Sudhir"],

  ["age", 35]

];

const person =
  Object.fromEntries(
    entries
  );

console.log(person);
```

Output:

```javascript
{
  name: "Sudhir",
  age: 35
}
```

***

### Reverse Operation

```javascript
Object.entries(
  person
);
```

Output:

```javascript
[
 ["name","Sudhir"],
 ["age",35]
]
```

***

# 7. Using ES6 Class

Modern approach.

```javascript
class Person {

  constructor(
    name,
    age
  ) {

    this.name = name;

    this.age = age;
  }

  greet() {

    console.log(
      `Hello ${this.name}`
    );
  }
}

const user =
  new Person(
    "Sudhir",
    35
  );

user.greet();
```

***

### Advantages

✅ Cleaner syntax

✅ Inheritance

✅ Enterprise applications

✅ React/Node projects

***

# 8. Factory Function

Very common modern pattern.

```javascript
function createUser(
  name,
  age
) {

  return {

    name,

    age,

    greet() {

      console.log(
        `Hello ${name}`
      );
    }

  };

}

const user =
  createUser(
    "Sudhir",
    35
  );

user.greet();
```

***

# 9. Using Spread Operator

```javascript
const person = {

  name: "Sudhir"

};

const user = {

  ...person,

  age: 35

};

console.log(user);
```

Output:

```javascript
{
  name: "Sudhir",
  age: 35
}
```

***

# Comparison Table

| Method               | Use Case                | Recommended |
| -------------------- | ----------------------- | ----------- |
| Object Literal       | Simple Objects          | ✅✅✅         |
| new Object()         | Rarely Used             | ❌           |
| Constructor Function | Legacy JS               | ⚠️          |
| Object.assign()      | Clone/Merge             | ✅           |
| Object.create()      | Prototypes              | ✅           |
| Object.fromEntries() | Convert Arrays → Object | ✅           |
| ES6 Class            | OOP Applications        | ✅✅          |
| Factory Function     | Functional Pattern      | ✅✅          |
| Spread Operator      | Clone/Merge             | ✅✅✅         |

***

# Most Asked Interview Questions

### What is the most common way to create an object?

```javascript
const obj = {};
```

Object Literal ✅

***

### Difference Between Object.create() and Class?

```text
Object.create()
→ Prototype Based

Class
→ Syntactic Sugar over Prototypes
```

***

### Difference Between Object.assign() and Spread?

Both perform:

```text
Shallow Copy
```

Example:

```javascript
Object.assign({}, obj)
```

```javascript
{ ...obj }
```

***

### Object.entries() vs Object.fromEntries()

```javascript
Object.entries(obj)
```

Object → Array

***

```javascript
Object.fromEntries(arr)
```

Array → Object

***

# Senior Interview Answer

> JavaScript objects can be created using object literals, constructors, Object.create(), Object.assign(), Object.fromEntries(), factory functions, and ES6 classes. Object literals are the most common, Object.create() is useful for prototype-based inheritance, Object.assign() and spread syntax are used for cloning and merging, Object.fromEntries() converts key-value arrays into objects, while ES6 classes provide a cleaner syntax for object-oriented programming. In modern React and Node.js applications, object literals, spread operators, factory functions, and ES6 classes are the most commonly used patterns.

# Object.entries(), Object.keys(), Object.values(), Object.groupBy()

These are very commonly asked JavaScript interview questions.

Let's use the same object for all examples:

```javascript
const user = {
  name: "Sudhir",
  age: 35,
  city: "Pune"
};
```

***

# 1. Object.keys()

Returns all property names (keys).

```javascript
const keys =
  Object.keys(user);

console.log(keys);
```

Output:

```javascript
[
  "name",
  "age",
  "city"
]
```

### Use Case

Loop through keys.

```javascript
Object.keys(user)
  .forEach(key => {

    console.log(key);

  });
```

Output:

```text
name
age
city
```

***

# 2. Object.values()

Returns all property values.

```javascript
const values =
  Object.values(user);

console.log(values);
```

Output:

```javascript
[
  "Sudhir",
  35,
  "Pune"
]
```

***

### Example

Find total.

```javascript
const scores = {
  math: 90,
  science: 85,
  english: 95
};

const total =
  Object.values(scores)
    .reduce(
      (sum, value) =>
        sum + value,
      0
    );

console.log(total);
```

Output:

```text
270
```

***

# 3. Object.entries()

Returns key-value pairs.

```javascript
const entries =
  Object.entries(user);

console.log(entries);
```

Output:

```javascript
[
  ["name", "Sudhir"],
  ["age", 35],
  ["city", "Pune"]
]
```

***

### Loop Example

```javascript
Object.entries(user)
  .forEach(
    ([key, value]) => {

      console.log(
        key,
        value
      );

    }
  );
```

Output:

```text
name Sudhir
age 35
city Pune
```

***

### Convert Object → Map

```javascript
const map =
  new Map(
    Object.entries(user)
  );

console.log(map);
```

***

# Object.keys vs Object.values vs Object.entries

| Method           | Returns                      |
| ---------------- | ---------------------------- |
| Object.keys()    | Array of Keys                |
| Object.values()  | Array of Values              |
| Object.entries() | Array of \[Key, Value] Pairs |

***

# 4. Object.groupBy() (Modern JavaScript)

Used to group data based on a condition.

### Example

```javascript
const employees = [

  {
    name: "Sudhir",
    dept: "IT"
  },

  {
    name: "John",
    dept: "HR"
  },

  {
    name: "Priya",
    dept: "IT"
  }

];
```

***

## Group by Department

```javascript
const grouped =
  Object.groupBy(
    employees,
    employee =>
      employee.dept
  );

console.log(grouped);
```

Output:

```javascript
{
  IT: [
    {
      name: "Sudhir",
      dept: "IT"
    },
    {
      name: "Priya",
      dept: "IT"
    }
  ],

  HR: [
    {
      name: "John",
      dept: "HR"
    }
  ]
}
```

***

# Another Example

Group numbers.

```javascript
const nums =
  [1,2,3,4,5,6];

const result =
  Object.groupBy(
    nums,
    num =>
      num % 2 === 0
        ? "even"
        : "odd"
  );

console.log(result);
```

Output:

```javascript
{
  odd: [1,3,5],

  even: [2,4,6]
}
```

***

# Interview Questions

### Difference Between Object.keys() and Object.entries()?

```javascript
Object.keys(user)
```

Output:

```javascript
["name","age"]
```

***

```javascript
Object.entries(user)
```

Output:

```javascript
[
 ["name","Sudhir"],
 ["age",35]
]
```

***

### Can You Modify an Object Using Object.entries()?

Yes.

```javascript
const updated =
  Object.fromEntries(

    Object.entries(user)
      .map(
        ([key, value]) =>

          [
            key,
            String(value)
          ]
      )

  );

console.log(updated);
```

Output:

```javascript
{
  name: "Sudhir",
  age: "35",
  city: "Pune"
}
```

***

### Difference Between Object.entries() and Object.fromEntries()?

```javascript
Object.entries()
```

```text
Object → Array
```

Example:

```javascript
{
  name:"Sudhir"
}
```

↓

```javascript
[
 ["name","Sudhir"]
]
```

***

```javascript
Object.fromEntries()
```

```text
Array → Object
```

Example:

```javascript
[
 ["name","Sudhir"]
]
```

↓

```javascript
{
  name:"Sudhir"
}
```

***

# React Example

### Create Table Rows

```jsx
const user = {
  name: "Sudhir",
  age: 35
};

return (

  <div>

    {
      Object.entries(user)
        .map(
          ([key, value]) => (

            <p key={key}>
              {key}: {value}
            </p>

          )
        )
    }

  </div>
);
```

***

# Senior Interview Answer

> `Object.keys()` returns an array of an object's property names, `Object.values()` returns the property values, and `Object.entries()` returns key-value pairs as nested arrays. These methods are frequently used for iteration, transformation, filtering, and rendering data in React applications. `Object.groupBy()` is a modern feature that groups array elements into an object based on a callback result, making it extremely useful for reporting, dashboards, and data-processing scenarios.


# JavaScript Objects – Most Asked Interview Questions

Object creation and prototype-related questions are common in JavaScript and React interviews. [\[Siddhi Ahi...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HiTech-SLF%20AI-interview%20reports/Siddhi%20Ahire_00002425_AI_Inteview_Evaluation.pdf?web=1)

***

# Basic Questions

### 1. How many ways can you create an object in JavaScript?

Common methods:

```javascript
// Object Literal
const obj = {};

// new Object()
const obj = new Object();

// Constructor Function
function Person() {}
const p = new Person();

// Object.create()
const obj = Object.create({});

// ES6 Class
class Person {}
const p = new Person();

// Object.assign()
const obj = Object.assign({}, source);

// Object.fromEntries()
const obj = Object.fromEntries(entries);
```

***

### 2. What is the most preferred way to create an object?

```javascript
const user = {
  name: "Sudhir"
};
```

Answer:

```text
Object Literal
```

Reason:

```text
Simple
Readable
Best Performance
```

***

### 3. Difference Between Object Literal and new Object()?

```javascript
const user = {};
```

vs

```javascript
const user = new Object();
```

Interview Answer:

```text
Both create objects.

Object Literal is simpler and preferred.
```

***

# Prototype Questions

### 4. What is Object.create()?

```javascript
const proto = {
  greet() {
    console.log("Hello");
  }
};

const user =
  Object.create(proto);
```

Answer:

```text
Creates a new object using another object as its prototype.
```

***

### 5. Difference Between Object.create() and Class?

Answer:

```text
Object.create()
→ Direct Prototype Inheritance

Class
→ Syntactic Sugar over Prototypes
```

***

### 6. What is a Prototype Chain?

```text
Object
 ↓
Prototype
 ↓
Object.prototype
 ↓
null
```

Example:

```javascript
user.toString();
```

`toString()` comes from:

```javascript
Object.prototype
```

***

# Constructor Questions

### 7. What is a Constructor Function?

```javascript
function Person(name) {
  this.name = name;
}

const p =
  new Person("Sudhir");
```

Used to create multiple objects.

***

### 8. What Happens If You Forget `new`?

```javascript
function Person(name) {
  this.name = name;
}

Person("Sudhir");
```

Problem:

```text
this points to global object
```

Potential bug.

***

### 9. Constructor Function vs Class?

```javascript
function Person() {}
```

vs

```javascript
class Person {}
```

Answer:

```text
Class is cleaner syntax.

Internally both use prototypes.
```

***

# Object.assign() Questions

### 10. What is Object.assign()?

```javascript
const user =
  Object.assign(
    {},
    obj1,
    obj2
  );
```

Used for:

```text
Merging Objects

Cloning Objects
```

***

### 11. Is Object.assign() Deep Copy?

```javascript
const copy =
  Object.assign({}, obj);
```

Answer:

```text
No

It is a shallow copy.
```

***

### Example

```javascript
const obj = {
  address: {
    city: "Pune"
  }
};

const clone =
  Object.assign({}, obj);

clone.address.city =
  "Mumbai";
```

Output:

```text
Both objects change.
```

***

# Object.fromEntries() Questions

### 12. What is Object.fromEntries()?

```javascript
const entries = [
  ["name", "Sudhir"],
  ["age", 35]
];

const obj =
  Object.fromEntries(entries);
```

Output:

```javascript
{
  name: "Sudhir",
  age: 35
}
```

***

### 13. Difference Between Object.entries() and Object.fromEntries()?

```javascript
Object.entries(obj)
```

Object → Array

***

```javascript
Object.fromEntries(arr)
```

Array → Object

***

# Advanced Questions

### 14. Difference Between Shallow Copy and Deep Copy?

### Shallow Copy

```javascript
const copy = {
  ...obj
};
```

Nested objects shared.

***

### Deep Copy

```javascript
const copy =
  structuredClone(obj);
```

Nested objects copied.

***

### 15. Difference Between Spread and Object.assign()?

```javascript
{ ...obj }
```

vs

```javascript
Object.assign({}, obj);
```

Answer:

```text
Both create shallow copies.

Spread syntax is cleaner.
```

***

### 16. How Do You Freeze an Object?

```javascript
Object.freeze(obj);
```

Prevents:

```text
Add Property
Delete Property
Modify Property
```

***

### 17. Difference Between freeze() and seal()?

```javascript
Object.freeze()
```

No modifications allowed.

***

```javascript
Object.seal()
```

Modify existing properties only.

Cannot add/delete.

***

### 18. How Do You Check Whether a Property Exists?

```javascript
"name" in user
```

or

```javascript
user.hasOwnProperty(
  "name"
);
```

***

### 19. What Is Property Enumeration?

```javascript
for (let key in obj) {
  console.log(key);
}
```

Methods:

```javascript
Object.keys()

Object.values()

Object.entries()
```

***

### 20. Difference Between `==` and `===` for Objects?

```javascript
{} === {}
```

Output:

```text
false
```

Reason:

```text
Different Memory References
```

***

# Scenario-Based Interview Questions

### Q1.

How would you clone an object with nested properties?

**Answer**

```javascript
structuredClone(obj);
```

***

### Q2.

How would you merge API response data?

**Answer**

```javascript
const result = {
  ...user,
  ...profile
};
```

***

### Q3.

How would you create reusable objects in a large application?

**Answer**

```text
ES6 Classes

Factory Functions

Object.create()
```

***

# Senior React Interview Answer

> In modern JavaScript applications, object literals are the most common way to create objects. For inheritance, `Object.create()` and ES6 classes are widely used. `Object.assign()` and spread operators are typically used for cloning and merging objects, while `Object.fromEntries()` converts key-value arrays into objects. A common interview focus area is understanding prototypes, shallow vs deep copies, and the differences between object creation patterns. [\[Siddhi Ahi...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HiTech-SLF%20AI-interview%20reports/Siddhi%20Ahire_00002425_AI_Inteview_Evaluation.pdf?web=1)


# 1. Object.entries() with Nested Objects

Consider:

```javascript
const employee = {
  id: 101,
  name: "Sudhir",
  address: {
    city: "Pune",
    state: "Maharashtra"
  },
  skills: ["React", "Node.js"]
};
```

## Basic Object.entries()

```javascript
console.log(
  Object.entries(employee)
);
```

Output:

```javascript
[
  ["id", 101],
  ["name", "Sudhir"],
  [
    "address",
    {
      city: "Pune",
      state: "Maharashtra"
    }
  ],
  [
    "skills",
    ["React", "Node.js"]
  ]
]
```

Notice:

```javascript
address
```

is still a nested object.

***

## Iterating Nested Objects

```javascript
Object.entries(employee)
  .forEach(([key, value]) => {

    if (
      typeof value === "object" &&
      !Array.isArray(value)
    ) {

      console.log(`\n${key}`);

      Object.entries(value)
        .forEach(
          ([nestedKey, nestedValue]) => {

            console.log(
              nestedKey,
              nestedValue
            );

          }
        );

    } else {

      console.log(key, value);

    }

  });
```

Output:

```text
id 101

name Sudhir

city Pune

state Maharashtra

skills React,Node.js
```

***

## Flatten Nested Objects

```javascript
const flat =
  Object.fromEntries(

    Object.entries(employee)
      .flatMap(([key, value]) =>

        typeof value === "object" &&
        !Array.isArray(value)

          ? Object.entries(value)
              .map(
                ([nestedKey, nestedValue]) =>

                [
                  `${key}.${nestedKey}`,
                  nestedValue
                ]
              )

          : [[key, value]]

      )

  );

console.log(flat);
```

Output:

```javascript
{
  id: 101,
  name: "Sudhir",
  "address.city": "Pune",
  "address.state": "Maharashtra",
  skills: ["React", "Node.js"]
}
```

***

# 2. Shallow vs Deep Copy with Object.assign()

This is one of the most asked interview questions.

***

## Shallow Copy

```javascript
const original = {

  name: "Sudhir",

  address: {
    city: "Pune"
  }

};

const copy =
  Object.assign(
    {},
    original
  );
```

Memory:

```text
original
  ↓
 address ---> {}

copy
  ↓
 address ---> SAME {}
```

***

### Modify Copy

```javascript
copy.address.city =
  "Mumbai";

console.log(
  original.address.city
);
```

Output:

```text
Mumbai
```

❌ Original changed.

Reason:

```text
Nested object reference shared.
```

***

## Visual Representation

```text
original
   ↓
┌────────────┐
│ address    │
│ city=Pune  │
└────────────┘
   ↑
copy
```

Both point to same nested object.

***

# Deep Copy

## structuredClone()

```javascript
const original = {

  name: "Sudhir",

  address: {
    city: "Pune"
  }

};

const copy =
  structuredClone(
    original
  );

copy.address.city =
  "Mumbai";

console.log(
  original.address.city
);
```

Output:

```text
Pune
```

✅ Original remains unchanged.

***

## JSON Method

```javascript
const copy =
  JSON.parse(
    JSON.stringify(original)
  );
```

Works for:

```text
Objects
Arrays
```

Limitations:

```text
Functions Lost
Dates Converted
Map Lost
Set Lost
```

***

# Interview Answer

### Is Object.assign() Deep Copy?

```text
No
```

### Why?

```text
Only top-level properties copied.

Nested objects share references.
```

***

# 3. Complex Object.groupBy() Examples

***

## Group Employees by Department

```javascript
const employees = [

  {
    name: "Sudhir",
    dept: "IT"
  },

  {
    name: "John",
    dept: "HR"
  },

  {
    name: "Priya",
    dept: "IT"
  }

];

const grouped =
  Object.groupBy(
    employees,
    emp => emp.dept
  );

console.log(grouped);
```

Output:

```javascript
{
  IT: [...],
  HR: [...]
}
```

***

# Group By Multiple Conditions

### Example

```javascript
const users = [

  {
    name: "A",
    age: 20
  },

  {
    name: "B",
    age: 35
  },

  {
    name: "C",
    age: 55
  }

];
```

***

```javascript
const grouped =
  Object.groupBy(
    users,
    user => {

      if (user.age < 30)
        return "Young";

      if (user.age < 50)
        return "Middle";

      return "Senior";

    }
  );

console.log(grouped);
```

Output:

```javascript
{
  Young: [...],
  Middle: [...],
  Senior: [...]
}
```

***

# Group Orders by Status

```javascript
const orders = [

  {
    id: 1,
    status: "Pending"
  },

  {
    id: 2,
    status: "Completed"
  },

  {
    id: 3,
    status: "Pending"
  }

];

const grouped =
  Object.groupBy(
    orders,
    order => order.status
  );
```

Output:

```javascript
{
  Pending: [
    { id: 1 },
    { id: 3 }
  ],

  Completed: [
    { id: 2 }
  ]
}
```

***

# React Example

```javascript
const grouped =
  Object.groupBy(
    employees,
    emp => emp.department
  );

Object.entries(grouped)
  .map(
    ([department, users]) => (

      <div key={department}>

        <h2>
          {department}
        </h2>

        {users.map(user => (
          <p key={user.id}>
            {user.name}
          </p>
        ))}

      </div>
    )
  );
```

Useful for:

```text
Dashboard Reports

Employee Lists

Order Management

Analytics Screens
```

***

# Senior Interview Answers

### Difference Between Shallow and Deep Copy

```text
Shallow Copy:

Copies first-level properties only.
Nested objects share references.

Deep Copy:

Creates completely independent copies
of nested objects and arrays.
```

***

### When would you use Object.entries()?

```text
Object Iteration

Transformations

Filtering

Converting to Maps

React Rendering
```

***

### When would you use Object.groupBy()?

```text
Analytics

Dashboard Reports

Data Visualisation

Category Grouping

Department/User Segregation

E-commerce Order Grouping
```

***

# Quick Interview Comparison

| Method                 | Purpose                 |
| ---------------------- | ----------------------- |
| `Object.keys()`        | Get Keys                |
| `Object.values()`      | Get Values              |
| `Object.entries()`     | Get Key-Value Pairs     |
| `Object.fromEntries()` | Array → Object          |
| `Object.assign()`      | Shallow Copy / Merge    |
| `structuredClone()`    | Deep Copy               |
| `Object.groupBy()`     | Group Data by Condition |


# JavaScript Object Management, Protection & Prototypes (Interview Guide)

These are **frequently asked Senior JavaScript / React Interview Questions**.

***

# 1. Accessing Property Descriptors

Every property has metadata called a **Property Descriptor**.

## getOwnPropertyDescriptor()

```javascript
const user = {
  name: "Sudhir"
};

console.log(
  Object.getOwnPropertyDescriptor(
    user,
    "name"
  )
);
```

Output:

```javascript
{
  value: "Sudhir",
  writable: true,
  enumerable: true,
  configurable: true
}
```

### Meaning

| Property     | Description                  |
| ------------ | ---------------------------- |
| value        | Actual value                 |
| writable     | Can modify value             |
| enumerable   | Shows in loops               |
| configurable | Can delete/change descriptor |

***

## getOwnPropertyDescriptors()

Get all descriptors.

```javascript
console.log(
  Object.getOwnPropertyDescriptors(
    user
  )
);
```

***

# 2. Adding or Changing Properties

## defineProperty()

```javascript
const user = {};

Object.defineProperty(
  user,
  "name",
  {
    value: "Sudhir",
    writable: false
  }
);

user.name = "John";

console.log(user.name);
```

Output:

```text
Sudhir
```

Cannot change.

***

## defineProperties()

Multiple properties.

```javascript
Object.defineProperties(
  user,
  {
    name: {
      value: "Sudhir"
    },

    age: {
      value: 35
    }
  }
);
```

***

# Object Protection

***

# 3. Object.freeze()

Completely locks object.

```javascript
const user = {
  name: "Sudhir"
};

Object.freeze(user);

user.name = "John";
user.city = "Pune";

console.log(user);
```

Output:

```javascript
{
  name: "Sudhir"
}
```

### Prevents

✅ Modification

✅ Addition

✅ Deletion

***

## Check

```javascript
Object.isFrozen(user);
```

Output:

```text
true
```

***

# 4. Object.seal()

Partially locks object.

```javascript
const user = {
  name: "Sudhir"
};

Object.seal(user);

user.name = "John";

delete user.name;

user.city = "Pune";

console.log(user);
```

Output:

```javascript
{
  name: "John"
}
```

### Allows

✅ Modify existing

### Prevents

❌ Add new

❌ Delete existing

***

## Check

```javascript
Object.isSealed(user);
```

***

# 5. Object.preventExtensions()

Only prevents adding properties.

```javascript
const user = {
  name: "Sudhir"
};

Object.preventExtensions(
  user
);

user.city = "Pune";

console.log(user);
```

Output:

```javascript
{
  name: "Sudhir"
}
```

***

### Still Allows

✅ Update existing

✅ Delete existing

❌ Add new

***

## Check

```javascript
Object.isExtensible(user);
```

Output:

```text
false
```

***

# Protection Comparison

| Feature          | freeze | seal | preventExtensions |
| ---------------- | ------ | ---- | ----------------- |
| Add Property     | ❌      | ❌    | ❌                 |
| Delete Property  | ❌      | ❌    | ✅                 |
| Modify Property  | ❌      | ✅    | ✅                 |
| Highest Security | ✅      | ❌    | ❌                 |

***

# 6. delete Operator

Remove property.

```javascript
const user = {
  name: "Sudhir",
  age: 35
};

delete user.age;

console.log(user);
```

Output:

```javascript
{
  name: "Sudhir"
}
```

***

# 7. Object.assign()

Merge or copy objects.

```javascript
const user = {
  name: "Sudhir"
};

const details = {
  age: 35
};

const result =
  Object.assign(
    {},
    user,
    details
  );

console.log(result);
```

Output:

```javascript
{
  name: "Sudhir",
  age: 35
}
```

***

# Object Prototypes

One of the most important interview topics.

***

# What is a Prototype?

Every JavaScript object has a prototype.

```text
Object
   ↓
Prototype
   ↓
Object.prototype
```

Objects inherit methods and properties from their prototype.

***

# 8. Object.create()

Creates object from an existing prototype.

```javascript
const person = {

  greet() {

    console.log("Hello");

  }

};

const user =
  Object.create(person);

user.name = "Sudhir";

user.greet();
```

Output:

```text
Hello
```

***

# 9. constructor Property

Returns constructor function.

```javascript
const user = {};

console.log(
  user.constructor
);
```

Output:

```javascript
ƒ Object()
```

***

### Array Example

```javascript
const arr = [];

console.log(
  arr.constructor
);
```

Output:

```javascript
ƒ Array()
```

***

# 10. prototype Property

Used to add methods to constructor functions.

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet =
  function() {

    console.log(
      `Hello ${this.name}`
    );

  };

const user =
  new Person("Sudhir");

user.greet();
```

Output:

```text
Hello Sudhir
```

***

# Why Use Prototype?

Without prototype:

```javascript
function Person(name){

 this.name = name;

 this.greet =
   function(){};

}
```

Every object gets its own copy.

Bad for memory.

***

Using prototype:

```javascript
Person.prototype.greet =
 function(){};
```

One shared copy.

Better performance.

***

# 11. getOwnPropertyNames()

Returns all property names.

```javascript
const user = {
  name: "Sudhir",
  age: 35
};

console.log(
  Object.getOwnPropertyNames(
    user
  )
);
```

Output:

```javascript
[
 "name",
 "age"
]
```

***

# 12. toString()

Convert object to string.

```javascript
const user = {
  name: "Sudhir"
};

console.log(
  user.toString()
);
```

Output:

```text
[object Object]
```

***

# 13. valueOf()

Gets primitive value.

```javascript
const num =
  new Number(10);

console.log(
  num.valueOf()
);
```

Output:

```text
10
```

***

# Interview Questions

### Difference Between freeze(), seal(), preventExtensions()?

```text
freeze()
→ No Add
→ No Delete
→ No Modify

seal()
→ No Add
→ No Delete
→ Modify Allowed

preventExtensions()
→ No Add
→ Delete Allowed
→ Modify Allowed
```

***

### What is a Prototype Chain?

```text
Object
 ↓
Prototype
 ↓
Object.prototype
 ↓
null
```

***

### Why use Prototypes?

```text
Reuse Methods

Memory Optimisation

Inheritance
```

***

### Difference Between defineProperty and direct assignment?

```javascript
user.name = "Sudhir";
```

Simple assignment.

***

```javascript
Object.defineProperty(...)
```

Provides control over:

```text
writable

configurable

enumerable
```

***

# Senior Interview Answer

> JavaScript objects can be managed using methods such as `defineProperty`, `defineProperties`, `assign`, `entries`, `keys`, and `values`. Object protection can be implemented using `freeze`, `seal`, and `preventExtensions`, each offering different levels of immutability. JavaScript objects inherit properties and methods through prototypes, enabling powerful prototype-based inheritance. Methods placed on a constructor’s prototype are shared among all instances, reducing memory usage and improving performance.
# 1. Object.defineProperty() Explained

`Object.defineProperty()` gives precise control over object properties.

## Syntax

```javascript
Object.defineProperty(
  object,
  propertyName,
  descriptor
);
```

Descriptor options:

```javascript
{
  value,
  writable,
  enumerable,
  configurable
}
```

***

## Example 1: Read-Only Property

```javascript
const user = {};

Object.defineProperty(
  user,
  "id",
  {
    value: 101,
    writable: false
  }
);

user.id = 999;

console.log(user.id);
```

Output:

```text
101
```

Since:

```javascript
writable: false
```

the value cannot be changed.

***

## Example 2: Hide Property from Loops

```javascript
const user = {};

Object.defineProperty(
  user,
  "password",
  {
    value: "secret123",
    enumerable: false
  }
);

console.log(
  Object.keys(user)
);
```

Output:

```javascript
[]
```

Property exists:

```javascript
console.log(
  user.password
);
```

Output:

```text
secret123
```

***

## Example 3: Prevent Deletion

```javascript
const user = {};

Object.defineProperty(
  user,
  "name",
  {
    value: "Sudhir",
    configurable: false
  }
);

delete user.name;

console.log(user.name);
```

Output:

```text
Sudhir
```

***

## Real Project Example

Configuration Object

```javascript
const config = {};

Object.defineProperty(
  config,
  "API_URL",
  {
    value:
      "https://api.company.com",
    writable: false
  }
);
```

Purpose:

```text
Prevent accidental modification
of production configuration.
```

***

# 2. Object.freeze() in Real Projects

`Object.freeze()` makes an object immutable.

```javascript
Object.freeze(obj);
```

Prevents:

```text
✅ Update
✅ Add
✅ Delete
```

***

## Example

```javascript
const settings = {

  theme: "dark"

};

Object.freeze(settings);

settings.theme = "light";

settings.font = "Arial";

delete settings.theme;

console.log(settings);
```

Output:

```javascript
{
  theme: "dark"
}
```

***

## React Redux Example

Redux state should be immutable.

```javascript
const initialState = Object.freeze({

  users: [],

  loading: false

});
```

Benefits:

```text
Prevent accidental mutations

Predictable state updates

Easier debugging
```

***

## Environment Config Example

```javascript
const ENV = Object.freeze({

  API_URL:
    "https://api.com",

  APP_NAME:
    "MyApp"

});
```

Now:

```javascript
ENV.API_URL =
  "https://hack.com";
```

Won't work.

***

## Important Interview Question

### Is freeze() Deep Freeze?

```javascript
const user = {

  address: {
    city: "Pune"
  }

};

Object.freeze(user);

user.address.city =
  "Mumbai";

console.log(
  user.address.city
);
```

Output:

```text
Mumbai
```

Why?

```text
freeze() is shallow.
```

Nested objects remain mutable.

***

## Deep Freeze Example

```javascript
function deepFreeze(obj){

  Object.keys(obj)
    .forEach(key => {

      if (
        typeof obj[key] === "object"
      ) {
        deepFreeze(obj[key]);
      }

    });

  return Object.freeze(obj);
}
```

***

# 3. Prototype Inheritance

Most important JavaScript interview topic.

***

## What is a Prototype?

Every object has a prototype.

```text
Object
  ↓
Prototype
  ↓
Object.prototype
```

Objects inherit methods from their prototype.

***

## Example 1: Object.create()

```javascript
const person = {

  greet() {

    console.log(
      "Hello"
    );

  }

};

const user =
  Object.create(person);

user.name = "Sudhir";

console.log(user.name);

user.greet();
```

Output:

```text
Sudhir
Hello
```

***

## Visual Representation

```text
user
 ↓
person
 ↓
Object.prototype
 ↓
null
```

***

## Example 2: Constructor Function + Prototype

```javascript
function Person(name){

  this.name = name;

}

Person.prototype.greet =
  function() {

    console.log(
      `Hello ${this.name}`
    );

  };

const user1 =
  new Person("Sudhir");

const user2 =
  new Person("John");

user1.greet();
user2.greet();
```

Output:

```text
Hello Sudhir
Hello John
```

***

## Why Use Prototype?

### Bad

```javascript
function Person(name){

  this.name = name;

  this.greet =
    function(){};

}
```

Every object gets:

```text
Separate greet function
```

Higher memory usage.

***

### Good

```javascript
Person.prototype.greet =
  function(){};
```

One shared copy.

All objects reuse it.

***

## Memory Comparison

### Without Prototype

```text
user1 → greet()

user2 → greet()

user3 → greet()
```

3 copies.

***

### With Prototype

```text
user1
user2
user3
   ↓
 shared greet()
```

1 copy.

Much more efficient.

***

## Example 3: Inheritance

```javascript
function Animal(name){

  this.name = name;

}

Animal.prototype.eat =
  function() {

    console.log(
      `${this.name} eating`
    );

  };

function Dog(name){

  Animal.call(
    this,
    name
  );

}

Dog.prototype =
  Object.create(
    Animal.prototype
  );

Dog.prototype.bark =
  function() {

    console.log("Bark");

  };

const dog =
  new Dog("Tommy");

dog.eat();

dog.bark();
```

Output:

```text
Tommy eating
Bark
```

***

# Frequently Asked Interview Questions

### Difference Between freeze(), seal(), preventExtensions()?

| Method              | Add | Delete | Modify |
| ------------------- | --- | ------ | ------ |
| freeze()            | ❌   | ❌      | ❌      |
| seal()              | ❌   | ❌      | ✅      |
| preventExtensions() | ❌   | ✅      | ✅      |

***

### Why Use Object.defineProperty()?

```text
Read-only properties

Hidden properties

Controlled access

Framework internals
```

***

### Why Are Prototypes Important?

```text
Inheritance

Code Reusability

Memory Efficiency

Performance Optimisation
```

***

# Senior-Level Interview Answer

> `Object.defineProperty()` allows fine-grained control over object properties using descriptors such as `writable`, `enumerable`, and `configurable`. In production systems, it is often used for protected configuration values and framework internals. `Object.freeze()` is commonly used to enforce immutability for configuration objects and Redux state, although it performs only a shallow freeze. Prototype inheritance allows JavaScript objects to share methods through a prototype chain, reducing memory usage and enabling object-oriented patterns such as inheritance and method reuse.
