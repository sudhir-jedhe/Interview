```js
function findSingle(arr: number[]): number {
    let single = arr[0];
    for (let a = 1; a < arr.length; a++) {
      single ^= arr[a];
    }
    return single;
  }


  function findSingle(arr) {
    // your code here
    let x = arr.filter((num) => arr.indexOf(num) === arr.lastIndexOf(num))
    return +x
  }

  function findSingle(arr) {return arr.reduce((a,c) => a^c);}


  function findSingle(arr) {
    if(!arr || !arr.length) {
      return;
    }
    let result = arr[0];
    for(let i = 1; i < arr.length; i++) {
      result ^= arr[i];
    }
    return result;
  }

  
  function findSingle(arr) {
    const map = arr.reduce((acc, num) => {
        if (!acc[num]) acc[num]  = 0
        acc[num] += 1;
        return acc;
    }, {});
    const [num] = Object.entries(map).find(([_, count]) => count == 1);
    return +num;
  }
  

  function findSingle(arr) {
    for (let i of arr) {
      if ( arr.indexOf(i) == arr.lastIndexOf(i) ) {
        return i
      }
    }
  }


  function findSingle(arr) {
    const single = new Set();
    arr.forEach((num) => {
      if (single.has(num)) {
        single.delete(num);
      } else {
        single.add(num);
      }
    });
    return single.values().next().value;
  }
  const arr = [10, 2, 2 , 1, 0, 0, 10]
  console.log(findSingle(arr));



  function findSingle(arr) {
    // your code here
    // use a hashmap for the results;
    const hashmap = {};
    for(let i = 0; i < arr.length; i++){
      if(!hashmap[arr[i]]) {
        // save the value in the hashmap
        hashmap[arr[i]] = 1;
      } else {
        // clean the hashmap in case of duplications 
        delete hashmap[arr[i]];
      }
    }
    // as we cleaned all the duplications return the remain value
    return Number(Object.keys(hashmap)[0]);