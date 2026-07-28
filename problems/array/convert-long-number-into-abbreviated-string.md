```js
// 1234 to 1.2k
// Input number
let n = 123287342;
// Display input number
console.log(n);

// Function to convert number
function convert(val) {
  // Thousands, millions, billions etc..
  let s = ["", "k", "m", "b", "t"];

  // Dividing the value by 3.
  let sNum = Math.floor(("" + val).length / 3);

  // Calculating the precised value.
  let sVal = parseFloat(
    (sNum != 0 ? val / Math.pow(1000, sNum) : val).toPrecision(2)
  );

  if (sVal % 1 != 0) {
    sVal = sVal.toFixed(1);
  }

  // Appending the letter to precised val.
  return sVal + s[sNum];
}

// Function to show converted output
function GFG_Fun() {
  // Display output
  console.log("Number = " + convert(n));
}

GFG_Fun();

/******************************************************** */
// Input number
let n = 1232873425;

// Display input number
console.log(n);

// Function to convert
let convert = (n) => {
  if (n < 1e3) return n;
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
};

// Function to display converted output
function GFG_Fun() {
  // Display output
  console.log("Number = " + convert(n));
}

// Funcion call
GFG_Fun();
