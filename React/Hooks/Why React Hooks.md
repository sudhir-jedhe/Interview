Why React Hooks?
Hooks are a new addition to React 16.8 to provide state management and side-effects in function components.

Earlier, only class components were used for local state management and lifecycle methods. These lifecycle methods have been essential for introducing side-effects, such as data fetching, listeners and many more. This led to a lot of refactoring from functional stateless components to stateful class components whenever a functional component needed to use state or lifecycle methods. With Hooks, we can use features like state and effects without actually any component transformation. We will talk more about useState and useEffect while building the app later in the post.
import React, { useState, useEffect } from "react";

```js
function Counter() {
  // Using state in a functional component
  const [count, setCount] = useState(0);

  // Using effects in a functional component
  useEffect(() => {
    document.title = `Counter: ${count}`;
  }, [count]);

  render(
    <div>
      <p>You have clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>,
  );
}
```

Reusable stateful behaviour between React Components is a bit tricky. Though, it can be done using patterns like render props and higher order components. Using such patterns, components have to be restructured which makes code harder to understand and maintain. With Hooks, stateful logic can be extracted from the components into their custom hooks which allows them to be tested independently and can be reused.
Let's start building!
We are going to build a simple Todo App in this blog post. Demo for the same can be seen here and Github repo here.

```js
import React, { useState } from 'react';

function Todos() {
  // Creating a todos state variable
  const [todos, setTodos] = useState({
    1552406885681: {
      todo: 'Complete this blog post',
      isComplete: false
    }
  });

  // Rendering the todos
  return <div className="wrapper">
    <ul id="todos">
      {Object.entries(todos).map(([key, value]) => <li key={key}>{value.todo}</li>);}
    </ul>
  </div>
  ;
}
```

Defining state with useState()
As mentioned earlier, now we can do state management in functional components and to do so React provides us with a hook called useState.

It takes an initial state. Unlike the class component's state, useState's initial state need not be an object. It can be a string, boolean, object or any other possible value in JavaScript.

```js
const [count, setCount] = useState(0); // number
const [name, setName] = useState("Yomesh"); // string
const [fetched, setFetched] = useState(false); // boolean
const [todos, setTodos] = useState({}); // object
```

It declares a "state variable" whose value persists between the function calls. It provides the same capabilities as this.state.
It returns a pair of values: the current state and a function that updates it. We get these return values via array destructing const [todos, setTodos] = useState({});
In the above code example, we created a state variable called todos with default value as our current todos.

Fetching Todos
Earlier, we have provided default values to our todos but what if we have to fetch those todos from a remote API? In such cases, we need something like componentDidMount for data fetching like we used to do in class components.

React provides us with a hook called useEffect which can be used directly into a component and provides a way to mimic these lifecycle methods and go beyond that. When we talk about effects, we are referring to things like data fetching, updates to the DOM, event listeners and likes. Let's see this in action step by step.

```js
import React, { useState, useEffect } from "react";

const TODOS = {
  1552406885681: {
    todo: "Complete this blog post",
    isComplete: false,
  },
};

function Todos() {
  // Creating a todos state variable
  const [todos, setTodos] = useState({});

  // Setting up an effect
  useEffect(function () {
    // fetch(REMOTE_URL).then(response => setTodos(response));

    // mocking API call
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(TODOS), 2000);
    }).then((response) => {
      // Updating state variable
      setTodos(response);
    });
  });

  // Rendering the todos
  return (
    <div className="wrapper">
      <ul id="todos">
        {Object.keys(todos).map((key) => {
          const value = todos[key];
          return <li key={key}>{value.todo}</li>;
        })}
      </ul>
    </div>
  );
}
```

useEffect always run after the render. So, they are non-blocking in nature. Consider them like giving React an instruction and executing it after the DOM has rendered. It takes two arguments: a function that will be executed after the render and a dependency array (More on this below).

In the above code snippet:

We are setting up an effect that is used to fetch data from an API (mocking). So, initially, our todos will be empty and we won't be seeing anything. After the initial render, useEffect will execute and data is being fetched.

An effect hook should return nothing or a cleanup function. That's why you may see the following error in your developer console log - Warning: An Effect function must not return anything besides a function, which is used for clean-up. It looks like you wrote useEffect(async () => ...) or returned a Promise. Instead, you may write an async function separately and then call it from inside the effect. We can fix this via

...
// Setting up an effect

```js
useEffect(function() {
  function fetchData() {
    // fetch(REMOTE_URL).then(response => setTodos(response));

    // mocking API call
    new Promise((resolve, reject) => {
      setTimeout(() => resolve(TODOS), 2000);
    }).then(response => {
      // Updating state variable
      setTodos(response);
    });
  }

  fetchData();
});
...
}
```

