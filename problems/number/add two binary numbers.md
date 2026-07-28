```js
let addBinary = (a, b) => {
 
    let str = '';  //To store the final result
    let carry = 0; // To track the carry
    let aSize = a.length - 1;
    let bSize = b.length - 1;
    
    //Loop through both number while one of them has value
    while(aSize >= 0 || bSize >= 0){
          
     let tempA = a[aSize] || 0; // if value is present then use value else use 0
     let tempB = b[bSize] || 0; // if value is present then use value else use 0
     
     //Add the digits and carry
     let sum = Number(tempA) + Number(tempB) + carry;
     
     //if sum is greater than 1
     if(sum > 1){
       //Store the sum and carry
       sum = sum % 2;
       carry = 1;
     }else{
      //Else carry is zero
      carry = 0;
     }
     
     //store the result   
     str = sum + str;
           
     aSize--;
     bSize--;
   }
   
   //If carry still has value then append it to the result
   if(carry){
     str = carry + str;
   }
       
     return str;
   };


   Input:
console.log(addBinary('1010','1011'));

Output:
10101