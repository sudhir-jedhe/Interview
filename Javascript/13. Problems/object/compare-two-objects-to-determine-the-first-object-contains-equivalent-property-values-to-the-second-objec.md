```js
/*

Input: obj1: { name: "John", age: 23; degree: "CS" }
       obj2: {age: 23, degree: "CS"}
       
Output: true

Input: obj1: { name: "John", degree: "CS" }
       obj2: {name: "Max", age: 23, degree: "CS"}
       
Output: false
*/

// Define the first object
let obj1 = {
  name: "John",
  age: 23,
  degree: "CS",
};

// Define the second object
let obj2 = {
  age: 23,
  degree: "CS",
};

// Define the function check
function check(obj1, obj2) {
  // Iterate the obj2 using for..in
  for (key in obj2) {
    // Check if both objects do
    // not have the equal values
    // of same key
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
}

// Call the function
console.log(check(obj1, obj2));

/*************************** */

// Define the first object
let obj1 = {
  name: "John",
  age: 23,
  degree: "CS",
};

// Define the Second object
let obj2 = {
  age: 23,
  degree: "CS",
};

// Define the function check
function check(obj1, obj2) {
  return (
    Object

      // Get all the keys in array
      .keys(obj2)
      .every((val) => obj1.hasOwnProperty(val) && obj1[val] === obj2[val])
  );
}

// Call the function
console.log(check(obj1, obj2));

/******************************************** */

function areObjectsEqual(obj1, obj2) {
  const stringifiedObj1 = JSON.stringify(obj1);
  const stringifiedObj2 = JSON.stringify(obj2);
  return stringifiedObj1 === stringifiedObj2;
}

let obj1 = {
  name: "John",
  age: 23,
  degree: "CS",
};

let obj2 = {
  name: "John",
  age: 23,
  degree: "CS",
};

console.log(areObjectsEqual(obj1, obj2));

/**************************************** */

function areObjectsEqual(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

let obj1 = {
  name: "John",
  age: 23,
  degree: "CS",
};

let obj2 = {
  name: "John",
  age: 23,
  degree: "CS",
};

console.log(areObjectsEqual(obj1, obj2));

/********************************************** */
function areObjectsEqual(obj1, obj2) {
  const entries1 = Object.entries(obj1);
  const entries2 = Object.entries(obj2);

  if (entries1.length !== entries2.length) {
    return false;
  }

  for (const [key, value] of entries1) {
    if (!obj2.hasOwnProperty(key) || obj2[key] !== value) {
      return false;
    }
  }

  return true;
}

let obj1 = {
  name: "John",
  age: 23,
  degree: "CS",
};

let obj2 = {
  name: "John",
  age: 23,
  degree: "CS",
};

console.log(areObjectsEqual(obj1, obj2));