This is all good and fine but if you execute the code so far, you will see that fetchData will be called after every render as useEffect executes after every renders too! Check out this sandbox to see what I mean.
To avoid this infinite loop and for optimisation, useEffect takes a second argument which is called a dependency array. In this array, we can mention all the variables on whose value change -- execution of useEffect depends. Suppose, we have a use-case where we need to display a list of items, fetched from a remote API, based on an input query. In this case, the input query would be part of the dependency array. Check out this sandbox for a live example.

But in our app, we only need to fetch data once after the initial load. We can do that by providing an empty array as the second argument to useEffect. By doing so, our effect will only run once after the initial render, acting just like componentDidMount here.

...

```js
useEffect(function () {
  {
    /* some processing */
  }
}, []); // acts like componentDidMount
```

...
Now, the data fetching part is done. Focus on the code below
.then(response => setTodos(response));
As we discussed earlier, const [todos, setTodos] = useState({}) provides us two return values. Second value is a function which allows us to update the state variable. Here, it is same as doing this.setState({ todos: response }) in a class component.

Adding Loader and Empty State
We will add Loader and Empty components. Initially, there would be no todos so Loader will be displayed and if the fetch returns no result then the Empty state will be displayed.

...

```js
function Loader() {
  return <div id="loader">Loading...</div>;
}

function Empty() {
  return <div id="empty">No todos found...</div>;
}

function Todos() {
  const [fetched, setFetched] = useState(false);
  const [todos, setTodos] = useState({});
  const keys = Object.keys(todos);

  useEffect(function () {
    function fetchData() {
      new Promise((resolve, reject) => {
        setTimeout(() => resolve(TODOS), 2000);
      }).then((response) => {
        setFetched(true);
        setTodos(response);
      });
    }

    fetchData();
  }, []);

  function renderContent() {
    if (!fetched) {
      return <Loader />;
    } else if (!keys.length) {
      return <Empty />;
    }
    return (
      <ul id="todos">
        {keys.map((key) => {
          const value = todos[key];
          return <li key={key}>{value.todo}</li>;
        })}
      </ul>
    );
  }

  return <div className="wrapper">{renderContent()}</div>;
}
```

Refactoring...
So far so good but we can take it up a notch. People coming from the realm of Redux will enjoy it.

Welcome useReducer!
It is an alternative to useState. It accepts three arguments -- reducer, initialState, init function, and returns current state and dispatch function to update that state.

As per React documentation,

useReducer is usually preferable to useState when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one.

const [state, dispatch] = useReducer(reducer, initialState, init);
Let's refactor some of our code now.

```js
import React, { useEffect, useReducer } from 'react';

const TODOS = {
  1552406885681: {
    todo: 'Complete this blog post',
    isComplete: false
  }
};

const initialState = {
  fetched: false,
  todos: {}
};

function reducer(state, action) {
  switch (action.type) {
    case 'REPLACE_TODOS':
      return { ...state, fetched: true, todos: action.payload };
    default:
      return state;
  }
}
...
function Todos() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { fetched, todos } = state;
  const keys = Object.keys(todos);

  useEffect(function() {
    function fetchData() {
      new Promise((resolve, reject) => {
        setTimeout(() => resolve(TODOS), 2000);
      }).then(response => {
        dispatch({
          type: 'REPLACE_TODOS',
          payload: response
        });
      });
    }

    fetchData();
  }, []);
  ...
}
```

We can use dispatch deep inside the component hierarchy and update our state, just like good old plain Redux Actions!

Let's Save, Complete and Delete
In this section, we are going to add the following functionalities

Saving a new todo
Here, we declare a new state variable task and will add a form. We are going to capture the new todo in the state variable and add it to the list via dispatching a new action when the form submits.

...

```js
const [task, setTask] = useState('');

function reducer(state, action) {
  switch (action.type) {
    ...
    case 'ADD_TODO':
      return {
        ...state,
        todos: {
          ...state.todos,
          ...action.payload
        }
      }
    ...
  }
}
...
function saveHandler(e) {
  e.preventDefault();
  dispatch({
    type: 'ADD_TODO',
    payload: {
      [+new Date()]: {
        todo: task,
        isComplete: false
      }
    }
  });
  setTask('');
}

return (
  <div className="wrapper">
    <form method="POST" onSubmit={saveHandler}>
      <input type="text" onChange={e => setTask(e.target.value)} value={task} placeholder="What needs to be done?" />
      <input type="submit" value="Add" />
    </form>

...
```

Marking a todo as complete
Now, we are going to add some controls to the to-do list. I have highlighted the added code. As you can see, we have added a Check FontAwesomeIcon. Upon clicking the check control, action is dispatch which updates our current state and sets the isComplete flag to true for that particular todo.

You can always refer to this sandbox for a live example to visualize it better.

...

