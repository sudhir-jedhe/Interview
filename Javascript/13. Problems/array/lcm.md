```js
let lcm = (n1, n2) => {
  //Find the gcd first
  let gcd = gcd(n1, n2);

  //then calculate the lcm
  return (n1 * n2) / gcd;
};

Input: console.log(lcm(15, 20));
console.log(lcm(5, 7));

Output: 60;
35;


LCM: Least Common Multiple is the smallest number which can be divided by given two numbers.



let lcm = (n1, n2) => {
    //Find the smallest and biggest number from both the numbers
    let lar = Math.max(n1, n2);
    let small = Math.min(n1, n2);
    
    //Loop till you find a number by adding the largest number which is divisble by the smallest number
    let i = lar;
    while(i % small !== 0){
      i += lar;
    }
    
    //return the number
    return i;
  }