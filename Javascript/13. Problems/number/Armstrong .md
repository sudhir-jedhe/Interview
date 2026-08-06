```js
function isArmstrongNumber(number) {
    // Convert number to string to iterate through digits
    const numStr = number.toString();
    const numDigits = numStr.length;
    
    let sum = 0;
    
    // Iterate through each digit and calculate sum of each digit raised to the power of numDigits
    for (let digit of numStr) {
      sum += Math.pow(parseInt(digit), numDigits);
    }
    
    // Check if the sum equals the original number
    return sum === number;
  }
  
  // Example usage:
  const number = 153;
  console.log(`${number} is Armstrong number?`, isArmstrongNumber(number)); // Output: true
  
  const number2 = 370;
  console.log(`${number2} is Armstrong number?`, isArmstrongNumber(number2)); // Output: true
  
  const number3 = 123;
  console.log(`${number3} is Armstrong number?`, isArmstrongNumber(number3)); // Output: false

  

  /************************************************ */

  function isArmstrongNumber(number) {
    const numStr = number.toString();
    const numDigits = numStr.length;
  
    const sum = numStr.split('')
                      .map(digit => Math.pow(parseInt(digit), numDigits))
                      .reduce((acc, curr) => acc + curr, 0);
    
    return sum === number;
  }
  
  // Example usage:
  console.log(isArmstrongNumber(153)); // Output: true
  console.log(isArmstrongNumber(370)); // Output: true
  console.log(isArmstrongNumber(123)); // Output: false

  /******************************************************* */


  function isArmstrongNumber(number) {
    const numStr = number.toString();
    const numDigits = numStr.length;
  
    let sum = 0;
    numStr.split('').forEach(digit => {
      sum += Math.pow(parseInt(digit), numDigits);
    });
    
    return sum === number;
  }
  
  // Example usage:
  console.log(isArmstrongNumber(153)); // Output: true
  console.log(isArmstrongNumber(370)); // Output: true
  console.log(isArmstrongNumber(123)); // Output: false

  
  /******************************** */
  const isArmstrongNumber = number => {
    const numStr = number.toString();
    const numDigits = numStr.length;
  
    const sum = numStr.split('')
                      .reduce((acc, digit) => acc + Math.pow(parseInt(digit), numDigits), 0);
    
    return sum === number;
  };
  
  // Example usage:
  console.log(isArmstrongNumber(153)); // Output: true
  console.log(isArmstrongNumber(370)); // Output: true
  console.log(isArmstrongNumber(123)); // Output: false
  

  /**************************** */

  //function to check if given number is Armstrong or not
let isArmstrong = (num) => {
  let sum = 0;
  //store the actual number to check later
  let temp = num;

  //Extract each digit of number
  while(num > 0){
    //get the last digit of the number
    let d = parseInt(num % 10);
  
    //find the cube
    d = d ** 3;
    sum = sum + d;
  
    //reduce the number
    num = parseInt(num / 10);
  }
  
  //Check if number equals to the cubed sum
  return temp === sum;
}

//Function to print all the Armstrong number
let printArmstrong = (start, end) => {

  //loop through given range of numbers
  for(let i = start; i <= end; i++){

     //If the it is Armstrong then print
     if(isArmstrong(i)){
       console.log(i);
     }
  }
}


Input:
printArmstrong(0, 100);
printArmstrong(100, 200);
printArmstrong(300, 700);

Output:
0
1

0
1
153

370
371
407