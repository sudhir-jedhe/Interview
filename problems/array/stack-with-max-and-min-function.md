```js
Input:
2 5 17 23 88 54 1 22

Output:
max: 88
min: 1


function stackWithMax(){
    let items = [];
    let length = 0;
  
    this.push = (item) => {
      //Check if stack is empty
      //Then add the current value at all place
      if(length === 0){
        items[length++] = {value: item, max: item, min: item};
      }else{
        //Else get the top data from stack
        const data = this.peek();
        let {max, min} = data;
        
        //If it is greater than previous then update the max
        max = max < item ? item : max;
        
        //If it is lesser than previous then update the min
        min = min > item ? item : min;
        
        //Add the new data
        items[length++] = {value: item, max, min};
      }
    }
    
    //Remove the item from the stack
    this.pop = () => {
      return items[--length];
    }
    
    //Get the top data
    this.peek = () => {
      return items[length - 1];
    }
    
    //Get the max value
    this.max = () => {
      return items[length - 1].max;
    }
    
    //Get the min value
    this.min = () => {
      return items[length - 1].min;
    }
    
    //Get the size
    this.size = () => {
      return length;
    }
    
    //Check if its empty
    this.isEmpty = () => {
      return length === 0;
    }
    
    //Clear the stack
    this.clear = () => {
      length = 0;
      items = [];
    }
}


Input:
let SM = new stackWithMax();
SM.push(4);
SM.push(7);
SM.push(11);
SM.push(23);
SM.push(77);
SM.push(3);
SM.push(1);
SM.pop();
console.log(`max: ${SM.max()}`, `min: ${SM.min()}`);

Output:
"max: 77" "min: 3"