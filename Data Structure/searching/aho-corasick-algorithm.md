/*
The Aho-Corasick algorithm is a powerful string-searching algorithm that efficiently identifies 
the occurrences of multiple patterns within a given text. Developed by Alfred V. Aho and 
Margaret J. Corasick in 1975, this algorithm is specifically designed for scenarios where 
the simultaneous detection of multiple patterns is essential.

Approach
Create a trie data structure to store patterns and each node in the trie represents a character in a pattern.
For each pattern, traverse the trie and create nodes as needed. Also, store the output associated with
 each pattern in the trie node.
Construct the failure function for the trie and set failure pointers to efficiently handle mismatches.
Traverse the trie based on the input text. Use the failure function to handle mismatches efficiently.
Also, identify pattern matches and invoke a callback function.
Create an instance of the Aho-Corasick class. Add patterns, build the failure function, and search for 
matches in a given text.
Example: The code implements the Aho-Corasick algorithm to efficiently search for multiple patterns in a 
passed string.

*/

class AhoCorasickNode {
  constructor() {
    this.children = {};
    this.output = [];
    this.failure = null;
  }
}

class AhoCorasick {
  constructor() {
    this.root = new AhoCorasickNode();
  }

  addPattern(pattern, output) {
    let node = this.root;

    for (const char of pattern) {
      if (!node.children[char]) {
        node.children[char] = new AhoCorasickNode();
      }
      node = node.children[char];
    }

    node.output.push(output);
  }

  buildFailureFunction() {
    const queue = [];

    // Set failure for depth 1 nodes to root
    for (const child in this.root.children) {
      this.root.children[child].failure = this.root;
      queue.push(this.root.children[child]);
    }

    while (queue.length > 0) {
      const currentNode = queue.shift();

      for (const key in currentNode.children) {
        const child = currentNode.children[key];
        queue.push(child);

        let failureNode = currentNode.failure;

        while (failureNode !== null && !failureNode.children[key]) {
          failureNode = failureNode.failure;
        }

        child.failure = failureNode
          ? failureNode.children[key] || this.root
          : this.root;

        child.output = child.output.concat(child.failure.output);
      }
    }
  }

  search(text, callback) {
    let currentNode = this.root;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      while (currentNode !== null && !currentNode.children[char]) {
        currentNode = currentNode.failure;
      }

      currentNode = currentNode
        ? currentNode.children[char] || this.root
        : this.root;

      for (const output of currentNode.output) {
        callback(i - output.length + 1, output);
      }
    }
  }
}

// Example:

const ac = new AhoCorasick();

ac.addPattern("Geek", "Geek");
ac.addPattern("eksf", "eksf");
ac.addPattern("forGeeks", "forGeeks");
ac.addPattern("eek", "eek");

ac.buildFailureFunction();

const text = "GeeksforGeeks";

ac.search(text, (index, output) => {
  console.log(`Pattern "${output}" found at index ${index}`);
});
