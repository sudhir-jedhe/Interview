```js
Learn how to find the element with k frequency in an array.

Given an array of elements find an element which has occurred K times. If there are no such element then return -1.

Input:
[2, 4, 4, 3, 3, 7, 7, 7, 8] 3
[1, 2, 3, 4, 4] 3
Output:
7
-1


const elementWithKFrequency = (arr, k) => {
    //Store the number counts in object
    const count = arr.reduce((a, b) => {
        if (!a[b]) {
        a[b] = 1;
        } else {
        a[b]++;
        }

        return a;
    }, {});

    //Find the number with k count
    for (const [key, value] of Object.entries(count)) {
        if (value === k) {
        return key;
        }
    }

    return -1;
};


Input:
console.log(elementWithKFrequency([1, 1, 1, 2, 2, 2, 3, 3, 4], 2));
console.log( elementWithKFrequency([2, 2, 2, 3, 3, 3, 2, 5, 5, 5, 6, 6], 2));

Output:
3
6