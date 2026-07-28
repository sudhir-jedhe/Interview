```js
// Using reduce() method  
let inputArray = [3, 1, 7, 9, 2, 8, 4, 6, 5]; 
let smallestElement = Math.min(...inputArray); 
let largestElement = Math.max(...inputArray); 
inputArray = 
    inputArray.reduce((newArray, currentElement) => { 
        if (currentElement !== smallestElement && 
            currentElement !== largestElement) { 
            newArray.push(currentElement); 
        } 
        return newArray; 
    }, []) 
  
console.log(inputArray);


/*************************************** */
//Using For loop 
let inputArray = [10, 45, 78, 23, 44, 11, 67]; 
let smallestElement = Math.min(...inputArray); 
let largestElement = Math.max(...inputArray); 
let newArray = []; 
  
for (let i = 0; i < inputArray.length; i++) { 
    if (inputArray[i] !== smallestElement && 
        inputArray[i] !== largestElement) { 
        newArray.push(inputArray[i]); 
    } 
} 
  
console.log(newArray);

/************************************* */
// Without using Math.min() and Math.max() 
let inputArray = [10, 5, 4, 6, 8, 1, 3, 9, 2]; 
let smallestElement = Infinity; 
let largestElement = -Infinity; 
  
for (let item of inputArray) { 
    if (item < smallestElement) smallestElement = item; 
    if (item > largestElement) largestElement = item; 
} 
  
let newArray = 
    inputArray.filter( 
        num => num !== smallestElement && num !== largestElement); 
  
console.log(newArray);

/************************** */
function remove(arr) { 
    arr.sort((a, b) => a - b); 
    arr = arr.slice(1, arr.length - 1); 
    return arr; 
} 
  
const newArray = [10, 5, 4, 6, 8, 1, 3, 9, 2]; 
const result = remove(newArray); 
console.log(result);