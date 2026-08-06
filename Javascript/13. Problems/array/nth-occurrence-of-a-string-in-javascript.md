```js
// Input string
let string = "Geeks gfg Geeks Geek Geeks gfg";

// String to search
let searchString = "Geeks";

// occurrence number
let occurrence = 3;
console.log(
  occurrence + "rd occurrence of a '" + searchString + "' in " + string + "'."
);

// Function to get index of occurrence
function getPos(str, subStr, i) {
  return str.split(subStr, i).join(subStr).length;
}

function GFG_Fun() {
  console.log(getPos(string, searchString, occurrence));
}

GFG_Fun();

/************************************ */
// Input string
let string = "Geeks gfg Geeks Geek Geeks gfg";

// String to search
let searchString = "Geeks";

// occurrence number
let occurrence = 3;
console.log(
  occurrence + "rd occurrence of a '" + searchString + "' in " + string + "'."
);

// Function to get index of occurrence
function getIndex(str, substr, ind) {
  let Len = str.length,
    i = -1;
  while (ind-- && i++ < Len) {
    i = str.indexOf(substr, i);
    if (i < 0) break;
  }
  return i;
}

function GFG_Fun() {
  console.log(getIndex(string, searchString, occurrence));
}

GFG_Fun();
