```js
Input:
arr = [1, -1, 2, -4]
target = 1

Output:
2
Closest sum to the target is 2. (1 + (-1) +2).

Given an array of integers and a target, find a triplet in the array such that their sum is closest to the target. Return the closest sum.


const threeSumClosest = (nums, target) => {
    //sort the array
    nums = nums.sort((a, b) => a - b);
  
    //object to store the result,
    //will be passed as reference
    const result = {
        distance: Number.MAX_VALUE,
        nearest: target
    };
    
    //helper function to find the closest sum to target
    helper(nums, 0, 0, 3, 0, result, target);   
    
    //return the closest sum
    return result.nearest;
};

const helper = (arr, startIndex, length, max, sum, result, target) => {
    //base case
    if(length > max){
        return;
    }
  
    //if we have max(3) numbers combination 
    if(length === max){
        //difference between target and sum
        let calc = Math.abs(sum - target);
        
        //closest sum
        if(calc < result.distance){
            result.nearest = sum;
            result.distance = calc;
        }
      
        return;
    }
    
    //get sum of all max(3) combinations 
    for(let i = startIndex; i < arr.length; i++){
        helper(arr, i + 1, length + 1, max, sum + arr[i], result, target);
    }
}

Input:
const arr = [-1,2,1,-4];
const target = 1;
console.log(threeSumClosest(arr, target));

Output:
2

/********************************************* */


const threeSumClosest = (nums, target) => {
    //sort the array;
    nums = nums.sort((a,b)=>a-b);
    
    //to store closestSum
    let closestSum = Infinity;
  
    //iterate the array
    for (let i = 0; i < nums.length; i ++) {
        //tracker
        let left = i + 1;
        let right = nums.length -1;
      
        //iterate till we have all the combinations
        while (left < right) {
            //sum of the triplets
            let sum = nums[i] + nums[left] + nums[right];
            
            // calc closestSum
            if (Math.abs(sum - target) < Math.abs(closestSum - target)) closestSum = sum;
          
            //update the tracker
            if (sum > target) {
                right --
            } else {
                left ++
            }
        }
    }
    return closestSum;
};