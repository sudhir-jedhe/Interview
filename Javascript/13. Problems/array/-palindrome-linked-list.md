```js
Input:
D -> E -> N -> N -> E -> D
P -> R -> A -> S -> H -> A -> N-> T

Output:
true
false

let isPalindrome = (head) => {
    let stack = new Stack();
    let current = head;
    
    //Copy linked list elements to the stack
    while(current){
      stack.push(current.element);
      current = current.next;
    }
    
    //Check each elements with the one in stack
    current = head;
    while(current){
      //Get element from the stack
      let elm = stack.pop();
      
      //If mismatch then return false
      if(current.element !== elm){
        return false;
      }
      
      current = current.next;
    }
    
    //Return true if palindrome
    return true;
  }


  Input:
let ll = new LinkedList();
ll.append('D');
ll.append('E');
ll.append('N');
ll.append('N');
ll.append('E');
ll.append('D');
let head = ll.getHead();
console.log(isPalindrome(head));

Output:
true


//Function to reverse the LL
let reverse = (head) => {
    let prev = null;
    let current = head;
    let next = null;
    
    while(current !== null){
       next = current.next; 
       current.next = prev; 
       prev = current; 
       current = next;
    }
    
    head = prev; 
    return head; 
  }
  
  let isPalindrome = (head) => {
    //Original list
    let current = head;
    
    //Reversed list with copy of original
    let listCopy = JSON.parse(JSON.stringify(head));
    let reversed = reverse(listCopy);
    
    //Check each element
    while(current){
      //If elements are not equal
      //Then return false
      if(current.element !== reversed.element){
        return false;
      }
      
      current = current.next;
      reversed = reversed.next;
    }
    
    //Return true if palindrome
    return true;
  }



  //Function to reverse the LL
const reverse = (head) => {
    let prev = null;
    let current = head;
    let next = null;
    
    while(current !== null){
       next = current.next; 
       current.next = prev; 
       prev = current; 
       current = next;
    }
    
    head = prev; 
    return head; 
  }
  
  const getMiddle = (head) => {
    let prev = null;
    let slow = head, fast = head;
    let odd = false;
    
    //Find middle node
    while(fast !== null && fast.next !== null){
      prev = slow;
      slow = slow.next;
      fast = fast.next.next;
    }
    
    //For odd nodes, there is still last element in the fast pointer
    if(fast !== null){
      odd = true;
    }
     
    //Make next of prev node null
    if(prev){
      prev.next = null;
    }
    
    //Return middle node based on the list type
    return odd ? slow.next : slow;
  }
  
  const isPalindrome = (head) => {
    //If not head return true
    if(!head){
      return true;
    }
    
    //Get the middle of the node
    let mid = getMiddle(head);
    
    //Reverse the value of mid
    mid = reverse(mid);
    
    //Compare the first half with second half
    while(head && mid){
      if(head.element !== mid.element){
        return false;
      }
      
      head = head.next;
      mid = mid.next;
    }
    
    return true;
  }


  let isPalindrome = (head, right = head) => {
    left = head;
    
    //stop recursion
    if (!right) {
      return true;
    } 
    
    //Check sublist 
    let result = isPalindrome(head, right.next);
    
    //If sublist is not palindrome 
    //Then return false
    if(!result){
      return false;
    }
    
    //Check if elements are equal
    result = (right.element === left.element);
    
    //Move the left pointer
    left = left.next;
    
    return result;
  }