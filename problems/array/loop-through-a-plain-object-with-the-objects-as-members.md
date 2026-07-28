```js
let person = {
  name: "John",
  age: 30,
  address: {
    street: "123 Main St",
    city: "Anytown",
    state: "CA",
    zip: "12345",
  },
};
for (let key in person) {
  console.log(key + ": " + person[key]);
}

/****************************** */

const myObj = {
  prop1: { name: "John", age: 25 },
  prop2: { name: "Sarah", age: 30 },
  prop3: { name: "Tom", age: 20 },
};

const newArray = Object.keys(myObj).map((key) => {
  const obj = myObj[key];
  return { ...obj, id: key };
  // Adding an id property to the object
});

console.log(newArray);

/************************ */
let person = {
  name: "John",
  age: 30,
  address: {
    street: "123 Main St",
    city: "Anytown",
    state: "CA",
    zip: "12345",
  },
};
Object.entries(person).forEach(([key, value]) => {
  console.log(key + ": " + value);
});

/*************************************** */
const person = {
  obj1: { name: "John", age: 30 },
  obj2: { name: "Jane", age: 25 },
  obj3: { name: "Bob", age: 40 },
};

Object.values(person).forEach((obj) => {
  console.log("name :" + obj.name, "age :" + obj.age);
});
