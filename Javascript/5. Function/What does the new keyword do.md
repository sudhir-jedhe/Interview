he new keyword is used with constructor functions to make objects
in JavaScript.

Suppose we have an example code below.
```js
function Employee(name, position, yearHired) {
  this.name = name;
  this.position = position;
  this.yearHired = yearHired;
};

const emp = new Employee("Marko Polo", "Software Developer", 2017);
```
The new keyword does 4 things.

- Creates an empty object.
- Assigns that empty object to the this value.
- The function will inherit from functionName.prototype. 
- Returns the this if no Explicit return statement is used.

In the above image, it will first create an empty object {} then
it will the this value to that empty object this = {} and add properties to that this object. Because we don't have a explicit return statement it automatically returns the this for us.