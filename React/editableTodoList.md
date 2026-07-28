```js
export default function App() {
    const [todos, setTodos] = useState([]);
    const inputRef = useRef();

    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        setTodos([
          ...todos,
          { text: e.target.value, completed: false, id: Date.now() }
        ]);
        inputRef.current.value = "";
      }
    };

    // toggle completed
    const handleCompleted = (id) => {
      const updatedList = todos.map((e) => {
        if (e.id === id) {
          e.completed = !e.completed;
        }

        return e;
      });

      setTodos(updatedList);
    };

    // delete item
    const handleDelete = (id) => {
      const filter = todos.filter((e) => e.id !== id);
      setTodos(filter);
    };

    // handle text update
    const handleUpdateText = (id, text) => {
      const updatedList = todos.map((e) => {
        if (e.id === id) {
          e.text = text;
        }

        return e;
      });

      setTodos(updatedList);
    };

    return (
      <div className="App">
        <input type="text" onKeyPress={handleKeyPress} ref={inputRef} />
        {todos.map((e) => (
          <Item
            {...e}
            key={e.id}
            updateCompleted={handleCompleted}
            deleteTodo={handleDelete}
            updateText={handleUpdateText}
          />
        ))}
      </div>
    );
  }


  const Item = ({
    text,
    completed,
    id,
    updateCompleted,
    deleteTodo,
    updateText
  }) => {
    const [edit, setEdit] = useState(false);
    const [editText, setEditText] = useState(text);

    return (
      <div className="item">
        <div class="circle" onClick={() => updateCompleted(id)}>
          {completed ? <span>&#10003;</span> : ""}
        </div>
        <div
          className={completed ? "strike" : ""}
          onDoubleClick={() => {
            if (!completed) {
              setEdit(true);
            }
          }}
        >
          {edit ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => {
                setEditText(e.target.value);
              }}
              onBlur={() => {
                setEdit(false);
                updateText(id, editText);
              }}
            />
          ) : (
            text
          )}
        </div>
        <div class="close" onClick={() => deleteTodo(id)}>
          X
        </div>
      </div>
    );
  };


  .App {
    font-family: sans-serif;
    text-align: center;
    max-width: 300px;
    margin: 0 auto;
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
    border-bottom: 1px solid #000;
  }

  .close {
    cursor: pointer;
    opacity: 0;
    transition: all 0.2s ease;
  }

  .item:hover .close {
    opacity: 1;
  }

  .circle {
    width: 30px;
    height: 30px;
    border-radius: 50px;
    border: 1px solid green;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  input {
    width: 100%;
    padding: 5px;
    font: 1.2em;
    margin-bottom: 20px;
  }

  .strike {
    text-decoration: line-through;
  }
```
