```js
Input:
          1
       /     \
     2        3
   /   \     /  \
  4     5   6    7
                  \
                   8

The right view is 1, 3, 7, 8


1                    -- level 0 (arr[0] = 1)
/     \
2        3                -- level 1 (arr[1] = 3)
/   \     /  \ 
4     5   6    7             -- level 2 (arr[2] = 7)
           \
            8           -- level 3 (arr[3] = 8)





            const rightSideViewRecursive = (root) => {
  //Store the result  
  const result = []
  
  //use level-order traversal to store the last element at each node
  const traverse = (node,level) => {
      if (!node) return;
      result[level] = node.val
      traverse(node.left,level+1)
      traverse(node.right,level+1)
  }
  
  traverse(root,0)
  return result;
};


Input:
function Node(val) {
  this.val = val;
  this.left = null;
  this.right = null;
}

tree = new Node(1); 
tree.left = new Node(2); 
tree.right = new Node(3); 
tree.left.left = new Node(4); 
tree.left.right = new Node(5); 
tree.right.left = new Node(6); 
tree.right.right = new Node(7); 
tree.right.left.right = new Node(8); 

console.log(rightSideViewRecursive(tree));

Output:
[1, 3, 7, 8]



const rightSideViewIterative = (root) => {
    if(!root) return [];
    let queue = [root], level = [];
    const res = [];
    
    //iterate for all the levels of the tree
    while(queue.length) {
        //Get the current level
        const curr = queue.shift();
        
        //Store its left and right values in temp variable
        if(curr.left) level.push(curr.left);
        if(curr.right) level.push(curr.right);
        
        //If the current node is last then store its value in result
        //And reuse the left and right child as new tree
        if(!queue.length) {
            res.push(curr.val);
            queue = level;
            level = [];
        }
    }
  
    //Return the result
    return res;
};

Input:
function Node(val) {
  this.val = val;
  this.left = null;
  this.right = null;
}

tree = new Node(1); 
tree.left = new Node(2); 
tree.right = new Node(3); 
tree.left.left = new Node(4); 
tree.left.right = new Node(5); 
tree.right.left = new Node(6); 
tree.right.right = new Node(7); 
tree.right.left.right = new Node(8); 

console.log(rightSideViewIterative(tree));

Output:
[1, 3, 7, 8]