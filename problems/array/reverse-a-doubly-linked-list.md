```js
Input:
10 -> 20 -> 30 -> 40 -> 50

Output:
50 -> 40 -> 30 -> 20 -> 10

// swapping pointer
let reverseDLL = (head) => {
    let temp = null;
    let current = head;
    
    while(current){
      temp = current.prev;
      current.prev = current.next;
      current.next = temp;
      current = current.prev;
    }
    
    if (temp != null) { 
      head = temp.prev; 
    }
  }

  Input:
let dll = new doubleLinkedList();
dll.append(10);
dll.append(20);
dll.append(30);
dll.append(40);
dll.append(50);
let head = dll.getHead();
reverseDLL(head);

Output:
//Head (Next nodes)
50 -> 40 -> 30 -> 20 -> 10

//Tail (Prev nodes)
50 <- 40 <- 30 <- 20 <-10

/***************************** */


//Add new node to the given list
let push = (head_ref, new_node) => {
    new_node.prev = null;
  
    //Add the new node if present
    new_node.next = head_ref;
    
    //Mark the previous node
    if(head_ref){
      head_ref.prev = new_node;
    }
    
    head_ref = new_node;
    
    return head_ref;
  }
  
  //swapping nodes
  let reverseList = (head_ref) => {
    if(head_ref === null || head_ref.next === null){
      return null;
    }
    
    let new_head = null;
    let current = head_ref;
    let next = null;
    
    //Push all the nodes in the new list
    while(current){
      next = current.next;
      new_head = push(new_head, current);
      current = next;
    }
    
    //Set the head to the reversed new list
    head_ref = new_head;
  
    return head_ref;
  }



  /***************************************** */
  //swapping data
let reverseDll = (head) => {
    //Get the left and right end of the list
    let left = head, right = head;
    
    //Move to the right end
    while(right.next){
      right = right.next;
    }
    
    //Swap the data at both the ends
    while(left !== right && left.prev !== right){
      let t = left.element;
      left.element = right.element;
      right.element = t;
      left = left.next;
      right = right.prev;
    }
    
    //Return the reversed list
    return head;
  }


  Input:
let dll = new doubleLinkedList();
dll.append(10);
dll.append(20);
dll.append(30);
dll.append(40);
dll.append(50);
let head = dll.getHead();
reverseDLL(head);

Output:
//Head (Next nodes)
50 -> 40 -> 30 -> 20 -> 10

//Tail (Prev nodes)
50 <- 40 <- 30 <- 20 <-10