# Most Asked React Scenario-Based Interview Questions and Their Solutions

I found these questions on LinkedIn and thought, why not share the solutions to create a better resource for interview preparation? So, here are the most commonly asked React scenario-based interview questions and their answers.

## Q1. How to display dynamic HTML data in React?

For this question, fetching some fake product data from an API is a good approach. Here’s the complete solution:

```jsx
import { useEffect, useState } from "react";

export default function DynamicData() {
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const response = await fetch("https://dummyjson.com/products");
      const productsJson = await response.json();
      setData(productsJson.products);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <h1>How to display dynamic HTML data in React?</h1>
      <ul>
        {data.map((product) => (
          <li key={product.id}>{product.title}</li>
        ))}
      </ul>
    </>
  );
}
```

---

## Q2. How do you send data from a parent component to a child component in React?

For simplicity, let's render product data from an array of objects. Below is the complete code:

### **Parent Component**

```jsx
import Product from "./Product";

export default function SendDataFromParentToChild() {
  const products = [
    { id: 1, title: "Rice" },
    { id: 2, title: "Juice" },
  ];

  return (
    <>
      <h1>
        How do you send data from a parent component to a child component in
        React?
      </h1>
      {products.map((product) => (
        <Product key={product.id} data={product} />
      ))}
    </>
  );
}
```

### **Child Component (Product.js)**

```jsx
export default function Product({ data }) {
  return <p>{data.title}</p>;
}
```

Here, we pass each product as props and display the product title.

---

## Q3. How to call a parent component method from a child component in React?

### **Parent Component**

```jsx
import { useState } from "react";
import ChildComponent from "./ChildComponent";

export default function CallParentComponentMethod() {
  const [dataFromChild, setDataFromChild] = useState("");

  const handleReceiveData = (data) => {
    setDataFromChild(data);
  };

  return (
    <>
      <h1>
        How to call a parent component method from a child component in React?
      </h1>
      <p>Data received from child component: {dataFromChild}</p>
      <ChildComponent sendDataToParent={handleReceiveData} />
    </>
  );
}
```

### **Child Component**

```jsx
import { useState } from "react";

export default function ChildComponent({ sendDataToParent }) {
  const [data, setData] = useState("");

  const handleSendDataToParent = () => {
    sendDataToParent(data);
  };

  return (
    <div>
      <input
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
      <button onClick={handleSendDataToParent}>Send Data To Parent</button>
    </div>
  );
}
```

The child component calls the parent’s function to send data.

---

## Q4. How do you access the DOM element in React?

```jsx
import { useRef } from "react";

export default function AccessDomElement() {
  const nameRef = useRef(null);

  const handleClick = () => {
    alert(`Entered Name: ${nameRef.current.value}`);
  };

  return (
    <>
      <input type="text" ref={nameRef} />
      <button onClick={handleClick}>Show Name</button>
    </>
  );
}
```

---

## Q5. How to bind an array/array of objects to a dropdown in React?

### **Using an Array**

```jsx
import { useState } from "react";

export default function Dropdowns() {
  const options = ["Apple", "Mango", "Banana", "Orange", "Grapes"];
  const [fruit, setFruit] = useState("");

  return (
    <div>
      <label>Choose Your Favorite Fruit</label>
      <select value={fruit} onChange={(e) => setFruit(e.target.value)}>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      <p>Your Favorite Fruit is: {fruit}</p>
    </div>
  );
}
```

### **Using an Array of Objects**

```jsx
import { useState } from "react";

export default function DropdownsWithArrayOfObjects() {
  const [fruit, setFruit] = useState("mango");
  const options = [
    { label: "Mango", value: "mango" },
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
  ];

  return (
    <div>
      <label>Choose your favorite fruit!</label>
      <select value={fruit} onChange={(e) => setFruit(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <p>Your favorite fruit is: {fruit}</p>
    </div>
  );
}
```

---

## Q6. How to lazy load a component in React?

### **Component Rendering the Lazy Loaded Component**

```jsx
import React, { Suspense } from "react";

const LazyLoadedComponent = React.lazy(() => import("./LazyLoadedComponent"));

export default function Question6() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyLoadedComponent />
    </Suspense>
  );
}
```

### **Lazy Loaded Component**

```jsx
export default function LazyLoadedComponent() {
  return <h1>This is a lazy-loaded component</h1>;
}
```

---

## Q7. How to display data entered by the user in another textbox?

