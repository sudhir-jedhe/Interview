Regular (Named) Functions
The classic `function greet() {}`.
Great for reusability, hoisting, and clear stack traces.

👉 Function Expressions
`const greet = function() {}`
I explained how these give us more control and are often used in callbacks and closures.

Then I leveled up.

👉 Arrow Functions
`() => {}`
I didn’t just say “shorter syntax.”
I explained lexical `this`, why it matters in React, event handlers, and async logic.
That’s when the discussion got interesting.

👉 Higher-Order Functions
Functions that take other functions as arguments or return them.
I connected this to real code:
`map`, `filter`, `reduce`, middleware, and even custom hooks in React.
Now we were talking about functional programming patterns, not just functions.

👉 Callback Functions
Instead of defining it plainly, I explained how callbacks evolved from
➡️ synchronous callbacks
➡️ async callbacks
➡️ promises
➡️ async/await
Showing how JavaScript handles asynchronous behavior through functions.
Then I added depth.

👉 Pure Functions
Functions with no side effects and predictable output.
I tied this to state management, reducers, and performance optimization.

👉 IIFE (Immediately Invoked Function Expressions)
I mentioned how they were used earlier for scope isolation before ES6 modules.

👉 Currying Functions
Functions returning functions:
`add(2)(3)`
I explained how currying helps in partial application and reusable logic, especially in utility libraries.

👉 Unary Functions
Functions that accept only one argument.
I connected this to how methods like `map` can behave unexpectedly when extra parameters are passed — a subtle but impressive detail.
