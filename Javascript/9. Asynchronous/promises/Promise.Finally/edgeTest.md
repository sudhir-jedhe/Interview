```js
//This will be resolved with undefined
Promise.resolve(2)
  .then(
    () => {},
    () => {}
  )
  .then((val) => {
    console.log(val);
  });
// undefined

//This will be resolved with 2
Promise.resolve(2)
  .finally(() => {})
  .then((val) => {
    console.log(val);
  });
// 2

//Similarly, This will be fulfilled with undefined
Promise.reject(3)
  .then(
    () => {},
    () => {}
  )
  .then((val) => {
    console.log(val);
  });
// undefined

//This will be fulfilled with 3
Promise.reject(3)
  .finally(() => {})
  .then((val) => {
    console.log(val);
  });
// 3

//A throw (or returning a rejected promise) in the finally callback will reject
//the new promise with the rejection reason specified when calling throw()
Promise.reject(2)
  .finally(() => {
    throw "Parameter is not a number!";
  })
  .then((val) => {
    console.log(val);
  });
// 'Parameter is not a number!'
