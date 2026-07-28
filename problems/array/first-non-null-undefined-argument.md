```js
function coalesce() {
  for (let i = 0; i < arguments.length; i++) {
    if (arguments[i] != null) {
      return arguments[i];
    }
  }
}

console.log(coalesce(null, undefined, "First", 1, 2, 3, null)); //First

/*********************** */

const coalesceES6 = (...args) =>
  args.find((_) => ![null, undefined].includes(_));
console.log(coalesceES6(null, undefined, "Value One", 1, 2, 3, null));

/************************************************************** */

let products = [
  {
    id: 1,
    desc: `The best in class toaster that has 140 
	watt power consumption with nice features that 
	roast your bread just fine. Also comes bundled 
	in a nice cute case.`,
    summ: `Get world class breakfasts`,
  },
  {
    id: 2,
    desc: `A massager that relieves all your pains 
	without the hassles of charging it daily 
	or even hourly as it comes packed with Li-Ion 
	batteries that last upto 8 hrs.`,
    summ: "Warm comfort for your back",
  },
  {
    id: 3,
    desc: `An air conditioner with a difference that 
	not only cools your room to the best temperatures 
	but also provides cleanliness and disinfection at 
	best in class standards`,
    summ: null,
  },
];

const coalesceES6 = (...args) =>
  args.find((_) => ![null, undefined].includes(_));

function displayProdCat(products) {
  for (let product of products) {
    console.log(`ID = ${product.id}`);
    console.log(`Description = ${product.desc}`);
    let summProd = coalesceES6(product.summ, product.desc.slice(0, 50) + "...");
    console.log(`Summary = ${summProd}`);
  }
}

displayProdCat(products);

/************************** */

const incomeFigures = {
  default: 1000,
  monthWise: [1200, , 600, 2100, , 329, 1490, , 780, 980, , 1210],
};

const coalesceES6 = (...args) =>
  args.find((_) => ![null, undefined].includes(_));

function yearlyIncome(incomeFig) {
  return incomeFig.monthWise.reduce(
    (total, inc) => total + coalesceES6(inc, incomeFig.default)
  );
}

console.log(
  `Yearly income equals 
${yearlyIncome(incomeFigures)}`
);
