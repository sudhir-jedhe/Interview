```js
const singleNumber = (nums) => {
    //Hashmap
    const track = {};
    
    //Count the frequency
    for(let i = 0; i < nums.length; i++){
        if(track[nums[i]]){
            track[nums[i]]++;
        }else{
            track[nums[i]] = 1;
        }
    }
    
    //Return the element with odd frequency
    for(let key in track){
        if(track[key] % 2 !== 0){
            return key;
        }
    }
};




const singleNumber = (nums) => {
    //Hashmap
    const track = nums.reduce((a, b) => {
      a[b] ? a[b]++ : a[b] = 1;
      return a;
    }, {});
      
    //Return the element with odd count
    return Object.keys(track).filter(e => track[e] % 2 !== 0)[0];
};


Input:
[2, 2, 1, 1, 1]

Output:
1