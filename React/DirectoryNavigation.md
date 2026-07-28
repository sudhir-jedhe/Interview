```js
import React, { useState } from "react";

// Initial directory structure data.
const directories = [
  {
    id: 1,
    title: "src",
    directories: [
      {
        id: 2,
        title: "formapp",
        directories: [
          {
            id: 3,
            title: "controllers",
            directories: [
              {
                id: 12,
                title: "FormViewController.js",
                directories: [],
              },
              {
                id: 13,
                title: "FormViewController.ts",
                directories: [],
              },
            ],
          },
        ],
      },
      {
        id: 8,
        title: "Nested Comment 3 Depth 1",
        directories: [],
      },
    ],
  },
  {
    id: 9,
    title: "Second Comment",
    directories: [
      {
        id: 10,
        title: "Nested Comment 4 Depth 1",
        directories: [],
      },
    ],
  },
];

const Directory = ({ directory }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDirectory = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ marginLeft: "20px" }}>
      <div
        onClick={toggleDirectory}
        style={{ cursor: "pointer", fontWeight: "bold" }}
      >
        {directory.title}
      </div>
      {isOpen && directory.directories.length > 0 && (
        <div>
          {directory.directories.map((subDirectory) => (
            <Directory key={subDirectory.id} directory={subDirectory} />
          ))}
        </div>
      )}
    </div>
  );
};

function App() {
  const [rootDirectories] = useState(directories);

  return (
    <div>
      {rootDirectories.map((directory) => (
        <Directory key={directory.id} directory={directory} />
      ))}
    </div>
  );
}

// Do not edit below this line
export default App;
```
