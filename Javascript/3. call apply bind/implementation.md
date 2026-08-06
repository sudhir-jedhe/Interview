```js
// myCall implementation
Function.prototype.myCall = function(thisContext, ...args) {
    const fn = this;
    const key = Symbol(); // Creating a unique key to avoid property name collision
    thisContext[key] = fn;
    const result = thisContext[key](...args);
    delete thisContext[key]; // Clean up to avoid memory leaks
    return result;
};

// myApply implementation
Function.prototype.myApply = function(thisContext, args) {
    const fn = this;
    const key = Symbol(); // Creating a unique key to avoid property name collision
    thisContext[key] = fn;
    const result = thisContext[key](...args);
    delete thisContext[key]; // Clean up to avoid memory leaks
    return result;
};

// myBind implementation
Function.prototype.myBind = function(thisContext, ...args) {
    const fn = this;
    return function(...innerArgs) {
        return fn.myApply(thisContext, args.concat(innerArgs));
    };
};

/******************************** */

// Polyfill for Function.prototype.call
if (!Function.prototype.call) {
    Function.prototype.call = function(thisArg, ...args) {
        thisArg = thisArg || window;
        const uniqueID = 'call_' + Date.now();
        thisArg[uniqueID] = this;
        const result = thisArg[uniqueID](...args);
        delete thisArg[uniqueID];
        return result;
    };
}

// Polyfill for Function.prototype.apply
if (!Function.prototype.apply) {
    Function.prototype.apply = function(thisArg, argsArray) {
        thisArg = thisArg || window;
        const uniqueID = 'apply_' + Date.now();
        thisArg[uniqueID] = this;
        let result;
        if (Array.isArray(argsArray)) {
            result = thisArg[uniqueID](...argsArray);
        } else {
            result = thisArg[uniqueID]();
        }
        delete thisArg[uniqueID];
        return result;
    };
}

// Polyfill for Function.prototype.bind
if (!Function.prototype.bind) {
    Function.prototype.bind = function(thisArg, ...fixedArgs) {
        const originalFunc = this;
        return function(...args) {
            return originalFunc.apply(thisArg, [...fixedArgs, ...args]);
        };
    };
}

// Example usage of polyfilled methods
function greet(message) {
    console.log(`${message}, ${this.name}!`);
}

const person = { name: 'Alice' };

// Using polyfilled call
greet.call(person, 'Hello'); // Output: "Hello, Alice!"

// Using polyfilled apply
greet.apply(person, ['Hi']); // Output: "Hi, Alice!"

// Using polyfilled bind
const greetMorning = greet.bind(person, 'Good morning');
greetMorning(); // Output: "Good morning, Alice!"
```
