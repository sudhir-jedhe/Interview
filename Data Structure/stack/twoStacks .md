An algorithm to implement two stacks with a single array.

We are going to create a data structure called twoStacks which will be using only a single array to store the data but will act as two different stacks.

The twoStacks data structure will perform following operations.

push1(elm): This will add data in the first stack.
push2(elm): This will add data in the second stack.
pop1(): This will remove the data from the first stack.
pop2(): This will remove the data from the second stack.

Input:
let stack = new twoStacks(10);

//Push data in first stack
stack.push1('Prashant');

//Push data in second stack
stack.push2('Yadav');

//Pop data from first stack
console.log(stack.pop1());

//Pop data from second stack
console.log(stack.pop2());

Output:
"Prashant"
"Yadav"





class twoStacks {
 
    //Initialize the size of the stack
    constructor(n){
      this.size = n;
      this.top1 = -1;
      this.top2 = n;
      this.arr = [];
    }
    
    //Push in stack1
    push1 = (elm) => {
      //Check if there is space in array
      //Push at the start of the array
      if(this.top1 < this.top2 - 1){
        this.arr[++this.top1] = elm;
      }else{
        console.log('Stack overflow');
        return false;
      }
    }
    
    //Push in stack2
    push2 = (elm) => {
      //Check if there is space in array
      //Push at the end of the array
      if(this.top1 < this.top2 - 1){
        this.arr[--this.top2] = elm;
      }else{
        console.log('Stack overflow');
        return false;
      }
    }
    
    //Pop from the stack 1
    pop1 = () => {
      //Check if stack1 has data
      //Remove it from the front of the stack
      if(this.top1 >= 0){
         let elm = this.arr[this.top1];
         this.top1--;
         return elm;
      }else{
         console.log('stack underflow');
         return false;
      }
    }
    
    //Pop from the stack 2
    pop2 = () => {
      //Check if stack2 has data
      //Remove it from the end of the array
      if(this.top2 < this.size){
         let elm = this.arr[this.top2];
         this.top2++;
         return elm;
      }else{
         console.log('stack underflow');
  
         return false;
      }
    }
  }