```js
Input:
2 9 3 7 5
2 9 3 7 5

Output:
true


let equalStacks = (stack1, stack2) => {
    //If length is not equal
    //Then return false
    if(stack1.size() !== stack2.size()){
      return false;
    }
    
    //Check if each element in both the stack are equal
    while(!stack1.isEmpty()){
      if(stack1.peek() === stack2.peek()){
        stack1.pop();
        stack2.pop();
      }else{
        return false;
      }
    }
    
    return true;
  }


  Input:
let stack1 = new stackUsingLL();
stack1.push(2);
stack1.push(9);
stack1.push(3);
stack1.push(7);
stack1.push(5);

let stack2 = new stackUsingLL();
stack2.push(2);
stack2.push(9);
stack2.push(3);
stack2.push(7);
stack2.push(5);

console.log(equalStacks(stack1, stack2));

Output:
true