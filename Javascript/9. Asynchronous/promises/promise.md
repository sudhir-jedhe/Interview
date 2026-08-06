// Promises in JavaScript allow you to execute non-blocking (asynchronous) code and produces a value if the operation is successful or throws an error when the process fails.

// In short, the eventual success (or failure) of an asynchronous operation and its associated value are represented by the Promise object.
```js
const promise = new Promise((resolve, reject) => {
  // time-consuming async operation
  // initial state will be pending
  
  // any one of the below operations can occur at any given time
  
  // this will resolve or fulfill the promise
  resolve(value);
  
  // this will reject the promise
  reject(reason);
});

// this will be invoked when a promise is resolved
promise.then((value) => {
  
});

// this will be invoked when a promise is rejected
promise.catch((value) => {
  
});

// this will always be invoked after any of the above operation 
promise.then((value) => {
  
});

const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("hello");
  }, 1000);
});

promise.then((value) => {
  console.log(value);
});


/*******************************Implement Promise Polyfill  *****************************************/
function MyPromise(executor) {
  if (typeof executor !== "function") {
    throw new TypeError("Executor must be a function.");
  }

  this.state = "pending";
  this.value = undefined;
  this.handlers = [];

  const resolve = (value) => {
    if (this.state === "pending") {
      this.state = "fulfilled";
      this.value = value;
      this.handlers.forEach((handler) => handler.onFulfilled(value));
    }
  };

  const reject = (reason) => {
    if (this.state === "pending") {
      this.state = "rejected";
      this.value = reason;
      this.handlers.forEach((handler) => handler.onRejected(reason));
    }
  };

  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  return new MyPromise((resolve, reject) => {
    const handle = (handler) => {
      try {
        const result = handler(this.value);
        if (result instanceof MyPromise) {
          result.then(resolve, reject);
        } else {
          resolve(result);
        }
      } catch (error) {
        reject(error);
      }
    };

    if (this.state === "fulfilled") {
      handle(onFulfilled);
    } else if (this.state === "rejected") {
      handle(onRejected);
    } else {
      this.handlers.push({
        onFulfilled: (value) => handle(onFulfilled),
        onRejected: (reason) => handle(onRejected),
      });
    }
  });
};

// Example usage:

const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("Promise resolved!");
  }, 1000);
});

promise.then(
  (result) => {
    console.log(result); // Output: Promise resolved!
  },
  (error) => {
    console.error(error);
  }
);

/******************************************************************* */
///Where is rejected property stored for a Promise in JavaScript ?
// shows the rejected state of a promise along with a certain message passed inside the reject() method
// e promise’s internal object’s property named PromiseState,
//  the rejected property of the promise is stored, and later when we have
// implemented catch in order to make our promise fulfilled then that PromiseState property’s value becomes Fulfilled

let new_promise = new Promise((resolve, reject) => {
  resolve("This topic is available on " + "GeeksforGeeks platform...!!");
});

new_promise
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });

let new_promise = new Promise((resolve, reject) => {
  reject("Rejected Promise...!!");
});

new_promise
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });

/******************************************************************** */
//How to call promise inside another promise in JavaScript
// This is a JavaScript Quiz from BFE.dev

console.log(1);

document.body.addEventListener("click", () => {
  console.log(2);
});

Promise.resolve().then(() => {
  console.log(3);
});

setTimeout(() => {
  console.log(4);
}, 0);

console.log(5);

document.body.click();

console.log(6);

/************************************************ */
// Promise is widely used nowadays, hard to think how we handled Callback Hell in the old times.

// Can you implement a MyPromise Class by yourself?

// At least it should match following requirements

// new promise: new MyPromise((resolve, reject) => {})
// chaining : MyPromise.prototype.then() then handlers should be called asynchronously
// rejection handler: MyPromise.prototype.catch()
// static methods: MyPromise.resolve(), MyPromise.reject().
// This is a challenging problem. Recommend you read about Promise thoroughly first.

class MyPromise {
  status = "pending";
  value;
  pendingCallbacks = [];

  constructor(executor) {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
    try {
      executor(this.resolve, this.reject);
    } catch (err) {
      this.reject(err);
    }
  }

  fulFill(onFulfilled) {
    if (typeof onFulfilled !== "function") {
      onFulfilled = () => this.value;
    }
    try {
      const fullfilledRet = onFulfilled(this.value);
      fullfilledRet instanceof MyPromise
        ? this.replacePromise(fullfilledRet)
        : (this.value = fullfilledRet);
    } catch (err) {
      this.status = "rejected";
      this.value = err;
    }
  }

  rej(onRejected) {
    if (typeof onFulfilled === "function" && typeof onRejected !== "function")
      return this;
    if (typeof onRejected !== "function") {
      onRejected = () => this.value;
    }
    try {
      const rejectRet = onRejected(this.value);
      rejectRet instanceof MyPromise
        ? this.replacePromise(rejectRet)
        : (this.value = rejectRet);
      this.status = "fulfilled";
    } catch (err) {
      this.status = "rejected";
      this.value = err;
    }
  }

  then(onFulfilled, onRejected) {
    queueMicrotask(() => {
      switch (this.status) {
        case "fulfilled":
          this.fulFill(onFulfilled);
          break;
        case "rejected":
          if (typeof onRejected === "function") this.rej(onRejected);
          break;
        case "pending":
          this.pendingCallbacks.push({ type: "then", onFulfilled, onRejected });
          return this;
      }
    });
    return this;
  }

  catch(onRejected) {
    queueMicrotask(() => {
      if (this.status === "rejected") {
        this.rej(onRejected);
      } else if (this.status === "pending") {
        this.pendingCallbacks.push({ type: "catch", onRejected });
      }
    });
    return this;
  }

  replacePromise(p) {
    this.pendingCallbacks = p.pendingCallbacks;
    this.value = p.value;
    this.status = p.status;
    for (const key of Object.keys(MyPromise.prototype)) {
      if (typeof this[key] === "function") {
        this[key] = this[key].bind(p);
      }
    }
  }

  resolve(value) {
    this.resolve = () => null;
    this.status = "fulfilled";
    this.value = value;
    for (const { type, onFulfilled, onRejected } of this.pendingCallbacks) {
      if (type === "then") {
        this.fulFill(onFulfilled);
        if (this.status === "rejected") {
          return this.reject(this.reason);
        }
      }
    }
    this.pendingCallbacks.length = 0;
  }

  reject(reason) {
    this.reject = () => null;
    this.status = "rejected";
    this.value = reason;
    for (const { type, onFulfilled, onRejected } of this.pendingCallbacks) {
      if (type === "catch") {
        this.rej(onRejected);
        if (this.status === "fulfilled") {
          return this.resolve(this.value);
        }
      }
    }
    this.pendingCallbacks.length = 0;
  }

  static resolve(value) {
    return new MyPromise((res) => res(value));
  }

  static reject(value) {
    return new MyPromise((res, rej) => rej(value));
  }
}

/***************************************** */

class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.handlers = [];
    try {
      executor(this._resolve.bind(this), this._reject.bind(this));
    } catch (err) {
      this._reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this.handlers.push({
        fulfilled: (value) => {
          if (typeof onFulfilled !== "function") {
            resolve(value);
            return;
          }
          try {
            resolve(onFulfilled(value));
          } catch (err) {
            reject(err);
          }
        },
        rejected: (error) => {
          if (typeof onRejected !== "function") {
            reject(error);
            return;
          }

          try {
            resolve(onRejected(error));
          } catch (err) {
            reject(err);
          }
        },
      });

      this._executeHandlers();
    });
  }

  _executeHandlers() {
    if (this.state === "pending") return;
    for (const handler of this.handlers) {
      queueMicrotask(() => {
        handler[this.state](this.result);
      });
    }

    this.handlers = [];
  }

  _resolve(value) {
    if (this.state !== "pending") return;
    if (value instanceof MyPromise) {
      value.then(this._resolve.bind(this), this._reject.bind(this));
      return;
    }

    this.state = "fulfilled";
    this.result = value;
    this._executeHandlers();
  }

  _reject(error) {
    if (this.state !== "pending") return;
    this.state = "rejected";
    this.result = error;
    this._executeHandlers();
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  static resolve(value) {
    return new MyPromise((resolve) => {
      resolve(value);
    });
  }

  static reject(value) {
    return new MyPromise((resolve, reject) => {
      reject(value);
    });
  }
}

/*************************************************** */
class MyPromise {
  constructor(executor) {
    this._state = "pending";
    this._callbacks = [];
    try {
      executor(this._resolve.bind(this), this._reject.bind(this));
    } catch (err) {
      this._reject(err);
    }
  }

  _resolve(value) {
    if (this._state !== "pending") return;
    this._state = "fulfilled";
    this._result = value;
    this._handleSettled("onFulfilled");
  }

  _reject(err) {
    if (this._state !== "pending") return;
    this._state = "rejected";
    this._result = err;
    this._handleSettled("onRejected");
  }

  _handleSettled(onSettled) {
    queueMicrotask(() => {
      for (const cb of this._callbacks) {
        try {
          const returned = cb[onSettled](this._result);
          if (returned instanceof MyPromise) {
            returned.then(cb.resolve, cb.reject);
          } else {
            cb.resolve(returned);
          }
        } catch (err) {
          cb.reject(err);
        }
      }
    });
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this._callbacks.push({
        onFulfilled: onFulfilled ?? ((value) => value),
        onRejected:
          onRejected ??
          ((err) => {
            throw err;
          }),
        resolve,
        reject,
      });
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise((res) => res(value));
  }

  static reject(err) {
    return new MyPromise((_, rej) => rej(err));
  }
}

/**************************************** */

class CustomPromise {
  constructor(executor) {
      this.state = 'pending'; // initial state
      this.value = undefined; // resolved value
      this.reason = undefined; // rejection reason
      this.onFulfilledCallbacks = []; // array for success callbacks
      this.onRejectedCallbacks = []; // array for failure callbacks

      const resolve = (value) => {
          if (this.state === 'pending') {
              this.state = 'fulfilled';
              this.value = value;
              this.onFulfilledCallbacks.forEach(callback => callback(value));
          }
      };

      const reject = (reason) => {
          if (this.state === 'pending') {
              this.state = 'rejected';
              this.reason = reason;
              this.onRejectedCallbacks.forEach(callback => callback(reason));
          }
      };

      try {
          executor(resolve, reject);
      } catch (error) {
          reject(error); // handle synchronous errors
      }
  }

  then(onFulfilled, onRejected) {
      return new CustomPromise((resolve, reject) => {
          const handleFulfilled = () => {
              try {
                  const result = onFulfilled ? onFulfilled(this.value) : this.value;
                  resolve(result);
              } catch (error) {
                  reject(error);
              }
          };

          const handleRejected = () => {
              try {
                  const result = onRejected ? onRejected(this.reason) : this.reason;
                  resolve(result);
              } catch (error) {
                  reject(error);
              }
          };

          if (this.state === 'fulfilled') {
              handleFulfilled();
          } else if (this.state === 'rejected') {
              handleRejected();
          } else {
              this.onFulfilledCallbacks.push(handleFulfilled);
              this.onRejectedCallbacks.push(handleRejected);
          }
      });
  }

  catch(onRejected) {
      return this.then(null, onRejected);
  }
}

// Example usage
const promise = new CustomPromise((resolve, reject) => {
  setTimeout(() => {
      const success = true; // Change to false to simulate rejection
      if (success) {
          resolve('Promise resolved successfully!');
      } else {
          reject('Promise rejected.');
      }
  }, 1000);
});

promise
  .then(result => {
      console.log(result); // Output on success
      return 'Chained success!';
  })
  .then(chainedResult => {
      console.log(chainedResult); // Output from the chained promise
  })
  .catch(error => {
      console.error(error); // Output on error
  });



  /***************************** */

//   We have to implement a custom function MyPromise that will be similar to the original promise.

// To implement this we will use the observer pattern.

// Use two handlers onSuccess and onError and assign this whenever .then, .catch, .finally methods are called.

// Whenever the resolve or reject methods are invoked, run all the handlers in sequence and pass down the values to the next.



// enum of states
const states = {
  PENDING: 0,
  FULFILLED: 1,
  REJECTED: 2
}

class MyPromise {
  // initialize the promise
  constructor(callback) {
      this.state = states.PENDING;
      this.value = undefined;
      this.handlers = [];

      try {
          callback(this._resolve, this._reject);
      } catch (error) {
          this._reject(error);
      }
  }
  
  // helper function for resolve
  _resolve = (value) => {
      this._handleUpdate(states.FULFILLED, value);
  }
 
  // helper function for reject
  _reject = (value) => {
      this._handleUpdate(states.REJECTED, value);
  }
  
  // handle the state change
  _handleUpdate = (state, value) => {
      if (state === states.PENDING) {
          return;
      }

      setTimeout(() => {
          if (value instanceof MyPromise) {
              value.then(this._resolve, this._reject);
          }

          this.state = state;
          this.value = value;

          this._executeHandlers();
      }, 0)
  }
  
  // excute all the handlers
  // depending on the current state
  _executeHandlers = () => {
      if (this.state === states.PENDING) {
          return;
      }

      this.handlers.forEach((handler) => {
          if (this.state === states.FULFILLED) {
              return handler.onSuccess(this.value);
          }
          return handler.onFailure(this.value);
      })

      this.handlers = [];
  }
 
  // add handlers
  // execute all if any new handler is added
  _addHandler = (handler) => {
      this.handlers.push(handler);
      this._executeHandlers();
  }
  
  // then handler
  // creates a new promise
  // assisgnes the handler
  then = (onSuccess, onFailure) => {
      // invoke the constructore 
      // and new handler
      return new MyPromise((resolve, reject) => {
          this._addHandler({
              onSuccess: (value) => {
                  if (!onSuccess) {
                      return resolve(value);
                  }

                  try {
                      return resolve(onSuccess(value));
                  } catch (error) {
                      reject(error);
                  }
              },
              onFailure: (value) => {
                  if (!onFailure) {
                      return reject(value);
                  } 

                  try {
                      return reject(onFailure(value));
                  } catch (error) {
                      return reject(error);
                  }
              }
          })
      })
  };
  
  // add catch handler
  catch = (onFailure) => {
      return this.then(null, onFailure);
  };
  
  // add the finally handler
  finally = (callback) => {
      // create a new constructor
      // listen the then and catch method
      // finally perform the action
      return new MyPromise((resolve, reject) => {
          let wasResolved;
          let value;

          this.then((val) => {
              value = val;
              wasResolved = true;
              return callback();
          }).catch((err) => {
              value = err;
              wasResolved = false;
              return callback();
          })

          if (wasResolved) {
              resolve(value);
          } else {
              reject(value);
          }
      })
  };
};


Input:
const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("hello");
  }, 1000);
});

promise.then((value) => {
  console.log(value);
});

Output:
"hello"


/**************************** */


promises


// JavaScript is one of the most misunderstood programming languages thanks to its early-stage implementations.

// Everyone has their own claims about whether it is a synchronous programming language or asynchronous, blocking, or non-blocking code, but not everyone is sure about it (even I am not 🤭).

// Let us try to get this thing clear and understand promises and how it works.

// JavaScript is a synchronous programming language. However, callback functions enable us to transform it into an asynchronous programming language.

// And promises are to help to get out of “callback hell” while dealing with the asynchronous code and do much more.

// In simple terms, JavaScript promises are similar to the promises made in human life.

// The dictionary definition of promises is –

// “Assurance that one will do something or that a particular thing will happen.”

// JavaScript promises also work in the same way.

// When a promise is created, there are only two outcomes to that promise.
// Either it will be fulfilled (resolved) or it will be rejected.
// By the time promises are not fulfilled or rejected, they will be in a pending state.
// Promises are fulfilled with a certain value, that value can be further processed (if the value also is a promise) or given back raw.
// Promises are rejected with the reason that caused them to reject.
// After either of the result, we can also perform the next set of operations.


const promise = new Promise((resolve, reject) => {
  // resolve or reject
});

// Promise has three methods available (then, catch, finally) that can be used once it is settled (resolved or rejected). Each method accepts a callback function that is invoked depending on the state of the promise.

// then(onResolvedFn, onRejectedFn) – This will be called either when the promise is rejected or resolved. Depending upon the state, appropriate callback functions will be invoked with the value.
// catch(onRejectFn) – This will be called when the promise is rejected with the reason.
// finally(onFinallyFn) – This will be called everytime after then and catch.

Promise.prototype.then(onResolvedFn, onRejectedFn)

Promise.prototype.catch(onRejectedFn)

Promise.prototype.finally(onFinallyFn)



const promise = new Promise((resolve, reject) => {
  // a promise that will resolve after
  // 5 second
  setTimeout(() => {
     resolve("Hello World!");
  }, 5000);
});


console.log(promise);

/*
Promise { : "pending" }
: "pending"
​: Promise.prototype { … }
*/



setTimeout(() => {
  console.log(promise);
 }, 6000);
 
 /*
 Promise { : "fulfilled", : "Hello World!" }
 : "fulfilled"
 : "Hello World!"
 : Promise.prototype { … }
 */


 promise.then((val) => {
  console.log(val);
});

// "Hello World!" // after the promise is resolved that is after 5 seconds



promise.then((val) => { return "ABC "+ val; }).then((val) => {
  console.log(val);
});

// "ABC Hello World!"


promise.then((val) => {
  return "ABC "+ val;
}).then((val) => {
  console.log(val);
}).finally(() => {
  console.log("task done");
});

// "ABC Hello World!"
// "task done"



const promise = new Promise((resolve, reject) => {
  // a promise that will reject after
  // 5 second
  setTimeout(() => {
     reject("Error 404");
  }, 5000);
});

promise.then(null, (error) => {
console.error("Called from then method", error);
});

// "Called from then method" "Error 404"


promise.catch((error) => {
console.error("Called from catch method", error);
});

// "Called from catch method" "Error 404"


promise.then(null, (error) => {
  return error;
}).then((val) => {
  console.log("I am chained from then", val);
});
// "I am chained from then" "Error 404"

promise.catch((error) => {
  return error;
}).then((val) => {
  console.log("I am chained from catch", val);
});
// "I am chained from catch" "Error 404"



promise.then(null, (error) => {
  return error;
}).then((val) => {
  console.log("I am chained from then", val);
}).finally(() => {
  console.log(" Then block finally done");
});

promise.catch((error) => {
  return error;
}).then((val) => {
  console.log("I am chained from catch", val);
}).finally(() => {
  console.log(" Catch block finally done");
});

"I am chained from then" "Error 404"
"I am chained from catch" "Error 404"
" Then block finally done"
" Catch block finally done"



const promise = Promise.resolve("I am resolved");

async function example(){
  // promise is wrapped in a try-catch block
  // to handle it better
  try{
    const resp = await promise;
    console.log(resp);
  }catch(e){
    console.error(e);
  }finally{
    console.log("Task done");
  }
}

example();

// "I am resolved"
// "Task done"




const promise = Promise.resolve("I am resolved");

// fat arrow
const example = async () => {
  // promise is wrapped in a try-catch block
  // to handle it better
  try{
    const resp = await promise;
    return resp;
  }catch(e){
    console.error(e);
  }finally{
    console.log("Task done");
  }
};

console.log(example());
// Promise { : "fulfilled", : "I am resolved" }
// "Task done"

example().then((val) => {
  console.log(val);
});

//"Task done"
//"I am resolved"