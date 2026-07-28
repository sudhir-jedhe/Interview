```js
import React, { useState, useRef, useEffect } from "react";

const TextEditor = () => {
  const [text, setText] = useState("");
  const editorRef = useRef(null);

  // Handle text change (typing)
  const handleChange = (e) => {
    setText(e.target.innerText);
  };

  // Append Text to the document
  const appendText = (newText) => {
    setText((prevText) => prevText + newText);
  };

  // Replace selected text
  const replaceText = (replacementText) => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    if (range) {
      range.deleteContents();
      range.insertNode(document.createTextNode(replacementText));
      setText(editorRef.current.innerText);
    }
  };

  // Handle keydown for navigation
  const handleKeyDown = (e) => {
    const key = e.key;

    // Handle arrow keys and Page Up/Down
    switch (key) {
      case "ArrowUp":
        // You can add custom behavior here if needed
        break;
      case "ArrowDown":
        // Custom behavior for Arrow Down key
        break;
      case "ArrowLeft":
        // Custom behavior for Arrow Left key
        break;
      case "ArrowRight":
        // Custom behavior for Arrow Right key
        break;
      case "PageUp":
        // Handle Page Up (scrolling)
        editorRef.current.scrollTop -= 100; // Adjust as needed
        break;
      case "PageDown":
        // Handle Page Down (scrolling)
        editorRef.current.scrollTop += 100; // Adjust as needed
        break;
      default:
        break;
    }
  };

  // Handle selection and replace
  const handleReplaceClick = () => {
    const replacementText = prompt("Enter replacement text");
    if (replacementText) {
      replaceText(replacementText);
    }
  };

  useEffect(() => {
    // Focus the editor and add the keydown event listener on mount
    editorRef.current.focus();
  }, []);

  return (
    <div>
      <h1>Text Editor</h1>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleChange}
        onKeyDown={handleKeyDown}
        style={{
          border: "1px solid #ccc",
          minHeight: "300px",
          padding: "10px",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {text}
      </div>

      <div>
        <button onClick={() => appendText("New appended text. ")}>
          Append Text
        </button>
        <button onClick={handleReplaceClick}>Replace Text</button>
      </div>
    </div>
  );
};

export default TextEditor;
```
