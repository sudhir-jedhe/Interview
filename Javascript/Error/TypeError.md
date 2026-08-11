A **`TypeError`** in JavaScript occurs when you try to perform an operation on a value of the wrong type.

Unlike a `ReferenceError` (where JavaScript doesn't know the variable exists at all), with a `TypeError`, JavaScript knows the variable exists, but the action you are trying to perform is impossible for that specific data type.

Here are the most common causes of a `TypeError` and how to fix them:

## 1. Reading properties of `null` or `undefined`

This is arguably the most common `TypeError` in JavaScript. It happens when you expect a variable to be an object and try to access a property on it, but the variable is actually `null` or `undefined`.

```javascript
let user = null;

// Throws TypeError: Cannot read properties of null (reading 'name')
console.log(user.name); 

```

**Fix:** Ensure the object exists before accessing its properties. You can use Optional Chaining (`?.`) to safely access nested properties without throwing an error: `console.log(user?.name);` (which will safely return `undefined`).

## 2. Calling something that is not a function

If you try to invoke a variable like a function (using parentheses `()`), but the variable holds a number, string, or object, JavaScript will throw a `TypeError`. This also frequently happens due to typos in built-in method names.

```javascript
let myNumber = 42;

// Throws TypeError: myNumber is not a function
myNumber(); 

// Throws TypeError: console.logg is not a function
console.logg("Hello"); 

```

**Fix:** Check your spelling for built-in methods, and ensure the variable you are calling is actually defined as a function.

## 3. Reassigning a `const` variable

When you declare a variable using `const`, its binding cannot be changed. Attempting to assign a new value to it triggers a `TypeError`.

```javascript
const apiEndpoint = "https://api.example.com";

// Throws TypeError: Assignment to constant variable.
apiEndpoint = "https://api.new-example.com"; 

```

**Fix:** If the value needs to change over time, declare the variable using `let` instead of `const`.

## 4. Using Array methods on non-Arrays (or vice versa)

If you try to use a method that specifically belongs to one data type on another data type, you will get a `TypeError`. For example, trying to use `.map()` or `.forEach()` on a plain object or a string.

```javascript
let userObject = { firstName: "Alice", lastName: "Smith" };

// Throws TypeError: userObject.map is not a function
userObject.map(user => console.log(user)); 

```

**Fix:** Ensure you are using the correct method for the data type. To iterate over an object, you would need to use `Object.keys()`, `Object.values()`, or a `for...in` loop instead of an array method.

Occur when an operation cannot be performed because a value is not of the expected type.

```javascript
// Example 1: Calling a non-existent method on null/undefined
const obj = null;
obj.toString();

// Example 2: Invoking something that is not a function
const num = 42;
num();

// Example 3: Reassigning a `const` variable
const pi = 3.14;
pi = 3.14159;

// Example 4: Accessing properties on undefined
let user;
console.log(user.name);

// Example 5: Passing an invalid argument type to native methods
const name = "Alex";
name.toUpperCase().map(item => item); // .map is for arrays, not strings

```
