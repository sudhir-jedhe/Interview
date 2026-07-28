In React, data normally flows from Parent → Child using props. To send data from a Child → Parent, you pass a callback function from the parent to the child, and the child calls that function with the data.

A recent React bootcamp discussion in your enterprise content specifically mentions component communication patterns such as parent-to-child and child-to-parent communication.

```js
Method 1: Parent Callback Function (Most Common)
Parent Component
import { useState } from "react";
import Child from "./Child";

function Parent() {

const [message, setMessage] =
useState("");

const handleDataFromChild = (
childData
) => {

    setMessage(childData);

};

return (

<div>

      <h2>
        Parent:
        {message}
      </h2>

      <Child
        sendData={
          handleDataFromChild
        }
      />

    </div>

);
}

export default Parent;

// Child Component
function Child({ sendData }) {

const handleClick = () => {

    sendData(
      "Hello from Child"
    );

};

return (
<button
      onClick={handleClick}
    >
Send Data
</button>
);
}

export default Child;

```

Flow
Parent
↓
Pass Callback
↓
Child
↓
Calls Callback
↓
Parent Receives Data

Example: Input Box

A common interview question.

```js
// Parent
function Parent() {
  const [name, setName] = useState("");

  return (
    <>
      <h3>
        Name:
        {name}
      </h3>

      <Child onNameChange={setName} />
    </>
  );
}

// Child
function Child({ onNameChange }) {
  return <input onChange={(e) => onNameChange(e.target.value)} />;
}
```

Typing:

Sudhir

Updates the parent state.

Method 2: Child Sends Object
// Child

```js
sendData({
  id: 1,
  name: "Sudhir",
  role: "Lead",
});

// Parent
const handleData = (user) => {
  console.log(user.name);
};
```

Output:

Sudhir

Method 3: Child Sends Form Data
// Child

```js
function Child({ onSubmit }) {
  const [email, setEmail] = useState("");

  const submit = () => {
    onSubmit({
      email,
    });
  };

  return (
    <>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />

      <button onClick={submit}>Submit</button>
    </>
  );
}

// Parent
const handleSubmit = (data) => {
  console.log(data);
};
```

Output:

{
email: "sudhir@test.com"
}

Method 4: Child Triggering Parent Action
// Parent

```js
function Parent() {
  const openModal = () => {
    console.log("Modal Opened");
  };

  return <Child onOpenModal={openModal} />;
}

// Child
function Child({ onOpenModal }) {
  return <button onClick={onOpenModal}>Open</button>;
}
```

Method 5: Multiple Children Update Parent
Parent
├── ChildA
└── ChildB

Both update shared parent state.

```js
const updateCount =
(value) => {

    setCount(
      prev => prev + value
    );

};

Child A:

updateCount(1);

Child B:

updateCount(5);

```

Interview Answer

React follows unidirectional data flow, meaning data flows from parent to child through props. To pass data from a child to a parent, we pass a callback function from the parent as a prop. The child invokes that callback and sends data back to the parent. This pattern is often called lifting state up because the parent owns the state while the child notifies the parent about changes.

Short Example
// Parent
<Child onSave={handleSave} />

// Child
onSave("data from child");

This is the most common and recommended approach in React interviews and production applications.

A React bootcamp recording in your enterprise content discusses parent-to-child communication, child-to-parent communication, and using props to pass data between components. It also references prop drilling when props are passed through multiple component levels.

1. Passing Data from Parent to Child (Props)

Props are the standard mechanism for sending data from a parent component to a child component.

Parent Component

```js
import Child from "./Child";

function Parent() {

const user = {
id: 1,
name: "Sudhir",
role: "Project Lead"
};

return (

<div>
<h2>Parent Component</h2>

      <Child user={user} />
    </div>

);
}

export default Parent;

// Child Component
function Child({ user }) {

return (

<div>
<h3>Child Component</h3>

      <p>Name: {user.name}</p>
      <p>Role: {user.role}</p>
    </div>

);
}

export default Child;

```

Data Flow
Parent
|
| props
↓
Child

React follows a unidirectional data flow model where the parent passes data down through props.

2. What is Lifting State Up?

Lifting State Up means moving state to the nearest common parent when multiple child components need to share or update the same data.

Problem
Parent
├── ChildA
└── ChildB

Both children need access to the same value.

❌ Avoid keeping separate state in both children.

✅ Move the state to the parent.

```js
Before (Wrong)
function ChildA() {
const [count] = useState(0);
}

function ChildB() {
const [count] = useState(0);
}

States are independent.

After (Lift State Up)
Parent
import { useState } from "react";
import ChildA from "./ChildA";
import ChildB from "./ChildB";

function Parent() {

const [count, setCount] =
useState(0);

return (
<>
<ChildA
        count={count}
        setCount={setCount}
      />

      <ChildB
        count={count}
      />
    </>

);
}

ChildA
function ChildA({
count,
setCount
}) {

return (
<button
onClick={() =>
setCount(
count + 1
)
} >
Increment
</button>
);
}

ChildB
function ChildB({ count }) {

return (

<h3>
Count:
{count}
</h3>
);
}

```

Data Flow
Parent (Owns State)
|
├── ChildA (Updates State)
|
└── ChildB (Reads State)

This is called lifting state up because the shared state is moved to the nearest common parent.

3. Callback Props Example

Callback props are the most common way to send data from a child back to a parent.

// Parent Component

```js
import { useState } from "react";
import Child from "./Child";

function Parent() {

const [message, setMessage] =
useState("");

const handleMessage =
(data) => {

      setMessage(data);
    };

return (
<>

<h2>
Message:
{message}
</h2>

      <Child
        onSendMessage={
          handleMessage
        }
      />
    </>

);
}

export default Parent;

// Child Component
function Child({
onSendMessage
}) {

const sendData = () => {

    onSendMessage(
      "Hello from Child"
    );

};

return (
<button
      onClick={sendData}
    >
Send Data
</button>
);
}

export default Child;

```

Flow
Parent
|
| callback prop
↓
Child
|
| invoke callback
↓
Parent receives data

This pattern is commonly used for child-to-parent communication and component interaction.

Real Interview Example – Search Box
Parent

```js
function Parent() {
  const [searchText, setSearchText] = useState("");

  return (
    <>
      <Search onSearch={setSearchText} />

      <ProductList searchText={searchText} />
    </>
  );
}

// Child;
function Search({ onSearch }) {
  return (
    <input placeholder="Search" onChange={(e) => onSearch(e.target.value)} />
  );
}
```

This is a practical example of lifting state up and using callback props together.

Senior React Interview Answer

React uses props to pass data from parent to child. To pass data from child to parent, we use callback props, where the parent passes a function and the child invokes it with data. When multiple components need access to the same state, we lift the state up to their nearest common parent, making the parent the single source of truth and passing data/actions via props.
