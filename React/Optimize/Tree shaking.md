https://learnersbucket.com/examples/web/tree-shaking-javascript-and-how-it-helps/

Performance is the key to any successful web application, the user wants everything to be loaded fast and developers are relentlessly trying to make the application faster by applying different performance optimization techniques.

What is Tree shaking in JavaScript?
Tree shaking also known as unused exports is a process of removing unused code from the JavaScript bundles.

The term Tree shaking was popularized by Rollup and it was later adopted by Webpack. Both of these are popular bundlers that help you to bundle your javascript files and create a production build that you can use.

Why do we need to do the Tree shaking?
It is extremely important to keep the production build as light as possible so that it will be downloaded, processed and executed faster.

According to a 2018 survey, the average javascript bundle size on mobile devices was 350kb compressed, when uncompressed we will get around 800kb to 900kb file.

After transferring the 350kb compressed file, it will be uncompressed, parsed, and compiled in the browser which is an expensive thing for performance.

With the emergence of modern JavaScript frameworks, the focus of developers are shifted to creating applications in less time and the component-based development architecture has led to the creation of multiple files.

The logic is now abstracted to separate files and imported as and when required, though this has solved lots of issues but it has also given rise to new problems.

Each component can have unused code that the other component may not require, or it may not be used anywhere in the whole application, but when included it will increase the build size, ultimately affecting the performance.

For example, let’s say we have this utility file that holds different utility functions.

// utility.js
export function foo() {
console.log("I am foo");
}

export function bar() {
console.log("I am bar");
}
Copy
Now import the function foo in another file.

// main.js
import { foo } from './utility.js'

foo();
Copy
Assuming that were are here using Webpack as a bundler and that too in the development mode.

In the final build, you will see something like,

/_ 1 _/
/_\*\*/ (function (module, **webpack_exports**, **webpack_require**) {
'use strict';
/_ unused harmony export bar _/
/_ harmony export (immutable) \*/ **webpack_exports**['a'] = foo;
function bar() {
console.log("I am bar");
}

function foo() {
console.log("I am foo");
}
});
Copy
Even though we are not using the bar function it is included in the final build and it is annotated by the comment /_ unused harmony export bar _/ stating this is an unused function.

How does Tree shaking works?
Import and Export modules introduced in ES6 lead to the major breakthrough for Tree Shaking. This is true since “static” modules are required for tree shaking to function.

Before ES6, The dynamic import of CommonJs module was used which allowed importing files conditionally.

var module;

if (condition) {
module = require("foo");
} else {
module = require("bar");
}
Copy
This approach was a hurdle for the Tree Shaking process as it was not possible to decide which module will be imported as the import was happening at the run time, and excluding the files at the build time was not practical.

When ES6 modules were introduced, they implemented Static importing, which means all the files had to be imported globally at the top.

import foo from "foo";
import bar from "bar";
Copy
This really helped in detecting the unused code as it was to determine which code is being used just like the modern IDEs and linters does by highlighting the unused code in your files.

The bundlers like Webpack are so efficient in Tree shaking that they remove almost all the used imports or codes even the properties that are exported but are not imported anywhere.

// person.js
export const Person = {
name: "Prashant Yadav",
passion: "Blogging"
}
Copy
// main.js
import { name } from './person.js';

console.log(name); // person
Copy
As the property passion is not imported, it will be treated as unused code and will be removed in the Tree shaking.

Webpack and Rollup provide inbuilt support for Tree Shaking in the Production mode, you don’t have to worry about this anymore.

Side effects
There are two types of function pure and impure. Pure functions are predictable as they provide the same output for the same input, thus they can be safely removed as unused code.

But the impure functions that have side effects, whose outcome is not predictable cannot be removed.

In the same way, Tree shaking can have side effects and it will have to be mitigated properly.

For example, in the following code example.

let numbers = [1, 2, 3];

console.log(numbers); // (3) [1, 2, 3]

const addNumber = function(num) {
numbers.push(num);
};

addNumber(4);

console.log(numbers); // (4) [1, 2, 3, 4]
Copy
In this example, the numbers array is modified by the addNumber function which is outside is scope, this is called a side effect.

The ES6 modules are also prone to side effects, for example, the use of polyfills, we are not sure when and where the polyfills will be used, thus do we have to remove them or keep them?

One way to solve this is by hinting to the Webpack that our code is side effects free. To do this add the following property in your package.json

// package.json
{
"sideEffects": false
}
Copy
Alternatively, we can alert Webpack about which files have side effects.

// package.json
{
"sideEffects": [
"./polyfills.js"
]
}
Copy
I hope now you have a good understanding of the Tree Shaking process, if you liked the article please share it in your network.
