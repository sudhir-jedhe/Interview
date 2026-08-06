```js
Input:
       5
      /  \
     /    \
    2     12
   / \    / \
  /   \  /   \
 1    3 9    21


Key = 21,
key = 3,
key = 1    
         
Output:
predecessor of 21 = 12
predecessor of 3 = 2
predecessor of 1 = null    


const findMaximum = (root) => {
    while(root.right){
      root = root.right;
    }
    
    return root.val;
  }

  const findPredecessorRecursive = (root, pred, key) => {
    //base case
    if(root === null){
      return null;
    }
    
    // if node has same value as the key, 
    // then its predecessor is greatest value node in its left subtree
    if (root.val === key) {
      if (root.left !== null) {
        return findMaximum(root.left);
      }
    }
  
    // if node is greater than the key, recur for left subtree
    else if (key < root.val) {
      return findPredecessorRecursive(root.left, pred, key);
    }
  
    // if node is less than the key, recur for right subtree
    else {
      // update predecessor to current node
      pred = root;
      return findPredecessorRecursive(root.right, pred, key);
    }
  
    return pred ? pred.val : null;
  }


  function Node(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
  
  const tree = new Node(5);  
  tree.left = new Node(2);  
  tree.right = new Node(12);  
  tree.left.left = new Node(1);  
  tree.left.right = new Node(3);  
  tree.right.left = new Node(9);  
  tree.right.right = new Node(21);
  
  console.log(findPredecessorRecursive(tree, null, 9));
  
  Output:
         5
        /  \
       /    \
      2     12
     / \    / \
    /   \  /   \
   1    3 9    21
  
  5


  /************************************ */

  const findMaximum = (root) => {
    while(root.right){
      root = root.right;
    }
    
    return root;
  }

  const findPredecessorIterative = (root, key) => {
    let pred = null;

    while (true) {
      // if node value is greater than key, go to left subtree
      if (key < root.val) {
        root = root.left;
      }

      // if node value is less than key, go to right subtree
      else if (key > root.val) {
        // update predecessor to current node
        pred = root;
        root = root.right;
      }

      // if node has same value as the key, 
      // then its predecessor is greatest value node in its left subtree
      else {
        if (root.left!= null) {
          pred = findMaximum(root.left);
        }
        break;
      }

      // if key doesn't exist in binary tree
      if (root == null)
        return null;
    }

    // return predecessor if any
    return pred ? pred.val : null;
}

function Node(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
  
  const tree = new Node(5);  
  tree.left = new Node(2);  
  tree.right = new Node(12);  
  tree.left.left = new Node(1);  
  tree.left.right = new Node(3);  
  tree.right.left = new Node(9);  
  tree.right.right = new Node(21);
  
  console.log(findPredecessorIterative(tree, null, 9));
  
  Output:
         5
        /  \
       /    \
      2     12
     / \    / \
    /   \  /   \
   1    3 9    21 
  
  5