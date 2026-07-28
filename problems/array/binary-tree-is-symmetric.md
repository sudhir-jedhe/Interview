```js
Given a binary tree it is symmetric if its one half is mirror of other half. If we cut the tree from middle then its left should be equal to its right.

Input:
     1
   /   \
  2     2
 / \   / \
3   4 4   3

Input:
    1
   / \
  2   2
   \   \
   3    3 This not


   const isMirror = (node1, node2) => {
    if(node1 === null && node2 === null){
      return true;
    }
    
    //Check if node at left and right corner are same or not
    if(node1 !== null && node2 !== null && node1.val === node2.val){
      return(isMirror(node1.left, node2.right) && isMirror(node1.right, node2.left));
    }
    
    return false;
  }

  Input:
function Node(val) {
  this.val = val;
  this.left = null;
  this.right = null;
}

let root = new Node(1);
root.left = new Node(2);
root.right = new Node(2);
root.left.left = new Node(3);
root.left.right = new Node(4);
root.right.left = new Node(4);
root.right.right = new Node(3);

console.log(isMirror(root, root));

Output:
true



/************************** */
const isMirrorIterative = (node) => {
    const q = [];
    
    /* Initially, add left and right nodes of root */
    q.unshift(node.left);
    q.unshift(node.right);
    
    while(q.length > 0){
      /* remove the front 2 nodes to check for equality */
      let tempLeft = q.pop();
      let tempRight = q.pop();
      
      /* if both are null, continue and chcek for further elements */
      if(tempLeft === null && tempRight === null){
          continue;
      }
      
      /* if only one is null*/
      if ((tempLeft == null && tempRight != null) || (tempLeft != null && tempRight == null)) {
          return false; 
      }
      
      /* if both left and right nodes exist, but 
      have different value*/
      if (tempLeft.val !== tempRight.val) return false; 
        
       /* Note the order of insertion of elements to the queue : 
       1) left child of left subtree 
       2) right child of right subtree 
       3) right child of left subtree 
       4) left child of right subtree */
      q.unshift(tempLeft.left); 
      q.unshift(tempRight.right); 
      q.unshift(tempLeft.right); 
      q.unshift(tempRight.left);   
    }
    
    return true;
  }