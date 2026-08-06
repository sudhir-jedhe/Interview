```js
Prime Number: A number that is divisble by only 1 and itself.

Input:
1
2
3
4
31
37

Output:
false
true
true
false
true
false


let isPrime = (n) => {
    //if n is less than 2 return false
    if(n < 2){
      return false;
    }
    
    //check if n is divisible number less than its sqaure root
    for(let i = 2; i  <= Math.sqrt(n); i++) {
  
       //if it divisible then return false
       if(n % i == 0){
          return false;
       }
    }
  
    //Else return true
    return true;
  }


  let primeNumberRecursive = (n, i = 2) => {
    //Check if number is less than or equal 2  
    if(n <= 2){
        //if number is equal to 2 then return true
        return (n == 2 )? true : false;
     }
     
     //if number is divisible by any number then return false
     if( n % i == 0){
        return false;
     }
     
     //if number is greater than square root of the given number this return true
     // it is same as i > Math.sqrt(n)
     if( i * i > n ){
        return true;
      }
    
    //call the same function with incremented value of i  
    return primeNumberRecursive(n, i+1);
  }


  function isPrime(num) {
   if(num === 1) return false;
   const max = Math.round(Math.sqrt(num));
   
   for(let i=2; i<=max; i++){
     if(num % i === 0) return false;
   }
   return true;
 }

 
 function isPrime(num) {
   // your code here
   for(let index = 2; index <= Math.sqrt(num); index++) if(num%index === 0) return false;
   return num === 1 ? false : true;
 }