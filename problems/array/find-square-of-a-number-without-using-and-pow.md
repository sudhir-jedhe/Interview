```js
const square = (n) => {
  if (n < 0) return n;

  let result = n;
  for (let i = 1; i < n; i++) {
    result += n;
  }

  return result;
};


function square(n){
    if n === 0 return 0;
    if n is even 
       return 4*square(n/2) 
    if n is odd
       return 4*square(floor(n/2)) + 4*floor(n/2) + 1 
  }
  
  Examples:
  square(6) = 4*square(3)
  square(3) = 4*(square(1)) + 4*1 + 1 = 9
  square(7) = 4*square(3) + 4*3 + 1 = 4*9 + 4*3 + 1 = 49

  const square = (n) => { 
  
    // Base case 
    if (n == 0)  return 0; 
  
    // Handle negative number 
    if (n < 0)  n = -n; 
  
    // Get floor(n/2) using 
    // right shift 
    let x = n >> 1; 
  
    // If n is odd  
    if (n % 2 != 0){
      return ((square(x) << 2) + (x << 2) + 1);
    }
    else { 
      // If n is even 
      return (square(x) << 2);
    }
  } 