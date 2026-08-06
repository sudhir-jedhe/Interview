const arr = [1, 2, 3, 4];

arr.push(5); // now array is [1, 2, 3, 4, 5]
arr.pop(); // 5, now the array is [1, 2, 3, 4]
arr.push(5); // now the array is [1, 2, 3, 4, 5]
arr.shift(); // 1, now the array is [2, 3, 4, 5]

/* you can use this Class which is bundled together with your code

class Stack {
  push(element) { // add element to stack }
  peek() { // get the top element }
  pop() { // remove the top element}
  size() { // count of element }
}
*/

/* Array is disabled in your code */

// you need to complete the following Class
class Queue {
  constructor() {
    this.stack1 = new Stack();
    this.stack2 = new Stack();
  }
  enqueue(element) {
    // always add it to the bottom of the stack,
    // so that first in element always stays on the top of the stack

    // transfer all elements from stack1 to stack2 as you want to add the new element to the bottom of stack1
    for (let i = 0; i < this.stack1.size(); i++) {
      this.stack2.push(this.stack1.pop());
    }

    // now add the element to stack1
    this.stack1.push(element);

    // transfer back
    for (let i = 0; i < this.stack2.size(); i++) {
      this.stack1.push(this.stack2.pop());
    }
  }
  peek() {
    return this.stack1.peek();
  }
  size() {
    return this.stack1.size();
  }
  dequeue() {
    return this.stack1.pop();
  }
}
/************************ */
class Queue {
  constructor() {
    this.ins = new Stack(); // stack which receives newly enqueued values
    this.outs = new Stack(); // stack which puts first-in value at the top
  }
  enqueue(element) {
    this.ins.push(element);
  }
  peek() {
    if (this.outs.size() === 0) {
      while (this.ins.size()) {
        this.outs.push(this.ins.pop());
      }
    }
    return this.outs.peek();
  }
  size() {
    return this.ins.size() + this.outs.size();
  }
  dequeue() {
    this.peek();
    return this.outs.pop();
  }
}



/****************************** */
* you can use this Class which is bundled together with your code

class Stack {
  push(element) { // add element to stack }
  peek() { // get the top element }
  pop() { // remove the top element}
  size() { // count of element }
}
*/

/* Array is disabled in your code */

// you need to complete the following Class
class Queue {

  constructor(){
    this.stack = new Stack(); // [1, 2, 3]
  }

  enqueue(element) { 
    // add new element to the rare
    this.stack.push(element);  
  }
  peek() { 
    // get the head element
    let rStack = this._reverse(this.stack);
    return rStack.peek();
  }

  size() { 
    // return count of element
    console.log(this.stack)
    return this.stack.size()

  }
  dequeue() {
    // remove the head element
    let rStack = this._reverse(this.stack);
    let dQueueEle = rStack.pop();
    this.stack = this._reverse(rStack)
    return dQueueEle;
  }

  _reverse(stack){
    let rStack = new Stack(); 
    while(stack.size() > 0){
      rStack.push(stack.pop());
    }
    return rStack;

  }

  

}
/************************************* */
/* you can use this Class which is bundled together with your code

class Stack {
  push(element) { // add element to stack }
  peek() { // get the top element }
  pop() { // remove the top element}
  size() { // count of element }
}
*/

/* Array is disabled in your code */

// you need to complete the following Class
class Queue {
    constructor() {
      this.stack = new Stack();
    }
    enqueue(element) { 
      const reversed = new Stack();
      while(this.stack.size()) {
        reversed.push(this.stack.pop());
      }
      reversed.push(element);
  
      while (reversed.size()) {
        this.stack.push(reversed.pop());
      }
    }
    peek() { 
      return this.stack.peek();
    }
    size() { 
      return this.stack.size();
    }
    dequeue() {
      return this.stack.pop();
    }
  }
  /*
    [1]
    [1]
    [1, 2]
    [2, 1]
  
    [2, 1]
    [1, 2]
    [1, 2, 3]
    [3, 2, 1]
  
    [3, 2, 1]
    [1, 2, 3, 4]
    [4, 3, 2, 1]
  */
