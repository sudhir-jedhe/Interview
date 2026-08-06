```js
const fs = require("fs");
const path = require("path");

const renameExtensions = (dir) => {
  // Read all files and directories in the current directory
  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${dir}`, err);
      return;
    }

    files.forEach((file) => {
      const fullPath = path.join(dir, file.name);

      if (file.isDirectory()) {
        // If it's a directory, recurse into it
        renameExtensions(fullPath);
      } else if (file.isFile() && path.extname(file.name) === ".js") {
        // If it's a .js file, rename it to .md
        const newFullPath = path.join(
          dir,
          path.basename(file.name, ".js") + ".md",
        );
        fs.rename(fullPath, newFullPath, (err) => {
          if (err) {
            console.error(`Error renaming file: ${fullPath}`, err);
          } else {
            console.log(`Renamed: ${fullPath} -> ${newFullPath}`);
          }
        });
      }
    });
  });
};

// Start from the current directory
renameExtensions(__dirname);
```
