```
Given an array with two entries, parent and child relation, convert the array to a relation tree object (parent -> child -> grandchild) in JavaScript.

// The input array will contain relations for many ancestries in random order, We must return the array of strings representing different relationships.


Input:
[
  ["lion", "cat"],
  ["cat", "mammal"],
  ["dog", "mammal"],
  ["mammal", "animal"],
  ["fish", "animal"],
  ["shark", "fish"],
];

Output:
[
  "animal -> mammal -> cat -> lion",
  "animal -> mammal -> cat",
  "animal -> mammal -> dog",
  "animal -> mammal",
  "animal -> fish",
  "animal -> fish -> shark"
]

```

```js
const ancestry = (arr) => {

    // aggregate parent / child relation
    const aggregate = (arr) => {
  
      // aggregate the values for easier processing
      return arr.reduce((a, b) => {
        const [child, parent] = b;
  
        // aggregating on child
        a[child] = parent;
  
        return a;
      }, {});
    };
    
    // for a relationship from the aggregated value
    const convert = (obj) => {
      return Object.keys(obj).reduce((a, b) => {
        a.push(getKey(obj, b));
        return a;
      }, []);
    };
  
    // helper function to form the string
    // till the last hierarchy
    const getKey = (obj, key) => {
      // access the
      const val = obj[key];
  
      // the formation can be reversed by chaning the order of the keys
      // child -> parent | parent -> child
      if(val in obj){
        return getKey(obj, val) + " -> " + key;
      }else{
        return val + " -> " + key;
      }
    };
    
    // get the aggregated map
    const aggregatedMap = aggregate(arr);
    
    // return the ancestory 
    return convert(aggregatedMap);
  
  };


  Input:
const arr = [
  ["lion", "cat"],
  ["cat", "mammal"],
  ["dog", "mammal"],
  ["mammal", "animal"],
  ["fish", "animal"],
  ["shark", "fish"],
];

console.log(ancestry(arr));

Output:
[
  "animal -> mammal -> cat -> lion",
  "animal -> mammal -> cat",
  "animal -> mammal -> dog",
  "animal -> mammal",
  "animal -> fish",
  "animal -> fish -> shark"
]

```


To implement the solution, we need to transform an array of parent-child relationships into a hierarchical tree structure. This can be achieved through a few key steps:

### Problem Breakdown:
1. **Aggregate the Relationships**: The input consists of parent-child pairs. We need to organize this information into a structure that allows easy traversal and string formation.
2. **Construct Relationship Chains**: For each individual node (child), we should trace its ancestors all the way to the root, and then construct the corresponding string representation.

### Steps:
1. **Aggregation**: We'll first create an object where each key is a child and its value is the parent.
2. **Trace Ancestors**: For each key (child) in the aggregation, we'll trace its ancestors until we reach the root (i.e., a parent without a further parent).
3. **Generate the Strings**: Once we have the full chain for a child, we'll join them using `" -> "` and collect them.

### Implementation:

```javascript
const ancestry = (arr) => {
  // Aggregate the parent-child relationship into a map
  const aggregate = (arr) => {
    return arr.reduce((map, [child, parent]) => {
      map[child] = parent;
      return map;
    }, {});
  };

  // Helper function to construct the relationship chain
  const getRelationshipChain = (obj, key) => {
    const chain = [];
    let current = key;
    
    // Trace up the tree until we reach the root
    while (current in obj) {
      chain.unshift(current);  // Add the current child at the start
      current = obj[current];  // Move to the parent
    }
    
    chain.unshift(current);  // Add the root
    return chain.join(" -> ");
  };

  // 1. Aggregate the relationships
  const aggregatedMap = aggregate(arr);
  
  // 2. Collect all unique relationships
  const relationships = [];
  const seen = new Set(); // To avoid duplicates
  
  // For every child in the aggregated map, generate the relationship chain
  for (const child in aggregatedMap) {
    const relationship = getRelationshipChain(aggregatedMap, child);
    if (!seen.has(relationship)) {
      relationships.push(relationship);
      seen.add(relationship);  // Mark this chain as seen
    }
  }
  
  return relationships;
};

// Example input
const arr = [
  ["lion", "cat"],
  ["cat", "mammal"],
  ["dog", "mammal"],
  ["mammal", "animal"],
  ["fish", "animal"],
  ["shark", "fish"],
];

// Example usage
console.log(ancestry(arr));
```

### Explanation:

1. **`aggregate` function**:
   - This function takes the input array and converts it into a map (object) where each key is a child, and its value is the parent.

2. **`getRelationshipChain` function**:
   - This function takes the map and a child as input. It traces all the way up to the root (parent with no further parent) and constructs the full relationship chain.

3. **Main Process**:
   - First, we aggregate all parent-child relationships.
   - Then, for each child in the aggregated map, we generate its relationship chain using `getRelationshipChain` and store it in a `seen` set to avoid duplicates.
   
4. **Return the Result**:
   - After collecting all unique chains, we return them as the final result.

### Example Output:
For the input:
```javascript
const arr = [
  ["lion", "cat"],
  ["cat", "mammal"],
  ["dog", "mammal"],
  ["mammal", "animal"],
  ["fish", "animal"],
  ["shark", "fish"],
];
```

The output will be:
```javascript
[
  "animal -> mammal -> cat -> lion",
  "animal -> mammal -> cat",
  "animal -> mammal -> dog",
  "animal -> mammal",
  "animal -> fish",
  "animal -> fish -> shark"
]
```

### Key Points:
- **Efficiency**: The `aggregate` and `getRelationshipChain` functions are both linear in terms of time complexity (`O(n)`), where `n` is the number of relationships in the input.
- **Avoiding Duplicates**: We use a `Set` to track the unique chains and ensure that we only add each unique relationship once.
- **Flexible Input**: The solution works for arbitrary input sizes and arbitrary parent-child relations.

This approach efficiently builds the ancestry tree and generates the relationship strings as required.