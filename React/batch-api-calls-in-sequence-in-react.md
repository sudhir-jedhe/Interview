// You are given an info-graphic component where you have to batch call APIs in sequence. Let’s say you have 20 APIs to call, batch call 5 APIs together, and the next 5 after the previous one is done, and so on. The first call will take after a delay of 5 seconds and once all the APIs are executed, reset and start from the beginning.

// Example

Example
Input:
// API calls
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

// [1, 2, 3, 4, 5] // first call after 5 seconds
// [6, 7, 8, 9, 10] // second call
// [11, 12, 13, 14, 15] // third call
// [16, 17, 18, 19, 20] // fourth call
Copy
// We will use a dummy promise that will resolve after 1 second to mimic the API call.

// Then break the array of promises in chunk of 5.
// Use a state to track the indexes of these subarrays, inside the useEffect hook, check if the current index is first then make the call after the 5 seconds, and once all APIs are executed update the state and increment the index. If the index is greater than the subarray size then reset it.
// After the index will update useEffect hook will be invoked and the subsequent calls will be made, thus all the APIs will be executed recursively.
// To make the API calls we will use a helper function that will execute all the promises in parallel and increment the index after the operation.

```js
import { useState, useEffect } from "react";

// helper function to create promise task
// that resolves randomly after some time
const asyncTask = function (i) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(`Completing ${i}`), 1000);
  });
};

// helper function to create sub arrays of given size
const chop = (arr, size = arr.length) => {
  //temp array
  const temp = [...arr];

  //output
  const output = [];
  let i = 0;

  //iterate the array
  while (i < temp.length) {
    //slice the sub-array of given size
    //and push them in output array
    output.push(temp.slice(i, i + size));
    i = i + size;
  }

  return output;
};

const Example = () => {
  // array of promises
  // 20
  const promises = [
    asyncTask(1),
    asyncTask(2),
    asyncTask(3),
    asyncTask(4),
    asyncTask(5),
    asyncTask(6),
    asyncTask(7),
    asyncTask(8),
    asyncTask(9),
    asyncTask(10),
    asyncTask(11),
    asyncTask(12),
    asyncTask(13),
    asyncTask(14),
    asyncTask(15),
    asyncTask(16),
    asyncTask(17),
    asyncTask(18),
    asyncTask(19),
    asyncTask(20),
  ];

  // sub array of promises of size 5
  // 4 sub arrays in total
  const subArrays = chop(promises, 5);

  // to track the indexes of subarrays
  const [index, setIndex] = useState(0);

  // helper function to perform the asyncoperations
  const asyncOperations = async (promises) => {
    try {
      // execute all the promises of sub-array togther
      const resp = await Promise.all(promises);

      // print the output of the current sub array
      console.log(index, resp);
    } catch (e) {
      console.log(e);
    } finally {
      // update the index after the operation
      setIndex(index < subArrays.length - 1 ? index + 1 : 0);
    }
  };

  useEffect(() => {
    // run first promise after 5 second
    if (index === 0) {
      setTimeout(() => {
        asyncOperations(subArrays[index]);
      }, 5000);
    }
    // and the remaining promises after the previous one is done
    else {
      asyncOperations(subArrays[index]);
    }
  }, [index]);

  return <></>;
};

export default Example;

// each after 5 seconds
0(5)[
  ("Completing 1",
  "Completing 2",
  "Completing 3",
  "Completing 4",
  "Completing 5")
];
1(5)[
  ("Completing 6",
  "Completing 7",
  "Completing 8",
  "Completing 9",
  "Completing 10")
];
2(5)[
  ("Completing 11",
  "Completing 12",
  "Completing 13",
  "Completing 14",
  "Completing 15")
];
3(5)[
  ("Completing 16",
  "Completing 17",
  "Completing 18",
  "Completing 19",
  "Completing 20")
];
```
