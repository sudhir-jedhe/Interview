File explorer
Overview
Build a recursive file explorer tree view with expandable and collapsible folders, similar to VS Code's sidebar.
Requirements
Render a tree of files and folders from a given FileNode[] data structure.
Each folder manages its own expand/collapse state independently.
Folder contents are hidden by default and shown when the folder is clicked.
Clicking a folder again hides its contents (toggle behavior).
Support nested folder expansion (folders within folders).
Files are not clickable — only folders expand/collapse.
Use indentation to visually represent the depth of each node in the tree.
Use the provided ChevronIcon, FolderIcon, and FileIcon components from Components.tsx.
Display the title "File explorer" at the top of the page.
Notes
Use a recursive React component to render the tree structure.
Give each node its own useState for expand/collapse — this avoids needing a global state object.
Calculate indentation based on the depth passed to each recursive call.
When rendering children of an expanded folder, pass depth + 1 to the recursive TreeNode.
Use the ChevronIcon, FolderIcon, and FileIcon helpers from Components.tsx — they handle the visual states.
Files should render a spacer instead of a chevron so their names align with folder names.
Add aria-expanded to folder buttons for accessibility.
Tests
renders the app title
renders root-level files and folders
hides folder contents by default
shows folder contents when folder is clicked
hides folder contents when folder is clicked again
supports nested folder expansion
allows expanding public folder independently

# File Explorer (Recursive Tree View) – Complete React Solution

This is a very common **React machine-coding interview** question that tests:

```text
✅ Recursion
✅ Tree Rendering
✅ Local State Management
✅ Expand / Collapse
✅ Accessibility
✅ Component Composition
```

---

## Types

```tsx
export interface FileNode {
  name: string;
  isFolder: boolean;
  children?: FileNode[];
}
```

---

## Example Data

```tsx
export const files: FileNode[] = [
  {
    name: "src",
    isFolder: true,
    children: [
      {
        name: "components",
        isFolder: true,
        children: [
          {
            name: "Button.tsx",
            isFolder: false,
          },
          {
            name: "Modal.tsx",
            isFolder: false,
          },
        ],
      },
      {
        name: "App.tsx",
        isFolder: false,
      },
    ],
  },

  {
    name: "public",
    isFolder: true,
    children: [
      {
        name: "favicon.ico",
        isFolder: false,
      },
    ],
  },

  {
    name: "package.json",
    isFolder: false,
  },
];
```

---

# TreeNode.tsx

```tsx
import { useState } from "react";

import type { FileNode } from "./types";

import { ChevronIcon, FolderIcon, FileIcon } from "./Components";

interface Props {
  node: FileNode;
  depth?: number;
}

export default function TreeNode({ node, depth = 0 }: Props) {
  const [expanded, setExpanded] = useState(false);

  const paddingLeft = depth * 20;

  /*
    FILE
  */
  if (!node.isFolder) {
    return (
      <div
        style={{
          paddingLeft,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {/* spacer */}
        <span
          style={{
            width: "16px",
          }}
        />

        <FileIcon />

        <span>{node.name}</span>
      </div>
    );
  }

  /*
    FOLDER
  */
  return (
    <div>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((prev) => !prev)}
        style={{
          paddingLeft,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
        }}
      >
        <ChevronIcon expanded={expanded} />

        <FolderIcon />

        <span>{node.name}</span>
      </button>

      {expanded &&
        node.children?.map((child) => (
          <TreeNode key={child.name} node={child} depth={depth + 1} />
        ))}
    </div>
  );
}
```

---

# FileExplorer.tsx

```tsx
import TreeNode from "./TreeNode";
import { files } from "./data";

export default function FileExplorer() {
  return (
    <div>
      <h1>File explorer</h1>

      {files.map((node) => (
        <TreeNode key={node.name} node={node} />
      ))}
    </div>
  );
}
```

---

# App.tsx

```tsx
import FileExplorer from "./FileExplorer";

export default function App() {
  return <FileExplorer />;
}
```

---

# CSS (Optional)

```css
button {
  font: inherit;
}

.file-node {
  display: flex;
  align-items: center;
  gap: 8px;
}

.folder-btn {
  cursor: pointer;
  background: transparent;
  border: none;
}

.tree-indent {
  padding-left: 20px;
}
```

---

# Why This Passes the Tests

### 1. Renders Title

```tsx
<h1>File explorer</h1>
```

✅ Test: renders the app title

---

### 2. Root Files Visible

```tsx
src;
public;
package.json;
```

render immediately.

✅ Test: renders root-level files and folders

---

### 3. Contents Hidden Initially

```tsx
const [expanded] = useState(false);
```

Children are hidden initially.

✅ Test: hides folder contents by default

---

### 4. Expand Folder

```tsx
setExpanded((prev) => !prev);
```

Shows children.

✅ Test: shows folder contents when folder is clicked

---

### 5. Collapse Folder

Same toggle logic.

✅ Test: hides folder contents when folder is clicked again

---

### 6. Nested Folders

```tsx
<TreeNode node={child} depth={depth + 1} />
```

Recursive rendering handles:

```text
src
 └─ components
     └─ Button.tsx
```

✅ Test: supports nested folder expansion

---

### 7. Independent State

Each folder has:

```tsx
const [expanded, setExpanded];
```

inside its own TreeNode.

Meaning:

```text
src      → open

public   → closed
```

or

```text
src      → closed

public   → open
```

independently.

✅ Test: allows expanding public folder independently

---

# Interview Explanation

## Why Recursion?

Tree structures naturally map to recursion.

```text
Folder
 ├─ File
 ├─ File
 └─ Folder
      ├─ File
      └─ File
```

Each node can render:

```tsx
TreeNode;
```

for its children.

---

## Complexity

### Render

```text
O(n)
```

where:

```text
n = total nodes
```

---

### Expand Folder

```text
O(children)
```

Only renders visible children.

---

## Senior-Level Enhancements

```text
✅ Virtualisation

✅ Lazy Loading

✅ Keyboard Navigation

✅ Context Menu

✅ Rename

✅ Drag & Drop

✅ Multi Select

✅ Search

✅ File Icons by Extension

✅ Persist Expanded State
```

### Senior Interview Answer

> I would model the explorer as a recursive tree where each folder owns its own expand/collapse state. A recursive `TreeNode` component renders both files and folders, passing `depth + 1` to nested children for indentation. This keeps the implementation simple, scalable, and avoids unnecessary global state.
