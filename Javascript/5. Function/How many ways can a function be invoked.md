**How many ways can a function be invoked?**
↑ There are 4 ways that a function can be invoked in JavaScript. The invocation determines the value of this or the "owner" object of that function.

**Invocation as a function **- If a function isn't invoked as a method, as a constructor or with the apply, call methods then it is invoked as a function. The "owner" object of this function will be the window object.
```js
  //Global Scope

  function add(a,b){
    console.log(this);
    return a + b;
  }  

  add(1,5); // logs the "window" object and returns 6

  const o = {
    method(callback){
      callback();
    }
  }

  o.method(function (){
      console.log(this); // logs the "window" object
  });

  ```

**Invocation as a method**- If a property of an object has a value of a function we call it a method. When that method is invoked the this value of that method will be that object.
```js
   const details = {
     name : "Marko",
     getName(){
       return this.name;
     }
   }

   details.getName(); // returns Marko
   // the "this" value inside "getName" method will be the "details" object 

   ```
**Invocation as a constructor** - If a function was invoked with a new keyword before it then it's called a function constructor. An empty object will be created and this will point to that object.
```js
function Employee(name, position, yearHired) {
  // creates an empty object {}
  // then assigns the empty object to the "this" keyword
  // this = {};
  this.name = name;
  this.position = position;
  this.yearHired = yearHired;
  // inherits from Employee.prototype
  // returns the "this" value implicitly if no 
  // explicit return statement is specified
};

const emp = new Employee("Marko Polo", "Software Developer", 2017);
```

**Invocation with the apply and call methods** - If we want to explicitly specify the this value or the "owner" object of a function we can use these methods. These methods are available for all functions.

```js
const obj1 = {
 result:0
};

const obj2 = {
 result:0
};


function reduceAdd(){
   let result = 0;
   for(let i = 0, len = arguments.length; i < len; i++){
     result += arguments[i];
   }
   this.result = result;
}


reduceAdd.apply(obj1, [1, 2, 3, 4, 5]);  //the "this" object inside the "reduceAdd" function will be "obj1"
reduceAdd.call(obj2, 1, 2, 3, 4, 5); //the "this" object inside the "reduceAdd" function will be "obj2"
```

67.