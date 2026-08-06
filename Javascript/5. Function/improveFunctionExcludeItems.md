```js

let items = [
    {color: 'red', type: 'tv', age: 18}, 
    {color: 'silver', type: 'phone', age: 20},
    {color: 'blue', type: 'book', age: 17}
  ] 
  
  // an exclude array made of key value pair
  const excludes = [ 
    {k: 'color', v: 'silver'}, 
    {k: 'type', v: 'tv'}, 
    ...
  ] 


//   function excludeItems(items, excludes) { 
//     excludes.forEach( pair => { 
//       items = items.filter(item => item[pair.k] === item[pair.v])
//     })
   
//     return items
//   } 

  function excludeItems(items, excludes) {
    return items.filter((item) =>
      excludes.every(({k, v}) => item[k] !== v)
    )
  }


  /**
 * @param {object[]} items
 * @excludes { Array< {k: string, v: any} >} excludes
 */

/**
 * @param {object[]} items
 * @param { Array< {k: string, v: any} >} excludes
 * @return {object[]}
 */

```

1. excludeItems loop over every pair of "excludes" array, 
and filters out those items which have the pair.v corresponding to pair.k
However, since we are comparing with item[pair.v], 
since pair.v is supposed to be the value, and not the key, it won't work as intended.

2. No. If the intended input is given, item[pair.v] is incorrect because it is the value and not the key.
So, we are looking for the value among the keys.
Also, the function will INCLUDE those key-value pairs in excludes array, rather than excluding them. 
So, if this is NOT the intended behavior, then (item[pair.k] !== pair.v) will make it work as intended.

3. If the size of items array is M and excludes array is N, then:
time complexity = O(N*M)
space complexity (considering with garbage collection) = O(M)
*/


```js
function excludeItems(items, excludes) {
    const store = new Map();   // Map<k: Set(v)>
    for(let {k, v} of excludes){
      if(!store.has(k)){
        store.set(k, new Set());
      }
      store.get(k).add(v);
    }
  
    return items.filter(x => {
      for(let key in x){
        if(store.has(key) && store.get(key).has(x[key])){
          return false;
        }
      }
      return true;
    })
  }

```


  The `excludeItems` function you've written is designed to filter out items from an array based on key-value pairs from an "excludes" array. Here's a breakdown and explanation of the code and how it works:

### Problem:
You want to filter out items from the `items` array where the values of certain keys match the values provided in the `excludes` array. Each entry in the `excludes` array consists of a key (`k`) and a value (`v`). If an item has the key-value pair in `excludes`, it should be excluded from the result.

### Solution:

You initially had a version that directly used the `filter` function along with `every` for matching conditions, but you then switched to a more optimized approach using a `Map` to store the keys and their excluded values. This method allows for efficient lookups and filtering.

Let's walk through the function:

### Code Explanation:

```javascript
function excludeItems(items, excludes) {
  const store = new Map(); // Map<k: Set(v)>
  
  // Step 1: Populate the store with keys and their corresponding excluded values
  for (let {k, v} of excludes) {
    if (!store.has(k)) {
      store.set(k, new Set());  // Create a new Set for this key if it doesn't exist
    }
    store.get(k).add(v);  // Add the value to the Set for that key
  }

  // Step 2: Filter items
  return items.filter(item => {
    for (let key in item) {
      if (store.has(key) && store.get(key).has(item[key])) {
        return false;  // If the value for this key matches an excluded value, exclude the item
      }
    }
    return true;  // Otherwise, keep the item
  });
}
```

### Detailed Steps:
1. **Creating the Store**:  
   We create a `Map` called `store`. The map's keys are the property names (from `excludes`), and the values are `Set`s of the excluded values. This makes it easier to check if a value is excluded for a particular key.

   - For example, if the `excludes` array contains:
     ```javascript
     [
       {k: 'color', v: 'silver'},
       {k: 'type', v: 'tv'}
     ]
     ```
     After processing the `excludes`, the `store` would look like this:
     ```javascript
     store = new Map([
       ['color', new Set(['silver'])],
       ['type', new Set(['tv'])]
     ]);
     ```

2. **Filtering Items**:  
   The `filter` function iterates over each item in the `items` array. For each item:
   - We check if the key of that item exists in the `store`.
   - If it does, we check if the value of that key exists in the associated `Set` of excluded values.
   - If any key-value pair matches an excluded value, the item is excluded from the result by returning `false` inside the filter function.
   - If no matches are found, the item is included.

3. **Time Complexity**:
   - The outer loop over `items` runs in O(M), where M is the number of items.
   - The inner loop over keys in each item will run in O(K), where K is the average number of keys per item.
   - For each key, checking if it is in the `Map` and if its value is in the `Set` is O(1) on average.
   - So the overall time complexity is O(M * K), where M is the number of items and K is the number of keys in each item.

### Example:

Given the following data:

```javascript
let items = [
  {color: 'red', type: 'tv', age: 18}, 
  {color: 'silver', type: 'phone', age: 20},
  {color: 'blue', type: 'book', age: 17}
];

const excludes = [
  {k: 'color', v: 'silver'},
  {k: 'type', v: 'tv'}
];

let result = excludeItems(items, excludes);
console.log(result);
```

- The first item `{color: 'red', type: 'tv', age: 18}` will be excluded because its `type` is `tv`, which is excluded.
- The second item `{color: 'silver', type: 'phone', age: 20}` will be excluded because its `color` is `silver`, which is excluded.
- The third item `{color: 'blue', type: 'book', age: 17}` will remain because it doesn't match any of the excluded key-value pairs.

The output will be:

```javascript
[{color: 'blue', type: 'book', age: 17}]
```

### Summary:
This implementation uses a `Map` to store the excluded values for each key, making the filtering process more efficient than repeatedly using `Array.filter` with `every`. The time complexity is proportional to the number of items and keys, making it more scalable than checking each exclusion for every item individually.