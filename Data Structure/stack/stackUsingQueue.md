function Stack() {
  let queue = new Queue();

  //Push
  this.push = function (elm) {
    let size = queue.size();

    queue.enqueue(elm);

    //Move old data after the new data
    for (let i = 0; i < size; i++) {
      let x = queue.dequeue();
      queue.enqueue(x);
    }
  };

  //Pop
  this.pop = function () {
    if (queue.isEmpty()) {
      return null;
    }

    return queue.dequeue();
  };

  //Peek
  this.peek = function () {
    if (queue.isEmpty()) {
      return null;
    }

    return queue.front();
  };

  //Size
  this.size = function () {
    return queue.size();
  };

  //IsEmpty
  this.isEmpty = function () {
    return queue.isEmpty();
  };

  //Clear
  this.clear = function () {
    queue.clear();
    return true;
  };

  //ToArray
  this.toArray = function () {
    return queue.toArray();
  };
}


Input:
let stack = new Stack();   //creating new instance of Stack
 stack.push(1);
 stack.push(2);
 stack.push(3);
 console.log(stack.peek());
 console.log(stack.isEmpty());
 console.log(stack.size());
 console.log(stack.pop());
 console.log(stack.toArray());
 console.log(stack.size());
 stack.clear();  //clear the stack
 console.log(stack.isEmpty());

Output:
3
false
3
3
[2, 1]
2
true



let Stack = (function(){

    return function Stack() {
        let queue = new Queue();
    
        //Push
        this.push = function(elm){
          let size = queue.size();
    
          queue.enqueue(elm);
    
          //Move old data after the new data
          for(let i = 0; i < size; i++){
            let x = queue.dequeue();
            queue.enqueue(x);
          }
        }
    
        //Pop
        this.pop = function(){
          if(queue.isEmpty()){
            return null;
          }
    
          return queue.dequeue();
        }
    
        //Peek
        this.peek = function(){
          if(queue.isEmpty()){
            return null;
          }
    
          return queue.front();
        }
    
        //Size
        this.size = function(){
          return queue.size();
        }
    
        //IsEmpty
        this.isEmpty = function(){
          return queue.isEmpty();
        }
    
        //Clear
        this.clear = function(){
          queue.clear();
          return true;
        }
    
        //ToArray
        this.toArray = function(){
          return queue.toArray();
        }
      }
    
    }());