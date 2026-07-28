```js
Given a binary tree, print the top view of it.

The top views of the binary tree are the list of visible nodes when the tree is viewed from the top.

Input:
       5
      /  \
     /    \
    2     12
   / \    / \
  /   \  /   \
 1    3 9    21

Output:
1,2,5,12,21


We can solve this by traversing the tree recursively and using a Hashing to track the nodes.

Use the relative horizontal distance from the root node to the current nodes as a key and a pair of node value and current level as value and store them in hashmap.
Traverse the tree by performing pre-order traversal and check if the current level of the node is less than the maximum level seen so far for the same horizontal distance as current node’s or current horizontal distance is seen for first time, then update the value at the current distance in the map.
Do the same by recurring the left subtree by decreasing the distance by 1 and increasing the level by 1 and for right subtree increase the distance by 1 as well as the level by 1.


const printTopView = (root, dist, level, map) => {
    //base case
    if(root === null){
      return;
    }
    
    //if horizontal distance is not already cached or
    //current level < maximum level for same horizontal distance 
    if (!map[dist] || level < map[dist].level) {
      // update value and level for current distance
      map[dist] = {val: root.val, level: level};
    }
  
    // decrease horizontal distance and increase level by 1
    // for left subtree
    printTopView(root.left, dist - 1, level + 1, map);
  
    // increase both level and horizontal distance by 1
    // for right subtree
    printTopView(root.right, dist + 1, level + 1, map);
  }


  Input:
function Node(val){
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

//Use object as hashmap
const map = {};

//Get the top view nodes
printTopView(tree, 0, 0, map);

//Sort the keys in hashmap in ascending order and print them
Object.keys(map).sort((a, b) => a - b).forEach(e => {
  console.log(map[e].val);
});

Output:
1
2
5
12
21
