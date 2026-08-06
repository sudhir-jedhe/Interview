The function `join` is designed to merge two arrays of objects, where each object has a unique `id`. If two objects from different arrays have the same `id`, the properties of the object from `arr2` will override the properties from `arr1`. If the `id` does not already exist in the destination array, it will simply be added.

### Function Explanation:
1. **Map Setup**: 
   We create a `Map` where the `key` is the `id` of each object, and the `value` is the object itself. This allows quick access to the objects by `id` during the merge.
   
2. **Merging**: 
   We iterate over `arr2`, and for each element, we check if the `id` exists in the `Map`. 
   - If it exists, we merge the existing object in the map with the current object from `arr2` using the spread operator.
   - If it doesn't exist, we simply add the object from `arr2` into the `Map`.

3. **Sorting**: 
   After the merge, the `Map` is converted into an array and sorted by `id` to ensure the order is maintained based on the `id`.

### Example Walkthrough:

#### Example 1:
```js
arr1 = [
    {"id": 1, "x": 1},
    {"id": 2, "x": 9}
], 
arr2 = [
    {"id": 3, "x": 5}
]
```
- **Step 1**: `arr1` is converted into a map: 
   ```js
   Map = {
       1: {"id": 1, "x": 1},
       2: {"id": 2, "x": 9}
   }
   ```
- **Step 2**: For each element in `arr2` (e.g., `{"id": 3, "x": 5}`), since no object with `id: 3` exists in the map, it is added:
   ```js
   Map = {
       1: {"id": 1, "x": 1},
       2: {"id": 2, "x": 9},
       3: {"id": 3, "x": 5}
   }
   ```
- **Step 3**: The map is converted to an array and sorted:
   ```js
   [
       {"id": 1, "x": 1},
       {"id": 2, "x": 9},
       {"id": 3, "x": 5}
   ]
   ```

#### Example 2:
```js
arr1 = [
    {"id": 1, "x": 2, "y": 3},
    {"id": 2, "x": 3, "y": 6}
], 
arr2 = [
    {"id": 2, "x": 10, "y": 20},
    {"id": 3, "x": 0, "y": 0}
]
```
- **Step 1**: `arr1` is converted into a map:
   ```js
   Map = {
       1: {"id": 1, "x": 2, "y": 3},
       2: {"id": 2, "x": 3, "y": 6}
   }
   ```
- **Step 2**: For each element in `arr2`:
   - `{"id": 2, "x": 10, "y": 20}`: Since an object with `id: 2` already exists, we merge the two objects, and the values from `arr2` override `arr1`:
     ```js
     Map = {
         1: {"id": 1, "x": 2, "y": 3},
         2: {"id": 2, "x": 10, "y": 20}
     }
     ```
   - `{"id": 3, "x": 0, "y": 0}`: Since no object with `id: 3` exists, we add it:
     ```js
     Map = {
         1: {"id": 1, "x": 2, "y": 3},
         2: {"id": 2, "x": 10, "y": 20},
         3: {"id": 3, "x": 0, "y": 0}
     }
     ```
- **Step 3**: The map is converted to an array and sorted:
   ```js
   [
       {"id": 1, "x": 2, "y": 3},
       {"id": 2, "x": 10, "y": 20},
       {"id": 3, "x": 0, "y": 0}
   ]
   ```

#### Example 3:
```js
arr1 = [
    {"id": 1, "b": {"b": 94}, "v": [4, 3], "y": 48}
], 
arr2 = [
    {"id": 1, "b": {"c": 84}, "v": [1, 3]}
]
```
- **Step 1**: `arr1` is converted into a map:
   ```js
   Map = {
       1: {"id": 1, "b": {"b": 94}, "v": [4, 3], "y": 48}
   }
   ```
- **Step 2**: For each element in `arr2`:
   - `{"id": 1, "b": {"c": 84}, "v": [1, 3]}`: Since an object with `id: 1` already exists, we merge the two objects. For the `b` and `v` keys, the values from `arr2` override `arr1`, but the `y` key is retained from `arr1`:
     ```js
     Map = {
         1: {"id": 1, "b": {"c": 84}, "v": [1, 3], "y": 48}
     }
     ```
- **Step 3**: The map is converted to an array and sorted:
   ```js
   [
       {"id": 1, "b": {"c": 84}, "v": [1, 3], "y": 48}
   ]
   ```

### Code Walkthrough:
```ts
function join(arr1: any[], arr2: any[]): any[] {
    const d = new Map(arr1.map(x => [x.id, x]));  // Step 1: Map arr1 by `id`
    
    arr2.forEach(x => {  // Step 2: Merge arr2 into the map
        if (d.has(x.id)) {
            d.set(x.id, { ...d.get(x.id), ...x });  // Merge with existing object if id matches
        } else {
            d.set(x.id, x);  // Otherwise, add the new object
        }
    });

    return [...d.values()].sort((a, b) => a.id - b.id);  // Step 3: Convert Map to array and sort by `id`
}
```

### Time Complexity:
- **Mapping `arr1`**: `O(n)` where `n` is the length of `arr1`.
- **Iterating over `arr2`**: `O(m)` where `m` is the length of `arr2`.
- **Sorting the result**: `O((n + m) log(n + m))` for the final sorting.

Thus, the overall time complexity is **O((n + m) log(n + m))** due to the sorting step.

### Conclusion:
The function is an efficient way to merge two arrays of objects by `id`, allowing for the merging of properties, and handles cases where there are no duplicates, as well as cases where objects with the same `id` are merged.