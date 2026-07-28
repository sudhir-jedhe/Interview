```js
/*

const person = {
    first_name: 'John',
    last_name: 'Doe',
    skill_set: ['C++', 'python', 'java',
                'javascript', 'pascal', 'C#'],
    fav_numbers: [10, 19, 17, 62.98, 76, 32.9],
    email: 'john@someplace.com'
}
 
 Output: (2) [Array(6), Array(6)]
      0: (6) ["C++", "python", "java",
              "javascript", "pascal", "C#"]
      1: (6) [10, 19, 17, 62.98, 76, 32.9]

      */

// The object literal Person from which we
// need to extract the arrays
const Person = {
  first_name: "John",
  last_name: "Doe",
  skill_set: ["C++", "python", "java", "javascript", "pascal", "C#"],
  fav_numbers: [10, 19, 17, 62.98, 76, 32.9],
  email: "john@someplace.com",
};

// Method 1 : Object.values converts the object
// literal into an array of its values
const result = Object.values(Person)
  .filter(function (per) {
    //typeof array in javascript is 'object'
    // we can also do (typeof per) === (typeof []) here
    return typeof per === "object";
  })
  .map(function (per) {
    return per;
  });

//output the array containing the required arrays
console.log(result);

/****************************************** */
const person = [
  "John",
  8.6,
  ["C++", "python", "java", "javascript", "pascal", "C#"],
  "john@someplace.com",
  [10, 19, 17, 62.98, 76, 32.9],
];

const res = person
  .filter(function (per) {
    // The typeof array in javascript is 'object'
    // We can also do (typeof per) === (typeof []) here
    return typeof per === "object";
  })
  .map(function (per) {
    return per;
  });

// Output the array containing the required arrays
console.log(res);
