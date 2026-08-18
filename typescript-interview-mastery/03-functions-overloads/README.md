# 03 — Functions & Overloads

Functions are where TypeScript's type checking pays off most directly at every call site, and this module covers the full surface of function typing: parameter and return type annotations, optional/default/rest parameters and their ordering rules, and function overloads — multiple signatures resolving to different return shapes based on the arguments passed. It also covers two genuinely surprising rules that show up constantly in interviews: explicit `this` parameter typing (which catches detached-method bugs at compile time) and `void`-typed callbacks silently accepting functions that return real values, including async functions returning `Promise<void>`. Together these topics form the backbone of typing higher-order functions, event systems, and fluent APIs correctly.

## What's covered

- Parameter and return type annotations, and when to rely on inference vs annotate explicitly
- Optional (`?`), default-valued, and rest parameters, including their required declaration order
- Function overloads: multiple signatures plus one implementation signature, and how TS picks the matching overload
- Explicit `this` parameter typing for methods and standalone functions
- The `void` return type's callback leniency rule, including its async-function footgun
- Typing callback parameters, including generic callbacks and event-name-driven payload inference

## Index

### theory/
- [01-parameters-and-return-types.md](theory/01-parameters-and-return-types.md) — baseline parameter/return annotation rules
- [02-optional-default-rest-parameters.md](theory/02-optional-default-rest-parameters.md) — ?, defaults, ...rest, and ordering
- [03-function-overloads.md](theory/03-function-overloads.md) — overload signatures, implementation signature, resolution order
- [04-this-parameter-typing.md](theory/04-this-parameter-typing.md) — explicit this typing on methods and functions
- [05-void-return-and-callback-typing.md](theory/05-void-return-and-callback-typing.md) — void callback leniency and callback typing

### snippets/
- [01-basic-function-typing.md](snippets/01-basic-function-typing.md) — standalone function plus arrow function
- [02-optional-and-default-params.md](snippets/02-optional-and-default-params.md) — type difference inside the body
- [03-rest-parameters.md](snippets/03-rest-parameters.md) — variadic logger with rest params
- [04-simple-overloads.md](snippets/04-simple-overloads.md) — wrapInArray overloaded by input shape
- [05-this-parameter.md](snippets/05-this-parameter.md) — typed this catching a detached call
- [06-void-callback-pattern.md](snippets/06-void-callback-pattern.md) — void callback accepting Array.push

### output-based/
- [01-overload-order-matters.md](output-based/01-overload-order-matters.md) — overload declaration order determines match
- [02-overload-implementation-not-callable.md](output-based/02-overload-implementation-not-callable.md) — implementation signature isn't public
- [03-void-callback-swallows-async.md](output-based/03-void-callback-swallows-async.md) — async function silently accepted as void callback
- [04-optional-param-required-order.md](output-based/04-optional-param-required-order.md) — required param after optional param error
- [05-this-parameter-detached-call.md](output-based/05-this-parameter-detached-call.md) — this mismatch caught at assignment
- [06-default-param-narrows-type.md](output-based/06-default-param-narrows-type.md) — default param widens to string, not literal
- [07-rest-param-array-type.md](output-based/07-rest-param-array-type.md) — spreading a mismatched array into a rest parameter

### scenarios/
- [01-parse-input-overloads.md](scenarios/01-parse-input-overloads.md) — parseInput returning a different shape per mode
- [02-debounce-preserving-types.md](scenarios/02-debounce-preserving-types.md) — generic debounce preserving parameter types
- [03-event-handler-registration.md](scenarios/03-event-handler-registration.md) — handler payload inferred from event-name literal
- [04-fluent-query-builder.md](scenarios/04-fluent-query-builder.md) — overloaded fluent .where() method

### interview-qa/
- [01-overloads-qa.md](interview-qa/01-overloads-qa.md) — 4 Q&A pairs on overload resolution and design
- [02-parameters-qa.md](interview-qa/02-parameters-qa.md) — 4 Q&A pairs on optional/default/rest/this parameters
- [03-void-and-callbacks-qa.md](interview-qa/03-void-and-callbacks-qa.md) — 4 Q&A pairs on void semantics and callback typing

### problems/
- [01-parse-input-overloaded.md](problems/01-parse-input-overloaded.md) — overloaded parseInput returning a shape per literal argument
- [02-generic-debounce.md](problems/02-generic-debounce.md) — generic debounce<T> preserving wrapped function's parameter types
- [03-typed-event-registration.md](problems/03-typed-event-registration.md) — event-handler registration with inferred handler argument type

### assets/
- [README.md](assets/README.md) — placeholder for original notes
