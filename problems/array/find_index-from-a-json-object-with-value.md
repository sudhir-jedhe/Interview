```js
let data = [
  {
    name: "HTML",
    description: "HyperText Markup Language",
  },
  {
    name: "CSS",
    description: "Cascade Style Sheet",
  },
  {
    name: "JS",
    description: "JavaScript",
  },
];
let index = -1;
let val = "JS";
let filteredObj = data.find(function (item, i) {
  if (item.name === val) {
    index = i;
    return i;
  }
});

if (index == -1) {
  console.log("Data not found!");
} else {
  console.log(filteredObj.name, "is at index", index);
}

/********************************************* */
let data = [
  {
    name: "HTML",
    description: "HyperText Markup Language",
  },
  {
    name: "CSS",
    description: "Cascade Style Sheet",
  },
  {
    name: "JS",
    description: "JavaScript",
  },
];
let index = -1;
index = data.findIndex((obj) => obj.name == "CSS");

if (index == -1) {
  console.log("Data not found!");
} else {
  console.log("Index is", index);
}
