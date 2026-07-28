import React, { useState, useRef, useEffect, Children } from 'https://esm.sh/react@18.2.0'
import ReactDOM from 'https://esm.sh/react-dom@18.2.0'

// The default case is compulsory for each switch component and the cases can be a primitive value or a function, if it is a function then we will have to evaluate the returned response from the function.

// The JSX elements are converted to a function using babel, and each child is passed a nested object, thus we can access the children and get its name and properties.

// Based on the name, we can check if it is a CustomCase or DefaultCase. If it is DefaultCase we can store it in a variable.

// For the CustomCase children we perform equality checks if they pass, then we will store them in an array.

// Ultimately if the cases are there then we will return them else return the default case.

```js
const CustomSwitch = ({ children, value }) => {
  const cases = [];
  const defaults = [];
  Children.forEach(children, (e) => {
    if (e.type.name === "CustomCase") {
      if (typeof e.props.value === "function") {
        if (e.props.value(value)) {
          cases.push(e);
        }
      } else if (value === e.props.value) {
        cases.push(e);
      }
    } else if (e.type.name === "DefaultCase") {
      defaults.push(e);
    }
  });

  if (cases.length > 0) {
    return cases;
  } else {
    return defaults;
  }
};

const CustomCase = ({ children }) => {
  return <>{children}</>;
};

const DefaultCase = ({ children }) => {
  return <>{children}</>;
};

const App = () => {
  return (
    <>
      <CustomSwitch value="1000">
        <CustomCase value={(e) => e < 10}>
          <div>Hello 20</div>
        </CustomCase>
        <CustomCase value="20">Hello 20</CustomCase>
        <CustomCase value="30">Hello 30</CustomCase>
        <CustomCase value="10">
          <div>Hello 10</div>
        </CustomCase>
        <DefaultCase>Hello 40</DefaultCase>
      </CustomSwitch>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
```
