```js
An algorithm to find the sum and product of all the nodes in the linked list which are less than k in javascript.

Input:
5 -> 15 -> 17 -> 3 -> 22 -> 9 -> 2 -> 13
k = 15

Output:
sum = 32, product = 3510


let sumAndProduct = (head, k) => {
    //calculate sum and product separately
    let sum = 0;
    let product = 1;
    
    //Loop the list
    while(head){
      let elm = head.element;
      
      //Check if element is less than k
      //Add and Multiply it
      if(elm < k){
        sum += elm;
        product *= elm;
      }
      
      head = head.next;
    }
   
   //Print the output
   console.log(`sum = ${sum}`, `product = ${product}`); 
  }


  Input:
let ll = new LinkedList();
ll.append(5);
ll.append(15);
ll.append(17);
ll.append(3);
ll.append(22);
ll.append(9);
ll.append(2);
ll.append(13);
let head = ll.getHead();
sumAndProduct(head, 15);

Output:
"sum = 32, product = 3510"