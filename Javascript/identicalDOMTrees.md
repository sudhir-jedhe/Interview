Problem 1: Identical DOM Trees
Task: Implement a function identicalDOMTrees that checks if two DOM trees are identical. The function takes two DOM nodes as root nodes and returns a boolean.

Here’s my solution:

function compareAttributes(nodeA, nodeB) {
  const attrA = nodeA.attributes;
  const attrB = nodeB.attributes;
  
  if (attrA.length !== attrB.length) {
    return false;
  }
  for (let i = 0; i < attrA.length; i++) {
    const key = attrA[i].name;
    const value = attrA[i].value;
    if (nodeB.getAttribute(key) !== value) {
      return false;
    }
  }
  return true;
}
export default function identicalDOMTrees(nodeA, nodeB) {
  if (nodeA.nodeType !== nodeB.nodeType) {
    return false;
  }
  
  if (nodeA.nodeType === Node.TEXT_NODE) {
    return nodeA.textContent === nodeB.textContent;
  }
  
  if (nodeA.tagName !== nodeB.tagName) {
    return false;
  }
  if (!compareAttributes(nodeA, nodeB)) {
    return false;
  }
  const childrenA = nodeA.childNodes;
  const childrenB = nodeB.childNodes;
  if (childrenA.length !== childrenB.length) {
    return false;
  }
  for (let i = 0; i < childrenA.length; i++) {
    if (!identicalDOMTrees(childrenA[i], childrenB[i])) {
      return false;
    }
  }
  
  return true;
}
This recursive solution checks node types, tag names, attributes, and children. It’s essentially implementing a deep equality check for DOM structures.
