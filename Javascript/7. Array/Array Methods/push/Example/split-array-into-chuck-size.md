```js
export function chunkArray(arr, size) {
  const chunks = [];
  let index = 0;

  while (index < arr.length) {
    chunks.push(arr.slice(index, index + size));
    index += size;
  }

  return chunks;
}

const arr = [1, 2, 3, 4, 5, 6, 7, 8];
const size = 3;
console.log(chunkArray(arr, size)); // Output: [[1, 2, 3], [4, 5, 6], [7, 8]]
```


function chunk(items, size) {
  const result = []
  if (size < 1) return result
  
  let buffer = []
  
  for (let i = 0; i < items.length; i++) {
    buffer.push(items[i])
    
    if (buffer.length === size) {
      result.push(buffer)
      buffer = []
    }
  }
  
  if (buffer.length > 0) {
    result.push(buffer)
  }
  
  return result
}


function chunk(items, size) {
  if (!size || ! items) return []
  const res = items.reduce((acc, val) => {
    if (acc.length === 0 || acc[acc.length-1].length === size) {
      acc.push([])
    }
    acc[acc.length-1].push(val)
    return acc
  }, [])
  return res
}


function chunk(items, size) {
  if (size === 0) return [];
  const res = [];
  for (let i=0; i<items.length; i=i+size) {
    res.push(items.slice(i, i+size));
  }
  return res;
}