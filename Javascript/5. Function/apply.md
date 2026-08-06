The code you've provided demonstrates different implementations of `apply`, including creating custom versions of `myapply` and `myOwnApply`. Let's break down each part and analyze how they work.

### 1. **Custom `myapply` Implementation**
```javascript
Function.prototype.myapply = function (obj = {}, args = []) {
  let fn = this;
  if (typeof fn !== "function") {
    throw new Error("Invalid function provided for binding.");
  }
  
  let randomProp = Math.random();
  while (obj[randomProp] !== undefined) {
    randomProp = Math.random();
  }

  obj[randomProp] = this;
  let result = obj[randomProp](...args);
  delete obj[randomProp];
  return result;
};
```
- This is a custom implementation of `apply`. 
- The `myapply` method assigns a temporary property (`randomProp`) to the `obj` to avoid overwriting any existing properties.
- It calls the function (`this` in the context of `myapply`) with the provided context (`obj`) and arguments (`args`), then removes the temporary property.

#### Example Usage:
```javascript
let getName = function (city, age) {
  let res = {
    fullname: `${this.firstname} ${this.lastname}`,
    city: city,
    age: age,
  };
  console.log(res);
};

let name = {
  firstname: "shubham",
  lastname: "gupta",
};

getName.myapply(name, ["Delhi", 26]);
// Output: { fullname: 'shubham gupta', city: 'Delhi', age: 26 }
```

This example creates a `getName` function that expects a `city` and `age` as arguments. The custom `myapply` correctly sets the `this` context to `name` and prints the result.

---

### 2. **Using `apply` with Arrays**
```javascript
const array = ["a", "b"];
const elements = [0, 1, 2];

// Using the built-in apply
array.push.apply(array, elements);  // ["a", "b", 0, 1, 2"]
console.info(array);

// Using spread operator (modern alternative)
array.push(...elements);  // ["a", "b", 0, 1, 2"]
console.info(array);
```

Both of these methods are used to append elements of one array (`elements`) to another array (`array`).

- The first example uses `apply` to invoke the `push` method with the arguments spread into it.
- The second example uses the ES6 spread syntax (`...`), which is cleaner and more readable. The result is the same in both cases.

---

### 3. **Custom `myApply` Implementation**
```javascript
Function.prototype.myApply = function (context, args) {
  if (typeof this !== "function") {
    throw new Error(this, "invalid call");
  }
  if (!Array.isArray(args)) {
    throw new TypeError("arguments are not in array");
  }
  context.fnc = this;
  context.fnc(...args);
};
```
- This implementation creates a temporary `fnc` property on the `context` and calls it with the arguments provided in `args`.
- After calling the function, it does not delete the temporary `fnc` property, which is something that is usually done in the standard `apply` function.

#### Example Usage:
```javascript
const objIntro = {
  name: "rahul",
  city: "gwalior",
};

function sayIntro(company, place) {
  console.log(
    `name is ${this.name}, place is ${this.city} and company is ${company} and work place is ${place}`
  );
}

sayIntro.myApply(objIntro, ["cognizant", "gurgaon"]);
// Output: name is rahul, place is gwalior and company is cognizant and work place is gurgaon
```

Here, we use the custom `myApply` to change the context (`this`) inside `sayIntro`. The `this` inside `sayIntro` now refers to `objIntro`, and it outputs the expected values.

---

### 4. **Alternative Custom `myOwnApply` Implementation**
```javascript
function myOwnApply(context, args) {
  if (typeof context !== "object") {
    throw new TypeError("Context must be an object");
  }

  if (!Array.isArray(args)) {
    throw new TypeError("Args must be an array");
  }

  context.fn = this;
  context.fn(...args);
  delete context.fn;
}
```
- This implementation is very similar to the first custom `myApply`, but here, the function is executed on `context.fn`, and after the execution, the temporary `fn` property is deleted from `context`.
- It first ensures that `context` is an object and `args` is an array, throwing appropriate errors if not.

#### Example Usage:
```javascript
const myFunction = function (a, b) {
  console.log(this.name, a, b);
};

const context = { name: "My Context" };
const args = [1, 2];

myOwnApply.call(myFunction, context, args);
// Output: "My Context 1 2"
```

Here, the `myOwnApply` function successfully calls `myFunction` with the provided `context` and `args`, resulting in the expected output.

---

### Conclusion:
- The code implements custom versions of the `apply` method in multiple ways, such as `myapply`, `myApply`, and `myOwnApply`. These implementations ensure that the function can be executed in a different context while passing arguments dynamically.
- The `apply` method is essential for invoking a function with a specific `this` context and an array of arguments.
- The difference in these custom implementations is mostly in how temporary properties are handled (like `fn` or `randomProp`), but the core functionality remains the same—allowing the function to execute with a different context and arguments.

Let me know if you'd like more details on any part of the implementation!