```js
import React, { useState } from "react";

const TextHighlighter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [text, setText] = useState(
    "React JS is a powerful JavaScript library for building user interfaces.",
  );

  // Function to highlight the search term in the text
  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text
      .split(regex)
      .map((part, index) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <strong key={index}>{part}</strong>
        ) : (
          part
        ),
      );
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search text..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <p>{highlightText(text, searchTerm)}</p>
    </div>
  );
};

export default TextHighlighter;
```
