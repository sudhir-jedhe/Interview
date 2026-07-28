```js
Input:
[1, 2, 3]
[1, 2, 3, 4, 5]

Output:
1 2
1 3
2 3

1 2
1 3
1 4
1 5
2 3
2 4
2 5
3 4
3 5
4 5



let  combinations = (arr) => {
    //remove duplicate numbers
    let set = new Set(arr);
       
    //create new error from the unique numbers
    arr = [...set];
      
    //print all the combinations
    for(let i = 0; i < arr.length - 1; i++){       
      for(let j = i + 1; j < arr.length; j++){ 
           console.log(arr[i], arr[j]);
      }
          
    }
      
 }