```jsx
import { useState } from "react";

export default function Question7() {
  const [email, setEmail] = useState("");

  return (
    <div>
      <h1>How to display data entered by the user in another textbox?</h1>
      <div style={{ display: "flex", gap: "2em" }}>
        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea value={email} placeholder="Entered user email" readOnly />
      </div>
    </div>
  );
}
```

---

## Q8. How to loop on array/array of objects in React?

### How to loop over array in React?

```jsx
export default function Question8() {
  return (
    <>
      <h1>How to loop on array in react ?</h1>
      {["Home", "About", "Services", "Contact"].map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </>
  );
}
```

### How to loop over array of objects in React?

```jsx
export default function Question8b() {
  const users = [
    {
      id: 1,
      name: "Rumaisa",
      email: "rumaisa@gmail.com",
    },
    {
      id: 2,
      name: "Muzna",
      email: "muzna@gmail.com",
    },
    {
      id: 3,
      name: "Eshal",
      email: "eshal@gmail.com",
    },
  ];
  return (
    <>
      <h1>How to loop over array of objects in react?</h1>
      {users.map((user) => (
        <div key={user.id}>
          <p>Name : {user.name}</p>
          <p>Email : {user.email}</p>
        </div>
      ))}
    </>
  );
}
```

---

## Q9. How to conditionally render an element or text in react ?

```jsx
import { useState } from "react";

export default function Question9() {
  const [isTextVisible, setIsTextVisible] = useState(false);

  const handleClick = () => {
    setIsTextVisible((prev) => !prev);
  };

  return (
    <>
      <h1> How to conditionally render an element or text in react ?</h1>
      <button onClick={handleClick}>Show Text</button>
      {isTextVisible ? <p>Text is visible</p> : <p>No text to show</p>}
    </>
  );
}
```

---

## Q10. How to change styles based on condition in react ?

```jsx
import { useState } from "react";

export default function Question10() {
  const [color, setColor] = useState("pink");

  const handleClick = () => {
    setColor((prevColor) => (prevColor === "pink" ? "lightblue" : "pink"));
  };

  return (
    <>
      <h1>How to change styles based on condition in react ?</h1>
      <button
        style={{
          backgroundColor: color,
        }}
        onClick={handleClick}
      >
        Click it to change the color of the button
      </button>
    </>
  );
}
```

---

## Q11. How to show and hide data based on condition in react ?

```jsx
import { useState } from "react";

export default function Question11() {
  const [isDataVisible, setIsDataVisible] = useState(true);

  const handleClick = () => {
    setIsDataVisible((prev) => !prev);
  };

  return (
    <>
      <h1>How to show and hide data based on condition in react ?</h1>
      <button onClick={handleClick}>Click me to show and hide data</button>
      {isDataVisible ? (
        <>
          {["Black", "Pink", "Red", "White", "Maroon"].map((color, index) => (
            <p key={index}>{color}</p>
          ))}
        </>
      ) : (
        <p>No data to show</p>
      )}
    </>
  );
}
```

---

## Q12a. Bind array to radio button in react ?

```jsx
import React, { useState } from "react";

function Question12() {
  const options = ["React.js", "Next.js", "React Native", "Node js"];
  const [selectedValue, setSelectedValue] = useState(options[0]);

  const handleRadioChange = (value) => {
    setSelectedValue(value);
  };

  return (
    <>
      <h1>Bind array to radio button in react ?</h1>
      {options.map((option, index) => (
        <div key={index}>
          <input
            type="radio"
            id={option}
            value={option}
            checked={selectedValue === option}
            onChange={() => handleRadioChange(option)}
          />
          <label htmlFor={option}>{option}</label>
        </div>
      ))}
      <p>You checked the : {selectedValue}</p>
    </>
  );
}

export default Question12;
```

## Q12b. Bind array of objects to radio button in react ?

```jsx
import { useState } from "react";

export default function Question12b() {
  const [selectedValue, setSelectedValue] = useState("React.js");
  const options = [
    {
      label: "React.js",
      value: "react.js",
    },
    {
      label: "Next.js",
      value: "next.js",
    },
    {
      label: "Node.js",
      value: "node.js",
    },
    {
      label: "Vue.js",
      value: "vue.js",
    },
  ];

  const handleRadioChange = (value) => {
    setSelectedValue(value);
  };

  return (
    <>
      <h1>Bind array of objects to radio button in react ?</h1>
      {options.map(({ label, value }, index) => (
        <div key={index}>
          <input
            type="radio"
            id={value}
            value={value}
            checked={selectedValue === label}
            onChange={() => handleRadioChange(label)}
          />
          <label htmlFor={value}>{label}</label>
        </div>
      ))}
      <p>You checked the : {selectedValue}</p>
    </>
  );
}
```

