Your examples demonstrate two different types of copying an object: **shallow copy** and **deep copy**. Let's explore both of these with more examples to better understand the differences.

### 1. **Shallow Copy**

When a **shallow copy** is made, the **new variable** still refers to the **same object** in memory. Any changes made to properties in the new variable will affect the original object as well (and vice versa) because they are pointing to the same underlying object.

```javascript
let employee = {
  eid: "E102",
  ename: "Jack",
  eaddress: "New York",
  salary: 50000,
  get getName() {
    return this.ename;
  },
  set setName(name) {
    this.ename = name;
  },
};

// Define the `ename` property
Object.defineProperty(employee, "ename", {
  value: "Sagar",
  configurable: true,
  writable: true,
  enumerable: true,
});

console.log("Employee=> ", employee);
let newEmployee = employee; // Shallow copy (both refer to the same object)
console.log("New Employee=> ", newEmployee);

console.log("---------After modification----------");
newEmployee.ename = "Beck"; // Modify newEmployee's 'ename'
console.log("Employee=> ", employee); // employee also gets affected
console.log("New Employee=> ", newEmployee); // newEmployee is updated as well
```

**Output:**
```
Employee=>  { eid: 'E102', ename: 'Sagar', eaddress: 'New York', salary: 50000, getName: [Getter], setName: [Setter] }
New Employee=>  { eid: 'E102', ename: 'Sagar', eaddress: 'New York', salary: 50000, getName: [Getter], setName: [Setter] }
---------After modification----------
Employee=>  { eid: 'E102', ename: 'Beck', eaddress: 'New York', salary: 50000, getName: [Getter], setName: [Setter] }
New Employee=>  { eid: 'E102', ename: 'Beck', eaddress: 'New York', salary: 50000, getName: [Getter], setName: [Setter] }
```

#### Explanation:
- Both `employee` and `newEmployee` refer to the **same object** in memory.
- Changing `newEmployee.ename` to `"Beck"` also modifies `employee.ename` because both variables point to the same object.

### 2. **Deep Copy**

A **deep copy** creates a new object with the same structure and values as the original object but located in a **different memory space**. Any modifications made to the deep-copied object will not affect the original object.

```javascript
let employee = {
  eid: "E102",
  ename: "Jack",
  eaddress: "New York",
  salary: 50000,
};

// Deep copy using JSON methods
let newEmployee = JSON.parse(JSON.stringify(employee));

console.log("=========Deep Copy========");
console.log("Employee=> ", employee);
console.log("New Employee=> ", newEmployee);

console.log("---------After modification---------");
newEmployee.ename = "Beck"; // Modify newEmployee's 'ename'
newEmployee.salary = 70000; // Modify newEmployee's 'salary'
console.log("Employee=> ", employee); // employee is not affected
console.log("New Employee=> ", newEmployee); // newEmployee is updated
```

**Output:**
```
=========Deep Copy========
Employee=>  { eid: 'E102', ename: 'Jack', eaddress: 'New York', salary: 50000 }
New Employee=>  { eid: 'E102', ename: 'Jack', eaddress: 'New York', salary: 50000 }
---------After modification---------
Employee=>  { eid: 'E102', ename: 'Jack', eaddress: 'New York', salary: 50000 }
New Employee=>  { eid: 'E102', ename: 'Beck', eaddress: 'New York', salary: 70000 }
```

#### Explanation:
- `newEmployee` is a **deep copy** of `employee`. Changes made to `newEmployee` (e.g., updating `ename` and `salary`) **do not affect** the `employee` object.

### 3. **Deep Copy Example with Nested Objects**

Deep copying becomes more relevant when you have objects with nested structures (objects or arrays inside the object). Let's demonstrate this using nested objects.

```javascript
let employee = {
  eid: "E102",
  ename: "Jack",
  address: {
    city: "New York",
    state: "NY"
  },
  salary: 50000,
};

// Deep copy using JSON methods
let newEmployee = JSON.parse(JSON.stringify(employee));

console.log("=========Deep Copy with Nested Objects========");
console.log("Employee=> ", employee);
console.log("New Employee=> ", newEmployee);

console.log("---------After modification---------");
newEmployee.address.city = "San Francisco"; // Modify nested object in newEmployee
console.log("Employee=> ", employee); // Original object is unaffected
console.log("New Employee=> ", newEmployee); // Nested object is updated in newEmployee
```

**Output:**
```
=========Deep Copy with Nested Objects========
Employee=>  { eid: 'E102', ename: 'Jack', address: { city: 'New York', state: 'NY' }, salary: 50000 }
New Employee=>  { eid: 'E102', ename: 'Jack', address: { city: 'New York', state: 'NY' }, salary: 50000 }
---------After modification---------
Employee=>  { eid: 'E102', ename: 'Jack', address: { city: 'New York', state: 'NY' }, salary: 50000 }
New Employee=>  { eid: 'E102', ename: 'Jack', address: { city: 'San Francisco', state: 'NY' }, salary: 50000 }
```

#### Explanation:
- The deep copy creates a separate copy of both the outer object and the nested object.
- Modifying `newEmployee.address.city` does not affect `employee.address.city` because the nested objects are deeply copied.

### 4. **Shallow Copy vs Deep Copy with Arrays**

Let's also test shallow copy vs deep copy using arrays.

#### Shallow Copy with Arrays:

```javascript
let arr = [1, 2, [3, 4]];

let shallowCopy = arr; // Shallow copy (both point to the same memory)
shallowCopy[2][0] = 99;

console.log("Original Array: ", arr); // Array is affected
console.log("Shallow Copy: ", shallowCopy); // Shallow copy is affected
```

**Output:**
```
Original Array:  [ 1, 2, [ 99, 4 ] ]
Shallow Copy:  [ 1, 2, [ 99, 4 ] ]
```

#### Deep Copy with Arrays:

```javascript
let arr = [1, 2, [3, 4]];

let deepCopy = JSON.parse(JSON.stringify(arr)); // Deep copy

deepCopy[2][0] = 99;

console.log("Original Array: ", arr); // Original array is unaffected
console.log("Deep Copy: ", deepCopy); // Deep copy is affected
```

**Output:**
```
Original Array:  [ 1, 2, [ 3, 4 ] ]
Deep Copy:  [ 1, 2, [ 99, 4 ] ]
```

#### Explanation:
- **Shallow Copy**: The inner array `[3, 4]` is shared between the original array `arr` and the shallow copy `shallowCopy`.
- **Deep Copy**: The inner array `[3, 4]` is copied, so modifying the deep copy does not affect the original array.

### Summary of Differences

| **Feature**                 | **Shallow Copy**                               | **Deep Copy**                                  |
|-----------------------------|------------------------------------------------|------------------------------------------------|
| **Memory Allocation**        | Both objects share the same memory reference.  | New object with its own memory space is created. |
| **Nested Objects/Arrays**    | Changes to nested objects/arrays affect both.  | Changes to nested objects/arrays do not affect the original. |
| **Method of Copying**        | Assignment (`let newObj = originalObj`)        | `JSON.parse(JSON.stringify(obj))`, or a custom function to handle deep copying |
| **Use Case**                 | Useful when the object structure is flat.      | Used when the object is deeply nested or contains arrays. |

- **Shallow copy** is faster but does not fully separate the objects.
- **Deep copy** ensures complete independence from the original object, which is important in cases with nested objects or arrays.

Let me know if you'd like more details on deep vs shallow copies or other examples!