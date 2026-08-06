```js
let array = ["GFG_1", "GFG_2", null, "GFG_3",
    "", "GFG_4", undefined, "GFG_5", , , , , ,
    "GFG_6", , 4, , 5, , 6, , , ,];
console.log("original array: " + array)
 
function myGeeks() {
    let filtered = array.filter(function (el) {
        return el != null;
    });
    console.log(filtered);
}
myGeeks()

/************************************************* */

let array = ["GFG_1", "GFG_2", null, "GFG_3",
    "", "GFG_4", undefined, "GFG_5",
    , , , , , "GFG_6", , 4, , 5, , 6, , , ,];
 
console.log("original array: " + array)
 
function myGeeks() {
    let filtered = array.reduce((acc, i) => i ? [...acc, i] : acc, []);
    console.log("new array: " + filtered)
}
myGeeks()


/********************************** */
const arr = ["GFG_1", "GFG_2", null, "GFG_3",
    "", "GFG_4", undefined, "GFG_5", , , , , ,
    "GFG_6", , 4, , 5, , 6, , , ,];
 
// make a new array
// to hold non-empty values
const result = [];
 
for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
        result.push(arr[i]);
    }
}
 
console.log(result);

/*************************************** */

let arr = [1, 2, 3, , 4];
let newArr = arr.flat();
console.log(newArr);