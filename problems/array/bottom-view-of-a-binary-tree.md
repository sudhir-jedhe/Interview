```js
Given a binary tree, print the bottom view of it.

A node will be included in the bottom view if it is the bottom-most node at its horizontal distance from the root.

The horizontal distance is calculated using the following rule.

Distance of root is always 0.
For left child the distance is the parent distance minus 1 and that of right child is distance of the parent plus 1.
Print the later one in level traversal in case where there are multiple bottom-most nodes for a horizontal distance from the root.

For example in the below example 3 and 9 are both at the same level 0 so we print the later one which is 9.


Input:
       5
      /  \
     /    \
    2     12
   / \    / \
  /   \  /   \
 1    3 9    21

Output:
1, 2, 9, 12, 21



We can solve this problem by traversing the tree and use a Hashmap to calculate and store the horizontal distance.

Use the relative horizontal distance from the root node to the current node as key and a pair of node value and current level as a value and store them in the map.
Traverse the tree in pre-order traversal way and check if the current level of the node is more than or equal to the maximum level seen so far for the same horizontal distance as current node’s or current horizontal distance is seen for first time, then update the value at the current distance in the map.
Do the same by Recurring the left subtree by decreasing the distance by 1 and increasing the level by 1 and for right subtree increase the distance by 1 as well as the level by 1.

const printBottomView = (root, dist, level, map) => {
    //base case
    if(root === null){
      return;
    }
    
    // if the horizontal distance is not already cached
    // or the current level >= maximum level from the cached distance
    if (!map[dist] || level >= map[dist].level) {
      // update value and level for current distance
      map[dist] = {val: root.val, level: level};
    }
  
    // decrease horizontal distance and increasing level by 1
    // for left substree
    printBottomView(root.left, dist - 1, level + 1, map);
  
    // increase both level and horizontal distance by 1
    // for right subtree
    printBottomView(root.right, dist + 1, level + 1, map);
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
printBottomView(tree, 0, 0, map);

//Sort the keys in hashmap in ascending order and print them
Object.keys(map).sort((a, b) => a - b).forEach(e => {
  console.log(map[e].val);
});

Output:
1
2
9
12
21
