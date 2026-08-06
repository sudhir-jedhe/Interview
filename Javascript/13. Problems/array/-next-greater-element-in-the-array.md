```js
Input:
[4, 5, 2, 25]

Output:
4 ---> 5
5 ---> 25
2 ---> 25
25 ----> -1

let nextGreater = (arr, n = arr.length) => {
    for(let i = 0; i < n; i++){
      let next = -1;
  
      //Find the next greater element
      for(let j = i; j < n; j++){
        if(arr[i] < arr[j]){
          next = arr[j];
          break;
        }
      }
      
      console.log(next);
    }
  }


  let nextGreaterWithStack = (arr, n = arr.length) => {
    let stack = new stackUsingLL();
    let element, next;
    
    //push the first element in the stack
    stack.push(arr[0]);
    
    for(let i = 0; i < n; i++){
      next = arr[i];
      
      if(!stack.isEmpty()){
        element = stack.pop();
        
        //Print the next greater element
        while(element < next){
          console.log(next);
          if(stack.isEmpty()){
            break;
          }
          
          element = stack.pop();
        }
        
        //If next element is smaller then add it to the stack
        if(element > next){
          stack.push(element)
        }
      }
      
      stack.push(next);
    }
    
    //Print the remaining next greaters
    while(!stack.isEmpty()){
      element = stack.pop();
      next = -1;
      console.log(next);
    }
  }


  Input:
nextGreater([11, 13, 21, 3]);

Output:
13
21
-1
-1