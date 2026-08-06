```js
Learn how to find the first or last occurrence of a given number in a sorted array.

Given a sorted array with duplicate values we have to create two different algorithms which will find the first and last occurrence of the given element.


const first = (arr, value) => {
    let low = 0;
    let high = arr.length - 1;
    let result = -1;
    
    //keep looking for all the elements in the array
    while(low <= high){
      //Get the mid
      const mid = Math.ceil((low + high) / 2);
      
      //If an element found
      //Then store the index and look in the lower range for the first occurrence
      if(arr[mid] === value){
        result = mid;
        high = mid - 1;
      }else if(value < arr[mid]){
        //If the value is less than the mid element then looking at the lower range
        high = mid - 1;
      }else{
        //If the value is greater than the mid element then look in the upper range
        low = mid + 1;
      }
    }
    
    //Return the index
    return result;
  }


  Input:
const arr = [1, 2, 3, 4, 5, 5, 6, 6, 7, 8, 9, 10];
console.log(first(arr, 5));
console.log(first(arr, 6));

Output:
4
6


const first = (arr, value, low = 0, high = arr.length - 1, result = -1) => {
    //Search if the array exists
    if(low <= high)  { 
      
      //Get the mid
      const mid = Math.ceil((low+high) / 2);  
      
      //If element found
      //Store the result
      //And the check the lower range to make sure we get the first occurrence
      if(value === arr[mid]){
        result = mid;
        return first(arr, value, low, mid - 1, result);
      }else if(value < arr[mid]){
        //If value is less 
        //Then search in the lower range
        return first(arr, value, low, mid - 1, result);
      }else{
        //Else search in the upper range
        return first(arr, value, mid + 1, high, result);
      }
    } 
    
    //In the end return the result
    return result;
  }

  Input:
const arr = [1, 2, 3, 4, 5, 5, 6, 6, 7, 8, 9, 10];
console.log(first(arr, 5));
console.log(first(arr, 6));

Output:
4
6


const last = (arr, value) => {
    let low = 0;
    let high = arr.length - 1;
    let result = -1;
    
    //Search till the array exists
    while(low <= high){
      //Get the mid
      const mid = Math.ceil((low + high) / 2);
      
      //If element found
      //Then keep looking for the last element in the upper range
      if(arr[mid] === value){
        result = mid;
        low = mid + 1;
      }else if(value < arr[mid]){
        //Else if value is less than mid element then looking in the lower range
        high = mid - 1;
      }else{
        //Else if value is greater than mid element then look in the upper range
        low = mid + 1;
      }
    }
    
    //Return the result
    return result;
  }

  const last = (arr, value, low = 0, high = arr.length - 1, result = -1) => {
  
    //Search if the array exists
    if(low <= high)  { 
      
      //Get the mid
      const mid = Math.ceil((low+high) / 2);  
      
      //If the element found
      //Store the result
      //And keep checking the upper range to get the last occurrence of element
      if(value === arr[mid]){
        result = mid;
        return last(arr, value, mid + 1, high, result);
      } else if(value < arr[mid]){
        //If value is less
        //Then check in the lower range
        return last(arr, value, low, mid - 1, result);
      }else{
        //Else check in the upper range
        return last(arr, value, mid + 1, high, result);
      }
    } 
    
    //In the end return the result
    return result;
  }


  Input:
const arr = [1, 2, 3, 4, 5, 5, 6, 6, 7, 8, 9, 10];
console.log(last(arr, 5));
console.log(last(arr, 6));

Output:
5
7