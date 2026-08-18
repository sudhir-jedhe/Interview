// keyof - give u the keys of an object type

// typeof - gets the type of an existing value

let score = 95;

console.log(typeof score);

const student = {
  name: "sangam",
  age: 60,
  isActive: true,
};

type Student = typeof student;

const anotherStudent: Student = {
  name: "john",
  age: 45,
  isActive: false,
  // email : "dfsdfsdgs"
};

type StudentKey = keyof Student;

// StudentKey :  "name" | "age" | "isActive"

let fieldName: StudentKey = "name";

console.log(fieldName);
