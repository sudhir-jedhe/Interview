# Interview Q&A: Generators and Template Syntax

**Q: What does `yield*` do inside a generator?**
It delegates iteration to another iterable (often another generator), pulling and re-yielding each of its values in sequence as if they were yielded directly by the outer generator, and it also forwards the delegate's return value as the result of the `yield*` expression itself. It's the standard way to compose generators without manually looping and re-yielding.

**Q: What is a tagged template literal?**
Syntax where a function is placed immediately before a template literal (`` fn`...` ``); instead of producing a plain string, the literal is parsed into an array of string chunks plus the interpolated expression values, both passed as arguments to the function. It's used for things like safe SQL query building, CSS-in-JS libraries, and i18n string formatting.
