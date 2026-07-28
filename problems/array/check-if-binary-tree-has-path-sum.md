```js
const hasPathSum = (root, sum) => {
  //Tracker
  const tracker = { b: false };

  //Traverse the tree
  //Start with 0 and keep adding to it
  traverse(root, 0, sum, tracker);

  return tracker["b"];
};

const traverse = (root, sum, match, found) => {
  //If no root then return
  if (!root) {
    return;
  }

  //Add the value with current sum
  sum += root.val;

  //If sum is present and is leaf node then mark true
  if (sum === match && !root.left && !root.right) {
    found["b"] = true;
  }

  //Traverse the left and right child nodes
  traverse(root.left, sum, match, found);
  traverse(root.right, sum, match, found);
};

//Assume that this input array will be converted to tree.
Input: hasPathSum([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], 22);

Output: true;

Given a binary tree and a number check if there is a path in a binary tree from root to leaf (leaf is a node with no children) such that adding their sum equals to that number. If yes then return true else return false.