---

## Q13. Display radio button data selected by user in another textbox ?

```jsx
import { useState } from "react";

export default function Question13() {
  const [selectedValue, setSelectedValue] = useState("React.js");
  const options = [
    {
      label: "React.js",
      value: "react.js",
    },
    {
      label: "Next.js",
      value: "next.js",
    },
    {
      label: "Node.js",
      value: "node.js",
    },
    {
      label: "Vue.js",
      value: "vue.js",
    },
  ];
  const handleRadioChange = (value) => {
    setSelectedValue(value);
  };
  return (
    <>
      <h1>Display radio button data selected by user in another textbox ?</h1>
      <div>
        {options.map(({ label, value }, index) => (
          <div key={index}>
            <input
              type="radio"
              id={value}
              value={value}
              checked={selectedValue === label}
              onChange={() => handleRadioChange(label)}
            />
            <label htmlFor={value}>{label}</label>
          </div>
        ))}
        <textarea
          placeholder=""
          style={{
            width: "10%",
            marginTop: "0.5em",
          }}
          defaultValue="React.js"
          value={selectedValue}
        />
      </div>
    </>
  );
}
```

---

## Q14. How to call a method when component is rendered for the first time in react ?

```jsx
import { useEffect } from "react";

export default function Question14() {
  const getData = () => {
    console.log("Component rendered for the first time, fetching data");
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <h1>
        How to call a method when component is rendered for the first time in
        react ?
      </h1>
    </>
  );
}
```

---

## Q15. Display keys and values of objects in a loop in react?

```jsx
export default function Question15() {
  const data = {
    name: "Rumaisa",
    age: 21,
  };
  const capitalizeKey = (str) => {
    const newStr = str[0].toUpperCase() + str.slice(1);
    return newStr;
  };
  return (
    <>
      <h1>Display keys and values of objects in a loop in react?</h1>
      {Object.entries(data).map(([key, value], index) => (
        <div key={index}>
          <p>
            {capitalizeKey(key)} : {value}
          </p>
        </div>
      ))}
    </>
  );
}
```

---

## Q16. How to render a component on value change in react ?

```jsx
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  // the component will re-render whenever the count changes
  const handleClick = () => {
    setCount((prev) => prev + 1);
  };

  return (
    <>
      <h1>How to render a component on value change in react ?</h1>
      <button onClick={handleClick}>Click to increment the count</button>
      <p>The count is : {count}</p>
    </>
  );
}
```

## Q17. How to call a method on every re-render of a component in React?

```jsx
import { useState, useMemo } from "react";

export default function Question17() {
  const [count, setCount] = useState(0);

  // here I'm using this just for the explanation, otherwise there's no
  // need to use this useffect hook because the component will re-render
  // whenever the count state changes

  useMemo(() => {
    console.log("Component re-rendered!");
  }, [count]);

  return (
    <>
      <h1>How to call a method on every re-render of a component in React?</h1>
      <button onClick={() => setCount(count + 1)}>Click to Re-render</button>
      <p>Count: {count}</p>
    </>
  );
}
```

---

## Q18. How to add data into useState array in functional component in react ?

```jsx
import { useState } from "react";

export default function Question18() {
  const [todos, setTodos] = useState([
    {
      id: 1,
      title: "Do assignment",
    },
    {
      id: 2,
      title: "Write article",
    },
  ]);
  const handleAddTodo = () => {
    const newTodo = {
      id: 3,
      title: "Do something",
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };
  return (
    <>
      <h1>
        How to add data into useState array in functional component in react ?
      </h1>
      {todos.map((todo) => (
        <li>{todo.title}</li>
      ))}
      <button onClick={handleAddTodo}>Click here to add a todo</button>
    </>
  );
}
```

## Contributing

If you'd like to contribute and add more questions, follow these steps:

1. Fork the repository and edit the README.md file.
2. Make your changes and create a pull request (PR).
3. Your PR will be reviewed, and I'll merge it if everything looks good.

---

More Questions coming soon!
Happy coding & learning! 🤍
