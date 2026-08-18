// any -> ts is not going to protect u, do whatever u want
// unknown -> ts is going to force us to check the value before using it

let looseValue: any = "typescript";
console.log(looseValue.toUpperCase());

looseValue = 100;

console.log(looseValue.toUpperCase());

// unknown - we do not know the type it
// but its safer than any

let safeValue: unknown = "backend";

// console.log(safeValue.toUpperCase());

if (typeof safeValue === "string") {
  console.log(safeValue.toUpperCase());
}

let xyz: unknown = 100;

if (typeof xyz === "number") {
  const abc = xyz + 200;
}
