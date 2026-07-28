```js
// In this question, you need to create a function that accepts a callback
// restricts its invocation to the provided n times. It is similar to the
// _.before method provided by the Lodash library.

// Calls to the function after the limit should return the value of the last
// invocation. The callback is invoked with the this binding and arguments of
// the created function.

function limit(callback, n) {
  let count = n;
  let context = this;
  let result;
  return function (...args) {
    if (count > 0) {
      result = callback.call(context, ...args);
      count--;
    }
    return result;
  };
}

/******************** */

function limit(callback, n) {
  // write your code below
  let invokationLeft = n;
  let lastInvkoedValue = null;

  return function restricted(args) {
    if (invokationLeft === 0) return lastInvkoedValue;
    if (invokationLeft > 0) {
      invokationLeft--;
      lastInvkoedValue = callback.call(this, args);
      return lastInvkoedValue;
    }
  };
}
