```js
Input : 
                 1
               /   \
              2     3
             / \     \
            4   5     6             
Output : 1 2 4

Input :
        1
      /   \
    2       3
      \   
        4  
          \
            5
             \
               6
Output :1 2 4 5 6


let max_level = 0;
const leftViewRecursive = (node, level) => {
  if(node === null){
    return;
  }
  
  if(max_level < level){
    console.log(node.val);
    max_level = level;
  }
  
  leftViewRecursive(node.left, level+1);
  leftViewRecursive(node.right, level+1);
}

Input:
function Node(val) {
  this.val = val;
  this.left = null;
  this.right = null;
}

let tree = new Node(4);  
tree.left = new Node(5); 
tree.right = new Node(2); 
tree.left.left = new Node(3); 
tree.left.right = new Node(1);
tree.right.right = new Node(6);

leftViewRecursive(tree, 1);

Output:
4
5
3


/***************************** */

const leftViewIterative = (node) => {
    if(node === null){
      return;
    }
    
    let q = [];
    
    q.unshift(node);
    
    q.unshift(null);
    
     while (q.length > 0)  
      { 
          let temp = q[q.length - 1]; 
    
          if (temp !== null) 
          { 
    
              // Prints first node 
              // of each level 
              console.log(temp.val); 
    
              // add children of all nodes at 
              // current level 
              while (q[q.length - 1] !== null) 
              { 
                  // If left child is present 
                  // add into queue 
                  if (temp.left !== null) 
                      q.unshift(temp.left); 
    
                  // If right child is present 
                  // add into queue 
                  if (temp.right !== null) 
                      q.unshift(temp.right); 
    
                  // remove the current node 
                  q.pop(); 
    
                  temp = q[q.length - 1]; 
              } 
    
              // add delimiter 
              // for the next level 
              q.unshift(null); 
          } 
    
          // remove the delimiter of 
          // the previous level 
          q.pop(); 
      } 
    
  }

  Input:
function Node(val) {
  this.val = val;
  this.left = null;
  this.right = null;
}

let tree = new Node(4);  
tree.left = new Node(5); 
tree.right = new Node(2); 
tree.left.left = new Node(3); 
tree.left.right = new Node(1);
tree.right.right = new Node(6);
leftViewIterative(tree);

Output:
4
5
3