```js
let Obj = {
  "1_prop": "1_Val",
  "2_prop": "2_Val",
  "3_prop": "3_Val",
};

console.log(JSON.stringify(Obj));
function GFG_Fun() {
  console.log(
    "The last key = '" +
      Object.keys(Obj)[Object.keys(Obj).length - 1] +
      "' Value = '" +
      Obj[Object.keys(Obj)[Object.keys(Obj).length - 1]] +
      "'"
  );
}
GFG_Fun();

/**************************************************** */
let Obj = {
  "1_prop": "1_Val",
  "2_prop": "2_Val",
  "3_prop": "3_Val",
};

console.log(JSON.stringify(Obj));

function GFG_Fun() {
  let lastElement;

  for (lastElement in Obj);
  lastElement;

  console.log(
    "The last key = '" +
      lastElement +
      "' <br> Value = '" +
      Obj[lastElement] +
      "'"
  );
}
GFG_Fun();
