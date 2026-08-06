implementing a Promise Pool. A Promise Pool is a technique used to limit the number of concurrently executing promises, which can be useful in cases such as API rate-limiting or managing a limited number of resources.

Problem statement
Given an array of asynchronous functions functions and a pool limit n, you need to create an asynchronous function promisePool. This function should return a promise that resolves when all the input functions resolve.

The pool limit is defined as the maximum number of promises that can be pending at once. promisePool should begin the execution of as many functions as possible and continue executing new functions when old promises resolve. promisePool should execute functions[i], then functions[i + 1], then functions[i + 2], etc. When the last promise resolves, promisePool should also resolve.

You can assume all functions never reject. It is acceptable for promisePool to return a promise that resolves any value.


Example 1:
Input:
```js
functions = [
  () => new Promise(res => setTimeout(res, 300)),
  () => new Promise(res => setTimeout(res, 400)),
  () => new Promise(res => setTimeout(res, 200))
]
n = 2
Output: [[300, 400, 500], 500]

Example 2:
Input:

functions = [
  () => new Promise(res => setTimeout(res, 300)),
  () => new Promise(res => setTimeout(res, 400)),
  () => new Promise(res => setTimeout(res, 200))
]
n = 5
Output: [[300, 400, 200], 400]

Example 3:
Input:

functions = [
  () => new Promise(res => setTimeout(res, 300)),
  () => new Promise(res => setTimeout(res, 400)),
  () => new Promise(res => setTimeout(res, 200))
]
n = 1
Output: [[300, 700, 900], 900]