```js
function reducer(state, action) {
  switch (action.type) {
    ...
    case "COMPLETE_TODO":
      return {
        ...state,
        todos: {
          ...state.todos,
          [action.payload.id]: {
            ...state.todos[action.payload.id],
            isComplete: true
          }
        }
      };
    ...
  }
}
function controlHandler(id, operation) {
  switch (operation) {
    case "complete":
      dispatch({
        type: "COMPLETE_TODO",
        payload: {
          id
        }
      });
      break;
    default:
      console.log("This is odd.");
  }
}
...
  function renderContent() {
    ...
    return (
      <ul id="todos">
        {keys.map(key => {
          ...
          return (
            <li key={key}>
              <p className={isComplete ? "complete" : ""}>
                {todo}
              </p>
              <div class="controls">
                {!isComplete ? (
                  <FontAwesomeIcon
                    icon="check"
                    title="Mark as Complete"
                    className="control-icon"
                    onClick={() =>
                      controlHandler(key, "complete")
                    }
                  />
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    );
  }
```

...
Removing it once it has served its purpose
Just like complete functionality, we will add a delete icon with a click handler that filters the todos and update our state. Below is the complete working code of our app. I have highlighted the part added for removing a to-do item.

You can always refer to this sandbox for a live example to visualize it better.

/_
Author: Yomesh Gupta (https://www.twitter.com/yomeshgupta)
_/

```js
import React, { useEffect, useState, useReducer } from "react";
import ReactDOM from "react-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./styles.css";

library.add(faCheck, faTrash);

const initialState = {
  fetched: false,
  todos: {},
};

const TODOS = {
  1552406885681: {
    todo: "Complete this blog post",
    isComplete: false,
  },
  1552406885682: {
    todo: "Add everything to this blog post",
    isComplete: false,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "REPLACE_TODOS":
      return { ...state, fetched: true, todos: action.payload };
    case "UPDATE_TODOS": {
      return { ...state, todos: action.payload };
    }
    case "ADD_TODO":
      return {
        ...state,
        todos: {
          ...state.todos,
          ...action.payload,
        },
      };
    case "COMPLETE_TODO":
      return {
        ...state,
        todos: {
          ...state.todos,
          [action.payload.id]: {
            ...state.todos[action.payload.id],
            isComplete: true,
          },
        },
      };
    default:
      return state;
  }
}

function Loader() {
  return <div id="loader">Loading...</div>;
}

function Empty() {
  return <div id="empty">Seems kind of empty here...</div>;
}

function Todos() {
  const [task, setTask] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);
  const { fetched, todos } = state;
  const keys = Object.keys(todos);

  // Setting up an effect
  useEffect(function () {
    function fetchData() {
      new Promise((resolve, reject) => {
        // mocking API call
        setTimeout(() => resolve(TODOS), 2000);
      }).then((response) => {
        // Updating state variable
        dispatch({
          type: "REPLACE_TODOS",
          payload: response,
        });
      });
    }
    fetchData();
  }, []);

  function saveHandler(e) {
    e.preventDefault();
    dispatch({
      type: "ADD_TODO",
      payload: {
        [+new Date()]: {
          todo: task,
          isComplete: false,
        },
      },
    });
    setTask("");
  }

  function controlHandler(id, operation) {
    switch (operation) {
      case "complete":
        dispatch({
          type: "COMPLETE_TODO",
          payload: {
            id,
          },
        });
        break;
      case "delete": {
        const clonedTodos = { ...todos };
        delete clonedTodos[id];
        dispatch({
          type: "UPDATE_TODOS",
          payload: clonedTodos,
        });
        break;
      }
      default:
        console.log("This is odd.");
    }
  }

  function renderContent() {
    if (!fetched) {
      return <Loader />;
    } else if (!keys.length) {
      return <Empty />;
    }
    return (
      <ul id="todos">
        {keys.map((key) => {
          const value = todos[key];
          const { isComplete, todo } = value;
          return (
            <li key={key}>
              <p className={isComplete ? "complete" : ""}>{todo}</p>
              <div class="controls">
                {!isComplete ? (
                  <FontAwesomeIcon
                    icon="check"
                    title="Mark as Complete"
                    className="control-icon"
                    onClick={() => controlHandler(key, "complete")}
                  />
                ) : null}
                <FontAwesomeIcon
                  icon="trash"
                  title="Delete Todo"
                  className="control-icon"
                  onClick={() => controlHandler(key, "delete")}
                />
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="wrapper">
      <form method="#" onSubmit={saveHandler}>
        <input
          type="text"
          onChange={(e) => setTask(e.target.value)}
          value={task}
          placeholder="What needs to be done?"
        />
        <input type="submit" value="Add" title="Add Todo" />
      </form>
      {renderContent()}
    </div>
  );
}
const rootElement = document.getElementById("root");
ReactDOM.render(<Todos />, rootElement);
```

Finally, our app is complete! Phew! However, we can go ahead and implement more functionalities like error handling, more controls, due date etc! There are more hooks provided by React itself and we can even write our custom hooks! Let's keep that for part two of this blog post

```

```
