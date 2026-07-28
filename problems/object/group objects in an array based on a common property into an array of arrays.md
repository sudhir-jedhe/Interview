```js
let fruits = [
  {
    fruit_name: "Apple",
    fruit_color: "Red",
  },
  {
    fruit_name: "Pomegranate",
    fruit_color: "Red",
  },
  {
    fruit_name: "Grapes",
    fruit_color: "Green",
  },
  {
    fruit_name: "Kiwi",
    fruit_color: "Green",
  },
];
let filtered_fruits = fruits.filter((fruit) => fruit.fruit_color === "Red");
console.log(filtered_fruits);

// [
//     { fruit_name: 'Apple', fruit_color: 'Red' },
//     { fruit_name: 'Pomegranate', fruit_color: 'Red' }
//   ]

/********************************************************* */

let fruits = [
  {
    fruit_name: "Apple",
    fruit_color: "Red",
  },
  {
    fruit_name: "Pomegranate",
    fruit_color: "Red",
  },
  {
    fruit_name: "Grapes",
    fruit_color: "Green",
  },
  {
    fruit_name: "Kiwi",
    fruit_color: "Green",
  },
];

let groupingViaCommonProperty = Object.values(
  fruits.reduce((acc, current) => {
    acc[current.fruit_color] = acc[current.fruit_color] ?? [];
    acc[current.fruit_color].push(current);
    return acc;
  }, {})
);
console.log(groupingViaCommonProperty);

// [
//     [
//       { fruit_name: 'Apple', fruit_color: 'Red' },
//       { fruit_name: 'Pomegranate', fruit_color: 'Red' }
//     ],
//     [
//       { fruit_name: 'Grapes', fruit_color: 'Green' },
//       { fruit_name: 'Kiwi', fruit_color: 'green'}
//     ],
//     ...
// ]

const fruits = [
  {
    fruit_name: "Apple",
    fruit_color: "Red",
  },
  {
    fruit_name: "Pomegranate",
    fruit_color: "Red",
  },
  {
    fruit_name: "Grapes",
    fruit_color: "Green",
  },
  {
    fruit_name: "Kiwi",
    fruit_color: "Green",
  },
];

const groupedByColor = fruits.reduce((acc, fruit) => {
  const color = fruit.fruit_color;
  (acc[color] = acc[color] || []).push(fruit);
  return acc;
}, {});

const resultArray = Object.values(groupedByColor);
console.log(resultArray);

/**************************************************** */
const fruits = [
  {
    fruit_name: "Apple",
    fruit_color: "Red",
  },
  {
    fruit_name: "Pomegranate",
    fruit_color: "Red",
  },
  {
    fruit_name: "Grapes",
    fruit_color: "Green",
  },
  {
    fruit_name: "Kiwi",
    fruit_color: "Green",
  },
];

const groupedByColor = {};

for (const fruit of fruits) {
  const color = fruit.fruit_color;
  if (!groupedByColor[color]) {
    groupedByColor[color] = [fruit];
  } else {
    groupedByColor[color].push(fruit);
  }
}

const resultArray = Object.values(groupedByColor);
console.log(resultArray);

/**************************************** */
const fruits = [
  {
    fruit_name: "Apple",
    fruit_color: "Red",
  },
  {
    fruit_name: "Pomegranate",
    fruit_color: "Red",
  },
  {
    fruit_name: "Grapes",
    fruit_color: "Green",
  },
  {
    fruit_name: "Kiwi",
    fruit_color: "Green",
  },
];

const groupedByColor = {};

fruits.forEach((fruit) => {
  const color = fruit.fruit_color;
  groupedByColor[color] = groupedByColor[color] || [];
  groupedByColor[color].push(fruit);
});

const resultArray = Object.values(groupedByColor);
console.log(resultArray);
