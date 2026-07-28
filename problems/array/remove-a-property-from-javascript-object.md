```js
const p = {
  name: "person1",
  age: 50,
  address: "address1",
};
// Destructure the object
//and omit the 'age' property
const { age, ...updatedObject } = p;

console.log(updatedObject);

/************************************************************* */

let p = {
  name: "person1",
  age: 50,
  address: "address1",
};

delete p.age;

console.log(p.name + " is " + p.age + " years old.");
