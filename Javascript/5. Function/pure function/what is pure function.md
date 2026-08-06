Pure functions are a fundamental concept in functional programming. They make code more predictable, easier to test, and easier to debug. Let’s analyze the differences between **pure** and **impure** functions with examples:

---

### **Impure Function**
An impure function has one or more of the following characteristics:
1. **Mutates External State**: Modifies variables or data structures outside its own scope.
2. **Relies on External State**: Depends on variables or states that are not passed explicitly as arguments.
3. **Produces Side Effects**: Performs actions like logging, writing to files, or making network requests.

#### Example:
```javascript
let numberArray = [];
const impureAddNumber = (number) => numberArray.push(number);

console.log(impureAddNumber(6)); // Returns 1 (new array length)
console.log(numberArray);        // Mutated: [6]
```

- **Issue**: The function alters `numberArray`, which is defined outside its scope.
- **Unpredictability**: The outcome depends on the state of `numberArray` at the time of function execution.

---

### **Pure Function**
A pure function adheres to the following rules:
1. **Deterministic**: Given the same input, always returns the same output.
2. **No Side Effects**: Does not modify external state or interact with external systems.
3. **Immutable**: Creates new data structures rather than modifying existing ones.

#### Example:
```javascript
const pureAddNumber = (number) => (argNumberArray) =>
  argNumberArray.concat([number]);

let numberArray = [6];

console.log(pureAddNumber(7)(numberArray)); // Returns [6, 7]
console.log(numberArray);                   // Remains [6]
```

- **Benefits**:
  - **Immutability**: `numberArray` is not altered.
  - **Predictability**: The function output depends only on its input.

---

### **Why Favor Pure Functions?**

1. **Simplified Testing**:
   - Testing pure functions requires no setup of external states.
   - Example:
     ```javascript
     const result = pureAddNumber(5)([1, 2, 3]);
     console.log(result); // [1, 2, 3, 5]
     ```

2. **Avoids Bugs**:
   - Impure functions that modify shared states can introduce subtle bugs.
   - Example:
     ```javascript
     let sharedState = [1, 2];
     const impureFunction = (num) => sharedState.push(num);
     impureFunction(3);
     console.log(sharedState); // Modified: [1, 2, 3]
     ```

3. **Easier Debugging**:
   - Outputs of pure functions depend only on their inputs, making them predictable.

4. **Parallel Execution**:
   - Pure functions do not rely on shared states, enabling safe parallel or concurrent execution.

---

### **ES6 and Immutability**
Modern JavaScript encourages immutability through features like:
1. **`const`**: Ensures variables do not get reassigned.
2. **Array Methods**: Methods like `concat`, `map`, and `filter` return new arrays instead of modifying existing ones.

#### Example:
```javascript
const originalArray = [1, 2, 3];
const newArray = originalArray.concat(4);

console.log(originalArray); // [1, 2, 3]
console.log(newArray);      // [1, 2, 3, 4]
```

---

### **Conclusion**
- **Impure Functions**: Risky due to side effects and reliance on external states.
- **Pure Functions**: Reliable, predictable, and easier to work with.
- **Immutability**: Helps maintain functional programming principles and avoid unintended state changes.

By embracing pure functions and immutability, you write cleaner, more maintainable, and less error-prone code.


# Pure Function in JavaScript & React

A **Pure Function** is a function that:

```text
✅ Always returns the same output for the same input

✅ Has no side effects

✅ Does not modify external state
```

