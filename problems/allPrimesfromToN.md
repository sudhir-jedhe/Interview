```js

```js
let allPrimes = (n) => {
    //Create new n+1 array and mark them as true
    let isPrime = new Array(n+1).fill(true);
    isPrime[0] = false;
    isPrime[1] = false;
   
    let primes = [];
 
    for(let i = 2; i <= n; i++){
      //if the number is  
      if(isPrime[i] === true){
         primes.push(i); 
      }
      
       //mark all the numbers divisible i as false
       let next = i * i;
       while (next <= n) {
         isPrime[next] = false;
         next += i;
       }  
    }
 
    return primes;
 }



 Input:
10

Output:
[2, 3, 4, 5, 6, 7, 8, 9, 10]
[2] = true
[4] = false
[6] = false
[8] = false
[10] = false

[3] = true
[6] = false
[9] = false

[5] = true
[7] = true

2, 3, 5, 7 are the prime numbers from 2 to 10

Input:
console.log(allPrimes(100));

Output:
[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]