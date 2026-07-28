Write a templating engine that does variables substitution and simple conditionals javascript

```js
function template(strings, ...keys) {
  // Create a function that takes a data object and returns the rendered template.
  const render = (data) => {
    // Create an empty string to store the rendered template.
    let rendered = "";

    // Iterate over the strings and keys, interpolating the values from the data object.
    for (let i = 0; i < strings.length; i++) {
      rendered += strings[i];
      if (keys[i]) {
        rendered += data[keys[i]];
      }
    }

    // Return the rendered template.
    return rendered;
  };

  // Return the render function.
  return render;
}

// Example usage:

const name = "John Doe";
const age = 30;

const templateString = `
    <h1>Hello, ${name}!</h1>
    <p>You are ${age} years old.</p>
    ${age >= 18 ? "<p>You are an adult.</p>" : "<p>You are a minor.</p>"}
  `;

const renderedTemplate = template(templateString, { name, age });

console.log(renderedTemplate);
```
