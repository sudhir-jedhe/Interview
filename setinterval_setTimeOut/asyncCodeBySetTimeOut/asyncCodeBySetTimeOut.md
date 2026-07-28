// 1. Show the execution of 3 asynchronous block of code, one after the other in sequence
// The asynchronous block of code can be a function which executes asynchronously
// The execution of such function can be simulated using setTimeout to with delay
// and execute different blocks of code inside each

```js
function asyncFunc() {
  console.log("Started asyncFunc1");
  //Async1 code
  setTimeout(() => {
    console.log("Completed asyncFunc1");
    console.log("Started asyncFunc2");
    //Async2 code
    setTimeout(() => {
      console.log("Completed asyncFunc2");
      console.log("Started asyncFunc3");
      //Async3 function code
      setTimeout(() => {
        console.log("Completed asyncFunc3");
      }, 1000);
    }, 2000);
  }, 3000);
}
asyncFunc();

// Notes

// The nested blocks of statements shown in the comments which get executed one after the other in sequence
```
