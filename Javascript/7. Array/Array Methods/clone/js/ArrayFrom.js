let arr = [1,24,5,6,7,8,9];
let clonedArr = Array.from(arr);
console.log(clonedArr);


 let anotherArr = [1,2,3,4,5];
let clonedAnotherArr = Array.from(anotherArr, (element) => element * 2);
console.log(clonedAnotherArr);
