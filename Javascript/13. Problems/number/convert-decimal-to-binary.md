```js
/* 
Input : 7
Output : 111

Input : 10
Output : 1010
If the decimal number is 10.

The remainder when 10 is divided by 2 is zero. Therefore, arr[0] = 0.
Divide 10 by 2. The new number is 10/2 = 5.
The remainder when 5 is divided by 2 is 1. Therefore, arr[1] = 1.
Divide 5 by 2. The new number is 5/2 = 2.
The remainder, when 2 is divided by 2, is zero. Therefore, arr[2] = 0.
Divide 2 by 2. The new number is 2/2 = 1.
The remainder when 1 is divided by 2 is 1. Therefore, arr[3] = 1.
Divide 1 by 2. The new number is 1/2 = 0.
Since the number becomes = 0.
Print the array in reverse order. Therefore the equivalent binary number is 1010.

*/


function decimalToBinary(N) { 
	return (N >>> 0).toString(2);  // right shift operator
} 

let N = 10; 
let binary = decimalToBinary(N); 
console.log( 
	"The binary representation of given number is:- " + binary);


    /************************************* */

    function decimalToBinary(N) { 
        let binary = ''; 
    
        while (N > 0) { 
            binary = (N % 2) + binary; 
            N = Math.floor(N / 2); 
        } 
    
        return binary; 
    } 
    
    let N = 10; 
    let binary = decimalToBinary(N); 
    console.log( 
        "The binary representation of given number is:- " + binary);

/***************************************************** */
function decimalToBinary(val) { 
	return val.toString(2); 
} 

let num1 = 10; 
let result = decimalToBinary(num1); 
console.log("Binary representation:", result);

/************************************* */
function decimalToBinary(num1) { 
	if (num1 === 0) return "0"; 

	let arr = []; 
	for (; num1 > 0; num1 = Math.floor(num1 / 2)) { 
		arr.unshift(num1 % 2); 
	} 
	return arr.join(""); 
} 

let givenNumber = 10; 
let result = decimalToBinary(givenNumber); 
console.log("The binary representation is: " + result);

    