Pure-function concepts are frequently discussed in frontend training material because modern frameworks encourage predictable, reusable logic rather than directly manipulating the DOM or external state. [\[SLF - Mast...Recording \| Video\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/_layouts/15/viewer.aspx?sourcedoc={8fa5e82a-6df6-4e29-ad05-0c2dfad058ed})

***

# Rule 1: Same Input → Same Output

### Pure Function

```javascript
function add(a, b) {
  return a + b;
}

console.log(add(2, 3));
console.log(add(2, 3));
```

Output:

```text
5
5
```

Always:

```javascript
add(2, 3)
```

returns:

```text
5
```

***

# Rule 2: No Side Effects

### Pure

```javascript
function double(num) {
  return num * 2;
}
```

Doesn't change anything outside.

***

### Impure

```javascript
let count = 0;

function increment() {

  count++;

  return count;
}
```

Output:

```text
1
2
3
```

Same call:

```javascript
increment()
```

returns different values.

Not pure ❌

***

# Example: Array Mutation

## Impure Function

```javascript
const users = [];

function addUser(user) {

  users.push(user);

}
```

Problem:

```text
Modifies external array
```

Not pure.

***

## Pure Function

```javascript
function addUser(users, user) {

  return [
    ...users,
    user
  ];
}
```

Input:

```javascript
["Sudhir"]
```

Output:

```javascript
["Sudhir", "John"]
```

Original array unchanged ✅

***

# Pure Functions in React

React strongly encourages immutable updates and predictable state handling.

## Bad (Mutating State)

```jsx
function addItem() {

  items.push({
    id: 1
  });

  setItems(items);
}
```

Mutating data directly.

***

## Good (Pure Update)

```jsx
function addItem() {

  setItems(prev => [

    ...prev,

    { id: 1 }

  ]);
}
```

Creates new state.

More predictable.

***

# Reducer Example

A Redux reducer must be pure.

## Good

```javascript
function reducer(
  state,
  action
) {

  switch(action.type) {

    case "ADD":

      return {

        ...state,

        count:
          state.count + 1
      };

    default:

      return state;
  }
}
```

Pure ✅

***

## Bad

```javascript
function reducer(
  state,
  action
) {

  state.count++;

  return state;
}
```

Mutates state ❌

***

# Common Pure Function Examples

## Calculate Discount

```javascript
function discount(
  price,
  percent
) {

  return (
    price -
    (price * percent / 100)
  );
}
```

***

## Tax Calculation

```javascript
function tax(
  amount,
  rate
) {

  return amount * rate;
}
```

***

## Cart Total

```javascript
function getTotal(items){

  return items.reduce(
    (sum,item)=>
      sum + item.price,
    0
  );
}
```

***

# Common Impure Functions

## Random Numbers

```javascript
function getRandom() {

  return Math.random();

}
```

Different output every time.

Impure ❌

***

## Current Time

```javascript
function getTime() {

  return Date.now();

}
```

Different output.

Impure ❌

***

## Network Calls

```javascript
function fetchUsers() {

  return fetch("/api/users");

}
```

Side effect.

Impure ❌

***

# Why Are Pure Functions Important?

```text
✅ Easier Testing

✅ Predictable Behavior

✅ Easier Debugging

✅ Better Performance

✅ Works Well With React

✅ Works Well With Redux
```

***

# Interview Questions

### What is a Pure Function?

A function that:

```text
Returns same output
for same input

and

Has no side effects
```

***

### What is a Side Effect?

```text
Modifying external variable

Updating DOM

Changing state

API Call

Writing file

Console logging
```

***

### Is Math.random() Pure?

❌ No

***

### Is Date.now() Pure?

❌ No

***

### Is Redux Reducer Pure?

✅ Must be pure

***

### Why Does React Prefer Pure Functions?

Because pure functions are:

```text
Predictable
Reusable
Easy to test
Easy to optimize
```

***

# Senior React Interview Answer

> A pure function is a function that always returns the same result for the same inputs and does not cause side effects such as mutating external variables, modifying the DOM, making API calls, or updating global state. Pure functions are fundamental to React and Redux because they make applications predictable, easier to test, and easier to optimise. Common examples include calculation functions, array transformations using `map`, `filter`, and `reduce`, and Redux reducers that return new state instead of mutating existing state.


# Pure Functions in React

A **pure function** is a function that:

```text
✅ Returns the same output for the same input
✅ Has no side effects
✅ Does not modify external variables or state
```

Pure, predictable logic is encouraged in modern frontend frameworks because it makes applications easier to reason about and maintain.

***

# React Example 1: Pure Utility Function

## Pure Function

```javascript
function calculateDiscount(
  price,
  percentage
) {
  return price - (price * percentage) / 100;
}

console.log(
  calculateDiscount(1000, 10)
);
```

Output:

```text
900
```

Same input:

```javascript
calculateDiscount(1000, 10)
```

Always returns:

```text
900
```

***

# React Example 2: Pure Component

```jsx
function UserCard({
  name,
  role
}) {

  return (
    <div>
      <h3>{name}</h3>
      <p>{role}</p>
    </div>
  );
}
```

This component is pure because:

```text
Same props
↓
Same UI
```

***

# React Example 3: Cart Total

```jsx
function calculateTotal(items) {

  return items.reduce(
    (sum, item) =>
      sum + item.price,
    0
  );
}

function Cart() {

  const items = [
    { price: 100 },
    { price: 200 },
    { price: 300 }
  ];

  const total =
    calculateTotal(items);

  return (
    <h2>
      Total: ₹{total}
    </h2>
  );
}
```

Output:

```text
Total: ₹600
```

***

# React Example 4: Pure State Update

## Bad (Impure)

```javascript
items.push(newItem);

setItems(items);
```

Mutates existing array.

***

## Good (Pure)

```javascript
setItems(prev => [
  ...prev,
  newItem
]);
```

Creates a new array.

***

# Benefits of Pure Functions in React

## 1. Easier Testing

```javascript
function add(a, b) {
  return a + b;
}
```

Test:

```javascript
expect(add(2, 3))
  .toBe(5);
```

No mocks needed.

***

## 2. Predictable Behaviour

```text
Input
↓
Function
↓
Output
```

No hidden changes.

***

## 3. Better Performance

Works well with:

```text
React.memo
useMemo
useCallback
```

because React can safely compare values and skip unnecessary work.

***

## 4. Easier Debugging

Pure functions don't modify:

```text
Global Variables
DOM
Props
Redux State
```

which reduces bugs.

***

## 5. Better State Management

Redux reducers are expected to be pure functions.

```javascript
function reducer(
  state,
  action
) {

  switch(action.type) {

    case "ADD":
      return {
        ...state,
        count:
          state.count + 1
      };

    default:
      return state;
  }
}
```

***

# Common Pure Function Interview Questions

### Q1. What is a Pure Function?

**Answer:**

A function that always returns the same output for the same input and has no side effects.

***

### Q2. What is a Side Effect?

Examples:

```text
❌ API Call
❌ DOM Manipulation
❌ Updating Global Variables
❌ Writing to Local Storage
❌ Mutating Arrays/Objects
```

***

### Q3. Is `Math.random()` a Pure Function?

```javascript
Math.random()
```

❌ No

Reason:

```text
Different output every call
```

***

### Q4. Is `Date.now()` a Pure Function?

```javascript
Date.now()
```

❌ No

Reason:

```text
Returns different value each time
```

***

### Q5. Are Redux Reducers Pure?

✅ Yes

Reducers should:

```text
Return new state
Never mutate existing state
```

***

### Q6. Why Does React Prefer Pure Functions?

Because they are:

```text
✅ Predictable
✅ Testable
✅ Reusable
✅ Easy to Memoize
✅ Easy to Debug
```

***

### Q7. Difference Between Pure and Impure Functions?

#### Pure

```javascript
function add(a, b) {
  return a + b;
}
```

#### Impure

```javascript
let count = 0;

function increment() {
  count++;
  return count;
}
```

***

### Q8. Can a Function That Mutates an Array Be Pure?

```javascript
arr.push(10);
```

❌ No

Mutation creates side effects.

Use:

```javascript
return [...arr, 10];
```

✅ Pure

***

# Senior React Interview Answer

> A pure function always returns the same result for the same inputs and does not produce side effects. React encourages pure functions because they are easier to test, debug, optimise, and reason about. Pure functions work particularly well with React's rendering model, Redux reducers, `React.memo`, `useMemo`, and immutable state updates. In production React applications, keeping business logic pure leads to more maintainable and predictable code.
