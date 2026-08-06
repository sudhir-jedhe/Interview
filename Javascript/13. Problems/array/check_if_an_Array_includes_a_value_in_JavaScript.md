```js
let num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 
function check(element) {
 
    for (let i = 0; i < num.length; i++) {
        if (num[i] == element)
            return element + " is present in the array.";
 
    }
    return element + " is not present in the array.";
}
console.log(check(8));
/***************************************************** */

let element = 41;
if (num.indexOf(element) > 0)
    console.log(element + " is present.");
else
    console.log(element + " is not present.");

/***************************************** */
function bsearch(arr, l, r, x) {
    if (r >= l) {
        let mid = l + Math.floor((r - l) / 2);
 
        if (arr[mid] == x)
            return mid;
 
        if (arr[mid] > x)
            return bsearch(arr, l, mid - 1, x);
 
        return bsearch(arr, mid + 1, r, x);
    }
 
    return -1;
 
}
 
let num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 
// To check if 85 is present or not
console.log("Is 85 present? " + (bsearch(num, 0, num.length, 85) != -1));
 
// To check if 1 is present or not
console.log("Is 1 present? " + (bsearch(num, 0, num.length, 1) != -1));


/*************************************** */
function check(element) {
 
    let ans = num.filter(x => x == element);
    if (ans.length)
        return element + " is present in the array.";
 
    return element + " is not present in the array.";
}
console.log(check(81));