```js
Input:
     4
   /   \
  2     7
 / \   / \
1   3 6   9

Output:
     4
   /   \
  7     2
 / \   / \
9   6 3   1


//post order
Invert(left-subtree)
Invert(right-subtree)
Swap left and right subtrees.

//pre order
Swap left and right subtrees
Invert(left-subtree)
Invert(right-subtree)

//swap nodes
const swap = (node) => {
    const { left, right} = node;
    node.left = right;
    node.right = left;
  }
  
  const invertBinaryTree = (root) => {
    //Base case
    if(root === null){
      return;
    } 
    
    //Swap the left subtree with right subtree
    swap(root);
    
    //Invert left subtree
    invertBinaryTree(root.left);
    
    //Invert right subtree
    invertBinaryTree(root.right)
  }


  Input:
const preorder = (tree) => {
  if(tree === null){
    return;
  }
  
  console.log(tree.val);
  preorder(tree.left);
  preorder(tree.right);
}

function Node(val) {
  this.val = val;
  this.left = null;
  this.right = null;
}

const tree = new Node(4);  
tree.left = new Node(2);  
tree.right = new Node(7);  
tree.left.left = new Node(1);  
tree.left.right = new Node(3);  
tree.right.left = new Node(6);  
tree.right.right = new Node(9);  

invertBinaryTree(tree);
preorder(tree);

Output:
4 7 9 6 2 3 1


     4
   /   \
  7     2
 / \   / \
9   6 3   1


/************************************ */
const invertTreeUsingQueue = (root) => {
    //Base case
    if(root === null){
      return;
    }
    
    //Create a queue and add the root at the top
    const q = [];
    q.unshift(root);
    
    //iterate till queue has any node
    while(q.length){
      //get top node
      const curr = q.pop();
      
      //Swap left child with right child of the node
      swap(curr);
       
      //Push left child to the queue
      if(curr.left !== null){
        q.unshift(curr.left);
      }
      
      //Push right child to the queue
      if(curr.right !== null){
        q.unshift(curr.right);
      }
    }
  }


  Input:
const preorder = (tree) => {
  if(tree === null){
    return;
  }
  
  console.log(tree.val);
  preorder(tree.left);
  preorder(tree.right);
}

function Node(val) {
  this.val = val;
  this.left = null;
  this.right = null;
}

const tree = new Node(4);  
tree.left = new Node(2);  
tree.right = new Node(7);  
tree.left.left = new Node(1);  
tree.left.right = new Node(3);  
tree.right.left = new Node(6);  
tree.right.right = new Node(9);  

invertBinaryTree(tree);
preorder(tree);

Output:
4 7 9 6 2 3 1

     4
   /   \
  7     2
 / \   / \
9   6 3   1


/************************************** */
const invertTreeUsingStack = (root) => {
    //Base case
    if(root === null){
      return;
    }
    
    //Create a stack and add the root node at the top
    const s = [];
    s.unshift(root);
    
    //iterate till stack has any node
    while(s.length){
      //get top node from stack
      const curr = s.shift();
      
      //Swap left child with right child of the node
      swap(curr);
       
      //Push left child to the stack
      if(curr.left !== null){
        s.unshift(curr.left);
      }
      
      //Push right child to the stack
      if(curr.right !== null){
        s.unshift(curr.right);
      }
    }
  }

  Input:
const preorder = (tree) => {
  if(tree === null){
    return;
  }
  
  console.log(tree.val);
  preorder(tree.left);
  preorder(tree.right);
}

function Node(val) {
  this.val = val;
  this.left = null;
  this.right = null;
}

const tree = new Node(4);  
tree.left = new Node(2);  
tree.right = new Node(7);  
tree.left.left = new Node(1);  
tree.left.right = new Node(3);  
tree.right.left = new Node(6);  
tree.right.right = new Node(9);  

invertBinaryTree(tree);
preorder(tree);

Output:
4 7 9 6 2 3 1

     4
   /   \
  7     2
 / \   / \
9   6 3   1