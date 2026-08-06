```js
// This is our array of Objects
let data = [
  { id: 1, name: "a" },
  { id: 2, name: "b" },
  { id: 3, name: "c" },
  { id: 4, name: "d" },
  { id: 5, name: "e" },
  { id: 6, name: "f" },
];

let idYouWant = 1;
let propertyYouWant = "name";

// Using Array.filter( ) method
// we are iterating through each
// items in the array and checking
// which item's id value is equal
// to the id we want

let res = data.filter((item) => {
  return item.id == idYouWant;
});

// After using filter method we got
// an array of object. Now take its
// first element and use its
// 'propertyYouWant' key
let exactRes = res[0][propertyYouWant];

// Printing the property we want
console.log(exactRes);

/****************************************** */

// This is our array of Objects
let data = [
  { id: 1, name: "a" },
  { id: 2, name: "b" },
  { id: 3, name: "c" },
  { id: 4, name: "d" },
  { id: 5, name: "e" },
  { id: 6, name: "f" },
];

let idYouWant = 2;
let propertyYouWant = "name";

// Using Array.find( ) we are searching
// in which object our searching id present

let res = data.find((item) => {
  return item.id == idYouWant;
});

// Now print the property which you want
// from the object res
// console.log(res[propertyYouWant])
console.log(res[propertyYouWant]);

/************************************** */
// This is our array of objects
let data = [
  { id: 1, name: "a" },
  { id: 2, name: "b" },
  { id: 3, name: "c" },
  { id: 4, name: "d" },
  { id: 5, name: "e" },
  { id: 6, name: "f" },
];

let idYouWant = 2;
let propertyYouWant = "name";

// Iterating over the array using for
// loop and searching in which object
// the id present
// After getting the object we print the
// property we wanted from the object

for (let i = 0; i < data.length; i++) {
  if (data[i].id == idYouWant) {
    console.log(data[i][propertyYouWant]);
  }
}
