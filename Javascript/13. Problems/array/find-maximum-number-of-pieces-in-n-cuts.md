```js
/*
Input : n = 7
Output : 20

We have given a square piece and the total number of cuts available (n), we need 
to write a JavaScript program to print the maximum number of pieces of equal size 
that can be obtained with the n cuts. Horizontal and Vertical cuts are allowed.

*/

// [
//     [1,2,3,4,5],
//     [6,7,8,9,10],
//     [11,12,13,14,15],
//     [16,17,18,19,20]
// ]
// for n =7, 4 vertical 3Horizontal or 3 vertical 4Horizontal  no of pieces=20


let input = 7; 
let temp = parseInt(input / 2); 
let result = ((temp + 1) * (input - temp + 1)); 
console.log( 
	"Max pieces for n = " + input + " is " + result);


/***************************************** */

let input = 7; 
let hCuts = input >> 1; 
let vCuts = input - hCuts; 
let result = (hCuts + 1) * (vCuts + 1); 
console.log( 
	"Max pieces for n = " + input + " is " + result);


    /***************************** */


    let input = 7; 
let hCuts = 0; 
let vCuts = 0; 
let result = 1; 
for (let i = 0; i < input; i++) { 
	if (i % 2 === 0) { 
		hCuts++; 
	} else { 
		vCuts++; 
	} 
	result = (hCuts + 1) * (vCuts + 1); 
} 
console.log( 
	"Max pieces for n = " + input + " is " + result);

    /*************************************************** */


    function recursiveFunction(input, hCuts = true) { 
        if (input === 0) { 
            return 1; 
        } 
        if (hCuts) { 
            return recursiveFunction(input - 1, false) + input; 
        } else { 
            return recursiveFunction(input - 1, true) + 1; 
        } 
    } 
    let input = 7; 
    let result = recursiveFunction(input, true); 
    console.log( 
        "Max pieces for n = " + input + " is " + result);
    