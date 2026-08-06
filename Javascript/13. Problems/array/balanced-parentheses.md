```js
# An algorithm to check if an expressions (parentheses) given in a string are balanced or not

Input:
'[{}]'
'[{}{}{}}]'

Output:
true
false

```js
// stack
function Stack(){
    var items = [];
    var top = 0;
    //other methods go here

    //Push an item in the Stack
    this.push = function(element){
      items[top++] = element
    }
    //top++, first performs the operation then increment's the value

    //Pop an item from the Stack
    this.pop = function(){
      return items[--top];
    }
    //--top, first decrements the value then performs the operation

    //Peek top item from the Stack
    this.peek = function(){
      return items[top - 1];
    }

    //Is Stack empty
    this.isEmpty = function(){
      return top === 0;
    }

    //Clear the Stack
    this.clear = function(){
       top = 0;
    }

    //Size of the Stack
    this.size = function(){
      return top;
    }
  }

  //Function to check balanced parantheses
  let checkBalancedParentheses = (str) => {
    //Create a stack
    let stack = new Stack();

    for(let i = 0; i < str.length; i++){
       if(str[i] == '{' || str[i] == '(' || str[i] == '['){
           stack.push(str[i]);
       }

       if(str[i] == '}' || str[i] == ')' || str[i] == ']'){
         //return false if stack is empty
         if(stack.isEmpty()){
            return false;
         }

         //Pop an item from the stack and check if it matches the corresponding parentheses
         let temp = stack.pop();
         if(temp == '{' && str[i] != '}'){
           return false;
         }else if(temp == '[' && str[i] != ']'){
           return false;
         }else if(temp == '(' && str[i] != ')'){
           return false;
         }
      }
    }
    //If stack is empty after traversing the string then return true
    if(stack.isEmpty()){
     return true;
    }else{
      return false;
    }
  }

  Input:
console.log(checkBalancedParentheses('[{}]'));
console.log(checkBalancedParentheses('[{}{}{}{]'));
console.log(checkBalancedParentheses('({[]}){}[][({})]'));

Output:
//How it works
/*
   stack = new Stack();
   loop
   each character of string
   first character = '['
   if(character == '{' || character == '[' || character == '('){
     stack.push(character)     = ['[']
   }
   second character = '{'
   if(character == '{' || character == '[' || character == '('){
     stack.push(character)     = ['{','[']
   }
   third character = '}'
   if(character == '}' || character == ']' || character == ')'){
     //Condition is false
     if(stack.isEmpty()){
       return false;
     }

     var temp = stack.pop(); temp = '{'
     //Condition is false
     if(temp == '{' && str[i] != '}'){
      return false
     }
   }

   do the same for all the characters in the string
   in the end, check if the stack is empty or not
   return true if empty else return false;
*/

```

true
false
true
