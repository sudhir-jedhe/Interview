```js
let reverseString = (str) => {
    //Create a new stack
    let stack = new Stack();
    
    //Add each character to the stack
    for(let char of str){
      stack.push(char);
    }
    
    let reversed = '';
   
    //Form the reversed string by accessing each character from the stack
    while(!stack.isEmpty()){
       reversed += stack.pop();
    }
    
    //Return the reversed string
    return reversed;
 }